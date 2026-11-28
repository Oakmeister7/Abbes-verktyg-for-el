#!/usr/bin/env python3
"""Hämtar rubriker till "El nyhetsflöde" och skriver nyheter.js.

Regler (bestämda av Abbe 2026-11-28):
- Bara öppna källor som utgivaren själv lägger ut som flöde eller pressida. Inga nycklar, inga betaltjänster.
- Bara rubrik, källa, tid och länk sparas. Aldrig artikeltext eller ingress.
- En källa vars villkor förbjuder detta, eller där villkoren är okända, hämtas inte (se VANTAR nedan).
- robots.txt respekteras: säger den nej hoppas källan över.

Körs av GitHub Actions (.github/workflows/uppdatera.yml) varje timme. `--torr` skriver bara en sammanfattning.
Skriver window.NYHETER = { hamtat, kallor: [{id, namn, ok, antal, fel}],
                           poster: [{id, rubrik, lank, kalla, kid, tid, tidtyp, kat, poang}] }
tidtyp: publicerad = flödets klockslag, datum = sidan anger bara dag, upptackt = första gången posten sågs.
"""
import hashlib, html, http.cookiejar, json, os, re, sys, time, urllib.error, urllib.request, urllib.robotparser
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from urllib.parse import urljoin, urlparse

ROT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
UT = os.path.join(ROT, "nyheter.js")
TORR = "--torr" in sys.argv
UA_NAMN = "abbes-verktyg-nyheter"
UA = {"User-Agent": "Mozilla/5.0 (compatible; %s/1.0; +https://github.com/Oakmeister7/Abbes-verktyg-for-el)" % UA_NAMN,
      "Accept": "application/rss+xml,application/atom+xml,application/xml,text/xml,text/html,*/*",
      "Accept-Language": "sv-SE,sv;q=0.9"}
# Ei:s webbplats kräver cookies (annars omdirigeringsslinga) – samma lösning som i ei.py.
OPENER = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
BEHALL_DAGAR = 21
MAX_POSTER = 150
MAX_PER_KALLA = 40

# typ: rss = flöde, lista = pressida där länkarna läses ur sidan.
# filter: True = källan skriver om mycket annat, bara rubriker om el tas med.
KALLOR = [
    {"id": "regeringen", "namn": "Regeringen", "typ": "rss", "filter": True, "vikt": 1,
     "url": "https://www.regeringen.se/Filter/RssFeed?filterType=Taxonomy&filterByType=FilteredPressReleasesList"},
    {"id": "svk", "namn": "Svenska kraftnät", "typ": "rss", "filter": False, "vikt": 1,
     "url": "https://via.tt.se/rss/releases/latest?publisherId=3235391"},
    # Svenska kraftnäts allmänna nyheter är mest byggprojekt (vägar, samråd) – därför filter.
    {"id": "svk-nyheter", "namn": "Svenska kraftnät", "typ": "rss", "filter": True, "vikt": 0,
     "url": "https://www.svk.se/Api/RSSFeed/GetNewsByCategory?name=Allm%C3%A4nnanyheter"},
    {"id": "energiforetagen", "namn": "Energiföretagen", "typ": "rss", "filter": False, "vikt": 0,
     "url": "https://via.tt.se/rss/releases/latest?publisherId=3237229"},
    {"id": "konsumentverket", "namn": "Konsumentverket", "typ": "rss", "filter": True, "vikt": 0,
     "url": "https://www.konsumentverket.se/api/feed/rss/pressmeddelanden/"},
    {"id": "konsumentverket-nyheter", "namn": "Konsumentverket", "typ": "rss", "filter": True, "vikt": 0,
     "url": "https://www.konsumentverket.se/api/feed/rss/nyheter/"},
    {"id": "riksdagen", "namn": "Riksdagen, näringsutskottet", "typ": "rss", "filter": True, "vikt": 0,
     "url": "https://data.riksdagen.se/dokumentlista/?sok=el&doktyp=bet&org=NU&sort=datum&sortorder=desc&utformat=rss"},
]

# Saknas: Energimarknadsinspektionens allmänna nyheter. Nyhetslistan på ei.se byggs i webbläsaren och
# finns inte i sidans källkod (test 2026-11-28). Tills en öppen lista hittas täcks Ei av morgonkollen.

# Hämtas INTE. Flödena svarar tekniskt (test 2026-11-28) men villkoren är okända eller säger nej.
# Flytta en källa till KALLOR först när Abbe har bestämt.
VANTAR = [
    ("SVT Nyheter", "https://www.svt.se/nyheter/rss.xml", "villkor okända"),
    ("Aftonbladet", "https://rss.aftonbladet.se/rss2/small/pages/sections/senastenytt/", "villkor okända"),
    ("Expressen", "https://feeds.expressen.se/nyheter/", "villkor okända"),
    ("DN", "https://www.dn.se/rss/", "villkor okända"),
    ("SvD", "https://www.svd.se/feed/articles.rss", "villkor okända"),
    ("TV4", "https://www.tv4.se/rss", "användarvillkoren: endast eget och privat bruk"),
    ("Sveriges Radio Ekot", "https://api.sr.se/api/rss/program/83?format=145", "robots.txt säger nej"),
]

REL = re.compile(
    r"(?i)\b(el|elen|elens)\b|\bel(pris|nät|stöd|skatt|avtal|marknad|områd|bolag|handel|räkning|brist|system|försörjning|kris|kund|använd"
    r"|produktion|förbrukning|export|import|kabel|ledning|certifikat|kostnad|intensiv|ektrifier)"
    r"|kärnkraft|reaktor|energiskatt|effektavgift|nätavgift|högkostnadsskydd|svenska kraftnät|energimarknadsinspektionen"
    r"|vindkraft|vattenkraft|kraftledning|effektbrist|energipris|energistöd|energikris|kraftvärme|stamnät|gasprisstöd"
    r"|kraftsystem|kraftproduktion|energiföretag")

KATEGORIER = [
    ("Kärnkraft", r"kärnkraft|reaktor|ringhals|forsmark|oskarshamn"),
    ("Politik och stöd", r"stöd|skatt|högkostnadsskydd|budget|proposition|regeringen|riksdag|betänkande"),
    ("Avtal och regler", r"avtal|konsument|telefonförsäljning|föreskrift|tillsyn|\blag|regler|böter|vite|vilseled|marknadsföring"),
    ("Elnät", r"nät|effektavgift|kraftledning|ledning|kapacitet|anslutning"),
    ("Pris", r"pris|dyr|billig|rekord"),
]
POANG = [
    (3, r"elstöd|elprisstöd|energistöd|högkostnadsskydd|elskatt|energiskatt|effektavgift|nätavgift|rekord|chock|effektbrist|elbrist|frånkoppl|bortkoppl"),
    (2, r"höj|sänk|stopp|varnar|varning|slopa|förbud|böter|vite|kris|dyr|billig|telefonförsäljning|elavtal|elräkning|elpris|energipris|stöd till hushåll|flaskhals|elkund"),
]


def hamta(url, max_bytes=3_000_000, forsok=2):
    for i in range(forsok):
        try:
            with OPENER.open(urllib.request.Request(url, headers=UA), timeout=40) as r:
                return r.read(max_bytes)
        except Exception as e:  # noqa: BLE001
            if i == forsok - 1:
                raise
            time.sleep(5)


_ROBOTS = {}
def robots_ok(url):
    """True om robots.txt tillåter (eller saknas). False om den säger nej."""
    p = urlparse(url)
    bas = "%s://%s" % (p.scheme, p.netloc)
    if bas not in _ROBOTS:
        rp = urllib.robotparser.RobotFileParser()
        try:
            rp.parse(hamta(bas + "/robots.txt", 500_000, 1).decode("utf-8", "replace").splitlines())
            _ROBOTS[bas] = rp
        except Exception:  # noqa: BLE001
            _ROBOTS[bas] = None  # ingen robots.txt = inget förbud angivet
    rp = _ROBOTS[bas]
    return True if rp is None else (rp.can_fetch(UA_NAMN, url) and rp.can_fetch("*", url))


def ren(s):
    s = html.unescape(re.sub(r"<[^>]+>", " ", s or ""))
    return re.sub(r"\s+", " ", s).strip()[:220]


def lokal(tag):
    return tag.split("}")[-1].lower()


def tid_iso(s):
    """Tolkar flödets tid. Returnerar UTC som ISO-text, eller None."""
    s = (s or "").strip()
    if not s:
        return None
    d = None
    try:
        d = parsedate_to_datetime(s)
    except Exception:  # noqa: BLE001
        try:
            d = datetime.fromisoformat(s.replace("Z", "+00:00"))
        except Exception:  # noqa: BLE001
            return None
    if d.tzinfo is None:
        d = d.replace(tzinfo=timezone.utc)
    return d.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def las_rss(data, bas):
    rot = ET.fromstring(data)
    ut = []
    for el in rot.iter():
        if lokal(el.tag) not in ("item", "entry"):
            continue
        t = d = l = ""
        for c in el:
            n = lokal(c.tag)
            if n == "title" and not t:
                t = ren(c.text)
            elif n in ("pubdate", "published", "updated", "date") and not d:
                d = (c.text or "").strip()
            elif n == "link" and not l:
                l = (c.text or "").strip() or c.attrib.get("href", "")
        if t and l:
            ut.append({"rubrik": t, "lank": urljoin(bas, l), "tid": tid_iso(d), "tidtyp": "publicerad"})
    return ut


MANADER = {m: i + 1 for i, m in enumerate(
    ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"])}

def datum_i(text):
    m = re.search(r"(20\d\d)-(\d\d)-(\d\d)", text)
    if m:
        return "%s-%s-%sT11:00:00Z" % m.groups()
    m = re.search(r"(\d{1,2})\s+(januari|februari|mars|april|maj|juni|juli|augusti|september|oktober|november|december)\s+(20\d\d)", text, re.I)
    if m:
        return "%s-%02d-%02dT11:00:00Z" % (m.group(3), MANADER[m.group(2).lower()], int(m.group(1)))
    return None


def las_lista(data, bas, monster):
    """Pressida utan flöde: länkar som matchar mönstret. Datum letas i texten närmast länken."""
    sida = data.decode("utf-8", "replace")
    ut, sedda = [], set()
    for m in re.finditer(r'<a\b[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', sida, re.I | re.S):
        href, inre = m.group(1), m.group(2)
        if not re.search(monster, href):
            continue
        lank = urljoin(bas, html.unescape(href))
        rubrik = ren(inre)
        if lank in sedda or len(rubrik) < 12:
            continue
        sedda.add(lank)
        # Datum söks i länktexten, i adressen och i texten direkt efter länken – inte före (det hör till förra posten).
        d = datum_i(ren(inre)) or datum_i(href) or datum_i(ren(sida[m.end():m.end() + 160]))
        rubrik = re.sub(r"^\s*20\d\d-\d\d-\d\d\s*", "", rubrik)
        ut.append({"rubrik": rubrik, "lank": lank, "tid": d, "tidtyp": "datum" if d else "upptackt"})
    return ut


def kategori(rubrik):
    for namn, mo in KATEGORIER:
        if re.search(mo, rubrik, re.I):
            return namn
    return "Elsystem"


def poang(rubrik, vikt):
    p = vikt
    for varde, mo in POANG:
        if re.search(mo, rubrik, re.I):
            p += varde
    return p


def las_gammal():
    try:
        t = open(UT, encoding="utf-8").read()
        d = json.loads(t[t.index("{", t.index("window.")):t.rindex("}") + 1])
        return d if isinstance(d.get("poster"), list) else {"poster": []}
    except Exception:  # noqa: BLE001
        return {"poster": []}


def main():
    nu = datetime.now(timezone.utc)
    nu_iso = nu.strftime("%Y-%m-%dT%H:%M:%SZ")
    grans = (nu - timedelta(days=BEHALL_DAGAR)).strftime("%Y-%m-%dT%H:%M:%SZ")
    gammal = las_gammal()
    gamla = {p["id"]: p for p in gammal["poster"] if isinstance(p, dict) and p.get("id")}
    haft = {p.get("kid") for p in gamla.values()}
    status, nya, lyckade = [], {}, 0

    for k in KALLOR:
        rad = {"id": k["id"], "namn": k["namn"], "ok": False, "antal": 0, "fel": ""}
        status.append(rad)
        try:
            if os.environ.get("SIMULERA_FEL") == "nyheter":
                raise RuntimeError("simulerat fel")
            if not robots_ok(k["url"]):
                rad["fel"] = "robots.txt säger nej"
                continue
            data = hamta(k["url"])
            poster = las_rss(data, k["url"]) if k["typ"] == "rss" else las_lista(data, k["url"], k["lankmonster"])
            if not poster:
                rad["fel"] = "inga poster i svaret"
                continue
            tagna = 0
            for p in poster:
                if not re.match(r"^https?://", p["lank"]):
                    continue
                if k["filter"] and not REL.search(p["rubrik"]):
                    continue
                if k.get("hoppa") and re.search(k["hoppa"], p["rubrik"]):
                    continue
                pid = hashlib.sha1(p["lank"].encode("utf-8")).hexdigest()[:12]
                if pid in gamla and gamla[pid].get("tid"):
                    p["tid"], p["tidtyp"] = gamla[pid]["tid"], gamla[pid].get("tidtyp", "publicerad")
                elif not p["tid"]:
                    # Sidan anger inget datum. Första gången källan läses vet vi inte hur gammal posten är
                    # – då sparas den utan tid (visas inte). Dyker den upp senare är den ny: tiden blir nu.
                    p["tid"] = nu_iso if (k["id"] in haft and pid not in gamla) else None
                if p["tid"] and p["tid"] > (nu + timedelta(hours=2)).strftime("%Y-%m-%dT%H:%M:%SZ"):
                    p["tid"] = nu_iso
                if p["tid"] and p["tid"] < grans:
                    continue
                nya[pid] = {"id": pid, "rubrik": p["rubrik"], "lank": p["lank"], "kalla": k["namn"], "kid": k["id"],
                            "tid": p["tid"], "tidtyp": p["tidtyp"], "kat": kategori(p["rubrik"]),
                            "poang": poang(p["rubrik"], k["vikt"])}
                tagna += 1
                if tagna >= MAX_PER_KALLA:
                    break
            rad["ok"], rad["antal"] = True, tagna
            lyckade += 1
        except Exception as e:  # noqa: BLE001
            rad["fel"] = ("%s: %s" % (type(e).__name__, e))[:140]

    if lyckade == 0:
        print("FEL: ingen källa gick att läsa – nyheter.js lämnas orörd.", file=sys.stderr)
        for r in status:
            print("  %s: %s" % (r["id"], r["fel"]), file=sys.stderr)
        sys.exit(1)

    # Behåll äldre poster (de faller ur flödena) så länge de är nyare än gränsen.
    # Poster utan tid behålls bara medan de står kvar på källans sida.
    ok_kallor = {r["id"] for r in status if r["ok"]}
    for pid, p in gamla.items():
        if pid in nya:
            continue
        if p.get("tid") and p["tid"] >= grans:
            nya[pid] = p
        elif not p.get("tid") and p.get("kid") not in ok_kallor:
            nya[pid] = p

    # Samma rubrik från två flöden hos samma utgivare (t.ex. Svenska kraftnät): behåll en.
    per_rubrik = {}
    for p in nya.values():
        nyckel = (p["kalla"], p["rubrik"].lower())
        b = per_rubrik.get(nyckel)
        if not b or (p.get("tid") or "") < (b.get("tid") or "9"):
            per_rubrik[nyckel] = p
    poster = sorted(per_rubrik.values(), key=lambda p: p.get("tid") or "", reverse=True)[:MAX_POSTER]

    ut = {"hamtat": nu_iso, "kallor": status, "poster": poster}
    if TORR:
        print("=== NYHETER TORRKÖRNING ===")
        for r in status:
            mina = [p for p in poster if p["kid"] == r["id"]]
            tider = sorted(p["tid"] for p in mina if p.get("tid"))
            print("NK " + json.dumps({**r, "nyast": tider[-1] if tider else None, "aldst": tider[0] if tider else None,
                                      "utan_tid": sum(1 for p in mina if not p.get("tid"))}, ensure_ascii=False))
        for p in poster[:60]:
            print("NP " + json.dumps(p, ensure_ascii=False))
        print("=== SLUT ===")
        return
    with open(UT, "w", encoding="utf-8") as f:
        f.write("/* Skrivs automatiskt av skript/nyheter.py – ändra inte för hand. Bara rubrik, källa, tid och länk. */\n")
        f.write("window.NYHETER = " + json.dumps(ut, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print("nyheter.js: %d poster, %d av %d källor svarade" % (len(poster), lyckade, len(KALLOR)))
    for r in status:
        if not r["ok"]:
            print("  föll: %s – %s" % (r["id"], r["fel"]), file=sys.stderr)


if __name__ == "__main__":
    main()
