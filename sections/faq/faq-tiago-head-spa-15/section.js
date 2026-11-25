(function () {
  var P = 'faq-tiago-head-spa-15__';
  var root = document.querySelector('[data-secao="faq-tiago-head-spa-15"]');
  if (!root) return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;

  var fqs = root.querySelectorAll('.' + P + 'fq');

  function setOpen(fq, open) {
    var ans = fq.querySelector('.' + P + 'ans');
    fq.classList.toggle('is-on', open);
    fq.querySelector('button').setAttribute('aria-expanded', open ? 'true' : 'false');
    ans.style.maxHeight = open ? ans.scrollHeight + 'px' : null;
  }

  fqs.forEach(function (fq) {
    if (m === 0) fq.querySelector('.' + P + 'ans').style.transition = 'none';
    fq.querySelector('button').addEventListener('click', function () {
      var wasOpen = fq.classList.contains('is-on');
      fqs.forEach(function (o) { setOpen(o, false); });
      if (!wasOpen) setOpen(fq, true);
    });
  });

  var els = root.querySelectorAll('.' + P + 'rv');
  if (m === 0 || !('IntersectionObserver' in window)) return;
  root.classList.add(P + 'js');
  els.forEach(function (e) {
    e.style.transitionDuration = (0.9 * m) + 's';
    e.style.transform = 'translateY(' + (28 * m) + 'px)';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        en.target.style.transform = '';
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (e) { io.observe(e); });
})();
