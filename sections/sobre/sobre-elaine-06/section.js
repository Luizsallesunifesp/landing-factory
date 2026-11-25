(function () {
  var root = document.querySelector('[data-secao="sobre-elaine-06"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0 || !('IntersectionObserver' in window)) return;
  var els = root.querySelectorAll('.sobre-elaine-06__reveal');
  root.classList.add('is-ready');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(function (el) { io.observe(el); });
})();
