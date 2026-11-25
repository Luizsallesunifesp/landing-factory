(function () {
  var root = document.querySelector('[data-secao="processo-luiz-ricardo-08"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion <= 0) return;

  var P = 'processo-luiz-ricardo-08__';
  var legsEl = root.querySelector('.' + P + 'legs');
  var legs = [].slice.call(root.querySelectorAll('.' + P + 'leg'));
  var depth = root.querySelector('.' + P + 'depth');
  var stamp = root.querySelector('.' + P + 'stamp');
  var reveals = [].slice.call(root.querySelectorAll('[data-reveal]'));

  root.classList.add('is-motion');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.concat(stamp ? [stamp] : []).forEach(function (el) { io.observe(el); });
  } else {
    reveals.concat(stamp ? [stamp] : []).forEach(function (el) { el.classList.add('is-in'); });
  }

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    if (depth) {
      var r = depth.getBoundingClientRect();
      if (!(r.bottom < -200 || r.top > vh + 200)) {
        var sp = (parseFloat(depth.getAttribute('data-depth')) || 0.1) * motion;
        depth.style.transform = 'translate3d(0,' + ((vh / 2 - (r.top + r.height / 2)) * sp).toFixed(1) + 'px,0)';
      }
    }
    if (legsEl) {
      var lr = legsEl.getBoundingClientRect();
      var lp = clamp(((vh - lr.top) / (vh * 0.75)) - 0.15, 0, 1);
      lp = 1 - Math.pow(1 - lp, 2);
      legsEl.style.setProperty('--flown', lp.toFixed(3));
      for (var j = 0; j < legs.length; j++) {
        legs[j].classList.toggle('is-lit', lp >= (j / legs.length) + 0.04);
      }
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  if (legsEl) legsEl.style.setProperty('--flown', '0');
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
