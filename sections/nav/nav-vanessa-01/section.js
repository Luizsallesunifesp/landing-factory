(function () {
  var root = document.querySelector('[data-secao="nav-vanessa-01"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (motion === 0) return;
  if (!('IntersectionObserver' in window)) return;
  var links = root.querySelectorAll('a[href^="#"]');
  var map = [];
  links.forEach(function (a) {
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (el) map.push({ a: a, el: el });
  });
  if (!map.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      map.forEach(function (m) {
        m.a.classList.toggle('nav-vanessa-01__link--active', m.el === e.target);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  map.forEach(function (m) { io.observe(m.el); });
})();
