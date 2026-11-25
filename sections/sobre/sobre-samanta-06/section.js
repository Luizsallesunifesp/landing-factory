(function () {
  var root = document.querySelector('[data-secao="sobre-samanta-06"]');
  if (!root || typeof gsap === 'undefined') return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m <= 0) return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  else return;

  var itens = gsap.utils.toArray(root.querySelectorAll(
    '.sobre-samanta-06__texto > :not(.sobre-samanta-06__formacao):not(.sobre-samanta-06__titulo):not(.sobre-samanta-06__assinatura), .sobre-samanta-06__formacao-item'
  ));
  var tracos = gsap.utils.toArray(root.querySelectorAll('.sobre-samanta-06__formacao-item'));
  gsap.set(itens, { opacity: 0, y: 12 * m });
  gsap.set(tracos, { '--traco': 0 });
  ScrollTrigger.batch(itens, {
    start: 'top 88%',
    once: true,
    onEnter: function (els) {
      var passados = els.filter(function (el) { return el.getBoundingClientRect().bottom < 0; });
      var vistos = els.filter(function (el) { return el.getBoundingClientRect().bottom >= 0; });
      if (passados.length) gsap.set(passados, { opacity: 1, y: 0, '--traco': 1, overwrite: true });
      var iv = Math.min(0.12, 0.7 / Math.max(1, vistos.length)) * m;
      gsap.to(vistos, { opacity: 1, y: 0, duration: 0.9 * m, ease: 'power3.out', overwrite: 'auto', stagger: iv });
      var com = vistos.filter(function (el) { return el.matches('.sobre-samanta-06__formacao-item'); });
      if (com.length) gsap.to(com, { '--traco': 1, duration: 1.2 * m, ease: 'power2.inOut', stagger: iv, delay: 0.1 * m });
    }
  });

  var ass = root.querySelector('.sobre-samanta-06__assinatura');
  if (ass) {
    var filhos = ass.children;
    gsap.set(filhos, { clipPath: 'inset(0% 100% 0% 0%)' });
    ScrollTrigger.create({
      trigger: ass,
      start: 'top 85%',
      once: true,
      onEnter: function () {
        gsap.to(filhos, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8 * m, ease: 'power1.inOut', delay: 0.2 * m,
          onComplete: function () { gsap.set(filhos, { clearProps: 'clipPath' }); }
        });
      }
    });
  }
})();
