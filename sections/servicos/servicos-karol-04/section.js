(function () {
  var secs = document.querySelectorAll('[data-secao="servicos-karol-04"]');
  if (!secs.length) return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m === 0 || !('IntersectionObserver' in window)) return;
  secs.forEach(function (sec) {
    sec.classList.add('is-armed');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    sec.querySelectorAll('.servicos-karol-04__reveal').forEach(function (el) { io.observe(el); });
  });
})();
