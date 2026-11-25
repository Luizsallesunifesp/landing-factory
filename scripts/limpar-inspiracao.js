// Baixa os sites de inspiração e gera um resumo limpo (≤ 6 mil caracteres) por site para o leitor-inspiracoes.
import fs from 'node:fs';
import * as cheerio from 'cheerio';
import { clientDir, mkdir, exists } from './lib/util.js';

const LIMITE = 6000;
const UA = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36' };
const get = async (u) => { const r = await fetch(u, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(20000) }); if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); };

function topo(map, n) { return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${k} (${v})`).join(', '); }

export async function limparInspiracoes(slug) {
  const f = clientDir(slug, 'entrada', 'inspiracoes.txt');
  const out = clientDir(slug, 'work', 'inspiracoes'); mkdir(out);
  const urls = exists(f) ? fs.readFileSync(f, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => /^https?:\/\//.test(l)) : [];
  let ok = 0;
  for (const [i, url] of urls.entries()) {
    try {
      const html = await get(url);
      const $ = cheerio.load(html);
      let css = $('style').map((_, e) => $(e).html()).get().join('\n');
      for (const href of $('link[rel=stylesheet]').map((_, e) => $(e).attr('href')).get().filter((h) => h && !/fonts.googleapis/.test(h)).slice(0, 3)) {
        try { css += await get(new URL(href, url).href); } catch {}
      }
      const cores = new Map(), fam = new Map();
      for (const m of css.matchAll(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b|rgba?\([^)]+\)/gi)) { const k = m[0].toLowerCase(); cores.set(k, (cores.get(k) || 0) + 1); }
      for (const m of css.matchAll(/font-family\s*:\s*([^;}]+)/gi)) { const k = m[1].split(',')[0].replace(/["']/g, '').trim(); if (!/var\(|inherit/.test(k)) fam.set(k, (fam.get(k) || 0) + 1); }
      const gf = $('link[href*="fonts.googleapis"]').map((_, e) => decodeURIComponent($(e).attr('href')).match(/family=[^&]+/g)?.join(' ')).get().join(' ');
      const anim = ['gsap', 'ScrollTrigger', 'lenis', 'locomotive', 'aos', 'swiper', 'three', 'lottie', 'framer'].filter((l) => new RegExp(l, 'i').test(html));
      $('script,style,svg,noscript,iframe,link,meta').remove();
      const linhas = [];
      const blocos = $('header,nav,section,footer,main > div,body > div > div').filter((_, el) => $(el).parents('section,header,footer').length === 0).slice(0, 25);
      blocos.each((k, el) => {
        const $el = $(el);
        const hs = $el.find('h1,h2,h3').slice(0, 4).map((_, h) => $(h).text().replace(/\s+/g, ' ').trim().slice(0, 90)).get().filter(Boolean);
        const p = $el.find('p').first().text().replace(/\s+/g, ' ').trim().slice(0, 140);
        const nImg = $el.find('img,picture,video').length, nBtn = $el.find('a,button').filter((_, a) => /btn|button|cta/i.test($(a).attr('class') || '')).length;
        const nCards = $el.find('li,article,[class*=card]').length;
        if (!hs.length && !p) return;
        linhas.push(`[${k + 1}] <${el.tagName}${$el.attr('id') ? ' #' + $el.attr('id') : ''}> títulos: ${hs.join(' | ') || '-'}${p ? `\n    texto: ${p}` : ''}\n    mídias: ${nImg} · botões: ${nBtn} · itens/cards: ${nCards}`);
      });
      let txt = `URL: ${url}\nTÍTULO: ${$('title').text().trim()}\nFONTES (Google): ${gf || '-'}\nFONTES (CSS): ${topo(fam, 5) || '-'}\nCORES MAIS USADAS: ${topo(cores, 10) || '-'}\nBIBLIOTECAS: ${anim.join(', ') || '-'}\n\nESTRUTURA:\n${linhas.join('\n')}`;
      if (txt.length > LIMITE) txt = txt.slice(0, LIMITE) + '\n[cortado]';
      fs.writeFileSync(`${out}/${String(i + 1).padStart(2, '0')}.txt`, txt); ok++;
    } catch (e) {
      fs.writeFileSync(`${out}/${String(i + 1).padStart(2, '0')}.txt`, `URL: ${url}\nERRO: não consegui baixar (${e.message}). Se for Instagram, o leitor deve ignorar ou o Luiz descreve o estilo em entrada/briefing.md.`);
    }
  }
  console.log(`✓ inspirações: ${ok}/${urls.length} baixadas`);
}
if (process.argv[1]?.endsWith('limpar-inspiracao.js')) { const { requireSlug } = await import('./lib/util.js'); await limparInspiracoes(requireSlug()); }
