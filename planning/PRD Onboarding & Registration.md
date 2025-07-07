Product Requirements Document (PRD) - Modul Onboarding & Registrasi Lanjutan

1.  Tujuan
    Modul Onboarding & Registrasi Lanjutan bertujuan untuk memandu pengguna baru setelah pendaftaran awal (melalui modul Auth) agar dapat dengan cepat memahami nilai platform SensasiWangi.id, melengkapi profil mereka, dan mengatur preferensi awal. Ini akan meningkatkan tingkat aktivasi pengguna, retensi, dan personalisasi pengalaman.

2.  Fitur Utama

    2.1. Alur Onboarding Awal (First-Time User Experience - FTUE)
    _ **Selamat Datang:** Halaman atau modal sambutan setelah login pertama kali.
    _ **Tur Panduan (Opsional):** Tur singkat yang menyoroti fitur-fitur utama platform (misalnya, forum, marketplace, profil) dengan tooltip atau overlay. Implementasi dapat menggunakan library seperti Intro.js atau Shepherd.js. Konten tur dapat dikonfigurasi oleh admin.
    _ **Progress Bar:** Menampilkan progres pengguna dalam menyelesaikan langkah-langkah onboarding.
    _ **Lewati (Skip):** Pengguna dapat melewati langkah-langkah onboarding dan menyelesaikannya nanti dari pengaturan profil. Pengguna akan menerima pengingat berkala (misalnya, notifikasi in-app) untuk menyelesaikan onboarding.

    2.2. Pengaturan Profil Awal
    _ **Nama Tampilan (Display Name):** Meminta pengguna untuk mengatur nama yang akan terlihat oleh pengguna lain.
    _ **Username:** Meminta pengguna untuk memilih username unik. Sistem akan melakukan validasi ketersediaan secara real-time dan memberikan saran username jika yang dipilih tidak tersedia.
    _ **Bio Singkat:** Meminta pengguna untuk menulis bio singkat tentang diri mereka (misalnya, "Pecinta parfum floral", "Perfumer indie dari Bandung").
    _ **Upload Avatar & Cover Image (Opsional):** Memungkinkan pengguna mengunggah gambar profil dan gambar sampul. Integrasi akan dilakukan dengan layanan penyimpanan cloud (misalnya, Cloudinary, AWS S3) melalui API khusus untuk upload. URL gambar akan disimpan di Convex. \* **Pilihan Minat/Topik:** Meminta pengguna untuk memilih kategori atau topik yang diminati (misalnya, "Review Parfum", "Formulasi", "Bahan Baku"). Daftar minat ini akan bersumber dari kategori forum atau marketplace yang dikelola admin. Pilihan ini akan digunakan untuk personalisasi feed, rekomendasi konten, dan notifikasi.

    2.3. Pengaturan Preferensi Awal
    _ **Preferensi Notifikasi:** Memungkinkan pengguna memilih jenis notifikasi yang ingin mereka terima (misalnya, email, in-app, push notification).
    _ **Pengaturan Privasi Default:** Memungkinkan pengguna mengatur visibilitas profil mereka (publik, teman saja, privat) sebagai default. \* **Zona Waktu:** Pengaturan zona waktu pengguna untuk tampilan waktu yang akurat.

    2.4. Verifikasi Identitas (Opsional, untuk Seller)
    _ Bagi pengguna yang ingin menjadi penjual, akan ada langkah verifikasi identitas tambahan.
    _ **Jenis Dokumen:** Menerima unggahan KTP/SIM/Paspor sebagai bukti identitas.
    _ **Proses Verifikasi:** Verifikasi dapat dilakukan secara manual oleh admin atau melalui integrasi dengan layanan verifikasi identitas pihak ketiga (jika diimplementasikan). Proses ini akan mencakup validasi dokumen dan verifikasi nomor telepon.
    _ **Keamanan Data:** Data identitas sensitif akan dienkripsi saat disimpan dan hanya dapat diakses oleh admin yang berwenang. \* Proses ini akan terpisah dan dapat diakses dari dashboard penjual atau pengaturan profil setelah onboarding awal selesai.

    2.5. Penanganan Error & Validasi
    _ Pesan error yang jelas dan informatif untuk setiap input yang tidak valid.
    _ Validasi real-time untuk username (ketersediaan, format).

3.  User Flow Utama

    3.1. Alur Onboarding Pengguna Baru 1. Pengguna berhasil mendaftar dan login untuk pertama kali. 2. Halaman/modal "Selamat Datang" muncul. 3. Pengguna diarahkan melalui langkah-langkah pengaturan profil awal (nama tampilan, username, bio, avatar). 4. Pengguna memilih minat/topik. 5. Pengguna mengatur preferensi notifikasi dan privasi default. 6. Setelah semua langkah selesai, pengguna diarahkan ke halaman utama atau dashboard yang dipersonalisasi. 7. Pengguna dapat melewati langkah-langkah ini dan menyelesaikannya nanti dari pengaturan profil.

    3.2. Menjadi Penjual (Setelah Onboarding) 1. Pengguna yang sudah terdaftar memutuskan untuk menjadi penjual. 2. Mengakses bagian "Menjadi Penjual" di pengaturan profil atau dashboard. 3. Mengikuti alur verifikasi identitas (jika diperlukan). 4. Setelah verifikasi berhasil, peran pengguna diubah menjadi "Seller" dan mereka mendapatkan akses ke dashboard penjual.

4.  Teknologi & Integrasi
    - **Frontend:** React + Vite (untuk komponen UI onboarding, formulir pengaturan profil).
    - **Backend:** Convex (untuk menyimpan data profil tambahan, preferensi pengguna, dan status onboarding).
    - **Otentikasi:** Clerk (untuk manajemen sesi pengguna dan pembaruan data profil dasar yang dikelola oleh Clerk).
    - **Image Upload:** Integrasi dengan layanan penyimpanan cloud (misalnya, Cloudinary, AWS S3) untuk penyimpanan avatar dan gambar sampul.

5.  Pengukuran Keberhasilan
    - Tingkat penyelesaian alur onboarding.
    - Jumlah pengguna yang melengkapi profil mereka (misalnya, mengisi bio, mengunggah avatar).
    - Tingkat aktivasi pengguna (pengguna yang melakukan tindakan kunci setelah onboarding, seperti membuat postingan forum atau melihat produk marketplace).
    - Jumlah pengguna yang berhasil menjadi penjual.
