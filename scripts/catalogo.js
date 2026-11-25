// Junta os meta.json das seções APROVADAS em catalogo.json (o único arquivo que o diretor lê sobre a biblioteca)
import path from 'node:path';
import { P, readJSON, writeJSON, walk } from './lib/util.js';
const todas = walk(P('sections'), (f) => f.endsWith(`${path.sep}meta.json`) && !f.includes(`${path.sep}_raw${path.sep}`)).map((f) => readJSON(f));
const ok = todas.filter((m) => m.aprovada);
const slim = ok.map(({ id, tipo, origem, descricao, estilo, nicho, libs, animacao, nota, mobile_ok, slots }) => ({
  id, tipo, origem, descricao, estilo, nicho, libs, animacao, nota, mobile_ok,
  slots_img: Object.entries(slots || {}).filter(([, s]) => s.tipo === 'img').map(([k]) => k.replace(/^img:/, '')),
  tem_lista: Object.values(slots || {}).some((s) => s.tipo === 'lista')
}));
writeJSON(P('catalogo.json'), { gerado: new Date().toISOString(), total: slim.length, secoes: slim });
const porTipo = {}; slim.forEach((m) => { porTipo[m.tipo] = (porTipo[m.tipo] || 0) + 1; });
console.log(`✓ catalogo.json: ${slim.length} aprovadas de ${todas.length} → ${Object.entries(porTipo).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
for (const t of ['hero', 'servicos', 'sobre', 'processo', 'cta-final']) if ((porTipo[t] || 0) < 4) console.warn(`! ${t}: só ${porTipo[t] || 0} variações (meta: 4+)`);
