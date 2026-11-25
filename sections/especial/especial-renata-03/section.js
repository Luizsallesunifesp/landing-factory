(function () {
  var cs = getComputedStyle(document.documentElement).getPropertyValue('--motion');
  var motion = parseFloat(cs);
  if (isNaN(motion)) motion = 1;
  if (motion === 0) return;

  document.querySelectorAll('[data-secao="especial-renata-03"]').forEach(function (root) {
    var btn = root.querySelector('[data-role="toggle"]');
    var circle = root.querySelector('[data-role="circle"]');
    var label = root.querySelector('[data-role="label"]');
    var hint = root.querySelector('[data-role="hint"]');
    if (!btn || !circle || !label || !hint) return;
    var d = root.dataset;
    var base = 'especial-renata-03__circle';
    var breathing = false;
    var timer = null;

    function phase(cls, rot, dica) {
      circle.className = base + (cls ? ' is-' + cls : '');
      label.textContent = rot;
      hint.textContent = dica;
    }

    function cycle() {
      phase('inhale', d.txtInspire, d.dicaInspire);
      timer = setTimeout(function () {
        phase('hold', d.txtSegure, d.dicaSegure);
        timer = setTimeout(function () {
          phase('exhale', d.txtExpire, d.dicaExpire);
          timer = setTimeout(function () { if (breathing) cycle(); }, 6000 * motion);
        }, 4000 * motion);
      }, 4000 * motion);
    }

    btn.addEventListener('click', function () {
      breathing = !breathing;
      if (breathing) {
        btn.textContent = d.ctaParar;
        cycle();
      } else {
        btn.textContent = d.ctaComecar;
        clearTimeout(timer);
        phase('', d.txtPronto, d.dicaInicial);
      }
    });
  });
})();
