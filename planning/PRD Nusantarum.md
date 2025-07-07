Product Requirements Document (PRD) - Modul Nusantarum

1. Tujuan
Modul Nusantarum bertujuan untuk menjadi database komprehensif dan terpusat mengenai perfumer, brand parfum, dan varian parfum di Indonesia. Tujuannya adalah untuk menyediakan sumber informasi yang kredibel bagi komunitas parfum, mempromosikan talenta lokal, dan memfasilitasi penemuan produk bagi pengguna SensasiWangi.id.

2. Fitur Utama

2.1. Database Perfumer
- **Profil Perfumer:** Informasi mengenai perfumer (nama, bio, spesialisasi, tautan ke media sosial/website).
- **Daftar Karya:** Daftar parfum yang telah diciptakan oleh perfumer, dengan tautan ke detail varian parfum.
- **Tautan ke Profil Pengguna:** Jika perfumer adalah pengguna terdaftar di SensasiWangi.id, profil Nusantarum mereka dapat ditautkan ke profil pengguna mereka.

2.2. Database Brand Parfum
- **Profil Brand:** Informasi mengenai brand parfum (nama, sejarah, filosofi, lokasi, tautan ke website/e-commerce).
- **Daftar Varian Parfum:** Daftar semua varian parfum yang dirilis oleh brand, dengan tautan ke detail varian parfum.
- **Tautan ke Penjual di Marketplace:** Jika brand memiliki produk yang dijual di marketplace SensasiWangi.id, tautan langsung ke listing produk tersebut.

2.3. Database Varian Parfum
- **Detail Varian Parfum:** Informasi lengkap mengenai setiap varian parfum:
    - Nama Parfum.
    - Brand.
    - Perfumer (jika diketahui).
    - Deskripsi Aroma (notes: top, middle, base).
    - Klasifikasi Aroma (misalnya, Floral, Woody, Oriental, Fresh).
    - Konsentrasi (EDP, EDT, Extrait).
    - Tahun Rilis.
    - Ukuran Botol yang Tersedia.
    - Gambar Produk.
    - **Ulasan Komunitas:** Agregasi ulasan dan rating dari pengguna SensasiWangi.id.
    - **Tautan Pembelian:** Tautan ke listing produk di marketplace SensasiWangi.id (jika tersedia).

2.4. Fitur Pencarian dan Filter
- **Pencarian Komprehensif:** Pengguna dapat mencari perfumer, brand, atau varian parfum berdasarkan kata kunci (nama, deskripsi, notes).
- **Filter Lanjutan:** Filter hasil pencarian berdasarkan:
    - Kategori Aroma.
    - Konsentrasi.
    - Tahun Rilis.
    - Lokasi Brand/Perfumer.
    - Ketersediaan di Marketplace.

2.5. Kontribusi Komunitas (Fase Lanjut)
- **Pengajuan Data:** Pengguna dapat mengajukan data baru (perfumer, brand, varian) atau mengusulkan koreksi untuk data yang sudah ada.
- **Proses Verifikasi:** Semua pengajuan akan melalui proses verifikasi oleh admin/moderator sebelum dipublikasikan.
- **Pemberian EXP:** Pengguna yang mengajukan data valid dan terverifikasi dapat menerima EXP (sesuai `PRD Gamifikasi.md`).

2.6. Manajemen Konten Nusantarum (Admin Panel)
- **Dashboard Khusus:** Admin akan memiliki tab khusus di Admin Panel untuk "Manajemen Nusantarum".
- **Daftar Entitas:** Menampilkan daftar perfumer, brand, dan varian parfum.
- **Tindakan Admin:**
    - Menambah, mengedit, menghapus entitas.
    - Menyetujui/menolak pengajuan data dari komunitas.
    - Mengelola kategori aroma dan klasifikasi.

3. User Flow Utama

3.1. Mencari Informasi di Nusantarum
1. Pengguna navigasi ke halaman Nusantarum.
2. Memasukkan kata kunci di bilah pencarian atau menggunakan filter.
3. Melihat hasil pencarian dan mengklik entitas untuk melihat detail lengkap.

3.2. Mengajukan Data Baru (Fase Lanjut)
1. Pengguna navigasi ke halaman "Kontribusi Nusantarum".
2. Mengisi formulir pengajuan data baru (misalnya, detail perfumer baru).
3. Mengklik "Kirim Pengajuan".
4. Admin meninjau dan memverifikasi data.
5. Jika disetujui, data dipublikasikan dan pengguna menerima EXP.

4. Teknologi & Integrasi
- **Backend:** Convex (untuk penyimpanan data Nusantarum dan logika bisnis terkait).
- **Frontend:** React + Vite (untuk UI halaman Nusantarum, detail entitas, dan formulir pengajuan).
- **Otentikasi:** Clerk (untuk manajemen pengguna dan hak akses admin/moderator).
- **Integrasi Pencarian:** Terintegrasi dengan `PRD Pencarian Global.md` untuk pencarian di seluruh platform.
- **Integrasi Gamifikasi:** Terintegrasi dengan `PRD Gamifikasi.md` untuk pemberian EXP.
- **Database Schema:** Koleksi `perfumers`, `brands`, `fragrances` dengan field yang relevan.

5. Pengukuran Keberhasilan
- Jumlah entitas (perfumer, brand, varian) dalam database.
- Jumlah pencarian yang dilakukan di Nusantarum.
- Tingkat kepuasan pengguna terhadap kualitas dan kelengkapan data.
- Jumlah kontribusi data dari komunitas (jika fitur diimplementasikan).
- Tingkat adopsi fitur Nusantarum oleh pengguna.