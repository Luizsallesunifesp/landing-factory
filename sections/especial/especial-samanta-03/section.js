(function () {
  var secao = document.querySelector('[data-secao="especial-samanta-03"]');
  if (!secao) return;
  var P = "especial-samanta-03__";
  var stage = secao.querySelector("." + P + "stage");
  var quadro = secao.querySelector("." + P + "quadro");
  var svg = secao.querySelector("." + P + "linhas");
  var canvas = secao.querySelector("." + P + "canvas");
  var notas = Array.prototype.slice.call(secao.querySelectorAll("." + P + "nota"));
  var SVGNS = "http://www.w3.org/2000/svg";
  var RECORTE = { x: 144, y: 96, w: 432, h: 720 };
  var ENTRADAS = [0.02, 0.25, 0.48, 0.71];
  var alpha = notas.map(function () { return 1; });

  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--motion"));
  if (isNaN(motion)) motion = 1;

  function limitar(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function desenharLinhas() {
    svg.textContent = "";
    if (getComputedStyle(svg).display === "none") return;
    var s = stage.getBoundingClientRect();
    var q = quadro.getBoundingClientRect();
    svg.setAttribute("viewBox", "0 0 " + s.width + " " + s.height);
    notas.forEach(function (nota, idx) {
      if (getComputedStyle(nota).visibility === "hidden") return;
      var a = (nota.dataset.ancora || "0.5,0.5").split(",").map(Number);
      var ax = q.left - s.left + a[0] * q.width;
      var ay = q.top - s.top + a[1] * q.height;
      var t = nota.querySelector("." + P + "node").getBoundingClientRect();
      var esquerda = nota.classList.contains(P + "nota--e");
      var lateral = t.bottom < q.bottom - 4 || window.innerWidth >= 768;
      var x1, y1, d;
      if (lateral) {
        x1 = (esquerda ? t.right : t.left) - s.left;
        y1 = t.top + t.height / 2 - s.top;
        var dx = (ax - x1) * 0.55;
        d = "M" + x1 + "," + y1 + " C" + (x1 + dx) + "," + y1 + " " + (ax - dx) + "," + ay + " " + ax + "," + ay;
      } else {
        x1 = t.left + t.width / 2 - s.left;
        y1 = t.top - s.top;
        var dy = (ay - y1) * 0.55;
        d = "M" + x1 + "," + y1 + " C" + x1 + "," + (y1 + dy) + " " + ax + "," + (ay - dy) + " " + ax + "," + ay;
      }
      var path = document.createElementNS(SVGNS, "path");
      path.setAttribute("d", d);
      path.dataset.nota = idx;
      var ponto = document.createElementNS(SVGNS, "circle");
      ponto.setAttribute("cx", ax);
      ponto.setAttribute("cy", ay);
      ponto.setAttribute("r", 3.5);
      ponto.dataset.nota = idx;
      svg.appendChild(path);
      svg.appendChild(ponto);
      var len = path.getTotalLength();
      path.dataset.len = len;
      path.style.strokeDasharray = len;
    });
    aplicarAlpha();
  }

  function aplicarAlpha() {
    if (!secao.classList.contains("is-anim")) return;
    notas.forEach(function (nota, i) {
      nota.style.opacity = alpha[i];
      nota.style.setProperty("--sobe", ((1 - alpha[i]) * 12 * motion).toFixed(1) + "px");
      nota.classList.toggle("is-ativa", alpha[i] > 0.01);
    });
    svg.querySelectorAll("[data-nota]").forEach(function (el) {
      var a = alpha[+el.dataset.nota];
      if (el.tagName === "path") {
        el.style.strokeDashoffset = (+el.dataset.len * (1 - a)).toFixed(1);
        el.style.opacity = a > 0 ? 1 : 0;
      } else {
        el.style.opacity = a;
      }
    });
  }

  var espera;
  window.addEventListener("resize", function () {
    clearTimeout(espera);
    espera = setTimeout(desenharLinhas, 120);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(desenharLinhas);
  desenharLinhas();

  /* sem animação: fica a imagem estática com as etiquetas visíveis */
  if (!motion || !window.gsap || !window.ScrollTrigger) return;
  var base = secao.getAttribute("data-frames");
  if (!base || /^\{\{/.test(base)) return;

  secao.classList.add("is-anim");
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  var conexao = navigator.connection || {};
  var leve = window.innerWidth <= 768 || conexao.saveData === true;
  var pasta = (leve && secao.getAttribute("data-frames-leve")) || base;
  if (pasta.slice(-1) !== "/") pasta += "/";
  var total = leve ? 60 : 120;
  var quadros = new Array(total);
  var ctx = canvas.getContext("2d");
  var atual = 0;

  function carregar(i) {
    return new Promise(function (pronto) {
      var img = new Image();
      img.decoding = "async";
      img.onload = function () { quadros[i] = img; pronto(); };
      img.onerror = pronto;
      img.src = pasta + "f_" + String(i).padStart(4, "0") + ".webp";
    });
  }

  function maisProximo(i) {
    for (var d = 0; d < total; d++) {
      if (quadros[i - d]) return quadros[i - d];
      if (quadros[i + d]) return quadros[i + d];
    }
    return null;
  }

  function ajustarCanvas() {
    var r = canvas.getBoundingClientRect();
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = Math.round(r.width * dpr);
    var h = Math.round(r.height * dpr);
    if (w && h && (canvas.width !== w || canvas.height !== h)) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  function desenhar() {
    var img = maisProximo(atual);
    if (!img || !canvas.width) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, RECORTE.x, RECORTE.y, RECORTE.w, RECORTE.h, 0, 0, canvas.width, canvas.height);
  }

  function atualizar(p) {
    var i = Math.round(p * (total - 1));
    if (i !== atual) { atual = i; desenhar(); }
    if (window.innerWidth < 768) {
      alpha = notas.map(function (_, k) {
        var entra = k === 0 ? 1 : limitar((p - k * 0.25) / 0.05);
        var sai = k === notas.length - 1 ? 1 : limitar(((k + 1) * 0.25 - p) / 0.05);
        return Math.min(entra, sai);
      });
    } else {
      alpha = notas.map(function (_, k) {
        var t = ENTRADAS[k] !== undefined ? ENTRADAS[k] : k / notas.length;
        return limitar((p - t) / 0.08);
      });
    }
    aplicarAlpha();
  }

  var estado = { p: 0 };
  ajustarCanvas();
  carregar(0).then(desenhar);
  desenharLinhas();
  atualizar(0);

  gsap.to(estado, {
    p: 1,
    ease: "none",
    onUpdate: function () { atualizar(estado.p); },
    scrollTrigger: {
      trigger: secao.querySelector("." + P + "pin"),
      start: "top top",
      end: "+=" + Math.round(250 * motion) + "%",
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh: function () {
        ajustarCanvas();
        desenharLinhas();
        desenhar();
        atualizar(estado.p);
      }
    }
  });

  function carregarResto() {
    var vistos = {};
    vistos[0] = true;
    var fila = [];
    [32, 16, 8, 4, 2, 1].forEach(function (passo) {
      for (var i = 0; i < total; i += passo) {
        if (!vistos[i]) { vistos[i] = true; fila.push(i); }
      }
    });
    (function lote() {
      var parte = fila.splice(0, 12);
      if (!parte.length) return;
      Promise.all(parte.map(carregar)).then(function () {
        desenhar();
        setTimeout(lote, 30);
      });
    })();
  }
  if (document.readyState === "complete") carregarResto();
  else window.addEventListener("load", carregarResto, { once: true });
})();
