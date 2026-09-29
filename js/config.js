/* ================= KONFIGURASI APLIKASI =================
   DEV_MODE = true  -> memudahkan pengembangan (Live Server / Go Live):
     - otomatis masuk memakai akun demo bila belum login,
     - verifikasi wajah bisa dilewati lewat tombol "Mode Developer".
   !!! Ubah menjadi false sebelum demo resmi / pengumpulan lomba !!! */
const APP_CONFIG = {
  DEV_MODE: true,
  SESSION_TTL_JAM: 12,        // lama sesi login (jam)
  VERIFIKASI_TTL_MENIT: 10,   // masa berlaku verifikasi wajah + liveness (menit)
  AKSES_LAYANAN_MENIT: 30     // lama sesi portal layanan faskes (menit)
};
