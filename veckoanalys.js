/* ============================================================================
   veckoanalys.js – data för fliken "Prognos denna veckan" i Abbes verktyg för el
   ----------------------------------------------------------------------------
   Skrivs av den schemalagda uppgiften (se KORNING.md). index.html läser filen med
   <script src> så att den fungerar både lokalt (file://) och på GitHub Pages.
   Ändra ALDRIG index.html från den schemalagda uppgiften – bara denna fil och
   veckoanalys-arkiv.js.

   UPPDATERAS: se korschema.js (just nu måndag kl. 15:00 och tisdag kl. 16:00, svensk tid).
   VECKA: fältet "vecka" anger vilken ISO-vecka analysen gäller. Varje källa har
   "gäller_vecka" = den vecka källans egen text gäller. Bara källor vars
   gäller_vecka = vecka räknas med i sammanfattningen.

   SCHEMA (version 1)
   window.VECKOANALYS_KALLOR = [            // fast lista med alla källor som läses
     { id, namn, url, slag, anm }           // slag: "vecka" | "månad" | "kraftläge"
   ]

   window.VECKOANALYS = {
     schema: 1,
     vecka: "ÅÅÅÅ-Wvv",                      // ISO-vecka som analysen gäller, t.ex. "2026-W48"
     period: { "från": "ÅÅÅÅ-MM-DD", "till": "ÅÅÅÅ-MM-DD" },   // måndag–söndag
     uppdaterad: "ÅÅÅÅ-MM-DDTtt:mm:ss+01:00",// ISO-tid för körningen (svensk tid)
     "körning": "mån" | "tis",              // vilken av veckans två körningar som skrev filen

     enkel: {                               // för vanliga personer, vardagsspråk
       sammanfattning: "kort text",         // 1–2 meningar
       punkter: [ { text, "källor": ["id", …] } ],          // 3–6 punkter
       elsystemet: { punkter: [ { text } ] },               // 3–6 punkter från Svenska kraftnät (läget i elsystemet)
       "elområden": [                        // alltid SE1, SE2, SE3, SE4
         { "elområde": "SE2", riktning: "upp"|"ned"|"oförändrat"|"okänt",
           text: "kort förklaring", "källor": ["id", …] }
       ]
     },

     avancerad: {
       "källor": [ {                         // en post per källa i VECKOANALYS_KALLOR
         id, namn, url,
         "gäller_vecka": "ÅÅÅÅ-Wvv" | "månad ÅÅÅÅ-MM" | "okänt",
         publicerad: "ÅÅÅÅ-MM-DD" | "okänt",
         status: "aktuell" | "förra_veckan" | "ej_läsbar" | "månadsprognos",
         "i_sammanfattning": true | false,  // false om källan inte gäller aktuell vecka
         siffror: [ {
           "elområde": "SE1".."SE4" | "SE1+SE2" | "okänt",
           "värde": tal | null,             // källans värde (nedre gräns vid intervall)
           "värde_max": tal | null,         // övre gräns vid intervall, annars null
           text: "exakt som källan skriver det",
           enhet: "öre/kWh" | …,
           momsstatus: "exkl" | "inkl" | "okänt",
           momsnot: "valfri förklaring av momsstatus",
           typ: "FAKTA" | "PROGNOS" | "OSÄKERT",   // FAKTA = utfall, PROGNOS = enligt källa
           period: "vad siffran gäller, t.ex. 'vecka 47' eller 'december'"
         } ],
         orsaker: ["vind","kärnkraft","överföring","väder","temperatur","vattenläge","gas","sol","efterfrågan"],
         sammanfattning: "egna ord – ingen kopierad text (sidan är publik)",
         anm: "valfritt, t.ex. 'samma text som Kraftringen'"
       } ]
     },

     varningar: ["text", …]                 // visas överst i fliken
   }
   ============================================================================ */

window.VECKOANALYS_KALLOR = [
  { id: "svk", namn: "Svenska kraftnät – Information från driften", url: "https://www.svk.se/om-kraftsystemet/kraftsystemdata/information-fran-driften/", slag: "kraftläge", anm: "Kraftläge, inte pris. Med i enkel vy när den gäller aktuell vecka." },
  { id: "eon", namn: "E.ON", url: "https://www.eon.se/aktuellt/elmarknaden", slag: "vecka", anm: "" },
  { id: "tibber", namn: "Tibber", url: "https://tibber.com/se/elprisprognos", slag: "vecka", anm: "" },
  { id: "kraftringen", namn: "Kraftringen", url: "https://www.kraftringen.se/privat/el/veckans-elprisanalys/", slag: "vecka", anm: "" },
  { id: "skanska", namn: "Skånska Energi", url: "https://www.skanska-energi.se/el/veckans-elprisanalys/", slag: "vecka", anm: "Har haft samma text som Kraftringen – räknas som en källa i sammanfattningen." },
  { id: "vattenfall", namn: "Vattenfall", url: "https://www.vattenfall.se/elavtal/elmarknaden/elmarknaden-just-nu/", slag: "vecka", anm: "" },
  { id: "bixia", namn: "Bixia", url: "https://bixia.se/privat/elavtal/elsituationen-just-nu", slag: "månad", anm: "Månadsprognos." },
  { id: "skekraft", namn: "Skellefteå Kraft", url: "https://www.skekraft.se/privat/elavtal/aktuellt-pa-elmarknaden/", slag: "månad", anm: "Månadsprognos." },
  { id: "goteborg", namn: "Göteborg Energi", url: "https://www.goteborgenergi.se/privat/elavtal/elpriser", slag: "vecka", anm: "Siffror i diagram – följ deras länk till veckoanalysen." },
  { id: "oresundskraft", namn: "Öresundskraft", url: "https://oresundskraft.se/energikompassen/elmarknaden-just-nu/", slag: "vecka", anm: "" },
  { id: "malarenergi", namn: "Mälarenergi", url: "https://www.malarenergi.se/foretag/elavtal-foretag/prognoser-for-elpriset/", slag: "vecka", anm: "Analystext har saknats vid test." }
];

window.VECKOANALYS = {
  schema: 1,
  vecka: "2026-W48",
  period: { "från": "2026-11-23", "till": "2026-11-29" },
  uppdaterad: "2026-11-24T16:15:00+01:00",
  "körning": "tis",

  enkel: {
    sammanfattning: "Tre elbolag har nu publicerat veckans analys (Tibber, Kraftringen och Vattenfall). Kyla och allt svagare vind gör att elpriset väntas bli högt, mest i södra Sverige, och även i norr blir det dyrt mitt i veckan innan priset sjunker mot helgen.",
    punkter: [
      { text: "Norra Sverige (SE1 och SE2): Tibber räknar med ungefär 60 öre/kWh i snitt, utan skatter och avgifter. Billigt i början av veckan, klart dyrare på torsdag och fredag när det nästan slutar blåsa, och billigare igen i helgen. Långvarig kyla kan dessutom ge is i älvarna, så att vattenkraften ger mindre el.", "källor": ["tibber", "svk"] },
      { text: "Södra Sverige: Tibber räknar med ungefär 170 öre/kWh i SE3 och 255 öre/kWh i SE4, utan skatter och avgifter. Dyrt hela veckan, dyrast mitt i veckan.", "källor": ["tibber", "kraftringen", "vattenfall"] },
      { text: "Det är kallare än vanligt, enligt Kraftringen 3–4 grader under det normala. När det är kallt går det åt mer el till uppvärmning, och då stiger priset.", "källor": ["kraftringen", "tibber", "vattenfall"] },
      { text: "Det blåser mindre, så vindkraftverken ger mindre el – bara omkring tre fjärdedelar av det vanliga, och minst kring torsdag.", "källor": ["kraftringen", "tibber", "vattenfall", "svk"] },
      { text: "Elnätet kan inte föra ned tillräckligt med el från norr till söder, främst mellan SE2 och SE3. Därför blir prisskillnaden mellan norra och södra Sverige stor.", "källor": ["kraftringen", "tibber", "vattenfall", "svk"] },
      { text: "Fler kärnkraftverk kommer tillbaka och det hjälper, men inte hela vägen: en reaktor i Ringhals står still till december. Lite vatten i magasinen och dyr gas i Europa håller också uppe priset.", "källor": ["kraftringen", "tibber", "vattenfall", "svk"] }
    ],
    elsystemet: {
      punkter: [
        { text: "Elpriset: priset i södra Sverige har tidvis varit högt. När årets underhåll av kraftverken är klart och mer el kan styras fram i söder bör priserna sjunka de kommande veckorna." },
        { text: "Kärnkraft: Forsmark 3 är igång sedan 18 november. Forsmark 1 kör med ena halvan sedan 18 november och andra halvan väntas 27 november. Ringhals 4 väntades tillbaka 23 november och Ringhals 3 först 20 december." },
        { text: "Reservkraft: Karlshamnsverket (block 2, 330 MW) står i reserv 16 november–15 mars och kan startas om elen inte räcker." },
        { text: "Stamnätet: underhåll och utbyggnad ger avbrott som begränsar hur mycket el som kan föras över, men ska ge ett starkare nät inför vintern." },
        { text: "Vatten och gas: Norges vattenmagasin är lägre än normalt, mest i söder, och Europas gaslager är låga. Tillsammans med ett osäkert omvärldsläge håller det uppe priset." },
        { text: "Risk för elbrist: marginalerna i elsystemet bedöms som goda de närmaste tre dagarna, så risken är låg. Vindkraften väntas ge minst el på torsdag, samtidigt som förbrukningen är som högst." }
      ]
    },
    "elområden": [
      { "elområde": "SE1", riktning: "okänt", text: "Tibber räknar med cirka 60 öre/kWh i snitt (utan skatter och avgifter), dyrast torsdag–fredag. Ingen källa jämför uttryckligen med förra veckan.", "källor": ["tibber"] },
      { "elområde": "SE2", riktning: "okänt", text: "Tibber räknar med cirka 60 öre/kWh i snitt (utan skatter och avgifter): billigt i början av veckan, dyrt torsdag–fredag när vinden nästan försvinner, billigare i helgen. Ingen källa jämför uttryckligen med förra veckan.", "källor": ["tibber"] },
      { "elområde": "SE3", riktning: "okänt", text: "Tibber räknar med cirka 170 öre/kWh i snitt (utan skatter och avgifter), högt hela veckan och dyrast mitt i veckan.", "källor": ["tibber", "kraftringen", "vattenfall"] },
      { "elområde": "SE4", riktning: "okänt", text: "Dyraste elområdet: Tibber räknar med cirka 255 öre/kWh i snitt (utan skatter och avgifter), bland annat för att överföringen från SE3 är begränsad.", "källor": ["tibber", "kraftringen"] }
    ]
  },

  avancerad: {
    "källor": [
      {
        id: "svk", namn: "Svenska kraftnät – Information från driften", url: "https://www.svk.se/om-kraftsystemet/kraftsystemdata/information-fran-driften/",
        "gäller_vecka": "2026-W48", publicerad: "2026-11-23", status: "aktuell", "i_sammanfattning": true,
        siffror: [],
        orsaker: ["kärnkraft", "överföring", "vattenläge", "gas", "vind"],
        sammanfattning: "Driftsidan gäller vecka 48 och uppdaterades 23 november. Priserna i södra Sverige har tidvis varit höga; slutet på revisionssäsongen och mer planerbar produktion i söder väntas sänka dem de kommande veckorna. Forsmark 3 och ena generatorn i Forsmark 1 är i drift sedan 18 november, Forsmark 1:s andra generator väntas 27 november, Ringhals 4 väntades 23 november och Ringhals 3 den 20 december. Strategisk reserv (Karlshamnsverket block 2, 330 MW) finns 16 november–15 mars. Underhåll i stamnätet begränsar överföringen. Låga norska magasin, låga gaslager och ett osäkert omvärldsläge bidrar till högre priser. Marginalerna bedöms goda de närmaste tre dagarna. Vindprognosen visar lägst vindkraft torsdag 26 november, då även förbrukningen väntas vara högst.",
        anm: "Kraftläge, inte pris. Läst med parametern las=202611241611 vid första försöket; sidan visade vecka 48."
      },
      {
        id: "eon", namn: "E.ON", url: "https://www.eon.se/aktuellt/elmarknaden",
        "gäller_vecka": "okänt", publicerad: "okänt", status: "ej_läsbar", "i_sammanfattning": false,
        siffror: [], orsaker: [],
        sammanfattning: "Sidan gick inte att läsa med webbverktyget (fel från webbplatsen, både med och utan parameter).",
        anm: ""
      },
      {
        id: "tibber", namn: "Tibber", url: "https://tibber.com/se/elprisprognos",
        "gäller_vecka": "2026-W48", publicerad: "okänt", status: "aktuell", "i_sammanfattning": true,
        siffror: [
          { "elområde": "SE1+SE2", "värde": 60, "värde_max": null, text: "cirka 60 öre/kWh", enhet: "öre/kWh", momsstatus: "exkl", momsnot: "Källan skriver 'exkl. skatter och avgifter'; tolkas som exkl. moms.", typ: "PROGNOS", period: "vecka 48 (23–29 nov), snittpris" },
          { "elområde": "SE3", "värde": 170, "värde_max": null, text: "runt 170 öre/kWh", enhet: "öre/kWh", momsstatus: "exkl", momsnot: "Källan skriver 'exkl. skatter och avgifter'; tolkas som exkl. moms.", typ: "PROGNOS", period: "vecka 48 (23–29 nov), snittpris" },
          { "elområde": "SE4", "värde": 255, "värde_max": null, text: "cirka 255 öre/kWh", enhet: "öre/kWh", momsstatus: "exkl", momsnot: "Källan skriver 'exkl. skatter och avgifter'; tolkas som exkl. moms.", typ: "PROGNOS", period: "vecka 48 (23–29 nov), snittpris" }
        ],
        orsaker: ["väder", "temperatur", "vind", "vattenläge", "kärnkraft", "gas", "överföring"],
        sammanfattning: "Prognosen gäller 23–29 november. Ett högtryck ger kyla, hård i norr och mildare i söder. I norr börjar veckan billigt men priset stiger kraftigt torsdag–fredag när vinden nästan upphör och sjunker i helgen; frost kan ge is i älvarna som bromsar vattenkraften. I söder ligger priset högt hela veckan med topp mitt i veckan, eftersom svag nordisk vind gör att priserna följer kontinenten, gasen är dyr, en Ringhalsreaktor står still till mitten av december och överföringen mellan SE3 och SE4 är begränsad.",
        anm: "Sidans rubrik anger vecka 48 (23–29 november)."
      },
      {
        id: "kraftringen", namn: "Kraftringen", url: "https://www.kraftringen.se/privat/el/veckans-elprisanalys/",
        "gäller_vecka": "2026-W48", publicerad: "okänt", status: "aktuell", "i_sammanfattning": true,
        siffror: [],
        orsaker: ["temperatur", "vind", "efterfrågan", "vattenläge", "kärnkraft", "överföring", "gas", "sol"],
        sammanfattning: "Analysen för vecka 48 väntar höga priser i hela landet, högst i söder. Det är 3–4 grader kallare än normalt och vinden ligger kring 75 procent av det normala, samtidigt som uppvärmningen ökar förbrukningen. Underskottet i vattenbalansen väntas växa till runt 19 TWh. Kärnkraften når omkring 76 procents tillgänglighet men väger inte upp. Överföringen norrut–söderut är begränsad, främst SE2–SE3. Gaspriset steg i början av veckan och solkraften bidrar lite. Inga prissiffror i texten; prognosen finns bara i diagram.",
        anm: ""
      },
      {
        id: "skanska", namn: "Skånska Energi", url: "https://www.skanska-energi.se/el/veckans-elprisanalys/",
        "gäller_vecka": "2026-W48", publicerad: "okänt", status: "aktuell", "i_sammanfattning": false,
        siffror: [],
        orsaker: ["temperatur", "vind", "efterfrågan", "vattenläge", "kärnkraft", "överföring", "gas", "sol"],
        sammanfattning: "Gäller vecka 48. Själva analysen är ord för ord densamma som Kraftringens, utan prissiffror; bara inledning, tips och kontaktuppgifter skiljer.",
        anm: "Samma text som Kraftringen – räknas som en källa."
      },
      {
        id: "vattenfall", namn: "Vattenfall", url: "https://www.vattenfall.se/elavtal/elmarknaden/elmarknaden-just-nu/",
        "gäller_vecka": "2026-W48", publicerad: "2026-11-23", status: "aktuell", "i_sammanfattning": true,
        siffror: [
          { "elområde": "SE3", "värde": 142, "värde_max": null, text: "omkring 142 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "PROGNOS", period: "terminspris för december 2026" },
          { "elområde": "SE3", "värde": 72, "värde_max": null, text: "72 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "FAKTA", period: "samma period förra året (jämförelse; SE3 framgår av sammanhanget, inte uttryckligen)" }
        ],
        orsaker: ["temperatur", "efterfrågan", "vind", "överföring", "kärnkraft", "vattenläge", "gas"],
        sammanfattning: "Veckan inleds kallare än normalt och med svag vind, vilket höjer efterfrågan och sänker vindkraften. Begränsningar i nätet mellan norr och söder ökar prisskillnaderna. Priserna är fortsatt höga, främst i södra Sverige. Marknaden prisar december i SE3 ungefär dubbelt så högt som för ett år sedan. Återstartade reaktorer under november–december kan dämpa priserna.",
        anm: "Samma kommentar som i måndagens körning. Terminspriset är marknadens förväntan, inte vad kunden betalar."
      },
      {
        id: "bixia", namn: "Bixia", url: "https://bixia.se/privat/elavtal/elsituationen-just-nu",
        "gäller_vecka": "månad 2026-11", publicerad: "2026-11-23", status: "månadsprognos", "i_sammanfattning": false,
        siffror: [
          { "elområde": "SE1+SE2", "värde": 37, "värde_max": null, text: "37 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "OSÄKERT", period: "snittpris november 2026 (anges inte om det är utfall hittills eller prognos)" },
          { "elområde": "SE3", "värde": 176, "värde_max": null, text: "176 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "OSÄKERT", period: "snittpris november 2026 (anges inte om det är utfall hittills eller prognos)" },
          { "elområde": "SE4", "värde": 267, "värde_max": null, text: "267 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "OSÄKERT", period: "snittpris november 2026 (anges inte om det är utfall hittills eller prognos)" },
          { "elområde": "SE1", "värde": 59, "värde_max": null, text: "cirka 59 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "PROGNOS", period: "november–december 2026" },
          { "elområde": "SE2", "värde": 58, "värde_max": 60, text: "cirka 58–60 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "PROGNOS", period: "november–december 2026" },
          { "elområde": "SE3", "värde": 103, "värde_max": 106, text: "cirka 103–106 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "PROGNOS", period: "november–december 2026" },
          { "elområde": "SE4", "värde": 159, "värde_max": null, text: "cirka 159 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "PROGNOS", period: "november 2026" },
          { "elområde": "SE4", "värde": 147, "värde_max": null, text: "cirka 147 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "PROGNOS", period: "december 2026" },
          { "elområde": "SE1", "värde": 68, "värde_max": null, text: "cirka 68 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "PROGNOS", period: "januari–mars 2027" },
          { "elområde": "SE2", "värde": 66, "värde_max": null, text: "cirka 66 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "PROGNOS", period: "januari–mars 2027" },
          { "elområde": "SE3", "värde": 119, "värde_max": null, text: "cirka 119 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "PROGNOS", period: "januari–mars 2027" },
          { "elområde": "SE4", "värde": 145, "värde_max": null, text: "cirka 145 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "PROGNOS", period: "januari–mars 2027" }
        ],
        orsaker: ["vind", "kärnkraft", "vattenläge", "gas", "väder"],
        sammanfattning: "Uppdaterad 23 november. Priserna har stigit kraftigt i hela landet jämfört med oktober, lägst i norr och högst i SE4, och skillnaden mellan norr och söder är fortsatt stor. Som orsaker nämns svag vind, problem i kärnkraften, låga vattennivåer och dyra bränslen. När kärnkraften kommer igång väntas skillnaderna mellan elområdena minska. Södra Sverige påverkas av högre priser i Europa.",
        anm: "OSÄKERT: sidan anger 23 november 2026, men prognossiffrorna för november–december är desamma som när sidan var daterad 21 oktober, och de ligger långt under sidans 'snittpris november'. Prognosdelen kan alltså vara från oktober."
      },
      {
        id: "skekraft", namn: "Skellefteå Kraft", url: "https://www.skekraft.se/privat/elavtal/aktuellt-pa-elmarknaden/",
        "gäller_vecka": "månad 2026-11", publicerad: "2026-11-13", status: "månadsprognos", "i_sammanfattning": false,
        siffror: [],
        orsaker: ["efterfrågan", "vind", "gas", "sol", "kärnkraft", "överföring"],
        sammanfattning: "Väntar högre priser i alla elområden i november, mest i söder, på grund av säsongens högre förbrukning, svagare vind, mindre solkraft i Europa och dyra råvaror. Hittills i november har snittpriset i SE2 legat lägre än i oktober, medan SE1 stigit något och SE3 och SE4 kraftigt. I december väntas priset stiga i norr men sjunka i söder, och i januari sjunka i hela landet när mer kärnkraft kommer tillbaka.",
        anm: "Marknadsläget anges uppdaterat 2026-11-13; sidan ändrades senast 2026-11-18 enligt dess metadata. Inga siffror i texten."
      },
      {
        id: "goteborg", namn: "Göteborg Energi", url: "https://www.goteborgenergi.se/privat/elavtal/elpriser",
        "gäller_vecka": "okänt", publicerad: "okänt", status: "ej_läsbar", "i_sammanfattning": false,
        siffror: [], orsaker: [],
        sammanfattning: "Priserna finns bara i diagram. Sidans länkar till analysen leder till samma sida eller till en allmän nyhetssida utan veckoanalys av elmarknaden. Texten har bara exempel på vad hushållsapparater kostar i dag.",
        anm: ""
      },
      {
        id: "oresundskraft", namn: "Öresundskraft", url: "https://oresundskraft.se/energikompassen/elmarknaden-just-nu/",
        "gäller_vecka": "2026-W47", publicerad: "2026-11-20", status: "förra_veckan", "i_sammanfattning": false,
        siffror: [
          { "elområde": "SE4", "värde": 157, "värde_max": null, text: "cirka 157 öre/kWh, exklusive moms och övriga avgifter", enhet: "öre/kWh", momsstatus: "exkl", momsnot: "", typ: "FAKTA", period: "oktober 2026 (utfall, snittspotpris)" }
        ],
        orsaker: ["kärnkraft", "väder", "temperatur", "vind", "vattenläge", "efterfrågan"],
        sammanfattning: "Senaste kommentaren är från 20 november (vecka 47). Kallt väder utan vind kan pressa priserna uppåt. Södra Sverige väntas ha fortsatt höga och svängiga priser i november. Ringhals 4:s återstart kan dämpa priserna, men Ringhals 3 är försenad till 20 december, så höga priser kan dröja kvar.",
        anm: "Omläsning med ny parameter (las=202611241611b) gav samma version. Siffran för oktober kommer från en tidigare kommentar (15 november)."
      },
      {
        id: "malarenergi", namn: "Mälarenergi", url: "https://www.malarenergi.se/foretag/elavtal-foretag/prognoser-for-elpriset/",
        "gäller_vecka": "okänt", publicerad: "okänt", status: "ej_läsbar", "i_sammanfattning": false,
        siffror: [], orsaker: [],
        sammanfattning: "Sidan har bara en allmän introduktion och länkar, ingen analystext eller prognos.",
        anm: ""
      }
    ]
  },

  varningar: [
    "E.ON, Göteborg Energi och Mälarenergi gick inte att läsa.",
    "Öresundskraft visar fortfarande vecka 47 och ingår inte i sammanfattningen.",
    "Bixias månadsprognos är daterad 23 november, men prognossiffrorna verkar vara oförändrade sedan oktober (OSÄKERT)."
  ]
};
