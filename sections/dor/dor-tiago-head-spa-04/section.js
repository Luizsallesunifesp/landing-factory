(function () {
  var root = document.querySelector('[data-secao="dor-tiago-head-spa-04"]');
  if (!root) return;
  var els = root.querySelectorAll('.dor-tiago-head-spa-04__rv');
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m === 0 || !('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); e.style.transition = 'none'; });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (e) { io.observe(e); });
})();
