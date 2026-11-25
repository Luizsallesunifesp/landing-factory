// Fotos do cliente → work/web (WebP 1920 e 800 px) + work/thumbs (512 px para os agentes) + fotos-info.json
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { clientDir, mkdir, writeJSON, exists } from './lib/util.js';

const IMG = /\.(jpe?g|png|webp|avif|tiff?|heic|heif)$/i;
export async function tratarImagens(slug) {
  const ent = clientDir(slug, 'entrada');
  const web = clientDir(slug, 'work', 'web'), th = clientDir(slug, 'work', 'thumbs');
  mkdir(web); mkdir(th);
  const fotos = exists(path.join(ent, 'fotos')) ? fs.readdirSync(path.join(ent, 'fotos')).filter((f) => IMG.test(f)).sort() : [];
  const extras = fs.readdirSync(ent).filter((f) => /^logo\./i.test(f) && IMG.test(f));
  const info = []; let i = 0; const erros = [];
  for (const f of [...fotos.map((x) => ['fotos', x]), ...extras.map((x) => ['', x])]) {
    const src = path.join(ent, ...f.filter(Boolean));
    const ehLogo = /^logo\./i.test(f[1]);
    const nome = ehLogo ? 'logo' : `foto-${String(++i).padStart(2, '0')}`;
    try {
      const img = sharp(src).rotate();
      const meta = await img.metadata();
      await img.clone().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(web, `${nome}.webp`));
      await img.clone().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 76 }).toFile(path.join(web, `${nome}-800.webp`));
      await img.clone().resize({ width: 512, height: 512, fit: 'inside' }).jpeg({ quality: 70 }).toFile(path.join(th, `${nome}.jpg`));
      const w = meta.orientation >= 5 ? meta.height : meta.width, h = meta.orientation >= 5 ? meta.width : meta.height;
      info.push({ arquivo: `${nome}.webp`, miniatura: `work/thumbs/${nome}.jpg`, original: f[1], largura: w, altura: h, orientacao: w > h * 1.15 ? 'paisagem' : h > w * 1.15 ? 'retrato' : 'quadrada', logo: ehLogo, alpha: !!meta.hasAlpha });
    } catch (e) { erros.push(`${f[1]}: ${e.message.split('\n')[0]}`); }
  }
  writeJSON(clientDir(slug, 'work', 'fotos-info.json'), { fotos: info, erros });
  console.log(`✓ imagens: ${info.length} tratadas${erros.length ? `, ${erros.length} com erro (veja work/fotos-info.json; HEIC: converta para JPG antes)` : ''}`);
  return info;
}
if (process.argv[1]?.endsWith('tratar-imagens.js')) { const { requireSlug } = await import('./lib/util.js'); await tratarImagens(requireSlug()); }
