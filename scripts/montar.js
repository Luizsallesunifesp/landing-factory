// Monta output/index.html a partir do plano + copy + biblioteca (0 tokens).
// Uso: npm run montar -- <slug> [--rascunho]   (--rascunho: preenche slots faltando com marcação visível)
import fs from 'node:fs';
import path from 'node:path';
import { requireSlug, clientDir, readJSON, writeJSON, mkdir, exists, flag, addStatus, P } from './lib/util.js';
import { render } from './lib/template.js';
import { dirSecao, carregarSecao, marcarRaiz, contextoAuto } from './lib/secoes.js';
import { tokensCSS, CDN, LIB_ORDEM, waLink, TOKENS_PADRAO } from './lib/defaults.js';

const slug = requireSlug();
const plano = readJSON(clientDir(slug, 'plano.json'));
const copy = readJSON(clientDir(slug, 'copy.json'), flag('--rascunho') ? { secoes: {} } : undefined);
const briefing = readJSON(clientDir(slug, 'briefing.json'), {});
const out = clientDir(slug, 'output');
fs.rmSync(out, { recursive: true, force: true });
mkdir(path.join(out, 'assets')); mkdir(path.join(out, 'sections'));

const web = clientDir(slug, 'work', 'web');
const usadas = new Set();
const usarImagem = (arq) => {
  if (!arq) return '';
  if (/^https?:/.test(arq)) return arq;
  const nome = path.basename(arq);
  const src = path.join(web, nome);
  if (!exists(src)) return '';
  if (!usadas.has(nome)) {
    fs.copyFileSync(src, path.join(out, 'assets', nome));
    const m800 = nome.replace(/\.webp$/, '-800.webp');
    if (exists(path.join(web, m800))) fs.copyFileSync(path.join(web, m800), path.join(out, 'assets', m800));
    usadas.add(nome);
  }
  return `assets/${nome}`;
};
// Arquivos estáticos que a seção traz da biblioteca (ex.: sequência de frames)
const copiarEstaticos = (dir) => { const a = path.join(dir, 'assets'); if (exists(a)) fs.cpSync(a, path.join(out, 'assets'), { recursive: true }); };

const auto = contextoAuto(briefing, plano);
const wa = waLink(plano.whatsapp?.numero || briefing.contato?.whatsapp, copy.whatsapp_mensagem || plano.whatsapp?.mensagem || '');
const libs = new Set((plano.design?.libs || []).map((l) => l.toLowerCase()));
const faltando = []; const corpo = []; const css = []; const js = [];

for (const s of [...plano.secoes].sort((a, b) => a.ordem - b.ordem)) {
  s.chave ||= `${String(s.ordem).padStart(2, '0')}-${s.id}`;
  const dir = dirSecao(s, slug);
  const sec = carregarSecao(dir);
  copiarEstaticos(dir);
  (sec.meta.libs || []).forEach((l) => libs.add(String(l).toLowerCase()));
  const dados = copy.secoes?.[s.chave] || {};
  const miss = new Set();
  const resolver = (key, stack) => {
    if (key === 'whatsapp_link') return wa;
    if (key in auto) return auto[key];
    const [tipo, nome] = key.includes(':') ? key.split(/:(.*)/) : [null, key];
    if (tipo === 'img') {
      const idx = stack.findLast?.((x) => x && '@index' in x)?.['@index'];
      const item = stack[stack.length - 1] || {};
      return usarImagem(item[key] || (idx && s.imagens?.[`${nome}.${idx}`]) || s.imagens?.[nome]);
    }
    if (tipo === 'alt') return dados[key] || auto.nome_negocio;
    if (flag('--rascunho')) return `⟦${key}⟧`;
    return undefined;
  };
  let html = render(sec.html, dados, resolver, miss);
  html = marcarRaiz(html, s.chave);
  miss.forEach((k) => !k.startsWith('img:') && faltando.push(`${s.chave} → ${k}`));
  corpo.push(`<!-- ${s.chave} -->\n${html}`);
  if (sec.css) css.push(`/* ${s.chave} */\n${sec.css}`);
  if (sec.js) js.push(`<script>/* ${s.chave} */\ntry{${sec.js}\n}catch(e){console.error('[${s.chave}]',e)}</script>`);
  fs.writeFileSync(path.join(out, 'sections', `${s.chave}.html`), html);
}

// libs na ordem certa
if (libs.has('scrolltrigger')) libs.add('gsap');
const ordem = LIB_ORDEM.filter((l) => libs.has(l));
const libsHead = ordem.filter((l) => CDN[l].css).map((l) => `<link rel="stylesheet" href="${CDN[l].css}">`).join('\n');
const libsBody = ordem.map((l) => `<script src="${CDN[l].js}"></script>`).join('\n');

// favicon com a inicial
const tokens = { ...TOKENS_PADRAO, ...(plano.design?.tokens || {}) };
const inicial = (auto.nome_negocio || slug)[0].toUpperCase();
fs.writeFileSync(path.join(out, 'assets', 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${tokens['--c-primary']}"/><text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Georgia,serif" font-size="38" fill="${tokens['--c-on-primary']}">${inicial}</text></svg>`);
const ogSrc = plano.seo?.og_imagem || Object.values(plano.secoes.find((x) => x.tipo === 'hero')?.imagens || {})[0];
const og = usarImagem(ogSrc);

const shell = fs.readFileSync(P('sections', '_base', 'shell.html'), 'utf8');
const pagina = render(shell, {
  title: plano.seo?.title || auto.nome_negocio, description: plano.seo?.description || '', og_image: og,
  theme_color: tokens['--c-primary'], fonts_url: plano.design?.fontes?.google_fonts_url || '',
  libs_head: libsHead, libs_body: libsBody, tokens: tokensCSS(plano.design?.tokens),
  css: css.join('\n\n'), body: corpo.join('\n\n'), js: js.join('\n'),
  whatsapp_link: wa, whatsapp_float_text: plano.whatsapp?.texto_botao || 'Agendar'
});
fs.writeFileSync(path.join(out, 'index.html'), pagina);
fs.writeFileSync(path.join(out, '_headers'), `/assets/*\n  Cache-Control: public, max-age=2592000\n/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`);
fs.writeFileSync(path.join(out, '404.html'), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Página não encontrada</title><body style="font-family:system-ui;display:grid;place-items:center;min-height:90vh;text-align:center"><div><p>Página não encontrada.</p><p><a href="/">Voltar ao início</a></p></div>`);

const peso = fs.readdirSync(path.join(out, 'assets')).reduce((a, f) => { const st = fs.statSync(path.join(out, 'assets', f)); return a + (st.isFile() ? st.size : 0); }, Buffer.byteLength(pagina));
writeJSON(clientDir(slug, 'work', 'montagem.json'), { em: new Date().toISOString(), secoes: plano.secoes.length, imagens: usadas.size, peso_kb: Math.round(peso / 1024), libs: ordem, slots_faltando: faltando });
addStatus(slug, 'montar', faltando.length ? `${faltando.length} slots faltando` : 'ok');
console.log(`✓ output/index.html: ${plano.secoes.length} seções, ${usadas.size} imagens, ${Math.round(peso / 1024)} KB, libs: ${ordem.join(', ') || 'nenhuma'}`);
if (faltando.length) console.warn(`! ${faltando.length} slots sem copy:\n  - ${faltando.slice(0, 15).join('\n  - ')}`);
