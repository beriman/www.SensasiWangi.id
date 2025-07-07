Product Requirements Document (PRD) - Modul Pembelajaran (Learning)

1. Tujuan
Modul Pembelajaran bertujuan untuk menyediakan sumber daya edukasi terstruktur bagi pengguna SensasiWangi.id, khususnya bagi mereka yang tertarik pada dunia parfum, baik sebagai penikmat maupun pembuat. Tujuannya adalah untuk meningkatkan pengetahuan dan keterampilan pengguna, mendorong pengembangan komunitas, dan memberikan nilai tambah edukatif pada platform.

2. Fitur Utama

2.1. Manajemen Kursus
- **Daftar Kursus:** Menampilkan daftar semua kursus yang tersedia, dengan informasi seperti judul, deskripsi singkat, instruktur, durasi, tingkat kesulitan, dan harga (jika berbayar).
- **Kategori Kursus:** Mengorganisir kursus ke dalam kategori yang relevan (misalnya, Dasar-dasar Perfumery, Bahan Baku, Teknik Formulasi, Sejarah Parfum, Bisnis Parfum).
- **Modul dan Pelajaran:** Setiap kursus terdiri dari beberapa modul, dan setiap modul terdiri dari beberapa pelajaran.
- **Jenis Pelajaran:** Mendukung berbagai format pelajaran:
    - **Video:** Pelajaran berbasis video (misalnya, tutorial, demonstrasi).
    - **Teks:** Artikel atau materi bacaan.
    - **Kuis/Latihan:** Untuk menguji pemahaman pengguna.
    - **Lampiran:** File yang dapat diunduh (misalnya, PDF, lembar kerja).

2.2. Akses Kursus
- **Kursus Gratis:** Beberapa kursus akan tersedia secara gratis untuk semua pengguna terdaftar.
- **Kursus Berbayar:** Kursus premium yang memerlukan pembayaran satu kali atau langganan (terintegrasi dengan `PRD Financial Management.md`).
- **Progress Tracking:** Sistem akan melacak progres pengguna dalam menyelesaikan kursus dan pelajaran.
    - Menandai pelajaran/modul sebagai selesai.
    - Menampilkan persentase penyelesaian kursus.
- **Sertifikat Penyelesaian:** Pengguna akan menerima sertifikat digital setelah berhasil menyelesaikan kursus (opsional, untuk kursus tertentu).

2.3. Interaksi Pembelajaran
- **Kolom Komentar/Diskusi:** Pengguna dapat bertanya atau berdiskusi mengenai materi pelajaran di setiap pelajaran.
- **Tanya Jawab dengan Instruktur (Opsional):** Fitur khusus untuk mengajukan pertanyaan langsung kepada instruktur kursus.

2.4. Dashboard Pembelajar (Pengguna)
- **Kursus Saya:** Menampilkan daftar kursus yang sedang diikuti atau telah diselesaikan oleh pengguna.
- **Progress:** Menampilkan progres penyelesaian untuk setiap kursus.
- **Sertifikat Saya:** Menampilkan sertifikat yang telah diperoleh.

2.5. Manajemen Kursus (Admin Panel)
- **Dashboard Khusus:** Admin akan memiliki tab khusus di Admin Panel untuk "Manajemen Pembelajaran".
- **Daftar Kursus:** Menampilkan semua kursus dengan informasi judul, instruktur, status, dan harga.
- **Tindakan Admin:**
    - Membuat, mengedit, menghapus kursus, modul, dan pelajaran.
    - Mengunggah materi pelajaran (video, teks, kuis, lampiran).
    - Mengelola instruktur dan hak akses mereka.
    - Meninjau dan memoderasi komentar/diskusi pelajaran.
    - Mengatur harga dan diskon kursus.

3. User Flow Utama

3.1. Mengakses Kursus
1. Pengguna navigasi ke halaman Pembelajaran.
2. Menelusuri daftar kursus atau mencari berdasarkan kategori/kata kunci.
3. Memilih kursus yang diminati.
4. Jika kursus berbayar, pengguna melakukan pembayaran.
5. Mengakses materi pelajaran dan memulai pembelajaran.

3.2. Melacak Progres Pembelajaran
1. Pengguna melanjutkan pelajaran.
2. Sistem secara otomatis menandai pelajaran sebagai selesai.
3. Progres kursus diperbarui di dashboard pembelajar.

4. Teknologi & Integrasi
- **Backend:** Convex (untuk penyimpanan data kursus, modul, pelajaran, progres pengguna, dan logika bisnis terkait pembelajaran).
- **Frontend:** React + Vite (untuk UI halaman pembelajaran, antarmuka pelajaran, dan dashboard pembelajar).
- **Otentikasi:** Clerk (untuk manajemen pengguna dan hak akses instruktur/admin).
- **Video Hosting:** Integrasi dengan layanan hosting video (misalnya, Cloudinary, Vimeo, YouTube) untuk materi video.
- **Integrasi Financial Management:** Terintegrasi dengan `PRD Financial Management.md` untuk pembayaran kursus berbayar.
- **Integrasi Notifikasi:** Terintegrasi dengan `PRD Notification.md` untuk notifikasi progres kursus atau sertifikat.
- **Integrasi Gamifikasi:** Terintegrasi dengan `PRD Gamifikasi.md` untuk pemberian EXP setelah menyelesaikan kursus/modul.

5. Pengukuran Keberhasilan
- Jumlah kursus yang diakses/diselesaikan.
- Tingkat penyelesaian kursus.
- Waktu rata-rata yang dihabiskan pengguna di modul pembelajaran.
- Jumlah pengguna yang memperoleh sertifikat.
- Tingkat kepuasan pengguna terhadap materi pembelajaran.
- Peningkatan keterampilan/pengetahuan pengguna (melalui survei atau kuis).