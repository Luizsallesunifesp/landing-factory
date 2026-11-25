(function () {
  // Quiz de 3 perguntas. Funcional mesmo com --motion 0 (so os tempos de transicao viram 0).
  var root = document.querySelector('[data-secao="especial-tiago-farma-07"]');
  if (!root) return;
  var card = root.querySelector('[data-quiz]');
  if (!card) return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;

  var steps = root.querySelectorAll('[data-step]');
  var bars = {};
  root.querySelectorAll('[data-qp]').forEach(function (b) { bars[b.getAttribute('data-qp')] = b; });
  var waBtn = root.querySelector('[data-quiz-wa]');
  var waBase = waBtn ? waBtn.getAttribute('href') : '';
  var answers = {};
  var current = 1;

  function show(n) {
    current = n;
    steps.forEach(function (s) { s.classList.toggle('is-active', parseInt(s.getAttribute('data-step'), 10) === n); });
    [1, 2, 3].forEach(function (i) {
      bars[i].style.width = n > i ? '100%' : (n === i ? '50%' : '0%');
    });
  }

  function buildLink() {
    var d = card.dataset;
    var txt = (d.waIntro || '') + '\n- ' + (d.waR1 || '') + ' ' + answers[1] +
      '\n- ' + (d.waR2 || '') + ' ' + answers[2] +
      '\n- ' + (d.waR3 || '') + ' ' + answers[3] +
      '\n' + (d.waFim || '');
    var sep = waBase.indexOf('?') === -1 ? '?' : '&';
    return waBase.replace(/([?&])text=[^&]*&?/, '$1').replace(/[?&]$/, '') + sep + 'text=' + encodeURIComponent(txt);
  }

  root.querySelectorAll('.especial-tiago-farma-07__opt').forEach(function (opt) {
    opt.addEventListener('click', function () {
      var q = opt.getAttribute('data-q');
      root.querySelectorAll('.especial-tiago-farma-07__opt[data-q="' + q + '"]').forEach(function (o) { o.classList.remove('is-selected'); });
      opt.classList.add('is-selected');
      answers[q] = opt.textContent.trim();
      var err = opt.closest('[data-step]').querySelector('.especial-tiago-farma-07__err');
      if (err) err.style.display = 'none';
      setTimeout(function () {
        if (current < 3) { show(current + 1); }
        else {
          if (waBtn) waBtn.setAttribute('href', buildLink());
          show(4);
        }
      }, 260 * m);
    });
  });

  root.querySelectorAll('[data-back]').forEach(function (b) {
    b.addEventListener('click', function () { if (current > 1) show(current - 1); });
  });

  show(1);
})();
