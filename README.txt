WEBAR TATA SURYA — PAKET LOCALHOST
==================================

ISI UTAMA
- index.html              : menu + pratinjau Tata Surya 3D.
- ar-marker.html          : pengujian AR marker sebenarnya dengan AR.js.
- marker.html             : marker yang dapat ditampilkan/cetak.
- assets/marker-giting-ar.png
- assets/marker-giting-ar.patt
- server.py               : server localhost sederhana.
- start-localhost.bat     : launcher Windows.
- start-localhost.ps1     : launcher PowerShell.
- start-localhost.sh      : launcher macOS/Linux.
- TEST-CHECKLIST.txt      : daftar pengujian.

CARA TERCEPAT DI WINDOWS
1. Ekstrak ZIP ke folder biasa.
2. Klik dua kali start-localhost.bat.
3. Browser akan membuka http://localhost:8000/
4. Klik "Coba Pratinjau" untuk mengecek simulasi.
5. Buka "Tampilkan Marker" pada layar/monitor lain atau cetak marker.
6. Klik "Coba AR Marker", izinkan kamera, lalu arahkan kamera ke marker.

CATATAN PENTING
- Jangan membuka ar-marker.html langsung dengan file://. Jalankan dari localhost.
- Mode AR marker memakai A-Frame dan AR.js dari CDN. Internet diperlukan saat halaman AR pertama kali dimuat.
- Chrome/Edge desktop biasanya dapat memakai kamera pada http://localhost karena localhost diperlakukan sebagai secure context.
- Jika ingin mengetes dari ponsel terhadap server yang berjalan di PC, http://IP-PC:8000 belum tentu memperoleh izin kamera karena bukan HTTPS. Untuk ponsel, gunakan HTTPS/tunnel atau jalankan server pada perangkat yang sama.
- Tutup server dengan Ctrl+C pada jendela terminal.

TROUBLESHOOTING
- Kamera hitam/tidak meminta izin: cek izin Camera pada browser dan Windows.
- AR tidak muncul: pastikan internet aktif, marker tidak terpotong, seluruh bingkai hitam terlihat, dan pencahayaan cukup.
- Port 8000 sudah dipakai: ubah PORT pada server.py, misalnya menjadi 8080.
