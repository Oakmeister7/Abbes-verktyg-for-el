#!/usr/bin/env python3
"""Hämtar Ei:s veckorapport "Läget på elmarknaden" och skriver ei.js.

Körs av GitHub Actions (.github/workflows/uppdatera.yml). Talen läses ur Ei:s egen text
med fasta mönster. Går något inte att tolka skrivs INGET (den gamla filen ligger kvar)
och körningen markeras som misslyckad, så att det syns i GitHub.
"""
import html, http.cookiejar, json, os, re, subprocess, sys, tempfile, time, urllib.parse, urllib.request
from datetime import datetime, timedelta, timezone

BAS = "https://ei.se"
LISTA = BAS + "/om-oss/nyheter/laget-pa-elmarknaden"
UT = sys.argv[1] if len(sys.argv) > 1 else "ei.js"
UA = {"User-Agent": "Mozilla/5.0 (compatible; abbes-verktyg-ei/1.1)", "Accept": "text/html,application/pdf,*/*", "Accept-Language": "sv-SE,sv;q=0.9"}
# Ei:s webbplats sätter cookies och omdirigerar (307). Utan cookies blir det en slinga.
OPENER = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
MAX_ALDER_DAGAR = 9  # Ei publicerar en gång i veckan


def hamta(url, binar=False, forsok=3):
    if os.environ.get("SIMULERA_FEL") == "ei":
        raise RuntimeError("simulerat fel")
    for i in range(forsok):
        try:
            with OPENER.open(urllib.request.Request(url, headers=UA), timeout=60) as r:
                b = r.read()
                return b if binar else b.decode("utf-8", errors="replace")
        except Exception as e:  # noqa: BLE001
            if i == forsok - 1:
                raise
            print(f"Försök {i+1} mot {url} misslyckades ({e})", file=sys.stderr)
            time.sleep(10 * (i + 1))


def tal(s):
    return float(s.replace(",", ".").replace("−", "-"))


def fel(msg):
    print("FEL: " + msg, file=sys.stderr)
    sys.exit(1)


def befintlig_alder_dagar():
    try:
        t = open(UT, encoding="utf-8").read()
        g = json.loads(t[t.index("{"):t.rindex("}") + 1])
        pub = datetime.strptime(g["publicerad"], "%Y-%m-%d").replace(tzinfo=timezone.utc)
        return (datetime.now(timezone.utc) - pub).days, g.get("veckonr")
    except Exception:  # noqa: BLE001
        return None, None


def main():
    def ej_nadd(vad, e):
        alder, vnr_g = befintlig_alder_dagar()
        if alder is not None and alder <= MAX_ALDER_DAGAR:
            print(f"VARNING: {vad} gick inte att nå ({e}). Befintlig rapport (vecka {vnr_g}, {alder} dagar) är fortfarande aktuell – inget fel.")
            sys.exit(0)
        fel(f"{vad} gick inte att nå ({e}) och befintlig rapport är {alder} dagar gammal")

    try:
        lista = hamta(LISTA)
    except Exception as e:  # noqa: BLE001
        ej_nadd("Ei:s listsida", e)
    m = re.search(r'href="([^"]*/(\d{4})-(\d{2})-(\d{2})-laget-pa-elmarknaden---vecka-(\d{1,2})-(\d{4}))"', lista)
    if not m:
        fel("hittade ingen veckorapport på listsidan")
    url = m.group(1) if m.group(1).startswith("http") else BAS + m.group(1)
    publicerad = f"{m.group(2)}-{m.group(3)}-{m.group(4)}"
    vnr, ar = int(m.group(5)), int(m.group(6))

    try:
        sida = hamta(url)
    except Exception as e:  # noqa: BLE001
        ej_nadd("Ei:s veckosida", e)
    kropp = re.sub(r"<script.*?</script>|<style.*?</style>", "", sida, flags=re.S)
    text = html.unescape(re.sub(r"<[^>]+>", " ", kropp))
    text = re.sub(r"\s+", " ", text)

    spot = {}
    for omr in ("SE1", "SE2", "SE3", "SE4"):
        # Procent krävs vid ökade/minskade, saknas vid oförändrat. Minustecken kan vara - eller −.
        r = re.search(r"Spotpriset i " + omr + r" (?:(ökade med|minskade med)\s*([0-9][0-9.,]*)\s*procent|(är oförändrat)),? veckomedel blev ([-−]?[0-9][0-9.,]*) EUR/MWh", text)
        if not r:
            fel(f"spotpris för {omr} gick inte att tolka (Ei kan ha ändrat format)")
        riktning = {"ökade med": "upp", "minskade med": "ned", None: "oförändrat"}[r.group(1)]
        andr = tal(r.group(2)) if r.group(2) else 0.0
        if riktning == "ned":
            andr = -andr
        spot[omr] = {"medel": tal(r.group(4)), "andring_proc": andr, "riktning": riktning}

    rubrik = re.search(r"Läget på elmarknaden - vecka (\d{1,2}) (\d{4})", text)
    if rubrik and (int(rubrik.group(1)), int(rubrik.group(2))) != (vnr, ar):
        fel("veckonummer i rubriken stämmer inte med länken")

    # Magasin ur PDF:en (Tabell 5). Misslyckas det blir magasin null, resten skrivs ändå.
    magasin, magasin_fel = None, None
    # Bara PDF:er som heter "...elmarknaden..." – helst den med rätt veckonummer.
    pdfer = [h for h in re.findall(r'href="([^"]+\.pdf)"', sida, re.I)
             if "elmarknaden" in urllib.parse.unquote(h).lower()]
    ratt = [h for h in pdfer if re.search(r"vecka-0?" + str(vnr) + r"\b", urllib.parse.unquote(h).lower())]
    h = (ratt or pdfer or [None])[0]
    pdf_url = (h if h.startswith("http") else BAS + h) if h else None
    if pdf_url:
        try:
            with tempfile.TemporaryDirectory() as d:
                fp = os.path.join(d, "r.pdf")
                open(fp, "wb").write(hamta(pdf_url, binar=True))
                txt = subprocess.run(["pdftotext", "-layout", fp, "-"], capture_output=True, text=True, check=True, timeout=30).stdout
            i = txt.find("Tabell 5: Magasinfyllnadsgrad")
            if i < 0:
                raise ValueError("Tabell 5 saknas")
            bit = txt[i:i + 1500]
            v = re.search(r"Vecka (\d{1,2})\s+Magasinfyllnadsgrad", bit)
            s = re.search(r"^\s*Sverige\s+([0-9.,]+)\s+([-−+]?[0-9.,]+)%\s*\S?\s+([0-9.,]+)\s*$", bit, re.M)
            if not (v and s):
                raise ValueError("raden för Sverige gick inte att tolka")
            magasin = {"vecka": int(v.group(1)), "sverige": tal(s.group(1)), "andring": tal(s.group(2)), "normal": tal(s.group(3))}
        except Exception as e:  # noqa: BLE001
            magasin_fel = str(e)
            print("VARNING magasin: " + magasin_fel, file=sys.stderr)

    # Gick PDF:en inte att läsa men vi har magasin för samma rapportvecka: behåll det.
    if magasin is None and os.path.exists(UT):
        try:
            t = open(UT, encoding="utf-8").read()
            g = json.loads(t[t.index("{"):t.rindex("}") + 1])
            if g.get("veckonr") == vnr and g.get("ar") == ar and g.get("magasin"):
                magasin = g["magasin"]
                print("Behåller tidigare magasin för samma vecka.")
        except Exception:  # noqa: BLE001
            pass

    data = {
        "kalla": "Energimarknadsinspektionen (Ei), Läget på elmarknaden",
        "vecka": f"{ar}-W{vnr:02d}", "veckonr": vnr, "ar": ar,
        "publicerad": publicerad, "url": url, "pdf": pdf_url,
        "spot": spot, "magasin": magasin, "magasin_fel": magasin_fel,
    }

    if os.path.exists(UT):
        try:
            t = open(UT, encoding="utf-8").read()
            g = json.loads(t[t.index("{"):t.rindex("}") + 1])
            g.pop("hamtat", None)
            if g == json.loads(json.dumps(data)):
                print(f"Oförändrat (vecka {vnr}) – skriver inte.")
                return
        except Exception:  # noqa: BLE001
            pass
    data = {"hamtat": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), **data}
    with open(UT, "w", encoding="utf-8") as f:
        f.write("// Skapad automatiskt av skript/ei.py (GitHub Actions). Ändra inte för hand.\n")
        f.write("window.EI = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print(f"Skrev {UT}: vecka {vnr} {ar}, publicerad {publicerad}, magasin {'ok' if magasin else 'saknas'}")


if __name__ == "__main__":
    main()
