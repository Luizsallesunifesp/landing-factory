(function () {
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  document.querySelectorAll('[data-secao="servicos-tiago-farma-04"]').forEach(function (root) {
    root.classList.add('is-js');
    var btns = root.querySelectorAll('.servicos-tiago-farma-04__tab-btn');
    var panels = root.querySelectorAll('.servicos-tiago-farma-04__panel');

    function growBars(panel) {
      panel.querySelectorAll('.servicos-tiago-farma-04__bar').forEach(function (b) {
        b.style.height = motion === 0 ? b.dataset.h + 'px' : '0px';
        if (motion !== 0) {
          void b.offsetHeight;
          b.style.height = b.dataset.h + 'px';
        }
      });
    }
    function show(n) {
      btns.forEach(function (b) { b.classList.toggle('is-active', b.dataset.tab === n); b.setAttribute('aria-selected', b.dataset.tab === n); });
      panels.forEach(function (p) {
        var on = p.dataset.panel === n;
        p.classList.toggle('is-active', on);
        if (on) growBars(p);
      });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.tab); }); });
    if (btns.length) show(btns[0].dataset.tab);
  });
})();
