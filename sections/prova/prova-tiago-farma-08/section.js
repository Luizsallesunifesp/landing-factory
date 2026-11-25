(function () {
  var roots = document.querySelectorAll('[data-secao="prova-tiago-farma-08"]');
  if (!roots.length) return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  roots.forEach(function (root) {
    var els = root.querySelectorAll('.prova-tiago-farma-08__reveal');
    if (m === 0 || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); el.style.transition = 'none'; });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) { el.style.transitionDuration = (0.8 * m) + 's'; obs.observe(el); });
  });
})();
