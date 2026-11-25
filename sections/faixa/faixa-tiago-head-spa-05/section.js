(function () {
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  document.querySelectorAll('[data-secao="faixa-tiago-head-spa-05"]').forEach(function (sec) {
    var rv = sec.querySelectorAll('.faixa-tiago-head-spa-05__rv');
    var bg = sec.querySelector('.faixa-tiago-head-spa-05__bg');
    if (motion <= 0) {
      rv.forEach(function (e) { e.classList.add('is-in'); });
      return;
    }
    if (!('IntersectionObserver' in window)) {
      rv.forEach(function (e) { e.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      rv.forEach(function (e) { io.observe(e); });
    }
    if (!bg) return;
    var speed = parseFloat(sec.getAttribute('data-speed') || '0.25') * motion;
    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      var r = sec.getBoundingClientRect();
      if (r.bottom >= -200 && r.top <= vh + 200) {
        var off = (r.top + r.height / 2 - vh / 2) * speed * -1;
        bg.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
      }
      ticking = false;
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    update();
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
  });
})();
