(function () {
  var root = document.querySelector('[data-secao="faixa-yahlla-07"]');
  if (!root) return;

  var m = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(m)) m = 1;

  // sem movimento: nada a fazer (conteudo fica visivel, imagem estatica)
  if (m === 0) return;

  var img = root.querySelector('.faixa-yahlla-07__img');
  var els = root.querySelectorAll('.faixa-yahlla-07__reveal');

  // reveal ao entrar na tela
  if ('IntersectionObserver' in window) {
    root.classList.add('is-armed');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  // parallax da imagem (scale + translateY)
  if (img) {
    var ticking = false;
    var update = function () {
      var rect = img.parentElement.getBoundingClientRect();
      var vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        var t = Math.max(0, Math.min(1 - rect.top / vh, 1.6));
        img.style.transform = 'scale(' + (1 + 0.15 * m - t * 0.06 * m) + ') translateY(' + (t * -30 * m) + 'px)';
      }
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
})();
