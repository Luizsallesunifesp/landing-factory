// Cria a pasta de um cliente novo. Uso: npm run novo-cliente -- <slug>
import fs from 'node:fs';
import { clientDir, mkdir, exists, slugify, addStatus } from './lib/util.js';
const slug = slugify(process.argv[2] || '');
if (!slug) { console.error('Uso: npm run novo-cliente -- <nome-do-cliente>'); process.exit(1); }
if (exists(clientDir(slug))) { console.error(`clients/${slug} já existe.`); process.exit(1); }
mkdir(clientDir(slug, 'entrada', 'fotos')); mkdir(clientDir(slug, 'entrada', 'depoimentos'));
fs.writeFileSync(clientDir(slug, 'entrada', 'briefing.md'), '# Briefing\n\nCole aqui as respostas do cliente (texto livre, do jeito que vieram no WhatsApp).\n');
fs.writeFileSync(clientDir(slug, 'entrada', 'inspiracoes.txt'), '# Um link por linha\n');
addStatus(slug, 'criado', 'ok');
console.log(`✓ clients/${slug}/ criado.
  1. Cole as respostas em entrada/briefing.md
  2. Coloque as fotos em entrada/fotos/ (e o logo em entrada/logo.png, se tiver)
  3. Links de inspiração em entrada/inspiracoes.txt
  4. No Claude Code: /gerar-landing ${slug}`);
