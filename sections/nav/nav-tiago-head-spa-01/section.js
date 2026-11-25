(function () {
  var root = document.querySelector('[data-secao="nav-tiago-head-spa-01"]');
  if (!root) return;

  // Funcionalidade do menu (não é animação): mantida mesmo com --motion 0.
  // As transições CSS já são multiplicadas por --motion.
  var onScroll = function () { root.classList.toggle('is-stuck', window.scrollY > 40); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var b = root.querySelector('.nav-tiago-head-spa-01__burger');
  var d = root.querySelector('.nav-tiago-head-spa-01__drawer');
  if (!b || !d) return;

  function close() {
    b.classList.remove('on'); d.classList.remove('on');
    b.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  b.addEventListener('click', function () {
    var open = b.classList.toggle('on');
    d.classList.toggle('on', open);
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  d.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
})();
