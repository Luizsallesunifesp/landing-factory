(function () {
  var raiz = document.querySelector('[data-secao="processo-samanta-05"]');
  if (!raiz || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0) return;
  gsap.registerPlugin(ScrollTrigger);

  var P = 'processo-samanta-05__';
  var grade = raiz.querySelector('.' + P + 'grid');
  var passos = Array.prototype.slice.call(raiz.querySelectorAll('.' + P + 'passo'));
  if (!grade || passos.length < 2) return;
  var NS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', P + 'linha');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  var trilho = document.createElementNS(NS, 'path');
  var progresso = document.createElementNS(NS, 'path');
  trilho.setAttribute('class', P + 'trilho');
  progresso.setAttribute('class', P + 'progresso');
  svg.appendChild(trilho);
  svg.appendChild(progresso);
  grade.insertBefore(svg, grade.firstChild);
  grade.setAttribute('data-anim', '');

  var comprimento = 1, marcos = [], avanco = 0;

  function tracar() {
    var g = grade.getBoundingClientRect();
    svg.setAttribute('viewBox', '0 0 ' + g.width + ' ' + g.height);
    var pontos = passos.map(function (p) {
      var r = p.querySelector('.' + P + 'n').getBoundingClientRect();
      return [r.left - g.left + 4.5, r.top - g.top + r.height / 2];
    });
    var d = 'M' + pontos[0][0] + ',' + pontos[0][1];
    var trechos = [];
    for (var i = 1; i < pontos.length; i++) {
      var a = pontos[i - 1], b = pontos[i], meio = (b[1] - a[1]) * 0.5;
      d += ' C' + a[0] + ',' + (a[1] + meio) + ' ' + b[0] + ',' + (b[1] - meio) + ' ' + b[0] + ',' + b[1];
      trechos.push(d);
    }
    trilho.setAttribute('d', d);
    progresso.setAttribute('d', d);
    comprimento = progresso.getTotalLength() || 1;
    var medidor = document.createElementNS(NS, 'path');
    svg.appendChild(medidor);
    marcos = [0].concat(trechos.map(function (t) { medidor.setAttribute('d', t); return medidor.getTotalLength() / comprimento; }));
    svg.removeChild(medidor);
    progresso.style.strokeDasharray = comprimento;
    desenhar(avanco);
  }

  function desenhar(p) {
    avanco = p;
    progresso.style.strokeDashoffset = comprimento * (1 - p);
    passos.forEach(function (el, i) { el.classList.toggle('is-aceso', p >= marcos[i] - 0.005 && p > 0); });
  }

  ScrollTrigger.create({
    trigger: passos[0],
    start: 'top 70%',
    endTrigger: passos[passos.length - 1],
    end: 'top 60%',
    scrub: true,
    onUpdate: function (self) { desenhar(self.progress); },
    onRefresh: tracar
  });
  tracar();
})();
