(function () {
  var root = document.querySelector('[data-secao="servicos-luiz-ricardo-07"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0) return;

  var stamp = root.querySelector('.servicos-luiz-ricardo-07__stamp');
  var items = [].slice.call(root.querySelectorAll('[data-reveal]'));
  var targets = stamp ? [stamp].concat(items) : items;

  root.classList.add('is-ready');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el, i) { el.style.transitionDelay = (Math.min(i, 5) * 60 * motion) + 'ms'; });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  var depth = root.querySelector('[data-depth]');
  var rows = window.matchMedia('(hover:none)').matches ? [].slice.call(root.querySelectorAll('.servicos-luiz-ricardo-07__row')) : [];
  var ticking = false;

  function frame() {
    ticking = false;
    var vh = window.innerHeight;
    if (depth) {
      var r = depth.getBoundingClientRect();
      if (!(r.bottom < -200 || r.top > vh + 200)) {
        var sp = (parseFloat(depth.getAttribute('data-depth')) || 0.1) * motion;
        depth.style.transform = 'translate3d(0,' + ((vh / 2 - (r.top + r.height / 2)) * sp).toFixed(1) + 'px,0)';
      }
    }
    if (rows.length) {
      var best = -1, bestD = 1e9;
      rows.forEach(function (row, i) {
        var b = row.getBoundingClientRect();
        var d = Math.abs(b.top + b.height / 2 - vh / 2);
        if (d < bestD) { bestD = d; best = i; }
      });
      rows.forEach(function (row, i) { row.classList.toggle('active', i === best && bestD < vh * 0.34); });
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();
})();
