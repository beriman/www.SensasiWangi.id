Product Requirements Document (PRD) - Modul Moderasi Konten

1. Tujuan
Modul Moderasi Konten bertujuan untuk menjaga lingkungan platform SensasiWangi.id yang aman, positif, dan inklusif dengan secara proaktif mendeteksi, mencegah, dan menindaklanjuti konten yang melanggar kebijakan komunitas (misalnya, kata-kata kasar, ujaran kebencian, SARA, spam, konten dewasa, kekerasan, penipuan). Tujuannya adalah untuk melindungi pengguna, menjaga reputasi platform, dan memastikan kepatuhan terhadap standar konten.

2. Fitur Utama

2.1. Deteksi Konten
- **Deteksi Kata Kunci/Frasa Terlarang (Blacklist):**
    - Sistem akan secara otomatis memindai semua input teks pengguna (misalnya, postingan forum, balasan, deskripsi produk, ulasan, pesan pribadi, saran/kritik) terhadap daftar kata kunci dan frasa yang dilarang.
    - Kata-kata yang terdeteksi dapat langsung disensor (misalnya, diganti dengan ***) atau memicu peninjauan manual.
- **Deteksi Konten Berbahaya Berbasis AI/ML:**
    - Penggunaan model AI/ML (misalnya, melalui API moderasi konten pihak ketiga) untuk menganalisis konten teks dan gambar/video (jika relevan) untuk mendeteksi pelanggaran yang lebih kompleks dan kontekstual seperti:
        - Ujaran Kebencian (Hate Speech)
        - Diskriminasi
        - Konten Dewasa/Seksual (Adult/Sexual Content)
        - Kekerasan/Ancaman (Violence/Threats)
        - Penipuan/Phishing
        - Spam/Promosi Berlebihan
        - Informasi Pribadi (PII) yang tidak seharusnya dibagikan.
    - Sistem akan memberikan skor probabilitas pelanggaran untuk setiap konten.

2.2. Tindakan Otomatis & Peninjauan Manual
- **Pencegahan Real-time:**
    - Untuk pelanggaran ringan (misalnya, penggunaan kata kasar yang terdeteksi blacklist), sistem dapat langsung memblokir pengiriman konten dan memberikan peringatan kepada pengguna.
    - Pengguna akan diminta untuk mengedit konten mereka sebelum dapat mempublikasikannya.
- **Penyensoran Otomatis:** Kata-kata tertentu dapat secara otomatis disensor (misalnya, diganti dengan ***) tanpa memblokir postingan.
- **Peninjauan Manual:**
    - Konten dengan skor probabilitas pelanggaran tinggi dari AI/ML, atau yang terdeteksi oleh blacklist namun memerlukan konteks, akan ditandai untuk peninjauan manual oleh moderator/admin.
    - Konten yang dilaporkan oleh pengguna juga akan masuk ke antrean peninjauan manual.
    - Konten yang sedang dalam peninjauan dapat disembunyikan sementara dari publik.

2.3. Manajemen Blacklist
- **Admin Panel:** Admin dapat menambah, mengedit, atau menghapus kata kunci dan frasa dari daftar hitam melalui Admin Panel.
- **Import/Export:** Opsi untuk mengimpor atau mengekspor daftar hitam.
- **Log Perubahan:** Mencatat riwayat perubahan pada blacklist.

2.4. Manajemen Konten Terdeteksi (Admin Panel)
- **Dashboard Moderasi:** Tab khusus di Admin Panel yang menampilkan daftar semua konten yang ditandai untuk peninjauan (baik oleh sistem maupun laporan pengguna).
    - Informasi yang ditampilkan: ID Konten, Jenis Konten (Forum Post, Product Description, dll.), Pengirim, Tanggal Deteksi/Laporan, Alasan Deteksi/Laporan, Skor Probabilitas (jika dari AI).
- **Detail Konten:** Admin dapat melihat detail lengkap konten yang ditandai, termasuk konteks sekitarnya.
- **Tindakan Moderator:**
    - **Setujui:** Menandai konten sebagai tidak melanggar dan mempublikasikannya.
    - **Tolak/Hapus:** Menghapus konten dari platform. Admin dapat memberikan alasan penghapusan yang akan dikomunikasikan kepada pengguna.
    - **Edit:** Mengedit konten untuk menghapus bagian yang melanggar dan mempublikasikan versi yang sudah diedit.
    - **Berikan Peringatan:** Mengirim peringatan resmi kepada pengguna yang melanggar.
    - **Blokir/Tangangguhkan Pengguna:** Untuk pelanggaran berulang atau serius, admin dapat memblokir atau menangguhkan akun pengguna (terintegrasi dengan modul Auth).

3. User Flow Utama

3.1. Pengguna Mengunggah Konten
1. Pengguna membuat/mengunggah konten (misalnya, postingan forum, deskripsi produk).
2. Sistem Moderasi Konten memindai konten secara real-time.
3. Jika terdeteksi pelanggaran ringan (misalnya, kata kasar dari blacklist):
    a. Sistem memblokir pengiriman dan menampilkan pesan peringatan.
    b. Pengguna mengedit konten dan mencoba lagi.
4. Jika terdeteksi pelanggaran serius atau ambigu:
    a. Sistem menandai konten untuk peninjauan manual dan menyembunyikannya sementara.
    b. Pengguna menerima notifikasi bahwa konten sedang ditinjau.

3.2. Admin/Moderator Meninjau Konten
1. Admin/moderator login ke Admin Panel.
2. Navigasi ke Dashboard Moderasi Konten.
3. Melihat daftar konten yang perlu ditinjau.
4. Membuka detail konten, menganalisis, dan mengambil tindakan yang sesuai (setujui, tolak/hapus, edit, peringatan, blokir pengguna).
5. Pengguna yang terkait menerima notifikasi mengenai tindakan yang diambil.

4. Teknologi & Integrasi
- **Backend:** Convex (untuk penyimpanan data konten yang ditandai, blacklist, log moderasi, dan logika bisnis terkait moderasi).
- **Frontend:** React + Vite (untuk UI peringatan real-time, dashboard moderasi admin).
- **Otentikasi:** Clerk (untuk manajemen hak akses moderator/admin).
- **AI Moderation API:** Integrasi dengan layanan AI pihak ketiga untuk deteksi konten berbahaya (misalnya, Google Cloud Natural Language API, Azure Content Moderator, atau model AI internal jika dikembangkan).
- **Integrasi dengan Modul Lain:**
    - **Forum:** Memindai postingan dan balasan.
    - **Marketplace:** Memindai deskripsi produk dan ulasan.
    - **Dukungan Pelanggan/Saran & Kritik:** Memindai input formulir.
    - **Notifikasi:** Mengirim notifikasi terkait moderasi.
    - **Gamifikasi:** Menerapkan sanksi gamifikasi untuk pelanggaran.
    - **Auth:** Memicu pemblokiran/penangguhan akun.
    - **Analytics & Reporting:** Menyediakan data untuk metrik moderasi.

5. Pengukuran Keberhasilan
- Jumlah konten yang terdeteksi secara otomatis.
- Akurasi deteksi otomatis (tingkat false positive/negative).
- Waktu rata-rata peninjauan manual.
- Persentase konten yang ditindaklanjuti/dihapus.
- Jumlah peringatan/pemblokiran akun.
- Tingkat pelanggaran berulang oleh pengguna.
- Tingkat kepuasan pengguna terhadap lingkungan komunitas yang aman.
