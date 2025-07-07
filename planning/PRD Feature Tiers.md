# Product Requirement Document (PRD) - Feature Tiers (Free vs. Business)

## 1. Pendahuluan

Dokumen ini menguraikan pembagian fitur-fitur platform SensasiWangi.id V2 ke dalam tingkatan akses yang berbeda: Pengguna Gratis (Free User) dan Pengguna Bisnis (Business User). Tujuannya adalah untuk mendefinisikan nilai tambah dari keanggotaan berbayar, mendorong monetisasi, dan memberikan fleksibilitas kepada pengguna sesuai dengan kebutuhan mereka.

## 2. Model Keanggotaan

Platform SensasiWangi.id akan menawarkan dua tingkatan keanggotaan utama:

-   **Pengguna Gratis (Free User / User Terdaftar):** Akses dasar ke fitur-fitur komunitas dan marketplace sebagai pembeli. Cocok untuk penikmat parfum, kolektor, atau pengguna yang ingin berinteraksi di forum.
-   **Pengguna Bisnis (Business User / Seller):** Keanggotaan berbayar yang mencakup semua fitur Pengguna Gratis, ditambah akses ke fitur-fitur premium yang dirancang khusus untuk pembuat parfum, brand indie, dan penjual. Cocok untuk mereka yang ingin menjual produk, mempromosikan brand, dan menggunakan alat bantu profesional.

## 3. Pembagian Fitur Berdasarkan Tier

Berikut adalah rincian fitur-fitur utama dan pembagiannya berdasarkan tingkatan keanggotaan:

### 3.1. Fitur Pengguna Gratis (Free User)

Fitur-fitur ini akan tersedia untuk semua pengguna yang telah mendaftar dan memverifikasi akun mereka.

-   **Autentikasi & Manajemen Akun (PRD Auth.md):**
    -   Registrasi akun (Email/Password).
    -   Login akun.
    -   Manajemen kata sandi (lupa/ubah kata sandi).
    -   Verifikasi email.
    -   Manajemen sesi pengguna.

-   **Forum (PRD Forum.md):**
    -   Melihat dan membaca semua thread dan balasan di forum.
    -   Membuat thread baru.
    -   Membalas thread yang ada.
    -   Memberikan upvote/downvote pada thread dan balasan.
    -   Melaporkan konten yang melanggar.
    -   Menggunakan fitur pencarian dan filter forum.
    -   Notifikasi dasar terkait aktivitas forum (balasan pada postingan sendiri, mention).

-   **Marketplace (Sebagai Pembeli) (PRD marketplace.md):**
    -   Melihat dan mencari produk di marketplace.
    -   Membeli produk (melalui alur checkout manual/VA).
    -   Bergabung dalam Sambatan (Group Buy).
    -   Menambahkan produk ke Wishlist.
    -   Memberikan ulasan dan rating pada produk yang telah dibeli.
    -   Melacak status pesanan pembelian.

-   **Profil Pengguna (PRD Profile.md):**
    -   Mengelola informasi profil dasar (Avatar, Display Name, Username, Bio).
    -   Melihat aktivitas forum dan riwayat pembelian di tab profil.
    -   Mengikuti (Follow) dan Dikuti (Followed by) pengguna lain.
    -   Mengirim dan menerima pesan pribadi (Private Messaging).
    -   Mengelola pengaturan privasi dasar.
    -   Melihat statistik gamifikasi dasar (EXP, Level, jumlah post).

-   **Nusantarum (PRD Nusantarum.md):**
    -   Mengakses dan menjelajahi direktori perfumer, brand, dan varian parfum.
    -   Menggunakan fitur pencarian dan filter di Nusantarum.

-   **Notifikasi (PRD Notification.md):**
    -   Menerima notifikasi dalam aplikasi (in-app) dan email untuk aktivitas dasar (pesan baru, balasan forum, update status pesanan pembelian).
    -   Mengelola preferensi notifikasi dasar.

-   **Onboarding & Registrasi Lanjutan (PRD Onboarding & Registration.md):**
    -   Mengikuti alur onboarding awal.
    -   Melengkapi profil dasar (nama tampilan, username, bio, avatar).
    -   Mengatur preferensi notifikasi dan privasi awal.

-   **Dukungan Pengguna (PRD Support & Maintenance.md):**
    -   Mengakses Pusat Bantuan/FAQ.
    -   Mengajukan tiket/email untuk dukungan.

### 3.2. Fitur Pengguna Bisnis (Business User)

Fitur-fitur ini akan tersedia secara eksklusif untuk pengguna dengan keanggotaan berbayar (Business Tier). Ini mencakup semua fitur Pengguna Gratis ditambah:

-   **Marketplace (Sebagai Penjual) (PRD marketplace.md):**
    -   Membuat dan mengelola listing produk untuk dijual.
    -   Mengelola stok produk.
    -   Mengakses Dashboard Penjual ("Lapak Saya") dengan statistik penjualan.
    -   Mengelola pesanan penjualan (memperbarui status, menginput nomor resi).
    -   Menggunakan fitur perhitungan biaya pengiriman (RajaOngkir API).
    -   Mengelola Sambatan (Group Buy) sebagai penyelenggara.
    -   Komunikasi langsung dengan pembeli terkait pesanan.
    -   Mekanisme penyelesaian sengketa sebagai penjual.

-   **Profil Pengguna (PRD Profile.md):**
    -   Menggunakan Custom Title di profil mereka.
    -   Akses ke tab "Store Manager" di profil untuk pengelolaan produk dan pesanan.

-   **Business Brand Showcase (PRD Business Brand Showcase.md):**
    -   Membuat dan mengelola halaman profil brand khusus untuk memamerkan brand dan produk mereka.
    -   Menampilkan galeri produk/portofolio.
    -   Menyertakan informasi kontak bisnis (website, media sosial, email, telepon).
    -   Terdaftar dalam Direktori Brand.

-   **Learning (PRD Learning.md):**
    -   Akses ke kursus dan tutorial premium/berbayar.
    -   Diskon eksklusif untuk kursus tertentu.
    -   Mendapatkan sertifikat penyelesaian kursus.

-   **Kalkulator Formula Parfum (PRD Parfum Formula Calculator.md):**
    -   Manajemen bahan baku (menyimpan daftar bahan baku).
    -   Membuat, menyimpan, mengedit, dan menduplikasi formula parfum.
    -   Melakukan perhitungan batch produksi.
    -   Estimasi biaya produksi.

-   **Analytics & Reporting (PRD Analytics & Reporting.md):**
    -   Akses ke dashboard analitik dan laporan penjualan yang lebih detail untuk produk mereka sendiri.
    -   Laporan transaksi, biaya admin, dan dana yang dilepaskan.

-   **Verifikasi Identitas (PRD Onboarding & Registration.md):**
    -   Proses verifikasi identitas tambahan yang diperlukan untuk menjadi penjual.

## 4. Implementasi & Integrasi

-   **Manajemen Peran:** Sistem peran (User, Seller/Business) akan dikelola melalui Clerk dan disinkronkan dengan Convex.
-   **Pembatasan Fitur:** Logika pembatasan akses fitur akan diimplementasikan di sisi frontend (UI) dan backend (Convex Functions) berdasarkan peran pengguna.
-   **Upgrade Path:** Pengguna gratis akan memiliki opsi yang jelas untuk meng-upgrade ke keanggotaan Bisnis melalui halaman khusus atau CTA yang relevan.

## 5. Monetisasi

Model monetisasi utama adalah melalui langganan bulanan/tahunan untuk keanggotaan Business Tier. Akses ke fitur penjualan di marketplace (termasuk listing produk) akan bergantung pada status langganan aktif.

## 6. Pertimbangan Masa Depan

-   **Tiering Lebih Lanjut:** Kemungkinan memperkenalkan tier keanggotaan tambahan (misalnya, Premium User, Enterprise Business) dengan fitur yang lebih canggih.
-   **Add-on:** Menawarkan fitur-fitur tertentu sebagai add-on berbayar terpisah, di luar paket keanggotaan.
