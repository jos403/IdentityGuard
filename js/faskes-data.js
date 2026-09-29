/* ================= DATA FASILITAS KESEHATAN (CONTOH) =================
   PENTING: daftar ini adalah DATA CONTOH untuk prototype. Nama rumah sakit nyata dipakai
   sebagai ilustrasi, tetapi kelas, layanan, dan status kerja sama BPJS bukan data resmi.
   Pada implementasi nyata, data diambil dari API resmi faskes bekerja sama BPJS Kesehatan. */

/* ---- Katalog layanan: cd = jeda minimal (hari) sebelum layanan yang sama boleh diajukan lagi ---- */
const KATALOG_LAYANAN = [
  { id:'igd',            nama:'IGD 24 Jam',                     ikon:'🚑', kat:'Gawat Darurat',           rujukan:false, cd:0,  awalan:'E' },
  { id:'rawat_inap',     nama:'Rawat Inap',                     ikon:'🛏️', kat:'Rawat Inap',              rujukan:true,  cd:0,  awalan:'R' },
  { id:'poli_dalam',     nama:'Poli Penyakit Dalam',            ikon:'🩺', kat:'Rawat Jalan (Poliklinik)', rujukan:true,  cd:0,  awalan:'A' },
  { id:'poli_anak',      nama:'Poli Anak',                      ikon:'🧒', kat:'Rawat Jalan (Poliklinik)', rujukan:true,  cd:0,  awalan:'A' },
  { id:'poli_bedah',     nama:'Poli Bedah',                     ikon:'🏥', kat:'Rawat Jalan (Poliklinik)', rujukan:true,  cd:0,  awalan:'A' },
  { id:'poli_kandungan', nama:'Poli Kandungan & Kebidanan',     ikon:'🤰', kat:'Rawat Jalan (Poliklinik)', rujukan:true,  cd:0,  awalan:'A' },
  { id:'poli_jantung',   nama:'Poli Jantung',                   ikon:'❤️', kat:'Rawat Jalan (Poliklinik)', rujukan:true,  cd:0,  awalan:'A' },
  { id:'poli_mata',      nama:'Poli Mata',                      ikon:'👁️', kat:'Rawat Jalan (Poliklinik)', rujukan:true,  cd:0,  awalan:'A' },
  { id:'poli_tht',       nama:'Poli THT',                       ikon:'👂', kat:'Rawat Jalan (Poliklinik)', rujukan:true,  cd:0,  awalan:'A' },
  { id:'poli_saraf',     nama:'Poli Saraf',                     ikon:'🧠', kat:'Rawat Jalan (Poliklinik)', rujukan:true,  cd:0,  awalan:'A' },
  { id:'poli_kulit',     nama:'Poli Kulit & Kelamin',           ikon:'🧴', kat:'Rawat Jalan (Poliklinik)', rujukan:true,  cd:0,  awalan:'A' },
  { id:'poli_gigi',      nama:'Poli Gigi & Mulut',              ikon:'🦷', kat:'Rawat Jalan (Poliklinik)', rujukan:true,  cd:0,  awalan:'A' },
  { id:'poli_ortopedi',  nama:'Poli Ortopedi',                  ikon:'🦴', kat:'Rawat Jalan (Poliklinik)', rujukan:true,  cd:0,  awalan:'A' },
  { id:'poli_paru',      nama:'Poli Paru',                      ikon:'🫁', kat:'Rawat Jalan (Poliklinik)', rujukan:true,  cd:0,  awalan:'A' },
  { id:'poli_jiwa',      nama:'Poli Kesehatan Jiwa',            ikon:'🧘', kat:'Rawat Jalan (Poliklinik)', rujukan:true,  cd:0,  awalan:'A' },
  { id:'poli_onkologi',  nama:'Poli Onkologi (Kanker)',         ikon:'🎗️', kat:'Rawat Jalan (Poliklinik)', rujukan:true,  cd:0,  awalan:'A' },
  { id:'mri',            nama:'MRI Scan',                       ikon:'🧲', kat:'Pemeriksaan Penunjang',   rujukan:true,  cd:30, awalan:'B' },
  { id:'ct',             nama:'CT Scan',                        ikon:'🩻', kat:'Pemeriksaan Penunjang',   rujukan:true,  cd:30, awalan:'B' },
  { id:'rontgen',        nama:'Rontgen (Radiologi)',            ikon:'📷', kat:'Pemeriksaan Penunjang',   rujukan:true,  cd:7,  awalan:'B' },
  { id:'usg',            nama:'USG',                            ikon:'🔊', kat:'Pemeriksaan Penunjang',   rujukan:true,  cd:7,  awalan:'B' },
  { id:'lab',            nama:'Laboratorium',                   ikon:'🧪', kat:'Pemeriksaan Penunjang',   rujukan:true,  cd:3,  awalan:'B' },
  { id:'ekg',            nama:'EKG / Rekam Jantung',            ikon:'💓', kat:'Pemeriksaan Penunjang',   rujukan:true,  cd:7,  awalan:'B' },
  { id:'mcu',            nama:'Medical Check-Up',               ikon:'📋', kat:'Skrining & Pencegahan',   rujukan:false, cd:180,awalan:'C' },
  { id:'vaksin',         nama:'Vaksinasi & Imunisasi',          ikon:'💉', kat:'Skrining & Pencegahan',   rujukan:false, cd:1,  awalan:'C' },
  { id:'fisio',          nama:'Fisioterapi / Rehabilitasi Medik',ikon:'🏃', kat:'Terapi & Rehabilitasi',   rujukan:true,  cd:1,  awalan:'T' },
  { id:'hd',             nama:'Hemodialisis (Cuci Darah)',      ikon:'💧', kat:'Terapi & Rehabilitasi',   rujukan:true,  cd:1,  awalan:'T' }
];
const URUTAN_KATEGORI = ['Gawat Darurat','Rawat Jalan (Poliklinik)','Pemeriksaan Penunjang','Skrining & Pencegahan','Terapi & Rehabilitasi','Rawat Inap'];

const _POLI = ['poli_dalam','poli_anak','poli_bedah','poli_kandungan','poli_jantung','poli_mata','poli_tht','poli_saraf','poli_kulit','poli_gigi','poli_ortopedi','poli_paru'];
const PRESET = {
  A:['igd','rawat_inap',..._POLI,'mri','ct','rontgen','usg','lab','ekg','mcu','fisio','hd','vaksin'],
  B:['igd','rawat_inap',..._POLI.filter(x=>x!=='poli_ortopedi'),'ct','rontgen','usg','lab','ekg','mcu','fisio','hd','vaksin'],
  C:['igd','rawat_inap','poli_dalam','poli_anak','poli_kandungan','poli_tht','poli_kulit','poli_gigi','rontgen','usg','lab','ekg','mcu','vaksin']
};

/* [id, nama, kota, area, kelas, jenis, preset, {plus, minus, only}] */
const _RAW = [
  // ---------- JAKARTA ----------
  ['jkt-01','RSUPN Dr. Cipto Mangunkusumo (RSCM)','Jakarta','Jakarta Pusat · Senen','A','RS Pemerintah','A'],
  ['jkt-02','RSUP Fatmawati','Jakarta','Jakarta Selatan · Cilandak','A','RS Pemerintah','A'],
  ['jkt-03','RS Pusat Otak Nasional (RS PON)','Jakarta','Jakarta Timur · Cawang','A','RS Khusus','A',{only:['igd','rawat_inap','poli_saraf','mri','ct','rontgen','lab','ekg','fisio','mcu']}],
  ['jkt-04','RS Jantung dan Pembuluh Darah Harapan Kita','Jakarta','Jakarta Barat · Slipi','A','RS Khusus','A',{only:['igd','rawat_inap','poli_jantung','poli_dalam','ekg','ct','mri','rontgen','usg','lab','fisio','mcu']}],
  ['jkt-05','RS Anak dan Bunda (RSAB) Harapan Kita','Jakarta','Jakarta Barat · Slipi','A','RS Khusus','A',{only:['igd','rawat_inap','poli_anak','poli_kandungan','usg','lab','rontgen','vaksin','mcu','fisio']}],
  ['jkt-06','RS Kanker Dharmais','Jakarta','Jakarta Barat · Slipi','A','RS Khusus','A',{only:['rawat_inap','poli_onkologi','ct','mri','rontgen','usg','lab','mcu','fisio']}],
  ['jkt-07','RSPAD Gatot Soebroto','Jakarta','Jakarta Pusat · Senen','A','RS TNI','A'],
  ['jkt-08','RSUP Persahabatan','Jakarta','Jakarta Timur · Rawamangun','A','RS Pemerintah','A'],
  ['jkt-09','RSUD Cengkareng','Jakarta','Jakarta Barat · Cengkareng','B','RSUD','B',{plus:['mri']}],
  ['jkt-10','RSUD Pasar Minggu','Jakarta','Jakarta Selatan · Pasar Minggu','B','RSUD','B',{plus:['mri']}],
  ['jkt-11','RSUD Tarakan','Jakarta','Jakarta Pusat · Gambir','B','RSUD','B',{plus:['mri']}],
  ['jkt-12','RSUD Budhi Asih','Jakarta','Jakarta Timur · Kramat Jati','B','RSUD','B'],
  ['jkt-13','RSUD Koja','Jakarta','Jakarta Utara · Koja','B','RSUD','B'],
  ['jkt-14','RSUD Pasar Rebo','Jakarta','Jakarta Timur · Pasar Rebo','B','RSUD','B'],
  ['jkt-15','RSUD Duren Sawit','Jakarta','Jakarta Timur · Duren Sawit','B','RSUD','B'],
  ['jkt-16','RSUD Cilincing','Jakarta','Jakarta Utara · Cilincing','C','RSUD','C'],
  ['jkt-17','RSUD Kebayoran Baru','Jakarta','Jakarta Selatan · Kebayoran Baru','C','RSUD','C'],
  ['jkt-18','RSUD Tebet','Jakarta','Jakarta Selatan · Tebet','C','RSUD','C'],
  ['jkt-19','RSUD Kembangan','Jakarta','Jakarta Barat · Kembangan','C','RSUD','C'],
  ['jkt-20','RS Pelni','Jakarta','Jakarta Barat · Petamburan','B','RS BUMN','B',{plus:['mri']}],
  ['jkt-21','RS Islam Jakarta Cempaka Putih','Jakarta','Jakarta Pusat · Cempaka Putih','B','RS Swasta','B'],
  ['jkt-22','RS Islam Jakarta Pondok Kopi','Jakarta','Jakarta Timur · Duren Sawit','B','RS Swasta','B'],
  ['jkt-23','RS Sumber Waras','Jakarta','Jakarta Barat · Grogol Petamburan','B','RS Swasta','B',{plus:['mri']}],
  ['jkt-24','RS Angkatan Laut Dr. Mintohardjo','Jakarta','Jakarta Pusat · Tanah Abang','B','RS TNI AL','B'],
  ['jkt-25','RS Bhayangkara Tk. I R. Said Sukanto','Jakarta','Jakarta Timur · Kramat Jati','B','RS Polri','B'],
  // ---------- BOGOR ----------
  ['bgr-01','RSUD Kota Bogor','Bogor','Kota Bogor · Bogor Barat','B','RSUD','B',{plus:['mri']}],
  ['bgr-02','RSUD Ciawi','Bogor','Kab. Bogor · Ciawi','B','RSUD','B'],
  ['bgr-03','RSUD Cibinong','Bogor','Kab. Bogor · Cibinong','B','RSUD','B',{plus:['mri']}],
  ['bgr-04','RSUD Leuwiliang','Bogor','Kab. Bogor · Leuwiliang','C','RSUD','C'],
  ['bgr-05','RSUD Cileungsi','Bogor','Kab. Bogor · Cileungsi','C','RSUD','C'],
  ['bgr-06','RSUD Parung','Bogor','Kab. Bogor · Parung','C','RSUD','C'],
  ['bgr-07','RSUD Jasinga','Bogor','Kab. Bogor · Jasinga','C','RSUD','C',{minus:['poli_tht']}],
  ['bgr-08','RSUD Cibungbulang','Bogor','Kab. Bogor · Cibungbulang','C','RSUD','C'],
  ['bgr-09','RS PMI Bogor','Bogor','Kota Bogor · Bogor Tengah','B','RS Swasta','B'],
  ['bgr-10','RS Azra','Bogor','Kota Bogor · Bogor Tengah','B','RS Swasta','B',{plus:['mri']}],
  ['bgr-11','RS Hermina Bogor','Bogor','Kota Bogor · Bogor Timur','B','RS Swasta','B'],
  ['bgr-12','Siloam Hospitals Bogor','Bogor','Kota Bogor · Bogor Timur','B','RS Swasta','B',{plus:['mri']}],
  ['bgr-13','RS TNI AD Tk. II Salak','Bogor','Kota Bogor · Bogor Tengah','B','RS TNI AD','B'],
  ['bgr-14','RS Karya Bhakti','Bogor','Kota Bogor · Bogor Timur','C','RS Swasta','C'],
  ['bgr-15','RS Ummi','Bogor','Kota Bogor · Bogor Selatan','B','RS Swasta','B'],
  ['bgr-16','RS Islam Bogor','Bogor','Kota Bogor · Bogor Selatan','C','RS Swasta','C',{plus:['rawat_inap']}],
  ['bgr-17','RS Bogor Medical Center (BMC)','Bogor','Kota Bogor · Bogor Tengah','B','RS Swasta','B',{plus:['mri']}],
  ['bgr-18','RS Medika Dramaga','Bogor','Kab. Bogor · Dramaga','C','RS Swasta','C'],
  ['bgr-19','RS EMC Sentul','Bogor','Kab. Bogor · Babakan Madang','B','RS Swasta','B',{plus:['mri']}],
  ['bgr-20','RSJ Dr. H. Marzoeki Mahdi','Bogor','Kota Bogor · Bogor Barat','A','RS Khusus','A',{only:['igd','rawat_inap','poli_jiwa','poli_saraf','poli_dalam','lab','ekg','fisio','mcu']}],
  ['bgr-21','RS Hermina Mekarsari','Bogor','Kab. Bogor · Cileungsi','B','RS Swasta','B'],
  ['bgr-22','RS Rumah Sehat Terpadu Dompet Dhuafa','Bogor','Kab. Bogor · Parung','C','RS Swasta','C']
];

const FASKES = _RAW.map(([id,nama,kota,area,kelas,jenis,p,opt])=>{
  const o = opt || {};
  let layanan = o.only ? o.only.slice() : [...new Set([...PRESET[p], ...(o.plus||[])])].filter(x=>!(o.minus||[]).includes(x));
  return { id, nama, kota, area, kelas, jenis, layanan, igd: layanan.includes('igd') };
});

const LAYANAN_BY_ID = Object.fromEntries(KATALOG_LAYANAN.map(l=>[l.id,l]));

/* Filter cepat di portal (chip) */
const CHIP_LAYANAN = ['igd','rawat_inap','mri','ct','rontgen','usg','lab','mcu','hd','fisio','vaksin','poli_jantung','poli_anak','poli_kandungan','poli_mata'];

/* ---- Pseudo-acak deterministik (kuota antrean konsisten untuk hari & slot yang sama) ---- */
function hashStr(s){ let h = 2166136261; for(let i=0;i<s.length;i++){ h ^= s.charCodeAt(i); h = Math.imul(h,16777619); } return h>>>0; }
function sisaKuota(faskesId, layananId, tanggal, jam){ return hashStr(faskesId+layananId+tanggal+jam) % 9; } // 0 = penuh
const JAM_PRAKTIK = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00'];
