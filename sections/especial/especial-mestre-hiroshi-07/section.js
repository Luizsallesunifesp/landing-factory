(function () {
  var root = document.querySelector('[data-secao="especial-mestre-hiroshi-07"]');
  if (!root) return;
  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  if (motion <= 0) return;

  var revs = root.querySelectorAll('.especial-mestre-hiroshi-07__rev');
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(revs, { opacity: 0, y: 20 * motion });
    ScrollTrigger.batch(revs, {
      start: 'top 88%',
      once: true,
      onEnter: function (els) {
        gsap.to(els, { opacity: 1, y: 0, duration: 0.8 * motion, stagger: 0.12 * motion, ease: 'power3.out' });
      }
    });
  }

  if (window.matchMedia('(hover: hover)').matches) {
    revs.forEach(function (card) {
      var px = 0, py = 0, agendado = false;
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width) * 100;
        py = ((e.clientY - r.top) / r.height) * 100;
        if (agendado) return;
        agendado = true;
        requestAnimationFrame(function () {
          card.style.setProperty('--mx', px.toFixed(1) + '%');
          card.style.setProperty('--my', py.toFixed(1) + '%');
          agendado = false;
        });
      });
    });
  }
})();
