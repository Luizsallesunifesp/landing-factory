(function () {
  var root = document.querySelector('[data-secao="especial-acalm-head-spa-06"]');
  if (!root) return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m === 0 || !('IntersectionObserver' in window)) return;
  var els = root.querySelectorAll('.especial-acalm-head-spa-06__reveal');
  root.classList.add('is-ready');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(function (el) { el.style.transitionDuration = (0.8 * m) + 's'; io.observe(el); });
})();
