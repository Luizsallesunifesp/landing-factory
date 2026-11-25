(function () {
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0) return;
  var secs = document.querySelectorAll('[data-secao="servicos-acalm-head-spa-05"]');
  secs.forEach(function (sec) {
    var els = sec.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) return;
    sec.setAttribute('data-armed', '');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  });
})();
