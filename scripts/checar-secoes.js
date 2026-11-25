// Verifica as seções padronizadas: cores fixas, classes sem prefixo, slots não declarados, base64.
import fs from 'node:fs';
import path from 'node:path';
import { P, readJSON, walk, exists } from './lib/util.js';
import { slotsUsed } from './lib/template.js';
import { AUTO } from './lib/secoes.js';
const metas = walk(P('sections'), (f) => f.endsWith(`${path.sep}meta.json`) && !f.includes(`${path.sep}_raw${path.sep}`));
let comErro = 0;
for (const mf of metas) {
  const dir = path.dirname(mf); const meta = readJSON(mf); const e = [];
  const html = fs.readFileSync(path.join(dir, 'section.html'), 'utf8');
  const css = exists(path.join(dir, 'section.css')) ? fs.readFileSync(path.join(dir, 'section.css'), 'utf8') : '';
  const semComent = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const hex = [...semComent.matchAll(/(?<![\w-])#[0-9a-f]{3,8}\b/gi)].map((m) => m[0]);
  if (hex.length) e.push(`cores fixas no CSS: ${[...new Set(hex)].slice(0, 6).join(' ')}`);
  if (/data:image\/[\w+]+;base64,.{2000}/.test(html + css)) e.push('base64 grande');
  const pref = `${meta.id}__`;
  const classes = [...html.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)).filter((c) => c && !c.includes('{{'));
  const sem = [...new Set(classes.filter((c) => !c.startsWith(pref) && c !== `s-${meta.id}` && !/^(lf-|is-|aos-)/.test(c)))];
  if (sem.length) e.push(`classes sem prefixo "${pref}": ${sem.slice(0, 6).join(' ')}`);
  const usados = [...slotsUsed(html)].filter((k) => !AUTO.includes(k) && !k.startsWith('@'));
  const decl = new Set(Object.keys(meta.slots || {}));
  Object.values(meta.slots || {}).forEach((s) => Object.keys(s.campos || {}).forEach((c) => decl.add(c)));
  const naoDecl = usados.filter((k) => !decl.has(k) && !decl.has(k.replace(/^img:/, '')) && !decl.has('img:' + k.replace(/^img:/, '')) && !k.startsWith('alt:'));
  if (naoDecl.length) e.push(`slots sem declaração no meta: ${naoDecl.join(', ')}`);
  if (!/data-secao=|<(nav|header|footer)/.test(html)) e.push('raiz sem data-secao');
  if (e.length) { comErro++; console.log(`✗ ${meta.id}\n   - ${e.join('\n   - ')}`); }
}
console.log(`\n${metas.length - comErro}/${metas.length} seções sem problemas.`);
process.exit(comErro ? 2 : 0);
