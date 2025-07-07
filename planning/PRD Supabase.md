# Product Requirement Document (PRD) - Supabase (Backend & Database)

## 1. Pendahuluan

Dokumen ini menguraikan peran dan persyaratan untuk Supabase sebagai platform Backend-as-a-Service (BaaS) utama untuk SensasiWangi.id V2. Supabase akan berfungsi sebagai database (PostgreSQL), penyedia otentikasi (Supabase Auth), lapisan API (melalui Supabase Functions), dan penyedia penyimpanan file (Supabase Storage), mendukung sebagian besar logika bisnis dan penyimpanan data aplikasi.

## 2. Tujuan

- Menyediakan database yang skalabel dan relasional (PostgreSQL) untuk semua data aplikasi.
- Mengimplementasikan logika bisnis melalui fungsi backend yang aman dan efisien (Supabase Functions).
- Menyediakan sistem otentikasi yang aman, skalabel, dan terintegrasi (Supabase Auth).
- Menyederhanakan pengembangan backend dengan model data yang terintegrasi dan API yang otomatis.
- Menyediakan solusi penyimpanan file yang terintegrasi (Supabase Storage).

## 3. Fitur Utama

### 3.1. Database (PostgreSQL)
- **Relational Database:** Menyimpan data dalam format tabel relasional.
- **Real-time Capabilities:** Mendukung langganan data real-time yang secara otomatis memperbarui frontend saat data berubah.
- **Transactional Guarantees:** Memastikan integritas data melalui transaksi ACID (Atomicity, Consistency, Isolation, Durability).
- **Indexing:** Mendukung pembuatan indeks untuk optimasi query dan pencarian (sesuai `PRD Database Schema.md`).
- **Scalability:** Skalabilitas otomatis untuk menangani pertumbuhan data dan beban pengguna.
- **Row Level Security (RLS):** Menerapkan kebijakan keamanan tingkat baris untuk mengontrol akses data.

### 3.2. Supabase Functions (Edge Functions)
- **Functions:** Fungsi serverless untuk menjalankan logika backend.
- **Deno Runtime:** Ditulis dalam TypeScript/JavaScript dan dijalankan pada Deno.
- **Actions:** Fungsi yang dapat melakukan operasi sisi server yang lebih kompleks, termasuk interaksi dengan API eksternal atau menjalankan logika yang lebih berat.
- **TypeScript Support:** Penulisan fungsi backend dalam TypeScript untuk keamanan tipe dan maintainability.

### 3.3. Supabase Auth
- **Authentication:** Menyediakan layanan otentikasi lengkap, termasuk pendaftaran, login, dan manajemen pengguna.
- **Social Login:** Mendukung login melalui penyedia pihak ketiga (Google, Facebook, dll.).
- **JWT Support:** Menggunakan JSON Web Tokens untuk manajemen sesi yang aman.
- **Row Level Security Integration:** Terintegrasi secara native dengan RLS di database untuk otorisasi.

### 3.4. Supabase Storage
- **File Storage:** Menyediakan penyimpanan objek untuk file seperti gambar, video, dan dokumen.
- **CDN Integration:** Terintegrasi dengan CDN untuk pengiriman file yang cepat.
- **Access Control:** Kebijakan akses yang dapat disesuaikan untuk mengontrol siapa yang dapat mengunggah, mengunduh, atau menghapus file.

### 3.5. Keamanan & Aturan Akses
- **Row Level Security (RLS):** Mendefinisikan aturan keamanan (permissions) langsung di tingkat database untuk mengontrol siapa yang dapat membaca atau menulis data.
- **Environment Variables:** Pengelolaan secret dan konfigurasi sensitif melalui environment variables yang aman.
- **Data Encryption:** Enkripsi data saat transit (HTTPS) dan saat istirahat (at rest).

### 3.6. Monitoring & Logging
- **Supabase Dashboard:** Menyediakan dashboard untuk memantau penggunaan, log, dan kesehatan proyek.
- **Audit Logs:** Mencatat aktivitas penting di backend untuk tujuan audit.

## 4. Implementasi & Penggunaan

- **Database Schema:** Semua definisi tabel dan relasi akan diimplementasikan di Supabase (merujuk ke `PRD Database Schema.md`).
- **Logika Bisnis:** Sebagian besar logika bisnis aplikasi (misalnya, manajemen forum, marketplace, gamifikasi, notifikasi) akan diimplementasikan sebagai Supabase Functions.
- **Real-time Updates:** Fitur-fitur yang membutuhkan pembaruan data instan (misalnya, chat, notifikasi) akan memanfaatkan kemampuan real-time Supabase.
- **Otentikasi:** Semua alur otentikasi akan ditangani oleh Supabase Auth.

## 5. Keterkaitan dengan PRD Lain

- **PRD Database Schema.md:** Menentukan struktur data yang akan diimplementasikan di Supabase.
- **PRD Auth.md:** Supabase Auth adalah implementasi utama untuk semua fitur otentikasi.
- **PRD Security.md:** Supabase menyediakan mekanisme untuk menerapkan aturan keamanan (RLS).
- **PRD Deployment & Operations Plan.md:** Supabase adalah bagian integral dari pipeline CI/CD dan strategi monitoring.
- **PRD Error Handling & Logging.md:** Supabase menyediakan sistem logging bawaan untuk backend.
- **Semua PRD Fungsional (Forum, Marketplace, Gamifikasi, dll.):** Logika bisnis untuk modul-modul ini akan diimplementasikan sebagai Supabase Functions.

## 6. Pengukuran Keberhasilan

- Waktu respons rata-rata API dan fungsi.
- Tingkat keberhasilan eksekusi fungsi.
- Skalabilitas database dalam menangani pertumbuhan data dan pengguna.
- Keamanan data dan kepatuhan terhadap aturan akses.
- Kemudahan pengembangan dan maintainability kode backend.