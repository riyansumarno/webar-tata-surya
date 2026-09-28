WEBAR TATA SURYA — v3

Cara paling praktis (GitHub Pages / HTTPS):
1. Buka index.html melalui alamat GitHub Pages.
2. Di smartphone, pilih "Tes Kamera" lebih dulu jika ingin memastikan kamera browser normal.
3. Buka "AR Marker".
4. Tekan "Siapkan Kamera" dan izinkan akses kamera.
5. Jika smartphone memiliki beberapa kamera, pilih kamera belakang dengan tampilan paling normal. Hindari ultrawide/0.5x jika marker sulit dibaca.
6. Tekan "Mulai AR".
7. Tampilkan marker.html pada layar perangkat lain atau cetak marker.
8. Arahkan kamera smartphone ke marker hingga seluruh bingkai hitam terlihat.

Mode localhost:
- Windows: klik start-localhost.bat lalu buka http://localhost:8000/
- macOS/Linux: jalankan ./start-localhost.sh

CATATAN
- Kamera memerlukan HTTPS atau localhost.
- A-Frame 1.6.0 dan AR.js 3.4.7 dimuat melalui internet.
- Versi v3 sengaja memakai AR.js 3.4.7, bukan branch master, agar kompatibilitas tidak berubah tiba-tiba.
- camera-test.html menguji kamera tanpa AR.js dan menyimpan pilihan kamera untuk digunakan pada halaman AR.
- Jika kamera tampil normal tetapi marker tidak terbaca, masalahnya lebih mungkin pada marker, pencahayaan, jarak, atau tracking.
