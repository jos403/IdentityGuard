/* ================= SLIDER INFORMASI =================
   - otomatis geser tiap 4 detik (berhenti saat disentuh / di-hover / tab tidak aktif)
   - bisa digeser manual: sentuh (HP/iPad) maupun drag mouse (laptop)
   - tombol panah, indikator titik, dan loop tanpa putus */
(function(){
  const track = document.getElementById('sliderTrack');
  const dotsEl = document.getElementById('sliderDots');
  const root = document.getElementById('infoSlider');
  if(!track) return;

  const n = INFO_SLIDES.length;
  const slideHTML = (s,i)=>`
    <div class="slide">
      <article class="slide-card">
        <img class="slide-img" src="${s.gambar}" alt="${s.judul}" draggable="false">
        <div class="slide-body">
          <span class="slide-tag">${s.tag}</span>
          <h4>${s.judul}</h4>
          <p>${s.ringkas}</p>
          <button class="slide-more" data-id="${s.id}">Baca selengkapnya →</button>
        </div>
      </article>
    </div>`;
  // klon slide terakhir di awal & slide pertama di akhir agar loop mulus
  track.innerHTML = slideHTML(INFO_SLIDES[n-1]) + INFO_SLIDES.map(slideHTML).join('') + slideHTML(INFO_SLIDES[0]);
  dotsEl.innerHTML = INFO_SLIDES.map((_,i)=>`<button class="dot" data-i="${i}" aria-label="Slide ${i+1}"></button>`).join('');

  let index = 1, dragging = false, startX = 0, dx = 0, moved = false, timer = null, animating = false;
  const viewport = track.parentElement;

  function setDots(){ const real = ((index-1)%n+n)%n; dotsEl.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active', i===real)); }
  function pos(animate, extraPx=0){
    track.style.transition = animate ? 'transform .5s cubic-bezier(.22,.8,.3,1)' : 'none';
    track.style.transform = `translateX(calc(${-index*100}% + ${extraPx}px))`;
    setDots();
  }
  function goTo(i){
    if(animating) return;
    animating = true; index = i; pos(true);
    setTimeout(()=>{ // lompat diam-diam dari klon ke slide asli
      if(index === 0) index = n; else if(index === n+1) index = 1;
      pos(false); animating = false;
    }, 520);
  }
  const next = ()=>goTo(index+1), prev = ()=>goTo(index-1);

  function play(){ stop(); timer = setInterval(next, 4000); }
  function stop(){ if(timer){ clearInterval(timer); timer = null; } }

  // --- drag / swipe (pointer events: sentuh + mouse) ---
  viewport.addEventListener('pointerdown', e=>{
    if(animating || e.target.closest('.slide-more')) return;
    dragging = true; moved = false; startX = e.clientX; dx = 0; stop();
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener('pointermove', e=>{
    if(!dragging) return;
    dx = e.clientX - startX;
    if(Math.abs(dx) > 5) moved = true;
    pos(false, dx);
  });
  function endDrag(){
    if(!dragging) return;
    dragging = false;
    const batas = viewport.clientWidth * 0.18;
    if(dx < -batas) next(); else if(dx > batas) prev(); else pos(true);
    play();
  }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', ()=>{ if(!dragging) play(); });
  document.addEventListener('visibilitychange', ()=> document.hidden ? stop() : play());

  root.querySelector('.slider-arrow.prev').addEventListener('click', ()=>{ prev(); play(); });
  root.querySelector('.slider-arrow.next').addEventListener('click', ()=>{ next(); play(); });
  dotsEl.addEventListener('click', e=>{ const b = e.target.closest('.dot'); if(b){ goTo(+b.dataset.i+1); play(); } });

  // klik "Baca selengkapnya" (diabaikan bila sedang drag)
  track.addEventListener('click', e=>{
    const b = e.target.closest('.slide-more');
    if(b && !moved) bukaInfo(b.dataset.id);
  });

  pos(false); play();
})();

/* ================= MODAL DETAIL INFORMASI ================= */
function bukaInfo(id){
  const s = INFO_SLIDES.find(x=>x.id===id);
  if(!s) return;
  const bagian = s.detail.map(d=>`
    <h5>${d.h}</h5>
    ${d.p ? `<p>${d.p}</p>` : ''}
    ${d.list ? `<ul>${d.list.map(li=>`<li>${li}</li>`).join('')}</ul>` : ''}`).join('');
  document.getElementById('infoModalBody').innerHTML = `
    <img class="info-hero" src="${s.gambar}" alt="${s.judul}">
    <span class="slide-tag">${s.tag}</span>
    <h3>${s.judul}</h3>
    ${bagian}
    <p class="info-foot">Informasi bersifat umum dan dapat berubah sesuai regulasi. Rujukan resmi: bpjs-kesehatan.go.id · Care Center 165.</p>`;
  document.getElementById('infoModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function tutupInfo(){
  document.getElementById('infoModal').classList.add('hidden');
  document.body.style.overflow = '';
}
