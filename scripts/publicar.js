// Publica clients/<slug>/output no Cloudflare Pages. Uso: npm run publicar -- <slug> [preview|producao]
import { execSync } from 'node:child_process';
import { requireSlug, clientDir, readJSON, writeJSON, addStatus, P, exists } from './lib/util.js';
const slug = requireSlug(); const alvo = process.argv[3] || 'preview';
if (!['preview', 'producao'].includes(alvo)) { console.error('Alvo: preview ou producao'); process.exit(1); }
if (!exists(clientDir(slug, 'output', 'index.html'))) { console.error('Rode npm run montar antes.'); process.exit(1); }
const projeto = `tsl-${slug}`.slice(0, 58);
const sh = (c) => execSync(c, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
try { sh(`npx wrangler pages project create ${projeto} --production-branch main`); console.log(`✓ projeto ${projeto} criado no Cloudflare Pages`); }
catch (e) { if (!/already exists|8000002/i.test(String(e.stderr) + String(e.stdout))) { console.error(String(e.stderr || e.message)); console.error('Se for login: rode npx wrangler login'); process.exit(1); } }
const branch = alvo === 'producao' ? 'main' : 'preview';
let saida;
try { saida = sh(`npx wrangler pages deploy "${clientDir(slug, 'output')}" --project-name ${projeto} --branch ${branch} --commit-dirty=true`); }
catch (e) { console.error(String(e.stderr || e.message)); process.exit(1); }
const link = alvo === 'producao' ? `https://${projeto}.pages.dev` : `https://preview.${projeto}.pages.dev`;
const st = readJSON(clientDir(slug, 'status.json'), { links: {} });
st.links = { ...(st.links || {}), [alvo]: link }; st.fase = alvo === 'producao' ? 'no ar' : 'preview';
writeJSON(clientDir(slug, 'status.json'), st);
addStatus(slug, `publicar ${alvo}`, link);
if (alvo === 'producao') {
  const plano = readJSON(clientDir(slug, 'plano.json'));
  const h = readJSON(P('clients', '_historico.json'), { clientes: [] });
  h.clientes = h.clientes.filter((c) => c.slug !== slug);
  h.clientes.push({ slug, data: new Date().toISOString().slice(0, 10), nicho: readJSON(clientDir(slug, 'briefing.json'), {}).nicho, fontes: [plano.design?.fontes?.display, plano.design?.fontes?.body], primaria: plano.design?.tokens?.['--c-primary'], secoes: plano.secoes.map((s) => s.id) });
  writeJSON(P('clients', '_historico.json'), h);
}
console.log(saida.split('\n').filter((l) => /https?:\/\//.test(l)).slice(-2).join('\n'));
console.log(`✓ ${alvo}: ${link}`);
