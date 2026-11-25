/* ============================================================================
   publiceringslogg.js – tillfällig mätning av när källorna publicerar
   ----------------------------------------------------------------------------
   Skrivs av den schemalagda mätuppgiften (se MATNING.md), vardagar kl. 09:00 och
   15:00 svensk tid, 2026-11-23 – 2026-12-04. Används inte av index.html.
   ============================================================================ */

window.PUBLICERINGSLOGG = {
  start: "2026-11-23",
  slut: "2026-12-04",
  "mätningar": [
    {
      "tid": "2026-11-23T11:38:39+01:00",
      "anm": "Manuell testkörning (samma läsning som veckoanalys.js för 2026-W48)",
      "källor": [
        {
          "id": "svk",
          "gäller_vecka": "2026-W47",
          "publicerad": "2026-11-20",
          "markör": "Vecka 47, uppdaterad 20 november 2026",
          "status": "läst",
          "ändrad": null
        },
        {
          "id": "eon",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "okänt",
          "status": "ej_läsbar",
          "ändrad": null
        },
        {
          "id": "tibber",
          "gäller_vecka": "2026-W47",
          "publicerad": "okänt",
          "markör": "Elprisprognos 16 - 22 november",
          "status": "läst",
          "ändrad": null
        },
        {
          "id": "kraftringen",
          "gäller_vecka": "2026-W47",
          "publicerad": "okänt",
          "markör": "Vecka 47",
          "status": "läst",
          "ändrad": null
        },
        {
          "id": "skanska",
          "gäller_vecka": "2026-W47",
          "publicerad": "okänt",
          "markör": "Vecka 47",
          "status": "läst",
          "ändrad": null
        },
        {
          "id": "vattenfall",
          "gäller_vecka": "2026-W48",
          "publicerad": "2026-11-23",
          "markör": "publicerad 2026-11-23",
          "status": "läst",
          "ändrad": null
        },
        {
          "id": "bixia",
          "gäller_vecka": "månad 2026-11",
          "publicerad": "2026-10-21",
          "markör": "publicerad 21 oktober 2026",
          "status": "läst",
          "ändrad": null
        },
        {
          "id": "skekraft",
          "gäller_vecka": "månad 2026-11",
          "publicerad": "2026-11-13",
          "markör": "marknadsläget 2026-13-11 (källans datum)",
          "status": "läst",
          "ändrad": null
        },
        {
          "id": "goteborg",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "ingen veckoanalys hittad",
          "status": "ej_läsbar",
          "ändrad": null
        },
        {
          "id": "oresundskraft",
          "gäller_vecka": "2026-W47",
          "publicerad": "2026-11-20",
          "markör": "kommentar 2026-11-20",
          "status": "läst",
          "ändrad": null
        },
        {
          "id": "malarenergi",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "analystext saknas",
          "status": "ej_läsbar",
          "ändrad": null
        }
      ]
    },
    {
      "tid": "2026-11-23T15:15:57+01:00",
      "anm": "skekraft: sidan visar nu 2026-11-13 (förra posten 2026-13-11), samma publiceringsdatum",
      "källor": [
        {
          "id": "svk",
          "gäller_vecka": "2026-W47",
          "publicerad": "2026-11-20",
          "markör": "Vecka 47, uppdaterad 20 november 2026",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "eon",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "okänt",
          "status": "ej_läsbar",
          "ändrad": null
        },
        {
          "id": "tibber",
          "gäller_vecka": "2026-W47",
          "publicerad": "okänt",
          "markör": "Elprisprognos 16 - 22 november",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "kraftringen",
          "gäller_vecka": "2026-W47",
          "publicerad": "okänt",
          "markör": "Vecka 47",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "skanska",
          "gäller_vecka": "2026-W47",
          "publicerad": "okänt",
          "markör": "Vecka 47",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "vattenfall",
          "gäller_vecka": "2026-W48",
          "publicerad": "2026-11-23",
          "markör": "publicerad 2026-11-23",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "bixia",
          "gäller_vecka": "månad 2026-11",
          "publicerad": "2026-10-21",
          "markör": "publicerad 21 oktober 2026",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "skekraft",
          "gäller_vecka": "månad 2026-11",
          "publicerad": "2026-11-13",
          "markör": "marknadsläge uppdaterat 2026-11-13",
          "status": "läst",
          "ändrad": true
        },
        {
          "id": "goteborg",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "ingen veckoanalys hittad",
          "status": "ej_läsbar",
          "ändrad": null
        },
        {
          "id": "oresundskraft",
          "gäller_vecka": "2026-W47",
          "publicerad": "2026-11-20",
          "markör": "kommentar 2026-11-20",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "malarenergi",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "analystext saknas",
          "status": "ej_läsbar",
          "ändrad": null
        }
      ]
    },
    {
      "tid": "2026-11-24T09:05:28+01:00",
      "anm": "svk: vecka och datum från verktygets sammanfattning (sidan trunkerad). skekraft: sidans metadata ändrad 2026-11-18, synligt datum oförändrat",
      "källor": [
        {
          "id": "svk",
          "gäller_vecka": "2026-W48",
          "publicerad": "2026-11-23",
          "markör": "Vecka 48, uppdaterad 23 november 2026",
          "status": "läst",
          "ändrad": true
        },
        {
          "id": "eon",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "okänt",
          "status": "ej_läsbar",
          "ändrad": null
        },
        {
          "id": "tibber",
          "gäller_vecka": "2026-W48",
          "publicerad": "okänt",
          "markör": "Elprisprognos 23 - 29 november",
          "status": "läst",
          "ändrad": true
        },
        {
          "id": "kraftringen",
          "gäller_vecka": "2026-W48",
          "publicerad": "okänt",
          "markör": "Vecka 48",
          "status": "läst",
          "ändrad": true
        },
        {
          "id": "skanska",
          "gäller_vecka": "2026-W48",
          "publicerad": "okänt",
          "markör": "Vecka 48",
          "status": "läst",
          "ändrad": true
        },
        {
          "id": "vattenfall",
          "gäller_vecka": "2026-W48",
          "publicerad": "2026-11-23",
          "markör": "publicerad 2026-11-23",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "bixia",
          "gäller_vecka": "månad 2026-11",
          "publicerad": "2026-11-23",
          "markör": "publicerad 23 november 2026",
          "status": "läst",
          "ändrad": true
        },
        {
          "id": "skekraft",
          "gäller_vecka": "månad 2026-11",
          "publicerad": "2026-11-13",
          "markör": "marknadsläge uppdaterat 2026-11-13",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "goteborg",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "ingen veckoanalys hittad",
          "status": "ej_läsbar",
          "ändrad": null
        },
        {
          "id": "oresundskraft",
          "gäller_vecka": "2026-W47",
          "publicerad": "2026-11-20",
          "markör": "kommentar 2026-11-20",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "malarenergi",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "analystext saknas",
          "status": "ej_läsbar",
          "ändrad": null
        }
      ]
    },
    {
      "tid": "2026-11-24T15:03:40+01:00",
      "anm": "svk: vecka och datum från verktygets sammanfattning (sidan trunkerad). eon: läsningen nekades av verktyget",
      "källor": [
        {
          "id": "svk",
          "gäller_vecka": "2026-W48",
          "publicerad": "2026-11-23",
          "markör": "Vecka 48, uppdaterad 23 november 2026",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "eon",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "okänt",
          "status": "ej_läsbar",
          "ändrad": null
        },
        {
          "id": "tibber",
          "gäller_vecka": "2026-W48",
          "publicerad": "okänt",
          "markör": "Elprisprognos 23 - 29 november",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "kraftringen",
          "gäller_vecka": "2026-W48",
          "publicerad": "okänt",
          "markör": "Vecka 48",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "skanska",
          "gäller_vecka": "2026-W48",
          "publicerad": "okänt",
          "markör": "Vecka 48",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "vattenfall",
          "gäller_vecka": "2026-W48",
          "publicerad": "2026-11-23",
          "markör": "publicerad 2026-11-23",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "bixia",
          "gäller_vecka": "månad 2026-11",
          "publicerad": "2026-11-23",
          "markör": "publicerad 23 november 2026",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "skekraft",
          "gäller_vecka": "månad 2026-11",
          "publicerad": "2026-11-13",
          "markör": "marknadsläge uppdaterat 2026-11-13",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "goteborg",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "ingen veckoanalys hittad",
          "status": "ej_läsbar",
          "ändrad": null
        },
        {
          "id": "oresundskraft",
          "gäller_vecka": "2026-W47",
          "publicerad": "2026-11-20",
          "markör": "kommentar 2026-11-20",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "malarenergi",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "analystext saknas",
          "status": "ej_läsbar",
          "ändrad": null
        }
      ]
    },
    {
      "tid": "2026-11-25T09:02:32+01:00",
      "anm": "svk: vecka och datum från verktygets sammanfattning (sidan trunkerad). eon: klientfel från webbplatsen",
      "källor": [
        {
          "id": "svk",
          "gäller_vecka": "2026-W48",
          "publicerad": "2026-11-23",
          "markör": "Vecka 48, uppdaterad 23 november 2026",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "eon",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "okänt",
          "status": "ej_läsbar",
          "ändrad": null
        },
        {
          "id": "tibber",
          "gäller_vecka": "2026-W48",
          "publicerad": "okänt",
          "markör": "Elprisprognos 23 - 29 november",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "kraftringen",
          "gäller_vecka": "2026-W48",
          "publicerad": "okänt",
          "markör": "Vecka 48",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "skanska",
          "gäller_vecka": "2026-W48",
          "publicerad": "okänt",
          "markör": "Vecka 48",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "vattenfall",
          "gäller_vecka": "2026-W48",
          "publicerad": "2026-11-23",
          "markör": "publicerad 2026-11-23",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "bixia",
          "gäller_vecka": "månad 2026-11",
          "publicerad": "2026-11-23",
          "markör": "publicerad 23 november 2026",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "skekraft",
          "gäller_vecka": "månad 2026-11",
          "publicerad": "2026-11-13",
          "markör": "marknadsläge uppdaterat 2026-11-13",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "goteborg",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "ingen veckoanalys hittad",
          "status": "ej_läsbar",
          "ändrad": null
        },
        {
          "id": "oresundskraft",
          "gäller_vecka": "2026-W47",
          "publicerad": "2026-11-20",
          "markör": "kommentar 2026-11-20",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "malarenergi",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "analystext saknas",
          "status": "ej_läsbar",
          "ändrad": null
        }
      ]
    },
    {
      "tid": "2026-11-25T15:05:44+01:00",
      "anm": "svk: vecka och datum från verktygets sammanfattning (sidan trunkerad). eon: klientfel från webbplatsen",
      "källor": [
        {
          "id": "svk",
          "gäller_vecka": "2026-W48",
          "publicerad": "2026-11-23",
          "markör": "Vecka 48, uppdaterad 23 november 2026",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "eon",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "okänt",
          "status": "ej_läsbar",
          "ändrad": null
        },
        {
          "id": "tibber",
          "gäller_vecka": "2026-W48",
          "publicerad": "okänt",
          "markör": "Elprisprognos 23 - 29 november",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "kraftringen",
          "gäller_vecka": "2026-W48",
          "publicerad": "okänt",
          "markör": "Vecka 48",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "skanska",
          "gäller_vecka": "2026-W48",
          "publicerad": "okänt",
          "markör": "Vecka 48",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "vattenfall",
          "gäller_vecka": "2026-W48",
          "publicerad": "2026-11-23",
          "markör": "publicerad 2026-11-23",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "bixia",
          "gäller_vecka": "månad 2026-11",
          "publicerad": "2026-11-23",
          "markör": "publicerad 23 november 2026",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "skekraft",
          "gäller_vecka": "månad 2026-11",
          "publicerad": "2026-11-13",
          "markör": "marknadsläge uppdaterat 2026-11-13",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "goteborg",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "ingen veckoanalys hittad",
          "status": "ej_läsbar",
          "ändrad": null
        },
        {
          "id": "oresundskraft",
          "gäller_vecka": "2026-W47",
          "publicerad": "2026-11-20",
          "markör": "kommentar 2026-11-20",
          "status": "läst",
          "ändrad": false
        },
        {
          "id": "malarenergi",
          "gäller_vecka": "okänt",
          "publicerad": "okänt",
          "markör": "analystext saknas",
          "status": "ej_läsbar",
          "ändrad": null
        }
      ]
    }
  ],
  sammanfattning: null
};
