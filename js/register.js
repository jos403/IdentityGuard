let regKtpDescriptor = null;
let regSelfieDescriptor = null;
let regSelfieCanvas = null;

// Potong selfie menjadi persegi 320x320 (JPEG ringan) untuk dipakai sebagai foto profil
function buatFotoProfil(canvas){
  const sisi = Math.min(canvas.width, canvas.height);
  const out = document.createElement('canvas');
  out.width = out.height = 320;
  out.getContext('2d').drawImage(canvas, (canvas.width-sisi)/2, (canvas.height-sisi)/2, sisi, sisi, 0, 0, 320, 320);
  return out.toDataURL('image/jpeg', 0.85);
}

document.getElementById('regKtpInput').addEventListener('change', async (e)=>{
  const file = e.target.files[0];
  if(!file) return;
  const img = document.getElementById('regKtpPreview');
  img.src = URL.createObjectURL(file);
  img.classList.remove('hidden');
  await new Promise(r=>img.onload=r);

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
  canvas.getContext('2d').drawImage(img,0,0);

  const statusEl = document.getElementById('regKtpStatus');
  if(isBlurry(canvas)){
    statusEl.innerHTML = '<span class="badge badge-warn">⚠️ Foto KTP buram, unggah ulang.</span>';
    regKtpDescriptor = null; return;
  }
  if(!modelsReady){ statusEl.textContent = 'Model AI belum siap, tunggu sebentar.'; return; }
  const desc = await getDescriptorFromInput(img);
  if(!desc){
    statusEl.innerHTML = '<span class="badge badge-err">❌ Wajah tidak terdeteksi pada KTP.</span>';
  } else {
    regKtpDescriptor = desc;
    statusEl.innerHTML = '<span class="badge badge-ok">✅ Wajah KTP terdeteksi jelas.</span>';
  }
});

function onRegSelfieCaptured(canvas){
  const statusEl = document.getElementById('regSelfieStatus');
  const preview = document.getElementById('regSelfiePreview');
  preview.innerHTML = `<img src="${canvas.toDataURL()}">`;
  regSelfieCanvas = canvas;

  if(isBlurry(canvas)){
    statusEl.innerHTML = '<span class="badge badge-warn">⚠️ Selfie buram, ambil ulang.</span>';
    regSelfieDescriptor = null; return;
  }
  getDescriptorFromInput(canvas).then(desc=>{
    if(!desc){
      statusEl.innerHTML = '<span class="badge badge-err">❌ Wajah tidak terdeteksi, ambil ulang.</span>';
    } else {
      regSelfieDescriptor = desc;
      statusEl.innerHTML = '<span class="badge badge-ok">✅ Selfie jelas & wajah terdeteksi.</span>';
    }
  });
}

async function handleRegistrasi(){
  const result = document.getElementById('regStatus');
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  const nik = document.getElementById('regNik').value.trim();

  if(!username || !password || nik.length !== 16 || !/^[0-9]+$/.test(nik)){
    result.innerHTML = '<span class="badge badge-err">Lengkapi username, password, dan NIK 16 digit yang valid.</span>'; return;
  }
  if(!regKtpDescriptor || !regSelfieDescriptor){
    result.innerHTML = '<span class="badge badge-err">Lengkapi foto KTP & selfie yang jelas terlebih dahulu.</span>'; return;
  }
  const db = loadDB();
  if(db.users[username]){
    result.innerHTML = '<span class="badge badge-err">Username sudah terdaftar, gunakan username lain.</span>'; return;
  }

  const distance = faceapi.euclideanDistance(regKtpDescriptor, regSelfieDescriptor);
  result.textContent = 'Mengirim data ke server Dukcapil untuk verifikasi (simulasi)...';
  await new Promise(r=>setTimeout(r,1500));
  const pemerintahValid = Math.random() > 0.05; // simulasi 95% berhasil

  if(distance >= 0.6){
    result.innerHTML = `<span class="badge badge-err">❌ Wajah KTP & selfie tidak cocok (jarak=${distance.toFixed(2)}). Registrasi ditolak.</span>`;
    return;
  }
  if(!pemerintahValid){
    result.innerHTML = '<span class="badge badge-err">❌ Data tidak ditemukan pada database pemerintah (simulasi). Registrasi ditolak.</span>';
    return;
  }

  db.users[username] = {
    passwordHash: await hashPassword(password),
    deviceId: getDeviceId(),
    nik, nama: document.getElementById('regNama').value.trim(),
    ttl: document.getElementById('regTgl').value,
    alamat: document.getElementById('regAlamat').value.trim(),
    hp: document.getElementById('regHp').value.trim(),
    faskes: document.getElementById('regFaskes').value,
    kelas: document.getElementById('regKelas').value,
    selfieDescriptor: Array.from(regSelfieDescriptor),
    ktpDescriptor: Array.from(regKtpDescriptor),
    fotoProfil: buatFotoProfil(regSelfieCanvas),
    dibuat: Date.now(), lastLogin: null,
    paymentHistory: [],
    kunjungan: [],
    lockInfo: { lockCount:0, failStreak:0, lockUntil:0, graceUntil:0 }
  };
  saveDB(db);
  result.innerHTML = '<span class="badge badge-ok">✅ Registrasi berhasil! Silakan login.</span>';
  showToast('Registrasi berhasil, silakan login', 'ok');
  setTimeout(()=> window.location.href = 'login.html', 1200);
}
