(function () {
  var root = document.querySelector('[data-secao="processo-renata-04"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;

  // Acordeão (funcional mesmo com --motion 0)
  var items = root.querySelectorAll('.processo-renata-04__item');
  if (items.length) items[0].classList.add('open');
  items.forEach(function (item) {
    var head = item.querySelector('.processo-renata-04__item-head');
    if (!head) return;
    head.addEventListener('click', function () {
      var was = item.classList.contains('open');
      items.forEach(function (i) { i.classList.remove('open'); });
      if (!was) item.classList.add('open');
    });
  });

  // Reveal ao rolar
  var fades = root.querySelectorAll('.processo-renata-04__fade');
  function showAll() { fades.forEach(function (el) { el.classList.add('in'); }); }
  if (motion === 0 || !('IntersectionObserver' in window)) { showAll(); return; }
  fades.forEach(function (el) { el.style.transitionDuration = (0.7 * motion) + 's'; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  fades.forEach(function (el) { io.observe(el); });
})();
