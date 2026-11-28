#!/usr/bin/env python3
"""Sista steget i "Uppdatera data": kontrollerar datafilerna och skriver status.js.

1. Varje datafil (umm.js, ei.js, pris.js) kontrolleras. Är den trasig eller orimlig återställs den
   till senast publicerade version – en misslyckad körning får aldrig publicera halvfärdig data.
2. Hämtar faktisk kärnkraftsproduktion i Sverige (Energy-Charts.info, data från ENTSO-E, CC BY 4.0).
   Fliken använder den för att stämma av Nord Pools avbrottsmeddelanden mot en oberoende källa.
3. Skriver window.DATASTATUS = { korning, kallor: { id: { namn, ok, senast_ok, fel } }, karnkraft_faktisk }.

Stegens utfall kommer via miljövariablerna UTFALL_UMM, UTFALL_EI, UTFALL_PRIS ("success"/"failure").
"""
import json, os, re, subprocess, sys, time, urllib.request
from datetime import datetime, timezone

ROT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
UT = os.path.join(ROT, "status.js")
NAMN = {"umm": "Nord Pool – driftmeddelanden", "ei": "Ei – Läget på elmarknaden",
        "pris": "Spotpris – elprisetjustnu.se", "produktion": "Faktisk kärnkraftsproduktion – Energy-Charts"}
OMR = ["SE1", "SE2", "SE3", "SE4"]


def las_js(fil):
    t = open(os.path.join(ROT, fil), encoding="utf-8").read()
    return json.loads(t[t.index("{", t.index("window.")):t.rindex("}") + 1])


def tal(x, lo, hi):
    return isinstance(x, (int, float)) and not isinstance(x, bool) and lo <= x <= hi


def kontroll_umm(d):
    for k in ("produktion", "overforing", "ovrigt"):
        if not isinstance(d.get(k), list):
            return f"{k} saknas"
    if not isinstance(d.get("hamtat"), str) or not re.match(r"^\d{4}-\d\d-\d\dT", d["hamtat"]):
        return "hamtat saknas"
    if "hamtade" in d and "total" in d and d["hamtade"] != d["total"]:
        return "ofullständig hämtning"
    for m in d["produktion"] + d["overforing"]:
        if not isinstance(m.get("perioder"), list):
            return "meddelande utan perioder"
    return None


def kontroll_ei(d):
    if not re.match(r"^\d{4}-W\d\d$", str(d.get("vecka", ""))):
        return "vecka saknas"
    if not re.match(r"^\d{4}-\d\d-\d\d$", str(d.get("publicerad", ""))):
        return "publicerad saknas"
    spot = d.get("spot") or {}
    for o in OMR:
        if o not in spot or not tal(spot[o].get("medel"), -100, 2000) or not tal(spot[o].get("andring_proc"), -1000, 5000):
            return f"spotpris {o} saknas eller orimligt"
    return None


def kontroll_pris(d):
    dagar = d.get("dagar")
    if not isinstance(dagar, dict) or not dagar:
        return "dagar saknas"
    for k, dag in dagar.items():
        if not re.match(r"^\d{4}-\d\d-\d\d$", k):
            return "ogiltigt datum"
        for o in OMR:
            if o in dag and not (tal(dag[o].get("eur_mwh"), -500, 4000) and tal(dag[o].get("ore_kwh"), -600, 5000) and tal(dag[o].get("n"), 20, 100)):
                return f"orimligt pris {k} {o}"
    return None


def aterstall(fil):
    """Tillbaka till senast publicerade version (eller bort, om filen aldrig publicerats)."""
    r = subprocess.run(["git", "-C", ROT, "checkout", "--", fil], capture_output=True)
    if r.returncode != 0 and os.path.exists(os.path.join(ROT, fil)):
        os.remove(os.path.join(ROT, fil))


def karnkraft():
    if os.environ.get("SIMULERA_FEL") == "produktion":
        raise RuntimeError("simulerat fel")
    req = urllib.request.Request("https://api.energy-charts.info/public_power?country=se",
                                 headers={"User-Agent": "abbes-verktyg-for-el (GitHub Actions, 1 gang/timme)"})
    sista = None
    for i in range(3):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                d = json.loads(r.read().decode("utf-8"))
            break
        except Exception as e:  # noqa: BLE001
            sista = e
            time.sleep(8 * (i + 1))
    else:
        raise RuntimeError(f"gick inte att nå ({sista})")
    serie = next((p.get("data") for p in d.get("production_types", []) if str(p.get("name", "")).strip().lower() == "nuclear"), None)
    tider = d.get("unix_seconds") or []
    if not serie or len(serie) != len(tider):
        raise RuntimeError("oväntat format")
    for v, ts in zip(reversed(serie), reversed(tider)):
        if v is not None:
            if not tal(v, 0, 8000):
                raise RuntimeError(f"orimligt värde {v}")
            alder = time.time() - ts
            if alder > 6 * 3600 or alder < -3600:
                raise RuntimeError("värdet är äldre än 6 timmar")
            return {"mw": round(v), "tid": datetime.fromtimestamp(ts, timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "kalla": "Energy-Charts.info (data från ENTSO-E)"}
    raise RuntimeError("inget värde")


def main():
    nu = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    try:
        gammal = las_js("status.js")
    except Exception:  # noqa: BLE001
        gammal = {}
    gk = gammal.get("kallor", {})
    kallor, fel = {}, []
    for kid, fil, kontroll in (("umm", "umm.js", kontroll_umm), ("ei", "ei.js", kontroll_ei), ("pris", "pris.js", kontroll_pris)):
        utfall = os.environ.get("UTFALL_" + kid.upper(), "success")
        orsak = "" if utfall == "success" else "hämtningen misslyckades"
        try:
            brist = kontroll(las_js(fil))
        except FileNotFoundError:
            brist = "filen finns inte"
        except Exception as e:  # noqa: BLE001
            brist = f"går inte att läsa ({type(e).__name__})"
        if brist:
            print(f"VARNING: {fil} underkänd ({brist}) – återställer senast publicerade version.", file=sys.stderr)
            aterstall(fil)
            orsak = f"ny data underkändes ({brist})"
        ok = not orsak
        kallor[kid] = {"namn": NAMN[kid], "ok": ok, "senast_ok": nu if ok else gk.get(kid, {}).get("senast_ok"), "fel": orsak}
        if not ok:
            fel.append(kid)
    faktisk = gammal.get("karnkraft_faktisk")
    try:
        faktisk = karnkraft()
        kallor["produktion"] = {"namn": NAMN["produktion"], "ok": True, "senast_ok": nu, "fel": ""}
    except Exception as e:  # noqa: BLE001
        print(f"VARNING: faktisk kärnkraftsproduktion: {e}", file=sys.stderr)
        kallor["produktion"] = {"namn": NAMN["produktion"], "ok": False, "senast_ok": gk.get("produktion", {}).get("senast_ok"), "fel": str(e)[:120]}
        fel.append("produktion")
    data = {"korning": nu, "kallor": kallor, "karnkraft_faktisk": faktisk}
    with open(UT, "w", encoding="utf-8") as f:
        f.write("/* Skrivs automatiskt av skript/status.py vid varje körning – ändra inte för hand. */\nwindow.DATASTATUS = "
                + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print("Status:", ", ".join(f"{k}={'ok' if v['ok'] else 'FEL'}" for k, v in kallor.items()))
    ut = os.environ.get("GITHUB_OUTPUT")
    if ut:
        with open(ut, "a", encoding="utf-8") as f:
            f.write("fel=" + ",".join(fel) + "\n")


if __name__ == "__main__":
    main()
