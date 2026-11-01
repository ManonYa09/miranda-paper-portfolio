/* Progressive keyboard, touch, resize and navigation recovery. */
(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('reduced-motion');
  document.documentElement.classList.toggle('reduced-motion',reduced);
  window.mirandaReducedMotion=reduced;
  const activate = () => {
    const controls=[['.nav-link','Open navigation'],['.nav.work .nav-block.r','Open navigation'],['.gallery-open','Open project gallery'],['.gallery-close','Close project gallery'],['.aw1-title','Expand award details'],['.brand-inner','Expand client details']];
    controls.forEach(([selector,label])=>document.querySelectorAll(selector).forEach(el=>{
      if(el.tagName==='A'||el.tagName==='BUTTON')return;
      el.setAttribute('role','button');el.tabIndex=0;el.setAttribute('aria-label',label);
      el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});
    }));
    const menus=[...document.querySelectorAll('nav .menu')];
    menus.forEach((menu,i)=>{menu.id ||= `navigation-${i}`;menu.setAttribute('aria-label','Main navigation');});
    document.querySelectorAll('.nav-link,.nav.work .nav-block.r').forEach(control=>{
      const menu=control.closest('nav')?.querySelector('.menu');if(!menu)return;
      control.setAttribute('aria-controls',menu.id);control.setAttribute('aria-expanded','false');
    });
    const updateScroll=()=>window.locomotive?.update();
    document.fonts.ready.then(updateScroll);
    document.querySelectorAll('img').forEach(img=>{if(!img.complete)img.addEventListener('load',updateScroll,{once:true});});
    let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(updateScroll,120);});
    // Ignore clicks that finish a drag, without changing the original drag physics.
    document.querySelectorAll('[data-butter-slidable]').forEach(strip=>{
      let point=null,dragged=false;
      strip.addEventListener('pointerdown',e=>{point=[e.clientX,e.clientY];dragged=false;},{passive:true});
      strip.addEventListener('pointermove',e=>{if(point&&Math.abs(e.clientX-point[0])>8)dragged=true;},{passive:true});
      strip.addEventListener('pointerup',()=>{point=null;});
      strip.addEventListener('pointercancel',()=>{point=null;});
      strip.addEventListener('click',e=>{if(dragged){e.preventDefault();e.stopImmediatePropagation();dragged=false;}},true);
    });
    document.querySelectorAll('.aw-block').forEach(card=>{
      card.tabIndex=0;
      card.addEventListener('focus',()=>{if(!reduced)card.dispatchEvent(new MouseEvent('mouseover',{bubbles:true}));});
      card.addEventListener('blur',()=>{if(!reduced)card.dispatchEvent(new MouseEvent('mouseout',{bubbles:true}));});
    });
    const horizontal=document.querySelector('[data-scroll-direction=horizontal]');
    if(horizontal&&reduced){horizontal.tabIndex=0;horizontal.setAttribute('aria-label','Featured work, scroll horizontally to browse');}
    const gallery=document.querySelector('.gallery');
    if(gallery){
      gallery.setAttribute('role','dialog');gallery.setAttribute('aria-label','Project image gallery');gallery.setAttribute('aria-modal','true');
      document.querySelector('.gallery-open')?.addEventListener('click',()=>setTimeout(()=>document.querySelector('.gallery-close')?.focus(),reduced?0:600));
    }
    document.addEventListener('keydown',e=>{
      const activeMenu=menus.find(m=>m.getAttribute('aria-hidden')==='false');
      const openGallery=gallery&&getComputedStyle(gallery).display!=='none'?gallery:null;
      if(e.key==='Escape'){
        if(openGallery){document.querySelector('.gallery-close')?.click();document.querySelector('.gallery-open')?.focus();}
        else if(activeMenu)(activeMenu.closest('nav')?.querySelector('.nav-link') || activeMenu.closest('nav')?.querySelector('.nav-block.r'))?.click();
      }
      const modal=openGallery||activeMenu;
      if(e.key==='Tab'&&modal){
        const elements=[...modal.querySelectorAll('a[href],button,[tabindex="0"]')].filter(el=>el.getClientRects().length);
        if(activeMenu){const close=activeMenu.closest('nav').querySelector('.nav-link') || activeMenu.closest('nav').querySelector('.nav-block.r');if(close)elements.unshift(close);}
        const first=elements[0],last=elements.at(-1);
        if(e.shiftKey&&(document.activeElement===first||!modal.contains(document.activeElement))){e.preventDefault();last?.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
      }
    });
    if(reduced){
      window.locomotive?.destroy();window.locomotive=null;
      window.Webflow?.require('ix2')?.destroy();
      window.gsap?.globalTimeline.clear();
      document.documentElement.classList.remove('no-scroll','has-scroll-smooth','has-scroll-init');
      const main=document.querySelector('.main');if(main){main.style.transform='none';main.style.opacity='1';}
      document.querySelector('#app')?.classList.add('appear');
      // Gallery state needs an immediate equivalent when the animation engine is disabled.
      document.querySelector('.gallery-open')?.addEventListener('click',()=>{gallery.style.display='block';gallery.querySelector('.gallery-box').style.transform='none';gallery.querySelector('.gallery-overlay').style.opacity='1';});
      document.querySelector('.gallery-close')?.addEventListener('click',()=>{gallery.style.display='none';});
    }
    // Never leave content inaccessible if a GPU/module fails.
    setTimeout(()=>{document.querySelector('#app')?.classList.add('appear');document.documentElement.classList.remove('no-scroll');},5500);
    addEventListener('pageshow',e=>{if(e.persisted){document.documentElement.classList.remove('menu-locked','no-scroll');document.querySelector('#app')?.classList.add('appear');window.locomotive?.start();}});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',activate,{once:true});else activate();
})();
