(function () {
  var root = document.querySelector('[data-secao="cta-final-thais-11"]');
  if (!root) return;

  /* Régua que desenha ao entrar na tela (respeita --motion). */
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m > 0 && 'IntersectionObserver' in window) {
    root.classList.add('is-ready');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { root.classList.add('is-vis'); io.disconnect(); }
      });
    }, { threshold: 0.15 });
    io.observe(root);
  }

  /* Formulário: valida e abre o WhatsApp com a mensagem montada. Sem servidor. */
  var form = root.querySelector('form');
  if (!form) return;
  var nome = form.querySelector('[name="nome"]');
  var fone = form.querySelector('[name="fone"]');
  var regiao = form.querySelector('[name="regiao"]');

  function erro(el, on) { el.closest('.cta-final-thais-11__campo').classList.toggle('is-erro', on); }

  fone.addEventListener('input', function () {
    var d = fone.value.replace(/\D/g, '').slice(0, 11);
    var v = d;
    if (d.length > 2) v = '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length > 7) v = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length > 10 ? 7 : 6) + '-' + d.slice(d.length > 10 ? 7 : 6);
    fone.value = v;
    erro(fone, false);
  });
  [nome, regiao].forEach(function (el) { el.addEventListener('input', function () { erro(el, false); }); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var falhas = [];
    if (!nome.value.trim()) { erro(nome, true); falhas.push(nome); }
    if (fone.value.replace(/\D/g, '').length < 10) { erro(fone, true); falhas.push(fone); }
    if (!regiao.value) { erro(regiao, true); falhas.push(regiao); }
    if (falhas.length) { falhas[0].focus(); return; }

    var d = form.dataset;
    var msg = d.msgIntro + '\n\n' +
      d.msgNome + ' ' + nome.value.trim() + '\n' +
      d.msgFone + ' ' + fone.value + '\n' +
      d.msgRegiao + ' ' + regiao.value + '\n\n' +
      d.msgFinal;
    var base = d.wa || '';
    base = base.split('?')[0];
    window.open(base + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });
})();
