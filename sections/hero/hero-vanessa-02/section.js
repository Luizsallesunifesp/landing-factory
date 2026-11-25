(function () {
  var root = document.querySelector('[data-secao="hero-vanessa-02"]');
  if (!root) return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;

  var counters = root.querySelectorAll('.hero-vanessa-02__counter');
  counters.forEach(function (el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    if (m <= 0) { el.textContent = target; return; }
    setTimeout(function () {
      var duration = 1400 * m, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        el.textContent = p < 1 ? Math.floor((1 - Math.pow(1 - p, 3)) * target) : target;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, 500);
  });

  if (m <= 0 || !window.matchMedia('(hover: hover)').matches) return;

  root.querySelectorAll('[data-tilt]').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'rotateY(' + (x * 12 * m) + 'deg) rotateX(' + (-y * 12 * m) + 'deg) scale(' + (1 + 0.02 * m) + ')';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });

  root.querySelectorAll('[data-magnetic]').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      var x = e.clientX - r.left - r.width / 2;
      var y = e.clientY - r.top - r.height / 2;
      btn.style.transform = 'translate(' + (x * 0.18 * m) + 'px,' + ((y * 0.35 - 2) * m) + 'px)';
    });
    btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
  });
})();
