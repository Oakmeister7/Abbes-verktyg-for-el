#!/usr/bin/env node
/* Kontrollerar veckoanalys.js och veckoanalys-arkiv.js efter varje publicering.
   Skriver ut felen och avslutar med kod 1 om något är ogiltigt – då återställer
   .github/workflows/vakt.yml filerna till föregående version. */
const fs = require('fs'), vm = require('vm'), path = require('path');
const rot = path.join(__dirname, '..');
const fel = [];
function las(fil) {
  const w = {};
  vm.runInNewContext(fs.readFileSync(path.join(rot, fil), 'utf8'), { window: w }, { timeout: 5000 });
  return w;
}
function isoVecka(d) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dag = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dag);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const v = Math.ceil(((t - y0) / 864e5 + 1) / 7);
  return t.getUTCFullYear() + '-W' + String(v).padStart(2, '0');
}
function kontroll(a, var_) {
  const f = (m) => fel.push(var_ + ': ' + m);
  if (!a || typeof a !== 'object') return f('saknas');
  if (!/^\d{4}-W\d{2}$/.test(a.vecka || '')) f('vecka har fel format');
  // Svensk tid ligger högst 2 timmar före UTC – en analys får aldrig gälla en framtida vecka.
  else if (a.vecka > isoVecka(new Date(Date.now() + 2 * 36e5))) f('vecka ligger i framtiden (' + a.vecka + ')');
  const u = Date.parse(a.uppdaterad);
  if (!isFinite(u)) f('uppdaterad går inte att tolka'); else if (u > Date.now() + 36e5) f('uppdaterad ligger i framtiden');
  const omr = ((a.enkel || {})['elområden'] || []).map((x) => x && x['elområde']).sort().join(',');
  if (omr !== 'SE1,SE2,SE3,SE4') f('enkel.elområden ska vara SE1–SE4');
  ((a.enkel || {})['elområden'] || []).forEach((x) => { if (['upp', 'ned', 'oförändrat', 'okänt'].indexOf(x.riktning) < 0) f('ogiltig riktning ' + x.riktning); });
  if (typeof (a.enkel || {}).sammanfattning !== 'string') f('enkel.sammanfattning saknas');
  const k = (a.avancerad || {})['källor'];
  if (!Array.isArray(k) || !k.length) f('avancerad.källor saknas');
  else k.forEach((x) => {
    if (!x || !x.id || !x.namn) f('källa utan id/namn');
    else if (['aktuell', 'förra_veckan', 'ej_läsbar', 'månadsprognos'].indexOf(x.status) < 0) f('källa ' + x.id + ': ogiltig status');
    else if (x.url && !/^https?:\/\//.test(x.url)) f('källa ' + x.id + ': ogiltig länk');
  });
  const e = (a.enkel || {}).elbrist;
  if (e !== undefined && !(e && typeof e.text === 'string' && e.text.length <= 60 && /^\d{4}-\d\d-\d\d$/.test(e.datum || ''))) f('enkel.elbrist har fel format');
  if (a.varningar !== undefined && !Array.isArray(a.varningar)) f('varningar ska vara en lista');
}
try {
  const w = las('veckoanalys.js');
  if (!Array.isArray(w.VECKOANALYS_KALLOR) || !w.VECKOANALYS_KALLOR.length) fel.push('VECKOANALYS_KALLOR saknas');
  kontroll(w.VECKOANALYS, 'VECKOANALYS');
} catch (e) { fel.push('veckoanalys.js går inte att läsa: ' + e.message); }
try {
  const w = las('veckoanalys-arkiv.js');
  if (!Array.isArray(w.VECKOANALYS_ARKIV)) fel.push('VECKOANALYS_ARKIV ska vara en lista');
  else w.VECKOANALYS_ARKIV.forEach((a, i) => { if (!a || !/^\d{4}-W\d{2}$/.test(a.vecka || '')) fel.push('arkivpost ' + i + ' saknar vecka'); });
} catch (e) { fel.push('veckoanalys-arkiv.js går inte att läsa: ' + e.message); }
if (fel.length) { console.error('OGILTIG:\n- ' + fel.join('\n- ')); process.exit(1); }
console.log('Veckoanalysen är giltig.');
