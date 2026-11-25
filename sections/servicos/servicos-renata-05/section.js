(function () {
  var roots = document.querySelectorAll('[data-secao="servicos-renata-05"]');
  if (!roots.length) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;

  roots.forEach(function (root) {
    // Toque no card expande a descricao (interacao, funciona mesmo sem animacao)
    root.querySelectorAll('.servicos-renata-05__card').forEach(function (card) {
      card.addEventListener('click', function () { card.classList.toggle('active'); });
    });

    // Reveal ao rolar
    var els = root.querySelectorAll('.servicos-renata-05__fade-up');
    function show(el) { el.classList.add('in'); }
    if (motion === 0 || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.style.transition = 'none'; show(el); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) {
      el.style.transitionDuration = (0.7 * motion) + 's';
      io.observe(el);
    });
  });
})();
