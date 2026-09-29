const { user: obatUser } = requireLogin() || {};
if(obatUser) renderHeader(obatUser);

function cekObat(){
  const [nama, maks] = document.getElementById('obatSelect').value.split('|');
  const jumlah = parseInt(document.getElementById('jumlahObat').value || '0');
  const statusEl = document.getElementById('obatStatus');
  if(jumlah <= 0){ statusEl.textContent = 'Masukkan jumlah obat.'; return; }
  if(jumlah > parseInt(maks)){
    statusEl.innerHTML = `<span class="badge badge-err">❌ Permintaan (${jumlah}) melebihi batas wajar ${nama}. Sistem menyarankan maksimal ${maks}.</span>`;
  } else {
    statusEl.innerHTML = successCheckHTML() + `<div class="badge badge-ok">Jumlah ${jumlah} untuk ${nama} sesuai batas wajar (maks ${maks}).</div>`;
  }
}
