(function () {
  var root = document.querySelector('[data-secao="servicos-mestre-hiroshi-04"]');
  if (!root || typeof gsap === 'undefined') return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m === 0) return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  var P = 'servicos-mestre-hiroshi-04__';

  function gatilho(el, start) {
    return typeof ScrollTrigger !== 'undefined'
      ? { trigger: el, start: start || 'top 88%', once: true }
      : undefined;
  }

  // titulo palavra a palavra
  var h = root.querySelector('[data-palavras]');
  if (h && !h.querySelector('.' + P + 'palavra')) {
    var txt = h.textContent.trim();
    h.textContent = '';
    txt.split(/\s+/).forEach(function (p, i, a) {
      var s = document.createElement('span');
      s.className = P + 'palavra';
      s.textContent = p;
      h.appendChild(s);
      if (i < a.length - 1) h.appendChild(document.createTextNode(' '));
    });
    gsap.from(h.querySelectorAll('.' + P + 'palavra'), {
      opacity: 0, yPercent: 55 * m, filter: 'blur(8px)',
      duration: .85 * m, stagger: .028 * m, ease: 'expo.out',
      clearProps: 'opacity,transform,filter',
      scrollTrigger: gatilho(h)
    });
  }

  // itens em cascata
  var lista = root.querySelector('[data-escalona]');
  if (lista && lista.children.length) {
    gsap.from(lista.children, {
      opacity: 0, y: 22 * m, filter: 'blur(5px)',
      duration: .62 * m, stagger: .055 * m, ease: 'expo.out',
      clearProps: 'opacity,transform,filter',
      scrollTrigger: gatilho(lista)
    });
  }

  // reveal do corpo e do CTA
  root.querySelectorAll('[data-rev]').forEach(function (el) {
    gsap.from(el, {
      opacity: 0, y: 20 * m, filter: 'blur(6px)',
      duration: .7 * m, ease: 'expo.out',
      clearProps: 'opacity,transform,filter',
      scrollTrigger: gatilho(el, 'top 90%')
    });
  });
})();
