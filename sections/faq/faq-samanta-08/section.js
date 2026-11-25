(function () {
  var raiz = document.querySelector('[data-secao="faq-samanta-08"]');
  if (!raiz || typeof gsap === 'undefined') return;
  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;
  if (m === 0) return;

  function refresh() { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }

  raiz.querySelectorAll('.faq-samanta-08__item').forEach(function (item) {
    var pergunta = item.querySelector('summary');
    var resposta = item.querySelector('.faq-samanta-08__resp');
    pergunta.addEventListener('click', function (e) {
      e.preventDefault();
      if (item.classList.contains('fechando')) return;
      if (item.open) {
        item.classList.add('fechando');
        gsap.to(resposta, {
          height: 0, opacity: 0, duration: 0.3 * m, ease: 'power2.inOut',
          onComplete: function () {
            item.open = false;
            item.classList.remove('fechando');
            gsap.set(resposta, { clearProps: 'height,opacity' });
            refresh();
          }
        });
      } else {
        item.open = true;
        gsap.fromTo(resposta, { height: 0, opacity: 0 }, {
          height: 'auto', opacity: 1, duration: 0.35 * m, ease: 'power2.out',
          onComplete: function () {
            gsap.set(resposta, { clearProps: 'height,opacity' });
            refresh();
          }
        });
      }
    });
  });
})();
