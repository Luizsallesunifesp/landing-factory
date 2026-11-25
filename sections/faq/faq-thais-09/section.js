(function () {
  var root = document.querySelector('[data-secao="faq-thais-09"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0) return; // sem animação: details nativo

  var cont = root.querySelector('.faq-thais-09__perguntas');
  if (!cont) return;
  cont.classList.add('is-js');

  var TEMPO = 450 * motion;
  var reconciliar = function () {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  };

  function abrir(det) {
    clearTimeout(det._t);
    det.open = true;
    void det.offsetHeight;
    det.classList.add('aberto');
    det._t = setTimeout(reconciliar, TEMPO + 30);
  }

  function fechar(det) {
    clearTimeout(det._t);
    det.classList.remove('aberto');
    det._t = setTimeout(function () { det.open = false; reconciliar(); }, TEMPO);
  }

  cont.querySelectorAll('details').forEach(function (det) {
    var sumr = det.querySelector('summary');
    if (!sumr || !det.querySelector('.faq-thais-09__resposta')) return;
    sumr.addEventListener('click', function (e) {
      e.preventDefault();
      if (det.classList.contains('aberto')) { fechar(det); return; }
      cont.querySelectorAll('details.aberto').forEach(function (o) { if (o !== det) fechar(o); });
      abrir(det);
    });
  });
})();
