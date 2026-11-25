(function () {
  var root = document.querySelector('[data-secao="servicos-carol-benedetti-06"]');
  if (!root) return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  var els = root.querySelectorAll('.servicos-carol-benedetti-06__reveal');
  if (m === 0 || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); el.style.transition = 'none'; });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(function (el) {
    el.style.transitionDuration = (1 * m) + 's';
    io.observe(el);
  });
})();
