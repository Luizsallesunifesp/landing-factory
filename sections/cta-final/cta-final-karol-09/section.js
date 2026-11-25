(function () {
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0) return;
  document.querySelectorAll('[data-secao="cta-final-karol-09"]').forEach(function (sec) {
    var els = sec.querySelectorAll('.cta-final-karol-09__reveal');
    if (!els.length || !('IntersectionObserver' in window)) return;
    sec.classList.add('is-armed');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) { io.observe(el); });
  });
})();
