# MATNING.md – tillfällig mätning av när källorna publicerar

Fristående instruktion för en **tillfällig** schemalagd uppgift. Syftet är att ta reda på vilka
veckodagar och tider de 11 källorna i fliken "Prognos denna veckan" byter till en ny vecka.
Resultatet används för att välja de bästa tiderna för veckoanalysen (KORNING.md).
Följ instruktionen ordagrant.

---

## 0. Grundregler

1. **Du får bara ändra en fil: `publiceringslogg.js`.** Rör aldrig `index.html`, `veckoanalys.js`,
   `veckoanalys-arkiv.js`, `korschema.js`, `apparater.js`, `KORNING.md` eller någon annan fil.
2. **Hitta inte på något.** Det som inte står på sidan blir `"okänt"`.
3. **Kopiera ingen analystext** (repot är publikt). Spara bara korta markörer, till exempel en rubrik som "Vecka 47"
   eller ett datum, högst 10 ord.
4. Alla tider i svensk tid (Europe/Stockholm).

---

## 1. Period och tider

| | |
|---|---|
| Första mätning | måndag 2026-11-23 kl. 15:00 |
| Sista mätning | fredag 2026-12-04 kl. 15:00 |
| Tider | vardagar (mån–fre) kl. 09:00 och 15:00 |
| Antal mätningar | 19 (1 + 8 + 10) |

**Stopp:** om dagens datum i svensk tid är **efter 2026-12-04**: gör ingenting, ändra ingen fil,
och rapportera: "Mätningen är klar – ta bort den schemalagda uppgiften 'Mätning publiceringstider'."

---

## 2. Läs källorna

Läs varje källa en gång med webbverktyget (WebFetch). Försök högst två gånger om läsningen misslyckas.
Lägg till en unik parameter i adressen, `?las=ÅÅÅÅMMDDTTMM` (eller `&las=…`), så att du inte får en gammal mellanlagrad version. Avvisas adressen med parameter: läs utan.
För att slippa godkännandefrågor: skriv ut varje fullständig adress i uppdraget till läsagenten och låt den bara läsa just dem (inga egna varianter, inga länkar från sidorna). Ger E.ON fel från webbplatsen: försök inte igen.

| id | URL |
|---|---|
| svk | https://www.svk.se/om-kraftsystemet/kraftsystemdata/information-fran-driften/ |
| eon | https://www.eon.se/aktuellt/elmarknaden |
| tibber | https://tibber.com/se/elprisprognos |
| kraftringen | https://www.kraftringen.se/privat/el/veckans-elprisanalys/ |
| skanska | https://www.skanska-energi.se/el/veckans-elprisanalys/ |
| vattenfall | https://www.vattenfall.se/elavtal/elmarknaden/elmarknaden-just-nu/ |
| bixia | https://bixia.se/privat/elavtal/elsituationen-just-nu |
| skekraft | https://www.skekraft.se/privat/elavtal/aktuellt-pa-elmarknaden/ |
| goteborg | https://www.goteborgenergi.se/privat/elavtal/elpriser |
| oresundskraft | https://oresundskraft.se/energikompassen/elmarknaden-just-nu/ |
| malarenergi | https://www.malarenergi.se/foretag/elavtal-foretag/prognoser-for-elpriset/ |

Fyll i för varje källa:

| Fält | Innehåll |
|---|---|
| `id` | Från tabellen ovan |
| `gäller_vecka` | Den vecka källans text gäller (`"ÅÅÅÅ-Wvv"`), `"månad ÅÅÅÅ-MM"` för månadsprognoser, annars `"okänt"`. Samma regler som i KORNING.md steg 4 |
| `publicerad` | Datum (och tid om det finns) som sidan anger, annars `"okänt"` |
| `markör` | Kort markör som visar vilken version sidan har, t.ex. rubriken `"Vecka 47"` eller `"Elprisprognos 16 - 22 november"`. Högst 10 ord |
| `status` | `"läst"` eller `"ej_läsbar"` |
| `ändrad` | `true` om `gäller_vecka`, `publicerad` eller `markör` skiljer sig från källans senaste post i loggen. `false` om allt är lika. `null` vid första mätningen eller om källan inte gick att läsa |

---

## 3. Skriv loggen

`publiceringslogg.js` har formatet:

```js
window.PUBLICERINGSLOGG = {
  start: "2026-11-23",
  slut: "2026-12-04",
  "mätningar": [
    { tid: "2026-11-23T15:00:00+01:00", "källor": [ { id, "gäller_vecka", publicerad, "markör", status, "ändrad" }, … ] },
    …
  ],
  sammanfattning: null
};
```

1. Läs den befintliga filen.
2. Lägg till **en ny post sist** i `mätningar`, med körningens tid och alla 11 källor i tabellens ordning.
   Ändra inga tidigare poster.
3. **Bara vid sista mätningen (fredag 2026-12-04 kl. 15:00):** fyll i `sammanfattning` som en lista med en post per källa:
   `{ id, "nya_veckor": [ { vecka, "första_gång_sedd": "ÅÅÅÅ-MM-DDTtt:mm", "veckodag": "måndag" } ], kommentar }`.
   `första_gång_sedd` är tiden för den första mätningen där källan visade den nya veckan.
   `kommentar` är en kort mening med egna ord om källans mönster, eller "okänt".

---

## 4. Kontrollera, committa och pusha

1. Kontrollera att filen går att köra:
   `node -e "global.window={};require('./publiceringslogg.js');console.log(window.PUBLICERINGSLOGG['mätningar'].length)"`
2. `git status --porcelain` får **bara** visa `publiceringslogg.js`. Visas något annat: avbryt utan att pusha och rapportera.
3. Commit-meddelande (en rad):
   `Publiceringslogg 2026-11-24 09:00: N ändrade källor (id, id)`, eller `… 0 ändrade källor` om inget ändrats.
4. Pusha till `main`. Ingen force-push.
   Nekas pushen för att `main` har ändrats (t.ex. för att den andra schemalagda uppgiften pushade samtidigt):
   kör `git fetch --depth 50 origin main` och `git rebase origin/main`, kontrollera `git status` igen och pusha en gång till.
   Nekas den igen: avbryt och rapportera.

---

## 5. Rapport

Kort rapport på svenska: mätningens tid, vilka källor som ändrats sedan förra mätningen och till vilken vecka,
vilka som inte gick att läsa, och commit-id.
