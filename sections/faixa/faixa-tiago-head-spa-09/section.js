(function () {
  var sec = document.querySelector('[data-secao="faixa-tiago-head-spa-09"]');
  if (!sec) return;
  var P = 'faixa-tiago-head-spa-09__';
  var bg = sec.querySelector('.' + P + 'px-bg');
  if (bg && bg.dataset.bg) bg.style.backgroundImage = "url('" + bg.dataset.bg + "')";
  var els = sec.querySelectorAll('.' + P + 'rv');

  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;

  function showAll() { els.forEach(function (e) { e.classList.add('in'); }); }
  if (motion === 0) { showAll(); return; }

  // reveal
  els.forEach(function (e) {
    e.style.transitionDuration = (0.9 * motion) + 's';
    e.style.transform = 'translateY(' + (28 * motion) + 'px)';
  });
  if (!('IntersectionObserver' in window)) { showAll(); }
  else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          en.target.style.transform = '';
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  // parallax
  if (!bg) return;
  var speed = (parseFloat(sec.dataset.speed || '0.25')) * motion;
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
