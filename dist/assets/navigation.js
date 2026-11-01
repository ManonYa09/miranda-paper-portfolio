/* Keep navigation atomic while retaining the reference's Webflow menu motion. */
(() => {
  let open=false,locked=false,menuTimer,unlockTimer;
  const root=document.documentElement;
  const isReduced=()=>window.mirandaReducedMotion;
  const effectFor=nav=>nav?.classList.contains('work')?window.workPaperCurtainEffect:window.paperCurtainEffect;
  const toggleMenu=(control)=>{
    const nav=control.closest('nav'),menu=nav?.querySelector('.menu');if(!menu)return;
    clearTimeout(menuTimer);clearTimeout(unlockTimer);open=!open;locked=true;
    const effect=effectFor(nav);
    root.classList.toggle('menu-locked',open);
    control.setAttribute('aria-expanded',String(open));control.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    menu.setAttribute('aria-hidden',String(!open));
    if(open){
      menu.style.display='flex';window.locomotive?.stop();
      if(!isReduced())effect?.in();
      menuTimer=setTimeout(()=>menu.querySelector('a')?.focus({preventScroll:true}),isReduced()?0:900);
    }else{
      if(!isReduced())effect?.out();
      menuTimer=setTimeout(()=>{menu.style.display='none';control.focus({preventScroll:true});},isReduced()?0:400);
      window.locomotive?.start();
    }
    unlockTimer=setTimeout(()=>{locked=false;},isReduced()?0:650);
  };
  document.addEventListener('click',e=>{
    const control=e.target.closest('.nav-link,.nav.work .nav-block.r');
    if(!control)return;
    if(locked){e.preventDefault();e.stopImmediatePropagation();return;}
    toggleMenu(control);
  },true);
  document.addEventListener('click',async e=>{
    const link=e.target.closest('a[href]');if(!link||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;
    const dest=new URL(link.href,location.href);
    if(dest.origin!==location.origin||link.target==='_blank'||link.hasAttribute('download'))return;
    if(dest.pathname===location.pathname&&dest.hash)return;
    if(link.getAttribute('href')==='#'){e.preventDefault();return;}
    if(link.classList.contains('back-all')||isReduced())return;
    e.preventDefault();if(locked)return;locked=true;
    const nav=link.closest('nav')||document.querySelector('nav.nav'),effect=effectFor(nav);
    if(!effect){location.assign(dest.href);return;}
    let done=false;
    const finish=()=>{if(done)return;done=true;clearTimeout(fallback);document.body.removeEventListener('paper-curtain',finish);location.assign(dest.href);};
    const fallback=setTimeout(finish,2600);
    document.body.addEventListener('paper-curtain',finish,{once:true});
    try{
      const color=link.dataset.color||'#1d1d1b';
      if(open){effect.curtain.setBackground(color,1);effect.out();
        nav?.querySelectorAll('.nav-head,.nav-block,.menu-line,.paper-background').forEach(el=>window.gsap?.to(el,{opacity:0,duration:.6,ease:'expo.out'}));
      }else{
        effect.curtain.setColor(color,1);effect.curtain.uniforms.uHorizontal.value=0;
        const image=link.querySelector('[data-image]')?.getAttribute('data-image');
        if(image)await Promise.race([effect.curtain.setImage(image),new Promise(resolve=>setTimeout(resolve,450))]);
        effect.canvas.style.transform='rotate(180deg)';effect.curtain.setInverted(true);
        const canvas=nav?.querySelector('.gl-canvas');if(canvas)canvas.style.zIndex='9999';effect.in();
      }
    }catch{finish();}
  });
  addEventListener('pageshow',e=>{if(e.persisted){locked=false;open=false;location.reload();}});
})();
