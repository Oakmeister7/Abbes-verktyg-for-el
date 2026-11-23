/* ============================================================================
   veckoanalys-arkiv.js – tidigare veckor för fliken "Prognos denna veckan"
   ----------------------------------------------------------------------------
   window.VECKOANALYS_ARKIV = [ <veckoobjekt>, … ]   // senaste veckan först

   Varje post har exakt samma format som window.VECKOANALYS i veckoanalys.js
   (schema 1). Den schemalagda uppgiften flyttar föregående vecka hit vid
   veckobyte (se KORNING.md). Samma vecka får bara finnas en gång.
   ============================================================================ */

window.VECKOANALYS_ARKIV = [];
