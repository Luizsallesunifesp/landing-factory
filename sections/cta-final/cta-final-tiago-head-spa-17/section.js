(function () {
  var sec = document.querySelector('[data-secao="cta-final-tiago-head-spa-17"]');
  if (!sec) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion <= 0) return;

  sec.classList.add('is-ready');
  var els = sec.querySelectorAll('.cta-final-tiago-head-spa-17__rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  } else {
    els.forEach(function (e) { e.classList.add('is-in'); });
  }

  var bg = sec.querySelector('.cta-final-tiago-head-spa-17__bg');
  var speed = parseFloat(sec.dataset.speed || '0.24') * motion;
  if (!bg) return;
  var ticking = false;
  function update() {
    var vh = window.innerHeight;
    var r = sec.getBoundingClientRect();
    ticking = false;
    if (r.bottom < -200 || r.top > vh + 200) return;
    var off = (r.top + r.height / 2 - vh / 2) * speed * -1;
    bg.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  update();
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
})();
