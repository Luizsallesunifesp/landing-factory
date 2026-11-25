(function () {
  var secao = document.querySelector('[data-secao="prova-thais-04"]');
  if (!secao) return;

  var motion = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if (isNaN(motion)) motion = 1;
  var temGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  // Sem movimento ou sem GSAP: permanece a grade estática do HTML
  if (motion <= 0 || !temGSAP) return;
  gsap.registerPlugin(ScrollTrigger);

  var q = function (s) { return secao.querySelector(s); };
  var fonte = secao.querySelectorAll('[data-roda-fonte] > li');
  var grade = q('[data-roda-fonte]');
  var roda = q('.prova-thais-04__roda');
  var palco = q('.prova-thais-04__palco');
  var corpo = q('.prova-thais-04__corpo');
  var trilho = q('.prova-thais-04__trilho');
  var trilhoVP = q('.prova-thais-04__trilho-viewport');
  var legenda = q('.prova-thais-04__legenda');
  var subEl = q('.prova-thais-04__sub');
  var vp = q('.prova-thais-04__viewport');

  var ATIVOS = Array.prototype.map.call(fonte, function (li) {
    var img = li.querySelector('img');
    return { src: img ? (img.currentSrc || img.src) : '', rotulo: li.dataset.rotulo || '', sub: li.dataset.sub || '' };
  }).filter(function (r) { return r.src; });
  if (!roda || !palco || ATIVOS.length === 0) return;

  grade.hidden = true;
  roda.hidden = false;

  var clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };

  var P = {
    turns: .45, blur: 5, dim: 42, brightnessBoost: 18, darknessStrength: 1.05,
    minSaturation: 46, saturationStrength: .6, focusSpread: .30, scaleEffect: .07,
    scrollSensitivity: .75, scrollLength: 210, captionOffset: 11, alvoFoco: .50
  };

  var MIN_ANEL = 15;
  var voltas = Math.max(1, Math.ceil(MIN_ANEL / ATIVOS.length));
  var totalAnel = ATIVOS.length * voltas;
  var DESLOC = Math.round(totalAnel * 0.25);
  var unico = function (i) { return (((i - DESLOC) % ATIVOS.length) + ATIVOS.length) % ATIVOS.length; };
  var ANEL = Array.from({ length: totalAnel }, function (_, i) { return ATIVOS[unico(i)]; });

  roda.style.height = P.scrollLength + 'vh';
  legenda.style.bottom = P.captionOffset + 'vh';

  var raio = 0, itemW = 0, itemH = 0;
  var cartoes = ANEL.map(function (r) {
    var fig = document.createElement('figure');
    fig.className = 'prova-thais-04__item';
    var div = document.createElement('div');
    div.className = 'prova-thais-04__img';
    div.style.backgroundImage = 'url(' + r.src + ')';
    div.setAttribute('role', 'img');
    div.setAttribute('aria-label', r.rotulo + '. ' + r.sub);
    fig.appendChild(div);
    var pre = new Image(); pre.src = r.src;
    palco.appendChild(fig);
    return fig;
  });

  function medir() {
    var larguraVP = vp.clientWidth || window.innerWidth;
    var alturaVP = vp.clientHeight || window.innerHeight;
    var tamRoda = clamp(larguraVP * 1.35, 820, 2000);
    raio = tamRoda / 2;
    itemH = Math.round(clamp(alturaVP * 0.46, 190, 340));
    itemW = Math.round(clamp(itemH / 1.3, 140, 268));
    var corte = clamp(1 - (P.alvoFoco * alturaVP) / tamRoda, 0.30, 0.90);
    corpo.style.width = tamRoda + 'px';
    corpo.style.height = tamRoda + 'px';
    corpo.style.bottom = '-' + Math.round(tamRoda * corte) + 'px';
    cartoes.forEach(function (c) { c.style.width = itemW + 'px'; c.style.height = itemH + 'px'; });
  }

  var espIni = document.createElement('span');
  var espFim = document.createElement('span');
  espIni.style.cssText = espFim.style.cssText = 'display:block;height:1px;flex:none';
  trilho.appendChild(espIni);
  var botoes = ATIVOS.map(function (r, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'prova-thais-04__btn';
    b.textContent = r.rotulo;
    b.dataset.i = i;
    b.addEventListener('click', function () { irPara(i); });
    trilho.appendChild(b);
    return b;
  });
  trilho.appendChild(espFim);

  var distanciaAngular = function (a, b) {
    var volta = Math.PI * 2;
    var bruto = ((a - b + Math.PI) % volta) - Math.PI;
    return Math.abs(bruto < -Math.PI ? bruto + volta : bruto);
  };
  var sensibilidade = function (p) { return Math.pow(clamp(p, 0, 1), 1 / clamp(P.scrollSensitivity, .25, 1.6)); };

  var anterior = -1, ativo = 0;
  function focoComHisterese(p, total, turns, atual, hist) {
    hist = hist == null ? .04 : hist;
    if (total <= 0 || turns <= 0) return 0;
    var bruta = total * (0.25 + p * turns);
    var fase = ((bruta % total) + total) % total;
    if (atual < 0) return Math.round(fase) % total;
    var prox = atual, delta = fase - prox;
    if (delta > total / 2) delta -= total;
    if (delta < -total / 2) delta += total;
    var limite = 0.5 + clamp(hist, 0, .35);
    while (delta > limite) { prox = (prox + 1) % total; delta -= 1; }
    while (delta < -limite) { prox = (prox - 1 + total) % total; delta += 1; }
    return prox;
  }
  function progressoDoIndice(indice, total, turns, atual) {
    if (total <= 0 || turns <= 0) return clamp(atual, 0, 1);
    var i = ((indice % total) + total) % total;
    var melhor = clamp(atual, 0, 1), menor = Infinity;
    for (var ciclo = Math.floor(-turns - 2); ciclo <= Math.ceil(turns + 2); ciclo++) {
      var p = (i / total - 0.25 - ciclo) / turns;
      if (p < 0 || p > 1) continue;
      var d = Math.abs(p - atual);
      if (d < menor) { menor = d; melhor = p; }
    }
    return isFinite(menor) ? melhor : clamp((i / total - 0.25) / turns, 0, 1);
  }

  var ancoraTopo = -Math.PI / 2;
  var arcoFoco = Math.PI * P.focusSpread;

  function aplicar(progressoBruto) {
    var p = sensibilidade(progressoBruto);
    var rotacao = -p * P.turns * Math.PI * 2;
    var foco = focoComHisterese(p, cartoes.length, P.turns, anterior);

    cartoes.forEach(function (cartao, i) {
      var base = (i / cartoes.length) * Math.PI * 2 - Math.PI;
      var theta = base + rotacao;
      var x = Math.cos(theta) * raio;
      var y = Math.sin(theta) * raio;
      var intensidade = clamp(distanciaAngular(theta, ancoraTopo) / arcoFoco, 0, 1);
      var escuro = clamp(intensidade * P.darknessStrength, 0, 1);
      var dessat = clamp(intensidade * P.saturationStrength, 0, 1);
      var desfoque = escuro * P.blur * motion;
      var picoBrilho = clamp(100 + P.brightnessBoost, 100, 220);
      var brilho = P.dim + (1 - escuro) * (picoBrilho - P.dim);
      var saturacao = P.minSaturation + (1 - dessat) * (100 - P.minSaturation);
      var escala = 1 - escuro * P.scaleEffect * motion;
      var deriva = clamp(x / raio, -1, 1);
      var profundidade = clamp((1 - intensidade) * 100, 0, 100);
      gsap.set(cartao, {
        x: x, y: y, xPercent: -50, yPercent: -50, z: profundidade,
        rotate: deriva * 8 * motion, scale: escala,
        filter: 'blur(' + desfoque.toFixed(2) + 'px) brightness(' + brilho.toFixed(1) + '%) saturate(' + saturacao.toFixed(1) + '%)',
        zIndex: Math.round(profundidade * 0.3)
      });
    });

    if (foco !== anterior) { anterior = foco; definirAtivo(foco); }
  }

  function definirAtivo(iAnel) {
    var i = unico(iAnel);
    ativo = i;
    subEl.textContent = ATIVOS[i].sub;
    botoes.forEach(function (b, j) {
      var d = Math.abs(j - i);
      b.setAttribute('aria-current', j === i ? 'true' : 'false');
      b.style.opacity = d === 0 ? 1 : d === 1 ? .58 : d === 2 ? .32 : .16;
      b.style.transform = d === 0 ? 'scale(1)' : 'scale(.96)';
    });
    centralizarTrilho();
  }

  function centralizarTrilho() {
    var ativoEl = botoes[ativo]; if (!ativoEl) return;
    var largura = trilhoVP.clientWidth;
    var primeiro = botoes[0], ultimo = botoes[botoes.length - 1];
    espIni.style.width = Math.max(0, largura / 2 - primeiro.offsetWidth / 2) + 'px';
    espFim.style.width = Math.max(0, largura / 2 - ultimo.offsetWidth / 2) + 'px';
    var centro = ativoEl.offsetLeft + ativoEl.offsetWidth / 2;
    var alvo = Math.round(largura / 2 - centro);
    if (trilho.scrollWidth <= largura) alvo = Math.round((largura - trilho.scrollWidth) / 2);
    else alvo = Math.round(clamp(alvo, largura - trilho.scrollWidth, 0));
    gsap.to(trilho, { x: alvo, duration: .62 * motion, ease: 'power4.out', overwrite: true });
  }

  var gatilho = null;
  function irPara(i) {
    if (!gatilho) return;
    var atual = clamp(gatilho.progress, 0, 1);
    var destino = null, menor = Infinity;
    var primeiraPosicao = (((i + DESLOC) % ATIVOS.length) + ATIVOS.length) % ATIVOS.length;
    for (var j = primeiraPosicao; j < ANEL.length; j += ATIVOS.length) {
      var cand = progressoDoIndice(j, ANEL.length, P.turns, atual);
      var d = Math.abs(cand - atual);
      if (d < menor) { menor = d; destino = cand; }
    }
    if (destino === null) return;
    var inicio = gatilho.start, faixa = gatilho.end - inicio;
    if (faixa <= 0) return;
    definirAtivo(i);
    var proxy = { s: inicio + atual * faixa };
    gsap.to(proxy, {
      s: inicio + destino * faixa, duration: .58 * motion, ease: 'power3.out', overwrite: true,
      onUpdate: function () {
        if (window.lenis) window.lenis.scrollTo(proxy.s, { immediate: true });
        else gatilho.scroll(proxy.s);
      }
    });
  }

  medir();
  aplicar(0);
  definirAtivo(DESLOC);

  gatilho = ScrollTrigger.create({
    trigger: roda, start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: function (self) { aplicar(self.progress); }
  });

  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(function () {
      medir(); aplicar(gatilho ? gatilho.progress : 0); centralizarTrilho(); ScrollTrigger.refresh();
    }, 160);
  });
})();
