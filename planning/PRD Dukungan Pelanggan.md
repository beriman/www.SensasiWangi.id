Product Requirements Document (PRD) - Modul Dukungan Pelanggan

1. Tujuan
Modul Dukungan Pelanggan bertujuan untuk menyediakan saluran komunikasi yang efisien dan efektif bagi pengguna SensasiWangi.id untuk mendapatkan bantuan, menyelesaikan masalah, dan menemukan informasi yang relevan. Tujuannya adalah untuk meningkatkan kepuasan pengguna, mengurangi beban kerja tim dukungan, dan membangun kepercayaan terhadap platform.

2. Fitur Utama

2.1. Pusat Bantuan (Help Center)
- **FAQ (Frequently Asked Questions):** Kumpulan pertanyaan dan jawaban umum yang terorganisir berdasarkan kategori (misalnya, Akun, Marketplace, Forum, Pembayaran).
    - Admin dapat menambah, mengedit, menghapus, dan mengatur FAQ melalui Admin Panel.
    - Fitur pencarian di dalam FAQ untuk memudahkan pengguna menemukan jawaban.
- **Artikel Panduan/Tutorial:** Artikel yang lebih mendalam tentang cara menggunakan fitur-fitur platform, tips, dan panduan pemecahan masalah.
    - Admin dapat mengelola artikel melalui Admin Panel.
    - Mendukung Rich Text Editor untuk konten artikel, termasuk gambar dan video.

2.2. Sistem Tiket Dukungan (Support Ticket System)
- **Pengajuan Tiket:** Pengguna dapat mengajukan tiket dukungan untuk masalah yang tidak dapat diselesaikan melalui FAQ atau artikel.
    - Formulir pengajuan tiket akan meminta informasi relevan seperti kategori masalah (misalnya, Masalah Akun, Bug, Pertanyaan Umum, Masalah Transaksi), subjek, dan deskripsi detail. Konten deskripsi akan melalui proses moderasi konten (lihat `PRD Moderasi Konten.md`).
    - Pengguna dapat melampirkan file (gambar, screenshot) ke tiket mereka.
    - Setiap tiket akan memiliki ID unik untuk pelacakan.
- **Riwayat Tiket:** Pengguna dapat melihat daftar semua tiket yang pernah mereka ajukan, beserta statusnya (misalnya, Terbuka, Dalam Proses, Selesai).
- **Komunikasi dalam Tiket:** Pengguna dan agen dukungan dapat berkomunikasi langsung di dalam tiket.
    - Notifikasi akan dikirimkan saat ada balasan baru di tiket.
- **Penutupan Tiket:** Tiket dapat ditutup oleh agen dukungan setelah masalah terselesaikan atau oleh pengguna jika mereka puas dengan solusinya.

2.3. Live Chat (Fase Lanjut)
- Integrasi dengan penyedia layanan live chat pihak ketiga (misalnya, Tawk.to, Intercom) untuk dukungan real-time.
- Opsi live chat akan tersedia pada jam operasional tertentu.

2.4. Integrasi dengan Modul Lain
- **Profil Pengguna:** Riwayat tiket dukungan dapat diakses dari halaman profil pengguna.
- **Notifikasi:** Notifikasi akan dikirimkan kepada pengguna saat status tiket berubah atau ada balasan baru.
- **Admin Panel:** Admin dan agen dukungan akan memiliki dashboard khusus untuk mengelola tiket, FAQ, dan artikel.
- **Auth:** Memastikan hanya pengguna terautentikasi yang dapat mengajukan tiket dan melihat riwayat tiket mereka.

3. User Flow Utama

3.1. Mencari Bantuan di Pusat Bantuan
1. Pengguna mengalami masalah atau memiliki pertanyaan.
2. Navigasi ke Pusat Bantuan.
3. Mencari kata kunci di FAQ atau menelusuri kategori.
4. Membaca artikel atau FAQ yang relevan.
5. Jika masalah terselesaikan, pengguna melanjutkan aktivitas.

3.2. Mengajukan Tiket Dukungan
1. Pengguna tidak menemukan solusi di Pusat Bantuan.
2. Mengklik tombol "Ajukan Tiket" atau "Hubungi Kami".
3. Mengisi formulir pengajuan tiket dengan detail masalah.
4. Mengunggah lampiran (opsional).
5. Mengklik "Kirim Tiket".
6. Menerima konfirmasi pengajuan tiket dan ID tiket.

3.3. Mengelola Tiket (Pengguna)
1. Pengguna login dan navigasi ke "Riwayat Tiket Saya".
2. Melihat daftar tiket dan statusnya.
3. Mengklik tiket untuk melihat detail dan balasan.
4. Membalas tiket jika diperlukan.
5. Menutup tiket jika masalah terselesaikan.

3.4. Mengelola Tiket (Agen Dukungan)
1. Agen dukungan login ke Admin Panel.
2. Navigasi ke Dashboard Dukungan Pelanggan.
3. Melihat daftar tiket baru/terbuka.
4. Mengklik tiket untuk melihat detail, riwayat komunikasi, dan informasi pengguna.
5. Membalas tiket, mengubah status, atau menetapkan ke agen lain.
6. Menutup tiket setelah masalah terselesaikan.

4. Peran & Hak Akses
- **Pengguna:** Mengakses Pusat Bantuan, mengajukan tiket, melihat riwayat tiket, berkomunikasi dalam tiket.
- **Agen Dukungan:** Mengelola tiket (melihat, membalas, mengubah status, menetapkan), mengelola FAQ dan artikel di Pusat Bantuan.
- **Admin:** Semua hak akses agen dukungan, ditambah manajemen pengguna dukungan, melihat laporan kinerja tim dukungan.

5. Teknologi & Integrasi
- **Backend:** Convex (untuk penyimpanan data tiket, FAQ, artikel, dan logika bisnis terkait sistem dukungan).
- **Frontend:** React + Vite (untuk UI Pusat Bantuan, formulir tiket, riwayat tiket, dan antarmuka agen dukungan).
- **Otentikasi:** Clerk (untuk manajemen pengguna dan hak akses).
- **Rich Text Editor:** Pemilihan library RTE untuk penulisan artikel dan deskripsi tiket.
- **Notifikasi:** Terintegrasi dengan modul Notifikasi untuk pengiriman notifikasi status tiket.

6. Pengukuran Keberhasilan
- **Waktu Respons Rata-rata:** Waktu rata-rata dari pengajuan tiket hingga balasan pertama.
- **Waktu Penyelesaian Rata-rata:** Waktu rata-rata dari pengajuan tiket hingga penutupan tiket.
- **Tingkat Kepuasan Pelanggan (CSAT):** Survei singkat setelah tiket ditutup.
- **Jumlah Tiket yang Diselesaikan:** Total tiket yang berhasil diselesaikan.
- **Tingkat Resolusi Pertama Kontak:** Persentase masalah yang terselesaikan pada interaksi pertama.
- **Jumlah Kunjungan Pusat Bantuan:** Mengukur seberapa sering pengguna mencari bantuan sendiri.
- **Tingkat Pengajuan Tiket:** Mengukur seberapa sering pengguna mengajukan tiket setelah mengunjungi Pusat Bantuan.
