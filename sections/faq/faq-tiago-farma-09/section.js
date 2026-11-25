(function () {
  var root = document.querySelector('[data-secao="faq-tiago-farma-09"]');
  if (!root) return;
  var P = 'faq-tiago-farma-09__';
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;

  var items = root.querySelectorAll('.' + P + 'item');
  items.forEach(function (item) {
    var q = item.querySelector('.' + P + 'q');
    var a = item.querySelector('.' + P + 'a');
    if (!q || !a) return;
    if (motion === 0) a.style.transition = 'none';
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('is-open');
      items.forEach(function (it) {
        it.classList.remove('is-open');
        var b = it.querySelector('.' + P + 'q');
        if (b) b.setAttribute('aria-expanded', 'false');
        var p = it.querySelector('.' + P + 'a');
        if (p) p.style.maxHeight = null;
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        q.setAttribute('aria-expanded', 'true');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  if (motion === 0 || !('IntersectionObserver' in window)) return;
  root.classList.add('is-js');
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  root.querySelectorAll('.' + P + 'reveal').forEach(function (el) { obs.observe(el); });
})();
