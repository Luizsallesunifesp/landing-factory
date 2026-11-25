(function () {
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m === 0) return;
  var roots = document.querySelectorAll('[data-secao="processo-tiago-head-spa-11"]');
  roots.forEach(function (root) {
    var els = root.querySelectorAll('.processo-tiago-head-spa-11__rv');
    if (!('IntersectionObserver' in window)) return;
    root.classList.add('is-armed');
    els.forEach(function (el, i) {
      el.style.transitionDelay = (Math.max(0, i - 1) * 0.08 * m) + 's';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  });
})();
