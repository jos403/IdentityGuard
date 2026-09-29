/* ================= PORTAL LAYANAN FASKES ================= */
const { user: pUser } = requireLogin() || {};
let sesiIv = null;

const S = { tab:'cari', kota:'Semua', kelas:'Semua', layanan:null, q:'', f:null, step:1, svc:null, tgl:null, jam:null, rujukan:'', keluhan:'', error:'' };
const HARI = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
const HARI_PENUH = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

/* ---- Penjaga sesi: hanya boleh masuk setelah verifikasi (kecuali Mode Developer) ---- */
(function init(){
  if(!pUser) return;
  let exp = getAksesLayananExp();
  if(!exp){
    if(APP_CONFIG.DEV_MODE){ setAksesLayanan(); exp = getAksesLayananExp(); }
    else { window.location.href = 'layanan.html?sesi=habis'; return; }
  }
  renderHeader(pUser);
  const tampilJam = ()=>{ const d = new Date(getAksesLayananExp() || exp); document.getElementById('sesiJam').textContent = `${String(d.getHours()).padStart(2,'0')}.${String(d.getMinutes()).padStart(2,'0')}`; };
  tampilJam();
  sesiIv = setInterval(()=>{
    if(!getAksesLayananExp() && !APP_CONFIG.DEV_MODE){ clearInterval(sesiIv); window.location.href = 'layanan.html?sesi=habis'; }
  }, 15000);
  renderChips(); renderList(); renderTiket();
})();

/* ================= TAB ================= */
function gantiTab(t){
  S.tab = t;
  document.getElementById('tabCari').classList.toggle('hidden', t !== 'cari');
  document.getElementById('tabTiket').classList.toggle('hidden', t !== 'tiket');
  document.getElementById('tabBtnCari').classList.toggle('active', t === 'cari');
  document.getElementById('tabBtnTiket').classList.toggle('active', t === 'tiket');
  if(t === 'tiket') renderTiket();
}

/* ================= FILTER & DAFTAR FASKES ================= */
function renderChips(){
  const kota = ['Semua','Jakarta','Bogor'];
  document.getElementById('chipKota').innerHTML = kota.map(k=>{
    const n = k === 'Semua' ? FASKES.length : FASKES.filter(f=>f.kota === k).length;
    return `<button class="chip-f ${S.kota===k?'on':''}" onclick="S.kota='${k}'; renderChips(); renderList()">${k === 'Semua' ? '🇮🇩 Semua Kota' : '📍 ' + k} <em>${n}</em></button>`;
  }).join('');
  document.getElementById('chipLayanan').innerHTML =
    `<button class="chip-f ${!S.layanan?'on':''}" onclick="S.layanan=null; renderChips(); renderList()">Semua</button>` +
    CHIP_LAYANAN.map(id=>{ const l = LAYANAN_BY_ID[id]; return `<button class="chip-f ${S.layanan===id?'on':''}" onclick="S.layanan='${id}'; renderChips(); renderList()">${l.ikon} ${l.nama.replace(' (Radiologi)','').replace(' 24 Jam','').replace('Poli ','')}</button>`; }).join('');
}
function resetFilter(){
  S.kota = 'Semua'; S.kelas = 'Semua'; S.layanan = null; S.q = '';
  document.getElementById('cariInput').value = ''; document.getElementById('selKelas').value = 'Semua';
  renderChips(); renderList();
}
function daftarTersaring(){
  const q = S.q.trim().toLowerCase();
  return FASKES.filter(f =>
    (S.kota === 'Semua' || f.kota === S.kota) && (S.kelas === 'Semua' || f.kelas === S.kelas) &&
    (!S.layanan || f.layanan.includes(S.layanan)) && (!q || (f.nama + ' ' + f.area + ' ' + f.jenis).toLowerCase().includes(q))
  ).sort((a,b)=>a.kelas.localeCompare(b.kelas) || a.nama.localeCompare(b.nama));
}
function renderList(){
  const hasil = daftarTersaring();
  document.getElementById('hasilInfo').textContent = `Menampilkan ${hasil.length} fasilitas kesehatan` + (S.layanan ? ` dengan layanan ${LAYANAN_BY_ID[S.layanan].nama}` : '');
  const el = document.getElementById('listFaskes');
  if(!hasil.length){ el.innerHTML = '<div class="kosong">😕<p>Tidak ada fasilitas kesehatan yang cocok.<br>Coba ubah kata kunci atau filter.</p></div>'; return; }
  el.innerHTML = hasil.map(f=>{
    const populer = (S.layanan ? [S.layanan] : []).concat(['mri','ct','mcu','rawat_inap','poli_jantung','lab'].filter(x=>x!==S.layanan)).filter(x=>f.layanan.includes(x)).slice(0,3);
    const sisa = f.layanan.length - populer.length;
    return `
    <div class="fk-card" onclick="bukaFaskes('${f.id}')">
      <div class="fk-ikon kelas-${f.kelas}">${f.jenis === 'RS Khusus' ? '🏨' : '🏥'}</div>
      <div class="fk-info">
        <b>${f.nama}</b>
        <small>📍 ${f.area} · ${f.jenis}</small>
        <div class="fk-tags">
          <span class="tag tag-kelas">Kelas ${f.kelas}</span>
          ${f.igd ? '<span class="tag tag-igd">IGD 24 Jam</span>' : ''}
          ${populer.map(id=>`<span class="tag">${LAYANAN_BY_ID[id].ikon} ${LAYANAN_BY_ID[id].nama.replace(' (Radiologi)','').replace(' 24 Jam','')}</span>`).join('')}
          ${sisa > 0 ? `<span class="tag tag-more">+${sisa} layanan</span>` : ''}
        </div>
      </div>
      <span class="fk-arrow">›</span>
    </div>`;
  }).join('');
}

/* ================= SHEET: DETAIL & PEMESANAN (3 langkah) ================= */
function bukaFaskes(id){
  S.f = FASKES.find(f=>f.id === id);
  S.step = 1; S.svc = S.layanan && S.f.layanan.includes(S.layanan) ? S.layanan : null;
  S.tgl = null; S.jam = null; S.rujukan = ''; S.keluhan = ''; S.error = '';
  document.getElementById('sheet').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderSheet();
}
function tutupSheet(){
  document.getElementById('sheet').classList.add('hidden');
  document.body.style.overflow = '';
}
function tanggalPilihan(){
  const arr = []; const d0 = new Date();
  for(let i=0; i<8; i++){ const d = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate()+i); arr.push({ iso:isoLokal(d), d, minggu:d.getDay()===0 }); }
  return arr;
}
function jamTersedia(jam, tglIso){
  if(tglIso !== isoLokal(new Date())) return true;
  return parseInt(jam) > new Date().getHours();
}

function renderSheet(){
  const f = S.f, svc = S.svc ? LAYANAN_BY_ID[S.svc] : null;
  const langkah = ['Layanan','Jadwal','Konfirmasi'].map((t,i)=>`<div class="sp ${S.step===i+1?'on':''} ${S.step>i+1?'ok':''}"><i>${S.step>i+1?'✓':i+1}</i><span>${t}</span></div>`).join('<div class="sp-line"></div>');
  let isi = '', foot = '';

  if(S.step === 1){
    const grup = URUTAN_KATEGORI.map(k=>{
      const items = f.layanan.map(id=>LAYANAN_BY_ID[id]).filter(l=>l.kat === k);
      if(!items.length) return '';
      return `<div class="svc-group"><small>${k}</small>${items.map(l=>`
        <button class="svc-row ${S.svc===l.id?'sel':''}" onclick="S.svc='${l.id}'; renderSheet()">
          <span class="svc-ikon">${l.ikon}</span>
          <span class="svc-nama">${l.nama}<small>${l.rujukan ? 'Perlu surat rujukan' : 'Tanpa surat rujukan'}</small></span>
          <span class="svc-radio"></span>
        </button>`).join('')}</div>`;
    }).join('');
    isi = `<h5>Pilih layanan yang dibutuhkan</h5>${grup}`;
    foot = `<button class="btn btn-outline" onclick="tutupSheet()">Tutup</button><button class="btn btn-primary" ${S.svc?'':'disabled'} onclick="S.step=2; S.error=''; renderSheet()">Lanjut →</button>`;
  }

  if(S.step === 2){
    if(svc.id === 'igd'){
      isi = `<div class="info-igd">🚑 <b>IGD melayani 24 jam</b> tanpa jadwal. Nomor antrean akan diterbitkan untuk hari ini dan Anda dapat langsung datang.</div>`;
    } else {
      const tgls = tanggalPilihan();
      isi = `<h5>Pilih tanggal kunjungan</h5><div class="date-row">${tgls.map(t=>`
        <button class="date-chip ${S.tgl===t.iso?'sel':''}" ${t.minggu?'disabled':''} onclick="S.tgl='${t.iso}'; S.jam=null; renderSheet()">
          <small>${HARI[t.d.getDay()]}</small><b>${t.d.getDate()}</b><small>${BULAN[t.d.getMonth()].slice(0,3)}</small></button>`).join('')}</div>
        <p class="hint">Layanan poliklinik &amp; penunjang tidak tersedia pada hari Minggu.</p>`;
      if(S.tgl){
        isi += `<h5>Pilih jam kedatangan</h5><div class="slot-grid">${JAM_PRAKTIK.map(j=>{
          const sisa = sisaKuota(f.id, svc.id, S.tgl, j), ok = sisa > 0 && jamTersedia(j, S.tgl);
          return `<button class="slot ${S.jam===j?'sel':''}" ${ok?'':'disabled'} onclick="S.jam='${j}'; renderSheet()"><b>${j}</b><small>${ok ? 'Sisa ' + sisa : (sisa===0?'Penuh':'Lewat')}</small></button>`;
        }).join('')}</div>`;
      }
    }
    if(svc.rujukan){
      isi += `<h5>Nomor surat rujukan</h5>
        <div class="ruj-row"><input id="inpRujukan" class="field" placeholder="Contoh: 0101R0010226Y000123" value="${S.rujukan}" oninput="S.rujukan=this.value.trim().toUpperCase()">
        <button class="btn btn-outline btn-sm" onclick="isiContohRujukan()">Isi contoh</button></div>
        <p class="hint">Surat rujukan diterbitkan dokter di FKTP. Tidak diperlukan untuk kondisi gawat darurat.</p>`;
    }
    isi += `<h5>Keluhan / catatan (opsional)</h5><textarea id="inpKeluhan" class="field" rows="2" placeholder="Tuliskan keluhan singkat…" oninput="S.keluhan=this.value">${S.keluhan}</textarea>`;
    foot = `<button class="btn btn-outline" onclick="S.step=1; renderSheet()">← Kembali</button><button class="btn btn-primary" onclick="lanjutKonfirmasi()">Lanjut →</button>`;
  }

  if(S.step === 3){
    const tglTeks = svc.id==='igd' ? 'Hari ini (' + formatTanggal(isoLokal(new Date())) + ')' : `${HARI_PENUH[new Date(S.tgl+'T00:00:00').getDay()]}, ${formatTanggal(S.tgl)}`;
    isi = `<h5>Periksa kembali pesanan Anda</h5>
      <div class="ringkas">
        <div class="baris"><span>Fasilitas kesehatan</span><b>${f.nama}</b></div>
        <div class="baris"><span>Wilayah</span><b>${f.area}</b></div>
        <div class="baris"><span>Layanan</span><b>${svc.ikon} ${svc.nama}</b></div>
        <div class="baris"><span>Tanggal</span><b>${tglTeks}</b></div>
        <div class="baris"><span>Jam</span><b>${svc.id==='igd' ? 'Langsung datang' : S.jam + ' WIB'}</b></div>
        ${svc.rujukan ? `<div class="baris"><span>No. rujukan</span><b class="mono">${S.rujukan}</b></div>` : ''}
        <div class="baris"><span>Peserta</span><b>${pUser.nama}</b></div>
        <div class="baris"><span>No. kartu</span><b class="mono">${nomorKartu(pUser.nik)}</b></div>
      </div>
      ${S.error ? `<div class="alert-err">🛡️ <div><b>Permintaan ditolak oleh ProtectAI</b><br>${S.error}</div></div>` : `<div class="alert-info">🛡️ Sistem memeriksa kewajaran layanan untuk mencegah pelayanan yang tidak diperlukan.</div>`}`;
    foot = `<button class="btn btn-outline" onclick="S.step=2; S.error=''; renderSheet()">← Ubah</button><button class="btn btn-primary" onclick="ambilAntrean()">Ambil Antrean</button>`;
  }

  document.getElementById('sheetBody').innerHTML = `
    <div class="sh-head">
      <div class="fk-ikon kelas-${f.kelas}">${f.jenis==='RS Khusus'?'🏨':'🏥'}</div>
      <div><b>${f.nama}</b><small>📍 ${f.area}</small>
        <div class="fk-tags"><span class="tag tag-kelas">Kelas ${f.kelas}</span><span class="tag">${f.jenis}</span>${f.igd?'<span class="tag tag-igd">IGD 24 Jam</span>':''}</div></div>
    </div>
    <div class="sp-row">${langkah}</div>
    <div class="sh-body">${isi}</div>
    <div class="sh-foot">${foot}</div>`;
}

function isiContohRujukan(){
  S.rujukan = '0101R00102' + String(Math.floor(Math.random()*90)+10) + 'Y' + String(Math.floor(Math.random()*900000)+100000);
  document.getElementById('inpRujukan').value = S.rujukan;
}
function lanjutKonfirmasi(){
  const svc = LAYANAN_BY_ID[S.svc];
  if(svc.id !== 'igd' && (!S.tgl || !S.jam)){ showToast('Pilih tanggal dan jam kunjungan terlebih dahulu.', 'warn'); return; }
  if(svc.rujukan && !/^[A-Z0-9]{10,}$/.test(S.rujukan)){ showToast('Nomor surat rujukan tidak valid (minimal 10 huruf/angka).', 'warn'); return; }
  S.step = 3; S.error = ''; renderSheet();
}

/* ================= PEMERIKSAAN KEWAJARAN (anti pelayanan tidak perlu) ================= */
function cekKewajaran(user, svc, tglIso){
  const cd = Math.max(svc.cd || 0, 1);
  for(const t of user.kunjungan){
    if(t.layananId !== svc.id || t.status === 'Dibatalkan') continue;
    const selisih = Math.abs((new Date(tglIso) - new Date(t.tanggal)) / 864e5);
    if(selisih < cd){
      return cd === 1
        ? `Anda sudah memiliki tiket <b>${svc.nama}</b> pada tanggal yang sama (${formatTanggal(t.tanggal)}) di ${t.faskesNama}. Satu layanan yang sama hanya dapat diajukan satu kali per hari.`
        : `Terdeteksi pemeriksaan <b>${svc.nama}</b> pada ${formatTanggal(t.tanggal)} di ${t.faskesNama}. Untuk mencegah pelayanan yang tidak perlu, layanan ini baru dapat diajukan kembali setelah jeda ${cd} hari, kecuali ada indikasi medis dari dokter.`;
    }
  }
  return null;
}

function ambilAntrean(){
  if(!getAksesLayananExp() && !APP_CONFIG.DEV_MODE){ window.location.href = 'layanan.html?sesi=habis'; return; }
  const { db, username, user } = currentUser();
  const svc = LAYANAN_BY_ID[S.svc], f = S.f;
  const tgl = svc.id === 'igd' ? isoLokal(new Date()) : S.tgl;

  const tolak = cekKewajaran(user, svc, tgl);
  if(tolak){ S.error = tolak; renderSheet(); showToast('Permintaan ditolak: layanan tidak wajar.', 'err'); return; }

  const jam = svc.id === 'igd' ? 'Langsung' : S.jam;
  const nomor = svc.awalan + '-' + String(1 + hashStr(f.id + svc.id + tgl + jam) % 89).padStart(3,'0');
  const tiket = {
    id: 'TKT-' + Math.floor(100000 + Math.random()*900000), nomor,
    faskesId: f.id, faskesNama: f.nama, area: f.area, kelasRS: f.kelas,
    layananId: svc.id, layananNama: svc.nama, ikon: svc.ikon,
    tanggal: tgl, jam, rujukan: svc.rujukan ? S.rujukan : '-', keluhan: S.keluhan.trim(),
    status: 'Terjadwal', dibuat: Date.now()
  };
  user.kunjungan.push(tiket);
  db.users[username] = user; saveDB(db);

  tutupSheet(); renderTiket(); renderList();
  showToast('Antrean berhasil diambil!', 'ok');
  tampilTiket(tiket.id);
}

/* ================= TIKET ================= */
function statusTampil(t){
  if(t.status === 'Dibatalkan') return 'Dibatalkan';
  return t.tanggal < isoLokal(new Date()) ? 'Selesai' : 'Terjadwal';
}
function renderTiket(){
  const { user } = currentUser();
  const daftar = user.kunjungan.slice().sort((a,b)=>b.dibuat - a.dibuat);
  document.getElementById('jmlTiket').textContent = user.kunjungan.filter(t=>statusTampil(t)==='Terjadwal').length;
  const el = document.getElementById('listTiket');
  if(!daftar.length){ el.innerHTML = '<div class="kosong">🎫<p>Belum ada tiket antrean.<br>Pilih fasilitas kesehatan di tab <b>Cari Faskes</b> untuk memulai.</p></div>'; return; }
  el.innerHTML = daftar.map(t=>{
    const st = statusTampil(t);
    return `<div class="tk-card ${st==='Dibatalkan'?'batal':''}">
      <div class="tk-top"><span class="tk-nomor">${t.nomor}</span><span class="tk-status st-${st}">${st}</span></div>
      <b>${t.ikon} ${t.layananNama}</b>
      <small>🏥 ${t.faskesNama}</small>
      <small>📅 ${formatTanggal(t.tanggal)} · ⏰ ${t.jam === 'Langsung' ? 'Langsung datang' : t.jam + ' WIB'}</small>
      <div class="tk-act"><button class="btn btn-outline btn-sm" onclick="tampilTiket('${t.id}')">Lihat Tiket</button>
      ${st==='Terjadwal' ? `<button class="btn btn-danger btn-sm" onclick="batalkanTiket('${t.id}')">Batalkan</button>` : ''}</div>
    </div>`;
  }).join('');
}
function batalkanTiket(id){
  if(!confirm('Batalkan tiket antrean ini?')) return;
  const { db, username, user } = currentUser();
  const t = user.kunjungan.find(x=>x.id === id); if(!t) return;
  t.status = 'Dibatalkan'; db.users[username] = user; saveDB(db);
  renderTiket(); showToast('Tiket dibatalkan.', 'info');
}

/* QR ilustrasi (pola deterministik dari kode tiket; bukan QR sungguhan) */
function qrSvg(teks, ukuran){
  const N = 21, c = ukuran / N; let seed = hashStr(teks);
  const rnd = ()=>{ seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const kotakFinder = (x,y)=>(x<7&&y<7)||(x>=N-7&&y<7)||(x<7&&y>=N-7);
  const finderOn = (x,y)=>{ const fx = x<7?x:x-(N-7), fy = y<7?y:y-(N-7); const d = Math.max(Math.abs(fx-3), Math.abs(fy-3)); return d===3 || d<=1; };
  let r = '';
  for(let y=0;y<N;y++) for(let x=0;x<N;x++){
    const on = kotakFinder(x,y) ? finderOn(x,y) : rnd() > 0.52;
    if(on) r += `<rect x="${(x*c).toFixed(2)}" y="${(y*c).toFixed(2)}" width="${(c+0.4).toFixed(2)}" height="${(c+0.4).toFixed(2)}"/>`;
  }
  return `<svg viewBox="0 0 ${ukuran} ${ukuran}" width="${ukuran}" height="${ukuran}" fill="#0f172a">${r}</svg>`;
}
function tampilTiket(id){
  const { user } = currentUser();
  const t = user.kunjungan.find(x=>x.id === id); if(!t) return;
  document.getElementById('tiketBody').innerHTML = `
    <div class="tiket">
      <div class="tiket-head"><small>TIKET ANTREAN · PROTECTAI</small><b>${t.faskesNama}</b><small>📍 ${t.area}</small></div>
      <div class="tiket-nomor"><small>NOMOR ANTREAN</small><b>${t.nomor}</b></div>
      <div class="tiket-sobek"></div>
      <div class="tiket-isi">
        <div class="baris"><span>Layanan</span><b>${t.ikon} ${t.layananNama}</b></div>
        <div class="baris"><span>Tanggal</span><b>${formatTanggal(t.tanggal)}</b></div>
        <div class="baris"><span>Jam</span><b>${t.jam === 'Langsung' ? 'Langsung datang' : t.jam + ' WIB'}</b></div>
        <div class="baris"><span>Peserta</span><b>${user.nama}</b></div>
        <div class="baris"><span>NIK</span><b>${maskNik(user.nik)}</b></div>
        <div class="baris"><span>No. kartu</span><b class="mono">${nomorKartu(user.nik)}</b></div>
        <div class="baris"><span>No. rujukan</span><b class="mono">${t.rujukan}</b></div>
        <div class="baris"><span>Status</span><b>${statusTampil(t)}</b></div>
      </div>
      <div class="tiket-qr">${qrSvg(t.id + t.nomor, 128)}<small>${t.id}</small></div>
      <p class="tiket-note">Tunjukkan tiket &amp; KTP di loket pendaftaran. Kode di atas hanya ilustrasi (simulasi).</p>
    </div>`;
  document.getElementById('tiketModal').classList.remove('hidden');
}
function tutupTiket(){ document.getElementById('tiketModal').classList.add('hidden'); }
