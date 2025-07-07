# Product Requirement Document (PRD) - Sistem Rujukan (Referral System)

## 1. Pendahuluan

Dokumen ini menguraikan persyaratan untuk "Sistem Rujukan" (Referral System) di platform SensasiWangi.id. Tujuannya adalah untuk mendorong pertumbuhan organik dengan memberikan insentif kepada pengguna yang berhasil mengajak teman atau kolega mereka untuk bergabung dengan platform.

## 2. Tujuan

- Meningkatkan akuisisi pengguna baru.
- Memberikan penghargaan kepada pengguna setia yang mempromosikan platform.
- Memperkuat efek jaringan (network effect) komunitas.

## 3. Fitur Utama

### 3.1. Mekanisme Rujukan
- **Kode/Tautan Rujukan Unik:** Setiap pengguna akan memiliki kode atau tautan rujukan unik yang dapat mereka bagikan.
- **Pelacakan Rujukan:** Sistem akan melacak pendaftaran baru yang berasal dari kode atau tautan rujukan.

### 3.2. Insentif Rujukan
- **Untuk Perujuk (Referrer):**
  - Menerima sejumlah Experience Points (EXP) untuk setiap pengguna baru yang berhasil mendaftar dan menjadi aktif (misalnya, setelah verifikasi email dan melengkapi profil).
  - Contoh: 25 EXP per rujukan yang berhasil (sesuai **PRD Gamifikasi.md**).
- **Untuk yang Dirujuk (Referee):**
  - Mungkin menerima bonus awal saat mendaftar menggunakan kode rujukan (misalnya, tambahan 10 EXP).

### 3.3. Antarmuka Pengguna (UI)
- **Halaman Rujukan:** Halaman khusus di profil pengguna yang menampilkan:
  - Kode/tautan rujukan mereka.
  - Tombol untuk menyalin atau membagikan tautan dengan mudah (misalnya, ke media sosial, email, WhatsApp).
  - Statistik rujukan (jumlah teman yang diundang, jumlah rujukan yang berhasil, total EXP yang diperoleh).

### 3.4. Aturan dan Batasan
- **Definisi "Rujukan Berhasil":** Menetapkan kriteria yang jelas untuk apa yang dianggap sebagai rujukan yang berhasil (misalnya, pengguna baru harus memverifikasi email dan mencapai level tertentu).
- **Pencegahan Penipuan (Fraud Prevention):** Menerapkan mekanisme untuk mencegah penyalahgunaan sistem rujukan (misalnya, pendaftaran palsu, penggunaan VPN untuk membuat banyak akun).
- **Batas Rujukan (Opsional):** Mungkin ada batasan jumlah rujukan yang dapat dibuat oleh satu pengguna dalam periode waktu tertentu.

## 4. User Flow Utama

1. Pengguna A (Perujuk) mengakses halaman rujukan di profilnya.
2. Pengguna A membagikan tautan rujukannya kepada Pengguna B.
3. Pengguna B mengklik tautan tersebut dan mendaftar di SensasiWangi.id.
4. Setelah Pengguna B menyelesaikan proses pendaftaran dan aktivasi (sesuai kriteria), sistem akan secara otomatis memberikan EXP kepada Pengguna A (dan mungkin juga kepada Pengguna B).
5. Pengguna A dapat melihat pembaruan statistik di halaman rujukannya.

## 5. Teknologi & Integrasi

- **Backend:** Convex akan menangani logika untuk menghasilkan kode rujukan, melacak pendaftaran, dan memberikan EXP.
- **Frontend:** React + Vite untuk membangun UI halaman rujukan.
- **Integrasi Gamifikasi:** Terintegrasi erat dengan **PRD Gamifikasi.md** untuk pemberian EXP.
- **Database Schema:** Penambahan field `referralCode` (string, unique) dan `referredBy` (Convex ID, optional) di `users` collection.

## 6. Pengukuran Keberhasilan

- Jumlah pengguna baru yang diakuisisi melalui sistem rujukan.
- Tingkat konversi rujukan (persentase undangan yang menjadi pendaftaran berhasil).
- Biaya akuisisi pelanggan (jika insentif moneter digunakan di masa depan).
