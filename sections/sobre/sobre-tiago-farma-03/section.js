(function () {
  var root = document.querySelector('[data-secao="sobre-tiago-farma-03"]');
  if (!root) return;
  var els = root.querySelectorAll('.sobre-tiago-farma-03__reveal');
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0 || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.style.transition = 'none'; el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  els.forEach(function (el) {
    el.style.transform = 'translateY(' + (28 * motion) + 'px)';
    el.style.transitionDuration = (0.8 * motion) + 's';
  });
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.style.transform = '';
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(function (el) { obs.observe(el); });
})();
