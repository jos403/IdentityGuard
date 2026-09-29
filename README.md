# ProtectAI — Identity Guard
Prototype BPJS Kesehatan Healthkathon 2026 · Kategori: Efisiensi Risiko pada Peserta

## ⚠️ Mode Developer (baca ini dulu)
Di `js/config.js` ada:
```js
const APP_CONFIG = { DEV_MODE: true, ... };
```
Selama **DEV_MODE: true**:
- Membuka halaman mana pun (klik kanan → "Go Live" / "Open with Live Server") **tidak** akan dilempar ke halaman login — sistem otomatis memakai **akun demo** supaya kamu leluasa mengedit `home.html`, `riwayat.html`, dll satu per satu tanpa harus login ulang tiap kali.
- Di halaman **Layanan**, muncul tombol tambahan "🧪 Lewati Verifikasi (Mode Developer)" untuk melewati scan wajah + liveness saat sedang mengedit tampilan portal faskes.
- Nama peserta di header diberi label kecil **DEV** sebagai pengingat.

**Sebelum demo resmi / dikumpulkan ke panitia, ubah menjadi:**
```js
DEV_MODE: false,
```
Setelah itu, alur wajib kembali normal: registrasi → login (password + scan wajah + device) → verifikasi wajah & liveness sebelum masuk portal faskes.

## Struktur Folder
```
identity-guard-prototype/
├── index.html              # stub, redirect ke login.html
├── login.html              # login (username, password, scan wajah)
├── register.html           # registrasi peserta baru
├── loading.html            # animasi wavy rainbow setelah login
├── home.html                 # beranda + slider informasi BPJS
├── layanan.html               # gerbang verifikasi (wajah + liveness) sebelum masuk faskes
├── loading-layanan.html       # transisi menuju portal faskes
├── portal-layanan.html        # cari RS, pilih layanan, ambil antrean, tiket digital
├── riwayat.html                # bayar iuran + riwayat + struk
├── obat.html                    # cek kewajaran dosis obat
├── profil.html                   # profil peserta (kartu digital, foto terdaftar)
├── css/ (style.css, home.css, layanan.css, profil.css)
├── assets/slider/*.svg          # 8 ilustrasi untuk slider informasi (buatan sendiri)
└── js/
    ├── config.js          # DEV_MODE & durasi sesi
    ├── db.js              # "database" (localStorage), sesi, util format
    ├── common.js          # toast, guard login, header dashboard
    ├── faceapi-helpers.js # model AI wajah, cek blur, modal kamera
    ├── info-data.js       # konten slider informasi BPJS
    ├── faskes-data.js     # 47 RS contoh (25 Jakarta + 22 Bogor) & katalog layanan
    └── (satu file JS per halaman: login.js, register.js, home.js, layanan.js, portal.js, dst.)
```

## Cara Menjalankan
```bash
cd identity-guard-prototype
python -m http.server 8000
```
Buka `http://localhost:8000` (kamera browser diblokir kalau file dibuka langsung tanpa server).

## Apa yang Baru di Versi Ini

**1. Profil didesain ulang total.** Foto hasil selfie saat registrasi kini dipakai sebagai foto profil. Ada kartu peserta digital bergaya kartu ATM (nomor kartu, chip, efek kilau), statistik ringkas, data pribadi (NIK bisa disembunyikan/ditampilkan), data kepesertaan, dan info keamanan akun.

**2. Beranda punya slider informasi BPJS.** Di bawah 6 menu utama ada slider otomatis (geser sendiri tiap 4 detik, bisa juga digeser manual lewat sentuh/mouse-drag, plus tombol panah & titik indikator) berisi 8 topik: apa itu JKN, jenis kepesertaan, iuran & kelas (angka terkini per September 2026, sudah dicek lewat pencarian web), alur berobat berjenjang, layanan yang dijamin/tidak dijamin, kanal bantuan resmi, waspada penyalahgunaan identitas, dan skrining/Prolanis. Tiap kartu punya tombol "Baca selengkapnya".

**3. Layanan kini benar-benar jadi portal faskes.** Alurnya 3 langkah dengan progres tersimpan: verifikasi wajah on-the-spot (lockout `aₙ=60+(n-1)×90` detik seperti sebelumnya) → liveness check ekspresi (tetap modul terpisah) → baru setelah lolos keduanya, masuk ke **Portal Layanan**: cari/filter 47 RS contoh (25 Jakarta + 22 Bogor, tiap RS punya daftar layanan berbeda sesuai kelasnya), wizard pemesanan (pilih layanan → tanggal/jam & rujukan → konfirmasi), lalu tiket antrean digital dengan kode QR ilustratif. Ada juga **pemeriksaan kewajaran otomatis** yang menolak layanan yang sama diajukan berulang dalam jeda waktu tertentu (mis. MRI 30 hari, MCU 180 hari) — ini menyambung langsung ke sub-kategori "Pelayanan yang tidak perlu" dari kategori lomba kalian.

**4. Iuran terkini.** Rp150.000/Rp100.000/Rp35.000 untuk Kelas I/II/III (setelah subsidi pemerintah Rp7.000), sesuai data resmi yang berlaku per September 2026.

## Catatan Kejujuran untuk Proposal (bagian Risiko, Privasi & Etika)
Bagian berikut **disimulasikan**, bukan integrasi produksi:
- **Database**: `localStorage` browser, bukan server terenkripsi sungguhan.
- **Daftar rumah sakit & kuota antrean**: nama RS di Jakarta/Bogor nyata dipakai sebagai contoh ilustratif, namun kelas, daftar layanan, dan sisa kuota adalah data buatan untuk demo — bukan data resmi faskes kerja sama BPJS.
- **Device ID**: ID acak tersimpan di browser, bukan device-fingerprinting server-side.
- **Verifikasi ke pemerintah (Dukcapil)** dan **riwayat penerimaan BPJS**: dummy, sesuai aturan lomba yang melarang penggunaan data peserta JKN asli.
- **Kode QR pada tiket**: pola ilustratif, bukan QR yang benar-benar bisa dipindai.
