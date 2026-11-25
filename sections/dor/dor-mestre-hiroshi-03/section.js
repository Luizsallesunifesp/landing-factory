(function () {
  var raiz = document.querySelector('[data-secao="dor-mestre-hiroshi-03"]');
  if (!raiz) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion <= 0) return;
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

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
        s.className = 'palavra';
        s.style.display = 'inline-block';
        s.textContent = p;
        frag.appendChild(s);
      });
      t.parentNode.replaceChild(frag, t);
    });
    return el.querySelectorAll('.palavra');
  }

  function gatilho(el, start) {
    return typeof ScrollTrigger !== 'undefined'
      ? { trigger: el, start: start, once: true }
      : undefined;
  }

  var titulo = raiz.querySelector('[data-palavras]');
  if (titulo) {
    var palavras = fatiar(titulo);
    if (palavras.length) {
      gsap.from(palavras, {
        opacity: 0, yPercent: 55 * motion, filter: 'blur(8px)',
        duration: .85 * motion, stagger: .028 * motion, ease: 'expo.out',
        clearProps: 'opacity,transform,filter',
        scrollTrigger: gatilho(titulo, 'top 88%')
      });
    }
  }

  var lista = raiz.querySelector('[data-escalona]');
  if (lista && lista.children.length) {
    gsap.from(lista.children, {
      opacity: 0, y: 22 * motion, filter: 'blur(5px)',
      duration: .62 * motion, stagger: .055 * motion, ease: 'expo.out',
      clearProps: 'opacity,transform,filter',
      scrollTrigger: gatilho(lista, 'top 88%')
    });
  }
})();
