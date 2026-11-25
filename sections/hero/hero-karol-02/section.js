(function () {
  var root = document.querySelector('[data-secao="hero-karol-02"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0) return;
  var els = root.querySelectorAll('.hero-karol-02__reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) return;
  root.classList.add('is-ready');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(function (el) { io.observe(el); });
})();
