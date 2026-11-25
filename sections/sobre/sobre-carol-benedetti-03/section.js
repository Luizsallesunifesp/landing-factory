(function () {
  var root = document.querySelector('[data-secao="sobre-carol-benedetti-03"]');
  if (!root) return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m === 0 || !('IntersectionObserver' in window)) return; // sem animação: conteúdo fica visível
  var els = root.querySelectorAll('.sobre-carol-benedetti-03__reveal');
  root.classList.add('is-ready');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(function (el) { io.observe(el); });
})();
