#!/usr/bin/env python3
"""Engångskörning: dygnsmedel för spotpriset SE1–SE4 från 2022-11-01, till prishistorik.csv.

Används bara för att kalibrera gränserna för "pristryck". Källa: elprisetjustnu.se (ENTSO-E).
Kolumner: datum;SE1;SE2;SE3;SE4 (EUR/MWh, oviktat medel av dygnets poster; tomt = saknas).
"""
import json, os, sys, time, urllib.error, urllib.request
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

UT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "prishistorik.csv")
URL = "https://www.elprisetjustnu.se/api/v1/prices/{y}/{md}_{o}.json"
OMR = ["SE1", "SE2", "SE3", "SE4"]


def medel(dag, o):
    req = urllib.request.Request(URL.format(y=dag.strftime("%Y"), md=dag.strftime("%m-%d"), o=o),
                                 headers={"User-Agent": "abbes-verktyg-for-el (engangskorning prishistorik)"})
    for forsok in range(4):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                v = [p["EUR_per_kWh"] for p in json.loads(r.read().decode("utf-8")) if isinstance(p.get("EUR_per_kWh"), (int, float))]
                return round(sum(v) / len(v) * 1000, 2) if v else None
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            time.sleep(5 * (forsok + 1))
        except Exception:  # noqa: BLE001
            time.sleep(5 * (forsok + 1))
    return None


def main():
    klara = {}
    if os.path.exists(UT):
        for rad in open(UT, encoding="utf-8").read().splitlines()[1:]:
            d = rad.split(";")
            if len(d) == 5 and all(d[1:]):
                klara[d[0]] = rad
    dag, sista = date(2022, 11, 1), datetime.now(ZoneInfo("Europe/Stockholm")).date() - timedelta(days=1)
    rader, saknas = [], 0
    while dag <= sista:
        k = dag.isoformat()
        if k in klara:
            rader.append(klara[k])
        else:
            v = []
            for o in OMR:
                v.append(medel(dag, o))
                time.sleep(0.05)
            saknas += sum(1 for x in v if x is None)
            rader.append(k + ";" + ";".join("" if x is None else str(x) for x in v))
        dag += timedelta(days=1)
    with open(UT, "w", encoding="utf-8") as f:
        f.write("datum;SE1;SE2;SE3;SE4\n" + "\n".join(rader) + "\n")
    print(f"Skrev {len(rader)} dygn, {saknas} värden saknas.")


if __name__ == "__main__":
    main()
