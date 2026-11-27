#!/usr/bin/env python3
"""Hämtar Nord Pool UMM för SE1–SE4 + SE3A och skriver umm.js.

Körs av GitHub Actions (.github/workflows/umm.yml). Bara standardbibliotek.
Talen kopieras rakt ur Nord Pools fält. Inga egna beräkningar här,
utom filtrering på tidsfönster och borttag av dubbletter.
"""
import json, os, sys, time, urllib.parse, urllib.request
from datetime import datetime, timedelta, timezone

API = "https://ummapi.nordpoolgroup.com"
OMRADEN = {
    "10Y1001A1001A44P": "SE1",
    "10Y1001A1001A45N": "SE2",
    "10Y1001A1001A46L": "SE3",
    "10Y1001A1001A47J": "SE4",
    "46Y000000000007M": "SE3A",
}
FONSTER_DAGAR = 14
SIDA = 1000
UT = sys.argv[1] if len(sys.argv) > 1 else "umm.js"
NY_SKRIVNING_TIMMAR = 6


def hamta(path, params=None, forsok=3):
    url = API + path + ("?" + urllib.parse.urlencode(params, doseq=True) if params else "")
    for i in range(forsok):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "abbes-verktyg-umm/1.0", "Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:  # noqa: BLE001
            if i == forsok - 1:
                raise
            print(f"Försök {i+1} misslyckades ({e}), väntar…", file=sys.stderr)
            time.sleep(5 * (i + 1))


def uppslag(path):
    try:
        d = hamta(path)
        out = {}
        for x in d if isinstance(d, list) else d.get("items", []):
            k = x.get("value", x.get("id"))
            v = x.get("text", x.get("name"))
            if k is not None:
                out[str(k)] = v
        return out
    except Exception as e:  # noqa: BLE001
        print(f"Uppslag {path} misslyckades: {e}", file=sys.stderr)
        return {}


def iso(s):
    if not s:
        return None
    s = s.rstrip("Z")
    if "." in s:
        a, b = s.split(".", 1)
        s = a + "." + b[:6]
    return datetime.fromisoformat(s).replace(tzinfo=timezone.utc)


def main():
    nu = datetime.now(timezone.utc)
    slut = nu + timedelta(days=FONSTER_DAGAR)

    alla, skip, total = {}, 0, None
    while True:
        d = hamta("/messages", {"Areas": list(OMRADEN), "Limit": SIDA, "Skip": skip})
        items = d.get("items", [])
        total = d.get("total", total)
        for m in items:
            mid = m.get("messageId")
            if mid and (mid not in alla or (m.get("version") or 0) > (alla[mid].get("version") or 0)):
                alla[mid] = m
        skip += len(items)
        if not items or skip >= (total or 0) or skip > 60000:
            break
    print(f"Hämtade {skip} av total {total}, unika meddelanden {len(alla)}")
    if total and skip < total:
        print("VARNING: inte alla sidor hämtade", file=sys.stderr)

    def i_fonster(perioder):
        ut = []
        for p in perioder or []:
            a, b = iso(p.get("eventStart")), iso(p.get("eventStop"))
            if a and b and a < slut and b > nu:
                ut.append({"start": p.get("eventStart"), "stopp": p.get("eventStop"),
                           "installerat": p.get("installedCapacity"),
                           "ej_tillg": p.get("unavailableCapacity"),
                           "tillg": p.get("availableCapacity")})
        return ut

    produktion, overforing = [], []
    for m in alla.values():
        if m.get("isOutdated") or m.get("cancellationReason"):
            continue
        bas = {
            "id": m.get("messageId"), "version": m.get("version"),
            "typ": m.get("messageType"), "status": m.get("eventStatus"),
            "otillg_typ": m.get("unavailabilityType"), "orsak_kod": m.get("reasonCode"),
            "orsak": m.get("unavailabilityReason"), "anm": m.get("remarks"),
            "publicerad": m.get("publicationDate"), "utgivare": m.get("publisherName"),
        }
        # Två varianter i API:et: generationUnits (enhet i en anläggning) och productionUnits (hel anläggning).
        for falt in ("generationUnits", "productionUnits"):
            for g in m.get(falt) or []:
                omr = OMRADEN.get(g.get("areaEic"))
                if not omr:
                    continue
                per = i_fonster(g.get("timePeriods"))
                if per:
                    produktion.append({**bas, "omrade": omr, "kalla_falt": falt,
                                       "anlaggning": g.get("productionUnitName") or g.get("name"),
                                       "enhet": g.get("name"), "bransle": g.get("fuelType"),
                                       "installerat": g.get("installedCapacity"), "perioder": per})
        for t in m.get("transmissionUnits") or []:
            # Nord Pool: kraften går FRÅN inArea TILL outArea (kontrollerat: SE3->SE4 = 6200 MW, SE3->SE3A = 2810 MW).
            fran, till = t.get("inAreaName"), t.get("outAreaName")
            if not (OMRADEN.get(t.get("outAreaEic")) or OMRADEN.get(t.get("inAreaEic"))):
                continue
            per = i_fonster(t.get("timePeriods"))
            if per:
                overforing.append({**bas, "fran": fran, "till": till,
                                   "ledning": ", ".join(a.get("name", "") for a in (m.get("assets") or t.get("assets") or [])) or t.get("name"),
                                   "installerat": t.get("installedCapacity"), "perioder": per})

    produktion.sort(key=lambda x: (x["perioder"][0]["start"], x["anlaggning"] or ""))
    overforing.sort(key=lambda x: (x["perioder"][0]["start"], x["fran"] or "", x["till"] or ""))

    data = {
        "kalla": "Nord Pool UMM (ummapi.nordpoolgroup.com)",
        "fonster_dagar": FONSTER_DAGAR,
        "hamtade": skip, "total": total,
        "bransletyper": uppslag("/infrastructure/fueltypes"),
        "otillg_typer": uppslag("/infrastructure/unavailabilitytypes"),
        "produktion": produktion, "overforing": overforing,
    }

    gammal = None
    if os.path.exists(UT):
        try:
            txt = open(UT, encoding="utf-8").read()
            gammal = json.loads(txt[txt.index("{"):txt.rindex("}") + 1])
        except Exception:  # noqa: BLE001
            gammal = None
    if gammal:
        g_hamtat = gammal.pop("hamtat", None)
        lika = gammal == json.loads(json.dumps(data))
        alder = (nu - iso(g_hamtat)).total_seconds() / 3600 if g_hamtat else 999
        if lika and alder < NY_SKRIVNING_TIMMAR:
            print(f"Oförändrat ({alder:.1f} h sedan senaste skrivning) – skriver inte.")
            return
    data = {"hamtat": nu.strftime("%Y-%m-%dT%H:%M:%SZ"), **data}
    with open(UT, "w", encoding="utf-8") as f:
        f.write("// Skapad automatiskt av skript/umm.py (GitHub Actions). Ändra inte för hand.\n")
        f.write("window.UMM = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print(f"Skrev {UT}: {len(produktion)} produktion, {len(overforing)} överföring")


if __name__ == "__main__":
    main()
