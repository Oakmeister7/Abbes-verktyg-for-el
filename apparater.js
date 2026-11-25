/* ============================================================================
   APPARATER – data för flik 8 "Vad drar det?" i Abbes verktyg för el.
   Allmän, publik kunskap. INGET kundrelaterat får läggas här.

   Varje värde är kontrollerat mot källan (2026-11-24). Märkning:
     FAKTA     = står i källan
     BERÄKNAT  = räknat ur källans siffror (uträkningen står i "not")
     ANTAGANDE = typvärde vi valt inom källans intervall eller exempel
   anvEx: true = användningen är ett exempel som säljaren ändrar efter kunden.

   Fält per apparat:
     id, namn, kat, bas (tal), basEnhet:
       "W"            → kWh/år = W/1000 × timmar per dag × dagar per år
       "kWh/gång"     → kWh/år = kWh × gånger per vecka × 52
       "kWh/år"       → kWh/år = kWh × antal
       "kWh/mil"      → kWh/år = kWh × mil per år
       "kWh/timme"    → kWh/år = kWh × timmar per vecka × 52
       "kWh/liter"    → kWh/år = kWh × liter per år
       "kWh/m²·dygn"  → kWh/år = kWh × m² × dagar per år
     anv: { v: tal, enhet }  (h_dag, ggr_vecka, mil_ar, h_vecka, liter_ar, dagar_ar)
     dagar: dagar per år för "W" (standard 365)
     antal: { v, enhet } (st eller m²) – multipliceras alltid in
     intervall: [min, max] i basEnhet (om källan anger intervall)
     markning, kalla (id i KALLOR), not
   ============================================================================ */

window.APPARATER_KALLOR = {
  ekr:        { namn: "Energi- och klimatrådgivningen – Så mycket drar dina apparater", url: "https://energiochklimatradgivningen.se/hushall/sparael/samycketeldrardinaapparaterochvitvaror.706.html" },
  ekr_tjuv:   { namn: "Energi- och klimatrådgivningen – Vilka energitjuvar har du", url: "https://energiochklimatradgivningen.se/hushall/sparael/vilkaenergitjuvarharduiditthem.747.html" },
  ekr_bel:    { namn: "Energi- och klimatrådgivningen – Belysning", url: "https://energiochklimatradgivningen.se/hushall/sparael/belysning.707.html" },
  em_tips:    { namn: "Energimyndigheten – Spara energi, enkla tips", url: "https://www.energimyndigheten.se/effektiv-energianvandning/hushall/spara-energi-enkla-tips/" },
  em_standby: { namn: "Energimyndigheten – Standby, offmode-förluster och nätverksstandby", url: "https://www.energimyndigheten.se/effektiv-energianvandning/saljare-och-tillverkare-av-produkter/produktgrupper-a-o/produkter/standby-offmode-forluster-och-natverksstandby/" },
  em_hus:     { namn: "Energimyndigheten – Husguiden (Så mycket kan du spara)", url: "https://www.energimyndigheten.se/effektiv-energianvandning/guider/husguiden-for-dig-som-vill-energieffektivisera-ditt-hus/sa-mycket-kan-du-spara-pa-att-energieffektivisera-ditt-hus/" },
  em_er2023:  { namn: "Energimyndigheten – ER 2023:14 (avsnitt 8.3)", url: "https://www.energimyndigheten.se/496032/contentassets/f7846dde19cc4a26acd415ad267377cb/en-strategi-for-fjarrvarme-och-kraftvarme-och-kartlaggning-av-potential-er-2023_14.pdf" },
  em_kettle:  { namn: "EU:s ekodesignstudie för vattenkokare, Task 3 (via Energimyndigheten)", url: "https://www.energimyndigheten.se/48ec95/globalassets/energieffektivisering_/lagar-och-krav/ekodesign--energimarkning/ecodesign_kettles_task_3_20201218_v27_final.pdf" },
  radron:     { namn: "Råd & Rön – Byt upp dig, spara pengar (2015)", url: "https://www.radron.se/vardagskunskap/byt-upp-dig-spara-pengar/" },
  adax_neo:   { namn: "Adax – Neo Basic (elradiator)", url: "https://adax.no/se/produkt/neo-basic-radiator-med-digitaltermostat/" },
  adax_ena:   { namn: "Adax – ENA VV11 (värmefläkt)", url: "https://adax.no/se/produkt/ena-vv11/" },
  mitsu:      { namn: "Mitsubishi Electric – HERO luft-luftvärmepump", url: "https://mitsubishielectric.se/produkter/villa/luft-luft/hero" },
  nibe_vpb:   { namn: "NIBE – VPB S200/S300, handbok (energimärkning)", url: "https://assetstore.nibe.se/hcms/v2.3/entity/document/920324/storage/OTIwMzI0LzAvbWFzdGVyLy8vNTAzMzIwMDg5" },
  nibe_el:    { namn: "NIBE – EL varmvattenberedare, produktblad (2025-11-18)", url: "https://assetstore.nibe.se/hcms/v2.3/entity/document/909780/storage/OTA5NzgwLzAvbWFzdGVy" },
  elux_ugn:   { namn: "Electrolux – COS960B (ugn, energimärkning)", url: "https://www.electrolux.se/kitchen/cooking/ovens/steam-oven/cos960b/" },
  cylinda_mv: { namn: "Cylinda – IM5131SV (mikrovågsugn)", url: "https://www.cylinda.se/im5131sv-vit-p-4368" },
  mocca:      { namn: "Moccamaster – Automatic", url: "https://se.moccamaster.com/products/automatic" },
  bosch_kyl:  { namn: "Bosch – KSN36VLCG (kylskåp, energiklass C)", url: "https://www.bosch-home.se/sv/product/kylskap-och-frysar/kylskap/fritstaende-kylskap-utan-frysdel/KSN36VLCG" },
  bosch_frys: { namn: "Bosch – GSN36AICM (frysskåp, energiklass C)", url: "https://www.bosch-home.se/sv/product/kylskap-och-frysar/frysar/fristaende-frysar/GSN36AICM" },
  bosch_kfA:  { namn: "Bosch – KGN392I1F (kyl/frys, energiklass A)", url: "https://www.bosch-home.se/sv/product/kylskap-och-frysar/kombinerade-kylfrysar/fristaende-kylfrysar-med-frysen-nedtill/KGN392I1F" },
  bosch_kfE:  { namn: "Bosch – KGN36VWED (kyl/frys, energiklass E)", url: "https://www.bosch-home.se/sv/product/kylskap-och-frysar/kombinerade-kylfrysar/fristaende-kylfrysar-med-frysen-nedtill/KGN36VWED" },
  elux_tvatt: { namn: "Electrolux – EFI743RX4EQ (tvättmaskin, energiklass A)", url: "https://www.electrolux.se/laundry/laundry/washing-machines/front-loader-washing-machine/efi743rx4eq/" },
  cylinda_tt: { namn: "Cylinda – TK4570 (kondenstumlare), produktblad", url: "https://static.elongroup.se/Document/Article/481424/faktablad-torktumlare-cylinda-9205417.pdf" },
  elux_tt:    { namn: "Electrolux – EDI622E85E (värmepumpstumlare, energiklass C)", url: "https://www.electrolux.se/laundry/laundry/dryers/heat-pump-dryer/edi622e85e2/" },
  nimo_fl:    { namn: "Nimo – Mistral Drying Cabinet 60 (torkskåp)", url: "https://www.nimoverken.com/sv/produkter/torkskap/mistral-drying-cabinet-60/" },
  nimo_vp:    { namn: "Nimo – Passad Drying Cabinet 60 (torkskåp med värmepump)", url: "https://www.nimoverken.com/sv/produkter/torkskap/passad-drying-cabinet-60/" },
  bosch_disk: { namn: "Bosch – SMP4ECW72S (diskmaskin, energiklass A)", url: "https://www.bosch-home.se/sv/product/diskmaskiner/underbyggda-och-integrerade-diskmaskiner/underbyggd-diskmaskin-60cm/SMP4ECW72S" },
  harvia:     { namn: "Harvia – Att värma en bastu kostar mindre än man tror", url: "https://www.harvia.com/sv/ideer-och-trender/hallbarhet-och-sakerhet/kostnaden-for-att-varma-en-bastu-ar-mindre-an-man-tror-en-typisk-familjebastu-var/" },
  folkpool:   { namn: "Folkpool – Energiförbrukningstest av spabad (RISE:s energikammare)", url: "https://www.folkpool.se/spabad/energiforbrukningstest-av-spabad" },
  pahlen:     { namn: "Pahlén – Tips för att renovera pool", url: "https://www.pahlen.se/renovera-pool/" },
  adac:       { namn: "ADAC – Elbilars förbrukning på vintern (Green NCAP, 2024-11-20)", url: "https://www.adac.de/rund-ums-fahrzeug/elektromobilitaet/laden/elektroauto-reichweite-winter/" },
  msv_elbil:  { namn: "M Sverige – Test: fyra elbilar på vintern", url: "https://msverige.se/elbil/testade-elbilar/test-fyra-elbilar-pa-vintern/" },
  msv_mv:     { namn: "M Sverige – Motorvärmare", url: "https://msverige.se/allt-om-bilen/service-och-underhall/motorvarmare/" },
  lenovo:     { namn: "Lenovo – ThinkPad T14s Gen 2, miljödeklaration (ETEC)", url: "https://static.lenovo.com/ww/docs/regulatory/eco-declaration/eco-thinkpad-t14s-gen-2-intel.pdf" },
  ps:         { namn: "PlayStation – Energy Efficiency (PS5)", url: "https://www.playstation.com/en-gb/legal/ecodesign/" },
  tplink:     { namn: "TP-Link – Idle power, Small Network Equipment 2023", url: "https://www.tp-link.com/us/landing/tp-link-sne-energy-information-2023/" },
  elux_damm:  { namn: "Electrolux – EL61C2OG (dammsugare)", url: "https://www.electrolux.se/homecare/vacuum-cleaners/bagless-vacuum-cleaners/bagless-vacuum-cleaner/el61c2og/" },
  philips:    { namn: "Philips – 5000 Series hårtork BHD512", url: "https://www.philips.se/c-p/BHD512_20/5000-series-hair-dryer" },
  woods:      { namn: "Wood's – SW22FW (avfuktare)", url: "https://woods.se/sv/produkter/avfuktare/woods-sw22fw/" }
};

window.APPARATER_KATEGORIER = [
  { id: "uppv",  namn: "Uppvärmning", ikon: "🔥" },
  { id: "vv",    namn: "Varmvatten",  ikon: "🚿" },
  { id: "kok",   namn: "Kök",         ikon: "🍳" },
  { id: "kyl",   namn: "Kyl och frys",ikon: "❄️" },
  { id: "tvatt", namn: "Tvätt och disk", ikon: "🧺" },
  { id: "bad",   namn: "Bastu, spa och pool", ikon: "🧖" },
  { id: "bil",   namn: "Bil",         ikon: "🚗" },
  { id: "elek",  namn: "Elektronik",  ikon: "📺" },
  { id: "bel",   namn: "Belysning",   ikon: "💡" },
  { id: "ovr",   namn: "Övrigt",      ikon: "🔌" }
];

window.APPARATER = [
  /* --- Uppvärmning --- */
  { id: "elradiator", namn: "Elradiator / elelement (per element)", kat: "uppv", bas: 1000, basEnhet: "W", intervall: [400, 2000], anv: { v: 6, enhet: "h_dag" }, dagar: 180, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "ANTAGANDE", kalla: "adax_neo", not: "Adax anger 400–2000 W. 1000 W är ett valt typvärde. Termostaten gör att elementet inte går på full effekt hela tiden – timmar per dag är den tid det faktiskt värmer." },
  { id: "varmeflakt", namn: "Värmefläkt (portabel)", kat: "uppv", bas: 1200, basEnhet: "W", intervall: [800, 2000], anv: { v: 2, enhet: "h_dag" }, dagar: 90, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "adax_ena", not: "Tre lägen: 800, 1200 och 2000 W. På 2000 W drar den 2 kWh per timme." },
  { id: "golvvarme", namn: "Elgolvvärme, badrum (per m²)", kat: "uppv", bas: 0.6, basEnhet: "kWh/m²·dygn", anv: { v: 365, enhet: "dagar_ar" }, antal: { v: 6, enhet: "m²" }, anvEx: true,
    markning: "BERÄKNAT", kalla: "ekr", not: "Källan: 3,6 kWh per dygn för ett litet badrum på 6 m². 3,6 / 6 = 0,6 kWh per m² och dygn." },

  /* --- Varmvatten --- */
  { id: "vvb_el230", namn: "Elvarmvattenberedare 230 liter, hela året", kat: "vv", bas: 4490, basEnhet: "kWh/år", antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "nibe_el", not: "NIBE EL 230, energiklass D, tapprofil XL: 4 490 kWh/år enligt energimärkningen (uppvärmning av vattnet + förluster). Effekt 3 kW (2 kW på 1-fas)." },
  { id: "vvb_forlust200", namn: "Varmvattenberedare ca 200 liter – bara förlusterna", kat: "vv", bas: 578.16, basEnhet: "kWh/år", antal: { v: 1, enhet: "st" },
    markning: "BERÄKNAT", kalla: "nibe_vpb", not: "NIBE VPB S200: värmeförlust 66 W (energiklass C). 66 W × 8 760 h / 1 000 = 578,16 kWh/år. Det är vad beredaren drar för att hålla vattnet varmt, utan att någon tappar vatten." },
  { id: "vvb_forlust300", namn: "Varmvattenberedare ca 300 liter – bara förlusterna", kat: "vv", bas: 770.88, basEnhet: "kWh/år", antal: { v: 1, enhet: "st" },
    markning: "BERÄKNAT", kalla: "nibe_vpb", not: "NIBE VPB S300: värmeförlust 88 W (energiklass C). 88 W × 8 760 h / 1 000 = 770,88 kWh/år." },

  /* --- Kök --- */
  { id: "spis_glas", namn: "Spis med glaskeramikhäll", kat: "kok", bas: 1, basEnhet: "kWh/timme", anv: { v: 10, enhet: "h_vecka" }, antal: { v: 1, enhet: "st" },
    markning: "BERÄKNAT", kalla: "radron", not: "Råd & Rön: 520 kWh/år vid 10 timmar i veckan. 520 / (10 × 52) = 1 kWh per timme." },
  { id: "spis_ind", namn: "Induktionshäll", kat: "kok", bas: 415 / 520, basEnhet: "kWh/timme", anv: { v: 10, enhet: "h_vecka" }, antal: { v: 1, enhet: "st" },
    markning: "BERÄKNAT", kalla: "radron", not: "Råd & Rön: 415 kWh/år vid 10 timmar i veckan. 415 / 520 = 0,798 kWh per timme." },
  { id: "spis_gjut", namn: "Äldre spis med gjutjärnsplattor", kat: "kok", bas: 625 / 520, basEnhet: "kWh/timme", anv: { v: 10, enhet: "h_vecka" }, antal: { v: 1, enhet: "st" },
    markning: "BERÄKNAT", kalla: "radron", not: "Råd & Rön: 625 kWh/år vid 10 timmar i veckan. 625 / 520 = 1,202 kWh per timme." },
  { id: "ugn_200", namn: "Ugn, 200 °C i 1 timme (inkl. uppvärmning)", kat: "kok", bas: 1, basEnhet: "kWh/gång", anv: { v: 3, enhet: "ggr_vecka" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "ekr", not: "1 kWh för uppvärmning till 200 °C samt tillagning 1 timme." },
  { id: "ugn_varmluft", namn: "Modern ugn, varmluft (energiklass A++)", kat: "kok", bas: 0.52, basEnhet: "kWh/gång", anv: { v: 3, enhet: "ggr_vecka" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "elux_ugn", not: "Electrolux COS960B: 0,52 kWh per omgång i varmluft, 1,09 kWh i över-/undervärme (energimärkningens standardomgång)." },
  { id: "mikro", namn: "Mikrovågsugn", kat: "kok", bas: 1200, basEnhet: "W", anv: { v: 0.25, enhet: "h_dag" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "cylinda_mv", not: "Cylinda IM5131SV: 1 200 W totalt (700 W mikrovågseffekt). 0,25 h = 15 minuter per dag." },
  { id: "vattenkokare", namn: "Vattenkokare", kat: "kok", bas: 0.12, basEnhet: "kWh/liter", anv: { v: 800, enhet: "liter_ar" }, antal: { v: 1, enhet: "st" },
    markning: "ANTAGANDE", kalla: "em_kettle", not: "EU-studiens antagna medelvärde: ca 0,12 kWh per kokad liter, och 800 liter per vattenkokare och år som typvärde i EU." },
  { id: "kaffe", namn: "Kaffebryggare, 10 koppar", kat: "kok", bas: 1520 * 5 / 60 / 1000, basEnhet: "kWh/gång", anv: { v: 7, enhet: "ggr_vecka" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "BERÄKNAT", kalla: "mocca", not: "Moccamaster Automatic: 1 520 W, bryggtid 4–6 minuter. Vid 5 minuter: 1 520 × 5 / 60 / 1 000 = 0,127 kWh per bryggning (utan varmhållning)." },

  /* --- Kyl och frys --- */
  { id: "kyl_c", namn: "Kylskåp, nytt (energiklass C, 402 l)", kat: "kyl", bas: 110, basEnhet: "kWh/år", antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "bosch_kyl", not: "Bosch KSN36VLCG: energiklass C, 110 kWh/år." },
  { id: "frys_ny", namn: "Frysskåp, nytt (Energimyndighetens typvärde)", kat: "kyl", bas: 250, basEnhet: "kWh/år", antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "em_tips", not: "\"En ny frys drar cirka 250 kWh per år.\" En ny energiklass C-frys (Bosch GSN36AICM, 334 l) drar 171 kWh/år." },
  { id: "frys_10ar", namn: "Frysskåp, ca 10 år gammalt", kat: "kyl", bas: 450, basEnhet: "kWh/år", intervall: [400, 500], antal: { v: 1, enhet: "st" },
    markning: "BERÄKNAT", kalla: "em_tips", not: "Källan: 400–500 kWh per år för en 10 år gammal frys. 450 = mitten av intervallet." },
  { id: "kylfrys_a", namn: "Kyl/frys kombinerad, ny (energiklass A)", kat: "kyl", bas: 100, basEnhet: "kWh/år", antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "bosch_kfA", not: "Bosch KGN392I1F: energiklass A, 100 kWh/år, 363 liter." },
  { id: "kylfrys_e", namn: "Kyl/frys kombinerad, ny (energiklass E)", kat: "kyl", bas: 238, basEnhet: "kWh/år", antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "bosch_kfE", not: "Bosch KGN36VWED: energiklass E, 238 kWh/år." },

  /* --- Tvätt och disk --- */
  { id: "tvatt40", namn: "Tvättmaskin, 40 °C (4 kg)", kat: "tvatt", bas: 0.6, basEnhet: "kWh/gång", anv: { v: 4, enhet: "ggr_vecka" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "ekr_tjuv", not: "Ca 0,6 kWh per tvätt, 4 kg i 40 °C. En genomsnittsfamiljs tvätt: ca 200–300 kWh/år." },
  { id: "tvatt60", namn: "Tvättmaskin, 60 °C (4 kg)", kat: "tvatt", bas: 1.4, basEnhet: "kWh/gång", anv: { v: 2, enhet: "ggr_vecka" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "ekr_tjuv", not: "Ca 1,4 kWh per tvätt, 4 kg i 60 °C." },
  { id: "tvatt_eco", namn: "Ny tvättmaskin, Eco 40–60 (energiklass A)", kat: "tvatt", bas: 0.521, basEnhet: "kWh/gång", anv: { v: 4, enhet: "ggr_vecka" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "elux_tvatt", not: "Electrolux EFI743RX4EQ: 52 kWh per 100 cykler = 0,521 kWh per cykel. Max 2 100 W." },
  { id: "tumlare_kond", namn: "Torktumlare, kondens (äldre typ)", kat: "tvatt", bas: 504 / 220, basEnhet: "kWh/gång", intervall: [2.31, 4.18], anv: { v: 3, enhet: "ggr_vecka" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "BERÄKNAT", kalla: "cylinda_tt", not: "Cylinda TK4570, 7 kg, energiklass B: full last 4,18 kWh, dellast 2,31 kWh, 504 kWh/år vid 220 cykler. 504 / 220 = 2,29 kWh per torkning i snitt." },
  { id: "tumlare_vp", namn: "Torktumlare med värmepump (energiklass C)", kat: "tvatt", bas: 1.02, basEnhet: "kWh/gång", anv: { v: 3, enhet: "ggr_vecka" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "elux_tt", not: "Electrolux EDI622E85E, 8 kg: 102 kWh per 100 cykler = 1,02 kWh per torkning. Max 700 W." },
  { id: "torkskap", namn: "Torkskåp, traditionellt (2 kW)", kat: "tvatt", bas: 2.66, basEnhet: "kWh/gång", intervall: [2.56, 2.76], anv: { v: 2, enhet: "ggr_vecka" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "BERÄKNAT", kalla: "nimo_fl", not: "Nimo Mistral: 2,56–2,76 kWh per torkning (normallast, 50 % restfukt, 90 min). 2,66 = mitten av intervallet." },
  { id: "torkskap_vp", namn: "Torkskåp med värmepump", kat: "tvatt", bas: 0.92, basEnhet: "kWh/gång", anv: { v: 2, enhet: "ggr_vecka" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "nimo_vp", not: "Nimo Passad: 0,92 kWh per torkning (normallast, 50 % restfukt, 83 min)." },
  { id: "disk", namn: "Diskmaskin, Eco (energiklass A)", kat: "tvatt", bas: 0.54, basEnhet: "kWh/gång", anv: { v: 5, enhet: "ggr_vecka" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "bosch_disk", not: "Bosch SMP4ECW72S: 54 kWh per 100 cykler i Eco 50 °C = 0,54 kWh per disk, 9 liter vatten." },

  /* --- Bastu, spa och pool --- */
  { id: "bastu6", namn: "Bastu 6 kW, ett bastubad (2 h)", kat: "bad", bas: 8, basEnhet: "kWh/gång", intervall: [7, 9], anv: { v: 1, enhet: "ggr_vecka" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "BERÄKNAT", kalla: "harvia", not: "Harvia: 7–9 kWh för ett bastubad (1 h uppvärmning + 1 h bad, full effekt de första 30–40 minuterna, sedan ca 50 %), välisolerad bastu. 8 = mitten." },
  { id: "bastu8", namn: "Bastu 8 kW, ett bastubad (2 h)", kat: "bad", bas: 11, basEnhet: "kWh/gång", intervall: [9, 13], anv: { v: 1, enhet: "ggr_vecka" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "BERÄKNAT", kalla: "harvia", not: "Harvia: 9–13 kWh för ett bastubad, välisolerad bastu. 11 = mitten." },
  { id: "spabad", namn: "Spabad utomhus, välisolerat (året runt)", kat: "bad", bas: 2255, basEnhet: "kWh/år", intervall: [2210, 2521.2], antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "folkpool", not: "Mätt i RISE:s energikammare vid +7 °C, 38 °C i vattnet, 2 bad i veckan och 3 vattenbyten per år: 2 210–2 521 kWh/år (Swan Spa 2 255). Sämre isolerade spabad drar mer." },
  { id: "poolpump_vs", namn: "Poolpump, varvtalsstyrd (säsong 180 dygn)", kat: "bad", bas: 1080, basEnhet: "kWh/år", antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "pahlen", not: "Pahlén EcoVISE HV75: ca 250 W i snitt, dygnet runt i 180 dagar ≈ 1 080 kWh per säsong." },
  { id: "poolpump_v", namn: "Poolpump, vanlig (säsong 180 dygn)", kat: "bad", bas: 3240, basEnhet: "kWh/år", antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "pahlen", not: "Pahlén WaterVISE HS37: 750 W, dygnet runt i 180 dagar ≈ 3 240 kWh per säsong." },
  { id: "handdukstork", namn: "Elektrisk handdukstork (60 W)", kat: "bad", bas: 60, basEnhet: "W", anv: { v: 6, enhet: "h_dag" }, antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "ekr", not: "60 W påslagen 6 timmar = 0,36 kWh per dygn. Påslagen dygnet runt: 60 × 24 × 365 / 1 000 = 525,6 kWh/år." },

  /* --- Bil --- */
  { id: "elbil_sommar", namn: "Elbil, sommar (+23 °C, inkl. laddförluster)", kat: "bil", bas: (1.61 + 2.10) / 2, basEnhet: "kWh/mil", intervall: [1.61, 2.10], anv: { v: 1000, enhet: "mil_ar" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "BERÄKNAT", kalla: "adac", not: "ADAC/Green NCAP: 16,1–21,0 kWh/100 km vid +23 °C inkl. laddförluster = 1,61–2,10 kWh/mil. 1,855 = mitten." },
  { id: "elbil_vinter", namn: "Elbil, vinter landsväg", kat: "bil", bas: (1.99 + 2.17 + 2.08 + 2.03) / 4, basEnhet: "kWh/mil", intervall: [1.99, 2.17], anv: { v: 1000, enhet: "mil_ar" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "BERÄKNAT", kalla: "msv_elbil", not: "M Sveriges vintertest, Stockholm–Ramundberget med kupévärme: Kia Niro EV 1,99, Nissan Ariya 2,17, Renault Megane 2,08, VW ID.3 2,03 kWh/mil. Medel (1,99 + 2,17 + 2,08 + 2,03) / 4 = 2,0675. Laddförluster ingår troligen inte (OSÄKERT)." },
  { id: "elbil_kyla", namn: "Elbil, kall vinter (−7 °C, korta resor)", kat: "bil", bas: (2.25 + 4.23) / 2, basEnhet: "kWh/mil", intervall: [2.25, 4.23], anv: { v: 1000, enhet: "mil_ar" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "BERÄKNAT", kalla: "adac", not: "ADAC/Green NCAP: 22,5–42,3 kWh/100 km vid −7 °C inkl. laddförluster = 2,25–4,23 kWh/mil. 3,24 = mitten. I snitt 70 % mer än vid +23 °C." },
  { id: "motorvarmare", namn: "Motorvärmare (utan kupévärmare)", kat: "bil", bas: 500, basEnhet: "W", intervall: [400, 600], anv: { v: 1, enhet: "h_dag" }, dagar: 120, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "ANTAGANDE", kalla: "msv_mv", not: "Värmeelementet är normalt 400–600 W (500 = mitten). Energimyndighetens råd för inkopplingstid: +10 °C 30 min, 0 °C 1 h, −10 °C 1 h, −15 °C eller kallare 1,5 h." },

  /* --- Elektronik --- */
  { id: "tv55", namn: "TV 55 tum, modern LED", kat: "elek", bas: 85, basEnhet: "W", intervall: [70, 100], anv: { v: 4, enhet: "h_dag" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "BERÄKNAT", kalla: "ekr", not: "Källan: uppskattat snitt 70–100 W, \"omkring 100 watt\". 85 = mitten." },
  { id: "laptop", namn: "Bärbar dator", kat: "elek", bas: 18.11, basEnhet: "kWh/år", antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "lenovo", not: "Lenovo ThinkPad T14s Gen 2: årlig energiförbrukning (ETEC) 18,11 kWh/år vid 230 V enligt standardiserat användningsmönster." },
  { id: "ps5", namn: "Spelkonsol PS5, när man spelar", kat: "elek", bas: 210, basEnhet: "W", intervall: [196.9, 219.2], anv: { v: 2, enhet: "h_dag" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "ANTAGANDE", kalla: "ps", not: "Sony: 196,9–219,2 W beroende på modell vid spel. Viloläge 0,3–0,38 W. 210 W = valt typvärde. TV:n tillkommer." },
  { id: "router", namn: "Wifi-router (Wi-Fi 6), dygnet runt", kat: "elek", bas: 6.8, basEnhet: "W", intervall: [2.53, 26.95], anv: { v: 24, enhet: "h_dag" }, antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "tplink", not: "TP-Link Archer AX55: 6,80 W i viloläge. Modeller i listan: 2,53–26,95 W. 6,8 × 24 × 365 / 1 000 = 59,57 kWh/år." },
  { id: "standby", namn: "Standby, en modern apparat (EU-gräns)", kat: "elek", bas: 0.5, basEnhet: "W", intervall: [0.5, 0.8], anv: { v: 24, enhet: "h_dag" }, antal: { v: 10, enhet: "st" }, anvEx: true,
    markning: "FAKTA", kalla: "em_standby", not: "Från 9 maj 2025: högst 0,5 W i standby/frånläge, 0,8 W med display. Äldre apparater kan dra mer. Energimyndigheten: ca 5 % av ett hushålls el går till standby." },

  /* --- Belysning --- */
  { id: "led", namn: "LED-lampa 800 lumen (ersätter 60 W)", kat: "bel", bas: 8, basEnhet: "W", intervall: [7, 9], anv: { v: 4, enhet: "h_dag" }, antal: { v: 10, enhet: "st" }, anvEx: true,
    markning: "BERÄKNAT", kalla: "ekr_bel", not: "Källan: 800 lumen kräver 7–9 W med LED (motsvarar 60 W glödlampa). 8 = mitten." },
  { id: "glod", namn: "Glödlampa 60 W", kat: "bel", bas: 60, basEnhet: "W", anv: { v: 4, enhet: "h_dag" }, antal: { v: 10, enhet: "st" }, anvEx: true,
    markning: "FAKTA", kalla: "ekr_bel", not: "60 W glödlampa = samma ljus (800 lumen) som en LED på 7–9 W." },

  /* --- Övrigt --- */
  { id: "dammsugare", namn: "Dammsugare (modern)", kat: "ovr", bas: 24.9, basEnhet: "kWh/år", antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "elux_damm", not: "Electrolux EL61C2OG: 24,9 kWh/år enligt märkningen. Nominell effekt 550 W, max 700 W." },
  { id: "hartork", namn: "Hårtork", kat: "ovr", bas: 2300, basEnhet: "W", anv: { v: 0.17, enhet: "h_dag" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "philips", not: "Philips BHD512: 2 300 W. 0,17 h ≈ 10 minuter per dag." },
  { id: "avfuktare", namn: "Avfuktare (källare)", kat: "ovr", bas: 200, basEnhet: "W", anv: { v: 6, enhet: "h_dag" }, anvEx: true, antal: { v: 1, enhet: "st" },
    markning: "FAKTA", kalla: "woods", not: "Wood's SW22FW: 200 W vid 30 °C och 80 % luftfuktighet. Hygrostaten styr hur många timmar den går." }
];

/* Uppvärmning: el = värmebehov × täckning / SCOP + värmebehov × (1 − täckning). Direktel räknas som SCOP 1. */
window.APPARATER_UPPV = {
  exempel: { varmebehov: 16400, not: "Husguidens 1970-talshus, 145 m², direktverkande el: 16 400 kWh/år före åtgärder.", kalla: "em_hus", markning: "FAKTA" },
  system: [
    { id: "direktel", namn: "Direktverkande el / elpanna", kort: "1 kWh el ger 1 kWh värme.", scop: 1, tackning: 100, markning: "FAKTA", kalla: null, not: "1 kWh el ger 1 kWh värme." },
    { id: "luftluft", namn: "Luft-luftvärmepump", kort: "Värmer oftast inte varmvattnet och sällan hela huset – sänk % av värmen.", scop: 4, tackning: 100, markning: "FAKTA", kalla: "mitsu", not: "Mitsubishi HERO: SCOP 4 i kallt klimat (5,2 i standardklimat). Värmer oftast inte varmvattnet och sällan hela huset – sänk täckningen till den del pumpen klarar." },
    { id: "luftvatten", namn: "Luft-vattenvärmepump", kort: "Värmer både huset och varmvattnet via elementen.", scop: 3.2, tackning: 100, markning: "FAKTA", kalla: "em_hus", not: "Husguiden räknar med årsvärmefaktor (SCOP) 3,2 för luft-vattenvärmepump." },
    { id: "berg", namn: "Bergvärmepump", kort: "Hämtar värme ur berget – jämn effekt även när det är kallt ute.", scop: 3.5, tackning: 100, markning: "ANTAGANDE", kalla: "em_er2023", not: "Energimyndigheten (ER 2023:14): dagens värmepumpar kan antas ha en verkningsgrad kring 3,5 (4,5 = bästa teknik). Inte specifikt för berg." }
  ]
};

/* Spara el: formlerna finns i fliken, konstanterna och källorna här. */
window.APPARATER_SPAR = {
  innetemp:   { procentPerGrad: 5, kalla: "em_tips", markning: "FAKTA", not: "\"Om du sänker värmen inne med en grad minskar din energianvändning för uppvärmning med ungefär fem procent.\"" },
  dusch:      { cWater: 4.186, kalla: null, markning: "FAKTA", not: "Fysik: vatten behöver 4,186 kJ per kg och grad = 0,0011628 kWh per liter och grad. Beredarens förluster ingår inte, med värmepump blir elen lägre." },
  blandare:   { procent: 40, kalla: "ekr_tjuv", markning: "FAKTA", not: "Effektiva blandare kan spara ca 40 % av varmvattnet." },
  tvatt:      { kwh60: 1.4, kwh40: 0.6, kalla: "ekr_tjuv", markning: "FAKTA", not: "4 kg: 60 °C ca 1,4 kWh, 40 °C ca 0,6 kWh per tvätt." },
  lufttork:   { kalla: "cylinda_tt", markning: "BERÄKNAT", not: "Kondenstumlare 504 / 220 = 2,29 kWh per torkning (Cylinda), värmepumpstumlare 1,02 kWh (Electrolux)." },
  frys:       { gammal: 450, ny: 250, kalla: "em_tips", markning: "BERÄKNAT", not: "10 år gammal frys 400–500 kWh/år (450 = mitten), ny frys ca 250 kWh/år." },
  led:        { glod: 60, led: 8, kalla: "ekr_bel", markning: "BERÄKNAT", not: "60 W glödlampa jämfört med LED 7–9 W (8 = mitten) för samma ljus." },
  standby:    { procent: 5, kalla: "em_tips", markning: "FAKTA", not: "Ca 5 % av ett hushålls elanvändning går till standby. Allt går inte att spara." },
  motorv:     { watt: 500, rek: [ { namn: "+10 °C", h: 0.5 }, { namn: "0 °C", h: 1 }, { namn: "−10 °C", h: 1 }, { namn: "−15 °C eller kallare", h: 1.5 } ], kalla: "msv_mv", markning: "FAKTA", not: "Energimyndighetens råd för inkopplingstid (via M Sverige). Effekt 400–600 W, 500 = mitten." },
  handduk:    { watt: 60, timer: 6, kalla: "ekr", markning: "BERÄKNAT", not: "60 W dygnet runt jämfört med 6 timmar per dygn." },
  poolpump:   { vanlig: 3240, varvtal: 1080, kalla: "pahlen", markning: "FAKTA", not: "Per säsong (180 dygn dygnet runt)." }
};

/* Energiskatt på el. Uppdateras när skattesatsen ändras (oftast 1 januari) – ingen ombyggnad behövs. */
window.APPARATER_PRIS = {
  ar: 2026,
  energiskatt_ore: 36.0,      // exkl. moms, FAKTA (Skatteverket)
  avdrag_norr_ore: 9.6,       // avdrag i vissa kommuner i norra Sverige, FAKTA (Skatteverket)
  kommuner: "Hela Norrbottens, Västerbottens och Jämtlands län, samt Sollefteå, Ånge, Örnsköldsvik, Ljusdal, Malung-Sälen, Mora, Orsa, Älvdalen och Torsby.",
  kalla: { namn: "Skatteverket – Skatt på el (skattesats 2026 och aktuella kommuner)", url: "https://www.skatteverket.se/elskatt" },

  /* Generellt pris (förval i fliken): SCB:s genomsnittliga totalpris för hushåll, öre/kWh.
     FAKTA: SCB tabell TAB4310, uppdaterad 2026-09-28, hämtad via SCB:s API 2026-11-24.
     handel + nat + skatt + moms = total (DD avviker 0,01 i SCB:s egen avrundning).
     Fasta avgifter ingår, fördelade per kWh. Uppdatera när SCB publicerar ett nytt halvår. */
  generellt: {
    period: "första halvåret 2026",
    standard: "DD",
    kategorier: [
      { id: "DA", namn: "under 1 000 kWh/år",       handel: 136.93, nat: 334.81, skatt: 36.00, moms: 126.94, total: 634.68 },
      { id: "DB", namn: "1 000–2 499 kWh/år",       handel: 111.40, nat: 152.12, skatt: 36.00, moms: 74.88,  total: 374.40 },
      { id: "DC", namn: "2 500–4 999 kWh/år",       handel: 101.60, nat: 126.70, skatt: 36.00, moms: 66.08,  total: 330.38 },
      { id: "DD", namn: "5 000–14 999 kWh/år",      handel: 97.76,  nat: 77.01,  skatt: 36.00, moms: 52.69,  total: 263.47 },
      { id: "DE", namn: "15 000 kWh/år eller mer",  handel: 94.42,  nat: 56.99,  skatt: 36.00, moms: 46.85,  total: 234.26 }
    ],
    kalla: { namn: "SCB – Priser på el för hushåll efter förbrukarkategori (halvår)", url: "https://www.statistikdatabasen.scb.se/goto/sv/ssd/SSDHalvarElHus" }
  }
};

/* Förklaringar bakom i-knappen i flik 8 (Apparater och Uppvärmning).
   Nyckel = apparatens id (eller upp_<system-id> / upp_varmebehov). En sträng som värde = använd samma förklaring som den raden.
   Alla siffror kommer från raden ovan (not/källa) eller är uträknade av dem. */
window.APPARATER_FORKLARING = {
  elradiator: {"rubrik": "Varför bara 6 timmar per dag?", "text": ["Ett element har en termostat. Den slår på värmen när det blir kallt i rummet och stänger av när det är varmt nog. Elementet går alltså inte på full effekt hela tiden, även om det sitter på väggen dygnet runt.", "Timmar per dag i raden är den tid elementet faktiskt värmer, inte hur länge det är påslaget. Kallare väder och sämre isolering ger fler timmar.", "Effekten skiljer sig mellan element. Adax anger 400–2 000 W, och raden räknar med 1 000 W. Ett element på 1 000 W som värmer 6 timmar om dagen i 180 dagar drar 1 000 × 6 × 180 ÷ 1 000 = 1 080 kWh per år."], "saga": "Elementet går inte för fullt hela tiden. Termostaten slår av och på efter hur varmt det är i rummet. Ett element på 1 000 W som värmer 6 timmar om dagen under 180 dagar drar ungefär 1 080 kWh per år."},
  golvvarme: {"rubrik": "Varför räknas golvvärme per kvadratmeter?", "text": ["Elgolvvärme är värmeslingor under golvet. Ju större golvyta, desto mer slinga och desto mer el.", "Källan anger 3,6 kWh per dygn för ett litet badrum på 6 m². Det blir 3,6 ÷ 6 = 0,6 kWh per m² och dygn.", "Raden räknar med att golvvärmen är på årets alla 365 dagar: 0,6 × 6 × 365 = 1 314 kWh per år för 6 m²."], "saga": "Golvvärmen drar mer ju större golvet är. Ett badrum på 6 m² med golvvärme på hela året drar ungefär 1 314 kWh per år."},
  vvb_el230: {"rubrik": "Vad räknar raden med?", "text": ["En elvarmvattenberedare är en tank där vattnet värms med el. Raden räknar med allt: att värma det vatten som används och värmen som läcker ut när tanken står.", "Siffran 4 490 kWh per år kommer från energimärkningen för NIBE EL 230, energiklass D. Märkningen räknar med tapprofil XL, ett standardiserat mönster för hur mycket varmvatten som tappas. Skalan går från 3XS till 4XL.", "Använder kunden mindre varmvatten blir förbrukningen lägre. Värms vattnet av en värmepump gäller raden inte, då går det åt mindre el."], "saga": "Din varmvattenberedare värmer vattnet med el. Enligt energimärkningen för en 230-litersberedare går det åt omkring 4 490 kWh per år, och då ingår både vattnet ni använder och värmen som läcker ut från tanken."},
  vvb_forlust200: {"rubrik": "Vad betyder ”bara förlusterna”?", "text": ["En varmvattenberedare är en tank som håller vattnet varmt dygnet runt. Därför finns det varmvatten direkt när man öppnar kranen.", "Tanken är isolerad, men lite värme läcker ändå ut hela tiden, ungefär som när en termos sakta svalnar. Beredaren slår då på elen en stund och värmer upp vattnet igen. Den elen kallas värmeförlust, eller bara förlusterna.", "Den här raden räknar bara den elen: det som går åt för att hålla tanken varm även när ingen använder varmvatten. Elen för att värma det vatten som kunden duschar och diskar med ingår inte.", "Siffran kommer från tillverkaren. En 200-litersberedare (NIBE VPB S200, energiklass C) förlorar 66 W. Det är som en lampa på 66 W som lyser dygnet runt: 66 W × 8 760 timmar per år ÷ 1 000 = 578,16 kWh per år.", "Storleken spelar roll. En 300-litersberedare av samma sort förlorar 88 W, alltså 770,88 kWh per år.", "Använd raden när kunden vill veta vad tanken kostar bara på att stå varm. Vill kunden veta vad allt varmvatten kostar, välj raden ”Elvarmvattenberedare 230 liter, hela året”. Den räknar med både vattnet som används och förlusterna."], "saga": "Din varmvattenberedare håller vattnet varmt dygnet runt. Även när ingen använder varmvatten läcker lite värme ut genom tanken, och den värmen måste elen ersätta. För en tank på 200 liter blir det ungefär 578 kWh om året, bara för att hålla vattnet varmt."},
  vvb_forlust300: {"rubrik": "Vad betyder ”bara förlusterna”?", "text": ["En varmvattenberedare är en tank som håller vattnet varmt dygnet runt. Därför finns det varmvatten direkt när man öppnar kranen.", "Tanken är isolerad, men lite värme läcker ändå ut hela tiden, ungefär som när en termos sakta svalnar. Beredaren slår då på elen en stund och värmer upp vattnet igen. Den elen kallas värmeförlust, eller bara förlusterna.", "Den här raden räknar bara den elen: det som går åt för att hålla tanken varm även när ingen använder varmvatten. Elen för att värma det vatten som kunden duschar och diskar med ingår inte.", "Siffran kommer från tillverkaren. En 300-litersberedare (NIBE VPB S300, energiklass C) förlorar 88 W. Det är som en lampa på 88 W som lyser dygnet runt: 88 W × 8 760 timmar per år ÷ 1 000 = 770,88 kWh per år.", "Storleken spelar roll. En 200-litersberedare av samma sort förlorar 66 W, alltså 578,16 kWh per år.", "Använd raden när kunden vill veta vad tanken kostar bara på att stå varm. Vill kunden veta vad allt varmvatten kostar, välj raden ”Elvarmvattenberedare 230 liter, hela året”. Den räknar med både vattnet som används och förlusterna."], "saga": "Din varmvattenberedare håller vattnet varmt dygnet runt. Även när ingen använder varmvatten läcker lite värme ut genom tanken, och den värmen måste elen ersätta. För en tank på 300 liter blir det ungefär 771 kWh om året, bara för att hålla vattnet varmt."},
  spis_ind: {"rubrik": "Varför drar spisarna olika mycket?", "text": ["Alla tre spisraderna räknar med samma matlagning: plattorna används 10 timmar i veckan. Skillnaden är tekniken.", "En induktionshäll värmer kastrullen direkt med ett magnetfält. Mindre värme går ut i luften, och därför drar den minst.", "En glaskeramikhäll och gamla gjutjärnsplattor värmer först själva plattan, som sedan värmer kastrullen. Gjutjärnsplattorna är tunga och tar lång tid att värma upp.", "Enligt Råd & Rön, vid 10 timmar i veckan: induktion 415 kWh, glaskeramik 520 kWh och gjutjärn 625 kWh per år."], "saga": "En induktionshäll värmer kastrullen direkt och drar därför minst el. Med samma matlagning drar den ungefär 415 kWh per år, jämfört med 625 kWh för en äldre spis med gjutjärnsplattor."},
  spis_glas: "spis_ind",
  spis_gjut: "spis_ind",
  ugn_varmluft: {"rubrik": "Varmluft eller över- och undervärme?", "text": ["Energiklassen visar hur snål ugnen är jämfört med andra ugnar. För ugnar går skalan från D upp till A+++, och A++ är näst bäst.", "Samma ugn drar olika mycket beroende på läge. Enligt energimärkningen för Electrolux COS960B går det åt 0,52 kWh per omgång med varmluft och 1,09 kWh med över- och undervärme.", "Med varmluft blåser en fläkt runt den varma luften, så att värmen sprids jämnare i ugnen."], "saga": "Kör du ugnen på varmluft i stället för över- och undervärme går det åt ungefär hälften så mycket el, enligt tillverkarens energimärkning: 0,52 kWh i stället för 1,09 kWh per gång."},
  kylfrys_a: {"rubrik": "Vad betyder energiklassen?", "text": ["Kyl och frys har en energimärkning med en skala från A till G. A är snålast och G drar mest. Skalan gjordes om 2021 och blev strängare.", "Siffrorna kommer från energimärkningen för varje modell: kyl/frys i klass A 100 kWh, kylskåp i klass C 110 kWh och kyl/frys i klass E 238 kWh per år.", "Storleken spelar också roll. En stor kyl i en bra klass kan dra mer än en liten i en sämre klass."], "saga": "Energiklassen visar hur snål kylen eller frysen är, från A som är snålast till G. En ny kyl/frys i klass A drar ungefär 100 kWh per år, en i klass E ungefär 238 kWh."},
  kylfrys_e: "kylfrys_a",
  kyl_c: "kylfrys_a",
  frys_10ar: {"rubrik": "Varför drar en gammal frys mer?", "text": ["Energimyndigheten anger att en ny frys drar cirka 250 kWh per år och att en frys som är omkring 10 år gammal drar 400–500 kWh. Raden för den gamla frysen räknar med mitten, 450 kWh.", "Nyare frysar är bättre isolerade och har effektivare kompressorer.", "Byter kunden en 10 år gammal frys mot en ny sparas ungefär 450 − 250 = 200 kWh per år."], "saga": "En frys som är tio år gammal drar nästan dubbelt så mycket el som en ny, ungefär 450 kWh mot 250 kWh per år enligt Energimyndigheten."},
  frys_ny: "frys_10ar",
  tvatt_eco: {"rubrik": "Vad är Eco 40–60?", "text": ["Eco 40–60 är ett program på nya tvättmaskiner. Det tvättar vanligt smutsig tvätt som annars tvättas i 40 eller 60 grader, i samma omgång.", "Programmet tar längre tid men drar mindre el, eftersom vattnet inte värms lika mycket.", "Enligt energimärkningen för Electrolux EFI743RX4EQ (energiklass A) går det åt 52 kWh per 100 tvättar, alltså ungefär 0,52 kWh per tvätt."], "saga": "Eco 40–60 tar längre tid men drar mindre el. En ny maskin i energiklass A drar ungefär 0,52 kWh per tvätt på det programmet."},
  tumlare_vp: {"rubrik": "Kondenstumlare eller värmepumpstumlare?", "text": ["En kondenstumlare värmer luften med ett element, blåser den genom tvätten och kyler sedan bort fukten. Värmen används en gång och försvinner.", "En värmepumpstumlare tar tillvara värmen och använder den igen. Det går åt mindre el, men torkningen tar ofta längre tid.", "Enligt tillverkarnas energimärkning: kondenstumlare (Cylinda TK4570) 2,29 kWh per torkning i snitt, värmepumpstumlare (Electrolux EDI622E85E) 1,02 kWh."], "saga": "En torktumlare med värmepump återanvänder värmen och drar ungefär 1,02 kWh per torkning, mot 2,29 kWh för en äldre kondenstumlare. Det är mindre än hälften."},
  tumlare_kond: "tumlare_vp",
  torkskap_vp: {"rubrik": "Torkskåp med eller utan värmepump?", "text": ["Ett traditionellt torkskåp blåser varm luft från ett element genom tvätten. Ett torkskåp med värmepump återanvänder värmen och drar mindre el.", "Enligt Nimo: traditionellt torkskåp (Mistral) 2,56–2,76 kWh per torkning, och raden räknar med mitten, 2,66 kWh. Med värmepump (Passad) 0,92 kWh."], "saga": "Ett torkskåp med värmepump drar ungefär en tredjedel så mycket el som ett vanligt: 0,92 kWh per torkning mot 2,66 kWh."},
  torkskap: "torkskap_vp",
  bastu6: {"rubrik": "Varför drar bastun inte full effekt i två timmar?", "text": ["Ett bastuaggregat på 6 kW drar 6 kWh per timme när det går för fullt. Men det går bara för fullt i början, när bastun värms upp.", "Harvia räknar med ett bastubad på 2 timmar: 1 timme uppvärmning och 1 timme bad. Aggregatet går på full effekt de första 30–40 minuterna och sedan på ungefär halv effekt. För en välisolerad bastu blir det 7–9 kWh per bastubad. Raden räknar med mitten, 8 kWh.", "Ett bastubad i veckan blir 8 × 52 = 416 kWh per år. En sämre isolerad bastu eller längre bad drar mer."], "saga": "Ett bastubad med ett aggregat på 6 kW drar ungefär 8 kWh, eftersom aggregatet bara går för fullt medan bastun värms upp. Badar ni en gång i veckan blir det ungefär 416 kWh per år."},
  bastu8: {"rubrik": "Varför drar bastun inte full effekt i två timmar?", "text": ["Ett bastuaggregat på 8 kW drar 8 kWh per timme när det går för fullt. Men det går bara för fullt i början, när bastun värms upp.", "Harvia räknar med ett bastubad på 2 timmar: 1 timme uppvärmning och 1 timme bad. Aggregatet går på full effekt de första 30–40 minuterna och sedan på ungefär halv effekt. För en välisolerad bastu blir det 9–13 kWh per bastubad. Raden räknar med mitten, 11 kWh.", "Ett bastubad i veckan blir 11 × 52 = 572 kWh per år. En sämre isolerad bastu eller längre bad drar mer."], "saga": "Ett bastubad med ett aggregat på 8 kW drar ungefär 11 kWh, eftersom aggregatet bara går för fullt medan bastun värms upp. Badar ni en gång i veckan blir det ungefär 572 kWh per år."},
  spabad: {"rubrik": "Varför drar ett spabad så mycket?", "text": ["Ett spabad utomhus hålls varmt hela året, även när det är kallt ute. Värmen som läcker ut genom locket och väggarna måste hela tiden ersättas med el.", "RISE har mätt spabad vid +7 °C ute, 38 °C i vattnet, 2 bad i veckan och 3 vattenbyten per år: 2 210–2 521 kWh per år. Raden räknar med Swan Spa, 2 255 kWh.", "Sämre isolerade spabad drar mer."], "saga": "Spabadet håller 38 grader varmt vatten dygnet runt, året om. Ett välisolerat spabad drar enligt RISE:s mätningar 2 210–2 521 kWh per år."},
  poolpump_vs: {"rubrik": "Vad är en varvtalsstyrd poolpump?", "text": ["Poolpumpen pumpar runt vattnet genom filtret så att det håller sig rent. Raden räknar med att den går dygnet runt i 180 dagar.", "En vanlig pump går alltid på samma, fulla effekt. En varvtalsstyrd pump kan gå långsammare när det räcker, och drar då mycket mindre el.", "Pahlén: en vanlig pump på 750 W ger 750 × 24 × 180 ÷ 1 000 = 3 240 kWh per säsong. En varvtalsstyrd pump på ca 250 W i snitt ger 1 080 kWh."], "saga": "En varvtalsstyrd poolpump kan gå långsamt när det räcker och drar ungefär en tredjedel så mycket el som en vanlig: 1 080 kWh mot 3 240 kWh per säsong."},
  poolpump_v: "poolpump_vs",
  elbil_sommar: {"rubrik": "Varför drar elbilen mer på vintern?", "text": ["Elbilens förbrukning anges i kWh per mil, alltså hur mycket el det går åt för att köra en mil.", "När det är kallt går det åt el för att värma kupén och batteriet, och batteriet fungerar sämre i kyla. Därför ökar förbrukningen.", "Sommar, +23 °C: 1,61–2,10 kWh per mil, raden räknar med mitten 1,855. Vinter på landsväg (M Sveriges test): 2,0675 kWh per mil i snitt. Kall vinter, −7 °C och korta resor: 2,25–4,23 kWh per mil, raden räknar med 3,24. Enligt ADAC drar elbilen i snitt 70 % mer vid −7 °C än vid +23 °C.", "Laddförluster betyder att en del av elen blir värme när bilen laddas. Det går alltså åt mer el från uttaget än det som hamnar i batteriet. Sommar- och kylaraden räknar med laddförlusterna. För vinterraden är det osäkert."], "saga": "En elbil drar mer el när det är kallt, eftersom kupén och batteriet behöver värmas. Kör du 1 000 mil om året blir det ungefär 1 855 kWh vid sommarväder och 3 240 kWh om det är kallt med korta resor."},
  elbil_vinter: "elbil_sommar",
  elbil_kyla: "elbil_sommar",
  motorvarmare: {"rubrik": "Hur länge ska motorvärmaren vara på?", "text": ["Motorvärmaren värmer motorn innan man kör, så att bilen startar lättare. Värmeelementet drar normalt 400–600 W, och raden räknar med 500 W.", "Det räcker med kort tid. Energimyndighetens råd: +10 °C 30 minuter, 0 °C 1 timme, −10 °C 1 timme, −15 °C eller kallare 1,5 timme. Längre tid värmer mest luften runt motorn.", "Raden räknar med 1 timme per dag i 120 dagar: 500 × 1 × 120 ÷ 1 000 = 60 kWh per år. Står den på 8 timmar varje natt blir det 500 × 8 × 120 ÷ 1 000 = 480 kWh."], "saga": "Med timer räcker det med en timme innan du åker när det är kallt. Då drar motorvärmaren ungefär 60 kWh per vinter, jämfört med 480 kWh om den står på 8 timmar varje natt."},
  standby: {"rubrik": "Vad är standby?", "text": ["Standby är när en apparat är avstängd men fortfarande drar lite el, till exempel tv:n som väntar på signal från fjärrkontrollen.", "Sedan 9 maj 2025 får nya apparater dra högst 0,5 W i standby, eller 0,8 W om de har en display. Äldre apparater kan dra mer.", "Raden räknar med 10 moderna apparater på 0,5 W dygnet runt: 0,5 × 24 × 365 × 10 ÷ 1 000 = 43,8 kWh per år. Energimyndigheten uppskattar att omkring 5 % av ett hushålls el går till standby."], "saga": "Även avstängda apparater drar lite el när de står i standby. En ny apparat får dra högst 0,5 W, men enligt Energimyndigheten går omkring 5 % av ett hushålls el till standby."},
  led: {"rubrik": "Vad betyder 800 lumen?", "text": ["Lumen är hur mycket ljus en lampa ger. Watt är hur mycket el den drar.", "Förr köpte man lampor efter watt. En glödlampa på 60 W ger 800 lumen. En LED-lampa ger samma ljus, 800 lumen, med 7–9 W.", "Raden räknar med 10 lampor tända 4 timmar per dag. Glödlampor: 60 × 4 × 365 × 10 ÷ 1 000 = 876 kWh per år. LED med 8 W: 8 × 4 × 365 × 10 ÷ 1 000 = 116,8 kWh per år."], "saga": "En LED-lampa ger lika mycket ljus som en gammal glödlampa men drar 7–9 W i stället för 60 W. Med 10 lampor tända 4 timmar om dagen blir det 116,8 kWh per år i stället för 876 kWh."},
  glod: "led",
  handdukstork: {"rubrik": "Dygnet runt eller med timer?", "text": ["En elektrisk handdukstork på 60 W som står på dygnet runt drar 60 × 24 × 365 ÷ 1 000 = 525,6 kWh per år.", "Raden räknar med 6 timmar per dag: 60 × 6 × 365 ÷ 1 000 = 131,4 kWh per år."], "saga": "Står handdukstorken på dygnet runt drar den 525,6 kWh per år. Med en timer på 6 timmar om dagen blir det 131,4 kWh."},
  avfuktare: {"rubrik": "Hur många timmar går avfuktaren?", "text": ["En avfuktare tar bort fukt ur luften, ofta i källare. Den har en hygrostat, en fuktmätare som slår på avfuktaren när luften är för fuktig och stänger av när det är torrt nog.", "Timmar per dag är därför den tid den faktiskt går. En fuktigare källare ger fler timmar.", "Wood's SW22FW drar 200 W. Raden räknar med 6 timmar per dag: 200 × 6 × 365 ÷ 1 000 = 438 kWh per år."], "saga": "Avfuktaren går bara när luften är för fuktig. Går den 6 timmar om dagen drar den ungefär 438 kWh per år."},
  mikro: {"rubrik": "Varför 1 200 W när det står 700 W?", "text": ["På mikrovågsugnar står ofta mikrovågseffekten, till exempel 700 W. Det är den effekt som värmer maten.", "Ugnen drar mer från uttaget än så. Cylinda IM5131SV drar 1 200 W totalt.", "Raden räknar med 15 minuter per dag: 1 200 × 0,25 × 365 ÷ 1 000 = 109,5 kWh per år."], "saga": "Mikrovågsugnen drar mer el än siffran på framsidan, men används så kort tid att det blir lite: ungefär 109,5 kWh per år med 15 minuter om dagen."},
  upp_varmebehov: {"rubrik": "Vad är värmebehov?", "text": ["Värmebehovet är hur mycket värme huset behöver på ett år för värme och varmvatten. Det beror på husets storlek, isolering och var i landet det ligger.", "Har huset direktel eller elpanna är värmebehovet ungefär den el som går till värme och varmvatten, eftersom 1 kWh el ger 1 kWh värme.", "Exemplet kommer från Energimyndighetens husguide: ett 1970-talshus på 145 m² med direktverkande el, 16 400 kWh per år."], "saga": "Värmebehovet är hur mycket värme ert hus behöver på ett år. Med direktverkande el blir det ungefär samma mängd el. Med värmepump går det åt mindre el för samma värme."},
  upp_direktel: {"rubrik": "Direktverkande el och elpanna", "text": ["Elementen eller elpannan gör om el till värme. 1 kWh el ger 1 kWh värme.", "Därför är direktel utgångsläget i jämförelsen, och värmepumparna jämförs mot det."], "saga": "Med direktverkande el blir varje kWh el en kWh värme. En värmepump ger flera kWh värme för varje kWh el."},
  upp_luftluft: {"rubrik": "Luft-luftvärmepump", "text": ["En luft-luftvärmepump hämtar värme ur uteluften och blåser ut varm luft inne, från en innedel på väggen.", "SCOP är hur mycket värme pumpen ger per kWh el, räknat över ett helt år. Mitsubishi HERO har SCOP 4 i kallt klimat, alltså ungefär 4 kWh värme för 1 kWh el.", "Den värmer oftast inte varmvattnet, och värmen når sällan alla rum. Därför ska ”% av värmen” sänkas till den del pumpen klarar. Resten räknas som direktel."], "saga": "Luftvärmepumpen ger ungefär 4 kWh värme för varje kWh el, men den värmer inte varmvattnet och når sällan hela huset. Resten av värmen kommer fortfarande från elementen."},
  upp_luftvatten: {"rubrik": "Luft-vattenvärmepump", "text": ["En luft-vattenvärmepump hämtar värme ur uteluften och värmer vattnet i husets element och varmvattnet.", "SCOP är hur mycket värme pumpen ger per kWh el, räknat över ett helt år. Energimyndighetens husguide räknar med SCOP 3,2, alltså 3,2 kWh värme för varje kWh el."], "saga": "En luft-vattenvärmepump värmer både element och varmvatten och ger ungefär 3,2 kWh värme för varje kWh el över ett år."},
  upp_berg: {"rubrik": "Bergvärmepump", "text": ["En bergvärmepump hämtar värme från ett borrhål i berget. Där är temperaturen ungefär densamma hela året, så pumpen ger jämn värme även när det är kallt ute.", "Energimyndigheten räknar med att dagens värmepumpar ger omkring 3,5 kWh värme per kWh el, och 4,5 med bästa teknik. Siffran gäller värmepumpar generellt, inte bara bergvärme, så den är ett antagande."], "saga": "En bergvärmepump hämtar värme från berget, där temperaturen är ungefär densamma året runt, och ger omkring 3,5 kWh värme för varje kWh el."}
};
