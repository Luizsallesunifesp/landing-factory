(function () {
  var root = document.querySelector('[data-secao="servicos-karol-05"]');
  if (!root) return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  var els = root.querySelectorAll('.servicos-karol-05__reveal, .servicos-karol-05__item');
  if (m === 0 || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(function (el) { io.observe(el); });

  root.querySelectorAll('.servicos-karol-05__item').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'translateY(' + (-8 * m) + 'px) rotateX(' + (py * -10 * m) + 'deg) rotateY(' + (px * 10 * m) + 'deg) scale(' + (1 + 0.02 * m) + ')';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });
})();
