(function () {
  var root = document.querySelector('[data-secao="footer-luiz-ricardo-10"]');
  if (!root) return;
  var coord = root.querySelector('[data-coord]');
  if (!coord) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var tick = function () {
    var p = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo', hour12: false,
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }).formatToParts(new Date()).reduce(function (a, x) { a[x.type] = x.value; return a; }, {});
    coord.textContent = 'BRT ' + pad(p.hour) + ':' + pad(p.minute) + ':' + pad(p.second);
  };
  tick();
  if (motion > 0) setInterval(tick, 1000);
})();
