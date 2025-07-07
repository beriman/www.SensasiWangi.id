PRD Admin Panel - sensasiwangi.id

Tujuan

Admin Panel merupakan pusat kontrol dari seluruh aktivitas sistem sensasiwangi.id. Fungsinya adalah untuk memantau, mengelola, dan mengatur semua entitas penting dalam sistem, termasuk pengguna, forum, marketplace, pembayaran, konten pembelajaran, dan laporan.

Fitur Utama

1. Dashboard Utama

Ringkasan statistik pengguna (aktif, baru, terverifikasi, diblokir)

Statistik penjualan marketplace (jumlah transaksi, total penjualan)

Aktivitas forum terbaru

Status pembayaran sambatan

Daftar laporan terbaru

2. Manajemen Pengguna

Lihat dan kelola daftar pengguna

Edit profil pengguna (role, status membership, XP, level)

Blokir/Ban pengguna

Reset password

Tambah/menghapus badge

Peninjauan laporan pengguna

3. Manajemen Forum

Lihat semua thread dan balasan

Hapus, pin, atau kunci thread

Moderasi laporan konten forum (kata kasar, spam, SARA, dll)

Statistik aktivitas forum

4. Manajemen Marketplace

Lihat semua produk aktif dan yang ditandai oleh pengguna

**Moderasi Produk:**

- **Menyetujui/Menolak Produk:** Admin dapat meninjau produk yang diunggah penjual. Moderasi dapat diterapkan pada semua produk baru, atau hanya pada produk dari penjual baru, atau produk yang dilaporkan oleh pengguna.
- **Alasan Penolakan:** Jika produk ditolak, admin wajib memberikan alasan penolakan yang jelas kepada penjual melalui notifikasi.
- **Kelola Kategori Produk:** Menambah, mengedit, atau menghapus kategori produk.
- **Tinjau Transaksi dan Status Pengiriman:** Memantau semua transaksi dan status pengiriman terkait.
- **Daftar Sambatan Aktif:** Melihat daftar sambatan yang sedang berjalan, statusnya, dan daftar pesertanya.

5. Manajemen Saran dan Kritik

- **Dashboard Khusus:** Tab khusus di Admin Panel untuk memantau dan mengelola semua saran dan kritik yang diajukan pengguna.
- **Daftar Masukan:** Menampilkan ID, jenis (saran/kritik), pengirim (username/anonim), tanggal, subjek, dan status (Baru, Dalam Peninjauan, Ditindaklanjuti, Ditolak).
- **Filter dan Pencarian:** Kemampuan untuk memfilter berdasarkan jenis, kategori, pengirim, status, atau mencari berdasarkan kata kunci.
- **Detail Masukan:** Melihat detail lengkap masukan, termasuk deskripsi dan lampiran.
- **Tindak Lanjut:** Mengubah status masukan, menambahkan catatan internal, dan memberikan EXP kepada pengirim jika ditindaklanjuti (sesuai `PRD Saran dan Kritik.md`).
- **Penghapusan:** Menghapus masukan yang tidak relevan atau melanggar aturan.

6. Sistem Keuangan
   Untuk detail lengkap mengenai alur kerja dan dashboard keuangan, termasuk verifikasi pembayaran, pelepasan dana, dan manajemen sengketa, silakan merujuk ke **PRD Financial Management.md**.

7. Manajemen Konten (CMS)

- **Daftar Konten:** Menampilkan semua konten (Artikel/Blog Post, Halaman Statis, Pengumuman) dengan informasi judul, jenis, kategori, penulis, tanggal publikasi, dan status.
- **Filter dan Pencarian:** Admin dapat memfilter konten berdasarkan jenis, kategori, status, penulis, atau mencari berdasarkan kata kunci.
- **Tindakan Admin:**
    - Membuat, mengedit, mempublikasikan/mengarsipkan, atau menghapus konten.
    - Mengelola kategori dan tag konten.
    - Menentukan prioritas tampilan konten di landing page.

8. Manajemen Moderasi Konten

- **Dashboard Moderasi:** Tab khusus di Admin Panel yang menampilkan daftar semua konten yang ditandai untuk peninjauan (baik oleh sistem maupun laporan pengguna).
- **Daftar Konten Terdeteksi:** Menampilkan ID Konten, Jenis Konten, Pengirim, Tanggal Deteksi/Laporan, Alasan Deteksi/Laporan, Skor Probabilitas (jika dari AI).
- **Detail Konten:** Admin dapat melihat detail lengkap konten yang ditandai, termasuk konteks sekitarnya.
- **Tindakan Moderator:** Menyetujui, menolak/menghapus, mengedit, memberikan peringatan, memblokir/menangguhkan pengguna (sesuai `PRD Moderasi Konten.md`).
- **Manajemen Blacklist:** Admin dapat menambah, mengedit, atau menghapus kata kunci dan frasa dari daftar hitam.

9. Manajemen Pesan Pribadi

- **Pemantauan Percakapan (Opsional/Audit):** Admin dapat memantau percakapan pribadi antar pengguna untuk tujuan audit atau investigasi jika ada laporan penyalahgunaan (sesuai `PRD Private Messaging.md`).
- **Pencarian Pesan:** Kemampuan untuk mencari pesan pribadi berdasarkan pengguna, kata kunci, atau rentang waktu.
- **Tindakan Admin:**
    - Menghapus pesan yang melanggar.
    - Memblokir pengguna yang menyalahgunakan fitur pesan pribadi.

10. Manajemen Nusantarum

- **Dashboard Khusus:** Tab khusus di Admin Panel untuk mengelola data Nusantarum (perfumer, brand, varian parfum).
- **Daftar Entitas:** Menampilkan daftar perfumer, brand, dan varian parfum.
- **Tindakan Admin:**
    - Menambah, mengedit, menghapus entitas.
    - Menyetujui/menolak pengajuan data dari komunitas (sesuai `PRD Nusantarum.md`).
    - Mengelola kategori aroma dan klasifikasi.

11. Manajemen Pembelajaran

- **Dashboard Khusus:** Tab khusus di Admin Panel untuk mengelola kursus dan materi pembelajaran.
- **Daftar Kursus:** Menampilkan semua kursus dengan informasi judul, instruktur, status, dan harga.
- **Tindakan Admin:**
    - Membuat, mengedit, menghapus kursus, modul, dan pelajaran.
    - Mengunggah materi pelajaran (video, teks, kuis, lampiran).
    - Mengelola instruktur dan hak akses mereka.
    - Meninjau dan memoderasi komentar/diskusi pelajaran.
    - Mengatur harga dan diskon kursus.

12. Badge & Sistem Level

- Buat dan kelola jenis badge pencapaian
- Tetapkan XP/Level secara manual
- Audit perubahan level pengguna

13. Notifikasi

- Buat dan kirim pengumuman ke seluruh user
- Push notifikasi untuk info penting

14. Pengaturan Sistem

- Manajemen kategori forum dan marketplace
- Konfigurasi landing page (highlight produk, promo, statistik)
- Pengaturan sistem EXP dan batasan fitur per membership

15. Audit Log

- Riwayat tindakan admin (hapus, edit, transfer dana, dsb)
- Riwayat perubahan status user atau produk

Hak Akses

- Super Admin: Akses penuh
- Admin Forum: Akses forum & pengguna
- Admin Marketplace: Akses marketplace & keuangan
- Admin Pembelajaran: Akses kursus & materi

Keamanan

- Login admin melalui autentikasi 2FA (Clerk)

Role-based access control

Log aktivitas admin dengan timestamp dan user ID

Integrasi Teknis

Backend: Convex Functions untuk operasi transaksi, user updates, verifikasi pembayaran

Frontend: Panel berbasis React dengan routing terbatas untuk admin role

Clerk: Autentikasi dan Role Management

Database: Convex (refer to PRD Database Schema.md for detailed schema)
