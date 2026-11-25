(function () {
  var sec = document.querySelector('[data-secao="faixa-tiago-head-spa-12"]');
  if (!sec) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion <= 0) return;

  var bg = sec.querySelector('.faixa-tiago-head-spa-12__bg');
  var els = sec.querySelectorAll('.faixa-tiago-head-spa-12__rv');
  var speed = parseFloat(sec.dataset.speed || '0.26') * motion;

  if ('IntersectionObserver' in window) {
    sec.classList.add('is-js');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  if (!bg) return;
  var ticking = false;
  function update() {
    var vh = window.innerHeight;
    var r = sec.getBoundingClientRect();
    if (!(r.bottom < -200 || r.top > vh + 200)) {
      var off = (r.top + r.height / 2 - vh / 2) * speed * -1;
      bg.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
    }
    ticking = false;
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  update();
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
})();
