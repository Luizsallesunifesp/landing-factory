(function () {
  var root = document.querySelector('[data-secao="sobre-mestre-hiroshi-06"]');
  if (!root || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m <= 0) return;
  gsap.registerPlugin(ScrollTrigger);
  root.classList.add('is-anim');

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
        s.className = 'sobre-mestre-hiroshi-06__palavra';
        s.textContent = p;
        frag.appendChild(s);
      });
      t.parentNode.replaceChild(frag, t);
    });
    return el.querySelectorAll('.sobre-mestre-hiroshi-06__palavra');
  }

  root.querySelectorAll('[data-palavras]').forEach(function (h) {
    var palavras = fatiar(h);
    if (!palavras.length) return;
    gsap.from(palavras, {
      opacity: 0, yPercent: 55 * m, filter: 'blur(8px)',
      duration: .85 * m, stagger: .028 * m, ease: 'expo.out',
      clearProps: 'opacity,transform,filter',
      scrollTrigger: { trigger: h, start: 'top 88%', once: true }
    });
  });

  root.querySelectorAll('[data-escalona]').forEach(function (bloco) {
    if (!bloco.children.length) return;
    gsap.from(bloco.children, {
      opacity: 0, y: 22 * m, filter: 'blur(5px)',
      duration: .62 * m, stagger: .055 * m, ease: 'expo.out',
      clearProps: 'opacity,transform,filter',
      scrollTrigger: { trigger: bloco, start: 'top 88%', once: true }
    });
  });

  ScrollTrigger.batch(root.querySelectorAll('.sobre-mestre-hiroshi-06__rev'), {
    start: 'top 90%', once: true,
    onEnter: function (lote) {
      gsap.to(lote, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .7 * m, stagger: .06 * m, ease: 'expo.out' });
    }
  });

  setTimeout(function () {
    root.querySelectorAll('.sobre-mestre-hiroshi-06__rev').forEach(function (el) {
      if (getComputedStyle(el).opacity === '0') gsap.set(el, { opacity: 1, y: 0, filter: 'none' });
    });
  }, 3000);
})();
