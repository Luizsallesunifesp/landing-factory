(function () {
  var raiz = document.querySelector('[data-secao="sobre-mestre-hiroshi-09"]');
  if (!raiz || typeof gsap === 'undefined') return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m === 0) return;
  var els = raiz.querySelectorAll('.sobre-mestre-hiroshi-09__rev');
  if (!els.length) return;

  gsap.set(els, { opacity: 0, y: 20 * m, filter: 'blur(' + 6 * m + 'px)' });
  var entrar = function (lote) {
    gsap.to(lote, {
      opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 0.7 * m, stagger: 0.06 * m,
      ease: 'expo.out', overwrite: 'auto'
    });
  };

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.batch(els, { start: 'top 90%', once: true, onEnter: entrar });
  } else {
    entrar(els);
  }
})();
