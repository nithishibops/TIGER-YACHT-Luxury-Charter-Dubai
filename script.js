
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
