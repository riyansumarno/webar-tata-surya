'use strict';
window.SOLAR_DATA = {
  sources: [
    {title:'NASA — About the Planets', url:'https://science.nasa.gov/solar-system/planets/'},
    {title:'NASA — Solar System Facts', url:'https://science.nasa.gov/solar-system/solar-system-facts/'},
    {title:'NASA — Planet Sizes and Locations', url:'https://science.nasa.gov/solar-system/planet-sizes-and-locations-in-our-solar-system/'}
  ],
  planets: [
    {id:'mercury',name:'Merkurius',order:1,type:'Planet terestrial',group:'Dalam',color:'#9b9b9b',accent:'#d8d8d8',diameter:4879,distance:57.9,orbitDays:88,rotation:'58,6 hari',sizeEarth:0.383,icon:'☿',fact:'Planet terkecil dan paling dekat dengan Matahari.',clue:'Aku paling dekat dengan Matahari dan bergerak paling cepat mengelilinginya.'},
    {id:'venus',name:'Venus',order:2,type:'Planet terestrial',group:'Dalam',color:'#d7a96b',accent:'#ffe0a8',diameter:12104,distance:108.2,orbitDays:224.7,rotation:'243 hari, retrograde',sizeEarth:0.949,icon:'♀',fact:'Planet terpanas karena atmosfer tebalnya menahan panas.',clue:'Aku sering disebut kembaran Bumi dalam ukuran, tetapi permukaanku sangat panas.'},
    {id:'earth',name:'Bumi',order:3,type:'Planet terestrial',group:'Dalam',color:'#3f8cff',accent:'#8ec7ff',diameter:12742,distance:149.7,orbitDays:365.25,rotation:'23,9 jam',sizeEarth:1,icon:'⊕',fact:'Satu-satunya tempat yang diketahui memiliki kehidupan.',clue:'Aku rumah kita dan memiliki lautan air cair yang luas.'},
    {id:'mars',name:'Mars',order:4,type:'Planet terestrial',group:'Dalam',color:'#d95f41',accent:'#ffad8f',diameter:6779,distance:227.9,orbitDays:687,rotation:'24,6 jam',sizeEarth:0.533,icon:'♂',fact:'Dikenal sebagai planet merah karena mineral besi pada permukaannya.',clue:'Warnaku kemerahan dan aku memiliki dua satelit kecil.'},
    {id:'jupiter',name:'Jupiter',order:5,type:'Raksasa gas',group:'Luar',color:'#d8b28a',accent:'#ffe0bf',diameter:139820,distance:778,orbitDays:4333,rotation:'9,9 jam',sizeEarth:10.97,icon:'♃',fact:'Planet terbesar di Tata Surya.',clue:'Aku planet terbesar dan memiliki Bintik Merah Besar.'},
    {id:'saturn',name:'Saturnus',order:6,type:'Raksasa gas',group:'Luar',color:'#dbc990',accent:'#fff1b8',diameter:116460,distance:1430,orbitDays:10759,rotation:'10,7 jam',sizeEarth:9.14,icon:'♄',fact:'Sistem cincinnya paling mencolok di antara planet-planet.',clue:'Aku mudah dikenali karena cincinku yang lebar dan terang.'},
    {id:'uranus',name:'Uranus',order:7,type:'Raksasa es',group:'Luar',color:'#80d8e7',accent:'#c5f5ff',diameter:50724,distance:2900,orbitDays:30687,rotation:'17,2 jam, retrograde',sizeEarth:3.98,icon:'⛢',fact:'Sumbu rotasinya sangat miring sehingga tampak berputar menyamping.',clue:'Aku raksasa es yang seolah berguling saat mengorbit Matahari.'},
    {id:'neptune',name:'Neptunus',order:8,type:'Raksasa es',group:'Luar',color:'#4169e1',accent:'#8fa8ff',diameter:49244,distance:4500,orbitDays:60190,rotation:'16,1 jam',sizeEarth:3.86,icon:'♆',fact:'Planet terjauh dari Matahari di antara delapan planet.',clue:'Aku planet kedelapan dan sangat jauh dari Matahari.'}
  ],
  lessons:[
    {title:'Kenalan dengan Tata Surya',eyebrow:'Langkah 1',body:'Tata Surya terdiri atas Matahari dan berbagai benda yang terikat gravitasinya. Delapan planet utama mengorbit Matahari.',task:'Amati urutan delapan planet pada simulasi.',focus:'all'},
    {title:'Planet Dalam',eyebrow:'Langkah 2',body:'Merkurius, Venus, Bumi, dan Mars adalah planet terestrial. Keempatnya berukuran relatif kecil dan memiliki permukaan padat berbatu.',task:'Sentuh salah satu planet dalam untuk melihat profilnya.',focus:'inner'},
    {title:'Planet Luar',eyebrow:'Langkah 3',body:'Jupiter dan Saturnus adalah raksasa gas. Uranus dan Neptunus disebut raksasa es. Planet luar jauh lebih besar dan berada lebih jauh dari Matahari.',task:'Bandingkan ukuran Bumi dengan Jupiter.',focus:'outer'},
    {title:'Rotasi dan Revolusi',eyebrow:'Langkah 4',body:'Rotasi adalah perputaran planet pada porosnya. Revolusi adalah gerak planet mengelilingi Matahari. Periode keduanya berbeda pada setiap planet.',task:'Ubah kecepatan waktu dan perhatikan perubahan gerak orbit.',focus:'motion'},
    {title:'Skala Itu Penting',eyebrow:'Langkah 5',body:'Gambar Tata Surya untuk pembelajaran biasanya tidak menggambarkan ukuran dan jarak secara bersamaan dalam skala sebenarnya. Mode edukasi sengaja memperbesar planet agar terlihat.',task:'Buka eksperimen skala untuk membandingkan ukuran relatif planet.',focus:'scale'}
  ],
  missions:[
    {id:'m1',title:'Temukan planet terbesar',desc:'Buka profil Jupiter di Jelajah 3D.',target:'jupiter',reward:20},
    {id:'m2',title:'Cari planet bercincin',desc:'Buka profil Saturnus di Jelajah 3D.',target:'saturn',reward:20},
    {id:'m3',title:'Bandingkan dua dunia',desc:'Lakukan satu perbandingan planet.',target:'compare',reward:25},
    {id:'m4',title:'Kuasai orbit',desc:'Jalankan eksperimen sampai satu planet menyelesaikan satu revolusi.',target:'orbit',reward:25},
    {id:'m5',title:'Buktikan pemahamanmu',desc:'Selesaikan satu kuis hingga akhir.',target:'quiz',reward:30}
  ],
  quiz:[
    {q:'Planet terdekat dengan Matahari adalah…',choices:['Venus','Merkurius','Bumi','Mars'],answer:1,why:'Merkurius merupakan planet pertama dan paling dekat dengan Matahari.'},
    {q:'Planet terbesar di Tata Surya adalah…',choices:['Saturnus','Neptunus','Jupiter','Bumi'],answer:2,why:'Jupiter adalah planet terbesar, dengan diameter sekitar sebelas kali diameter Bumi.'},
    {q:'Pasangan yang termasuk raksasa es adalah…',choices:['Jupiter dan Saturnus','Uranus dan Neptunus','Bumi dan Mars','Venus dan Bumi'],answer:1,why:'NASA mengelompokkan Uranus dan Neptunus sebagai ice giants atau raksasa es.'},
    {q:'Gerak planet mengelilingi Matahari disebut…',choices:['Rotasi','Revolusi','Gravitasi','Presesi'],answer:1,why:'Revolusi adalah gerak planet mengelilingi Matahari, sedangkan rotasi adalah perputaran pada poros.'},
    {q:'Planet yang paling terkenal dengan sistem cincinnya adalah…',choices:['Mars','Saturnus','Merkurius','Venus'],answer:1,why:'Semua planet raksasa memiliki cincin, tetapi cincin Saturnus paling jelas dan mencolok.'},
    {q:'Empat planet pertama disebut planet terestrial karena…',choices:['Memiliki permukaan padat berbatu','Seluruhnya memiliki cincin','Berukuran paling besar','Tidak mengorbit Matahari'],answer:0,why:'Merkurius, Venus, Bumi, dan Mars memiliki permukaan padat berbatu.'},
    {q:'Planet yang menjadi tempat tinggal manusia adalah…',choices:['Mars','Venus','Bumi','Jupiter'],answer:2,why:'Bumi adalah planet rumah kita dan satu-satunya tempat yang diketahui memiliki kehidupan.'},
    {q:'Jika kecepatan simulasi dinaikkan, yang berubah adalah…',choices:['Urutan planet','Visual laju gerak waktu simulasi','Nama planet','Jumlah planet'],answer:1,why:'Kontrol kecepatan hanya mempercepat atau memperlambat visualisasi waktu, bukan mengubah fakta astronomis.'},
    {q:'Mengapa ukuran planet pada ilustrasi pembelajaran sering diperbesar?',choices:['Agar semua planet terlihat','Karena ukuran asli sama','Karena jaraknya sama','Agar urutan berubah'],answer:0,why:'Jika jarak dan ukuran dibuat berskala bersama, planet akan sangat kecil pada layar. Visualisasi edukasi memakai penyederhanaan.'},
    {q:'Urutan yang benar dari Matahari adalah…',choices:['Bumi, Venus, Merkurius, Mars','Merkurius, Venus, Bumi, Mars','Mars, Bumi, Venus, Merkurius','Venus, Merkurius, Mars, Bumi'],answer:1,why:'Empat planet pertama berurutan Merkurius, Venus, Bumi, dan Mars.'}
  ]
};
