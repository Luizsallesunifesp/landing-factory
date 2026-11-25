(function () {
  var root = document.querySelector('[data-secao="prova-tiago-farma-06"]');
  if (!root) return;
  var P = 'prova-tiago-farma-06__';

  // lightbox (funciona independente do movimento)
  var box = document.createElement('div');
  box.className = P + 'lightbox';
  box.innerHTML = '<button type="button" class="' + P + 'lightbox-close" aria-label="Fechar">&times;</button><img alt="">';
  root.appendChild(box);
  var big = box.querySelector('img');
  function close() { box.classList.remove('open'); }
  root.querySelectorAll('.' + P + 'imgwrap').forEach(function (el) {
    el.addEventListener('click', function () {
      var card = el.closest('.' + P + 'card');
      var img = el.querySelector('img');
      big.src = card.getAttribute('data-img');
      big.alt = img ? img.alt : '';
      box.classList.add('open');
    });
  });
  box.addEventListener('click', function (e) { if (e.target === box || e.target.classList.contains(P + 'lightbox-close')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  // reveal ao rolar
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m === 0 || !('IntersectionObserver' in window)) return;
  root.classList.add('is-ready');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  root.querySelectorAll('.' + P + 'reveal').forEach(function (el) { io.observe(el); });
})();
