# Product Requirement Document (PRD) - Deployment & Operations Plan Sensasiwangiid V2

## 1. Pendahuluan

Dokumen ini menguraikan rencana komprehensif untuk penerapan (deployment) dan operasional (operations) platform Sensasiwangiid V2, mulai dari fase pengembangan hingga pemeliharaan berkelanjutan di lingkungan produksi. Tujuannya adalah untuk memastikan proses yang efisien, aman, dan terotomatisasi untuk menghadirkan dan menjaga kualitas layanan platform, sejalan dengan arsitektur teknis yang telah ditetapkan (React, Convex, Vercel).

## 2. Fase 1: Pengembangan & Persiapan Lingkungan Lokal

### 2.1. Lingkungan Pengembangan Lokal
- Setiap pengembang akan menyiapkan lingkungan pengembangan lokal mereka (Node.js, npm/yarn, Git).
- Instalasi **Convex CLI** untuk berinteraksi dengan backend (menjalankan fungsi, mengelola skema, dll.).
- Instalasi **Vercel CLI** untuk menjalankan frontend secara lokal dalam lingkungan yang mirip dengan produksi.
- Konfigurasi file `.env.local` untuk menyimpan variabel lingkungan lokal (kunci API Convex, Clerk, dll.).

### 2.2. Version Control (GitHub)
- Menggunakan satu repositori GitHub untuk codebase (monorepo jika diperlukan).
- Menerapkan strategi **GitHub Flow**:
    - `main` branch selalu dalam keadaan siap deploy.
    - Pengembangan fitur dilakukan di `feature-branch` yang dibuat dari `main`.
    - Pull Request (PR) dibuat dari `feature-branch` ke `main`.
    - Code review wajib untuk setiap PR.

## 3. Fase 2: Pengujian & Jaminan Kualitas (QA)

### 3.1. Lingkungan Staging/Preview
- **Vercel Preview Deployments:** Setiap Pull Request (PR) yang dibuat di GitHub akan secara otomatis memicu Vercel untuk membuat "Preview Deployment".
- Lingkungan preview ini akan terhubung ke **project Convex development**, berfungsi sebagai lingkungan staging yang terisolasi untuk setiap set perubahan.
- Ini memungkinkan tim QA, desainer, dan product manager untuk meninjau dan menguji perubahan secara visual dan fungsional sebelum di-merge ke `main`.

### 3.2. Strategi Pengujian
- **Unit & Integration Testing (Vitest):** Dijalankan secara otomatis pada setiap PR melalui **GitHub Actions**. Jika tes gagal, PR akan diblokir untuk di-merge.
- **End-to-End (E2E) Testing (Playwright/Cypress):** Dijalankan secara manual atau otomatis (melalui GitHub Actions) terhadap Vercel Preview URL untuk mensimulasikan alur pengguna secara menyeluruh.
- **Code Review:** Minimal satu persetujuan dari anggota tim lain diperlukan sebelum PR dapat di-merge.
- **Manual QA:** Tim QA melakukan pengujian manual pada Vercel Preview Deployment.

## 4. Fase 3: Penerapan (Deployment) & Rilis

### 4.1. Pipeline CI/CD
- **Frontend (Vercel):**
    - Vercel terhubung langsung dengan repositori GitHub.
    - Setiap merge ke `main` branch akan secara otomatis memicu build dan deployment ke **lingkungan produksi** Vercel.
    - Proses ini mencakup optimasi aset (minification, code splitting, image optimization) secara otomatis.
- **Backend (Convex):**
    - Perubahan pada skema database dan fungsi backend (queries/mutations) akan di-deploy ke Convex menggunakan **Convex CLI**.
    - Perintah `npx convex deploy` akan dijalankan melalui **GitHub Actions** saat ada perubahan di folder `convex/` pada `main` branch.

### 4.2. Strategi Rilis
- **Continuous Deployment:** Setiap perubahan yang lolos semua pengujian dan review di PR akan langsung di-deploy ke produksi setelah di-merge ke `main`.
- **Zero-Downtime Deployment:** Vercel secara default menyediakan zero-downtime deployment. Pengguna tidak akan mengalami gangguan selama rilis versi baru.

### 4.3. Rencana Rollback
- **Frontend (Vercel):** Vercel Dashboard menyediakan fitur "Instant Rollback" yang memungkinkan pengembalian ke deployment sebelumnya dengan satu klik.
- **Backend (Convex):** Convex menyimpan histori versi dari semua fungsi. Rollback dapat dilakukan dengan men-deploy ulang versi fungsi sebelumnya menggunakan Convex CLI.

## 5. Fase 4: Pasca-Produksi & Operasional Berkelanjutan

### 5.1. Pemantauan (Monitoring) & Logging
- **Monitoring Aplikasi & Performa:**
    - **Vercel Analytics:** Untuk memantau metrik frontend seperti Web Vitals (LCP, FID, CLS), lalu lintas pengunjung, dan performa halaman.
    - **Convex Dashboard:** Untuk memantau performa fungsi backend, penggunaan database, dan waktu eksekusi query/mutation.
- **Logging Terpusat:**
    - **Vercel Logs:** Menyediakan log real-time untuk request, error, dan output dari Serverless Functions (jika ada).
    - **Convex Logs:** Menyediakan log real-time dari eksekusi fungsi backend, termasuk error dan `console.log`.
- **Alerting:** Mengatur peringatan di Vercel dan Convex (jika didukung) atau menggunakan layanan pihak ketiga yang terintegrasi untuk notifikasi anomali performa, error rate tinggi, atau insiden keamanan.

### 5.2. Manajemen Insiden & Dukungan Pengguna
- **Deteksi Insiden:** Melalui pemantauan otomatis dan laporan dari pengguna.
- **Prosedur Respon Insiden:** Prosedur yang jelas untuk eskalasi masalah ke tim yang tepat (DevOps/Backend/Frontend).
- **Dukungan Pengguna:** Mengelola laporan bug dan saran melalui sistem tiket kustom yang dibangun di atas Convex, seperti yang dijelaskan di **PRD Support & Maintenance.md**.
- **Komunikasi Status:** Menggunakan halaman status (misalnya, yang disediakan oleh Vercel atau layanan seperti Statuspage.io) untuk mengkomunikasikan downtime atau maintenance terencana.

### 5.3. Pemeliharaan Berkelanjutan
- **Pemeliharaan Preventif:** Pembaruan rutin dependensi (npm packages) menggunakan alat seperti Dependabot.
- **Pemeliharaan Korektif:** Proses perbaikan bug yang ditemukan akan mengikuti alur pengembangan standar (feature branch -> PR -> review -> merge -> deploy).
- **Pemeliharaan Perfektif:** Peningkatan performa dan refactoring kode secara berkelanjutan.

### 5.4. Keamanan Berkelanjutan
- **Audit Keamanan:** Melakukan audit keamanan berkala.
- **Manajemen Secret:** Mengelola semua kunci API dan secret melalui Environment Variables di Vercel dan Convex. Tidak ada secret yang disimpan di dalam kode.
- **Review Konfigurasi:** Secara berkala meninjau konfigurasi keamanan di Convex (aturan akses), Clerk (pengaturan otentikasi), dan Vercel.

## 6. Tanggung Jawab
- **Tim Pengembangan:** Implementasi fitur, perbaikan bug, penulisan tes, code review.
- **Tim QA:** Pengujian manual, E2E testing.
- **Tim DevOps/Operasi:** Mengelola pipeline CI/CD di GitHub Actions, memantau Vercel dan Convex, mengelola infrastruktur (jika ada komponen di luar Vercel/Convex).