Product Requirements Document (PRD) - Modul Private Messaging

1. Tujuan
Modul Private Messaging bertujuan untuk menyediakan saluran komunikasi pribadi yang aman dan efisien antara pengguna SensasiWangi.id. Tujuannya adalah untuk memfasilitasi interaksi langsung antar anggota komunitas, mendukung transaksi di marketplace, dan meningkatkan keterlibatan pengguna secara keseluruhan.

2. Fitur Utama

2.1. Komunikasi 1-on-1
- **Memulai Percakapan:** Pengguna dapat memulai percakapan pribadi dengan pengguna lain melalui halaman profil mereka atau dari daftar kontak.
- **Mengirim Pesan Teks:** Mendukung pengiriman pesan teks.
- **Mengirim Lampiran (Opsional):** Kemampuan untuk melampirkan gambar, dokumen, atau file lain ke pesan.
- **Emoji/Stiker (Opsional):** Dukungan untuk emoji dan stiker untuk memperkaya ekspresi.

2.2. Antarmuka Percakapan
- **Daftar Percakapan:** Menampilkan daftar semua percakapan yang sedang berlangsung, dengan indikator pesan belum dibaca.
- **Tampilan Percakapan:** Antarmuka chat yang intuitif dengan riwayat pesan, kolom input pesan, dan tombol kirim.
- **Notifikasi Pesan Baru:** Notifikasi real-time saat pesan baru diterima (in-app, email, push notification).
- **Status Pesan:** Indikator status pesan (terkirim, terbaca).
- **Pencarian Pesan:** Kemampuan untuk mencari pesan dalam percakapan tertentu atau di seluruh riwayat pesan.

2.3. Pengelolaan Percakapan
- **Arsip Percakapan:** Pengguna dapat mengarsipkan percakapan untuk menyembunyikannya dari daftar utama tanpa menghapusnya.
- **Hapus Percakapan:** Pengguna dapat menghapus percakapan dari tampilan mereka (pesan mungkin tetap ada di sisi penerima).
- **Blokir Pengguna:** Pengguna dapat memblokir pengguna lain untuk mencegah mereka mengirim pesan.

2.4. Integrasi dengan Modul Lain
- **Profil Pengguna:** Tombol "Kirim Pesan" di halaman profil pengguna.
- **Marketplace:** Kemampuan untuk mengirim pesan langsung ke penjual dari halaman produk atau pesanan.
- **Notifikasi:** Terintegrasi dengan `PRD Notification.md` untuk pengiriman notifikasi pesan baru.
- **Moderasi Konten:** Pesan pribadi akan melalui proses moderasi konten untuk mendeteksi dan mencegah penyalahgunaan (lihat `PRD Moderasi Konten.md`).

3. User Flow Utama

3.1. Mengirim Pesan Baru
1. Pengguna login.
2. Navigasi ke halaman profil pengguna yang ingin dikirimi pesan atau klik tombol "Kirim Pesan" di konteks lain (misalnya, halaman produk).
3. Memulai percakapan baru.
4. Menulis pesan dan mengirimkannya.
5. Penerima menerima notifikasi pesan baru.

3.2. Membalas Pesan
1. Pengguna menerima notifikasi pesan baru atau melihat indikator pesan belum dibaca.
2. Membuka percakapan yang relevan.
3. Membaca pesan dan menulis balasan.
4. Mengirim balasan.

4. Teknologi & Integrasi
- **Backend:** Convex (untuk penyimpanan data pesan, riwayat percakapan, dan logika bisnis terkait).
- **Frontend:** React + Vite (untuk UI daftar percakapan, antarmuka chat, dan notifikasi).
- **Otentikasi:** Clerk (untuk manajemen pengguna dan hak akses).
- **Real-time Communication:** Convex Realtime Queries atau WebSockets untuk pembaruan pesan secara real-time.
- **Moderasi Konten:** Integrasi dengan `PRD Moderasi Konten.md` untuk memindai konten pesan.

5. Pengukuran Keberhasilan
- Jumlah pesan yang dikirim per hari/minggu.
- Jumlah percakapan aktif.
- Waktu respons rata-rata pesan.
- Tingkat kepuasan pengguna terhadap fitur pesan pribadi.
- Jumlah laporan penyalahgunaan pesan.