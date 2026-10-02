LABORATORIUM TATA SURYA INTERAKTIF — V8
PAKET KHUSUS GITHUB PAGES

PERUBAHAN UTAMA V8
- Sistem AR marker / pattern dihapus total.
- Tidak ada lagi marker-giting-ar.patt, marker.html, atau proses scan gambar.
- AR baru ada di ar.html.
- AR Ruang menggunakan WebXR immersive-ar + hit-test pada perangkat yang mendukung.
- Mode Kamera Universal menjadi fallback untuk perangkat yang tidak menyediakan WebXR/ARCore.

CARA MEMPERBARUI GITHUB PAGES
1. Ekstrak ZIP.
2. Unggah SELURUH ISI folder ini ke root repository webar-tata-surya.
3. Hapus file lama ar-marker.html, marker.html, camera-test.html, serta folder/asset marker lama jika masih ada di repository.
4. Commit perubahan.
5. Buka:
   https://riyansumarno.github.io/webar-tata-surya/
6. Untuk langsung masuk AR:
   https://riyansumarno.github.io/webar-tata-surya/ar.html?v=8

AR RUANG
- Direkomendasikan untuk Chrome Android pada perangkat yang mendukung WebXR/ARCore.
- Gerakkan HP perlahan ke meja atau lantai.
- Setelah reticle muncul, ketuk layar untuk meletakkan Tata Surya.
- Tata Surya dapat diperkecil, diperbesar, dijeda, dan diposisikan ulang.

MODE KAMERA UNIVERSAL
- Tidak membutuhkan marker.
- Tidak membutuhkan WebXR/ARCore.
- Kamera menjadi latar penuh, sedangkan Tata Surya dirender di atasnya.
- Geser satu jari untuk memindahkan/memutar objek.
- Cubit dua jari atau gunakan tombol +/- untuk mengubah ukuran.
- Mode ini bukan surface tracking sejati; objek tidak dikunci ke geometri meja/lantai.

CATATAN
GitHub Pages sudah menggunakan HTTPS, yang merupakan syarat WebXR. Library Three.js dipatok ke versi 0.186.1 melalui CDN jsDelivr.
