(function () {
  var root = document.querySelector('[data-secao="sobre-vanessa-05"]');
  if (!root) return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m <= 0) return;

  // tilt 3D na foto
  if (window.matchMedia('(hover: hover)').matches) {
    var card = root.querySelector('.sobre-vanessa-05__tilt');
    if (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'rotateY(' + (x * 12 * m) + 'deg) rotateX(' + (-y * 12 * m) + 'deg) scale(1.02)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    }
  }

  // stagger das credenciais ao entrar na tela
  var items = root.querySelectorAll('.sobre-vanessa-05__credentials > *');
  if (!items.length || !('IntersectionObserver' in window)) return;
  items.forEach(function (el, i) {
    el.classList.add('is-pre');
    el.style.transitionDelay = (i * 90 * m) + 'ms';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.remove('is-pre');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(function (el) { io.observe(el); });
})();
