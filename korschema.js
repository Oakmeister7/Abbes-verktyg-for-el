/* ============================================================================
   KÖRSCHEMA för fliken "Prognos denna veckan" i Abbes verktyg för el.

   Sidan läser denna fil för att visa "Uppdateras …" och "Nästa uppdatering".
   Ändra tiderna HÄR (och i de schemalagda uppgifterna) – sidan behöver inte
   byggas om. Saknas filen eller är den ogiltig visar sidan måndag 08:00,
   måndag 15:00 och tisdag 15:00.

   Vem ändrar: bara utvärderingen av mätningen (4 dec) eller Abbe.
   Veckoanalysen och mätningen rör ALDRIG denna fil.

   Fält:
     körningar: 1–10 poster { dag, h }, svensk tid
       dag: 0 = söndag, 1 = måndag … 5 = fredag, 6 = lördag (heltal)
       h:   hel timme 0–23 (heltal)
     ändrad:     ÅÅÅÅ-MM-DD
     motivering: kort text, visas inte på sidan
   ============================================================================ */

window.VECKOANALYS_KORSCHEMA = {
  "körningar": [
    { dag: 1, h: 8 },
    { dag: 1, h: 15 },
    { dag: 2, h: 15 }
  ],
  "ändrad": "2026-11-27",
  motivering: "Abbes beslut 27 nov: mätningen avslutad, körningar måndag 08:00, måndag 15:00 och tisdag 15:00."
};
