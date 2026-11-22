# Website CV Armada Advertising

Website statis tanpa build. Cukup buka `index.html` di browser.

## Struktur
```
index.html              → halaman utama
assets/css/style.css    → tampilan
assets/js/data.js       → ✏️ SEMUA DATA (nomor WA, produk, portofolio)
assets/js/main.js       → interaksi
assets/img/portfolio/   → foto portofolio (p1.jpg … p12.jpg)
assets/img/products/    → foto produk (neon-box.jpg, huruf-timbul.jpg, …)
tools/optimize_images.py→ kompres foto sebelum upload
404.html                → halaman "tidak ditemukan"
manifest.webmanifest    → icon saat website disimpan ke layar HP
robots.txt, sitemap.xml → SEO (ganti domain!)
```

## Fitur
- Hero dengan papan neon interaktif (saklar ON/OFF dan efek miring)
- Portofolio dengan filter dan lightbox (bisa digeser, pakai keyboard, dan dibagikan)
- Produk: klik untuk detail (di HP muncul dari bawah), tanya harga via WA
- **Simulator signage**: ketik nama usaha, pilih jenis, huruf, warna lampu, dan dinding, lalu geser untuk membandingkan siang dan malam. Hasilnya bisa langsung dikirim ke WA.
- Kenapa Armada, Cara Pesan, dan FAQ dengan accordion
- Form pesan yang otomatis menyusun pesan WhatsApp
- Link langsung yang bisa dibagikan: `index.html#produk/neon-box`, `index.html#karya/3`
- SEO: data terstruktur LocalBusiness dan FAQ (otomatis), Open Graph, sitemap
- Aksesibilitas: skip link, fokus tetap di dalam popup, navigasi keyboard
- Intro animasi logo (sekali per kunjungan)
- **Product Finder**: kuis 3 pertanyaan, lalu rekomendasi produk (`#produk/cari`)
- **Kalkulator ukuran** di simulator: jarak pandang menghasilkan perkiraan tinggi huruf dan lebar papan
- **Link desain simulator** bisa dibagikan, dan link-nya ikut terkirim di pesan WA (`#sim?t=...`)
- **Stories** ala Instagram untuk portofolio di HP: auto-play, tap kiri/kanan, tahan untuk pause
- Karya terkait muncul di detail produk (berdasarkan `category`)
- Status **Buka / Tutup** realtime dari `openDays`, `openTime`, `closeTime`, `timezone` di `data.js`
- Judul muncul per kata, dan timeline "Cara Pesan" menyala saat di-scroll
- Kursor berlabel di desktop, dan papan neon hero bisa diketuk untuk ganti warna
- PWA: bisa dibuka offline setelah kunjungan pertama (khusus https)
- **Ilustrasi otomatis** (`assets/js/scenes.js`) untuk tiap kategori: toko dengan neon box, gedung dengan huruf timbul, billboard, pylon, fasad ACP, lobby, dan mobil branding. Tampil selama foto asli belum ada, dan otomatis diganti saat foto ditambahkan.
- **Hero**: ilustrasi toko malam hari dengan papan ARMADA, efek parallax mengikuti mouse, dan lampu etalase/OPEN yang ikut menyala
- **Strip produk** kuning bisa diklik (berhenti saat disentuh mouse; di HP bisa digeser)
- **Portofolio masonry** tanpa celah, dengan tombol "Lihat lebih banyak" (9 di desktop, 6 di HP)
- **Chat cepat WA**: tombol WhatsApp membuka popup dengan pilihan topik (tanya harga, survei lokasi, konsultasi, progres pesanan) atau tulis pesan sendiri
- Navigasi: penanda menu aktif yang bergeser, titik navigasi section di kanan (desktop), tombol kembali ke atas
- Di HP: header dan tab bar bersembunyi saat scroll ke bawah dan muncul lagi saat scroll ke atas
- **Pencarian cepat**: tekan `/` atau `Ctrl/⌘ + K`, atau klik ikon cari. Bisa mencari produk, karya, FAQ, dan aksi.
- **Foto toko sendiri di simulator**: upload foto fasad, lalu geser tulisan dan atur ukurannya (−/+). Foto tidak dikirim ke mana pun.
- **Sebelum/Sesudah** di lightbox portofolio. Kalau foto asli dipakai, isi field `before` untuk foto sebelum.
- **Bandingkan produk**: tombol perbandingan di detail produk, maksimal 3 produk, hasilnya tabel spesifikasi
- **Katalog PDF**: tombol "Unduh katalog PDF" di bagian Produk (lewat jendela cetak, pilih "Simpan sebagai PDF")
- **Harga mulai & badge** per produk (opsional, `startPrice` dan `badge` di `data.js`)
- **Testimoni**: section otomatis muncul kalau `window.TESTIMONI` diisi
- **Kartu lokasi**: tombol Rute ke Google Maps, dan peta tertanam kalau `mapsEmbed` diisi
- Footer lengkap dengan link produk, plus QR code untuk membuka website di HP (desktop, khusus http/https)
- **Tampilan lebih ringkas**: judul dan teks dipersingkat, label section tanpa nomor, dan tagline produk hanya muncul saat disorot
- **Simulator bertab** (Teks · Jenis · Warna · Dinding · Ukuran), jadi panel kontrol jauh lebih pendek
- **Kartu "Kenapa kami" bisa dibalik**: ketuk/arahkan untuk melihat detail
- **Cara pesan jadi stepper interaktif**: berjalan otomatis, dan bisa diklik per langkah
- Efek interaktif: tilt + kilau pada kartu (desktop), ripple saat tombol disentuh, penanda filter yang bergeser, parallax hero saat scroll, dan fokus kartu tengah + titik indikator di carousel produk (HP)
- **Tali lampu** di papan hero: tarik ke bawah (atau klik) untuk menyalakan/mematikan lampu; ketuk papan untuk ganti warna neon
- **Detail produk bisa digeser** kiri/kanan di HP, dengan titik posisi
- **Zoom** di lightbox: klik (desktop) atau cubit dua jari (HP)
- **Simpan desain simulator jadi gambar PNG** (siang/malam), langsung bisa dibagikan ke WA dari HP
- Ilustrasi dirender saat mendekati layar, sehingga halaman lebih ringan
- Sapaan "Butuh bantuan?" muncul sekali per kunjungan (setelah 35 detik atau saat scroll 60%+)
- Preview link WhatsApp/Facebook: `assets/img/og-share.jpg` (1200×630)
- Shortcut aplikasi (tekan lama ikon di layar HP): Chat, Simulasi, Kuis
- Notifikasi offline/online, pemberitahuan "Versi baru tersedia", dan header yang mengecil saat scroll
- Lolos audit aksesibilitas axe-core (desktop & HP)

## Cara termudah mengedit & update konten: ikon ⚙ (Panel Pengaturan)
Klik ikon **⚙ di pojok kanan atas** website (atau buka `admin.html`).
1. Edit info usaha, produk, portofolio, keunggulan, FAQ, dan testimoni lewat form. Draf tersimpan otomatis.
2. **Tambah foto karya**: tab Portofolio → "＋ Tambah foto karya" (bisa banyak sekaligus). Foto otomatis dikecilkan (1600px + thumbnail 760px), rasionya dideteksi supaya kartu proporsional, dan data EXIF/lokasi dihapus. Foto produk bisa diganti dengan tombol "📷 Ganti foto".
3. **👁 Pratinjau**: lihat hasilnya di website sebelum diterbitkan (hanya terlihat di browser kamu).
4. **🚀 Terbitkan**: perubahan + foto baru dikirim ke GitHub sebagai 1 commit.
   Pertama kali, buat *Fine-grained token* di GitHub (Repository access: repo ini saja, Permissions → Contents: Read and write), lalu tempel di tab "🚀 Terbitkan".

Tanpa GitHub: klik **Unduh data.js** (dan "Unduh foto baru" di tab Terbitkan), lalu taruh file-file itu di folder yang sesuai.
Panel ini tidak punya server: tanpa token GitHub, ia tidak bisa mengubah website siapa pun. Token hanya tersimpan di perangkat yang kamu pakai.

## Yang WAJIB diganti dulu
Buka `assets/js/data.js`:
- `whatsapp`: nomor WA, format `628xxxxxxxxxx` (tanpa + dan tanpa 0 di depan)
- `address`, `hours`, dan `mapsUrl` (opsional)

## Foto portofolio
35 foto karya asli sudah terpasang di `assets/img/portfolio/` (`NN-nama.jpg` + `NN-nama-sm.jpg`), dikelompokkan ke: Huruf Timbul, Neon Box, Indoor, Event, Neon Flex, Pylon, Billboard.
Folder `porto image/` (foto asli dengan metadata EXIF/GPS) sengaja tidak ikut di-push (`.gitignore`).

### Ganti foto portofolio secara manual
1. Simpan foto dari Instagram (atau HP) ke `assets/img/portfolio/`, beri nama `p1.jpg`, `p2.jpg`, dst.
2. Di `data.js` bagian `PORTFOLIO`, sesuaikan `title`, `category`, dan `place`.
3. Foto yang belum ada otomatis tampil sebagai ilustrasi bertanda "Ilustrasi".

Tips:
- Pakai JPG yang sudah dikecilkan, maksimal lebar sekitar 1600px dan ukuran di bawah 400 KB.
- `featured: true` membuat kartu besar (2×2), `wide: true` membuat kartu lebar (2×1).
- Komposisi 3 featured + 3 wide + 6 biasa membuat grid rapi tanpa celah.
- Kategori baru otomatis muncul di tombol filter.

## Kompres foto (disarankan)
```
python3 tools/optimize_images.py
```
Foto asli otomatis dicadangkan ke folder `_original/`.

## Ganti FAQ & keunggulan
Di `data.js` bagian `WHY` dan `FAQ`. Sesuaikan jawabannya dengan kebijakan usaha Anda.

## Ganti foto produk
Simpan foto di `assets/img/products/` dengan nama sesuai field `image` di `PRODUCTS`, misalnya `neon-box.jpg`.

## Cache offline (sw.js)
Setelah website online di https, browser menyimpan cache. File selalu diambil terbaru saat online.
Kalau ada masalah cache, naikkan `VERSION` di `sw.js` (misalnya `armada-v2`).

## Domain
Setelah punya domain, ganti `GANTI-DOMAIN-ANDA.com` di `robots.txt` dan `sitemap.xml`.
Agar preview link di WhatsApp tampil sempurna, ubah juga `og:image` dan `twitter:image` di `index.html` menjadi alamat lengkap, contoh `https://domainanda.com/assets/img/og-share.jpg`.

## Online-kan
Upload seluruh folder ini ke hosting mana saja (Netlify, Vercel, GitHub Pages, atau cPanel). Tidak perlu server khusus.
