Product Requirements Document (PRD) - Modul Saran dan Kritik

1. Tujuan
Modul Saran dan Kritik bertujuan untuk menyediakan saluran resmi bagi pengguna SensasiWangi.id untuk menyampaikan masukan, ide, atau keluhan mengenai platform. Tujuannya adalah untuk mengumpulkan umpan balik yang berharga, meningkatkan kualitas platform secara berkelanjutan, dan memastikan suara pengguna didengar dan ditindaklanjuti.

2. Fitur Utama

2.1. Pengajuan Saran dan Kritik oleh Pengguna
- **Formulir Pengajuan:** Pengguna dapat mengajukan saran atau kritik melalui formulir khusus.
    - Formulir akan mencakup:
        - **Jenis Masukan:** Pilihan antara "Saran" atau "Kritik".
        - **Kategori (Opsional):** Pilihan kategori terkait (misalnya, Fitur, Desain, Performa, Bug, Umum).
        - **Subjek:** Judul singkat masukan (maksimal 100 karakter).
        - **Deskripsi:** Penjelasan detail masukan (mendukung Rich Text Editor untuk format teks).
        - **Lampiran (Opsional):** Pengguna dapat melampirkan file (gambar, screenshot) untuk mendukung masukan mereka.
- **Anonimitas (Opsional):** Pengguna dapat memilih untuk mengajukan masukan secara anonim. Jika anonim, EXP tidak akan diberikan.
- **Konfirmasi Pengajuan:** Pengguna akan menerima konfirmasi bahwa masukan mereka telah diterima, beserta ID referensi.

2.2. Monitoring dan Manajemen oleh Admin
- **Dashboard Admin (Tab Khusus):** Admin akan memiliki tab khusus di Admin Panel untuk "Saran dan Kritik".
    - **Daftar Masukan:** Menampilkan semua saran dan kritik yang masuk, dengan informasi:
        - ID Masukan
        - Jenis (Saran/Kritik)
        - Pengirim (Username atau Anonim)
        - Tanggal Pengajuan
        - Subjek
        - Status (Baru, Dalam Peninjauan, Ditindaklanjuti, Ditolak)
- **Filter dan Pencarian:** Admin dapat memfilter masukan berdasarkan jenis, kategori, pengirim, status, atau mencari berdasarkan kata kunci.
- **Detail Masukan:** Mengklik masukan akan menampilkan detail lengkap, termasuk deskripsi dan lampiran.
- **Tindak Lanjut Masukan:** Admin dapat mengubah status masukan menjadi "Dalam Peninjauan" atau "Ditindaklanjuti".
    - **Catatan Internal:** Admin dapat menambahkan catatan internal pada setiap masukan untuk melacak proses tindak lanjut.
    - **Pemberian EXP:** Jika masukan ditindaklanjuti dan dianggap relevan/bermanfaat, admin dapat memberikan EXP kepada pengguna yang mengajukan (jika tidak anonim). EXP akan diberikan satu kali per masukan yang ditindaklanjuti (misalnya, 10 EXP).
- **Penolakan/Penghapusan Masukan:** Admin dapat menghapus masukan yang tidak relevan, spam, atau melanggar aturan.
    - Konfirmasi penghapusan diperlukan.
    - Tidak ada EXP yang diberikan untuk masukan yang dihapus.

2.3. Notifikasi kepada Pengguna
- Pengguna akan menerima notifikasi (in-app dan/atau email) saat:
    - Masukan mereka diterima (konfirmasi).
    - Status masukan mereka berubah menjadi "Dalam Peninjauan".
    - Status masukan mereka berubah menjadi "Ditindaklanjuti" (beserta informasi EXP yang diterima).
    - Masukan mereka dihapus (dengan alasan singkat).

3. User Flow Utama

3.1. Pengguna Mengajukan Saran/Kritik
1. Pengguna login ke platform.
2. Navigasi ke halaman "Saran dan Kritik" (misalnya, melalui footer atau menu profil).
3. Mengisi formulir pengajuan (jenis, kategori, subjek, deskripsi, lampiran).
4. Mengklik "Kirim Masukan".
5. Menerima konfirmasi pengajuan.

3.2. Admin Meninjau dan Menindaklanjuti
1. Admin login ke Admin Panel.
2. Navigasi ke tab "Saran dan Kritik".
3. Melihat daftar masukan baru.
4. Membuka detail masukan yang ingin ditinjau.
5. Mengubah status menjadi "Dalam Peninjauan".
6. Melakukan tindak lanjut (misalnya, meneruskan ke tim teknis, mendiskusikan dengan tim produk).
7. Jika masukan relevan dan ditindaklanjuti, admin mengubah status menjadi "Ditindaklanjuti" dan memberikan EXP kepada pengirim (jika tidak anonim).
8. Jika tidak relevan, admin menghapus masukan.

4. Teknologi & Integrasi
- **Backend:** Convex (untuk penyimpanan data saran/kritik, status, dan logika bisnis terkait).
- **Frontend:** React + Vite (untuk UI formulir pengajuan, dashboard admin, dan notifikasi).
- **Otentikasi:** Clerk (untuk manajemen pengguna dan hak akses admin).
- **Rich Text Editor:** Pemilihan library RTE untuk deskripsi masukan.
- **Integrasi Notifikasi:** Terintegrasi dengan `PRD Notification.md` untuk pengiriman notifikasi status masukan.
- **Integrasi Gamifikasi:** Terintegrasi dengan `PRD Gamifikasi.md` untuk pemberian EXP.
- **Database Schema:** Koleksi baru `suggestions_feedback` dengan field `type`, `category`, `subject`, `description`, `attachments`, `userId` (opsional), `status`, `adminNotes`, `expAwarded`.

5. Pengukuran Keberhasilan
- Jumlah saran dan kritik yang diajukan per periode.
- Persentase masukan yang ditindaklanjuti.
- Waktu rata-rata tindak lanjut masukan.
- Tingkat kepuasan pengguna terhadap penanganan masukan (opsional, melalui survei).
- Jumlah EXP yang diberikan melalui fitur ini.
