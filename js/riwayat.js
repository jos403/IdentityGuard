const { user: riwayatUser } = requireLogin() || {};
if(riwayatUser){
  renderHeader(riwayatUser);
  document.getElementById('tagihanNominal').textContent = formatRupiah(nominalKelas(riwayatUser.kelas));
  renderHistory(riwayatUser);
}

function renderHistory(user){
  const list = document.getElementById('historyList');
  if(!user.paymentHistory.length){
    list.innerHTML = '<p class="hint">Belum ada riwayat pembayaran.</p>'; return;
  }
  list.innerHTML = user.paymentHistory.slice().reverse().map((trx,i)=>`
    <div class="history-item" onclick="showReceipt(${user.paymentHistory.length-1-i})">
      <div><b>${trx.metode}</b><small>${trx.tanggal}</small></div>
      <div style="text-align:right"><b>${formatRupiah(trx.nominal)}</b><br><span class="badge badge-ok" style="padding:2px 8px;">${trx.status}</span></div>
    </div>`).join('');
}

async function bayarIuran(){
  const { db, username, user } = currentUser();
  const metode = document.getElementById('metodeBayar').value;
  const nominal = nominalKelas(user.kelas);
  const statusEl = document.getElementById('bayarStatus');
  statusEl.textContent = 'Memproses pembayaran...';
  await new Promise(r=>setTimeout(r,1200));

  const trx = {
    id: 'TRX-' + Math.floor(100000 + Math.random()*900000),
    ts: Date.now(),
    tanggal: new Date().toLocaleString('id-ID'),
    metode, nominal, kelas: user.kelas, status: 'Berhasil'
  };
  user.paymentHistory.push(trx);
  db.users[username] = user;
  saveDB(db);

  statusEl.innerHTML = successCheckHTML() + `<div class="badge badge-ok">Pembayaran berhasil (${trx.id})</div>`;
  showToast('Pembayaran berhasil dicatat', 'ok');
  renderHistory(user);
}

function showReceipt(index){
  const { user } = currentUser();
  const trx = user.paymentHistory[index];
  document.getElementById('receiptContent').innerHTML = `
    <h3 style="text-align:center;margin-top:0;">🛡️ ProtectAI</h3>
    <p style="text-align:center;color:#888;margin-top:-8px;">Struk Pembayaran Iuran JKN</p>
    <div class="r-row"><span>No. Transaksi</span><b>${trx.id}</b></div>
    <div class="r-row"><span>Tanggal</span><b>${trx.tanggal}</b></div>
    <div class="r-row"><span>Nama</span><b>${user.nama}</b></div>
    <div class="r-row"><span>NIK</span><b>${user.nik}</b></div>
    <div class="r-row"><span>Kelas Rawat</span><b>Kelas ${trx.kelas}</b></div>
    <div class="r-row"><span>Metode</span><b>${trx.metode}</b></div>
    <div class="r-row"><span>Nominal</span><b>${formatRupiah(trx.nominal)}</b></div>
    <div class="r-row"><span>Status</span><b style="color:#16a34a">${trx.status}</b></div>`;
  document.getElementById('receiptModal').classList.remove('hidden');
}
function closeReceiptModal(){ document.getElementById('receiptModal').classList.add('hidden'); }
