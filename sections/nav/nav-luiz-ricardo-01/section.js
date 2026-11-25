(function(){
  var nav = document.querySelector('[data-secao="nav-luiz-ricardo-01"]');
  if(!nav) return;
  var burger = nav.querySelector('.nav-luiz-ricardo-01__burger');
  var sheet = nav.querySelector('.nav-luiz-ricardo-01__sheet');

  /* estado "rolou": fundo de vidro ao descer a página */
  var onScroll = function(){ nav.classList.toggle('scrolled', window.scrollY > 24); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* menu do celular (as animações de CSS já escalam por --motion; com 0 ficam instantâneas) */
  if(!burger || !sheet) return;
  var lastFocus = null;
  var setMenu = function(open){
    sheet.classList.toggle('open', open);
    nav.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if(open){
      sheet.removeAttribute('inert');
      lastFocus = document.activeElement;
      var first = sheet.querySelector('a');
      if(first) setTimeout(function(){ first.focus(); }, 80);
    } else {
      sheet.setAttribute('inert', '');
      if(lastFocus) lastFocus.focus();
    }
  };
  burger.addEventListener('click', function(){ setMenu(!sheet.classList.contains('open')); });
  sheet.addEventListener('click', function(ev){
    if(ev.target.closest('a') || ev.target === sheet) setMenu(false);
  });
  document.addEventListener('keydown', function(ev){
    if(ev.key === 'Escape' && sheet.classList.contains('open')) setMenu(false);
  });
  window.addEventListener('resize', function(){
    if(window.innerWidth > 900 && sheet.classList.contains('open')) setMenu(false);
  });
})();
