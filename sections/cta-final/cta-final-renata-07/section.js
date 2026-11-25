(function () {
  document.querySelectorAll('[data-secao="cta-final-renata-07"]').forEach(function (sec) {
    var card = sec.querySelector('.cta-final-renata-07__card');
    var btn = sec.querySelector('.cta-final-renata-07__submit');
    var radios = sec.querySelectorAll('.cta-final-renata-07__radio');
    if (!card || !btn) return;
    var base = btn.getAttribute('href') || '';
    var modo = '';
    radios.forEach(function (r, i) {
      if (i === 0) { r.classList.add('selected'); modo = r.dataset.mode; }
      r.addEventListener('click', function () {
        radios.forEach(function (o) { o.classList.remove('selected'); });
        r.classList.add('selected');
        modo = r.dataset.mode;
      });
    });
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var nome = (sec.querySelector('.cta-final-renata-07__nome').value || '').trim() || card.dataset.vazio || '-';
      var assunto = sec.querySelector('.cta-final-renata-07__assunto').value;
      var msg = (card.dataset.msg || '')
        .replace('{nome}', nome)
        .replace('{assunto}', assunto)
        .replace('{modo}', String(modo).toLowerCase());
      var url = base + (base.indexOf('?') > -1 ? '&' : '?') + 'text=' + encodeURIComponent(msg);
      window.open(url, '_blank', 'noopener');
    });
  });
})();
