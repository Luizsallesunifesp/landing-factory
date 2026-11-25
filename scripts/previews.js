// Gera preview.png (mobile) de cada seção da biblioteca com tokens padrão e textos de exemplo + sections/PREVIEWS.html
import fs from 'node:fs';
import path from 'node:path';
import { P, readJSON, walk, exists } from './lib/util.js';
import { render } from './lib/template.js';
import { tokensCSS, FONTS_PADRAO, CDN, LIB_ORDEM } from './lib/defaults.js';
import { serve } from './lib/serve.js';
import { chromium as loadChromium } from './lib/pw.js';

const metas = walk(P('sections'), (f) => f.endsWith(`${path.sep}meta.json`) && !f.includes(`${path.sep}_raw${path.sep}`));
if (!metas.length) { console.log('Nenhuma seção padronizada ainda.'); process.exit(0); }
const PH = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#c9c1b6"/><path d="M0 600 300 330l140 140 120-90 240 220z" fill="#b2a99c"/><circle cx="600" cy="170" r="60" fill="#b2a99c"/></svg>');
const exemplo = (s = {}, nome = '') => {
  const max = s.max || 60;
  const base = { texto_curto: 'Texto curto', texto: 'Texto de exemplo com o tamanho aproximado do que o copywriter vai escrever aqui.', richtext: 'Parágrafo de exemplo com <strong>destaque</strong> para conferir o ritmo do texto nesta seção.', url: '#' }[s.tipo] || 'Texto de exemplo';
  let t = base; while (t.length < max * 0.7) t += ' ' + base; return t.slice(0, max).trim() || nome;
};
const dados = (slots) => { const o = {}; for (const [k, s] of Object.entries(slots || {})) { if (s.tipo === 'lista') { const n = s.min_itens || 3; o[k] = Array.from({ length: n }, () => Object.fromEntries(Object.entries(s.campos || { titulo: { tipo: 'texto_curto', max: 30 } }).map(([c, cs]) => [c, cs.tipo === 'img' ? PH : exemplo(cs, c)]))); } else if (s.tipo !== 'img') o[k] = exemplo(s, k); } return o; };

const chromium = await loadChromium();
const tmp = P('sections', '_preview_tmp'); fs.rmSync(tmp, { recursive: true, force: true }); fs.mkdirSync(tmp);
const srv = await serve(P('sections'));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const cards = [];
for (const mf of metas) {
  const dir = path.dirname(mf); const meta = readJSON(mf);
  const r = (f) => (exists(path.join(dir, f)) ? fs.readFileSync(path.join(dir, f), 'utf8') : '');
  const html = render(r('section.html'), dados(meta.slots), (k) => (k.startsWith('img:') ? PH : k === 'whatsapp_link' ? '#' : k.startsWith('alt:') ? 'imagem' : 'Exemplo'));
  const libs = LIB_ORDEM.filter((l) => (meta.libs || []).map((x) => x.toLowerCase()).includes(l) || (l === 'gsap' && (meta.libs || []).includes('scrolltrigger')));
  const rel = path.relative(P('sections'), dir).replace(/\\/g, '/');
  const doc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="/${rel}/"><link rel="stylesheet" href="${FONTS_PADRAO}">${libs.filter((l) => CDN[l].css).map((l) => `<link rel="stylesheet" href="${CDN[l].css}">`).join('')}<style>${tokensCSS()}*{box-sizing:border-box}body{margin:0;background:var(--c-bg);color:var(--c-text);font-family:var(--f-body)}img{max-width:100%;display:block}[data-aos]{opacity:1!important;transform:none!important}${r('section.css')}</style></head><body>${html}${libs.map((l) => `<script src="${CDN[l].js}"></script>`).join('')}<script>window.LF={motion:0};try{${r('section.js')}}catch(e){}</script></body></html>`;
  const tf = path.join(tmp, `${meta.id}.html`); fs.writeFileSync(tf, doc);
  try {
    await page.goto(`${srv.url}/_preview_tmp/${meta.id}.html`, { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(dir, 'preview.png'), fullPage: true, clip: undefined });
    const ov = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
    meta.mobile_ok = !ov; fs.writeFileSync(mf, JSON.stringify(meta, null, 2) + '\n');
  } catch (e) { console.warn(`! ${meta.id}: ${e.message.split('\n')[0]}`); }
  cards.push({ rel, meta });
}
await browser.close(); srv.close(); fs.rmSync(tmp, { recursive: true, force: true });
cards.sort((a, b) => a.meta.tipo.localeCompare(b.meta.tipo) || (b.meta.nota || 0) - (a.meta.nota || 0));
const esc = (s) => String(s ?? '').replace(/</g, '&lt;');
fs.writeFileSync(P('sections', 'PREVIEWS.html'), `<!doctype html><meta charset="utf-8"><title>Biblioteca de seções</title><style>body{font-family:system-ui;margin:24px;background:#f4f2ee}h2{margin:32px 0 8px;text-transform:uppercase;font-size:14px;letter-spacing:.1em}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}.c{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px #0002}.c div.i{height:420px;overflow:auto;border-bottom:1px solid #eee}.c img{width:100%;display:block}.c p{margin:8px 12px;font-size:13px}.ok{color:#1a7f37}.no{color:#b42318}</style><h1>Biblioteca: ${cards.length} seções</h1><p>Para aprovar: em <code>sections/&lt;tipo&gt;/&lt;id&gt;/meta.json</code> coloque <code>"aprovada": true</code> e <code>"nota"</code> de 1 a 5. Depois rode <code>npm run catalogo</code>.</p>` +
  [...new Set(cards.map((c) => c.meta.tipo))].map((t) => `<h2>${t}</h2><div class="g">` + cards.filter((c) => c.meta.tipo === t).map(({ rel, meta }) => `<div class="c"><div class="i"><img src="${rel}/preview.png" loading="lazy"></div><p><b>${meta.id}</b> · nota ${meta.nota ?? '-'} · <span class="${meta.aprovada ? 'ok' : 'no'}">${meta.aprovada ? 'aprovada' : 'pendente'}</span>${meta.mobile_ok === false ? ' · <span class="no">overflow no mobile</span>' : ''}</p><p>${esc(meta.descricao)}</p></div>`).join('') + '</div>').join(''));
console.log(`✓ ${cards.length} previews → abra sections/PREVIEWS.html`);
