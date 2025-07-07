Product Requirements Document (PRD) - Modul Forum

1.  Tujuan
    Modul Forum bertujuan untuk menjadi pusat diskusi, berbagi pengetahuan, dan interaksi komunitas bagi pecinta dan pembuat parfum di Indonesia. Forum ini akan memfasilitasi pertukaran informasi, tanya jawab, dan pembangunan koneksi antar anggota.

2.  Fitur Utama

    2.1. Struktur Kategori dan Sub-Kategori
    _ **Kategori Utama:**
    _ Penikmat Parfum: Diskusi umum tentang parfum, review, rekomendasi, tips penggunaan.
    _ Pembuat Parfum: Diskusi teknis tentang formulasi, bahan baku, alat, teknik perfumery, bisnis parfum.
    _ Pengumuman: Informasi resmi dari admin, update platform, event komunitas.
    _ Lain-lain: Topik di luar dua kategori utama, saran & kritik untuk platform.
    _ **Diskusi Produk Marketplace:** Kategori khusus untuk diskusi mendalam tentang produk-produk yang dijual di marketplace, terutama parfum. Thread di kategori ini dapat ditautkan langsung ke halaman produk terkait.
    _ **Sub-Kategori:** Setiap kategori utama dapat memiliki sub-kategori untuk topik yang lebih spesifik (misalnya, di "Penikmat Parfum" bisa ada "Review Parfum Lokal", "Diskusi Brand Internasional", "Tips Memilih Aroma").
    _ **Manajemen Kategori:** Admin dapat menambah, mengedit, menghapus, dan mengatur urutan kategori/sub-kategori melalui Admin Panel.

    2.2. Pembuatan dan Pengelolaan Thread
    - **Buat Thread Baru:**
        - Pengguna dapat membuat thread baru di kategori/sub-kategori yang sesuai.
        - **Judul Thread:** Wajib, maksimal 100 karakter.
        - **Konten Thread:** Menggunakan Rich Text Editor (RTE) dengan fitur-fitur berikut:
            - Formatting dasar: Bold, Italic, Underline, Strikethrough.
            - List: Ordered list, Unordered list.
            - Link: Penyisipan hyperlink.
            - Quote: Blok kutipan.
            - Code Block: Untuk menampilkan kode.
            - Image Upload: Pengguna dapat mengunggah gambar langsung ke dalam konten. Gambar akan disimpan di layanan penyimpanan cloud (misalnya, Cloudinary) dan URL-nya disisipkan. Penanganan ukuran dan kompresi gambar akan dilakukan secara otomatis.
            - Video Embed: Menyisipkan video dari platform populer seperti YouTube/Vimeo. Mendukung penyisipan tautan video/gambar dari Facebook, Instagram, TikTok, dll., yang akan di-embed secara otomatis jika memungkinkan.
            - Tabel: Penyisipan tabel sederhana.
        - **Penautan Produk Marketplace (Opsional):** Pengguna dapat menautkan thread ke produk spesifik di Marketplace. Ini akan menampilkan kartu ringkasan produk di thread forum dan memungkinkan navigasi dua arah.
        - **Tagging:** Pengguna dapat menambahkan tag (maksimal 5) untuk membantu penemuan thread. Tag yang sudah ada akan disarankan saat mengetik. Pengguna dapat membuat tag baru secara bebas, namun tag yang sering digunakan akan diprioritaskan. Admin dapat mengelola daftar tag melalui Admin Panel.
        - **Preview:** Pengguna dapat melihat preview thread sebelum dipublikasikan.
        - **Draft:** Thread yang belum selesai dapat disimpan sebagai draft.
        - **Edit Thread:** Pembuat thread dapat mengedit thread mereka dalam batas waktu tertentu (misalnya, 24 jam setelah publikasi). Setelah itu, hanya moderator/admin yang dapat mengedit.
        - **Hapus Thread:** Pembuat thread dapat menghapus thread mereka dalam batas waktu tertentu. Setelah itu, hanya moderator/admin yang dapat menghapus.
        - **Pin Thread:** Moderator/admin dapat "pin" thread penting agar selalu muncul di bagian atas daftar thread dalam kategori tertentu.
        - **Kunci Thread:** Moderator/admin dapat "kunci" thread untuk mencegah balasan baru.

    2.3. Balasan (Replies)
    - **Tulis Balasan:** Pengguna dapat membalas thread yang ada. Menggunakan RTE dengan fitur yang sama seperti pembuatan thread, termasuk kemampuan untuk menyisipkan tautan video/gambar dari media sosial.
    - **Quote:** Pengguna dapat mengutip sebagian atau seluruh balasan/thread lain.
    - **Mention:** Pengguna dapat me-mention pengguna lain (@username) yang akan memicu notifikasi.
    - **Edit Balasan:** Pembuat balasan dapat mengedit balasan mereka dalam batas waktu tertentu.
    - **Hapus Balasan:** Pembuat balasan dapat menghapus balasan mereka dalam batas waktu tertentu.

    2.4. Voting (Upvote/Downvote)
    - Pengguna dapat memberikan upvote atau downvote pada thread dan balasan.
    - Setiap pengguna hanya dapat memberikan satu upvote atau downvote per thread/balasan.
    - Jumlah total upvote/downvote akan ditampilkan.
    - Voting akan mempengaruhi reputasi pengguna dan visibilitas thread/balasan (misalnya, thread dengan banyak downvote bisa disembunyikan atau diturunkan peringkatnya).

    2.5. Notifikasi Forum
    - **Langganan Thread:** Pengguna dapat berlangganan thread untuk menerima notifikasi setiap kali ada balasan baru.
    - **Mention:** Notifikasi ketika pengguna di-mention.
    - **Balasan pada Postingan Sendiri:** Notifikasi ketika ada balasan pada thread atau balasan yang dibuat pengguna.
    - **Notifikasi Populer:** Notifikasi opsional untuk thread yang menjadi sangat populer dalam waktu singkat.
    - Pengaturan notifikasi dapat dikelola di halaman profil pengguna.

    2.6. Pelaporan Konten (Reporting)
    _ Pengguna dapat melaporkan thread atau balasan yang melanggar aturan komunitas (misalnya, spam, kata kasar, SARA, konten tidak relevan). Proses pelaporan ini terintegrasi dengan Modul Moderasi Konten untuk deteksi otomatis dan peninjauan manual (lihat `PRD Moderasi Konten.md`).
    _ Formulir pelaporan akan meminta alasan pelaporan yang spesifik (misalnya, kategori pelanggaran seperti 'Spam', 'Ujaran Kebencian', 'Konten Dewasa').
    _ Laporan akan masuk ke Modul Moderasi Konten untuk ditinjau oleh moderator/admin. Laporan akan diprioritaskan berdasarkan tingkat keparahan pelanggaran dan jumlah laporan.
    _ **Alur Penanganan Laporan:** 1. Laporan diterima dan masuk ke antrean peninjauan di Modul Moderasi Konten. 2. Moderator/Admin meninjau konten yang dilaporkan dan bukti. 3. Moderator/Admin mengambil tindakan (misalnya, menghapus konten, mengedit, memberikan peringatan/sanksi kepada pengguna, atau mengabaikan laporan jika tidak melanggar). 4. Keputusan moderasi akan dikomunikasikan kepada pelapor (jika laporan valid) dan pengguna yang dilaporkan (jika ada tindakan sanksi). 5. Laporan ditandai sebagai selesai.

    2.7. Fitur Pencarian dan Filter
    - **Pencarian Forum:** Pengguna dapat mencari thread dan balasan berdasarkan kata kunci, judul, isi, nama pengguna, atau tag.
    - **Filter:** Filter hasil pencarian berdasarkan kategori, tanggal posting, jumlah balasan, atau popularitas (upvotes).
    - **Sorting:** Urutkan hasil berdasarkan relevansi, terbaru, atau terpopuler.

    2.8. Moderasi Forum (Melalui Admin Panel)
    - **Lihat Semua Konten:** Admin/moderator dapat melihat semua thread dan balasan, termasuk yang dilaporkan atau disembunyikan.
    - **Tindakan Moderasi:**
        - **Hapus:** Menghapus thread/balasan. Konten yang dihapus akan diganti dengan pesan placeholder yang menunjukkan bahwa konten telah dihapus oleh moderator, tetapi riwayatnya tetap ada di database untuk audit.
        - **Edit:** Mengedit konten thread/balasan. Perubahan akan dicatat di audit log.
        - **Pin:** Menampilkan thread di bagian atas daftar.
        - **Kunci:** Mencegah balasan baru.
        - **Pindahkan:** Memindahkan thread ke kategori/sub-kategori lain.
        - **Manajemen Laporan:** Meninjau laporan pengguna, mengambil tindakan, dan menandai laporan sebagai selesai.
        - **Manajemen Pengguna:** Memblokir/ban pengguna yang melanggar aturan (terintegrasi dengan Manajemen Pengguna di Admin Panel dan Modul Moderasi Konten).

    2.9. Integrasi dengan Profil Pengguna
        2.9. Integrasi dengan Profil Pengguna
    - Aktivitas forum (thread yang dibuat, balasan) akan ditampilkan di tab "Forum Activity" pada halaman profil pengguna.
    - Jumlah thread dan balasan akan berkontribusi pada statistik gamifikasi (EXP/Level) sesuai dengan aturan yang ditetapkan di PRD Gamifikasi.
    - Pengguna akan mendapatkan bonus EXP harian (5 EXP) satu kali per hari jika mereka membuat setidaknya satu postingan (thread atau balasan) di forum.
    - **Sistem Reputasi:** Reputasi pengguna akan dihitung berdasarkan rasio upvote dan downvote yang diterima pada thread dan balasan mereka. Reputasi ini akan mempengaruhi visibilitas postingan (misalnya, postingan dengan reputasi sangat rendah mungkin disembunyikan secara default atau ditandai) dan dapat berkontribusi pada sistem gamifikasi (EXP/Level).

3.  User Flow Utama

    3.1. Membuat Thread Baru 1. Pengguna login. 2. Navigasi ke halaman Forum. 3. Klik tombol "Buat Thread Baru". 4. Pilih kategori/sub-kategori. 5. Isi judul dan konten thread (dengan RTE). 6. Tambahkan tag (opsional). 7. Klik "Preview" (opsional). 8. Klik "Publikasikan". 9. Thread baru muncul di daftar forum.

    3.2. Membalas Thread 1. Pengguna login. 2. Navigasi ke thread yang ingin dibalas. 3. Gulir ke bawah ke area balasan. 4. Tulis balasan (dengan RTE). 5. Klik "Kirim Balasan". 6. Balasan muncul di thread.

    3.3. Melaporkan Konten 1. Pengguna menemukan konten yang melanggar. 2. Klik ikon "Laporkan" pada thread/balasan. 3. Pilih alasan pelaporan dari daftar atau masukkan alasan kustom. 4. Klik "Kirim Laporan". 5. Laporan masuk ke Admin Panel.

4.  Teknologi & Integrasi
    - **Frontend:** React + Vite (untuk komponen UI forum).
    - **Backend:** Convex (untuk penyimpanan data thread, balasan, kategori, voting, laporan, dan logika bisnis terkait forum).
    - **Otentikasi:** Clerk (untuk manajemen pengguna dan hak akses).
    - **Rich Text Editor:** Pemilihan library RTE (misalnya, Quill, TipTap, Draft.js) yang mendukung fitur yang dibutuhkan.
    - **Pencarian:** Convex search capabilities atau integrasi dengan solusi pencarian eksternal jika diperlukan untuk performa dan fitur canggih.
    - **Notifikasi:** Terintegrasi dengan sistem notifikasi global platform.

5.  Pengukuran Keberhasilan
    - Jumlah thread baru per hari/minggu.
    - Jumlah balasan per thread.
    - Tingkat partisipasi pengguna aktif di forum.
    - Waktu rata-rata yang dihabiskan di halaman forum.
    - Jumlah laporan konten yang valid (indikator kesehatan komunitas).
    - Tingkat retensi pengguna forum.
