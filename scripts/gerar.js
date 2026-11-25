// Gera a landing page de um cliente direto do terminal, sem abrir o Claude Code na mão.
// Uso: npm run gerar -- <slug> [--sem-juiz]
// Roda o Claude Code em modo automático com permissões limitadas (sem publicar, sem tocar fora do projeto).
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { ROOT, clientDir, readJSON, exists, flag } from './lib/util.js';

const slug = process.argv[2];
const erro = (m) => { console.error('\n✗ ' + m + '\n'); process.exit(1); };
if (!slug || slug.startsWith('-')) erro('Uso: npm run gerar -- <slug> [--sem-juiz]\nClientes: ' + (exists(path.join(ROOT, 'clients')) ? fs.readdirSync(path.join(ROOT, 'clients')).filter((d) => !d.startsWith('_') && d !== '.gitkeep').join(', ') : '(nenhum)'));
if (!exists(clientDir(slug))) erro(`Cliente "${slug}" não existe em clients/. Crie no painel (npm run painel) ou com: npm run novo-cliente -- ${slug}`);

// --- etapa 0: checagem (a mesma do /gerar-landing, mas antes de gastar uso) ---
const ent = clientDir(slug, 'entrada');
const brief = ['briefing.md', 'briefing.txt'].map((n) => path.join(ent, n)).find(exists);
const txt = brief ? fs.readFileSync(brief, 'utf8').replace(/^# Briefing\s+Cole aqui[^\n]*\n?/, '').trim() : '';
const fotos = exists(path.join(ent, 'fotos')) ? fs.readdirSync(path.join(ent, 'fotos')).filter((f) => /\.(jpe?g|png|webp|avif|tiff?|heic|heif)$/i.test(f)) : [];
const faltas = [];
if (txt.length < 80) faltas.push(`briefing vazio ou curto demais (${brief || 'entrada/briefing.md'})`);
if (!fotos.length) faltas.push('nenhuma foto em entrada/fotos/');
if (faltas.length) erro(`Falta material para ${slug}:\n  - ${faltas.join('\n  - ')}\nUse o painel (npm run painel) para colar o briefing e enviar as fotos.`);
if (exists(clientDir(slug, 'plano.json')) && !flag('--refazer')) erro(`${slug} já tem plano.json. Para ajustes use /ajustar-landing; para refazer do zero rode de novo com --refazer.`);

// --- Claude Code instalado? ---
const ver = spawnSync('claude', ['--version'], { shell: true, encoding: 'utf8' });
if (ver.status !== 0) erro('O Claude Code (comando "claude") não está instalado neste computador.\nInstale com:  npm install -g @anthropic-ai/claude-code   e depois rode:  claude   (faz o login uma vez).');

const instrucao = `/gerar-landing ${slug}${flag('--sem-juiz') ? ' --sem-juiz' : ''}\n\n` +
  'Você está rodando sem ninguém acompanhando. Regras desta execução: (1) NÃO publique nada: pare antes da etapa 9 (preview/publicar) e não rode wrangler nem npm run publicar; o Luiz publica depois. ' +
  '(2) Se precisar de uma decisão do Luiz (ex.: briefing incompleto, registro profissional), grave a dúvida em clients/' + slug + '/perguntas-cliente.md, registre o status "aguardando" e termine. ' +
  '(3) Se existir plano.json e eu pedi para refazer, refaça do zero. (4) Ao final, responda em até 8 linhas e rode: node scripts/status.js ' + slug + ' fim "<resultado>".';

const args = ['-p', JSON.stringify(instrucao), '--permission-mode', 'acceptEdits',
  '--allowedTools', JSON.stringify('Agent Read Write Edit Glob Grep Bash(npm run *) Bash(node scripts/*)'),
  '--disallowedTools', JSON.stringify('Bash(npx wrangler*) Bash(git push*) Bash(rm *) Bash(curl*)')];

console.log(`▶ Gerando ${slug}  (${fotos.length} foto(s), briefing ${txt.length} caracteres)`);
console.log('  Leva de 10 a 25 minutos. Pode acompanhar no painel (npm run painel) ou aqui embaixo.\n');

// acompanha o status.json enquanto o Claude trabalha
let vistos = (readJSON(clientDir(slug, 'status.json'), { etapas: [] }).etapas || []).length;
const tick = setInterval(() => {
  const et = readJSON(clientDir(slug, 'status.json'), { etapas: [] }).etapas || [];
  for (; vistos < et.length; vistos++) console.log(`  · ${et[vistos].etapa}: ${et[vistos].resultado}`);
}, 4000);

const inicio = Date.now();
const p = spawn('claude', args, { cwd: ROOT, shell: true, stdio: ['ignore', 'inherit', 'inherit'] });
p.on('close', (code) => {
  clearInterval(tick);
  const min = Math.round((Date.now() - inicio) / 60000);
  const ver = readJSON(clientDir(slug, 'veredito.json'), null);
  console.log(`\n${code === 0 ? '✓ Terminou' : '✗ Terminou com erro (' + code + ')'} em ${min} min.`);
  if (ver) console.log(`  Juiz: nota ${ver.nota}${ver.aprovado ? ' · aprovado' : ' · NÃO aprovado'}`);
  if (exists(clientDir(slug, 'output', 'index.html'))) console.log(`  Página: clients/${slug}/output/index.html  (ou abra pelo painel: npm run painel)`);
  if (exists(clientDir(slug, 'perguntas-cliente.md'))) console.log(`  Há perguntas para o cliente em clients/${slug}/perguntas-cliente.md`);
  process.exit(code ?? 1);
});
