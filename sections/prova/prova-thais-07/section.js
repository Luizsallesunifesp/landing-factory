(function () {
  var secs = document.querySelectorAll('[data-secao="prova-thais-07"]');
  if (!secs.length) return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m <= 0 || !('IntersectionObserver' in window)) return;
  secs.forEach(function (sec) {
    var regua = sec.querySelector('.prova-thais-07__regua');
    if (!regua) return;
    regua.style.transform = 'scaleX(0)';
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        regua.style.transition = 'transform ' + (1.1 * m) + 's var(--ease)';
        regua.style.transform = 'scaleX(1)';
        io.disconnect();
      });
    }, { threshold: 0.2 });
    io.observe(sec.querySelector('.prova-thais-07__topo'));
  });
})();
