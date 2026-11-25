import fs from 'node:fs';
import path from 'node:path';
import { P, clientDir, exists, readJSON } from './util.js';

// Slots que o montar.js preenche sozinho a partir do briefing (o copywriter não escreve)
export const AUTO = ['whatsapp_link', 'ano', 'nome_negocio', 'profissional', 'profissao', 'registro', 'cidade', 'endereco', 'horario', 'instagram', 'instagram_link', 'maps_url', 'email', 'telefone'];

export function dirSecao(s, slug) {
  const ov = slug && clientDir(slug, 'overrides', s.chave);
  if (ov && exists(ov)) return ov;
  return P('sections', s.tipo, s.id);
}
export function carregarSecao(dir) {
  const r = (f) => (exists(path.join(dir, f)) ? fs.readFileSync(path.join(dir, f), 'utf8') : '');
  if (!exists(path.join(dir, 'section.html'))) throw new Error(`Seção não encontrada: ${dir}`);
  return { html: r('section.html'), css: r('section.css'), js: r('section.js'), meta: readJSON(path.join(dir, 'meta.json'), { slots: {}, libs: [] }) };
}
// Põe data-chave na primeira tag da seção (o QA usa para apontar problemas)
export const marcarRaiz = (html, chave) => html.replace(/<([a-z][\w-]*)(\s|>)/i, `<$1 data-chave="${chave}"$2`);

export function contextoAuto(briefing = {}, plano = {}) {
  const n = briefing.negocio || {}, c = briefing.contato || {};
  const ig = (c.instagram || '').replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '');
  const num = (plano.whatsapp?.numero || c.whatsapp || '').replace(/\D/g, '');
  const tel = num.replace(/^55/, '').replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
  return {
    ano: String(new Date().getFullYear()), nome_negocio: n.nome || '', profissional: n.profissional || '', profissao: n.profissao || '',
    registro: n.registro || '', cidade: n.cidade || '', endereco: n.endereco || '', horario: n.horario || '',
    instagram: ig ? '@' + ig : '', instagram_link: ig ? `https://instagram.com/${ig}` : '', maps_url: c.maps_url || (n.endereco ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n.cidade && !n.endereco.includes(String(n.cidade).replace(/\s*\(.*\)\s*$/, '')) ? n.endereco + ' ' + n.cidade : n.endereco)}` : ''),
    email: c.email || '', telefone: tel
  };
}
