(function () {
  var root = document.querySelector('[data-secao="servicos-tiago-head-spa-08"]');
  if (!root) return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m === 0) return;
  var els = root.querySelectorAll('.servicos-tiago-head-spa-08__rv');
  if (!('IntersectionObserver' in window)) return;
  root.classList.add('is-rv');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
})();
