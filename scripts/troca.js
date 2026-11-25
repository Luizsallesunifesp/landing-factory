// Aplica os itens "script" de ajuste.json (troca simples, sem gastar tokens).
import { requireSlug, clientDir, readJSON, writeJSON, addStatus } from './lib/util.js';
const slug = requireSlug();
const aj = readJSON(clientDir(slug, 'ajuste.json'));
const plano = readJSON(clientDir(slug, 'plano.json'));
const copy = readJSON(clientDir(slug, 'copy.json'), { secoes: {} });
const feitos = [], erros = [];
for (const it of aj.itens.filter((i) => i.destino === 'script')) {
  const slot = it.slot || '', v = it.valor_novo ?? '';
  if (slot === 'whatsapp_numero') { let d = v.replace(/\D/g, ''); if (d.length === 10 || d.length === 11) d = '55' + d; plano.whatsapp.numero = d; feitos.push(`whatsapp → ${plano.whatsapp.numero}`); }
  else if (slot.startsWith('token:')) { plano.design.tokens[slot.slice(6)] = v; feitos.push(`${slot.slice(6)} → ${v}`); }
  else if (slot.startsWith('img:')) {
    const s = plano.secoes.find((x) => x.chave === it.secao);
    if (!s) { erros.push(`seção ${it.secao} não existe`); continue; }
    (s.imagens ||= {})[slot.slice(4)] = v; feitos.push(`${it.secao} ${slot} → ${v}`);
  } else if (it.secao && slot) {
    (copy.secoes[it.secao] ||= {})[slot] = v; feitos.push(`${it.secao}.${slot} → "${v.slice(0, 40)}"`);
  } else erros.push(`item sem slot reconhecido: ${JSON.stringify(it)}`);
}
writeJSON(clientDir(slug, 'plano.json'), plano); writeJSON(clientDir(slug, 'copy.json'), copy);
addStatus(slug, 'troca', `${feitos.length} trocas`);
console.log(`✓ ${feitos.length} trocas aplicadas${feitos.length ? ':\n  - ' + feitos.join('\n  - ') : ''}`);
if (erros.length) { console.error('ERROS:\n  - ' + erros.join('\n  - ')); process.exit(2); }
