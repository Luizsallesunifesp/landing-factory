(function () {
  var root = document.querySelector('[data-secao="faq-vanessa-07"]');
  if (!root) return;

  // primeiro item aberto, como no original
  var first = root.querySelector('details');
  if (first) first.setAttribute('open', '');

  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0) return;

  var targets = [];
  var head = root.querySelector('[data-reveal]');
  if (head) targets.push(head);
  var list = root.querySelector('[data-stagger]');
  if (list) {
    Array.prototype.forEach.call(list.children, function (child, i) {
      child.style.transitionDelay = (i * 90 * motion) + 'ms';
      targets.push(child);
    });
  }
  targets.forEach(function (el) { el.classList.add('faq-vanessa-07__reveal'); });

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(function (el) { io.observe(el); });
})();
