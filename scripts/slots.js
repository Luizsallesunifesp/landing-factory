// Gera work/slots.json: para cada seção do plano, os slots que o copywriter precisa preencher.
import { requireSlug, clientDir, readJSON, writeJSON, exists, addStatus } from './lib/util.js';
import { AUTO, dirSecao, carregarSecao } from './lib/secoes.js';
import { slotsUsed } from './lib/template.js';
const slug = requireSlug();
const plano = readJSON(clientDir(slug, 'plano.json'));
const cat = readJSON(new URL('../catalogo.json', import.meta.url), { secoes: [] });
const ids = new Set(cat.secoes.map((s) => s.id));
const erros = []; const out = {};
for (const s of plano.secoes) {
  s.chave ||= `${String(s.ordem).padStart(2, '0')}-${s.id}`;
  const dir = dirSecao(s, slug);
  if (!exists(dir)) { erros.push(`${s.id} (tipo ${s.tipo}) não existe na biblioteca`); continue; }
  if (!ids.has(s.id) && !exists(clientDir(slug, 'overrides', s.chave))) erros.push(`${s.id} existe mas não está aprovada no catálogo`);
  const { html, meta } = carregarSecao(dir);
  const usados = slotsUsed(html);
  const slots = {};
  for (const [k, v] of Object.entries(meta.slots || {})) {
    if (AUTO.includes(k) || v.tipo === 'img' || k.startsWith('img:')) continue;
    slots[k] = v;
  }
  for (const k of usados) if (!AUTO.includes(k) && !k.startsWith('img:') && !(k in slots) && !(k in (meta.slots || {})) && !Object.values(meta.slots || {}).some((v) => v.campos && k in v.campos)) slots[k] = { tipo: 'texto', descricao: '(não declarado no meta)' };
  const imgs = [...usados].filter((k) => k.startsWith('img:')).map((k) => k.slice(4));
  const semImagem = imgs.filter((n) => !(s.imagens || {})[n] && !Object.keys(s.imagens || {}).some((k) => k.startsWith(n + '.')));
  if (semImagem.length) erros.push(`${s.chave}: slots de imagem sem foto no plano → ${semImagem.join(', ')}`);
  out[s.chave] = { tipo: s.tipo, id: s.id, objetivo: s.objetivo, slots };
}
writeJSON(clientDir(slug, 'plano.json'), plano);
writeJSON(clientDir(slug, 'work', 'slots.json'), { automaticos: AUTO, secoes: out });
const total = Object.values(out).reduce((a, s) => a + Object.keys(s.slots).length, 0);
addStatus(slug, 'slots', erros.length ? `${erros.length} erros` : `${total} slots`);
console.log(`✓ work/slots.json: ${Object.keys(out).length} seções, ${total} slots para o copywriter`);
if (erros.length) { console.error('ERROS:\n- ' + erros.join('\n- ')); process.exit(2); }
