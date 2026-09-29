/* Halaman transisi setelah verifikasi: hanya bisa dibuka bila wajah + liveness sudah lolos. */
(function(){
  if(!requireLogin()) return;
  const v = getVerifikasi();
  if(!(v.foto && v.liveness) && !APP_CONFIG.DEV_MODE){
    window.location.href = 'layanan.html?sesi=habis';
    return;
  }
  const fill = document.getElementById('loadFill'), pct = document.getElementById('loadPct');
  const tandai = (id, ms)=> setTimeout(()=>document.getElementById(id).classList.add('done'), ms);
  tandai('ls1', 500); tandai('ls2', 1500); tandai('ls3', 2600);

  const mulai = Date.now(), total = 3400;
  const iv = setInterval(()=>{
    const p = Math.min(100, Math.round((Date.now()-mulai)/total*100));
    fill.style.width = p + '%'; pct.textContent = p + '%';
    if(p >= 100){
      clearInterval(iv);
      setAksesLayanan();
      setTimeout(()=>{ window.location.href = 'portal-layanan.html'; }, 250);
    }
  }, 60);
})();
