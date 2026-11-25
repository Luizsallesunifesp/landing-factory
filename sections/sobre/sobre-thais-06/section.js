(function () {
  var root = document.querySelector('[data-secao="sobre-thais-06"]');
  if (!root || typeof gsap === 'undefined') return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (!m) return;
  var regua = root.querySelector('.sobre-thais-06__regua');
  if (!regua) return;
  var cfg = { scaleX: 1, duration: 1.1 * m, ease: 'power2.out' };
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    cfg.scrollTrigger = { trigger: regua, start: 'top 88%', once: true };
  }
  gsap.fromTo(regua, { scaleX: 0 }, cfg);
})();
