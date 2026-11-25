// Etapa 1 do /gerar-landing: fotos + inspirações (0 tokens)
import { requireSlug, addStatus } from './lib/util.js';
import { tratarImagens } from './tratar-imagens.js';
import { limparInspiracoes } from './limpar-inspiracao.js';
const slug = requireSlug();
const fotos = await tratarImagens(slug);
await limparInspiracoes(slug);
addStatus(slug, 'preparar', `${fotos.length} imagens`);
if (!fotos.filter((f) => !f.logo).length) console.warn('! Nenhuma foto. O curador vai registrar a falta; considere pedir fotos ao cliente.');
