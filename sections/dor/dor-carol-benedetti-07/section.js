(function () {
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0) return;
  var secs = document.querySelectorAll('[data-secao="dor-carol-benedetti-07"]');
  secs.forEach(function (sec) {
    var els = sec.querySelectorAll('.dor-carol-benedetti-07__reveal');
    if (!('IntersectionObserver' in window)) return;
    sec.classList.add('is-ready');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) { io.observe(el); });
  });
})();
