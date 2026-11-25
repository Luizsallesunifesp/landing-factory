(function () {
  var root = document.querySelector('[data-secao="hero-tiago-farma-02"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion <= 0) return;

  var els = root.querySelectorAll('[data-contador]');
  if (!els.length || !('IntersectionObserver' in window)) return;

  function count(el) {
    var txt = el.textContent.trim();
    var m = txt.match(/^(\D*)([\d.,]+)(.*)$/);
    if (!m) return;
    var target = parseInt(m[2].replace(/[.,]/g, ''), 10);
    if (isNaN(target)) return;
    var dur = 1400 * motion;
    var t0 = performance.now();
    function tick(now) {
      var p = Math.min((now - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = m[1] + Math.round(eased * target).toLocaleString('pt-BR') + m[3];
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        els.forEach(count);
        obs.disconnect();
      }
    });
  }, { threshold: 0.4 });
  obs.observe(root.querySelector('.hero-tiago-farma-02__trust') || root);
})();
