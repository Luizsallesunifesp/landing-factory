// Copia o template de uma seção da biblioteca para clients/<slug>/overrides/<chave>/ (o montador edita lá)
import fs from 'node:fs';
import { requireSlug, clientDir, readJSON, exists, P } from './lib/util.js';
const slug = requireSlug(); const chave = process.argv[3];
const plano = readJSON(clientDir(slug, 'plano.json'));
const s = plano.secoes.find((x) => x.chave === chave);
if (!s) { console.error(`Chave "${chave}" não está no plano. Chaves: ${plano.secoes.map((x) => x.chave).join(', ')}`); process.exit(1); }
const dest = clientDir(slug, 'overrides', chave);
if (exists(dest)) { console.log(`= overrides/${chave} já existe (mantido)`); process.exit(0); }
fs.cpSync(P('sections', s.tipo, s.id), dest, { recursive: true });
console.log(`✓ overrides/${chave} criado a partir de sections/${s.tipo}/${s.id}. Edite section.html/.css/.js lá e rode npm run montar -- ${slug}`);
