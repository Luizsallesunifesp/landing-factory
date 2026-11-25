(function () {
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0 || !('IntersectionObserver' in window)) return;
  document.querySelectorAll('[data-secao="cta-final-carol-benedetti-09"]').forEach(function (root) {
    var els = root.querySelectorAll('.cta-final-carol-benedetti-09__reveal');
    root.classList.add('is-ready');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) { io.observe(el); });
  });
})();
