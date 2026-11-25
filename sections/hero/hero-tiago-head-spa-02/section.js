(function () {
  var root = document.querySelector('[data-secao="hero-tiago-head-spa-02"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion <= 0) return;

  root.classList.add('is-anim');
  var els = root.querySelectorAll('.hero-tiago-head-spa-02__rv');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  var bg = root.querySelector('.hero-tiago-head-spa-02__bg');
  if (!bg) return;
  var speed = parseFloat(root.getAttribute('data-speed') || '0.22') * motion;
  var ticking = false;
  function update() {
    var vh = window.innerHeight;
    var r = root.getBoundingClientRect();
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
