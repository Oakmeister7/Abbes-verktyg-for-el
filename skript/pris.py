#!/usr/bin/env python3
"""Hämtar dagens och morgondagens spotpris (SE1–SE4) och skriver pris.js.

Källa: elprisetjustnu.se (data från ENTSO-E, priser utan moms, skatter och påslag).
Körs av GitHub Actions (.github/workflows/uppdatera.yml). Morgondagens priser kommer
tidigast kl. 13 – saknas de hoppas de över utan fel.
Skriver window.PRIS = { hamtat, kalla, dagar: { "ÅÅÅÅ-MM-DD": { exr, SE1: {eur_mwh, ore_kwh, min_ore, max_ore, n}, … } } }
"""
import json, os, sys, time, urllib.error, urllib.request
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

UT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "pris.js")
OMRADEN = ["SE1", "SE2", "SE3", "SE4"]
BEHALL_DAGAR = 8
URL = "https://www.elprisetjustnu.se/api/v1/prices/{y}/{md}_{o}.json"


def hamta(dag, omrade):
    """Returnerar listan med poster, eller None om filen inte finns än (404)."""
    if os.environ.get("SIMULERA_FEL") == "pris":
        raise RuntimeError("simulerat fel")
    url = URL.format(y=dag.strftime("%Y"), md=dag.strftime("%m-%d"), o=omrade)
    req = urllib.request.Request(url, headers={"User-Agent": "abbes-verktyg-for-el (GitHub Actions, 1 gang/timme)"})
    for forsok in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            if forsok == 2:
                raise
        except Exception:
            if forsok == 2:
                raise
        time.sleep(3)


def sammanfatta(poster):
    eur = [p["EUR_per_kWh"] for p in poster if isinstance(p.get("EUR_per_kWh"), (int, float))]
    sek = [p["SEK_per_kWh"] for p in poster if isinstance(p.get("SEK_per_kWh"), (int, float))]
    if not eur or len(eur) != len(sek):
        return None, None
    exr = next((p.get("EXR") for p in poster if isinstance(p.get("EXR"), (int, float))), None)
    return {
        "eur_mwh": round(sum(eur) / len(eur) * 1000, 2),   # oviktat medel av dygnets poster
        "ore_kwh": round(sum(sek) / len(sek) * 100, 2),
        "min_ore": round(min(sek) * 100, 2),
        "max_ore": round(max(sek) * 100, 2),
        "n": len(eur),
    }, exr


def main():
    nu = datetime.now(timezone.utc)
    idag = nu.astimezone(ZoneInfo("Europe/Stockholm")).date()
    gammal = {}
    if os.path.exists(UT):
        try:
            t = open(UT, encoding="utf-8").read()
            gammal = json.loads(t[t.index("{"):t.rindex("}") + 1]).get("dagar", {})
        except Exception:  # noqa: BLE001
            gammal = {}
    dagar = {k: v for k, v in gammal.items() if k >= (idag - timedelta(days=BEHALL_DAGAR)).isoformat()}
    fel = 0
    for dag in (idag, idag + timedelta(days=1)):
        nyckel = dag.isoformat()
        # En komplett dag ändras inte – hämta inte igen.
        if all(o in dagar.get(nyckel, {}) for o in OMRADEN):
            continue
        post = dict(dagar.get(nyckel, {}))
        for o in OMRADEN:
            if o in post:
                continue
            try:
                poster = hamta(dag, o)
            except Exception as e:  # noqa: BLE001
                print(f"VARNING: {nyckel} {o} gick inte att hämta ({e})", file=sys.stderr)
                fel += 1
                continue
            if poster is None:
                print(f"{nyckel} {o}: inte publicerat än.")
                continue
            s, exr = sammanfatta(poster)
            if s is None:
                print(f"VARNING: {nyckel} {o} hade oväntat format", file=sys.stderr)
                fel += 1
                continue
            post[o] = s
            if exr is not None:
                post["exr"] = exr
        if any(o in post for o in OMRADEN):
            dagar[nyckel] = post
    if dagar == gammal:
        print("Oförändrat – skriver inte.")
    else:
        data = {"hamtat": nu.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "kalla": "elprisetjustnu.se (data från ENTSO-E). Priser utan moms, skatter och påslag.",
                "dagar": dict(sorted(dagar.items()))}
        with open(UT, "w", encoding="utf-8") as f:
            f.write("/* Skrivs automatiskt av skript/pris.py – ändra inte för hand. */\nwindow.PRIS = "
                    + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
        print("Skrev pris.js:", ", ".join(f"{k} ({len([o for o in OMRADEN if o in v])}/4)" for k, v in sorted(dagar.items())))
    if idag.isoformat() not in dagar or fel:
        print("FEL: dagens priser saknas eller hämtning misslyckades.", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
