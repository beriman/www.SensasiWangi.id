# Product Requirement Document (PRD) - Data Migration Sensasiwangiid V2

## 1. Pendahuluan

Dokumen ini menguraikan persyaratan, strategi, dan proses untuk migrasi data ke platform Sensasiwangiid V2. Tujuannya adalah untuk memastikan transfer data yang akurat, lengkap, dan aman dari sistem sumber ke sistem target, dengan downtime minimal dan integritas data yang terjaga, sejalan dengan arsitektur teknis yang menggunakan Convex dan Clerk.

## 2. Tujuan Migrasi Data

- **Integritas Data:** Memastikan semua data yang dimigrasikan tetap akurat dan tidak rusak.
- **Kelengkapan Data:** Memastikan semua data yang relevan dari sistem sumber berhasil dimigrasikan ke sistem target.
- **Keamanan Data:** Melindungi data sensitif selama proses migrasi.
- **Downtime Minimal:** Melakukan migrasi dengan dampak seminimal mungkin terhadap operasional yang sedang berjalan.
- **Verifikasi:** Memastikan data yang dimigrasikan telah diverifikasi dan divalidasi.
- **Rollback Plan:** Memiliki rencana cadangan yang jelas jika terjadi kegagalan migrasi.

## 3. Sumber Data dan Sistem Target

### 3.1. Sistem Sumber (Source System)
- **Identifikasi Sistem:** (Perlu diisi berdasarkan sistem lama yang ada, misalnya, database MySQL, spreadsheet, sistem warisan, dll.)
- **Lokasi Data:** (Misalnya, server on-premise, cloud storage)
- **Format Data:** (Misalnya, SQL, CSV, JSON, XML)
- **Volume Data:** Estimasi jumlah record, ukuran database.
- **Kualitas Data:** Tingkat kebersihan dan konsistensi data di sistem sumber.

### 3.2. Sistem Target (Target System)
- **Platform:** Sensasiwangiid V2.
- **Database:** **Convex** (sebagai database utama untuk semua data aplikasi).
- **Manajemen Pengguna:** **Clerk** (untuk otentikasi dan manajemen identitas pengguna). Data pengguna yang dimigrasikan (misalnya, email, nama, username) akan diimpor ke Clerk, dan ID pengguna dari Clerk akan digunakan di Convex untuk referensi.
- **Skema Data:** Mengacu pada **PRD Database Schema.md** untuk struktur data di Convex.

## 4. Data yang Akan Dimigrasikan

Identifikasi secara spesifik entitas data yang akan dimigrasikan, termasuk atribut-atributnya. Contoh:

- **Pengguna:** ID Pengguna Lama, Nama, Email, Username, Bio, Avatar URL, Status, Tanggal Pendaftaran. (Password tidak akan dimigrasikan langsung, pengguna akan diminta reset password atau menggunakan alur registrasi/login Clerk).
- **Produk (Marketplace):** ID Produk Lama, Nama Produk, Deskripsi, Harga, Stok, Kategori, Gambar URL, ID Penjual Lama.
- **Pesanan:** ID Pesanan Lama, Tanggal Pesanan, Status, Detail Produk, Kuantitas, Total Harga, ID Pembeli Lama, ID Penjual Lama.
- **Postingan Forum:** ID Postingan Lama, Judul, Konten, ID Penulis Lama, Kategori, Tanggal.
- **Data Finansial:** Riwayat Transaksi, Saldo Akun (semua nilai finansial harus dalam Rupiah/IDR).
- **Data Lainnya:** (Sebutkan jika ada, misalnya, riwayat pesan, data pembelajaran, data Nusantarum).

## 5. Strategi Migrasi Data

- **Phased Migration:** Data akan dimigrasikan secara bertahap. Ini memungkinkan pengujian yang lebih terkontrol dan mengurangi risiko. Data penting (misalnya, pengguna, produk) akan dimigrasikan terlebih dahulu, diikuti oleh data historis.
- **Pendekatan "Lift and Shift" (jika memungkinkan):** Untuk data yang strukturnya mirip, dapat langsung dipetakan ke skema Convex.
- **Transformasi Data:** Untuk data yang memerlukan perubahan struktur atau pembersihan, akan dilakukan transformasi sebelum pemuatan ke Convex.

## 6. Proses Migrasi Data (ETL)

### 6.1. Ekstraksi (Extract)
- **Metode:** Menggunakan skrip kustom (misalnya, Python) untuk mengekstrak data dari sistem sumber. Jika sistem sumber memiliki API, API dapat digunakan. Jika tidak, ekspor data ke format CSV/JSON.
- **Alat:** Skrip Python, alat ekspor database (misalnya, `mysqldump`).

### 6.2. Transformasi (Transform)
- **Pemetaan Data:** Membuat dokumen pemetaan yang jelas antara field dari sistem sumber ke field di Convex dan Clerk.
- **Pembersihan Data:** Menangani data yang tidak konsisten, duplikat, atau hilang. Ini mungkin melibatkan skrip pembersihan data.
- **Normalisasi/Denormalisasi:** Menyesuaikan struktur data agar sesuai dengan skema Convex (misalnya, mengubah relasi menjadi referensi `_id`).
- **Validasi Data:** Memastikan data memenuhi aturan bisnis dan batasan skema target sebelum dimuat.
- **Penanganan Error:** Log semua data yang gagal ditransformasi atau divalidasi untuk peninjauan manual.

### 6.3. Pemuatan (Load)
- **Metode:** Menggunakan **Convex Client SDK** atau **Convex HTTP API** untuk mengunggah data secara batch ke Convex. Untuk data pengguna yang akan masuk ke Clerk, gunakan **Clerk API** atau fitur impor yang disediakan Clerk.
- **Urutan Pemuatan:** Penting untuk memuat data dengan dependensi terlebih dahulu. Contoh: Pengguna (ke Clerk dan Convex) -> Kategori Forum/Marketplace -> Thread Forum/Produk Marketplace (dengan referensi ke pengguna) -> Balasan/Pesanan.
- **Alat:** Skrip Python atau Node.js yang menggunakan Convex dan Clerk SDK/API.

## 7. Verifikasi dan Validasi Data

- **Pemeriksaan Jumlah Record:** Membandingkan jumlah record sebelum dan sesudah migrasi untuk setiap koleksi/tabel.
- **Pemeriksaan Sampel Data:** Memverifikasi integritas dan akurasi data secara manual pada sampel acak setelah migrasi.
- **Pemeriksaan Integritas Referensial:** Memastikan semua referensi `_id` antar dokumen di Convex valid.
- **Pengujian Fungsional:** Melakukan pengujian fungsional menyeluruh pada sistem baru menggunakan data yang dimigrasikan.
- **Laporan Validasi:** Membuat laporan yang merinci hasil verifikasi, termasuk data yang gagal dimigrasikan dan alasannya.

## 8. Keamanan Data Selama Migrasi

- **Enkripsi:** Data sensitif harus dienkripsi saat transit (misalnya, menggunakan HTTPS saat mengunggah ke Convex/Clerk) dan saat istirahat (Convex dan Clerk secara otomatis mengenkripsi data at rest).
- **Akses Terbatas:** Membatasi akses ke data migrasi hanya untuk personel yang berwenang.
- **Audit Trail:** Mencatat semua aktivitas migrasi untuk tujuan audit.
- **Penghapusan Data Sumber:** Setelah migrasi berhasil dan diverifikasi, data sensitif dari sistem sumber harus dihapus sesuai kebijakan retensi data.

## 9. Rencana Rollback

- **Titik Pemulihan:** Melakukan backup lengkap dari sistem sumber sebelum memulai migrasi.
- **Prosedur Rollback:** Jika terjadi kegagalan kritis selama migrasi, sistem dapat dikembalikan ke kondisi sebelum migrasi menggunakan backup.
- **Pengujian Rollback:** Menguji prosedur rollback di lingkungan non-produksi.

## 10. Jadwal dan Sumber Daya

- **Estimasi Waktu:** Perkiraan waktu yang dibutuhkan untuk setiap fase migrasi (ekstraksi, transformasi, pemuatan, verifikasi).
- **Sumber Daya:** Tim yang terlibat (pengembang, QA), alat, dan infrastruktur yang dibutuhkan.
- **Downtime yang Diperkirakan:** Estimasi waktu henti layanan selama migrasi (jika ada, terutama untuk fase "cutover").

## 11. Tanggung Jawab

- **Manajemen Proyek:** Mengawasi keseluruhan proses migrasi.
- **Tim Pengembangan:** Mengembangkan skrip/alat migrasi, melakukan transformasi data, dan memuat data ke Convex/Clerk.
- **Tim QA:** Melakukan verifikasi dan validasi data.
- **Tim Operasi/DevOps:** Menyiapkan lingkungan, memantau proses migrasi.

## 12. Lampiran (Opsional)

- Diagram Alur Migrasi Data
- Dokumen Pemetaan Skema Data
- Daftar Atribut Data yang Dimigrasikan
- Checklist Migrasi