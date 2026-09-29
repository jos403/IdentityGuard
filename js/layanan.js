const { user: layananUser } = requireLogin() || {};
if(layananUser) renderHeader(layananUser);
document.getElementById('ttlVerif').textContent = APP_CONFIG.VERIFIKASI_TTL_MENIT;
if(APP_CONFIG.DEV_MODE) document.getElementById('btnLewati').classList.remove('hidden');
if(location.search.includes('sesi=habis')) showToast('Sesi layanan berakhir. Silakan verifikasi ulang.', 'warn');

/* ================= STEPPER: status langkah tersimpan (bertahan saat pindah halaman) ================= */
function renderSteps(){
  const v = getVerifikasi();
  const set = (id, kelas)=>{ const el = document.getElementById(id); el.classList.remove('done','aktif','kunci'); el.classList.add(kelas); };
  set('nodeFoto', v.foto ? 'done' : 'aktif');
  set('nodeLive', v.liveness ? 'done' : v.foto ? 'aktif' : 'kunci');
  set('nodeLanjut', (v.foto && v.liveness) ? 'aktif' : 'kunci');
  document.getElementById('lineA').classList.toggle('on', v.foto);
  document.getElementById('lineB').classList.toggle('on', v.foto && v.liveness);
  document.getElementById('stepFoto').classList.toggle('selesai', v.foto);
  document.getElementById('liveness').classList.toggle('selesai', v.liveness);
  document.getElementById('liveness').classList.toggle('terkunci', !v.foto);
  document.getElementById('stepLanjut').classList.toggle('terkunci', !(v.foto && v.liveness));
  document.getElementById('btnLanjut').disabled = !(v.foto && v.liveness);

  if(v.foto) document.getElementById('layananStatus').innerHTML = successCheckHTML() + '<div class="badge badge-ok">Wajah terverifikasi</div>';
  if(v.liveness) document.getElementById('liveStatus').innerHTML = successCheckHTML() + '<div class="badge badge-ok">Keaslian terverifikasi</div>';
  if(v.foto && v.liveness){
    const jam = new Date(v.exp);
    document.getElementById('verifInfo').textContent = `Verifikasi berlaku hingga pukul ${String(jam.getHours()).padStart(2,'0')}.${String(jam.getMinutes()).padStart(2,'0')}.`;
  }
}
renderSteps();

if(window.location.hash === '#liveness'){
  setTimeout(()=>{
    document.getElementById('liveness').scrollIntoView({behavior:'smooth'});
    if(!getVerifikasi().foto) showToast('Selesaikan langkah 1 (verifikasi wajah) terlebih dahulu.', 'info');
  }, 300);
}

function lanjutKePortal(){ window.location.href = 'loading-layanan.html'; }
function lewatiVerifikasi(){
  setVerifikasi({ foto:true, liveness:true });
  showToast('Mode Developer: verifikasi dilewati', 'warn');
  renderSteps();
}

/* ================= LANGKAH 1: VERIFIKASI WAJAH + LOCKOUT (tersimpan di database) ================= */
function lockDurationSeconds(n){ return 60 + (n-1)*90; } // rumus: aₙ = 60 + (n-1) × 90 detik

function getLockInfo(user){ return user.lockInfo || { lockCount:0, failStreak:0, lockUntil:0, graceUntil:0 }; }
function saveLockInfo(lockInfo){
  const { db, username, user } = currentUser();
  user.lockInfo = lockInfo;
  db.users[username] = user;
  saveDB(db);
}
(function restoreLockState(){
  if(!layananUser) return;
  const li = getLockInfo(layananUser);
  if(Date.now() < li.lockUntil) runLockCountdown(li);
})();

function onLayananCaptured(canvas){ verifikasiOnTheSpot(canvas); }

async function verifikasiOnTheSpot(canvas){
  const statusEl = document.getElementById('layananStatus');
  const { user } = currentUser();
  const lockInfo = getLockInfo(user);
  const now = Date.now();

  if(now < lockInfo.lockUntil){
    statusEl.innerHTML = `<span class="badge badge-err">🔒 Layanan terkunci, coba lagi dalam ${Math.ceil((lockInfo.lockUntil-now)/1000)} detik.</span>`;
    return;
  }
  if(!user.selfieDescriptor){
    statusEl.innerHTML = '<span class="badge badge-warn">Akun demo tidak memiliki data wajah. Gunakan tombol "Lewati Verifikasi (Mode Developer)" atau daftar akun baru.</span>';
    return;
  }
  const desc = await getDescriptorFromInput(canvas);
  if(!desc){ statusEl.innerHTML = '<span class="badge badge-err">Wajah tidak terdeteksi, coba lagi.</span>'; return; }

  const distance = faceapi.euclideanDistance(desc, Float32Array.from(user.selfieDescriptor));
  if(distance < 0.6){
    lockInfo.failStreak = 0;
    saveLockInfo(lockInfo);
    setVerifikasi({ foto:true });
    showToast('Wajah cocok. Lanjut ke langkah 2.', 'ok');
    renderSteps();
  } else {
    lockInfo.failStreak++;
    statusEl.innerHTML = `<span class="badge badge-warn">❌ Wajah tidak cocok (percobaan ${lockInfo.failStreak}/5).</span>`;
    if(lockInfo.failStreak >= 5){
      if(now > lockInfo.graceUntil) lockInfo.lockCount = 0;
      lockInfo.lockCount++;
      const durasi = lockDurationSeconds(lockInfo.lockCount);
      lockInfo.lockUntil = now + durasi*1000;
      lockInfo.graceUntil = lockInfo.lockUntil + 5*60*1000;
      lockInfo.failStreak = 0;
      statusEl.innerHTML = `<span class="badge badge-err">🔒 Gagal 5 kali. Layanan dikunci ${durasi} detik (kunci ke-${lockInfo.lockCount}).</span>`;
      runLockCountdown(lockInfo);
    }
    saveLockInfo(lockInfo);
  }
}

function runLockCountdown(lockInfo){
  const info = document.getElementById('lockInfo');
  const btn = document.getElementById('btnFoto');
  btn.disabled = true;
  const iv = setInterval(()=>{
    const sisa = Math.ceil((lockInfo.lockUntil-Date.now())/1000);
    if(sisa <= 0){ info.textContent = ''; btn.disabled = false; clearInterval(iv); return; }
    info.textContent = `Sisa waktu kunci: ${sisa} detik (rumus: aₙ = 60 + (n-1)×90, n = kunci ke-${lockInfo.lockCount}).`;
  }, 500);
}

/* ================= LANGKAH 2: LIVENESS CHECK (EKSPRESI) — MODUL TERPISAH ================= */
let liveStream = null, liveInterval = null;
const EMOJI_MAP = { happy:'😊 Senyum', surprised:'😲 Kaget', angry:'😠 Marah', neutral:'😐 Netral' };

async function startLivenessChallenge(){
  const statusEl = document.getElementById('liveStatus');
  const emojiEl = document.getElementById('targetEmoji');
  const timerEl = document.getElementById('liveTimer');
  if(!getVerifikasi().foto){ showToast('Selesaikan langkah 1 (verifikasi wajah) terlebih dahulu.', 'warn'); return; }
  if(!modelsReady){ statusEl.textContent = 'Model AI belum siap.'; return; }

  if(!liveStream){
    try{ liveStream = await navigator.mediaDevices.getUserMedia({video:true}); }
    catch(e){ showToast('Tidak bisa mengakses kamera. Periksa izin browser.', 'err'); return; }
    document.getElementById('liveVideo').srcObject = liveStream;
    await new Promise(r=>setTimeout(r,600));
  }
  const keys = Object.keys(EMOJI_MAP);
  const target = keys[Math.floor(Math.random()*keys.length)];
  emojiEl.textContent = EMOJI_MAP[target];
  statusEl.innerHTML = `Tunjukkan ekspresi <b>${EMOJI_MAP[target]}</b> ke kamera...`;

  let waktu = 10;
  timerEl.textContent = `Sisa waktu: ${waktu} dtk`;
  clearInterval(liveInterval);
  const video = document.getElementById('liveVideo');

  liveInterval = setInterval(async ()=>{
    waktu--;
    timerEl.textContent = `Sisa waktu: ${waktu} dtk`;
    const det = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks(true).withFaceExpressions();
    if(det && det.expressions[target] > 0.7){
      clearInterval(liveInterval);
      timerEl.textContent = ''; emojiEl.textContent = '';
      liveStream.getTracks().forEach(t=>t.stop()); liveStream = null;
      setVerifikasi({ liveness:true });
      showToast('Keaslian terverifikasi. Anda dapat melanjutkan.', 'ok');
      renderSteps();
    } else if(waktu <= 0){
      clearInterval(liveInterval);
      statusEl.innerHTML = '<span class="badge badge-err">❌ Waktu habis, ekspresi tidak sesuai. Coba lagi.</span>';
      timerEl.textContent = '';
    }
  }, 700);
}
