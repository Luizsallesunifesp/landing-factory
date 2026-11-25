(function () {
  var roots = document.querySelectorAll('[data-secao="servicos-elaine-04"]');
  if (!roots.length) return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;

  roots.forEach(function (root) {
    // acordeão (funciona independente de --motion)
    root.querySelectorAll('.servicos-elaine-04__toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.servicos-elaine-04__card');
        var open = !card.classList.contains('is-open');
        card.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
      });
    });

    // reveal ao rolar
    var els = root.querySelectorAll('.servicos-elaine-04__reveal');
    if (m === 0 || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) { io.observe(el); });
  });
})();
