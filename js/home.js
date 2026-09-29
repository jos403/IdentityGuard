const { user } = requireLogin() || {};
if(user) renderHeader(user);

document.getElementById('kontakList').innerHTML = KONTAK_PENTING.map(k=>`
  <div class="kontak-item"><div class="kontak-ikon">${k.ikon}</div><div><b>${k.judul}</b><small>${k.ket}</small></div></div>`).join('');
