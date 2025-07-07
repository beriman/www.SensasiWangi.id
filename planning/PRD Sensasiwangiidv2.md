Product Requirements Document (PRD) - SensasiWangi.id

1. Overview

SensasiWangi.id adalah platform komunitas dan marketplace untuk pencinta dan pembuat parfum di Indonesia. Platform ini menggabungkan forum, marketplace C2C, profil pengguna, sistem sambatan (group buy), dan fitur komunitas sosial. Semua transaksi finansial dan nilai moneter di platform ini akan menggunakan mata uang Rupiah (IDR).

Target pengguna:

Penikmat parfum (reviewer, kolektor, komunitas)

Pembuat parfum (artisan perfumer, brand indie, seller bahan baku)

Penjual alat dan bahan baku parfum

2. Core Modules

A. Forum

Dipisahkan menjadi dua kategori utama:

Penikmat Parfum: Review parfum, diskusi brand, rekomendasi aroma.

Pembuat Parfum: Diskusi bahan baku, teknik formulasi, alat dan teknik perfumery.

Fitur:

Buat thread & reply

Voting (up/down)

Tag kategori

Notifikasi thread aktif

Laporkan postingan

Thread terpopuler mingguan

Mode moderator (admin khusus forum)

_(Untuk detail lebih lanjut, silakan merujuk ke PRD Forum.md)_

B. Marketplace

C2C (customer to customer) marketplace untuk produk parfum dan bahan.

Kategori Produk:

Produk jadi (parfum, reed diffuser, sabun)

Bahan baku (essential oils, aroma chemical)

Alat parfum (beaker, timbangan, botol)

Lain-lain

Fitur:

Jual beli produk

Sambatan / Group Buy

Review & rating

Wishlist

Dashboard penjual ("Lapak Saya")

Checkout via QR manual ke rekening sensasiwangi.id

_(Untuk detail lebih lanjut, silakan merujuk ke PRD marketplace.md)_

C. Profil Pengguna

Fitur:

Avatar, cover photo, bio, custom title

Statistik: jumlah post, vote, level EXP

Tabs: Forum activity, Produk dijual, Sambatan yang diikuti, Bookmark thread

Follow/unfollow

Pengaturan privasi profil

Upgrade membership (Free, Business)

_(Untuk detail lebih lanjut, silakan merujuk ke PRD Profile.md)_

D. Private Messaging
Untuk detail lebih lanjut, silakan merujuk ke `PRD Private Messaging.md`.

E. Admin Panel

Fitur:

Manajemen user (ban, upgrade, suspend, reset password)

Moderasi konten

Manajemen marketplace: verifikasi sambatan, status pembayaran, tracking

_(Untuk detail lebih lanjut, silakan merujuk ke PRD Admin.md)_

F. Nusantarum
Untuk detail lebih lanjut, silakan merujuk ke `PRD Nusantarum.md`.

3. User Roles

Platform ini mendukung beberapa peran pengguna dengan hak akses yang berbeda:

| Peran Pengguna     | Deskripsi & Hak Akses Utama                                                                                                                                                                                                                                                                                           |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Guest**          | Dapat melihat halaman publik (Landing Page, daftar produk marketplace, thread forum publik), tetapi tidak dapat berinteraksi (login, posting, membeli, menjual).                                                                                                                                                      |
| **User Terdaftar** | Dapat login, berkomentar, posting di forum, membeli produk, mengirim pesan pribadi, mengelola profil.                                                                                                                                                                                                                 |
| **Seller**         | Memiliki semua hak akses User Terdaftar, ditambah kemampuan untuk menjual produk di marketplace, mengelola lapak, dan melihat statistik penjualan.                                                                                                                                                                    |
| **Moderator**      | Memiliki semua hak akses User Terdaftar, ditambah kemampuan untuk memoderasi konten forum (menghapus, mengedit, pin, kunci thread/balasan) dan mengambil tindakan terhadap pengguna yang melanggar aturan forum (peringatan, penangguhan, blokir). _(Untuk detail lebih lanjut, silakan merujuk ke PRD Moderator.md)_ |
| **Admin**          | Akses penuh ke Admin Panel, dapat mengelola pengguna, forum, marketplace, keuangan, dan pengaturan sistem.                                                                                                                                                                                                            |
| **Super Admin**    | Akses tertinggi, termasuk kemampuan untuk mengelola peran admin lainnya.                                                                                                                                                                                                                                              |

_(Untuk detail lebih lanjut tentang manajemen peran dan otorisasi, silakan merujuk ke PRD Auth.md)_

4. Teknologi & Integrasi

Frontend: React + Vite

Backend: Convex (data, auth)

Payment: QR Manual ke Rekening Bersama (Fase Awal)

Rencana Integrasi Pembayaran: Virtual Account BRI (Fase Lanjut)

Desain: Neumorphism dengan warna lembut (beige, olive, gold)

5. Struktur Navigasi Halaman

/ → Landing Page

/forum → Forum utama

/forum/:kategori → Subkategori

/thread/:id → Detail diskusi

/marketplace → Halaman utama jual beli

/marketplace/sambatan → Fitur group buy

/product/:id → Detail produk

/sell → Upload produk

/checkout/:id → Proses pembelian

/profile/:username → Halaman profil user

/messages → Pesan pribadi

/admin → Dashboard admin

/nusantarum → Halaman utama Nusantarum

/nusantarum/perfumer/:id → Detail perfumer

/nusantarum/brand/:id → Detail brand

/nusantarum/varian/:id → Detail varian

6. User Flow Utama

A. Membuat Thread di Forum

User login

Masuk ke forum → Pilih kategori

Klik "Buat Thread"

Tulis konten dan submit

Thread tampil dan bisa dikomentari

B. Jualan Produk

User login

Masuk ke /sell

Isi data produk, upload gambar

Submit → Tampil di marketplace

C. Sambatan (Group Buy)

User buat produk sambatan

Pengguna lain join sambatan

Sistem hitung total & target terkumpul

Setelah cukup, admin verifikasi & proses

Pembayaran ke rekening bersama

7. Kualitas & Pencarian

A. Strategi Pengujian
Untuk detail lengkap mengenai strategi pengujian, silakan merujuk ke `PRD Strategi Pengujian.md`.

B. Fitur Pencarian
Untuk detail lengkap mengenai fitur pencarian, silakan merujuk ke `PRD Pencarian Global.md`.

8. Modul Opsional (Versi Mendatang)

- **Learning (kursus & tutorial):** Modul pembelajaran terstruktur untuk pengguna. _(Untuk detail lebih lanjut, silakan merujuk ke PRD Learning.md)_
- **Sistem EXP & lencana:** Sistem gamifikasi untuk mendorong interaksi dan memberikan penghargaan kepada pengguna. _(Untuk detail lebih lanjut, silakan merujuk ke PRD Profile.md)_
- **Kalkulator formula parfum:** Alat bantu untuk perfumer dalam menghitung formulasi parfum.
- **Brand showcase untuk user bisnis:** Halaman khusus untuk brand atau perfumer bisnis untuk menampilkan karya mereka.
