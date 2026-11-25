(function () {
  document.querySelectorAll('[data-secao="faq-acalm-head-spa-08"]').forEach(function (root) {
    var items = root.querySelectorAll('.faq-acalm-head-spa-08__item');
    var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
    if (isNaN(motion)) motion = 1;

    function setOpen(item, open) {
      var a = item.querySelector('.faq-acalm-head-spa-08__a');
      item.classList.toggle('is-open', open);
      item.querySelector('button').setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
    }

    items.forEach(function (item) {
      var a = item.querySelector('.faq-acalm-head-spa-08__a');
      a.style.transitionDuration = (0.4 * motion) + 's';
      item.querySelector('button').addEventListener('click', function () {
        var was = item.classList.contains('is-open');
        items.forEach(function (i) { setOpen(i, false); });
        if (!was) setOpen(item, true);
      });
    });

    if (items[0]) setOpen(items[0], true);
  });
})();
