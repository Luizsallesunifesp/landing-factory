// Carrega o Playwright instalado no projeto (ou o global, se existir)
import { createRequire } from 'node:module';
export async function chromium() {
  try { return (await import('playwright')).chromium; }
  catch { return createRequire(import.meta.url)('playwright').chromium; }
}
