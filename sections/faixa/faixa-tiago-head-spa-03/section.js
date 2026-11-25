(function () {
  var root = document.querySelector('[data-secao="faixa-tiago-head-spa-03"]');
  if (!root) return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m === 0) return;
  var els = root.querySelectorAll('[data-rv]');
  if (!('IntersectionObserver' in window)) return;
  els.forEach(function (e) { e.classList.add('is-prep'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (e) { io.observe(e); });
})();
