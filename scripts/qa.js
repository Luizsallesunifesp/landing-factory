// QA automático: abre a página no Chromium (mobile e desktop), testa e tira screenshots em fatias para o juiz.
// Uso: npm run qa -- <slug> [--ciclo 1|2]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { requireSlug, clientDir, readJSON, writeJSON, mkdir, opt, addStatus, walk } from './lib/util.js';
import { serve } from './lib/serve.js';
import { chromium as loadChromium } from './lib/pw.js';
import { TOKENS_PADRAO } from './lib/defaults.js';

const slug = requireSlug(); const ciclo = Number(opt('--ciclo', 1));
const out = clientDir(slug, 'output'), qaDir = clientDir(slug, 'qa');
fs.rmSync(qaDir, { recursive: true, force: true }); mkdir(qaDir);
const plano = readJSON(clientDir(slug, 'plano.json'));
const problemas = []; const P = (id, severidade, detalhe, secao = 'pagina') => problemas.push({ id, severidade, secao, detalhe });

// --- checagens estáticas ---
const html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
const sobras = [...html.matchAll(/\{\{[^}]+\}\}|⟦[^⟧]+⟧/g)].map((m) => m[0]);
if (sobras.length) P('slot_sobrando', 'alta', `Slots não preenchidos: ${[...new Set(sobras)].slice(0, 10).join(', ')}`);
const b64 = [...html.matchAll(/data:image\/[\w+]+;base64,[A-Za-z0-9+/=]{2700,}/g)].length;
if (b64) P('base64', 'media', `${b64} imagens grandes em base64 dentro do HTML`);
const was = [...html.matchAll(/https:\/\/wa\.me\/(\d*)/g)].map((m) => m[1]);
if (!was.length) P('whatsapp_ausente', 'alta', 'Nenhum link wa.me na página');
else if (was.some((n) => !/^55\d{10,11}$/.test(n))) P('whatsapp_invalido', 'alta', `Número de WhatsApp inválido: ${[...new Set(was)].join(', ')}`);
for (const [tag, re] of [['title', /<title>[^<]{5,}<\/title>/], ['description', /name="description" content="[^"]{20,}"/], ['og:image', /og:image" content="[^"]+"/]]) if (!re.test(html)) P(`meta_${tag}`, 'baixa', `Falta ${tag}`);
const peso = walk(out, (f) => !/\.(mp4|webm)$/i.test(f) && !f.includes(`${path.sep}sections${path.sep}`)).reduce((a, f) => a + fs.statSync(f).size, 0);
if (peso > 1.5 * 1024 * 1024) P('peso', 'media', `Página com ${(peso / 1048576).toFixed(2)} MB sem vídeo (limite 1,5 MB)`);

// contraste dos tokens
const tk = { ...TOKENS_PADRAO, ...(plano.design?.tokens || {}) };
const lum = (hex) => { const m = String(hex).trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i); if (!m) return null; let h = m[1]; if (h.length === 3) h = [...h].map((c) => c + c).join(''); const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); if (x == null || y == null) return null; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
for (const [a, b] of [['--c-text', '--c-bg'], ['--c-on-primary', '--c-primary'], ['--c-muted', '--c-bg'], ['--c-on-dark', '--c-dark']]) {
  const r = ratio(tk[a], tk[b]);
  if (r != null && r < 4.5) P('contraste', a === '--c-muted' ? 'baixa' : 'media', `Contraste ${a} sobre ${b} = ${r.toFixed(2)} (mínimo 4,5)`);
}

// --- navegador ---
const chromium = await loadChromium();
const srv = await serve(out);
const browser = await chromium.launch();
const metricas = {};
async function rodar(nome, viewport, fatia, maxFatias) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: nome === 'mobile', hasTouch: nome === 'mobile', reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  const erros = [];
  page.on('console', (m) => m.type() === 'error' && erros.push(m.text().slice(0, 200)));
  page.on('pageerror', (e) => erros.push(String(e.message).slice(0, 200)));
  page.on('requestfailed', (r) => !/fonts\.g|analytics|facebook/.test(r.url()) && erros.push(`falhou: ${r.url().slice(0, 120)}`));
  const t0 = Date.now();
  await page.goto(srv.url + '/', { waitUntil: 'load', timeout: 45000 });
  const fcp = await page.evaluate(() => performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0);
  // rola a página inteira para disparar AOS/ScrollTrigger/lazy
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 140)); } scrollTo(0, 0); });
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => {
    const vw = innerWidth; const chave = (el) => el.closest('[data-chave]')?.dataset.chave || 'pagina';
    const overflow = [...document.querySelectorAll('body *')].filter((el) => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return b.width > 0 && b.right > vw + 2 && cs.position !== 'fixed' && !el.closest('[data-lf-scroll-x]'); })
      .slice(0, 8).map((el) => ({ secao: chave(el), el: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''), direita: Math.round(el.getBoundingClientRect().right) }));
    const imgs = [...document.images];
    const quebradas = imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => ({ secao: chave(i), src: i.getAttribute('src') }));
    const semAlt = imgs.filter((i) => !i.hasAttribute('alt')).map((i) => chave(i));
    const distorcidas = imgs.filter((i) => { if (!i.naturalWidth || !i.clientWidth || getComputedStyle(i).objectFit !== 'fill') return false; const a = i.naturalWidth / i.naturalHeight, b = i.clientWidth / i.clientHeight; return Math.abs(a - b) / a > 0.08; }).map((i) => chave(i));
    const alvos = vw < 600 ? [...document.querySelectorAll('a[href],button')].filter((a) => { const b = a.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.height < 40 && /btn|cta|button/i.test(a.className); }).map((a) => chave(a)) : [];
    const primeiraDobra = [...document.querySelectorAll('a[href*="wa.me"]')].some((a) => { const b = a.getBoundingClientRect(); return b.top < innerHeight * 1.2 && b.width > 0 && getComputedStyle(a).visibility !== 'hidden'; });
    return { scrollW: document.documentElement.scrollWidth, vw, altura: document.body.scrollHeight, overflow, quebradas, semAlt, distorcidas, alvos, primeiraDobra, fontes: document.fonts.status };
  });
  // para a screenshot: estado final das animações de entrada
  await page.addStyleTag({ content: '[data-aos]{opacity:1!important;transform:none!important}.lf-wa{display:none!important}' });
  await page.evaluate(() => window.ScrollTrigger?.getAll().forEach((t) => t.animation?.progress?.(1)));
  await page.waitForTimeout(300);
  const full = await page.screenshot({ fullPage: true, type: 'png' });
  const meta = await sharp(full).metadata();
  const n = Math.min(maxFatias, Math.ceil(meta.height / fatia));
  const passo = n < Math.ceil(meta.height / fatia) ? Math.floor(meta.height / n) : fatia;
  for (let i = 0; i < n; i++) {
    const top = i * passo; const h = Math.min(passo, meta.height - top);
    await sharp(full).extract({ left: 0, top, width: meta.width, height: h }).resize({ width: Math.min(meta.width, 1000), withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(path.join(qaDir, `${nome}-${i + 1}.png`));
  }
  metricas[nome] = { fcp_ms: Math.round(fcp), carregou_ms: Date.now() - t0, altura_px: r.altura, fatias: n, erros_console: erros.length };
  if (r.scrollW > r.vw + 2) P('overflow', 'alta', `${nome}: rolagem horizontal (${r.scrollW}px > ${r.vw}px). Elementos: ${r.overflow.map((o) => `${o.secao} ${o.el}`).join('; ')}`, r.overflow[0]?.secao);
  r.quebradas.forEach((q) => P('img_quebrada', 'alta', `${nome}: imagem quebrada ${q.src}`, q.secao));
  if (nome === 'mobile') {
    [...new Set(r.semAlt)].forEach((s) => P('img_sem_alt', 'baixa', 'Imagem sem alt', s));
    [...new Set(r.distorcidas)].forEach((s) => P('img_distorcida', 'media', 'Imagem distorcida (use object-fit: cover)', s));
    [...new Set(r.alvos)].forEach((s) => P('toque_pequeno', 'baixa', 'Botão com menos de 40 px de altura no mobile', s));
    if (!r.primeiraDobra) P('cta_dobra', 'media', 'Nenhum botão de WhatsApp visível no primeiro scroll do mobile', plano.secoes[0]?.chave);
    if (fcp > 2500) P('lento', 'baixa', `Primeira pintura em ${Math.round(fcp)} ms no mobile`);
  }
  if (r.fontes !== 'loaded') P('fontes', 'baixa', `${nome}: fontes não carregaram (${r.fontes})`);
  [...new Set(erros)].slice(0, 6).forEach((e) => P('console', 'media', `${nome}: ${e}`));
  await ctx.close();
}
try {
  await rodar('mobile', { width: 390, height: 844 }, 1700, 8);
  await rodar('desktop', { width: 1440, height: 900 }, 1800, 6);
} finally { await browser.close(); srv.close(); }

const cont = problemas.reduce((a, p) => ({ ...a, [p.severidade]: (a[p.severidade] || 0) + 1 }), {});
writeJSON(path.join(qaDir, 'relatorio.json'), { ciclo, em: new Date().toISOString(), peso_kb: Math.round(peso / 1024), metricas, contagem: cont, problemas });
addStatus(slug, `qa ciclo ${ciclo}`, JSON.stringify(cont));
console.log(`✓ QA ciclo ${ciclo}: ${problemas.length} problemas ${JSON.stringify(cont)} · ${Math.round(peso / 1024)} KB · screenshots em qa/`);
for (const p of problemas.filter((x) => ['critica', 'alta'].includes(x.severidade))) console.log(`  [${p.severidade}] ${p.secao}: ${p.detalhe}`);
