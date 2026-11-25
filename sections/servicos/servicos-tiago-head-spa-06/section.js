(function () {
  var root = document.querySelector('[data-secao="servicos-tiago-head-spa-06"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0) return;
  var els = root.querySelectorAll('.servicos-tiago-head-spa-06__rv');
  if (!('IntersectionObserver' in window)) return;
  root.classList.add('servicos-tiago-head-spa-06--js');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (e) { io.observe(e); });
})();
