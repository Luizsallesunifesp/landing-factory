(function () {
  var root = document.querySelector('[data-secao="nav-tiago-farma-01"]');
  if (!root) return;
  var burger = root.querySelector('.nav-tiago-farma-01__burger');
  var menu = root.querySelector('.nav-tiago-farma-01__mobile-menu');

  function onScroll() {
    root.classList.toggle('is-scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function fechar() {
    burger.classList.remove('is-open');
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
  burger.addEventListener('click', function () {
    var aberto = burger.classList.toggle('is-open');
    menu.classList.toggle('is-open', aberto);
    burger.setAttribute('aria-expanded', aberto ? 'true' : 'false');
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', fechar); });
})();
