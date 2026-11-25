(function () {
  var root = document.querySelector('[data-secao="sobre-thais-03"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0) return;
  var topo = root.querySelector('.sobre-thais-03__topo');
  if (!topo) return;
  root.classList.add('is-anim');
  var mostrar = function () { root.classList.add('is-vis'); };
  if (window.gsap && window.ScrollTrigger) {
    ScrollTrigger.create({ trigger: topo, start: 'top 88%', once: true, onEnter: mostrar });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { mostrar(); io.disconnect(); }
    }, { rootMargin: '0px 0px -12% 0px' });
    io.observe(topo);
  } else {
    mostrar();
  }
})();
