WEBAR TATA SURYA v6 — GITHUB PAGES

Tujuan versi ini:
- Deployment langsung ke GitHub Pages.
- Kamera smartphone fullscreen.
- Marker tracking dengan AR.js.
- Tata Surya dirender di atas marker.

CARA MEMPERBARUI GITHUB
1. Buka repository webar-tata-surya.
2. Ganti isi repository dengan file/folder dari paket ini.
3. Pastikan index.html berada di root repository.
4. Pastikan folder assets ikut diunggah.
5. Commit perubahan ke branch yang digunakan GitHub Pages.
6. Setelah deployment GitHub Pages selesai, buka:
   https://riyansumarno.github.io/webar-tata-surya/?v=6
7. Untuk langsung menguji AR:
   https://riyansumarno.github.io/webar-tata-surya/ar-marker.html?v=6

PENGUJIAN AR
1. Buka marker.html pada perangkat kedua atau cetak marker.
2. Di smartphone utama, buka ar-marker.html?v=6.
3. Tekan Mulai AR & Kamera.
4. Izinkan akses kamera.
5. Arahkan seluruh marker ke kamera.
6. Saat marker terdeteksi, Matahari fallback berwarna kuning harus langsung terlihat.
7. Setelah itu Tata Surya lengkap dirender oleh Three.js.

PERUBAHAN UTAMA v6
- CSS tidak lagi memaksa semua elemen canvas menjadi fullscreen.
- Hanya canvas WebGL A-Frame (.a-canvas) yang ditampilkan sebagai layer AR.
- Canvas internal AR.js dipindahkan keluar viewport agar tidak menutupi renderer.
- Ditambahkan fallback Sun native A-Frame sebagai indikator rendering.
- logarithmicDepthBuffer dihapus untuk meningkatkan kompatibilitas smartphone.
- Mesh Tata Surya tidak menggunakan frustum culling.
