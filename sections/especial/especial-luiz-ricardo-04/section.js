(function () {
  'use strict';
  var root = document.querySelector('[data-secao="especial-luiz-ricardo-04"]');
  if (!root) return;
  var split = root.querySelector('[data-split]');
  var handle = root.querySelector('[data-handle]');
  if (!split || !handle) return;

  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  var coarse = window.matchMedia && window.matchMedia('(pointer:coarse)').matches;
  var manual = false, manualUntil = 0;

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function setWipe(pct) {
    pct = clamp(pct, 0, 100);
    split.style.setProperty('--wipe', pct + '%');
    split.classList.toggle('at-right', pct > 86);
    split.classList.toggle('at-left', pct < 14);
  }
  function dragTo(x) {
    var r = split.getBoundingClientRect();
    setWipe(((x - r.left) / r.width) * 100);
  }

  /* arraste manual (funciona mesmo com --motion 0: e interacao, nao animacao) */
  function onMove(ev) { manual = true; manualUntil = Date.now() + 5000; split.classList.add('touched'); dragTo(ev.clientX); }
  function stop(ev) {
    if (handle.releasePointerCapture && ev && ev.pointerId != null) {
      try { handle.releasePointerCapture(ev.pointerId); } catch (e) {}
    }
    handle.removeEventListener('pointermove', onMove);
    handle.removeEventListener('pointerup', stop);
    handle.removeEventListener('pointercancel', stop);
  }
  handle.addEventListener('pointerdown', function (ev) {
    ev.preventDefault();
    manual = true;
    split.classList.add('touched');
    if (handle.setPointerCapture) { try { handle.setPointerCapture(ev.pointerId); } catch (e) {} }
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', stop);
    handle.addEventListener('pointercancel', stop);
  });

  if (motion <= 0) { setWipe(50); return; }

  /* reveal */
  root.classList.add('is-ready');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { split.classList.add('in'); io.disconnect(); } });
    }, { threshold: 0.15 });
    io.observe(split);
  } else { split.classList.add('in'); }

  if (!coarse) {
    split.addEventListener('pointermove', function (ev) {
      manual = true; manualUntil = Date.now() + 2600; dragTo(ev.clientX);
    });
    split.addEventListener('pointerleave', function () { manualUntil = Date.now() + 600; });
  }

  setWipe(100);

  /* cortina que abre com o scroll */
  function onScroll() {
    if (manual && Date.now() > manualUntil) manual = false;
    if (manual) return;
    var vh = window.innerHeight;
    var sr = split.getBoundingClientRect();
    var raw = (vh - sr.top) / (vh * 0.9 + sr.height * 0.35);
    var t = clamp(((raw - 0.18) / 0.48) * motion, 0, 1);
    t = 1 - Math.pow(1 - t, 3);
    setWipe((1 - t) * 100);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
