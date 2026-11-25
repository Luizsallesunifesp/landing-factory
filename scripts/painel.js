// Painel local da Landing Factory. Uso: npm run painel   (abre em http://localhost:4300)
// Só escuta em 127.0.0.1. Mostra clientes, abre previews, faz a curadoria da biblioteca e cria clientes.
// Gerar a página continua sendo no Claude Code (/gerar-landing <slug>): é ele quem roda os agentes.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { ROOT, P, clientDir, readJSON, writeJSON, exists, mkdir, slugify, walk } from './lib/util.js';

const PORT = Number(process.env.PAINEL_PORT || 4300);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.md': 'text/plain; charset=utf-8' };
const SLUG = /^[a-z0-9][a-z0-9-]{0,60}$/;
const FOTO_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const ACOES = { // ações permitidas pelo painel (scripts sem tokens)
  preparar: (s) => ['preparar.js', s], slots: (s) => ['slots.js', s], montar: (s) => ['montar.js', s],
  'montar-rascunho': (s) => ['montar.js', s, '--rascunho'], qa: (s) => ['qa.js', s, '--ciclo', '1'], 'qa-2': (s) => ['qa.js', s, '--ciclo', '2']
};
const ocupados = new Set();

const send = (res, code, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
};
const lerCorpo = (req, max = 30 * 1024 * 1024) => new Promise((ok, fail) => {
  const partes = []; let n = 0;
  req.on('data', (c) => { n += c.length; if (n > max) { fail(new Error('arquivo grande demais')); req.destroy(); } else partes.push(c); });
  req.on('end', () => ok(Buffer.concat(partes)));
  req.on('error', fail);
});
const lerJSON = async (req) => { try { return JSON.parse((await lerCorpo(req, 1e6)).toString('utf8') || '{}'); } catch { return {}; } };

function arquivo(res, base, rel, extra = {}) {
  const f = path.resolve(base, '.' + path.sep + rel);
  if (!f.startsWith(path.resolve(base) + path.sep) && f !== path.resolve(base)) return send(res, 403, 'proibido', 'text/plain');
  let alvo = f;
  if (exists(alvo) && fs.statSync(alvo).isDirectory()) alvo = path.join(alvo, 'index.html');
  if (!exists(alvo)) return send(res, 404, 'não encontrado', 'text/plain');
  res.writeHead(200, { 'content-type': TYPES[path.extname(alvo).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store', ...extra });
  fs.createReadStream(alvo).pipe(res);
}

const slugsClientes = () => (exists(P('clients')) ? fs.readdirSync(P('clients'), { withFileTypes: true }) : [])
  .filter((d) => d.isDirectory() && SLUG.test(d.name) && !d.name.startsWith('_')).map((d) => d.name);

function resumoCliente(slug) {
  const d = (...a) => clientDir(slug, ...a);
  const st = readJSON(d('status.json'), { etapas: [] });
  const ver = readJSON(d('veredito.json'), null);
  const plano = readJSON(d('plano.json'), null);
  const mont = readJSON(d('work', 'montagem.json'), null);
  const bri = readJSON(d('briefing.json'), null);
  const ultima = st.etapas?.[st.etapas.length - 1];
  const fotos = exists(d('entrada', 'fotos')) ? fs.readdirSync(d('entrada', 'fotos')).filter((f) => FOTO_EXT.has(path.extname(f).toLowerCase())) : [];
  return {
    slug, nome: bri?.negocio?.nome || slug, nicho: bri?.nicho || bri?.negocio?.nicho || '', regulado: !!bri?.regulado,
    criado: st.criado, ultima_etapa: ultima ? `${ultima.etapa}: ${ultima.resultado}` : '', atualizado: ultima?.em || st.criado,
    tem_briefing: exists(d('entrada', 'briefing.md')) || exists(d('entrada', 'briefing.txt')), fotos: fotos.length,
    secoes: plano?.secoes?.length || 0, pagina: exists(d('output', 'index.html')), peso_kb: mont?.peso_kb ?? null,
    nota: ver?.nota ?? null, aprovado: ver ? !!ver.aprovado : null, links: st.links || {}
  };
}

function detalheCliente(slug) {
  const d = (...a) => clientDir(slug, ...a);
  const base = resumoCliente(slug);
  const st = readJSON(d('status.json'), { etapas: [] });
  const ver = readJSON(d('veredito.json'), null);
  const fb = readJSON(d('feedback.json'), null);
  const plano = readJSON(d('plano.json'), null);
  const briefingMd = ['briefing.md', 'briefing.txt'].map((n) => d('entrada', n)).find(exists);
  const fotos = exists(d('entrada', 'fotos')) ? fs.readdirSync(d('entrada', 'fotos')).filter((f) => FOTO_EXT.has(path.extname(f).toLowerCase())) : [];
  const qa = exists(d('qa')) ? fs.readdirSync(d('qa')).filter((f) => f.endsWith('.png')).sort() : [];
  return {
    ...base, etapas: st.etapas || [], briefing: briefingMd ? fs.readFileSync(briefingMd, 'utf8') : '', fotos_lista: fotos,
    veredito: ver && { nota: ver.nota, aprovado: ver.aprovado, recado_luiz: ver.recado_luiz, feedback: ver.feedback || [] },
    feedback: fb?.itens || fb?.feedback || [], comando: `/gerar-landing ${slug}`,
    plano: plano && { posicionamento: plano.posicionamento, secoes: (plano.secoes || []).map((s) => ({ chave: s.chave, tipo: s.tipo, id: s.id, objetivo: s.objetivo, ajuste_custom: !!s.ajuste_custom })) },
    qa_imagens: qa
  };
}

function listarSecoes() {
  return walk(P('sections'), (f) => f.endsWith(`${path.sep}meta.json`) && !f.includes(`${path.sep}_raw${path.sep}`)).map((f) => {
    const m = readJSON(f, {});
    const pasta = path.basename(path.dirname(f));
    return { id: m.id || pasta, tipo: m.tipo || path.basename(path.dirname(path.dirname(f))), origem: m.origem || '', descricao: m.descricao || '', estilo: [].concat(m.estilo || []), nicho: [].concat(m.nicho || []),
      libs: m.libs || [], nota: m.nota ?? null, aprovada: !!m.aprovada, preview: exists(path.join(path.dirname(f), 'preview.png')) };
  }).sort((a, b) => a.tipo.localeCompare(b.tipo) || a.id.localeCompare(b.id));
}
const metaPath = (id) => { const f = walk(P('sections'), (x) => x.endsWith(`${path.sep}meta.json`) && path.basename(path.dirname(x)) === id && !x.includes(`${path.sep}_raw${path.sep}`)); return f[0]; };

function rodar(args, timeoutMs = 240000) {
  return new Promise((ok) => {
    const p = spawn(process.execPath, args.map((a, i) => (i === 0 ? path.join('scripts', a) : a)), { cwd: ROOT, windowsHide: true });
    let out = ''; const add = (b) => { out += b.toString('utf8'); if (out.length > 20000) out = out.slice(-20000); };
    p.stdout.on('data', add); p.stderr.on('data', add);
    const t = setTimeout(() => { p.kill(); out += '\n[tempo esgotado]'; }, timeoutMs);
    p.on('close', (code) => { clearTimeout(t); ok({ codigo: code, saida: out.replace(/\x1b\[[0-9;]*m/g, '').trim() }); });
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    const p = decodeURIComponent(url.pathname);
    const host = (req.headers.host || '').split(':')[0];
    if (host !== 'localhost' && host !== '127.0.0.1') return send(res, 403, 'host inválido', 'text/plain');
    if (req.method !== 'GET' && req.headers['x-painel'] !== '1') return send(res, 403, { erro: 'requisição recusada' });

    // --- páginas e arquivos ---
    if (p === '/' || p === '/index.html') return arquivo(res, P('painel'), 'index.html');
    if (p === '/arquivo/briefing-perguntas') return arquivo(res, P('docs'), 'briefing-perguntas.md');
    if (p.startsWith('/preview/')) { // /preview/<slug>/...
      const [, , slug, ...resto] = p.split('/');
      if (!SLUG.test(slug)) return send(res, 400, 'slug inválido', 'text/plain');
      return arquivo(res, clientDir(slug, 'output'), resto.join('/') || 'index.html');
    }
    if (p.startsWith('/qa/')) { const [, , slug, ...resto] = p.split('/'); if (!SLUG.test(slug)) return send(res, 400, 'slug inválido', 'text/plain'); return arquivo(res, clientDir(slug, 'qa'), resto.join('/')); }
    if (p.startsWith('/foto/')) { const [, , slug, nome] = p.split('/'); if (!SLUG.test(slug) || !FOTO_EXT.has(path.extname(nome || '').toLowerCase())) return send(res, 400, 'inválido', 'text/plain'); return arquivo(res, clientDir(slug, 'entrada', 'fotos'), nome); }
    if (p.startsWith('/secao/')) { // /secao/<id>/preview.png  |  /secao/<id>/ (HTML montado de teste não existe: só a imagem)
      const [, , id] = p.split('/'); const mp = metaPath(id);
      if (!mp) return send(res, 404, 'seção não encontrada', 'text/plain');
      return arquivo(res, path.dirname(mp), 'preview.png');
    }

    // --- API ---
    if (p === '/api/clientes' && req.method === 'GET') return send(res, 200, slugsClientes().map(resumoCliente).sort((a, b) => String(b.atualizado).localeCompare(String(a.atualizado))));
    if (p === '/api/clientes' && req.method === 'POST') {
      const { nome } = await lerJSON(req); const slug = slugify(String(nome || ''));
      if (!SLUG.test(slug)) return send(res, 400, { erro: 'Nome inválido.' });
      if (exists(clientDir(slug))) return send(res, 409, { erro: `clients/${slug} já existe.` });
      const r = await rodar(['novo-cliente.js', slug]);
      return send(res, r.codigo === 0 ? 200 : 500, { slug, saida: r.saida });
    }
    let m;
    if ((m = p.match(/^\/api\/clientes\/([a-z0-9-]+)$/)) && req.method === 'GET') {
      if (!exists(clientDir(m[1]))) return send(res, 404, { erro: 'cliente não existe' });
      return send(res, 200, detalheCliente(m[1]));
    }
    if ((m = p.match(/^\/api\/clientes\/([a-z0-9-]+)\/briefing$/)) && req.method === 'PUT') {
      if (!exists(clientDir(m[1]))) return send(res, 404, { erro: 'cliente não existe' });
      const { texto } = await lerJSON(req);
      mkdir(clientDir(m[1], 'entrada')); fs.writeFileSync(clientDir(m[1], 'entrada', 'briefing.md'), String(texto ?? ''), 'utf8');
      return send(res, 200, { ok: true });
    }
    if ((m = p.match(/^\/api\/clientes\/([a-z0-9-]+)\/fotos$/)) && req.method === 'POST') {
      if (!exists(clientDir(m[1]))) return send(res, 404, { erro: 'cliente não existe' });
      const nome = path.basename(url.searchParams.get('nome') || '').replace(/[^\w.\- ]+/g, '_');
      if (!FOTO_EXT.has(path.extname(nome).toLowerCase())) return send(res, 400, { erro: 'Use JPG, PNG ou WebP.' });
      const corpo = await lerCorpo(req); mkdir(clientDir(m[1], 'entrada', 'fotos'));
      fs.writeFileSync(clientDir(m[1], 'entrada', 'fotos', nome), corpo);
      return send(res, 200, { ok: true, nome });
    }
    if ((m = p.match(/^\/api\/clientes\/([a-z0-9-]+)\/fotos\/([^/]+)$/)) && req.method === 'DELETE') {
      const f = clientDir(m[1], 'entrada', 'fotos', path.basename(m[2]));
      if (exists(f)) fs.rmSync(f); return send(res, 200, { ok: true });
    }
    if ((m = p.match(/^\/api\/clientes\/([a-z0-9-]+)\/rodar$/)) && req.method === 'POST') {
      const slug = m[1]; const { acao } = await lerJSON(req);
      if (!exists(clientDir(slug))) return send(res, 404, { erro: 'cliente não existe' });
      if (!ACOES[acao]) return send(res, 400, { erro: 'ação não permitida' });
      if (ocupados.has(slug)) return send(res, 409, { erro: 'Já existe uma ação rodando para este cliente.' });
      ocupados.add(slug);
      try { return send(res, 200, await rodar(ACOES[acao](slug))); } finally { ocupados.delete(slug); }
    }

    if (p === '/api/secoes' && req.method === 'GET') return send(res, 200, listarSecoes());
    if ((m = p.match(/^\/api\/secoes\/([\w-]+)$/)) && req.method === 'PUT') {
      const f = metaPath(m[1]); if (!f) return send(res, 404, { erro: 'seção não encontrada' });
      const { nota, aprovada } = await lerJSON(req); const meta = readJSON(f);
      if (nota !== undefined) { const n = Number(nota); if (!(n >= 1 && n <= 5)) return send(res, 400, { erro: 'nota de 1 a 5' }); meta.nota = n; }
      if (aprovada !== undefined) meta.aprovada = !!aprovada;
      writeJSON(f, meta); return send(res, 200, { ok: true, nota: meta.nota, aprovada: meta.aprovada });
    }
    if (p === '/api/catalogo' && req.method === 'POST') return send(res, 200, await rodar(['catalogo.js']));

    send(res, 404, { erro: 'rota não encontrada' });
  } catch (e) {
    send(res, 500, { erro: String(e.message || e) });
  }
});

server.on('error', (e) => { console.error(e.code === 'EADDRINUSE' ? `Porta ${PORT} em uso. Feche o outro painel ou use PAINEL_PORT=4301.` : e.message); process.exit(1); });
server.listen(PORT, '127.0.0.1', () => console.log(`✓ Painel em http://localhost:${PORT}  (Ctrl+C para fechar)`));
