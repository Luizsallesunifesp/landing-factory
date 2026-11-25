(function () {
  var root = document.querySelector('[data-secao="faixa-mestre-hiroshi-08"]');
  if (!root || typeof gsap === 'undefined') return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m === 0) return;
  var els = root.querySelectorAll('.faixa-mestre-hiroshi-08__rev');
  if (!els.length) return;

  gsap.set(els, { opacity: 0, y: 20 * m, filter: 'blur(' + 6 * m + 'px)' });
  var show = function () {
    gsap.to(els, {
      opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 0.7 * m, stagger: 0.06 * m,
      ease: 'expo.out', overwrite: 'auto'
    });
  };
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({ trigger: root, start: 'top 90%', once: true, onEnter: show });
  } else {
    show();
  }
  /* rede de segurança */
  setTimeout(function () {
    if (getComputedStyle(els[0]).opacity === '0') {
      gsap.set(els, { opacity: 1, y: 0, filter: 'none' });
    }
  }, 3000);
})();
