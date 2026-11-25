(function () {
  var root = document.querySelector('[data-secao="servicos-vanessa-06"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0 || !('IntersectionObserver' in window)) return;

  var pre = 'servicos-vanessa-06__pre';
  var targets = [];
  root.querySelectorAll('[data-reveal]').forEach(function (el) { targets.push(el); });
  root.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.transitionDelay = (i * 90 * motion) + 'ms';
      targets.push(child);
    });
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.remove(pre);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) {
    el.classList.add(pre);
    io.observe(el);
  });
})();
