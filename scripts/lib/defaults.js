// Valores padrão dos tokens (usados nas previews da biblioteca e como fallback)
export const TOKENS_PADRAO = {
  '--c-bg': '#F6F1EA', '--c-surface': '#FFFFFF', '--c-surface-2': '#EDE4D8',
  '--c-text': '#1E1B18', '--c-muted': '#6B6259', '--c-line': 'rgba(30,27,24,.12)',
  '--c-primary': '#2F4A3A', '--c-on-primary': '#FFFFFF', '--c-accent': '#C08A4B',
  '--c-dark': '#141311', '--c-on-dark': '#F2EEE8',
  '--f-display': "'Fraunces', serif", '--f-body': "'Manrope', sans-serif", '--f-mono': "'JetBrains Mono', monospace",
  '--fs-hero': 'clamp(2.6rem, 8vw, 6rem)', '--radius': '14px', '--radius-lg': '28px',
  '--space': 'clamp(16px, 2.2vw, 24px)', '--section-y': 'clamp(72px, 12vw, 160px)',
  '--max-w': '1200px', '--motion': '1', '--ease': 'cubic-bezier(.2,.7,.2,1)'
};
export const FONTS_PADRAO = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Manrope:wght@400;600;700&family=JetBrains+Mono:wght@400&display=swap';

export const CDN = {
  aos: { css: 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css', js: 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js' },
  gsap: { js: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js' },
  scrolltrigger: { js: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js' },
  lenis: { js: 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js' }
};
export const LIB_ORDEM = ['gsap', 'scrolltrigger', 'lenis', 'aos'];

export function tokensCSS(tokens = {}) {
  const t = { ...TOKENS_PADRAO, ...tokens };
  return ':root{' + Object.entries(t).map(([k, v]) => `${k}:${v}`).join(';') + '}';
}
export function waLink(numero, msg = '') {
  let n = String(numero || '').replace(/\D/g, '');
  if (n.length === 10 || n.length === 11) n = '55' + n; // DDD + número sem o 55
  return `https://wa.me/${n}${msg ? '?text=' + encodeURIComponent(msg) : ''}`;
}
