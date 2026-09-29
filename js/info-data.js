/* ================= DATA INFORMASI BPJS KESEHATAN (slider beranda) =================
   Informasi bersifat umum. Besaran iuran dan aturan dapat berubah sesuai regulasi,
   rujukan resmi: bpjs-kesehatan.go.id dan Care Center 165. */
const INFO_SLIDES = [
  { id:'jkn', tag:'Mengenal JKN', gambar:'assets/slider/01-jkn.svg',
    judul:'Apa itu JKN-KIS?',
    ringkas:'Program Jaminan Kesehatan Nasional yang diselenggarakan BPJS Kesehatan sejak 1 Januari 2014, berlandaskan gotong royong.',
    detail:[
      { h:'Dasar hukum', p:'Program JKN berlandaskan UU No. 40 Tahun 2004 tentang Sistem Jaminan Sosial Nasional (SJSN) dan UU No. 24 Tahun 2011 tentang Badan Penyelenggara Jaminan Sosial (BPJS). BPJS Kesehatan adalah badan hukum publik yang bertanggung jawab langsung kepada Presiden.' },
      { h:'Prinsip dasar', list:['Gotong royong: yang sehat membantu yang sakit, yang mampu membantu yang kurang mampu.','Kepesertaan bersifat wajib bagi seluruh penduduk.','Nirlaba: pengelolaan dana untuk kepentingan peserta.','Portabilitas: peserta dapat berobat di seluruh wilayah Indonesia.','Dana amanat: iuran dikelola secara hati-hati dan transparan.'] },
      { h:'Target', p:'Pemerintah menargetkan cakupan kepesertaan mencapai 98% dari total penduduk Indonesia, sehingga setiap warga terlindungi dari beban biaya berobat.' }
    ]},
  { id:'kepesertaan', tag:'Kepesertaan', gambar:'assets/slider/02-kepesertaan.svg',
    judul:'Siapa Saja Peserta JKN?',
    ringkas:'Peserta terbagi menjadi PBI, PPU, PBPU, dan Bukan Pekerja (BP). Cek segmen kepesertaan Anda.',
    detail:[
      { h:'Empat segmen peserta', list:[
        'PBI (Penerima Bantuan Iuran): fakir miskin dan orang tidak mampu; iurannya dibayar pemerintah.',
        'PPU (Pekerja Penerima Upah): PNS, TNI/Polri, pejabat negara, pegawai pemerintah non-PNS, dan pegawai swasta; iuran dipotong dari gaji.',
        'PBPU (Pekerja Bukan Penerima Upah): pekerja mandiri dan wirausaha yang membayar iuran sendiri.',
        'BP (Bukan Pekerja): investor, pemberi kerja, penerima pensiun, veteran, dan sejenisnya.' ] },
      { h:'Anggota keluarga', p:'Anggota keluarga peserta, yaitu pasangan dan anak sesuai ketentuan, dapat didaftarkan dalam satu Kartu Keluarga agar seluruhnya terlindungi.' },
      { h:'Data harus benar', p:'Data kepesertaan (NIK, nama, kelas rawat, faskes tingkat 1) harus sesuai dokumen kependudukan. Memalsukan data atau identitas dapat berujung sanksi.' }
    ]},
  { id:'iuran', tag:'Iuran & Kelas', gambar:'assets/slider/03-iuran.svg',
    judul:'Iuran & Kelas Perawatan',
    ringkas:'Kelas I Rp150.000, Kelas II Rp100.000, Kelas III Rp42.000 (peserta membayar Rp35.000 berkat subsidi pemerintah Rp7.000).',
    detail:[
      { h:'Peserta mandiri (PBPU & BP)', list:['Kelas I: Rp150.000 per orang per bulan.','Kelas II: Rp100.000 per orang per bulan.','Kelas III: Rp42.000 per orang per bulan; peserta cukup membayar Rp35.000 karena pemerintah memberi subsidi Rp7.000.'] },
      { h:'Pekerja penerima upah (PPU)', p:'Iuran sebesar 5% dari gaji per bulan: 4% dibayar pemberi kerja dan 1% dibayar pekerja melalui potong gaji, dengan batas upah tertinggi Rp12 juta sebagai dasar perhitungan.' },
      { h:'Waktu & cara membayar', list:['Iuran dibayar paling lambat tanggal 10 setiap bulan.','Dapat dibayar lewat mobile banking, ATM, minimarket, agen, atau aplikasi Mobile JKN.','Simpan bukti pembayaran/struk sebagai bukti sah.'] },
      { h:'Jika menunggak', p:'Kepesertaan dapat dinonaktifkan sementara dan aktif kembali setelah tunggakan dilunasi sesuai ketentuan; pada kondisi tertentu dapat dikenai denda layanan.' },
      { h:'Catatan penting', p:'Sistem Kelas 1, 2, 3 direncanakan beralih ke Kelas Rawat Inap Standar (KRIS). Hingga September 2026 penerapan penuh belum berlaku dan iuran belum berubah. Selalu cek informasi terbaru di kanal resmi.' }
    ]},
  { id:'berjenjang', tag:'Alur Berobat', gambar:'assets/slider/04-berjenjang.svg',
    judul:'Alur Berobat Berjenjang',
    ringkas:'Mulai dari FKTP (puskesmas/klinik/dokter praktik), lalu dirujuk ke rumah sakit bila perlu. Gawat darurat langsung ke IGD.',
    detail:[
      { h:'Langkah berobat', list:['Datang ke Faskes Tingkat 1 (FKTP) tempat Anda terdaftar dengan membawa KTP/KIS Digital.','Dokter melakukan pemeriksaan dan tindakan sesuai kebutuhan medis.','Bila perlu penanganan lanjutan, dokter menerbitkan surat rujukan ke rumah sakit (FKRTL).','Peserta dilayani dokter spesialis di rumah sakit rujukan.','Setelah stabil, peserta dapat kontrol atau menjalani Program Rujuk Balik (PRB) di FKTP.'] },
      { h:'Kondisi gawat darurat', p:'Pasien gawat darurat dapat langsung ke IGD fasilitas kesehatan terdekat tanpa surat rujukan, termasuk fasilitas yang belum bekerja sama dengan BPJS Kesehatan; pembiayaan mengikuti ketentuan yang berlaku.' },
      { h:'Antrean online', p:'Untuk kunjungan yang lebih efisien, gunakan fitur antrean online agar tidak menunggu lama di fasilitas kesehatan.' }
    ]},
  { id:'layanan', tag:'Manfaat', gambar:'assets/slider/05-layanan.svg',
    judul:'Layanan yang Dijamin',
    ringkas:'Manfaat mencakup promotif, preventif, kuratif, dan rehabilitatif, termasuk obat dan bahan medis habis pakai.',
    detail:[
      { h:'Umumnya dijamin', list:['Pelayanan kesehatan tingkat pertama: pemeriksaan, pengobatan, dan tindakan medis dasar.','Rawat jalan dan rawat inap tingkat lanjutan.','Pemeriksaan penunjang diagnostik, seperti laboratorium dan radiologi, sesuai indikasi medis.','Persalinan dan pelayanan ibu-anak sesuai ketentuan.','Obat dan bahan medis habis pakai sesuai formularium nasional.','Ambulans untuk rujukan pasien dengan kondisi tertentu.'] },
      { h:'Umumnya tidak dijamin', list:['Pelayanan tanpa prosedur atau tanpa rujukan yang sesuai ketentuan.','Pelayanan di fasilitas kesehatan yang tidak bekerja sama (kecuali gawat darurat).','Pelayanan untuk kosmetik atau estetika.','Perataan gigi (ortodonti) dan pengobatan alternatif yang belum terbukti secara medis.','Pelayanan yang telah dijamin program lain, misalnya kecelakaan kerja.'] },
      { h:'Ingat', p:'Layanan diberikan berdasarkan indikasi medis. Meminta pemeriksaan atau obat yang tidak diperlukan dapat dianggap penyalahgunaan hak peserta.' }
    ]},
  { id:'aplikasi', tag:'Kanal Bantuan', gambar:'assets/slider/06-aplikasi.svg',
    judul:'Mobile JKN & Care Center 165',
    ringkas:'Urus antrean, info iuran, dan data peserta dari genggaman. Butuh bantuan? Hubungi Care Center 165.',
    detail:[
      { h:'Aplikasi Mobile JKN', list:['Ambil antrean online di fasilitas kesehatan.','Cek info peserta dan status kepesertaan.','Lihat dan bayar iuran, serta cek riwayat pelayanan.','Skrining riwayat kesehatan secara mandiri.','Ubah data peserta dan pindah faskes tingkat 1.'] },
      { h:'Kanal resmi lainnya', list:['Care Center 165 untuk informasi dan pengaduan.','Website resmi: bpjs-kesehatan.go.id.','Layanan WhatsApp PANDAWA dan asisten virtual CHIKA.','Kantor cabang dan kantor kabupaten/kota BPJS Kesehatan.'] },
      { h:'Tips aman', p:'Unduh aplikasi hanya dari toko aplikasi resmi dan jangan pernah membagikan OTP, PIN, atau kata sandi kepada siapa pun.' }
    ]},
  { id:'waspada', tag:'Integritas & Keamanan', gambar:'assets/slider/07-waspada.svg',
    judul:'Jaga Identitas Peserta Anda',
    ringkas:'Jangan pinjamkan, jual, atau sewakan identitas peserta. Ini merugikan seluruh peserta yang bergotong royong.',
    detail:[
      { h:'Modus yang perlu diwaspadai', list:['Pemalsuan data atau identitas peserta untuk memperoleh layanan.','Penyalahgunaan identitas: meminjamkan, menyewakan, atau memperjualbelikan kartu peserta.','Memanfaatkan pelayanan yang sebenarnya tidak diperlukan secara medis.','Memperoleh obat atau alat kesehatan untuk dijual kembali.'] },
      { h:'Cara melindungi diri', list:['Jangan bagikan NIK, foto KTP, OTP, atau PIN kepada pihak yang tidak dikenal.','Gunakan hanya aplikasi dan kanal resmi.','Laporkan dugaan penyalahgunaan lewat Care Center 165.'] },
      { h:'Bagaimana ProtectAI membantu', list:['Verifikasi wajah dan uji keaslian (liveness) sebelum layanan.','Satu akun hanya dapat digunakan pada satu perangkat terdaftar.','Riwayat pembayaran dan struk digital sebagai bukti yang tidak dapat disangkal.','Pemeriksaan kewajaran layanan dan jumlah obat untuk mencegah pelayanan yang tidak perlu.'] }
    ]},
  { id:'prolanis', tag:'Sehat Lebih Awal', gambar:'assets/slider/08-prolanis.svg',
    judul:'Skrining & Prolanis',
    ringkas:'Cegah lebih baik daripada mengobati. Manfaatkan skrining riwayat kesehatan dan program pengelolaan penyakit kronis.',
    detail:[
      { h:'Skrining riwayat kesehatan', p:'Peserta dapat mengisi skrining riwayat kesehatan untuk mengetahui potensi risiko penyakit sejak dini, misalnya diabetes, hipertensi, dan penyakit jantung, lalu berkonsultasi ke faskes bila diperlukan.' },
      { h:'Prolanis', p:'Program Pengelolaan Penyakit Kronis (Prolanis) ditujukan bagi peserta dengan penyakit kronis seperti diabetes melitus tipe 2 dan hipertensi, mencakup konsultasi medis, edukasi, kegiatan kelompok, dan pemantauan status kesehatan.' },
      { h:'Program Rujuk Balik (PRB)', p:'Peserta penyakit kronis yang kondisinya stabil dapat menerima obat dan kontrol rutin di faskes tingkat 1 sehingga tidak perlu antre panjang di rumah sakit.' },
      { h:'Tips', list:['Rutin kontrol dan minum obat sesuai anjuran dokter.','Jangan menumpuk atau menjual kembali obat.','Terapkan pola hidup sehat: gizi seimbang, aktif bergerak, cukup istirahat.'] }
    ]}
];

const KONTAK_PENTING = [
  { ikon:'📞', judul:'Care Center 165', ket:'Informasi & pengaduan' },
  { ikon:'📱', judul:'Mobile JKN', ket:'Antrean, iuran, info peserta' },
  { ikon:'🌐', judul:'bpjs-kesehatan.go.id', ket:'Situs resmi BPJS Kesehatan' }
];
