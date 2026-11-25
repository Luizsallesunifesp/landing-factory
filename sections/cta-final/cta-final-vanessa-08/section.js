(function () {
  var root = document.querySelector('[data-secao="cta-final-vanessa-08"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion <= 0) return;

  var box = root.querySelector('.cta-final-vanessa-08__reveal');
  if (box) {
    if ('IntersectionObserver' in window) {
      box.classList.add('is-armed');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            box.classList.add('is-in');
            io.unobserve(box);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      io.observe(box);
    }
  }

  var btn = root.querySelector('.cta-final-vanessa-08__magnetic');
  if (btn) {
    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      var x = e.clientX - r.left - r.width / 2;
      var y = e.clientY - r.top - r.height / 2;
      btn.style.transform = 'translate(' + (x * 0.18 * motion) + 'px,' + ((y * 0.35 - 2) * motion) + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  }
})();
