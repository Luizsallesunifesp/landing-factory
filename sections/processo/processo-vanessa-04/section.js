(function(){
  var root=document.querySelector('[data-secao="processo-vanessa-04"]');
  if(!root)return;
  var m=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion'));
  if(isNaN(m))m=1;
  var els=[].slice.call(root.querySelectorAll('[data-reveal], [data-stagger] > *'));
  function show(el){el.classList.add('is-in');}
  if(m===0||!('IntersectionObserver' in window)){els.forEach(show);return;}
  root.querySelectorAll('[data-stagger]').forEach(function(g){
    [].forEach.call(g.children,function(c,i){c.style.transitionDelay=(i*90*m)+'ms';});
  });
  els.forEach(function(el){el.style.transform='translateY('+(26*m)+'px)';});
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){e.target.style.transform='';show(e.target);io.unobserve(e.target);}
    });
  },{threshold:0.15,rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(el){io.observe(el);});
})();
