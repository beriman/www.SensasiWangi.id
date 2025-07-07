Product Requirements Document (PRD) - Modul Autentikasi (Auth)

1.  Tujuan
    Modul Autentikasi (Auth) bertujuan untuk menyediakan sistem yang aman dan efisien bagi pengguna untuk mendaftar, masuk, dan mengelola akses mereka ke platform SensasiWangi.id. Modul ini akan memastikan bahwa hanya pengguna yang terautentikasi dan terotorisasi yang dapat mengakses fitur-fitur tertentu, serta melindungi data pengguna.

2.  Fitur Utama

    2.1. Registrasi Pengguna
    - **Registrasi Email/Password:** Pengguna dapat mendaftar menggunakan alamat email dan kata sandi.
    - **Validasi Input:** Validasi format email, kekuatan kata sandi (minimal 8 karakter, kombinasi huruf besar/kecil, angka, simbol).
    - **Konfirmasi Kata Sandi:** Meminta pengguna untuk mengulang kata sandi untuk memastikan tidak ada kesalahan ketik.
    - **Registrasi Sosial (Opsional untuk Fase Lanjut):** Integrasi dengan penyedia identitas pihak ketiga seperti Google, Facebook, atau GitHub untuk pendaftaran dan login yang lebih cepat.
    - **Persetujuan Syarat & Ketentuan:** Pengguna harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi sebelum mendaftar. Menyelesaikan registrasi akan memberikan EXP awal dan badge "Newbie" (sesuai PRD Gamifikasi).

    2.2. Login Pengguna
    - **Login Email/Password:** Pengguna dapat masuk menggunakan alamat email dan kata sandi yang terdaftar.
    - **Login Sosial (Opsional untuk Fase Lanjut):** Pengguna dapat masuk menggunakan akun sosial yang terhubung.
    - **"Ingat Saya" (Remember Me):** Opsi bagi pengguna untuk tetap login di perangkat yang sama untuk jangka waktu tertentu.
    - **Penanganan Error:** Pesan error yang jelas untuk kredensial yang salah atau akun yang diblokir.
    - **Rate Limiting:** Menerapkan rate limiting pada percobaan login untuk mencegah serangan brute-force.

    2.3. Manajemen Kata Sandi
    - **Lupa Kata Sandi:**
        - Pengguna dapat meminta reset kata sandi jika lupa.
        - Sistem akan mengirimkan tautan reset kata sandi yang unik dan berbatas waktu ke alamat email terdaftar pengguna.
        - Tautan reset hanya dapat digunakan sekali.
    - **Reset Kata Sandi:** Pengguna dapat mengatur kata sandi baru melalui tautan reset.
    - **Ubah Kata Sandi:** Pengguna yang sudah login dapat mengubah kata sandi mereka setelah memverifikasi kata sandi lama.

    2.4. Verifikasi Email
    - Setelah registrasi, email verifikasi akan dikirimkan ke alamat email pengguna.
    - Pengguna harus mengklik tautan verifikasi untuk mengaktifkan akun mereka.
    - **Akses Terbatas Akun Belum Terverifikasi:** Akun yang belum diverifikasi akan memiliki akses terbatas. Mereka dapat melihat konten publik (misalnya, landing page, daftar produk marketplace), tetapi tidak dapat melakukan tindakan yang memerlukan autentikasi penuh seperti: membuat thread/balasan forum, membeli/menjual produk, mengirim pesan pribadi, atau mengakses pengaturan profil lengkap.
    - Opsi untuk mengirim ulang email verifikasi akan tersedia di halaman login atau profil.

    2.5. Manajemen Sesi Pengguna
    - Membuat dan mengelola sesi pengguna yang aman setelah login berhasil, memanfaatkan mekanisme sesi berbasis JWT bawaan Supabase.
    - Sesi akan berakhir setelah periode tidak aktif tertentu atau saat pengguna logout.
    - Pengguna dapat melihat dan mengelola sesi aktif mereka (misalnya, logout dari semua perangkat lain) melalui pengaturan akun.

    2.6. Kontrol Akses Berbasis Peran (Role-Based Access Control - RBAC)
    - Mengintegrasikan dengan sistem peran yang akan disimpan di tabel `users` di database Supabase (User, Seller, Moderator, Admin, Super Admin).
    - **Pemetaan Peran:** Peran yang didefinisikan di database akan digunakan untuk kontrol akses yang granular melalui kebijakan Row Level Security (RLS) di Supabase.
    - Fitur dan konten tertentu di platform akan dibatasi berdasarkan peran pengguna.
    - Contoh: Hanya Seller yang dapat mengakses dashboard "Lapak Saya"; hanya Admin yang dapat mengakses Admin Panel.

    2.7. Keamanan
    - **Hashing Kata Sandi:** Supabase secara internal menangani hashing kata sandi menggunakan algoritma yang kuat (bcrypt).
    - **Autentikasi Dua Faktor (2FA) (Opsional untuk Fase Lanjut):** Memberikan opsi bagi pengguna untuk mengaktifkan 2FA untuk lapisan keamanan tambahan, dikelola oleh Supabase Auth.
    - **Pencegahan Serangan Umum:** Melindungi dari serangan seperti XSS, CSRF, SQL Injection melalui penggunaan framework (React) dan kebijakan keamanan (RLS) yang direkomendasikan oleh Supabase.
    - **Audit Log Autentikasi:** Mencatat aktivitas autentikasi penting (login berhasil/gagal, perubahan kata sandi, reset kata sandi) di tabel `admin_logs`. Log akan mencakup: `timestamp`, `adminId` (jika tindakan admin), `userId` (pengguna yang terpengaruh), `action` (misalnya, 'user_login_success', 'user_login_failed', 'password_change'), `ipAddress`, dan `userAgent` (opsional).

3.  User Flow Utama

    3.1. Registrasi Pengguna Baru
    1.  Pengguna mengakses halaman registrasi.
    2.  Mengisi formulir registrasi (email, kata sandi, konfirmasi kata sandi).
    3.  Menyetujui Syarat & Ketentuan.
    4.  Klik "Daftar".
    5.  Sistem membuat akun di Supabase Auth dan mengirim email verifikasi.
    6.  Pengguna membuka email dan mengklik tautan verifikasi.
    7.  Akun terverifikasi dan pengguna dapat login.

    3.2. Login Pengguna
    1.  Pengguna mengakses halaman login.
    2.  Memasukkan email dan kata sandi.
    3.  Klik "Login".
    4.  Sistem memverifikasi kredensial melalui Supabase Auth.
    5.  Jika berhasil, sesi pengguna (JWT) dibuat dan pengguna diarahkan ke dashboard atau halaman utama.
    6.  Jika gagal, pesan error ditampilkan.

    3.3. Lupa Kata Sandi
    1.  Pengguna mengklik "Lupa Kata Sandi" di halaman login.
    2.  Memasukkan alamat email terdaftar.
    3.  Sistem memanggil fungsi Supabase Auth untuk mengirim tautan reset kata sandi.
    4.  Pengguna membuka email dan mengklik tautan reset.
    5.  Pengguna diarahkan ke halaman reset kata sandi.
    6.  Memasukkan kata sandi baru dan konfirmasi.
    7.  Klik "Reset Kata Sandi".
    8.  Kata sandi berhasil diubah, pengguna dapat login dengan kata sandi baru.

4.  Teknologi & Integrasi
    - **Penyedia Autentikasi:** **Supabase Auth** (sebagai solusi utama untuk manajemen pengguna, otentikasi, dan otorisasi).
    - **Backend & Database:** **Supabase** (PostgreSQL untuk database, Supabase Functions untuk logika backend).
    - **Frontend:** React + Vite (untuk antarmuka pengguna registrasi, login, dan manajemen akun).
    - **Email Service:** Integrasi dengan layanan pengiriman email (misalnya, SendGrid, Mailgun) atau menggunakan layanan email bawaan Supabase untuk email verifikasi dan reset kata sandi.

5.  Pengukuran Keberhasilan
    - Tingkat keberhasilan registrasi pengguna.
    - Tingkat keberhasilan login pengguna.
    - Jumlah percobaan login yang gagal (indikator potensi serangan).
    - Waktu rata-rata untuk proses registrasi dan login.
    - Jumlah pengguna yang mengaktifkan 2FA (jika diimplementasikan).