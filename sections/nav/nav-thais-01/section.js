(function () {
  var el = document.querySelector('[data-secao="nav-thais-01"]');
  if (!el) return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (m === 0) return;
  var aoRolar = function () { el.classList.toggle('preso', window.scrollY > 12); };
  aoRolar();
  window.addEventListener('scroll', aoRolar, { passive: true });
})();
