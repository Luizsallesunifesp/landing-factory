// Quebra páginas prontas em seções brutas para a biblioteca.
// Uso: npm run extrair -- "<pasta com subpastas de clientes | arquivo.html>" [--cliente nome]
// Saída: sections/_raw/<cliente>/{page.css,page.js,assets/,NN-nome/{section.html,info.json}}
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
import { P, mkdir, writeJSON, slugify, opt, walk } from './lib/util.js';

const origem = process.argv[2];
if (!origem) { console.error('Uso: npm run extrair -- "<pasta ou arquivo>"'); process.exit(1); }
const IGNORAR = /(backup|longa|index2|copia|cópia|old|teste)/i;

// Descobre as páginas: <pasta>/<cliente>/index.html (ou "index .html"), ou um arquivo único.
function descobrir(o) {
  if (o.endsWith('.html')) return [{ cliente: opt('--cliente', slugify(path.basename(path.dirname(o)))), arquivo: o }];
  const out = [];
  for (const d of fs.readdirSync(o, { withFileTypes: true })) {
    if (d.isFile() && d.name.endsWith('.zip')) { console.warn(`! ${d.name}: descompacte antes (o script não lê .zip)`); continue; }
    if (!d.isDirectory() || IGNORAR.test(d.name)) continue;
    const htmls = walk(path.join(o, d.name), (f) => f.endsWith('.html') && !/404/.test(f));
    const principal = htmls.find((f) => /index\s*\.html$/i.test(path.basename(f)) && !IGNORAR.test(path.basename(f))) || htmls.find((f) => !IGNORAR.test(path.basename(f)));
    if (principal) out.push({ cliente: slugify(d.name.replace(/^landing[- ]page[- ]?/i, '').replace(/^landing-/, '')), arquivo: principal });
  }
  return out;
}

const EXT = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'image/avif': 'avif', 'video/mp4': 'mp4', 'video/webm': 'webm' };

async function extrairPagina({ cliente, arquivo }) {
  const base = P('sections', '_raw', cliente);
  fs.rmSync(base, { recursive: true, force: true });
  mkdir(path.join(base, 'assets'));
  const html = fs.readFileSync(arquivo, 'utf8');
  const pageDir = path.dirname(arquivo);
  let n = 0; const cache = new Map(); const pend = [];

  // Troca data: URIs por arquivos. Imagens raster viram WebP (máx. 1920 px).
  const salvarData = (uri) => {
    if (cache.has(uri)) return cache.get(uri);
    const m = uri.match(/^data:([\w/+.-]+)(;base64)?,(.*)$/s);
    if (!m) return uri;
    const mime = m[1].toLowerCase(); const ext = EXT[mime];
    if (!ext) return uri;
    const buf = m[2] ? Buffer.from(m[3], 'base64') : Buffer.from(decodeURIComponent(m[3]));
    if (buf.length < 2048 && ext === 'svg') return uri; // ícones pequenos ficam inline
    n++;
    const raster = ['jpg', 'png', 'webp', 'avif'].includes(ext);
    const nome = `img-${String(n).padStart(3, '0')}.${raster ? 'webp' : ext}`;
    const dest = path.join(base, 'assets', nome);
    if (raster) pend.push(sharp(buf).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 80 }).toFile(dest).catch(() => fs.writeFileSync(dest.replace('.webp', '.' + ext), buf)));
    else fs.writeFileSync(dest, buf);
    const rel = `assets/${nome}`; cache.set(uri, rel); return rel;
  };
  const trocarDatas = (txt) => txt.replace(/data:(image|video)\/[\w+.-]+;base64,[A-Za-z0-9+/=\s]+/g, (u) => salvarData(u.replace(/\s/g, '')));

  // Copia mídia referenciada por arquivo (ex.: padrão Samanta com assets/)
  const copiarLocal = (src) => {
    if (!src || /^(https?:|data:|#|mailto:|tel:)/.test(src)) return src;
    const f = path.join(pageDir, src.split(/[?#]/)[0]);
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return src;
    const dest = path.join(base, 'assets', 'local', src.split(/[?#]/)[0]);
    mkdir(path.dirname(dest)); fs.copyFileSync(f, dest);
    return 'assets/local/' + src.split(/[?#]/)[0];
  };

  const $ = cheerio.load(trocarDatas(html), { decodeEntities: false });

  // CSS e JS da página inteira (o padronizador busca neles por seletor)
  const css = $('style').map((_, e) => $(e).html()).get().join('\n\n');
  fs.writeFileSync(path.join(base, 'page.css'), css);
  const js = $('script:not([src])').map((_, e) => $(e).html()).get().filter((s) => !/application\/ld\+json/.test(s)).join('\n\n/* ---- */\n\n');
  fs.writeFileSync(path.join(base, 'page.js'), js);
  const libsExternas = $('script[src],link[rel=stylesheet]').map((_, e) => $(e).attr('src') || $(e).attr('href')).get();
  const fontes = libsExternas.filter((u) => /fonts.googleapis/.test(u));

  // Seções de nível superior
  const blocos = $('nav,header,section,footer').filter((_, el) => $(el).parents('nav,header,section,footer').length === 0);
  const resumo = [];
  blocos.each((i, el) => {
    const $el = $(el);
    $el.find('img,source,video').each((_, m) => {
      for (const a of ['src', 'poster', 'data-src']) { const v = $(m).attr(a); if (v) $(m).attr(a, copiarLocal(v)); }
      const ss = $(m).attr('srcset'); if (ss) $(m).attr('srcset', ss.split(',').map((p) => { const [u, w] = p.trim().split(/\s+/); return [copiarLocal(u), w].filter(Boolean).join(' '); }).join(', '));
    });
    const tag = el.tagName.toLowerCase();
    const id = $el.attr('id') || '';
    const cls = ($el.attr('class') || '').split(/\s+/).filter(Boolean);
    const nome = slugify(id || cls[0] || tag) || tag;
    const pasta = `${String(i + 1).padStart(2, '0')}-${nome}`;
    const dir = path.join(base, pasta); mkdir(dir);
    const out = $.html($el);
    fs.writeFileSync(path.join(dir, 'section.html'), out);

    const seletores = new Set(); if (id) seletores.add('#' + id);
    $el.find('[id]').addBack('[id]').each((_, x) => seletores.add('#' + $(x).attr('id')));
    $el.find('[class]').addBack('[class]').each((_, x) => ($(x).attr('class') || '').split(/\s+/).filter(Boolean).forEach((c) => seletores.add('.' + c)));
    const texto = $el.text().replace(/\s+/g, ' ').trim();
    const info = {
      cliente, ordem: i + 1, pasta, tag, id, classes: cls,
      seletores: [...seletores].slice(0, 80),
      libs: {
        aos: /data-aos/.test(out), gsap: /gsap|data-gsap|data-split|data-reveal/i.test(out),
        canvas: /<canvas/.test(out), video: /<video/.test(out), iframe: /<iframe/.test(out)
      },
      imagens: [...out.matchAll(/assets\/[\w./-]+/g)].map((m) => m[0]).filter((v, k, a) => a.indexOf(v) === k),
      whatsapp: /wa\.me|api\.whatsapp/.test(out),
      tamanho_kb: Math.round(Buffer.byteLength(out) / 1024),
      texto_amostra: texto.slice(0, 400),
      fontes_pagina: fontes
    };
    writeJSON(path.join(dir, 'info.json'), info);
    resumo.push(`${pasta} (${info.tamanho_kb} KB)`);
  });

  // imagens de fundo no CSS
  fs.writeFileSync(path.join(base, 'page.css'), trocarDatas(css));
  await Promise.all(pend);
  writeJSON(path.join(base, 'pagina.json'), { cliente, arquivo_origem: arquivo, extraido_em: new Date().toISOString(), libs_externas: libsExternas, secoes: resumo.length, imagens_extraidas: n });
  const pesoAntes = Math.round(Buffer.byteLength(html) / 1024);
  console.log(`✓ ${cliente.padEnd(20)} ${String(resumo.length).padStart(2)} seções · ${String(n).padStart(3)} imagens extraídas · HTML ${pesoAntes} KB`);
  return resumo.length;
}

const paginas = descobrir(origem);
if (!paginas.length) { console.error('Nenhuma página encontrada.'); process.exit(1); }
let total = 0;
for (const p of paginas) {
  try { total += await extrairPagina(p); } catch (e) { console.error(`✗ ${p.cliente}: ${e.message}`); }
}
console.log(`\n${paginas.length} páginas, ${total} seções em sections/_raw/. Próximo passo: classificar com o agente classificador-secoes.`);
