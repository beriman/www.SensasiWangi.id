Product Requirements Document (PRD) - Modul Notifikasi

1.  Tujuan
    Modul Notifikasi bertujuan untuk memberikan informasi yang relevan dan tepat waktu kepada pengguna SensasiWangi.id mengenai aktivitas penting di platform, interaksi dengan pengguna lain, dan pengumuman dari admin. Tujuannya adalah untuk meningkatkan keterlibatan pengguna, memastikan mereka tidak melewatkan informasi krusial, dan memberikan pengalaman yang personalisasi.

2.  Fitur Utama

    2.1. Jenis Notifikasi
    _ **Notifikasi Dalam Aplikasi (In-App Notifications):** Ditampilkan di dalam antarmuka pengguna platform (misalnya, ikon lonceng dengan badge jumlah notifikasi belum dibaca, daftar notifikasi di dropdown atau halaman khusus).
    _ **Notifikasi Email:** Dikirimkan ke alamat email terdaftar pengguna untuk notifikasi penting atau ringkasan aktivitas. \* **Push Notifications (Opsional untuk Fase Lanjut):** Notifikasi yang dikirimkan ke perangkat pengguna (desktop browser atau mobile app jika ada) bahkan saat aplikasi tidak dibuka. Membutuhkan persetujuan pengguna.

    2.2. Pemicu Notifikasi (Triggers)
    _ **Interaksi Pengguna:**
    _ Pesan pribadi baru diterima (lihat `PRD Private Messaging.md`).
    _ Balasan baru di thread forum yang diikuti atau dibuat.
    _ Pengguna di-mention (@username) di forum atau komentar.
    _ Upvote/downvote pada postingan/balasan pengguna.
    _ Permintaan follow baru.
    _ **Aktivitas Marketplace:**
    _ Pesanan baru diterima (untuk penjual).
    _ Status pesanan berubah (misalnya, 'dibayar', 'dikirim', 'diterima').
    _ Dana dilepaskan ke penjual.
    _ Produk di wishlist tersedia kembali atau harganya turun.
    _ Sambatan/group buy mencapai target atau dibatalkan (lihat `PRD Sambatan.md` untuk detail).
    _ **Aktivitas Sistem/Admin:**
    _ Pengumuman penting dari admin (misalnya, maintenance, fitur baru).
    _ Status laporan konten/pengguna berubah.
    _ Akun diblokir/ditangguhkan.
    _ Badge baru diperoleh (sesuai PRD Gamifikasi).
    _ Level gamifikasi meningkat (sesuai PRD Gamifikasi).
    _ **Aktivitas Saran dan Kritik:**
    _ Status masukan saran/kritik berubah.
    _ Balasan baru pada masukan saran/kritik yang diajukan.
    _ **Aktivitas Moderasi Konten:**
    _ Konten pengguna ditandai untuk peninjauan.
    _ Konten pengguna ditolak/dihapus.
    _ Pengguna menerima peringatan/sanksi moderasi.
    _ **Aktivitas Pembelajaran (jika modul Learning diimplementasikan):**
    _ Kursus baru tersedia.
    _ Progres kursus diperbarui.
    _ Sertifikat diperoleh.
    _ **Aktivitas Dukungan Pelanggan:**
    _ Status tiket dukungan berubah.
    _ Balasan baru pada tiket dukungan yang diajukan.

    2.3. Pengelolaan Notifikasi oleh Pengguna
    _ **Halaman Pengaturan Notifikasi:** Pengguna dapat mengakses halaman khusus di pengaturan profil mereka untuk mengelola preferensi notifikasi.
    _ **Preferensi Saluran:** Pengguna dapat memilih saluran notifikasi (in-app, email, push) untuk setiap jenis notifikasi.
    _ **Frekuensi Email:** Pengguna dapat mengatur frekuensi email notifikasi (misalnya, instan, harian, mingguan).
    _ **Nonaktifkan Notifikasi:** Pengguna dapat menonaktifkan jenis notifikasi tertentu secara keseluruhan.

    2.4. Tampilan & Manajemen Notifikasi In-App
    _ **Ikon Lonceng:** Ikon lonceng di header navigasi akan menampilkan badge dengan jumlah notifikasi yang belum dibaca.
    _ **Daftar Notifikasi:** Mengklik ikon lonceng akan menampilkan daftar notifikasi terbaru (misalnya, 10-20 notifikasi terakhir).
    _ **Halaman Notifikasi Penuh:** Tautan ke halaman khusus yang menampilkan semua notifikasi, dengan opsi filter (misalnya, 'belum dibaca', 'semua', 'berdasarkan jenis') dan pagination.
    _ **Tandai Sudah Dibaca:** Notifikasi akan otomatis ditandai sudah dibaca saat diklik atau saat pengguna mengunjungi halaman notifikasi penuh. Opsi "Tandai Semua Sudah Dibaca" juga tersedia. \* **Hapus Notifikasi:** Pengguna dapat menghapus notifikasi individual dari daftar mereka.

    2.5. Integrasi dengan Modul Lain
    _ Setiap modul (Forum, Marketplace, Private Messaging, Admin Panel, Learning) akan memicu notifikasi yang relevan melalui API notifikasi terpusat.
    _ Notifikasi akan menyertakan tautan langsung ke konten atau halaman yang relevan (misalnya, tautan ke thread forum, halaman detail pesanan, profil pengirim pesan).

    2.6. Konten Notifikasi & Templating
    _ **Templating:** Konten notifikasi akan dibuat menggunakan template yang dapat dikonfigurasi, memungkinkan penyisipan data dinamis (misalnya, nama pengguna, judul thread, nama produk, status pesanan).
    _ **Personalisasi:** Notifikasi akan dipersonalisasi untuk pengguna yang menerima, menggunakan data profil dan preferensi mereka.

    2.7. Prioritas & Batching Notifikasi
    _ **Prioritas:** Notifikasi akan memiliki tingkat prioritas (misalnya, 'kritis', 'penting', 'informasi') yang dapat mempengaruhi cara dan kecepatan pengirimannya.
    _ **Batching:** Untuk notifikasi yang sering terjadi (misalnya, banyak balasan di thread yang sama), sistem dapat menggabungkan beberapa notifikasi menjadi satu ringkasan untuk menghindari spamming pengguna.

    2.8. Penanganan Notifikasi yang Tidak Terkirim
    _ Sistem akan memiliki mekanisme retry untuk notifikasi yang gagal terkirim (misalnya, email bounce, push notification gagal).
    _ Log kegagalan pengiriman akan dicatat untuk pemantauan oleh admin.

    2.9. Laporan Notifikasi untuk Admin \* Admin akan memiliki akses ke laporan di Admin Panel yang menampilkan metrik pengiriman notifikasi (misalnya, jumlah email terkirim, jumlah push notification terkirim, tingkat kegagalan, tingkat klik).

3.  User Flow Utama

    3.1. Menerima dan Melihat Notifikasi 1. Aktivitas terjadi di platform (misalnya, pesan baru diterima). 2. Sistem notifikasi membuat entri notifikasi baru di database. 3. Ikon lonceng di UI pengguna menampilkan badge notifikasi belum dibaca. 4. Pengguna mengklik ikon lonceng. 5. Daftar notifikasi terbaru ditampilkan. 6. Pengguna mengklik notifikasi tertentu. 7. Pengguna diarahkan ke halaman/konten yang relevan, dan notifikasi ditandai sudah dibaca.

    3.2. Mengelola Preferensi Notifikasi 1. Pengguna login. 2. Navigasi ke halaman pengaturan profil. 3. Pilih tab "Pengaturan Notifikasi". 4. Mengatur preferensi untuk setiap jenis notifikasi (saluran, frekuensi). 5. Klik "Simpan Perubahan".

4.  Teknologi & Integrasi
    - **Frontend:** React + Vite (untuk komponen UI notifikasi, ikon lonceng, halaman pengaturan).
    - **Backend:** Convex (untuk penyimpanan data notifikasi di `notifications` collection, dan Convex functions untuk memicu pembuatan notifikasi).
      - Convex Realtime Queries akan digunakan untuk memperbarui badge notifikasi in-app secara real-time.
    - **Otentikasi:** Clerk (untuk mengidentifikasi pengguna dan hak akses).
    - **Email Service:** Integrasi dengan layanan pengiriman email (misalnya, SendGrid, Mailgun) untuk notifikasi email.
    - **Push Notification Service (Opsional):** Integrasi dengan layanan push notification (misalnya, OneSignal, Firebase Cloud Messaging) jika fitur ini diimplementasikan.

5.  Pengukuran Keberhasilan
    - Tingkat klik (Click-Through Rate - CTR) notifikasi.
    - Jumlah notifikasi yang dikirim dan diterima.
    - Tingkat pembukaan email notifikasi.
    - Tingkat retensi pengguna yang mengaktifkan notifikasi.
    - Jumlah pengguna yang menyesuaikan preferensi notifikasi mereka.
