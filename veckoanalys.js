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
  uppdaterad: "2026-11-23T16:29:00+01:00",
  "körning": "mån",

  enkel: {
    sammanfattning: "Två källor har uppdaterat för den här veckan: Vattenfall och Svenska kraftnät. Båda pekar på fortsatt höga elpriser, mest i södra Sverige.",
    punkter: [
      { text: "Elpriset väntas fortsätta vara högt, framför allt i södra Sverige (SE3 och SE4).", "källor": ["vattenfall", "svk"] },
      { text: "Veckan börjar kallare än vanligt. När det är kallt använder vi mer el, och då stiger priset.", "källor": ["vattenfall"] },
      { text: "Det blåser lite, så vindkraftverken ger mindre el än vanligt.", "källor": ["vattenfall"] },
      { text: "Elnätet kan inte föra över tillräckligt med el från norr till söder, och underhåll i stamnätet minskar det ytterligare. Därför blir skillnaden i pris mellan norra och södra Sverige stor.", "källor": ["vattenfall", "svk"] },
      { text: "Kärnkraften kommer tillbaka: Ringhals 4 väntas starta i dag (23 november), Forsmark 1 väntas köra fullt från 27 november och Ringhals 3 först 20 december. Mer kärnkraft kan göra priserna lugnare.", "källor": ["vattenfall", "svk"] },
      { text: "Lite vatten i Norges vattenmagasin och låga gaslager i Europa håller också uppe priset.", "källor": ["svk"] }
    ],
    elsystemet: {
      punkter: [
        { text: "Elpriset i södra Sverige har tidvis varit högt. Mer elproduktion i söder, nära där elen används, är det som skulle sänka priset mest." },
        { text: "Kärnkraft: Forsmark 3 och ena halvan av Forsmark 1 är igång sedan 18 november. Andra halvan av Forsmark 1 väntas 27 november, Ringhals 4 den 23 november och Ringhals 3 först 20 december." },
        { text: "Reservkraft: Karlshamnsverket (330 MW) står i reserv 16 november–15 mars och kan startas om elen inte räcker." },
        { text: "Stamnätet: underhåll och utbyggnad ger avbrott som begränsar hur mycket el som kan föras över just nu, men gör nätet starkare inför vintern." },
        { text: "Vatten och gas: Norges vattenmagasin ligger under det normala, mest i söder, och Europas gaslager är låga. Tillsammans med ett osäkert omvärldsläge och begränsad kärnkraft håller det uppe priset." }
      ]
    },
    "elområden": [
      { "elområde": "SE1", riktning: "okänt", text: "Ingen aktuell källa säger hur priset ändras i SE1 den här veckan.", "källor": [] },
      { "elområde": "SE2", riktning: "okänt", text: "Ingen aktuell källa säger hur priset ändras i SE2 den här veckan. Norra Sverige nämns inte särskilt.", "källor": [] },
      { "elområde": "SE3", riktning: "okänt", text: "Priset väntas vara fortsatt högt, men ingen aktuell källa säger om det blir högre eller lägre än förra veckan.", "källor": ["vattenfall", "svk"] },
      { "elområde": "SE4", riktning: "okänt", text: "Priset väntas vara fortsatt högt, men ingen aktuell källa säger om det blir högre eller lägre än förra veckan.", "källor": ["vattenfall", "svk"] }
    ]
  },

  avancerad: {
    "källor": [
      {
        id: "svk", namn: "Svenska kraftnät – Information från driften", url: "https://www.svk.se/om-kraftsystemet/kraftsystemdata/information-fran-driften/",
        "gäller_vecka": "2026-W48", publicerad: "2026-11-23", status: "aktuell", "i_sammanfattning": true,
        siffror: [],
        orsaker: ["kärnkraft", "överföring", "vattenläge", "gas"],
        sammanfattning: "Driftsidan gäller vecka 48 och uppdaterades 23 november. Elpriserna i södra Sverige har tidvis varit höga; mer produktion nära förbrukningen i söder vore det som dämpar priserna mest. Ringhals 4 väntas tillbaka 23 november och Ringhals 3 den 20 december. Forsmark 3 och ena generatorn i Forsmark 1 är i drift sedan 18 november; Forsmark 1:s andra generator väntas 27 november. Strategisk reserv (Karlshamnsverket block 2, 330 MW) finns 16 november–15 mars. Underhåll i stamnätet begränsar överföringen. Norska vattenmagasin ligger under det normala, mest i söder, och låga gaslager i Europa, ett osäkert omvärldsläge och begränsad kärnkraft bidrar till högre priser. Frekvenskvaliteten vecka 47 var bättre än målet.",
        anm: "Kraftläge, inte pris. Rättad manuellt 23 nov kl. 16:29 efter Abbes kontroll av sidan: den automatiska läsningen kl. 15:06 fick en äldre mellanlagrad version (20 nov, vecka 47)."
      },
      {
        id: "eon", namn: "E.ON", url: "https://www.eon.se/aktuellt/elmarknaden",
        "gäller_vecka": "okänt", publicerad: "okänt", status: "ej_läsbar", "i_sammanfattning": false,
        siffror: [], orsaker: [],
        sammanfattning: "Sidan gick inte att läsa med webbverktyget (fel från webbplatsen vid två försök).",
        anm: ""
      },
      {
        id: "tibber", namn: "Tibber", url: "https://tibber.com/se/elprisprognos",
        "gäller_vecka": "2026-W47", publicerad: "okänt", status: "förra_veckan", "i_sammanfattning": false,
        siffror: [
          { "elområde": "SE1+SE2", "värde": 50, "värde_max": null, text: "cirka 50 öre/kWh", enhet: "öre/kWh", momsstatus: "exkl", momsnot: "Källan skriver 'exkl. skatter och avgifter'; moms räknas som skatt.", typ: "PROGNOS", period: "vecka 47 (16–22 nov), snittpris" },
          { "elområde": "SE3", "värde": 175, "värde_max": null, text: "runt 175 öre/kWh", enhet: "öre/kWh", momsstatus: "exkl", momsnot: "Källan skriver 'exkl. skatter och avgifter'; moms räknas som skatt.", typ: "PROGNOS", period: "vecka 47 (16–22 nov), snittpris" },
          { "elområde": "SE4", "värde": 235, "värde_max": null, text: "cirka 235 öre/kWh", enhet: "öre/kWh", momsstatus: "exkl", momsnot: "Källan skriver 'exkl. skatter och avgifter'; moms räknas som skatt.", typ: "PROGNOS", period: "vecka 47 (16–22 nov), snittpris" }
        ],
        orsaker: ["vind", "kärnkraft", "överföring", "gas"],
        sammanfattning: "Prognosen gällde fortfarande vecka 47. Norra Sverige låg lågt tack vare normal eller stark vind. SE3 hölls uppe av att fyra reaktorer stod still, och SE4 var dyrast eftersom överföringen från SE3 var begränsad. Höga gaspriser i Europa pressade också uppåt.",
        anm: ""
      },
      {
        id: "kraftringen", namn: "Kraftringen", url: "https://www.kraftringen.se/privat/el/veckans-elprisanalys/",
        "gäller_vecka": "2026-W47", publicerad: "okänt", status: "förra_veckan", "i_sammanfattning": false,
        siffror: [],
        orsaker: ["kärnkraft", "vind", "vattenläge", "temperatur", "överföring", "gas", "sol", "efterfrågan"],
        sammanfattning: "Analysen gäller fortfarande vecka 47 och saknar siffror. Höga priser väntades i södra Sverige, mest torsdag och fredag, och något lugnare mot helgen. Som orsaker nämns låg kärnkraft, vind runt 75 procent av normalt, kallare och torrare väder samt begränsad överföring till SE3 och SE4.",
        anm: ""
      },
      {
        id: "skanska", namn: "Skånska Energi", url: "https://www.skanska-energi.se/el/veckans-elprisanalys/",
        "gäller_vecka": "2026-W47", publicerad: "okänt", status: "förra_veckan", "i_sammanfattning": false,
        siffror: [],
        orsaker: ["temperatur", "vind", "kärnkraft", "vattenläge", "överföring", "gas", "sol", "efterfrågan"],
        sammanfattning: "Gäller fortfarande vecka 47. Själva analysen är ord för ord densamma som Kraftringens, utan siffror; bara inledning, tips och kontaktuppgifter skiljer.",
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
        anm: "Terminspriset är marknadens förväntan, inte vad kunden betalar."
      },
      {
        id: "bixia", namn: "Bixia", url: "https://bixia.se/privat/elavtal/elsituationen-just-nu",
        "gäller_vecka": "månad 2026-11", publicerad: "2026-10-21", status: "månadsprognos", "i_sammanfattning": false,
        siffror: [
          { "elområde": "SE1", "värde": 59, "värde_max": null, text: "ca 59 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "PROGNOS", period: "november–december 2026" },
          { "elområde": "SE2", "värde": 58, "värde_max": 60, text: "ca 58–60 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "PROGNOS", period: "november–december 2026" },
          { "elområde": "SE3", "värde": 103, "värde_max": 106, text: "ca 103–106 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "PROGNOS", period: "november–december 2026" },
          { "elområde": "SE4", "värde": 159, "värde_max": null, text: "ca 159 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "PROGNOS", period: "november 2026" },
          { "elområde": "SE4", "värde": 147, "värde_max": null, text: "ca 147 öre/kWh", enhet: "öre/kWh", momsstatus: "okänt", momsnot: "Källan anger inte om moms ingår.", typ: "PROGNOS", period: "december 2026" }
        ],
        orsaker: ["vind", "överföring"],
        sammanfattning: "Månadsprognosen från oktober pekar på högre priser i alla elområden under november–december än i oktober. Mer vind håller nere priset i norra och mellersta Sverige, medan SE4 ofta följer Europas priser eftersom det är svårt att föra ned el från norr.",
        anm: "Publicerad 2026-10-21 – kan vara inaktuell."
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
        sammanfattning: "Priserna finns bara i diagram. Sidans länk till analysen leder till en nyhetssida utan någon veckoanalys av elmarknaden. Texten har bara exempel på vad hushållsapparater kostar i dag, ingen veckoprognos.",
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
        anm: "Siffran för oktober kommer från en tidigare kommentar."
      },
      {
        id: "malarenergi", namn: "Mälarenergi", url: "https://www.malarenergi.se/foretag/elavtal-foretag/prognoser-for-elpriset/",
        "gäller_vecka": "okänt", publicerad: "okänt", status: "ej_läsbar", "i_sammanfattning": false,
        siffror: [], orsaker: [],
        sammanfattning: "Sidan har bara rubrik och ingress, ingen analystext eller prognos.",
        anm: ""
      }
    ]
  },

  varningar: [
    "Färre än 3 elbolag har publicerat sin veckoanalys (1: Vattenfall). Prisdelen bygger bara på dem; läget i elsystemet kommer från Svenska kraftnät.",
    "Måndagskörning: 4 källor visar fortfarande vecka 47 och ingår inte i sammanfattningen (Tibber, Kraftringen, Skånska Energi, Öresundskraft).",
    "E.ON, Göteborg Energi och Mälarenergi gick inte att läsa."
  ]
};
