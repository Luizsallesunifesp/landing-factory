(function () {
  'use strict';
  var root = document.querySelector('[data-secao="hero-luiz-ricardo-03"]');
  if (!root) return;

  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  var clamp = function (v, a, b) { return v < a ? a : (v > b ? b : v); };

  /* codigo de barras (estatico, vale tambem com motion 0) */
  var bars = root.querySelector('.hero-luiz-ricardo-03__bars');
  if (bars && !bars.children.length) {
    var seed = 7, frag = document.createDocumentFragment();
    for (var b = 0; b < 16; b++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      var el = document.createElement('i');
      el.style.width = (1 + (seed % 3)) + 'px';
      el.style.opacity = 0.35 + ((seed >> 4) % 60) / 100;
      frag.appendChild(el);
    }
    bars.appendChild(frag);
  }

  /* terminal: texto final fixo quando sem movimento */
  var typed = root.querySelector('.hero-luiz-ricardo-03__typed');
  var lines = [];
  if (typed) {
    lines = (typed.getAttribute('data-linhas') || '').split('|').map(function (s) { return s.trim(); }).filter(Boolean);
    if (lines.length && motion <= 0) {
      typed.innerHTML = '<span class="hero-luiz-ricardo-03__out hero-luiz-ricardo-03__out--ok">' + lines[lines.length - 1] + '</span>';
    }
  }

  if (motion <= 0) return;

  /* reveal do cartao */
  root.classList.add('is-armed');
  var revs = [].slice.call(root.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revs.forEach(function (r) { io.observe(r); });
  } else {
    revs.forEach(function (r) { r.classList.add('in'); });
  }

  /* digitacao */
  if (typed && lines.length) {
    var li = 0, ci = 0, del = false;
    (function loop() {
      var full = lines[li], last = li === lines.length - 1;
      var cls = 'hero-luiz-ricardo-03__out' + (last ? ' hero-luiz-ricardo-03__out--ok' : '');
      var caret = '<span class="hero-luiz-ricardo-03__caret"></span>';
      if (!del) {
        ci++;
        typed.innerHTML = '<span class="' + cls + '">' + full.slice(0, ci) + '</span>' + caret;
        if (ci >= full.length) { del = true; setTimeout(loop, (last ? 1900 : 850) * motion); return; }
      } else {
        ci--;
        typed.innerHTML = '<span class="' + cls + '">' + full.slice(0, ci) + '</span>' + caret;
        if (ci <= 0) { del = false; li = (li + 1) % lines.length; }
      }
      setTimeout(loop, (del ? 20 : 36) * motion);
    })();
  }

  /* parallax do bloom */
  var depths = [].slice.call(root.querySelectorAll('[data-depth]'));
  var vel = 0, lastY = window.scrollY, ticking = false;
  function frame() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    vel = y - lastY; lastY = y;
    depths.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var sp = (parseFloat(el.getAttribute('data-depth')) || 0.1) * motion;
      el.style.transform = 'translate3d(0,' + ((vh / 2 - (r.top + r.height / 2)) * sp).toFixed(1) + 'px,0)';
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  frame();

  /* campo de circuito (canvas) */
  var cv = root.querySelector('.hero-luiz-ricardo-03__field');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d'), nodes = [], W = 0, H = 0, dpr = 1, alive = true;
  var pointer = { x: -999, y: -999, on: false };

  /* cor do acento lida do token */
  var probe = document.createElement('span');
  probe.style.color = 'var(--c-accent)';
  probe.style.display = 'none';
  root.appendChild(probe);
  var rgb = (getComputedStyle(probe).color.match(/\d+(\.\d+)?/g) || [200, 160, 80]).slice(0, 3).join(',');
  root.removeChild(probe);

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = clamp(Math.round((W * H) / 17000), 26, 74);
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.16 * motion, vy: (Math.random() - 0.5) * 0.16 * motion,
        r: Math.random() * 1.3 + 0.5, a: Math.random() * 0.5 + 0.2
      });
    }
  }
  root.addEventListener('pointermove', function (e) {
    var r = cv.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.on = true;
  });
  root.addEventListener('pointerleave', function () { pointer.on = false; pointer.x = -999; pointer.y = -999; });

  var drift = 0;
  function draw() {
    if (!alive) return;
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, W, H);
    drift += (clamp(vel, -40, 40) * motion - drift) * 0.08;
    var i, n;
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      n.x += n.vx; n.y += n.vy + drift * 0.012;
      if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
      if (pointer.on) {
        var dx = n.x - pointer.x, dy = n.y - pointer.y, d2 = dx * dx + dy * dy;
        if (d2 < 20000 && d2 > 1) {
          var f = (1 - d2 / 20000) * 0.9 * motion, d = Math.sqrt(d2);
          n.x += (dx / d) * f; n.y += (dy / d) * f;
        }
      }
    }
    ctx.lineWidth = 1;
    for (var a = 0; a < nodes.length; a++) {
      for (var c = a + 1; c < nodes.length; c++) {
        var p = nodes[a], q = nodes[c];
        var ddx = p.x - q.x, ddy = p.y - q.y, dd = ddx * ddx + ddy * ddy;
        if (dd < 15000) {
          ctx.strokeStyle = 'rgba(' + rgb + ',' + ((1 - dd / 15000) * 0.16).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    for (var k = 0; k < nodes.length; k++) {
      var m = nodes[k];
      ctx.fillStyle = 'rgba(' + rgb + ',' + (m.a * 0.75).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.2832); ctx.fill();
    }
  }

  size();
  window.addEventListener('resize', size);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !alive) { alive = true; draw(); }
        else if (!e.isIntersecting) { alive = false; }
      });
    }, { threshold: 0 }).observe(root);
  }
  draw();
})();
