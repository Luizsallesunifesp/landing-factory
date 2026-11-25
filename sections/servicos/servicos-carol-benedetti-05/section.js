(function () {
  var P = 'servicos-carol-benedetti-05__';
  var root = document.querySelector('[data-secao="servicos-carol-benedetti-05"]');
  if (!root) return;

  // Abas (funcionam independente de --motion)
  var btns = root.querySelectorAll('.' + P + 'tab-btn');
  var panels = root.querySelectorAll('.' + P + 'panel');
  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      btns.forEach(function (b) { b.classList.remove(P + 'active'); });
      panels.forEach(function (p) { p.classList.remove(P + 'active'); });
      btn.classList.add(P + 'active');
      var alvo = root.querySelector('[data-panel="' + btn.getAttribute('data-tab') + '"]');
      if (alvo) alvo.classList.add(P + 'active');
    });
  });

  // Reveal ao rolar (distância/duração via --motion no CSS; 0 = sem animação)
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m === 0 || !('IntersectionObserver' in window)) return;
  root.style.setProperty('--motion', m);
  root.classList.add('is-ready');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add(P + 'in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  root.querySelectorAll('.' + P + 'reveal').forEach(function (el) { io.observe(el); });
})();
