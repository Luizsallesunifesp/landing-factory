(function () {
  var raiz = document.querySelector('[data-secao="hero-mestre-hiroshi-01"]');
  if (!raiz || typeof gsap === 'undefined') return;

  var mot = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(mot)) mot = 1;
  if (mot <= 0) return;

  var temST = typeof ScrollTrigger !== 'undefined';
  if (temST) gsap.registerPlugin(ScrollTrigger);

  var P = 'hero-mestre-hiroshi-01__';

  function fatiar(el) {
    var pilha = [el], textos = [];
    while (pilha.length) {
      var no = pilha.pop();
      for (var i = 0; i < no.childNodes.length; i++) {
        var f = no.childNodes[i];
        if (f.nodeType === 3) { if (f.nodeValue.trim()) textos.push(f); }
        else if (f.nodeType === 1) pilha.push(f);
      }
    }
    textos.forEach(function (t) {
      var frag = document.createDocumentFragment();
      t.nodeValue.split(/(\s+)/).forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
        var s = document.createElement('span');
        s.className = P + 'palavra';
        s.textContent = p;
        frag.appendChild(s);
      });
      t.parentNode.replaceChild(frag, t);
    });
    return el.querySelectorAll('.' + P + 'palavra');
  }

  /* título palavra a palavra */
  var h1 = raiz.querySelector('[data-palavras]');
  if (h1) {
    var palavras = fatiar(h1);
    if (palavras.length) {
      gsap.from(palavras, {
        opacity: 0, yPercent: 55 * mot, filter: 'blur(8px)',
        duration: .85 * mot, stagger: .028 * mot, ease: 'expo.out',
        clearProps: 'opacity,transform,filter'
      });
    }
  }

  /* revelação dos blocos de apoio */
  var revs = raiz.querySelectorAll('.' + P + 'rev');
  if (revs.length) {
    gsap.from(revs, {
      opacity: 0, y: 20 * mot, filter: 'blur(6px)',
      duration: .7 * mot, stagger: .06 * mot, delay: .15 * mot, ease: 'expo.out',
      clearProps: 'opacity,transform,filter'
    });
  }

  if (!temST) return;

  var topo = raiz;
  var saida = { trigger: topo, start: 'top top', end: 'bottom top', scrub: .5 };

  /* contagem regressiva ligada à rolagem */
  var n = raiz.querySelector('[data-cronos]');
  if (n) {
    var inicio = parseInt(n.textContent, 10);
    if (inicio > 1) {
      var contagem = { v: inicio };
      gsap.to(contagem, {
        v: 1, ease: 'none',
        scrollTrigger: { trigger: topo, start: 'top top', end: 'bottom top', scrub: .6 },
        onUpdate: function () {
          var k = Math.max(1, Math.ceil(contagem.v));
          if (n.textContent !== String(k)) n.textContent = k;
        }
      });
    }
  }

  /* profundidade na saída */
  var txt = raiz.querySelector('.' + P + 'txt');
  var cron = raiz.querySelector('.' + P + 'cronos');
  if (txt) gsap.to(txt, { yPercent: -12 * mot, opacity: 1 - .82 * Math.min(mot, 1), ease: 'none', scrollTrigger: saida });
  if (cron) gsap.to(cron, { yPercent: -34 * mot, opacity: 1 - .7 * Math.min(mot, 1), ease: 'none', scrollTrigger: saida });
})();
