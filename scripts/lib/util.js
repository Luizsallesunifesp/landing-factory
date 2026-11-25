import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const P = (...a) => path.join(ROOT, ...a);
export const clientDir = (slug, ...a) => P('clients', slug, ...a);

export function readJSON(f, fallback) {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); }
  catch (e) { if (fallback !== undefined) return fallback; throw new Error(`Não consegui ler ${f}: ${e.message}`); }
}
export function writeJSON(f, data) {
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(data, null, 2) + '\n');
}
export const exists = (f) => fs.existsSync(f);
export const mkdir = (d) => fs.mkdirSync(d, { recursive: true });
export const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function requireSlug(argv = process.argv) {
  const slug = argv[2];
  if (!slug || slug.startsWith('-')) { console.error('Uso: npm run <comando> -- <slug>'); process.exit(1); }
  if (!exists(clientDir(slug))) { console.error(`Cliente "${slug}" não existe em clients/. Rode: npm run novo-cliente -- ${slug}`); process.exit(1); }
  return slug;
}
export const flag = (name) => process.argv.includes(name);
export function opt(name, def) {
  const i = process.argv.indexOf(name);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

export function addStatus(slug, etapa, resultado) {
  const f = clientDir(slug, 'status.json');
  const st = readJSON(f, { slug, criado: new Date().toISOString(), fase: 'novo', rodadas_ajuste: 0, etapas: [], links: {} });
  st.etapas.push({ etapa, resultado, em: new Date().toISOString() });
  writeJSON(f, st);
  return st;
}

/** Lista arquivos recursivamente */
export function walk(dir, filter = () => true, out = []) {
  if (!exists(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, filter, out); else if (filter(f)) out.push(f);
  }
  return out;
}
