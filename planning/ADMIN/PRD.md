# Product Requirement Document: Modul Admin

## 1. Ikhtisar

Modul Admin adalah pusat kontrol untuk seluruh platform SensasiWangi.id. Halaman ini hanya dapat diakses oleh pengguna dengan peran "admin" dan menyediakan alat untuk mengelola pengguna, konten, dan memantau aktivitas di seluruh situs.

## 2. Alur Kerja Login Admin (Admin Login Workflow)

Tujuan dari alur kerja ini adalah untuk memastikan hanya admin yang terautentikasi dan terotorisasi yang dapat mengakses dasbor admin.

1.  **Akses Awal**: Admin menavigasi ke `https://sensasiwangi.id/admin`.
2.  **Pemeriksaan Autentikasi**: Sistem memeriksa apakah pengguna sudah login.
    *   **Jika belum login**: Pengguna akan dialihkan ke halaman login utama (`/login`).
    *   **Jika sudah login**: Lanjut ke langkah berikutnya.
3.  **Pemeriksaan Otorisasi**: Setelah login berhasil, sistem memeriksa peran (role) pengguna dari data di database (tabel `users`).
    *   **Jika peran adalah `admin`**: Pengguna diizinkan masuk dan melihat konten halaman `/admin`.
    *   **Jika peran bukan `admin`**: Pengguna dialihkan ke halaman utama (`/`) atau dasbor pengguna biasa dengan notifikasi "Akses Ditolak".

## 3. Fitur Utama Dasbor Admin

Dasbor admin akan menjadi antarmuka terpusat untuk semua tugas administratif.

### 3.1. Dasbor Utama (Admin Dashboard)

-   Menampilkan ringkasan statistik kunci:
    -   Jumlah pengguna terdaftar.
    -   Jumlah produk di marketplace.
    -   Jumlah kursus yang tersedia.
    -   Jumlah postingan forum hari ini.
    -   Data penjualan (jika relevan).

### 3.2. Manajemen Pengguna (User Management)

-   **Lihat Daftar Pengguna**: Menampilkan semua pengguna dalam bentuk tabel dengan data (ID, nama, email, peran, tanggal bergabung).
-   **Cari & Filter**: Memungkinkan pencarian pengguna berdasarkan nama atau email, dan filter berdasarkan peran.
-   **Ubah Peran Pengguna**: Admin dapat mengubah peran pengguna (misalnya dari `user` menjadi `admin` atau `seller`).
-   **Nonaktifkan/Blokir Pengguna**: Kemampuan untuk menonaktifkan akun pengguna yang melanggar aturan.

### 3.3. Manajemen Konten (Content Management)

#### 3.3.1. Marketplace
-   Lihat semua produk yang dijual oleh semua penjual. (Implemented)
-   Edit atau hapus produk yang tidak sesuai. (Implemented)
-   Kelola kategori produk. (Implemented)
-   Lihat dan kelola pesanan yang masuk. (Implemented)

#### 3.3.2. Kursus (Courses)
-   Buat, edit, atau hapus kursus dan materi pelajaran. (Implemented)
-   Lihat progres belajar dari semua pengguna. (Implemented)
-   Kelola pendaftaran kursus. (Implemented)

#### 3.3.3. Forum
-   Moderasi konten: Hapus postingan atau komentar yang tidak pantas. (Implemented)
-   Sematkan (pin) topik penting. (Implemented)
-   Buat kategori atau sub-forum baru. (Implemented)

## 4. Rencana Implementasi Teknis

### 4.1. Backend (Convex)

1.  **Update Skema Pengguna**: Tambahkan field `role` pada tabel `users` di `convex/schema.ts`. Tipe datanya bisa berupa string dengan nilai potensial: `"user"`, `"admin"`, `"seller"`.
    ```typescript
    // convex/schema.ts
    // ... dalam defineTable({ ... }) untuk users
    role: v.string(), // "user", "admin", "seller"
    ```
2.  **Buat Fungsi Admin**: Di `convex/admin.ts`, buat fungsi-fungsi *internal* atau *mutations/queries* yang hanya bisa dieksekusi oleh admin. Setiap fungsi harus memiliki logika untuk memverifikasi peran pemanggil.
    ```typescript
    // convex/admin.ts
    // Contoh fungsi untuk mendapatkan semua pengguna
    export const getAllUsers = query({
      handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
          throw new Error("Not authenticated");
        }
        // Cek peran dari database
        const user = await ctx.db.query("users").withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier)).unique();
        if (user?.role !== "admin") {
          throw new Error("Unauthorized");
        }
        return await ctx.db.query("users").collect();
      },
    });
    ```
3.  **Seed Admin Pertama**: Buat script di `scripts/seed.ts` untuk membuat satu pengguna admin pertama kali secara manual.

### 4.2. Frontend (React)

1.  **Buat Rute Terproteksi (Protected Route)**: Buat komponen wrapper (misalnya `AdminRoute`) yang akan membungkus halaman `/admin`. Komponen ini akan menjalankan logika pemeriksaan autentikasi dan otorisasi yang dijelaskan di alur kerja.
2.  **Halaman Admin**: Kembangkan `src/pages/admin.tsx` sebagai layout utama dasbor admin. Halaman ini akan memiliki navigasi ke berbagai modul manajemen (pengguna, marketplace, dll).
3.  **Komponen Manajemen**: Buat komponen-komponen UI untuk setiap fitur, misalnya:
    -   `UserTable.tsx`: Tabel untuk menampilkan data pengguna.
    -   `ProductList.tsx`: Daftar produk di marketplace.
    -   `CourseEditor.tsx`: Form untuk membuat/mengedit kursus.
4.  **Panggilan API**: Komponen-komponen tersebut akan memanggil fungsi Convex yang relevan dari `convex/admin.ts` untuk mengambil data atau melakukan perubahan.