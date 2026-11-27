# KORNING.md – körinstruktion för veckoanalysen

Den här filen är en **fristående instruktion** för den schemalagda uppgiften som uppdaterar fliken
"Prognos denna veckan" i *Abbes verktyg för el*. Följ den ordagrant, steg för steg.

---

## 0. Grundregler (gäller alltid)

1. **Du får bara ändra två filer:** `veckoanalys.js` och `veckoanalys-arkiv.js`.
   `publiceringslogg.js` tillhör mätuppgiften (MATNING.md) – rör den inte.
2. **Rör ALDRIG `index.html`, `korschema.js`, `apparater.js`** eller någon annan fil. Kontrollera före commit (steg 9). Om någon annan fil är ändrad: avbryt utan att pusha.
3. **Hitta aldrig på siffror, datum eller orsaker.** Saknas något: skriv `"okänt"` (text) eller `null` (tal).
4. **Egna ord.** Sidan är publik. Skriv alla sammanfattningar och punkter med egna formuleringar. Kopiera inte meningar från källorna. Det enda som får återges exakt är siffror, i fältet `text` under `siffror`.
5. **Svenska** i all text. Tider i svensk tid (Europe/Stockholm).
6. Formatet för filerna står dokumenterat överst i `veckoanalys.js` (schema 1). Följ det exakt, inklusive fältnamnen med å/ä/ö.

---

## 1. När uppgiften körs

| Körning | Tid (svensk tid) | Fältet `"körning"` |
|---|---|---|
| Måndag | 08:00 | `"mån"` |
| Måndag | 15:00 | `"mån"` |
| Tisdag | 15:00 | `"tis"` |

Varje körning skriver över den förra för samma vecka (steg 2.3). Kl. 08:00 på måndag visar de flesta källor oftast fortfarande förra veckan (test måndag 2026-11-23 kl. 11:38 och 11:55). De utesluts då ur sammanfattningen enligt steg 5, och 15:00-körningen fyller på.

Tiderna som visas i fliken läses från **`korschema.js`**. Ändras körtiderna ändras `korschema.js`, denna tabell och de schemalagda uppgifterna – aldrig `index.html`. Veckoanalysen rör inte `korschema.js`.

Avgör **aktuell ISO-vecka** från dagens datum i svensk tid, i formatet `ÅÅÅÅ-Wvv` (t.ex. `2026-W48`).
`period` är veckans måndag (`"från"`) och söndag (`"till"`).

---

## 2. Läs nuvarande filer och hantera veckobyte

1. Läs `veckoanalys.js` (objektet `window.VECKOANALYS`) och `veckoanalys-arkiv.js` (listan `window.VECKOANALYS_ARKIV`).
2. **Veckobyte:** om `VECKOANALYS.vecka` finns och är **äldre** än aktuell vecka:
   - Lägg hela det gamla objektet **först** i `VECKOANALYS_ARKIV` (senaste veckan först).
   - Samma vecka får bara finnas en gång i arkivet. Finns den redan, ersätt den.
   - Behåll högst 52 veckor i arkivet. Ta bort de äldsta.
3. **Samma vecka:** om `VECKOANALYS.vecka` redan är aktuell vecka **skriver den nya körningen över hela objektet**. Tisdagens körning ersätter alltså måndagens. Arkivet ändras inte.

---

## 3. Läs alla källor

Läs varje källa med webbverktyget (WebFetch). Försök **högst två gånger** per källa. Går den inte att läsa: `status: "ej_läsbar"`.

**Undvik gamla mellanlagrade versioner** (23 nov fick körningen Svenska kraftnäts sida från 20 nov, fast den var uppdaterad till vecka 48):
- Lägg till en unik parameter i adressen: `?las=ÅÅÅÅMMDDTTMM` (eller `&las=…` om adressen redan har `?`). Avvisas adressen med parameter: läs utan.
- Visar en källa en **tidigare vecka** än den aktuella: läs om **en gång** med en ny parameter (`las=ÅÅÅÅMMDDTTMMb`) innan du sätter `förra_veckan`. Skriv i `anm` om omläsningen gav en nyare version.

**Undvik godkännandefrågor (körningen ska gå helt automatiskt).** Vid körningen 24 nov fick Abbe godkänna tre läsningar: en adress som läsagenten själv byggt ihop (Öresundskrafts `…b`-adress), en länk som agenten hittat på en sida (Göteborg Energi) och ett nytt försök mot en webbplats som redan gett fel (E.ON). Läsningar av adresser som stod utskrivna i sin helhet i agentens uppdrag gick igenom utan fråga. Därför:
- Skriv ut **varje fullständig adress** som får läsas i uppdraget till läsagenten, inklusive `?las=…` och `?las=…b`. Skriv aldrig bara "lägg till b" eller "läs utan parametern".
- Läsagenten får **bara** läsa adresser som står utskrivna i sin helhet i uppdraget. Inga egna varianter och inga länkar den hittar på sidorna.
- **Göteborg Energi:** följ inga länkar. Står ingen veckoanalys på sidan i tabellen: `"ej_läsbar"`.
- **E.ON:** ger första läsningen fel från webbplatsen, försök inte igen (inte heller utan parameter). Sätt `"ej_läsbar"`.
- Skicka aldrig ett nytt uppdrag (eller följdmeddelande) till en läsagent om en källa som redan har misslyckats.

| id | Källa | URL | Slag | Särskilt |
|---|---|---|---|---|
| svk | Svenska kraftnät – Information från driften | https://www.svk.se/om-kraftsystemet/kraftsystemdata/information-fran-driften/ | kraftläge | Kraftläge, inte pris. Sidan anger "Vecka NN, uppdaterad <datum>" – använd det för `gäller_vecka` och `publicerad`. Med i enkel vy när den gäller aktuell vecka (steg 5 och 7). |
| eon | E.ON | https://www.eon.se/aktuellt/elmarknaden | vecka | Gick inte att läsa vid test 2026-11-23 (fel från webbplatsen). |
| tibber | Tibber | https://tibber.com/se/elprisprognos | vecka | Anger "exkl. skatter och avgifter" → tolka som exkl. moms och skriv det i `momsnot`. |
| kraftringen | Kraftringen | https://www.kraftringen.se/privat/el/veckans-elprisanalys/ | vecka | |
| skanska | Skånska Energi | https://www.skanska-energi.se/el/veckans-elprisanalys/ | vecka | Har haft samma text som Kraftringen, se steg 5. |
| vattenfall | Vattenfall | https://www.vattenfall.se/elavtal/elmarknaden/elmarknaden-just-nu/ | vecka | |
| bixia | Bixia | https://bixia.se/privat/elavtal/elsituationen-just-nu | månad | Alltid `status: "månadsprognos"`. |
| skekraft | Skellefteå Kraft | https://www.skekraft.se/privat/elavtal/aktuellt-pa-elmarknaden/ | månad | Alltid `status: "månadsprognos"`. |
| goteborg | Göteborg Energi | https://www.goteborgenergi.se/privat/elavtal/elpriser | vecka | Siffror finns i diagram. Följ inga länkar (ger godkännandefråga; länken ledde 24 nov bara till en allmän nyhetssida). Ingen veckoanalys på sidan: `"ej_läsbar"`. |
| oresundskraft | Öresundskraft | https://oresundskraft.se/energikompassen/elmarknaden-just-nu/ | vecka | |
| malarenergi | Mälarenergi | https://www.malarenergi.se/foretag/elavtal-foretag/prognoser-for-elpriset/ | vecka | Analystext saknades vid test. Saknas text: `"ej_läsbar"`. |

`window.VECKOANALYS_KALLOR` i `veckoanalys.js` ska alltid innehålla exakt dessa 11 källor i den här ordningen. `avancerad.källor` ska ha en post per källa i samma ordning.

---

## 4. Avgör vilken vecka varje källa gäller

Gå igenom reglerna i ordning. Den första som passar gäller.

1. **Källan anger veckonummer** ("vecka 48"): `gäller_vecka` = det veckonumret. Saknas år, använd innevarande år. Vid årsskifte: välj det år som ger en vecka närmast idag.
2. **Källan anger ett datum för kommentaren eller publiceringen:** `gäller_vecka` = ISO-veckan för det datumet. **Undantag:** publicerad fredag–söndag och texten säger uttryckligen att den gäller "nästa vecka"/"kommande vecka" → gäller veckan efter.
3. **Inget veckonummer och inget datum:** `gäller_vecka: "okänt"` och `status: "ej_läsbar"` om inget går att använda. Annars `status: "förra_veckan"` och en varning om att veckan inte gick att avgöra.
4. **Månadskällor** (Bixia, Skellefteå Kraft): `gäller_vecka: "månad ÅÅÅÅ-MM"`, `status: "månadsprognos"`.

**Status för veckokällor:**

| Villkor | status |
|---|---|
| `gäller_vecka` = aktuell vecka | `"aktuell"` |
| `gäller_vecka` är en tidigare vecka | `"förra_veckan"` |
| Sidan gick inte att läsa eller saknar analys | `"ej_läsbar"` |

`publicerad`: datum som källan anger (`ÅÅÅÅ-MM-DD`). Annars `"okänt"`. Är datumet orimligt i källan (t.ex. "2026-13-11"), tolka det försiktigt och skriv tolkningen i `anm` med ordet OSÄKERT.

---

## 5. Vilka källor ingår i sammanfattningen

- `i_sammanfattning: true` **endast** för veckokällor med `status: "aktuell"`.
- **Måndagens körning:** källor som fortfarande visar förra veckan **utesluts** ur sammanfattningen (`i_sammanfattning: false`). De visas ändå i den avancerade vyn.
- **Tisdagens körning:** samma regel. Den skriver över måndagens fil för samma vecka (steg 2.3).
- Månadskällor ingår **aldrig** i veckans sammanfattning.
- **Svenska kraftnät:** `status` enligt samma tabell som veckokällorna. `i_sammanfattning: true` när den gäller aktuell vecka. Den räknas **aldrig** som veckokälla: inte i spärren "färre än 3", inte i "Aktuella veckokällor" och aldrig som grund för `riktning`.
- **Skånska Energi och Kraftringen:** är texterna i sak identiska räknas de som **en** källa. Använd bara `kraftringen` i `enkel` och sätt `i_sammanfattning: false` för `skanska`, med `anm: "Samma text som Kraftringen – räknas som en källa."`. Är texterna olika räknas de som två källor.

---

## 6. Fyll i siffror och orsaker (avancerad)

För varje siffra som står **i text** hos källan:

| Fält | Regel |
|---|---|
| `text` | Exakt som källan skriver det, t.ex. `"cirka 50 öre/kWh"` |
| `värde` / `värde_max` | Talet. Vid intervall ("58–60"): `värde` = 58, `värde_max` = 60. Annars `värde_max: null` |
| `enhet` | Som källan, t.ex. `"öre/kWh"` |
| `elområde` | `"SE1"`–`"SE4"`, eller `"SE1+SE2"` om källan slår ihop. Annars `"okänt"` |
| `momsstatus` | `"exkl"` eller `"inkl"` bara om källan säger det. Annars `"okänt"`. Förklara tolkningar i `momsnot` |
| `typ` | `"FAKTA"` = utfall, `"PROGNOS"` = prognos eller terminspris enligt källan, `"OSÄKERT"` = oklar uppgift |
| `period` | Vad siffran gäller, t.ex. `"vecka 47 (16–22 nov), snittpris"` eller `"terminspris för december 2026"` |

- Siffror som **bara finns i diagram** tas inte med. Räkna inte om och gissa inte.
- Räkna **aldrig** om moms i datafilen. Fliken gör det själv (× 1,25 eller ÷ 1,25) och visar uträkningen.
- `orsaker`: välj bland `vind`, `kärnkraft`, `överföring`, `väder`, `temperatur`, `vattenläge`, `gas`, `sol`, `efterfrågan`. Ta bara med orsaker som källan nämner.
- `sammanfattning`: 2–4 meningar med **egna ord**.
- `riktning_per_område`: objekt med exakt nycklarna `"SE1"`, `"SE2"`, `"SE3"`, `"SE4"`. Värde `"upp"`, `"ned"` eller `"oförändrat"` **bara** om källan uttryckligen säger att priset i det elområdet blir högre, lägre eller ungefär som förra veckan, för den vecka källan gäller. Annars `"okänt"`. Gissa aldrig. Gäller alla källor utom `"svk"` (sätt alla fyra till `"okänt"` för svk). Används i fliken för att jämföra källornas prognos med Ei:s utfall ("facit").

---

## 7. Skriv den enkla vyn (enkel)

Underlag: **endast** källor med `i_sammanfattning: true`.

- `sammanfattning`: 1–2 meningar i vardagsspråk. Är underlaget tunt (färre än 3 aktuella källor), skriv det.
- `punkter`: 3–6 korta punkter i vardagsspråk. Om möjligt: blir det dyrt eller billigt, när i veckan, och varför. Förklara facktermer ("vindkraften ger mindre el" i stället för "låg vindkraftsproduktion"). Varje punkt har `källor: [id, …]` med de källor den bygger på.
- `elområden`: alltid fyra poster i ordningen SE1, SE2, SE3, SE4.
  - `riktning` = `"upp"`, `"ned"` eller `"oförändrat"` **bara** om en aktuell källa uttryckligen jämför med förra veckan för det elområdet. Annars `"okänt"`.
  - `text`: en kort mening. SE2 är viktigast (användarna sitter i SE2).
- **`elsystemet` – Läget i elsystemet (Svenska kraftnät). Det viktigaste i fliken; visas överst i enkel vy.** Fyll `enkel.elsystemet = { punkter: [ { text } ] }` med 3–6 punkter i vardagsspråk ur Svenska kraftnäts senaste driftsida, så länge den är **högst 7 dagar gammal** (även om den gäller förra veckan – sidan visar då själv att den är från en tidigare vecka). Ta med det som finns: driftchefens bedömning av priset, kärnkraft per reaktor med datum (i drift / avställd / väntas tillbaka), reservkraft, stamnätet, vattenmagasin, gas/omvärld, risk för effektbrist. Börja punkten med ämnet ("Kärnkraft: …"). Egna ord. Äldre än 7 dagar eller ej läsbar: utelämna `elsystemet`.
- I `punkter` (Det här påverkar priset) får `"svk"` läggas till i en elbolagspunkt som säger samma sak, och högst 1 egen svk-punkt om något påverkar priset och inte redan står i `elsystemet`. Svenska kraftnät får nämnas i `sammanfattning`, men aldrig som prisprognos eller grund för `riktning`.
- Finns inga aktuella källor: skriv en punkt om att ingen källa har publicerat veckans analys än, och sätt alla riktningar till `"okänt"`.

---

## 8. Varningar och spärrar

Lägg till i `varningar` (i den här ordningen, bara de som gäller):

1. **Färre än 3 aktuella veckokällor** (räkna Kraftringen och Skånska Energi som en om de är identiska):
   `"Färre än 3 elbolag har publicerat sin veckoanalys (N: <namn>). Prisdelen bygger bara på dem; läget i elsystemet kommer från Svenska kraftnät."` (Svenska kraftnät räknas inte här. Utan `elsystemet`: avsluta efter "bara på dem.")
   → **Pusha ändå**, men med varningen i filen och i commit-meddelandet (steg 9).
2. Måndagens körning, om källor visar förra veckan:
   `"Måndagskörning: N källor visar fortfarande vecka V och ingår inte i sammanfattningen (<namn>)."`
3. Källor som inte gick att läsa: `"<namn>, … gick inte att läsa."`
4. Övrigt som påverkar tillförlitligheten, t.ex. ett orimligt datum i en källa.

---

## 9. Kontrollera, committa och pusha

1. **Syntaxkontroll:** filerna ska gå att köra som JavaScript. Kör t.ex.
   `node -e "global.window={};require('./veckoanalys.js');require('./veckoanalys-arkiv.js');"`
   Kontrollera att:
   - `vecka` matchar `^\d{4}-W\d{2}$` och är aktuell vecka.
   - `avancerad.källor` har 11 poster med samma id som `VECKOANALYS_KALLOR`.
   - `enkel.elområden` har SE1–SE4.
   - varje post i `avancerad.källor` har `riktning_per_område` med SE1–SE4 och bara värdena upp/ned/oförändrat/okänt.
   - `VECKOANALYS_ARKIV` är en lista.
2. **Spärr för index.html:** `git status --porcelain` får bara visa `veckoanalys.js` och/eller `veckoanalys-arkiv.js`. Visas något annat (särskilt `index.html`): **avbryt, pusha inte**, och rapportera.
3. **Commit-meddelande** (en rad):
   - Normalt: `Veckoanalys 2026-W48 (mån): 4 aktuella källor`
   - Med spärren: `Veckoanalys 2026-W48 (mån): 1 aktuell källa [VARNING: färre än 3 aktuella källor]`
   - Vid veckobyte: lägg till ` – vecka 2026-W47 flyttad till arkivet`
4. Pusha till `main`. Inga andra grenar och ingen force-push.
   Nekas pushen för att `main` har ändrats (t.ex. för att den andra schemalagda uppgiften pushade samtidigt):
   kör `git fetch --depth 50 origin main` och `git rebase origin/main`, kontrollera `git status` igen och pusha en gång till.
   Nekas den igen: avbryt och rapportera.

---

## 10. Rapport efter körningen

Skriv en kort rapport på svenska: vilken vecka, antal aktuella källor och vilka, vilka som inte gick att läsa, vilka varningar som skrevs, och commit-id. Ange tydligt om spärren slog till.
