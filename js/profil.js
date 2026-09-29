const { user: profilUser, username: profilUsername } = requireLogin() || {};
let nikTampil = false;

function setText(id, teks){ document.getElementById(id).textContent = teks; }

if(profilUser){
  const foto = avatarUrl(profilUser);
  document.getElementById('profilFoto').src = foto;
  document.getElementById('kartuFoto').src = foto;

  setText('profilNama', profilUser.nama || profilUsername);
  setText('profilUsername', '@' + profilUsername);
  setText('chipKelas', 'Kelas ' + profilUser.kelas);

  // status iuran bulan ini: ada pembayaran pada bulan & tahun berjalan?
  const sekarang = new Date();
  const lunas = profilUser.paymentHistory.some(t=>{
    if(!t.ts) return false;
    const d = new Date(t.ts);
    return d.getMonth() === sekarang.getMonth() && d.getFullYear() === sekarang.getFullYear();
  });
  const chipStatus = document.getElementById('chipStatus');
  chipStatus.textContent = lunas ? '✅ Iuran Lunas' : '⏳ Belum Bayar Bulan Ini';
  chipStatus.classList.add(lunas ? 'chip-ok' : 'chip-warn');

  // kartu digital
  const noKartu = nomorKartu(profilUser.nik);
  setText('kartuNomor', noKartu);
  setText('kartuNama', (profilUser.nama || profilUsername).toUpperCase());
  setText('kartuKelas', 'Kelas ' + profilUser.kelas);
  setText('kartuFaskes', profilUser.faskes || '-');

  // statistik
  setText('statBayar', profilUser.paymentHistory.length);
  setText('statTiket', profilUser.kunjungan.filter(t=>t.status !== 'Dibatalkan').length);
  setText('statUsia', hitungUsia(profilUser.ttl).replace(' tahun',' th'));

  // data pribadi
  setText('dNama', profilUser.nama || '-');
  setText('dNik', maskNik(profilUser.nik));
  setText('dTtl', formatTanggal(profilUser.ttl));
  setText('dAlamat', profilUser.alamat || '-');
  setText('dHp', profilUser.hp || '-');

  // data kepesertaan
  setText('dKartu', noKartu);
  setText('dFaskes', profilUser.faskes || '-');
  setText('dKelas', 'Kelas ' + profilUser.kelas);
  setText('dIuran', formatRupiah(nominalKelas(profilUser.kelas)));
  setText('dStatusIuran', lunas ? 'Lunas' : 'Belum dibayar');
  setText('dBergabung', profilUser.dibuat ? formatWaktu(profilUser.dibuat) : '-');

  // keamanan
  setText('dPerangkat', profilUser.deviceId);
  setText('dTerakhir', profilUser.lastLogin ? formatWaktu(profilUser.lastLogin) : 'Baru saja');
}

function toggleNik(){
  nikTampil = !nikTampil;
  setText('dNik', nikTampil ? profilUser.nik : maskNik(profilUser.nik));
  document.getElementById('btnEye').textContent = nikTampil ? '🙈' : '👁️';
}
