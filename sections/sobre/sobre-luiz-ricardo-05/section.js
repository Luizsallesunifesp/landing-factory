(function () {
  var root = document.querySelector('[data-secao="sobre-luiz-ricardo-05"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion <= 0 || !('IntersectionObserver' in window)) return;

  root.classList.add('sobre-luiz-ricardo-05--js');

  var els = [].slice.call(root.querySelectorAll('[data-reveal], .sobre-luiz-ricardo-05__stamp'));
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el, i) {
    if (el.hasAttribute('data-reveal')) el.style.transitionDelay = (Math.min(i, 5) * 60 * motion) + 'ms';
    io.observe(el);
  });

  var depths = [].slice.call(root.querySelectorAll('[data-depth]'));
  if (!depths.length) return;
  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    depths.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var sp = (parseFloat(el.getAttribute('data-depth')) || 0.1) * motion;
      el.style.transform = 'translate3d(0,' + ((vh / 2 - (r.top + r.height / 2)) * sp).toFixed(1) + 'px,0)';
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
