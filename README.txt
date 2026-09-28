WEBAR TATA SURYA — v5 MOBILE FULLSCREEN

Perubahan utama v5:
1. Mode AR hanya memakai satu stream kamera. Preview kamera terpisah pada halaman AR dihapus.
2. Video kamera dan canvas AR dipaksa memenuhi 100vw x tinggi viewport aktual smartphone.
3. Background kamera memakai elemen <video> asli, bukan videoTexture WebGL, untuk kompatibilitas mobile yang lebih baik.
4. AR.js dipatok ke versi 3.4.8 dan A-Frame 1.6.0.
5. Ada watchdog: bila stream/elemen kamera berhenti, pengguna mendapat pesan dan tombol mulai ulang.
6. camera-test.html juga dibuat fullscreen untuk memisahkan masalah kamera browser dari masalah AR.js.

GITHUB PAGES
Unggah/replace seluruh isi folder ini ke root repository webar-tata-surya.
Kemudian buka:
- index.html            halaman utama
- camera-test.html      tes kamera fullscreen tanpa AR.js
- ar-marker.html        AR marker Tata Surya
- marker.html           marker yang harus dipindai

URUTAN TES YANG DISARANKAN
A. Buka camera-test.html dari smartphone.
   - Kamera harus memenuhi seluruh layar.
   - Diamkan 30-60 detik. Kamera seharusnya tidak hilang/menjadi hitam.
B. Bila A berhasil, buka ar-marker.html.
   - Tekan Mulai AR & Kamera.
   - Izinkan kamera.
   - Tampilkan marker di perangkat lain atau cetak.
   - Arahkan seluruh marker ke area panduan di tengah layar.

CATATAN
A-Frame dan AR.js masih dimuat dari URL HTTPS versi tetap. Koneksi internet diperlukan saat halaman AR pertama kali dimuat, kecuali library tersebut sudah tersimpan di cache browser.
