(function () {
  var root = document.querySelector('[data-secao="nav-yahlla-02"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (!motion) return;
  function onScroll() {
    root.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
