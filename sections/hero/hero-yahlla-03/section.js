(function () {
  var root = document.querySelector('[data-secao="hero-yahlla-03"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion <= 0) return;
  var bg = root.querySelector('.hero-yahlla-03__bg');
  if (!bg) return;
  var ticking = false;
  function update() {
    ticking = false;
    var h = root.offsetHeight || 1;
    var hp = Math.min(Math.max(window.scrollY / h, 0), 1);
    bg.style.transform = 'scale(' + (1.08 + hp * 0.06 * motion) + ') translateY(' + (hp * 40 * motion) + 'px)';
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
