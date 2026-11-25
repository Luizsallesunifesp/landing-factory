(function () {
  var root = document.querySelector('[data-secao="especial-thais-05"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion === 0) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  var P = 'especial-thais-05__';
  var fig = root.querySelector('.' + P + 'fig');
  if (!fig) return;

  var regua = root.querySelector('.' + P + 'regua');
  if (regua) {
    gsap.fromTo(regua, { scaleX: 0 }, {
      scaleX: 1, duration: 1.1 * motion, ease: 'power3.out',
      scrollTrigger: { trigger: regua, start: 'top 90%', once: true }
    });
  }

  // Curva desenhada conforme o scroll; marcadores aparecem ao passar de data-p.
  var curvas = Array.prototype.slice.call(fig.querySelectorAll('.' + P + 'curva'));
  var fantasmas = Array.prototype.slice.call(fig.querySelectorAll('.' + P + 'fantasma'));
  var marcadores = Array.prototype.slice.call(fig.querySelectorAll('.' + P + 'marcador'));
  if (!curvas.length) return;

  var comprimentos = curvas.map(function (c) { return c.getTotalLength(); });
  curvas.forEach(function (c, i) {
    gsap.set(c, { strokeDasharray: comprimentos[i], strokeDashoffset: comprimentos[i] });
  });
  gsap.set(fantasmas, { opacity: 0 });
  gsap.set(marcadores, { opacity: 0 });

  ScrollTrigger.create({
    trigger: fig,
    start: 'top 78%',
    end: 'bottom 42%',
    scrub: 0.6 * motion,
    onUpdate: function (self) {
      var p = self.progress;
      curvas.forEach(function (c, i) {
        gsap.set(c, { strokeDashoffset: comprimentos[i] * (1 - p) });
      });
      gsap.set(fantasmas, { opacity: Math.min(Math.max(p / 0.14, 0), 1) * 0.75 });
      marcadores.forEach(function (m) {
        gsap.set(m, { opacity: p >= parseFloat(m.getAttribute('data-p')) ? 1 : 0 });
      });
    }
  });
})();
