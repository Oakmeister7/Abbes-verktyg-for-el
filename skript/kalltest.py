#!/usr/bin/env python3
# Engångstest: vilka nyhetskällor svarar, har de RSS och tillåter robots.txt hämtning?
# Skriver bara till körloggen. Ändrar inga filer.
import json, re, sys, urllib.request, urllib.error, urllib.robotparser
from urllib.parse import urlparse, urljoin
import xml.etree.ElementTree as ET

UA_NAMN = "abbes-verktyg-nyheter"
UA = {"User-Agent": "Mozilla/5.0 (compatible; %s/1.0; +https://github.com/Oakmeister7/Abbes-verktyg-for-el)" % UA_NAMN,
      "Accept": "application/rss+xml,application/atom+xml,application/xml,text/xml,text/html,*/*",
      "Accept-Language": "sv-SE,sv;q=0.9"}

# (namn, typ, adress). typ: rss = känd flödesadress, sida = leta efter flödeslänk i sidan
KALLOR = [
    ("SVT Nyheter", "rss", "https://www.svt.se/nyheter/rss.xml"),
    ("SVT Ekonomi", "rss", "https://www.svt.se/nyheter/ekonomi/rss.xml"),
    ("SVT Inrikes", "rss", "https://www.svt.se/nyheter/inrikes/rss.xml"),
    ("Aftonbladet senaste nytt", "rss", "https://rss.aftonbladet.se/rss2/small/pages/sections/senastenytt/"),
    ("Aftonbladet nyheter", "rss", "https://rss.aftonbladet.se/rss2/small/pages/sections/nyheter/"),
    ("Expressen nyheter", "rss", "https://feeds.expressen.se/nyheter/"),
    ("Expressen ekonomi", "rss", "https://feeds.expressen.se/ekonomi/"),
    ("DN", "rss", "https://www.dn.se/rss/"),
    ("DN ekonomi", "rss", "https://www.dn.se/rss/ekonomi/"),
    ("SvD", "rss", "https://www.svd.se/feed/articles.rss"),
    ("Sveriges Radio Ekot", "rss", "https://api.sr.se/api/rss/program/83?format=145"),
    ("Sveriges Radio Ekonomiekot", "rss", "https://api.sr.se/api/rss/program/178?format=145"),
    ("TV4 nyheter", "sida", "https://www.tv4.se/nyheter"),
    ("Regeringen pressmeddelanden", "sida", "https://www.regeringen.se/pressmeddelanden/"),
    ("Regeringen RSS pressmeddelanden", "rss", "https://www.regeringen.se/Filter/RssFeed?filterType=Taxonomy&filterByType=FilteredPressReleasesList"),
    ("Regeringen RSS allt", "rss", "https://www.regeringen.se/Filter/RssFeed?filterType=Taxonomy&filterByType=FilterablePageBase"),
    ("Regeringen prenumerera", "sida", "https://www.regeringen.se/om-webbplatsen/rss-floden/"),
    ("Ei nyheter", "sida", "https://ei.se/om-oss/nyheter"),
    ("Ei start", "sida", "https://ei.se/"),
    ("Svenska kraftnät press", "sida", "https://www.svk.se/press-och-nyheter/"),
    ("Svenska kraftnät via TT RSS", "rss", "https://via.tt.se/rss/releases/latest?publisherId=3235391"),
    ("Svenska kraftnät via TT pressrum", "sida", "https://via.tt.se/pressrum/3235391/svenska-kraftnat"),
    ("Energiföretagen via TT (pressmeddelande)", "sida", "https://via.tt.se/pressmeddelande/4460154/halvarsstatistik-kyla-lite-sno-och-konflikter-gav-rekordhoga-elpriser?lang=sv"),
    ("Energiföretagen pressrum", "sida", "https://www.energiforetagen.se/pressrum/"),
    ("Energimyndigheten nyheter", "sida", "https://www.energimyndigheten.se/nyhetsarkiv/"),
    ("Konsumentverket nyheter", "sida", "https://www.konsumentverket.se/aktuellt/nyheter-och-pressmeddelanden/"),
    ("Konkurrensverket nyheter", "sida", "https://www.konkurrensverket.se/informationsmaterial/nyhetsarkiv/"),
    ("Energimarknadsbyrån nyheter", "sida", "https://www.energimarknadsbyran.se/nyheter/"),
    ("Vattenfall press", "sida", "https://group.vattenfall.com/se/nyheter-och-press/pressmeddelanden"),
    ("Riksdagen dokument RSS (näringsutskottet)", "rss", "https://data.riksdagen.se/dokumentlista/?sok=el&doktyp=bet&org=NU&sort=datum&sortorder=desc&utformat=rss"),
    ("SCB pressmeddelanden", "sida", "https://www.scb.se/pressmeddelanden/"),
]

def hamta(url, max_bytes=3_000_000):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.status, r.headers.get("Content-Type", ""), r.geturl(), r.read(max_bytes)

ROBOTS = {}
def robots(url):
    p = urlparse(url)
    bas = "%s://%s" % (p.scheme, p.netloc)
    if bas not in ROBOTS:
        rp = urllib.robotparser.RobotFileParser()
        try:
            st, ct, _, data = hamta(bas + "/robots.txt", 500_000)
            txt = data.decode("utf-8", "replace")
            rp.parse(txt.splitlines())
            ai = [l.strip() for l in txt.splitlines() if re.search(r"(?i)^\s*(user-agent|disallow|allow|crawl-delay)", l)]
            ROBOTS[bas] = (rp, "finns (%d regler)" % len(ai))
        except urllib.error.HTTPError as e:
            ROBOTS[bas] = (None, "saknas (HTTP %s)" % e.code)
        except Exception as e:
            ROBOTS[bas] = (None, "kunde inte läsas (%s)" % type(e).__name__)
    rp, not_ = ROBOTS[bas]
    if rp is None:
        return None, not_
    return rp.can_fetch(UA_NAMN, url) and rp.can_fetch("*", url), not_

def lokal(tag):
    return tag.split("}")[-1].lower()

def las_flode(data):
    try:
        rot = ET.fromstring(data)
    except ET.ParseError as e:
        return None, "inte giltig XML (%s)" % str(e)[:60]
    poster = []
    for el in rot.iter():
        if lokal(el.tag) in ("item", "entry"):
            t = d = l = ""
            for c in el:
                n = lokal(c.tag)
                if n == "title" and not t: t = (c.text or "").strip()
                elif n in ("pubdate", "published", "updated", "date") and not d: d = (c.text or "").strip()
                elif n == "link" and not l: l = (c.text or "").strip() or c.attrib.get("href", "")
            poster.append((t, d, l))
    if not poster:
        return None, "XML utan poster (rot: %s)" % lokal(rot.tag)
    return poster, ""

def hitta_floden(html, bas):
    ut = []
    for m in re.finditer(r"<link\b[^>]*>", html, re.I):
        tag = m.group(0)
        if re.search(r'type=["\']application/(rss|atom)\+xml', tag, re.I):
            h = re.search(r'href=["\']([^"\']+)', tag, re.I)
            if h: ut.append(urljoin(bas, h.group(1).replace("&amp;", "&")))
    for m in re.finditer(r'href=["\']([^"\']*(?:rss|feed|atom)[^"\']*)["\']', html, re.I):
        u = urljoin(bas, m.group(1).replace("&amp;", "&"))
        if u not in ut and not re.search(r"\.(css|js|png|svg|jpg|ico)(\?|$)", u): ut.append(u)
    return ut[:8]

def testa(namn, typ, url, djup=0):
    rad = {"namn": namn, "typ": typ, "url": url}
    ok, not_ = robots(url)
    rad["robots_tillater"] = ok
    rad["robots"] = not_
    try:
        st, ct, slut, data = hamta(url)
    except urllib.error.HTTPError as e:
        rad["svar"] = "HTTP %s" % e.code
        return [rad]
    except Exception as e:
        rad["svar"] = "fel: %s %s" % (type(e).__name__, str(e)[:80])
        return [rad]
    rad["svar"] = "HTTP %s" % st
    rad["typ_svar"] = ct[:60]
    if slut != url: rad["omdirigerad_till"] = slut
    rader = [rad]
    ar_xml = "xml" in ct.lower() or data.lstrip()[:5] in (b"<?xml", b"<rss ", b"<feed")
    if ar_xml:
        poster, fel = las_flode(data)
        if poster:
            rad["flode"] = True
            rad["antal"] = len(poster)
            rad["nyaste"] = [p[1] for p in poster[:1]]
            rad["exempel"] = [p[0][:90] for p in poster[:3]]
            rad["lank_exempel"] = poster[0][2][:120]
        else:
            rad["flode"] = False
            rad["fel"] = fel
    else:
        html = data.decode("utf-8", "replace")
        rad["flode"] = False
        t = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
        rad["sidtitel"] = (t.group(1).strip()[:80] if t else "")
        pid = sorted(set(re.findall(r"publisherId[=\"':\s]+(\d{5,9})", html)))
        if pid: rad["publisherId"] = pid[:5]
        floden = hitta_floden(html, slut)
        rad["hittade_floden"] = floden
        if djup == 0:
            for f in floden[:4]:
                rader += testa(namn + " > hittat flöde", "rss", f, 1)
            for p in pid[:2]:
                if "via.tt.se" in url and p != "3235391":
                    rader += testa(namn + " > via TT RSS", "rss", "https://via.tt.se/rss/releases/latest?publisherId=" + p, 1)
    return rader

alla = []
for namn, typ, url in KALLOR:
    try:
        alla += testa(namn, typ, url)
    except Exception as e:
        alla.append({"namn": namn, "url": url, "svar": "skriptfel: %s" % e})

print("=== KALLTEST START ===")
for r in alla:
    print("KT " + json.dumps(r, ensure_ascii=False))
print("=== ROBOTS ===")
for bas, (rp, not_) in ROBOTS.items():
    print("RB " + json.dumps({"vard": bas, "robots": not_}, ensure_ascii=False))
print("=== KALLTEST SLUT ===")
