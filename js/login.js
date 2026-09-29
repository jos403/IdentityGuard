let loginFaceDescriptor = null;

// Tombol akun demo hanya muncul saat DEV_MODE aktif (lihat js/config.js)
if(APP_CONFIG.DEV_MODE) document.getElementById('btnDemo').classList.remove('hidden');
function masukDemo(){
  ensureDemoUser();
  setSession('demo');
  window.location.href = 'loading.html';
}

function onLoginFaceCaptured(canvas){
  document.getElementById('loginFacePreview').innerHTML = `<img src="${canvas.toDataURL()}">`;
  getDescriptorFromInput(canvas).then(desc=>{
    if(!desc){ showToast('Wajah tidak terdeteksi, coba lagi.', 'err'); loginFaceDescriptor = null; return; }
    loginFaceDescriptor = desc;
    showToast('Wajah berhasil ditangkap', 'ok');
  });
}

async function handleLogin(){
  const statusEl = document.getElementById('loginStatus');
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  const db = loadDB();
  const user = db.users[username];
  if(!user){
    statusEl.innerHTML = '<span class="badge badge-err">Akun tidak ditemukan. Silakan registrasi dahulu.</span>'; return;
  }
  const passHash = await hashPassword(password);
  if(passHash !== user.passwordHash){
    statusEl.innerHTML = '<span class="badge badge-err">Password salah.</span>'; return;
  }
  if(user.deviceId !== getDeviceId()){
    statusEl.innerHTML = '<span class="badge badge-err">🔒 Device tidak dikenali. Akun ini hanya bisa diakses dari device yang terdaftar saat registrasi.</span>'; return;
  }
  if(!loginFaceDescriptor){
    statusEl.innerHTML = '<span class="badge badge-warn">Silakan scan wajah terlebih dahulu.</span>'; return;
  }
  const distance = faceapi.euclideanDistance(loginFaceDescriptor, Float32Array.from(user.selfieDescriptor));
  if(distance >= 0.6){
    statusEl.innerHTML = `<span class="badge badge-err">❌ Wajah tidak cocok dengan data terdaftar (jarak=${distance.toFixed(2)}).</span>`; return;
  }

  statusEl.innerHTML = successCheckHTML() + '<div class="badge badge-ok">Identitas terverifikasi</div>';
  user.lastLogin = Date.now();
  db.users[username] = user;
  saveDB(db);
  setSession(username);
  setTimeout(()=>{ window.location.href = 'loading.html'; }, 700);
}
