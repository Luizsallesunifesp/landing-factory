// Tabela das seções brutas classificadas → sections/_raw/RESUMO.md
import fs from 'node:fs';
import path from 'node:path';
import { P, readJSON, walk } from './lib/util.js';
const metas = walk(P('sections', '_raw'), (f) => f.endsWith('meta.draft.json')).map((f) => ({ pasta: path.relative(P('sections', '_raw'), path.dirname(f)).replace(/\\/g, '/'), ...readJSON(f, {}) }));
const semMeta = walk(P('sections', '_raw'), (f) => f.endsWith('info.json')).length - metas.length;
metas.sort((a, b) => (a.tipo || '').localeCompare(b.tipo || '') || (b.nota_sugerida || 0) - (a.nota_sugerida || 0));
const porTipo = {}; metas.forEach((m) => { porTipo[m.tipo] = (porTipo[m.tipo] || 0) + 1; });
let md = `# Seções brutas classificadas\n\n${metas.length} classificadas${semMeta ? `, ${semMeta} ainda sem classificação` : ''}.\n\n**Por tipo:** ${Object.entries(porTipo).map(([k, v]) => `${k} ${v}`).join(' · ')}\n\n| Pasta | Tipo | Nota | Reaproveitável | Estilo | Descrição |\n|---|---|---|---|---|---|\n`;
for (const m of metas) md += `| ${m.pasta} | ${m.tipo} | ${m.nota_sugerida ?? '-'} | ${m.reaproveitavel === false ? 'não' : 'sim'} | ${(m.estilo || []).join(', ')} | ${(m.descricao || '').replace(/\|/g, '/')} |\n`;
fs.writeFileSync(P('sections', '_raw', 'RESUMO.md'), md);
console.log(md.split('\n').slice(0, 5).join('\n') + `\n\n→ sections/_raw/RESUMO.md`);
