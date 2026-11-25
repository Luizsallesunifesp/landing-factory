(function () {
  var raiz = document.querySelector('[data-secao="faq-mestre-hiroshi-10"]');
  if (!raiz || typeof gsap === 'undefined') return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m <= 0) return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  function fatiar(el) {
    var palavras = [];
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
        s.className = 'faq-mestre-hiroshi-10__palavra';
        s.textContent = p;
        palavras.push(s);
        frag.appendChild(s);
      });
      t.parentNode.replaceChild(frag, t);
    });
    return palavras;
  }

  var gatilho = function (el, start) {
    return typeof ScrollTrigger !== 'undefined'
      ? { trigger: el, start: start, once: true } : undefined;
  };

  var h = raiz.querySelector('[data-palavras]');
  if (h) {
    var palavras = fatiar(h);
    if (palavras.length) {
      gsap.from(palavras, {
        opacity: 0, yPercent: 55 * m, filter: 'blur(8px)',
        duration: .85 * m, stagger: .028 * m, ease: 'expo.out',
        clearProps: 'opacity,transform,filter',
        scrollTrigger: gatilho(h, 'top 88%')
      });
    }
  }

  var bloco = raiz.querySelector('[data-escalona]');
  if (bloco && bloco.children.length) {
    gsap.from(bloco.children, {
      opacity: 0, y: 22 * m, filter: 'blur(5px)',
      duration: .62 * m, stagger: .055 * m, ease: 'expo.out',
      clearProps: 'opacity,transform,filter',
      scrollTrigger: gatilho(bloco, 'top 88%')
    });
  }
})();
