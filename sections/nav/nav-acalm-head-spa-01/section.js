(function () {
  var el = document.querySelector('[data-secao="nav-acalm-head-spa-01"]');
  if (!el) return;
  function update() {
    el.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
