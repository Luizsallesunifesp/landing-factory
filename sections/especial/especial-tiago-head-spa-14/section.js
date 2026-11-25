(function () {
  var P = 'especial-tiago-head-spa-14__';
  var root = document.querySelector('[data-secao="especial-tiago-head-spa-14"]');
  if (!root) return;
  var box = root.querySelector('.' + P + 'box');
  if (!box) return;

  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;

  var steps = box.querySelectorAll('.' + P + 'step');
  var fill = box.querySelector('.' + P + 'fill');
  var rec = box.querySelector('.' + P + 'rec');
  var cta = box.querySelector('.' + P + 'cta');
  var baseHref = cta ? cta.getAttribute('href') : '';
  var ans = {};
  var cur = 1;

  function show(n) {
    cur = n;
    steps.forEach(function (s) {
      s.classList.toggle('is-on', +s.dataset.q === n);
      // sem animacao quando --motion = 0 (o quiz continua funcional)
      s.style.animationDuration = motion > 0 ? (0.45 * motion) + 's' : '0s';
    });
    fill.style.transitionDuration = (0.5 * motion) + 's';
    fill.style.width = Math.min(100, n * 25 + (n === 4 ? 25 : 0)) + '%';
    if (motion > 0) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function titulo(q) {
    var s = box.querySelector('[data-q="' + q + '"]');
    return s ? s.getAttribute('data-pergunta') : '';
  }

  function finalizar() {
    rec.textContent = ans.rec || '';
    var msg = (box.getAttribute('data-msg-intro') || '') +
      '\n• ' + titulo(1) + ' ' + ans[1] +
      '\n• ' + titulo(2) + ' ' + ans[2] +
      '\n• ' + titulo(3) + ' ' + ans[3] +
      '\n\n' + (box.getAttribute('data-msg-fim') || '');
    if (cta && baseHref && baseHref !== '#') {
      cta.href = baseHref + (baseHref.indexOf('?') > -1 ? '&' : '?') + 'text=' + encodeURIComponent(msg);
    }
    show(4);
  }

  box.querySelectorAll('.' + P + 'opt').forEach(function (o) {
    o.addEventListener('click', function () {
      ans[cur] = o.getAttribute('data-v');
      if (cur === 1) ans.rec = o.getAttribute('data-rec');
      if (cur < 3) show(cur + 1); else finalizar();
    });
  });

  box.querySelectorAll('.' + P + 'back').forEach(function (b) {
    b.addEventListener('click', function () {
      show(b.classList.contains(P + 'restart') ? 1 : Math.max(1, cur - 1));
    });
  });
})();
