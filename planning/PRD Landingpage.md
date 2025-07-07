Product Requirements Document (PRD) – sensasiwangi.id

1. Gambaran Umum

Sensasiwangi.id adalah platform komunitas daring yang didedikasikan untuk pecinta dan pembuat parfum di Indonesia. Website ini menyediakan forum diskusi, marketplace jual-beli parfum dan bahan baku, sistem pembelajaran, serta tools bisnis untuk perfumer.

2. Modul: Landing Page

Tujuan

Memberikan pengenalan yang menarik, informatif, dan mengundang pengguna baru untuk bergabung. Halaman ini bertujuan sebagai titik awal user journey.

Fitur Utama

Hero Section:

Judul utama yang kuat dan tagline yang menggugah.

Call-to-Action (CTA) utama: "Gabung Komunitas", "Jelajahi Forum", "Lihat Marketplace".

Tentang Sensasiwangi.id:

Penjelasan singkat mengenai misi dan manfaat platform.

Ikon fitur utama: Forum, Marketplace, Belajar, Tools Bisnis.

Statistik Komunitas Real-time:

- **Sumber Data:** Statistik ini akan diambil secara real-time dari Convex melalui endpoint khusus yang dioptimalkan untuk performa.
- **Frekuensi Update:** Data akan diperbarui setiap X menit/jam untuk mencerminkan kondisi terkini.
- **Metrik:**
  - Jumlah anggota.
  - Thread aktif.
  - Penjualan marketplace terbaru.

Keunggulan Komunitas:

Desain dalam bentuk tiga kolom: Gratis, Kolaboratif, Berbasis Lokal.

Testimoni:

- Slider testimoni pengguna dan pembuat parfum yang telah aktif di platform.
- **Sumber Testimoni:** Testimoni akan dikelola melalui Admin Panel, di mana admin dapat menambah, mengedit, atau menghapus testimoni.
- **Verifikasi Testimoni:** Testimoni akan diverifikasi oleh admin untuk memastikan keaslian dan kredibilitasnya sebelum ditampilkan di landing page.

Perbandingan Keanggotaan:

- Tabel perbandingan (Free, Business) dengan ikon centang dan silang.
- **Detail Fitur:** Tabel akan secara jelas membandingkan fitur-fitur yang tersedia untuk setiap tier keanggotaan (misalnya, batas posting forum, akses ke fitur marketplace tertentu, diskon kursus). Detail fitur ini akan dikelola melalui Admin Panel.
- CTA untuk Upgrade atau Mulai Gratis.

Sponsor & Partner:

Logo brand lokal, supplier, dan komunitas yang telah bekerja sama.

Footer:

Navigasi ke Forum, Marketplace, Belajar, Tentang Kami, FAQ.

Sosial Media (Instagram, TikTok, YouTube).

Newsletter signup:

- **Integrasi:** Akan diintegrasikan dengan layanan email marketing pihak ketiga (misalnya, Mailchimp, SendGrid) untuk pengelolaan daftar subscriber dan pengiriman email.
- **Data yang Dikumpulkan:** Hanya alamat email yang akan dikumpulkan pada fase awal.
- **Konfirmasi:** Proses double opt-in akan diterapkan untuk memastikan persetujuan pengguna.

Desain & UX

Gaya Neumorphism dengan nuansa lembut dan modern.

Warna dominan: Putih, pastel beige, dan aksen gold atau olive.

Navigasi sticky dan mobile-responsive.

Fungsionalitas Tambahan

Loading animasi saat pertama kali membuka halaman.

SEO optimization untuk pencarian "komunitas parfum Indonesia". Daftar kata kunci target yang lebih rinci akan dikembangkan secara terpisah.

Schema.org markup untuk artikel/testimoni akan diimplementasikan menggunakan React Helmet atau metode serupa untuk injeksi metadata dinamis.

Teknologi

Frontend: React + Vite

UI Framework: Tailwind CSS + ShadCN UI

Deployment: Netlify

Kebutuhan Database (Opsional untuk statistik real-time)

stats: jumlah pengguna, thread, penjualan.

testimonials: nama, avatar, isi, jabatan.

Pengukuran Keberhasilan

Bounce rate < 40%

Conversion rate CTA > 20%

Waktu tinggal pengguna > 1 menit
