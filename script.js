
(function(){
  'use strict';
  const videos = Array.from(document.querySelectorAll('.scene-video'));
  const scenes = Array.from(document.querySelectorAll('.scene'));
  const bar = document.getElementById('progressBar');
  const num = document.getElementById('progressNum');
  const label = document.getElementById('progressLabel');

  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const idx = scenes.indexOf(entry.target);
        if(num) num.textContent = String(idx+1).padStart(2,'0');
        if(label) label.textContent = entry.target.dataset.label || '';
        if(bar) bar.style.height = ((idx+1)/scenes.length*100)+'%';
        const video = entry.target.querySelector('video');
        videos.forEach(v=>{ if(v!==video) v.pause(); });
        if(video) video.play().catch(()=>{});
      }
    });
  },{threshold:.5});
  scenes.forEach(s=>io.observe(s));

  // Booking estimate
  const yacht = document.getElementById('yacht');
  const hours = document.getElementById('hours');
  const guests = document.getElementById('guests');
  const totalEl = document.getElementById('estimateTotal');
  const addons = Array.from(document.querySelectorAll('.addons input'));
  function estimate(){
    if(!yacht || !hours || !guests || !totalEl) return;
    const rate = Number(yacht.selectedOptions[0]?.dataset.rate || 0);
    const hrs = Math.max(1, Number(hours.value || 1));
    const g = Math.max(1, Number(guests.value || 1));
    let total = rate * hrs;
    addons.forEach(a=>{
      if(!a.checked) return;
      if(a.dataset.perguest) total += Number(a.dataset.perguest) * g;
      else total += Number(a.dataset.price || 0);
    });
    totalEl.textContent = 'AED ' + total.toLocaleString('en-AE');
  }
  [yacht,hours,guests,...addons].filter(Boolean).forEach(el=>el.addEventListener('change',estimate));
  [hours,guests].filter(Boolean).forEach(el=>el.addEventListener('input',estimate));
  estimate();

  // Contact chooser
  const modal = document.getElementById('contactModal');
  const openers = document.querySelectorAll('.js-contact-open');
  const closers = document.querySelectorAll('[data-contact-close]');
  let currentMessage = 'Hi STM Tiger Yachts, I would like to check availability.';
  function setContactLinks(message){
    currentMessage = message || currentMessage;
    const enc = encodeURIComponent(currentMessage);
    const pairs = [
      ['wa1','https://wa.me/971588512196?text='+enc],
      ['wa2','https://wa.me/971553144899?text='+enc],
      ['sms1','sms:+971588512196?body='+enc],
      ['sms2','sms:+971553144899?body='+enc]
    ];
    pairs.forEach(([id,href])=>{
      const el=document.getElementById(id);
      if(el) el.href=href;
    });
  }
  function openModal(message){
    if(!modal) return;
    setContactLinks(message);
    modal.hidden=false;
    modal.setAttribute('aria-hidden','false');
  }
  function closeModal(){
    if(!modal) return;
    modal.hidden=true;
    modal.setAttribute('aria-hidden','true');
  }
  openers.forEach(b=>b.addEventListener('click',()=>openModal()));
  closers.forEach(b=>b.addEventListener('click',closeModal));
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });

  // Clicking a yacht fills the booking select.
  document.querySelectorAll('[data-yacht]').forEach(link=>{
    link.addEventListener('click',()=>{
      const wanted = link.dataset.yacht;
      if(!yacht) return;
      Array.from(yacht.options).forEach(opt=>{
        if(opt.textContent.includes(wanted)) opt.selected=true;
      });
      estimate();
    });
  });

  // Booking form now composes the message, then lets user choose either
  // WhatsApp number or normal SMS to either number.
  const form = document.getElementById('bookingForm');
  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const selected = yacht?.selectedOptions[0]?.textContent || '';
      const date = document.getElementById('date')?.value || 'Not specified';
      const time = document.getElementById('time')?.value || 'Not specified';
      const hrs = document.getElementById('hours')?.value || 'Not specified';
      const g = document.getElementById('guests')?.value || 'Not specified';
      const exp = document.getElementById('experience')?.value || 'Private Cruise';
      const chosen = addons.filter(a=>a.checked).map(a=>a.dataset.name).join(', ') || 'None';
      const total = totalEl?.textContent || '';
      const msg = [
        'Hi STM Tiger Yachts,',
        '',
        'I would like to check yacht availability.',
        'Yacht: '+selected,
        'Date: '+date,
        'Time: '+time,
        'Hours: '+hrs,
        'Guests: '+g,
        'Occasion: '+exp,
        'Add-ons: '+chosen,
        'Estimated total: '+total
      ].join('\n');
      openModal(msg);
    });
  }
})();

/* Full-screen page-by-page navigation + 3D transition state */
(function(){
  'use strict';
  const story = document.getElementById('story');
  if(!story) return;
  const scenes = Array.from(story.querySelectorAll('.scene'));
  if(!scenes.length) return;

  let active = 0;
  let locked = false;
  let touchStartY = null;
  const DURATION = 930;

  function nearestIndex(){
    const center = story.scrollTop + story.clientHeight/2;
    let best = 0, dist = Infinity;
    scenes.forEach((s,i)=>{
      const c = s.offsetTop + s.offsetHeight/2;
      const d = Math.abs(c-center);
      if(d < dist){dist=d;best=i;}
    });
    return best;
  }

  function updateStates(index){
    active = Math.max(0,Math.min(scenes.length-1,index));
    scenes.forEach((s,i)=>{
      s.classList.toggle('is-active',i===active);
      s.classList.toggle('is-before',i<active);
      s.classList.toggle('is-after',i>active);
    });
  }

  function go(index){
    index = Math.max(0,Math.min(scenes.length-1,index));
    if(index===active && locked) return;
    locked = true;
    updateStates(index);
    story.scrollTo({top:scenes[index].offsetTop,behavior:'smooth'});
    window.setTimeout(()=>{locked=false;},DURATION);
  }

  // Keep anchor links working as exact page transitions.
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const target = document.querySelector(a.getAttribute('href'));
      if(!target) return;
      const idx = scenes.indexOf(target);
      if(idx >= 0){
        e.preventDefault();
        go(idx);
      }
    });
  });

  story.addEventListener('wheel',e=>{
    if(Math.abs(e.deltaY) < 18) return;
    e.preventDefault();
    if(locked) return;
    go(active + (e.deltaY > 0 ? 1 : -1));
  },{passive:false});

  story.addEventListener('touchstart',e=>{
    touchStartY = e.touches[0]?.clientY ?? null;
  },{passive:true});
  story.addEventListener('touchend',e=>{
    if(touchStartY===null || locked) return;
    const endY = e.changedTouches[0]?.clientY ?? touchStartY;
    const diff = touchStartY-endY;
    touchStartY=null;
    if(Math.abs(diff) > 55) go(active + (diff>0 ? 1 : -1));
  },{passive:true});

  document.addEventListener('keydown',e=>{
    if(locked) return;
    if(['ArrowDown','PageDown',' '].includes(e.key)){
      if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
      e.preventDefault();go(active+1);
    }else if(['ArrowUp','PageUp'].includes(e.key)){
      if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
      e.preventDefault();go(active-1);
    }else if(e.key==='Home'){
      e.preventDefault();go(0);
    }else if(e.key==='End'){
      e.preventDefault();go(scenes.length-1);
    }
  });

  // If browser/native snap leaves us between pages, settle to nearest page.
  let settleTimer;
  story.addEventListener('scroll',()=>{
    window.clearTimeout(settleTimer);
    settleTimer=window.setTimeout(()=>{
      if(locked) return;
      const n=nearestIndex();
      updateStates(n);
      const delta=Math.abs(story.scrollTop-scenes[n].offsetTop);
      if(delta>4) go(n);
    },110);
  },{passive:true});

  // Initial state and hash support.
  const hashTarget = location.hash && document.querySelector(location.hash);
  const hashIndex = hashTarget ? scenes.indexOf(hashTarget) : -1;
  updateStates(hashIndex>=0?hashIndex:0);
  requestAnimationFrame(()=>{
    if(hashIndex>=0) story.scrollTop=scenes[hashIndex].offsetTop;
    else story.scrollTop=0;
  });
})();
