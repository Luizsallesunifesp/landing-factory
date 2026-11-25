(function () {
  var root = document.querySelector('[data-secao="especial-acalm-head-spa-07"]');
  if (!root) return;

  var form = root.querySelector('[data-form]');
  if (!form) return;
  var ritual = form.querySelector('[data-ritual]');
  var dia = form.querySelector('[data-dia]');
  var nome = form.querySelector('[data-nome]');
  var resumo = form.querySelector('[data-resumo]');
  var submit = form.querySelector('[data-submit]');
  var d = form.dataset;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fill(tpl, vals, wrap) {
    return String(tpl || '').replace(/\{(nome|ritual|dia|negocio)\}/g, function (_, k) {
      var v = vals[k] || '';
      return wrap ? '<b>' + esc(v) + '</b>' : v;
    });
  }
  function baseLink() {
    var base = d.wa || '';
    return base.split('?')[0];
  }

  function update() {
    var n = nome.value.trim();
    var vals = { nome: n, ritual: ritual.value, dia: dia.value, negocio: d.negocio };
    resumo.innerHTML = fill(n ? d.resumoComNome : d.resumoSemNome, vals, true);
    var msg = fill(n ? d.msgComNome : d.msgSemNome, vals, false);
    submit.href = baseLink() + '?text=' + encodeURIComponent(msg);
  }

  [ritual, dia, nome].forEach(function (el) { el.addEventListener('input', update); });
  update();

  // Reveal ao rolar (respeita --motion)
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion <= 0) return;
  var panel = root.querySelector('[data-reveal]');
  if (!panel || !('IntersectionObserver' in window)) return;
  var dur = (0.8 * motion).toFixed(2) + 's';
  panel.style.opacity = '0';
  panel.style.transform = 'translateY(' + (28 * motion) + 'px)';
  panel.style.transition = 'opacity ' + dur + ' ease, transform ' + dur + ' ease';
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
        io.disconnect();
      }
    });
  }, { threshold: 0.15 });
  io.observe(panel);
})();
