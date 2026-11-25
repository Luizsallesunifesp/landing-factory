(function () {
  var root = document.querySelector('[data-secao="dor-samanta-04"]');
  if (!root || typeof gsap === 'undefined') return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion <= 0) return;
  var hasST = typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  var P = 'dor-samanta-04__';
  var itens = [root.querySelector('.' + P + 'rotulo'), root.querySelector('.' + P + 'lead'), root.querySelector('.' + P + 'fecho')].filter(Boolean);
  var fecho = root.querySelector('.' + P + 'fecho');
  var lead = root.querySelector('.' + P + 'lead');
  var sinais = Array.prototype.slice.call(root.querySelectorAll('.' + P + 'sinal'));

  gsap.set(itens, { opacity: 0, y: 12 * motion });
  if (fecho) gsap.set(fecho, { '--traco': 0 });

  function entrar(els) {
    gsap.to(els, { opacity: 1, y: 0, duration: 0.9 * motion, ease: 'power3.out', stagger: 0.12 * motion });
    if (fecho && els.indexOf(fecho) > -1) {
      gsap.to(fecho, { '--traco': 1, duration: 1.2 * motion, ease: 'power2.inOut', delay: 0.1 });
    }
  }

  if (!hasST) { entrar(itens); return; }

  ScrollTrigger.batch(itens, { start: 'top 88%', once: true, onEnter: entrar });

  if (sinais.length && lead) {
    var finais = sinais.map(function (s) { return getComputedStyle(s).color; });
    root.classList.add('is-anim');
    var tl = gsap.timeline({
      scrollTrigger: { trigger: lead, start: 'top 78%', end: 'bottom 42%', scrub: true }
    });
    sinais.forEach(function (s, i) {
      tl.to(s, { color: finais[i], backgroundSize: '100% 42%', ease: 'none', duration: 1 });
    });
  }
})();
