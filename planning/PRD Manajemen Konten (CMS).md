Product Requirements Document (PRD) - Modul Manajemen Konten (CMS)

1. Tujuan
Modul Manajemen Konten (CMS) bertujuan untuk menyediakan alat yang fleksibel dan efisien bagi admin/editor SensasiWangi.id untuk membuat, mengelola, dan mempublikasikan berbagai jenis konten informatif dan promosi di luar forum. Tujuannya adalah untuk memperkaya informasi di platform, meningkatkan SEO, dan mendukung strategi pemasaran, termasuk menampilkan preview konten terbaru di landing page.

2. Fitur Utama

2.1. Jenis Konten yang Didukung
- **Artikel/Blog Post:** Konten naratif panjang dengan teks, gambar, dan video.
- **Halaman Statis:** Halaman seperti "Tentang Kami", "Kebijakan Privasi", "Syarat & Ketentuan", "Kontak".
- **Pengumuman/Berita:** Konten singkat dan tepat waktu untuk update penting.
- **Patch Notes/Website Updates:** Informasi detail mengenai perubahan, perbaikan bug, dan penambahan fitur pada platform.

2.2. Pembuatan dan Pengelolaan Konten

2.2.1. Pembuatan Konten dengan Bantuan AI
- **Generasi Draf:** Admin/editor dapat memberikan prompt atau topik, dan AI akan menghasilkan draf awal konten (artikel, pengumuman, dll.).
- **Penyempurnaan:** Draf yang dihasilkan AI dapat diedit dan disempurnakan sepenuhnya oleh admin/editor menggunakan Rich Text Editor.
- **Pilihan Gaya/Nada (Opsional):** Opsi untuk memilih gaya penulisan atau nada (misalnya, formal, kasual, informatif) sebelum generasi konten.
- **Integrasi AI:** Fitur ini akan terintegrasi dengan model AI (misalnya, melalui API).

- **Rich Text Editor (RTE):** Admin/editor dapat membuat dan mengedit konten menggunakan RTE dengan fitur-fitur berikut:
    - Formatting dasar: Bold, Italic, Underline, Strikethrough.
    - List: Ordered list, Unordered list.
    - Link: Penyisipan hyperlink.
    - Quote: Blok kutipan.
    - Code Block: Untuk menampilkan kode.
    - Image Upload: Mengunggah gambar langsung ke dalam konten. Gambar akan disimpan di layanan penyimpanan cloud (misalnya, Cloudinary) dan URL-nya disisipkan. Penanganan ukuran dan kompresi gambar akan dilakukan secara otomatis.
    - Video Embed: Menyisipkan video dari platform populer seperti YouTube/Vimeo.
    - Tabel: Penyisipan tabel sederhana.
- **Manajemen Media:** Perpustakaan media terpusat untuk mengelola gambar dan video yang diunggah.
- **Kategori Konten:** Mengatur konten ke dalam kategori yang relevan untuk navigasi dan pengorganisasian yang lebih baik.
- **Tagging:** Menambahkan tag untuk meningkatkan kemampuan pencarian dan relevansi.
- **SEO Friendly:**
    - Pengaturan Meta Title dan Meta Description.
    - Pengaturan URL Slug yang dapat disesuaikan.
    - Dukungan untuk Canonical URLs.
- **Penjadwalan Publikasi:** Konten dapat dijadwalkan untuk dipublikasikan pada tanggal dan waktu tertentu di masa mendatang.
- **Status Konten:** Draft, Published, Archived, Pending Review.
- **Versi Konten (Opsional):** Melacak riwayat perubahan konten dan kemampuan untuk mengembalikan ke versi sebelumnya.

2.3. Preview Konten di Landing Page
- **Integrasi Landing Page:** Landing page akan menampilkan preview dari 2 konten terbaru yang berstatus "Published".
- **Format Preview:** Preview akan mencakup:
    - Judul Konten.
    - Gambar Thumbnail (jika ada).
    - Cuplikan singkat/ringkasan (misalnya, 100-150 karakter pertama).
    - Tautan "Baca Selengkapnya" yang mengarah ke halaman detail konten penuh.
- **Prioritas Tampilan:** Admin dapat secara manual memilih konten mana yang akan diprioritaskan untuk ditampilkan di landing page jika ada lebih dari 2 konten terbaru.

2.4. Manajemen Konten (Admin Panel)
- **Daftar Konten:** Menampilkan semua konten dengan informasi judul, jenis, kategori, penulis, tanggal publikasi, dan status.
- **Filter dan Pencarian:** Admin dapat memfilter konten berdasarkan jenis, kategori, status, penulis, atau mencari berdasarkan kata kunci.
- **Tindakan Admin:**
    - Edit Konten.
    - Publikasikan/Arsipkan Konten.
    - Hapus Konten (dengan konfirmasi).
    - Ubah Kategori/Tag.

3. User Flow Utama

3.1. Admin Membuat Konten Baru
1. Admin/editor login ke Admin Panel.
2. Navigasi ke "Manajemen Konten" dan klik "Buat Konten Baru".
3. Pilih jenis konten (Artikel/Halaman Statis/Pengumuman).
4. Isi judul, konten (menggunakan RTE), kategori, tag, dan pengaturan SEO.
5. Unggah gambar/video yang relevan.
6. Atur status (Draft/Published/Scheduled) dan tanggal publikasi (jika Scheduled).
7. Klik "Simpan" atau "Publikasikan".

3.2. Pengguna Melihat Preview di Landing Page
1. Pengguna mengunjungi landing page SensasiWangi.id.
2. Melihat 2 preview konten terbaru yang ditampilkan di bagian khusus.
3. Mengklik preview untuk membaca konten lengkap di halaman detail.

4. Peran & Hak Akses
- **Admin:** Akses penuh untuk membuat, mengelola, dan mempublikasikan semua jenis konten.
- **Editor (Opsional):** Dapat membuat dan mengedit konten, tetapi mungkin memerlukan persetujuan admin untuk publikasi.

5. Teknologi & Integrasi
- **Backend:** Convex (untuk penyimpanan data konten, kategori, tag, dan logika bisnis terkait CMS).
- **Frontend:** React + Vite (untuk UI Admin Panel CMS, RTE, dan tampilan konten di frontend).
- **Otentikasi:** Clerk (untuk manajemen pengguna dan hak akses admin/editor).
- **Rich Text Editor Library:** Pemilihan library RTE (misalnya, Quill, TipTap, Draft.js) yang mendukung fitur yang dibutuhkan.
- **Image/Video Storage:** Integrasi dengan layanan penyimpanan cloud (misalnya, Cloudinary, AWS S3) untuk media.
- **Integrasi Landing Page:** Data konten terbaru akan diambil dari Convex dan ditampilkan di komponen landing page.
- **Integrasi AI:** Integrasi dengan layanan AI generatif (misalnya, Google Gemini API, OpenAI API) untuk fitur pembuatan konten dengan bantuan AI.

6. Pengukuran Keberhasilan
- Jumlah konten baru yang dipublikasikan per periode.
- Jumlah tampilan halaman (page views) untuk artikel/halaman statis.
- Waktu rata-rata yang dihabiskan pengguna di halaman konten.
- Tingkat klik (CTR) dari preview konten di landing page.
- Peningkatan peringkat SEO untuk kata kunci relevan.
- Jumlah konten yang dibuat dengan bantuan AI.
- Tingkat adopsi fitur pembuatan konten dengan AI (persentase admin/editor yang menggunakan fitur ini).
