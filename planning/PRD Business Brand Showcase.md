# Product Requirement Document (PRD) - Business Brand Showcase

## 1. Pendahuluan

Dokumen ini menguraikan persyaratan untuk modul "Business Brand Showcase" di platform SensasiWangi.id. Modul ini bertujuan untuk menyediakan halaman khusus bagi pengguna dengan akun bisnis (Business Tier) untuk menampilkan brand parfum mereka, portofolio produk, dan informasi kontak secara profesional. Ini akan berfungsi sebagai alat pemasaran dan branding bagi perfumer dan brand indie, serta memfasilitasi koneksi dengan calon pelanggan dan kolaborator.

## 2. Tujuan

- Memberikan platform bagi pengguna bisnis untuk memamerkan brand dan produk mereka.
- Meningkatkan visibilitas brand parfum lokal dan perfumer indie.
- Memfasilitasi penemuan produk dan layanan oleh pengguna lain.
- Menambah nilai bagi keanggotaan Business Tier.

## 3. Fitur Utama

### 3.1. Halaman Profil Brand (Brand Profile Page)
- Setiap pengguna Business Tier akan memiliki halaman profil brand yang dapat disesuaikan.
- **Informasi Brand:**
    - Nama Brand.
    - Logo Brand.
    - Deskripsi Brand (Rich Text Editor, mendukung gambar dan video embed).
    - Sejarah atau Filosofi Brand.
    - Alamat Fisik (opsional).
    - Jam Operasional (opsional).
- **Galeri Produk/Portofolio:**
    - Menampilkan produk-produk unggulan atau portofolio karya parfum.
    - Setiap item di galeri dapat memiliki gambar, nama, dan deskripsi singkat.
    - Tautan langsung ke halaman produk di Marketplace SensasiWangi.id (jika produk tersebut dijual di marketplace).
- **Informasi Kontak:**
    - Website Resmi.
    - Tautan Media Sosial (Instagram, TikTok, Facebook, YouTube).
    - Email Kontak.
    - Nomor Telepon (opsional).
- **Testimoni/Ulasan:** (Opsional, untuk fase lanjut) Menampilkan testimoni dari pelanggan atau kolaborator.
- **Tautan ke Profil Pengguna:** Tautan kembali ke profil pengguna pribadi pemilik brand.

### 3.2. Manajemen Halaman Brand (Admin Panel & Dashboard Penjual)
- **Akses:** Hanya pengguna dengan peran 'Business' atau 'Seller' yang telah mengaktifkan fitur ini yang dapat membuat dan mengelola halaman brand mereka.
- **Dashboard Pengelolaan:** Antarmuka yang intuitif di dashboard penjual atau pengaturan profil untuk:
    - Mengedit semua informasi brand.
    - Mengunggah dan mengelola logo brand dan gambar galeri.
    - Menambahkan/mengedit tautan media sosial dan kontak.
    - Mengelola produk yang ditampilkan di galeri.
- **Moderasi Admin:** Admin dapat meninjau dan menyetujui halaman brand baru atau perubahan signifikan untuk memastikan kepatuhan terhadap pedoman platform.

### 3.3. Direktori Brand (Brand Directory)
- Halaman khusus yang menampilkan daftar semua brand yang memiliki showcase.
- **Pencarian & Filter:** Pengguna dapat mencari brand berdasarkan nama, kategori produk, atau lokasi.
- **Sorting:** Mengurutkan brand berdasarkan abjad, popularitas, atau tanggal penambahan.
- **Tampilan Kartu:** Setiap brand ditampilkan dalam format kartu ringkasan dengan logo, nama, dan deskripsi singkat.

### 3.4. Integrasi dengan Modul Lain
- **Marketplace:** Produk yang ditampilkan di showcase dapat ditautkan langsung ke listing produk di marketplace.
- **Nusantarum:** Brand yang memiliki showcase dapat diintegrasikan atau direferensikan dalam direktori Nusantarum.
- **Profil Pengguna:** Tautan dari profil pengguna pribadi ke halaman brand showcase mereka.

## 4. User Flow Utama

### 4.1. Membuat Halaman Brand Showcase
1. Pengguna dengan akun Business Tier login.
2. Navigasi ke dashboard penjual atau pengaturan profil.
3. Klik "Buat Brand Showcase" atau "Kelola Halaman Brand".
4. Isi informasi brand (nama, deskripsi, logo, kontak, media sosial).
5. Unggah gambar untuk galeri produk dan tautkan ke produk marketplace yang relevan.
6. Simpan perubahan. Halaman brand akan dipublikasikan setelah disetujui admin (jika moderasi diaktifkan).

### 4.2. Menjelajahi Direktori Brand
1. Pengguna navigasi ke halaman "Direktori Brand".
2. Menggunakan fitur pencarian dan filter untuk menemukan brand tertentu.
3. Mengklik kartu brand untuk melihat halaman profil brand secara detail.
4. Menjelajahi galeri produk dan mengklik tautan ke marketplace atau media sosial.

## 5. Teknologi & Integrasi

- **Frontend:** React + Vite (untuk UI halaman brand, direktori, dan dashboard pengelolaan).
- **Backend:** Convex (untuk menyimpan data brand showcase).
    - Convex Functions akan digunakan untuk menyimpan, mengambil, dan memperbarui data brand.
- **Otentikasi:** Clerk (untuk manajemen pengguna dan memastikan hanya pengguna Business Tier yang dapat membuat dan mengelola showcase).
- **Penyimpanan Gambar:** Integrasi dengan layanan penyimpanan cloud (misalnya, Cloudinary) untuk logo brand dan gambar galeri.

## 6. Database Schema (Convex)

### 6.1. `business_showcases` Collection
- **Tujuan:** Menyimpan informasi halaman brand showcase.
- **Fields:**
    - `_id`: (Convex ID)
    - `userId`: (Convex ID) `_id` dari `users` pemilik showcase (indexed, unique).
    - `brandName`: (string) Nama brand.
    - `logoUrl`: (string, optional) URL logo brand.
    - `description`: (string, optional) Deskripsi brand (Rich Text/Markdown).
    - `historyPhilosophy`: (string, optional) Sejarah atau filosofi brand.
    - `physicalAddress`: (string, optional) Alamat fisik.
    - `operatingHours`: (string, optional) Jam operasional.
    - `websiteUrl`: (string, optional) URL website resmi.
    - `socialMedia`: (object, optional) Objek berisi URL media sosial (e.g., `{ instagram: 'url', tiktok: 'url' }`).
    - `contactEmail`: (string, optional) Email kontak.
    - `contactPhone`: (string, optional) Nomor telepon kontak.
    - `galleryItems`: (array of object, optional) Array objek untuk item galeri:
        - `imageUrl`: (string) URL gambar.
        - `title`: (string) Judul item.
        - `description`: (string, optional) Deskripsi item.
        - `marketplaceProductId`: (Convex ID, optional) `_id` dari `marketplace_products` jika terkait.
    - `status`: (string) Status showcase (e.g., 'draft', 'pending_review', 'published', 'rejected').
    - `createdAt`: (number)
    - `updatedAt`: (number)

## 7. Pengukuran Keberhasilan

- Jumlah pengguna Business Tier yang membuat halaman brand showcase.
- Jumlah kunjungan ke halaman brand showcase.
- Tingkat klik pada tautan produk marketplace atau media sosial dari showcase.
- Feedback dari pengguna bisnis tentang nilai modul ini.
