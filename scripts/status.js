// Registra uma etapa no status.json. Uso: node scripts/status.js <slug> "<etapa>" "<resultado>"
//   node scripts/status.js <slug> rodada +1     → soma uma rodada de ajuste
//   node scripts/status.js <slug> fase <nome>   → muda a fase
import { requireSlug, addStatus, clientDir, readJSON, writeJSON } from './lib/util.js';
const slug = requireSlug(); const [, , , etapa, resultado = 'ok'] = process.argv;
if (!etapa) { console.log(JSON.stringify(readJSON(clientDir(slug, 'status.json'), {}), null, 2)); process.exit(0); }
const st = addStatus(slug, etapa, resultado);
if (etapa === 'rodada') st.rodadas_ajuste = (st.rodadas_ajuste || 0) + 1;
if (etapa === 'fase') st.fase = resultado;
writeJSON(clientDir(slug, 'status.json'), st);
console.log(`✓ ${slug}: ${etapa} → ${resultado}${etapa === 'rodada' ? ` (total ${st.rodadas_ajuste})` : ''}`);
