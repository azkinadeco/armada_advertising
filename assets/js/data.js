/* =========================================================
   DATA WEBSITE CV ARMADA ADVERTISING
   Edit file ini saja untuk mengganti nomor WA, produk & portofolio.
   ========================================================= */

window.SITE = {
  // Nomor WhatsApp: format internasional TANPA "+" dan tanpa "0" di depan.
  // Contoh: 0812-3456-7890  ->  "6281234567890"
  whatsapp: "6281234567890",
  instagram: "https://www.instagram.com/dazpro.adv/",
  instagramHandle: "@dazpro.adv",
  email: "",                 // opsional, contoh: "halo@armada-adv.com"
  address: "Alamat workshop Anda di sini",
  mapsUrl: "",               // opsional: link Google Maps (tombol "Rute")
  mapsEmbed: "",             // opsional: link embed peta (Google Maps > Bagikan > Sematkan peta > salin src="...")
  hours: "Senin – Sabtu, 08.00 – 17.00",
  // Untuk status "Buka sekarang / Tutup" (0 = Minggu, 1 = Senin, … 6 = Sabtu)
  openDays: [1, 2, 3, 4, 5, 6],
  openTime: "08:00",
  closeTime: "17:00",
  timezone: "Asia/Jakarta",   // WIB. WITA: "Asia/Makassar", WIT: "Asia/Jayapura"
};

/* ---------- PRODUK ----------
   image: taruh foto di assets/img/products/ lalu tulis namanya.
   Kalau file belum ada, otomatis tampil ilustrasi. */
window.PRODUCTS = [
  {
    id: "neon-box",
    category: "Neon Box",   // untuk menampilkan karya terkait
    name: "Neon Box",
    tagline: "Terang siang & malam",
    icon: "box",
    image: "assets/img/products/neon-box.jpg",
    desc: "Papan nama dengan lampu LED di dalam, permukaan akrilik atau flexi. Pilihan paling populer untuk toko, kafe, klinik, dan kantor.",
    specs: [
      ["Bahan", "Rangka besi hollow / aluminium, akrilik, flexi backlite"],
      ["Lampu", "LED modul hemat listrik"],
      ["Bentuk", "Kotak, bulat, custom, 1 atau 2 sisi"],
    ],
    uses: ["Toko", "Kafe", "Klinik", "Kantor"],
    startPrice: "",   // opsional, contoh: "Rp 350.000 / m²"
    badge: "",        // opsional, contoh: "Terlaris" atau "Baru"
  },
  {
    id: "huruf-timbul",
    category: "Huruf Timbul",   // untuk menampilkan karya terkait
    name: "Huruf Timbul",
    tagline: "Kesan premium & elegan",
    icon: "type",
    image: "assets/img/products/huruf-timbul.jpg",
    desc: "Huruf 3D dari stainless, galvanis, atau akrilik. Bisa dengan lampu (front-lit / back-lit) atau tanpa lampu.",
    specs: [
      ["Bahan", "Stainless gold/silver, galvanis, akrilik, PVC"],
      ["Lampu", "Front-lit, back-lit (halo), atau tanpa lampu"],
      ["Finishing", "Mirror, hairline, cat duco"],
    ],
    uses: ["Fasad gedung", "Lobby", "Showroom"],
    startPrice: "",   // opsional, contoh: "Rp 350.000 / m²"
    badge: "",        // opsional, contoh: "Terlaris" atau "Baru"
  },
  {
    id: "neon-flex",
    category: "Neon Flex",   // untuk menampilkan karya terkait
    name: "Neon Flex",
    tagline: "Estetik buat konten",
    icon: "spark",
    image: "assets/img/products/neon-flex.jpg",
    desc: "Lampu neon fleksibel berbentuk tulisan atau logo. Cocok untuk dekorasi dinding, photo spot, dan interior kekinian.",
    specs: [
      ["Bahan", "Silikon LED neon flex + backing akrilik"],
      ["Warna", "Banyak pilihan, bisa RGB"],
      ["Daya", "Adaptor 12V, aman untuk indoor"],
    ],
    uses: ["Kafe", "Event", "Kamar", "Photo spot"],
    startPrice: "",   // opsional, contoh: "Rp 350.000 / m²"
    badge: "",        // opsional, contoh: "Terlaris" atau "Baru"
  },
  {
    id: "billboard",
    category: "Billboard",   // untuk menampilkan karya terkait
    name: "Billboard & Baliho",
    tagline: "Jangkauan maksimal",
    icon: "board",
    image: "assets/img/products/billboard.jpg",
    desc: "Media promosi luar ruang ukuran besar. Konstruksi kokoh, cetak tahan cuaca, plus jasa pemasangan.",
    specs: [
      ["Konstruksi", "Besi WF / pipa, pondasi cor"],
      ["Media", "Flexi korea / frontlite UV"],
      ["Ukuran", "Custom, mulai 2×3 m"],
    ],
    uses: ["Pinggir jalan", "Event", "Properti"],
    startPrice: "",   // opsional, contoh: "Rp 350.000 / m²"
    badge: "",        // opsional, contoh: "Terlaris" atau "Baru"
  },
  {
    id: "pylon",
    category: "Pylon",   // untuk menampilkan karya terkait
    name: "Pylon Sign",
    tagline: "Penanda yang ikonik",
    icon: "pylon",
    image: "assets/img/products/pylon.jpg",
    desc: "Tiang signage berdiri tegak untuk penanda lokasi usaha, SPBU, perumahan, atau area parkir.",
    specs: [
      ["Bahan", "Rangka besi, cladding ACP"],
      ["Logo", "Neon box / huruf timbul menyala"],
      ["Ukuran", "Custom sesuai lokasi"],
    ],
    uses: ["Perumahan", "Dealer", "Ruko", "Mall"],
    startPrice: "",   // opsional, contoh: "Rp 350.000 / m²"
    badge: "",        // opsional, contoh: "Terlaris" atau "Baru"
  },
  {
    id: "acp-fasad",
    category: "Fasad ACP",   // untuk menampilkan karya terkait
    name: "Fasad ACP",
    tagline: "Tampilan depan modern",
    icon: "layers",
    image: "assets/img/products/acp.jpg",
    desc: "Pelapisan muka bangunan dengan panel ACP. Rapi, modern, dan sekaligus jadi latar untuk signage.",
    specs: [
      ["Bahan", "ACP 3–4 mm, rangka hollow galvanis"],
      ["Warna", "Solid, metalik, motif kayu"],
      ["Bonus", "Integrasi huruf timbul / neon box"],
    ],
    uses: ["Ruko", "Kantor", "Showroom"],
    startPrice: "",   // opsional, contoh: "Rp 350.000 / m²"
    badge: "",        // opsional, contoh: "Terlaris" atau "Baru"
  },
  {
    id: "indoor",
    category: "Indoor",   // untuk menampilkan karya terkait
    name: "Signage Indoor",
    tagline: "Rapi di setiap sudut",
    icon: "door",
    image: "assets/img/products/indoor.jpg",
    desc: "Papan nama ruangan, petunjuk arah, logo dinding, plakat, dan wayfinding untuk kantor dan gedung.",
    specs: [
      ["Bahan", "Akrilik, stainless, kayu, PVC"],
      ["Teknik", "Laser cut, CNC, UV print"],
      ["Jenis", "Door sign, wayfinding, wall logo"],
    ],
    uses: ["Kantor", "Sekolah", "Rumah sakit"],
    startPrice: "",   // opsional, contoh: "Rp 350.000 / m²"
    badge: "",        // opsional, contoh: "Terlaris" atau "Baru"
  },
  {
    id: "branding",
    category: "Branding",   // untuk menampilkan karya terkait
    name: "Branding & Sticker",
    tagline: "Iklan yang ikut jalan",
    icon: "car",
    image: "assets/img/products/branding.jpg",
    desc: "Sticker mobil, kaca toko, one way vision, dan branding armada untuk promosi yang bergerak ke mana-mana.",
    specs: [
      ["Bahan", "Vinyl ritrama / oracal, one way"],
      ["Cetak", "Print + laminasi, cutting sticker"],
      ["Pasang", "Rapi tanpa gelembung"],
    ],
    uses: ["Mobil", "Kaca toko", "Etalase"],
    startPrice: "",   // opsional, contoh: "Rp 350.000 / m²"
    badge: "",        // opsional, contoh: "Terlaris" atau "Baru"
  },
];

/* ---------- PORTOFOLIO ----------
   1. Simpan foto di folder assets/img/portfolio/ (misal: p1.jpg)
   2. Isi judul, kategori, lokasi.
   featured: true  -> kartu besar (2x2), wide: true -> kartu lebar (2x1).
   Tips: 3 featured + 3 wide + 6 biasa = grid rapi tanpa celah.
   Kalau file foto belum ada, tampil placeholder. */
window.PORTFOLIO = [
  { title: "Huruf Timbul Stainless Gold", category: "Huruf Timbul", place: "Kantor", image: "assets/img/portfolio/p1.jpg", featured: true },
  { title: "Neon Box Kafe 2 Sisi", category: "Neon Box", place: "Kafe", image: "assets/img/portfolio/p2.jpg" },
  { title: "Neon Flex Photo Spot", category: "Neon Flex", place: "Interior", image: "assets/img/portfolio/p3.jpg", wide: true },
  { title: "Billboard 4×8 m", category: "Billboard", place: "Pinggir jalan", image: "assets/img/portfolio/p4.jpg", featured: true },
  { title: "Fasad ACP & Logo Menyala", category: "Fasad ACP", place: "Ruko", image: "assets/img/portfolio/p5.jpg" },
  { title: "Pylon Sign Perumahan", category: "Pylon", place: "Perumahan", image: "assets/img/portfolio/p6.jpg" },
  { title: "Neon Box Bulat Barbershop", category: "Neon Box", place: "Barbershop", image: "assets/img/portfolio/p7.jpg" },
  { title: "Wall Logo Akrilik Lobby", category: "Indoor", place: "Lobby", image: "assets/img/portfolio/p8.jpg", wide: true },
  { title: "Branding Mobil Box", category: "Branding", place: "Armada", image: "assets/img/portfolio/p9.jpg" },
  { title: "Huruf Timbul Back-lit", category: "Huruf Timbul", place: "Klinik", image: "assets/img/portfolio/p10.jpg", featured: true },
  { title: "Neon Flex Logo Brand", category: "Neon Flex", place: "Toko", image: "assets/img/portfolio/p11.jpg", wide: true },
  { title: "Sticker Kaca Etalase", category: "Branding", place: "Toko", image: "assets/img/portfolio/p12.jpg" },
];

/* ---------- KEUNGGULAN (section "Kenapa Armada") ----------
   icon: pen | tool | shield | pin | chat | clock */
window.WHY = [
  { icon: "pen", title: "Free desain & mockup", text: "Lihat dulu gambaran hasilnya di lokasi kamu sebelum produksi dimulai." },
  { icon: "tool", title: "Workshop sendiri", text: "Kualitas terkontrol, harga lebih bersaing." },
  { icon: "shield", title: "Bahan pilihan", text: "Material tahan cuaca untuk outdoor." },
  { icon: "pin", title: "Terima pasang", text: "Tim kami datang, pasang, dan cek sampai lampu menyala." },
];

/* ---------- FAQ ----------
   Sesuaikan jawaban dengan kebijakan usaha Anda. */
window.FAQ = [
  { q: "Apakah desainnya gratis?", a: "Ya. Konsultasi dan mockup desain gratis, jadi kamu bisa lihat gambaran hasilnya sebelum memutuskan produksi." },
  { q: "Bagaimana harga dihitung?", a: "Harga tergantung jenis bahan, ukuran, jenis lampu, dan tingkat kesulitan pemasangan. Kirim foto lokasi dan perkiraan ukuran lewat WhatsApp, kami buatkan penawarannya." },
  { q: "Berapa lama pengerjaannya?", a: "Tergantung jenis produk, ukuran, dan antrean produksi. Estimasi jadwal pasti kami infokan setelah desain disetujui." },
  { q: "Bisa pesan dalam jumlah kecil?", a: "Bisa. Dari neon flex kecil untuk dekorasi sampai billboard besar, semuanya kami layani." },
  { q: "Melayani pemasangan di luar kota?", a: "Bisa. Hubungi kami lewat WhatsApp untuk info area layanan serta biaya pengiriman dan pemasangan." },
];

/* ---------- TESTIMONI ----------
   Section testimoni otomatis muncul kalau daftar ini diisi.
   Contoh:
   { name: "Budi", business: "Kopi Senja", text: "Neon box-nya rapi dan terang!", rating: 5, product: "Neon Box" },
*/
window.TESTIMONI = [];
