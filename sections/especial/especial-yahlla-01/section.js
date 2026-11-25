(function () {
  var root = document.querySelector('[data-secao="especial-yahlla-01"]');
  if (!root) return;
  var P = 'especial-yahlla-01__';
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0) return;

  var fill = root.querySelector('[data-rail-fill]');
  var flame = root.querySelector('[data-rail-flame]');
  var dotsWrap = root.querySelector('[data-rail-dots]');

  // transicoes escalonadas por --motion
  fill.style.transitionDuration = (0.1 * motion).toFixed(3) + 's';
  flame.style.transitionDuration = (0.12 * motion).toFixed(3) + 's';

  function onScroll() {
    var doc = document.documentElement;
    var top = window.scrollY || doc.scrollTop;
    var max = doc.scrollHeight - doc.clientHeight;
    var pct = max > 0 ? Math.min(Math.max(top / max, 0), 1) * 100 : 0;
    fill.style.height = pct.toFixed(2) + '%';
    flame.style.top = pct.toFixed(2) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // pontos: um por secao da pagina (exceto esta), rotulos na ordem do slot
  var labels = [].map.call(root.querySelectorAll('.' + P + 'labels li'), function (li) {
    return li.textContent.trim();
  });
  var secs = [].filter.call(document.querySelectorAll('[data-secao]'), function (el) {
    return el !== root && el.tagName !== 'NAV' && el.tagName !== 'FOOTER' && el.tagName !== 'HEADER';
  });
  if (!secs.length) return;
  var dots = secs.map(function (sec, i) {
    var d = document.createElement('div');
    d.className = P + 'dot';
    d.style.top = (secs.length > 1 ? (i / (secs.length - 1)) * 100 : 0) + '%';
    var lab = document.createElement('span');
    lab.className = P + 'label';
    lab.textContent = labels[i] || sec.getAttribute('data-secao');
    d.appendChild(lab);
    d.addEventListener('click', function () {
      sec.scrollIntoView({ behavior: motion > 0 ? 'smooth' : 'auto' });
    });
    dotsWrap.appendChild(d);
    return d;
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var idx = secs.indexOf(e.target);
        dots.forEach(function (d) { d.classList.remove('is-active'); });
        if (dots[idx]) dots[idx].classList.add('is-active');
      });
    }, { threshold: 0.5 });
    secs.forEach(function (s) { io.observe(s); });
  }
})();
