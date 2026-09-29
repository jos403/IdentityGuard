/* ================= SIMULASI DATABASE (localStorage) =================
   Catatan untuk proposal: pada implementasi nyata, data akun, descriptor
   wajah, dan device ID HARUS disimpan di server terenkripsi. */

const DB_KEY = 'protectai_db_v1';
const SESSION_KEY = 'protectai_session';
const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function loadDB(){ const raw = localStorage.getItem(DB_KEY); return raw ? JSON.parse(raw) : { users: {} }; }
function saveDB(db){ localStorage.setItem(DB_KEY, JSON.stringify(db)); }

function getDeviceId(){
  let id = localStorage.getItem('protectai_device_id');
  if(!id){ id = 'DEV-' + Math.random().toString(36).slice(2,10).toUpperCase(); localStorage.setItem('protectai_device_id', id); }
  return id;
}
async function hashPassword(pw){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

/* ---- Sesi login: disimpan di localStorage (bertahan antar tab & reload) + masa berlaku ---- */
function setSession(username){
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username, exp: Date.now() + APP_CONFIG.SESSION_TTL_JAM*3600*1000 }));
}
function getSession(){
  try{
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if(s && s.exp > Date.now()) return s.username;
  }catch(e){}
  localStorage.removeItem(SESSION_KEY);
  return null;
}
function clearSession(){
  ['protectai_session','protectai_verif','protectai_akses'].forEach(k=>localStorage.removeItem(k));
}

function normalisasiUser(u){
  if(!u) return u;
  u.paymentHistory = u.paymentHistory || [];
  u.kunjungan = u.kunjungan || [];
  u.lockInfo = u.lockInfo || { lockCount:0, failStreak:0, lockUntil:0, graceUntil:0 };
  return u;
}
function currentUser(){
  const db = loadDB();
  const username = getSession();
  const user = username ? normalisasiUser(db.users[username]) : null;
  return { db, username, user };
}

/* ---- Akun demo untuk Mode Developer ---- */
function ensureDemoUser(){
  const db = loadDB();
  if(!db.users.demo){
    const now = Date.now();
    db.users.demo = {
      passwordHash:'', deviceId:getDeviceId(), isDemo:true,
      nik:'3271010101980001', nama:'Peserta Demo', ttl:'1998-08-17',
      alamat:'Jl. Contoh No. 1, Kota Bogor', hp:'081234567890',
      faskes:'Puskesmas Bogor Utara', kelas:'II',
      selfieDescriptor:null, ktpDescriptor:null, fotoProfil:null,
      dibuat:now, lastLogin:now,
      paymentHistory:[{ id:'TRX-100001', ts:now-30*864e5, tanggal:new Date(now-30*864e5).toLocaleString('id-ID'), metode:'BCA Mobile', nominal:100000, kelas:'II', status:'Berhasil' }],
      kunjungan:[], lockInfo:{ lockCount:0, failStreak:0, lockUntil:0, graceUntil:0 }
    };
    saveDB(db);
  }
  return 'demo';
}

/* ---- Verifikasi wajah + liveness (syarat masuk portal layanan) ---- */
function getVerifikasi(){
  try{
    const v = JSON.parse(localStorage.getItem('protectai_verif') || 'null');
    if(v && v.username === getSession() && v.exp > Date.now()) return v;
  }catch(e){}
  return { foto:false, liveness:false, exp:0 };
}
function setVerifikasi(patch){
  const cur = getVerifikasi();
  const v = { username:getSession(), foto:!!cur.foto, liveness:!!cur.liveness, exp:Date.now()+APP_CONFIG.VERIFIKASI_TTL_MENIT*60000, ...patch };
  localStorage.setItem('protectai_verif', JSON.stringify(v));
  return v;
}
function setAksesLayanan(){
  localStorage.setItem('protectai_akses', JSON.stringify({ username:getSession(), exp:Date.now()+APP_CONFIG.AKSES_LAYANAN_MENIT*60000 }));
}
function getAksesLayananExp(){
  try{
    const a = JSON.parse(localStorage.getItem('protectai_akses') || 'null');
    if(a && a.username === getSession() && a.exp > Date.now()) return a.exp;
  }catch(e){}
  return 0;
}

/* ---- Format & helper tampilan ---- */
function nominalKelas(kelas){ return { I:150000, II:100000, III:35000 }[kelas] || 35000; } // Kelas III: Rp42.000 - subsidi Rp7.000
function formatRupiah(n){ return 'Rp' + Number(n).toLocaleString('id-ID'); }
function formatTanggal(iso){ if(!iso) return '-'; const [y,m,d] = iso.split('-').map(Number); return `${d} ${BULAN[m-1]} ${y}`; }
function formatWaktu(ts){
  const d = new Date(ts);
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2,'0')}.${String(d.getMinutes()).padStart(2,'0')}`;
}
function hitungUsia(iso){
  if(!iso) return '-';
  const l = new Date(iso), n = new Date();
  let u = n.getFullYear() - l.getFullYear();
  if(n.getMonth() < l.getMonth() || (n.getMonth() === l.getMonth() && n.getDate() < l.getDate())) u--;
  return u + ' tahun';
}
function maskNik(nik){ return nik ? nik.slice(0,4) + '••••••••' + nik.slice(-4) : '-'; }
function nomorKartu(nik){
  let h = 0; for(const c of String(nik||'0')) h = (h*31 + c.charCodeAt(0)) % 1e13;
  const s = String(h).padStart(13,'0');
  return `${s.slice(0,4)} ${s.slice(4,8)} ${s.slice(8,12)} ${s.slice(12)}`;
}
function isoLokal(d){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function avatarUrl(user){
  if(user && user.fotoProfil) return user.fotoProfil;
  const ini = ((user && user.nama) || 'P').trim().split(/\s+/).slice(0,2).map(s=>s[0].toUpperCase()).join('');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#4f46e5'/><stop offset='1' stop-color='#ec4899'/></linearGradient></defs><rect width='100' height='100' fill='url(#g)'/><text x='50' y='64' font-size='40' font-family='Arial' font-weight='700' fill='white' text-anchor='middle'>${ini}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
