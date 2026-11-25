(function () {
  var root = document.querySelector('[data-secao="hero-thais-02"]');
  if (!root || !window.gsap || !window.ScrollTrigger) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion <= 0) return;
  if (window.matchMedia('(max-width: 760px)').matches) return;

  gsap.registerPlugin(ScrollTrigger);
  var img = root.querySelector('.hero-thais-02__figura img');
  var box = root.querySelector('.hero-thais-02__etiqueta');
  if (!img || !box) return;

  gsap.fromTo(img, { yPercent: -5 * motion }, {
    yPercent: 5 * motion, ease: 'none',
    scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true }
  });
})();
