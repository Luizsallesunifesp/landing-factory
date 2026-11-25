(function () {
  var root = document.querySelector('[data-secao="prova-luiz-ricardo-06"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0) return;

  root.classList.add('is-anim');
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var coarse = window.matchMedia && window.matchMedia('(pointer:coarse)').matches;

  /* reveal ao entrar na tela */
  var items = [].slice.call(root.querySelectorAll('[data-reveal], .prova-luiz-ricardo-06__stamp'));
  items.forEach(function (el, i) {
    if (el.hasAttribute('data-reveal')) el.style.transitionDelay = (Math.min(i, 5) * 60 * motion) + 'ms';
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* miniaturas: percorrem a página no scroll, saltam no toque */
  var works = [].slice.call(root.querySelectorAll('.prova-luiz-ricardo-06__work')).map(function (el) {
    return { el: el, shot: el.querySelector('.prova-luiz-ricardo-06__shot'), pinned: false };
  }).filter(function (w) { return w.shot; });

  works.forEach(function (w) {
    var setProg = function (v) { w.shot.style.setProperty('--prog', v.toFixed(3)); };
    w.shot.addEventListener('click', function () {
      w.shot.classList.add('touched');
      var now = parseFloat(w.shot.style.getPropertyValue('--prog')) || 0;
      w.pinned = true;
      setProg(now > 0.5 ? 0 : 1);
    });
    if (!coarse) {
      w.el.addEventListener('pointerenter', function () { w.pinned = true; setProg(1); });
      w.el.addEventListener('pointerleave', function () { w.pinned = false; });
    }
  });

  var depth = root.querySelector('[data-depth]');
  var ticking = false;
  function frame() {
    ticking = false;
    var vh = window.innerHeight;
    if (depth) {
      var r = depth.getBoundingClientRect();
      var sp = parseFloat(depth.getAttribute('data-depth')) || 0.1;
      depth.style.transform = 'translate3d(0,' + (((vh / 2 - (r.top + r.height / 2)) * sp * motion)).toFixed(1) + 'px,0)';
    }
    works.forEach(function (wk) {
      if (wk.pinned) return;
      var wr = wk.el.getBoundingClientRect();
      if (wr.bottom < -100 || wr.top > vh + 100) return;
      var wp = (vh - wr.top) / (vh + wr.height * 0.55);
      wp = clamp((wp - 0.16) / 0.56, 0, 1);
      wk.shot.style.setProperty('--prog', wp.toFixed(3));
    });
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  frame();
})();
