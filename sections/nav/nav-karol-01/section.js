(function () {
  var root = document.querySelector('[data-secao="nav-karol-01"]');
  if (!root) return;
  var toggle = root.querySelector('.nav-karol-01__toggle');
  var links = root.querySelector('.nav-karol-01__links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  var anchors = Array.prototype.slice.call(links.querySelectorAll('a[href^="#"]'));
  var pares = anchors.map(function (a) {
    var id = a.getAttribute('href');
    return { a: a, el: id.length > 1 ? document.querySelector(id) : null };
  }).filter(function (p) { return p.el; });
  if (!pares.length) return;

  function atualizar() {
    var y = window.scrollY + window.innerHeight * 0.35;
    var atual = null;
    pares.forEach(function (p) {
      if (p.el.getBoundingClientRect().top + window.scrollY <= y) atual = p;
    });
    pares.forEach(function (p) { p.a.classList.toggle('is-active', p === atual); });
  }
  window.addEventListener('scroll', atualizar, { passive: true });
  atualizar();
})();
