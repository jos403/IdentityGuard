/* ================= TOAST NOTIFIKASI ================= */
function showToast(msg, type='info'){
  const c = document.getElementById('toastContainer');
  if(!c) return;
  const el = document.createElement('div');
  el.className = 'toast toast-' + type;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(()=>el.remove(), 3200);
}

/* ================= ANIMASI CENTANG SUKSES ================= */
function successCheckHTML(){
  return `<svg class="success-check" viewBox="0 0 60 60"><circle cx="30" cy="30" r="25"/><path d="M18 31l8 8 16-18"/></svg>`;
}

/* ================= GUARD HALAMAN DASHBOARD =================
   Belum login -> ke login.html.
   KECUALI DEV_MODE aktif: otomatis masuk dengan akun demo, supaya
   Live Server / Go Live di halaman mana pun tidak dilempar ke login. */
function requireLogin(){
  if(!getSession()){
    if(APP_CONFIG.DEV_MODE){
      ensureDemoUser();
      setSession('demo');
    } else {
      window.location.href = 'login.html';
      return null;
    }
  }
  return currentUser();
}

/* ================= HEADER DASHBOARD ================= */
function renderHeader(user){
  const g = document.getElementById('dashGreeting');
  const n = document.getElementById('dashNama');
  if(!g || !user) return;
  const jam = new Date().getHours();
  g.textContent = jam < 11 ? 'Selamat pagi' : jam < 15 ? 'Selamat siang' : jam < 18 ? 'Selamat sore' : 'Selamat malam';
  n.innerHTML = (user.nama || getSession()) + (APP_CONFIG.DEV_MODE ? ' <span class="dev-badge">DEV</span>' : '');

  const header = document.querySelector('.dash-header');
  if(header && !header.querySelector('.mini-avatar')){
    const a = document.createElement('a');
    a.href = 'profil.html';
    a.innerHTML = `<img class="mini-avatar" alt="Foto profil" src="${avatarUrl(user)}">`;
    header.insertBefore(a, header.firstChild);
  }
}

function handleLogout(){
  clearSession();
  window.location.href = 'login.html';
}
