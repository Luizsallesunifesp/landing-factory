(function () {
  var root = document.querySelector('[data-secao="processo-acalm-head-spa-04"]');
  if (!root) return;
  var p = 'processo-acalm-head-spa-04__';
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  var steps = root.querySelectorAll('.' + p + 'step');
  var reveals = root.querySelectorAll('.' + p + 'reveal');
  var fill = root.querySelector('.' + p + 'fill');
  var list = root.querySelector('.' + p + 'list');

  if (m === 0) {
    reveals.forEach(function (el) { el.classList.add('in'); });
    steps.forEach(function (s) { s.classList.add('active'); });
    if (fill) fill.style.height = '100%';
    return;
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  function update() {
    if (!list || !fill) return;
    var rect = list.getBoundingClientRect();
    var progress = (window.innerHeight * 0.75 - rect.top) / rect.height;
    progress = Math.max(0, Math.min(1, progress));
    fill.style.height = (progress * 100) + '%';
    var count = Math.round(progress * steps.length);
    steps.forEach(function (s, i) { s.classList.toggle('active', i < count); });
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
