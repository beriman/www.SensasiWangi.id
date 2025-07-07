# Product Requirement Document (PRD) - Technical Architecture & Development Plan Sensasiwangiid V2

## 1. Pendahuluan

Dokumen ini menguraikan arsitektur teknis, pilihan teknologi, rencana pengembangan, strategi pengujian kode, dan rencana deployment untuk platform Sensasiwangiid V2. Tujuannya adalah untuk menyediakan panduan teknis yang jelas untuk tim pengembangan, memastikan skalabilitas, keamanan, dan maintainability sistem.

## 2. Arsitektur Teknis (High-Level)

Sensasiwangiid V2 akan mengadopsi arsitektur **Serverless**. Pendekatan ini dipilih untuk menyederhanakan pengembangan dan deployment, sambil tetap memungkinkan skalabilitas di masa depan.

- **Frontend:** Aplikasi web berbasis SPA (Single Page Application) yang berinteraksi langsung dengan backend Supabase.
- **Backend & Database:** Menggunakan **Supabase** sebagai platform backend-as-a-service (BaaS). Supabase akan menangani semua logika bisnis, manajemen data (database PostgreSQL), otentikasi (Supabase Auth), dan fungsi real-time.

## 3. Pilihan Teknologi

### 3.1. Backend & Database

- **Platform:** **Supabase**. Ini akan berfungsi sebagai database utama (PostgreSQL), backend (melalui Supabase Functions), dan penyedia otentikasi (Supabase Auth).

### 3.2. Frontend

- **Framework:** **React.js** (dengan **Vite** sebagai build tool).
- **Bahasa Pemrograman:** **JavaScript (JSX)**, dengan kemungkinan adopsi TypeScript di masa depan.
- **State Management:** **React Context API** untuk manajemen state sederhana, dengan kemungkinan adopsi Zustand atau Redux Toolkit jika kompleksitas meningkat.
- **Styling:** **Tailwind CSS** dengan **ShadCN UI** untuk komponen UI yang dapat disesuaikan, mendukung gaya Neumorphism.
- **UI Library:** **ShadCN UI** untuk komponen siap pakai yang mudah diintegrasikan dan disesuaikan.

### 3.3. Infrastruktur & Deployment

- **Cloud Provider:** Infrastruktur backend dikelola oleh **Supabase**.
- **Deployment Frontend:** **Vercel**. Vercel akan terhubung ke repositori GitHub untuk CI/CD otomatis.
- **CI/CD:** **GitHub Actions** untuk menjalankan tes dan proses build, yang kemudian di-deploy oleh **Vercel**.
- **Monitoring & Logging:** Memanfaatkan dashboard dan log yang disediakan oleh **Supabase** dan **Vercel**.

## 4. Rencana Pengembangan

### 4.1. Metodologi

- **Agile Scrum:** Pengembangan akan mengikuti metodologi Agile Scrum dengan sprint 2 minggu.
- **Tools:** **Trello** atau **Jira** untuk manajemen proyek.

### 4.2. Version Control

- **Git:** Menggunakan Git.
- **Platform:** **GitHub**.
- **Branching Strategy:** **GitHub Flow** (main branch, feature branches, pull requests).

### 4.3. Lingkungan Pengembangan

- **Development:** Lingkungan lokal dengan Supabase CLI dan Vercel CLI.
- **Staging/Preview:** Vercel akan membuat deployment preview untuk setiap pull request, yang terhubung ke project Supabase development.
- **Production:** Lingkungan live yang di-deploy dari main branch ke Vercel, terhubung ke project Supabase production.

### 4.4. Continuous Integration/Continuous Deployment (CI/CD)

- **CI:** **GitHub Actions** akan digunakan untuk menjalankan linter (ESLint) dan tes (Vitest) pada setiap pull request.
- **CD:** **Vercel** akan secara otomatis men-deploy setiap push ke `main` branch ke produksi. Deployment preview akan dibuat untuk setiap pull request.

## 5. Strategi Pengujian Kode

### 5.1. Unit Testing

- **Cakupan:** Menguji fungsi utilitas, komponen UI, dan state management secara terisolasi.
- **Framework:** **Vitest** dengan **React Testing Library**.
- **Integrasi:** Dijalankan secara otomatis oleh GitHub Actions.

### 5.2. Integration Testing

- **Cakupan:** Menguji interaksi antara komponen frontend dan backend Supabase (Supabase Functions).
- **Framework:** **Vitest** dengan mock-up dari Supabase client.
- **Integrasi:** Dijalankan secara otomatis oleh GitHub Actions.

### 5.3. End-to-End (E2E) Testing

- **Cakupan:** Mensimulasikan alur pengguna secara lengkap.
- **Framework:** **Playwright** atau **Cypress**.
- **Integrasi:** Dijalankan secara manual pada deployment preview sebelum me-merge ke `main`.

### 5.4. Code Quality & Linting

- **Linting:** **ESLint** dengan konfigurasi standar React.
- **Formatting:** **Prettier**.

## 6. Rencana Deployment

### 6.1. Proses Deployment

- **Otomatisasi Frontend (via Vercel):** Deployment akan sepenuhnya otomatis. Setiap push ke `main` branch akan memicu build dan deployment ke produksi.
- **Backend (Supabase):** Perubahan pada schema dan functions Supabase akan di-deploy menggunakan Supabase CLI (migrations), bisa secara manual atau diintegrasikan ke dalam pipeline GitHub Actions.
- **Rollback:** Vercel menyediakan fitur rollback instan ke deployment sebelumnya. Supabase mendukung manajemen migrasi untuk rollback database.

## 7. Keamanan

- **Prinsip Keamanan:** Mengandalkan fitur keamanan bawaan dari Supabase (enkripsi data, Row Level Security, dll.).
- **Aturan Akses:** Mendefinisikan kebijakan **Row Level Security (RLS)** yang ketat di dalam Supabase untuk setiap tabel.
- **Manajemen Secret:** Menggunakan environment variables yang aman di Vercel dan Supabase.

## 8. Skalabilitas dan Performa

- **Skalabilitas:** Mengandalkan skalabilitas otomatis yang disediakan oleh platform Supabase dan Vercel.
- **Optimasi Performa:**
  - **Frontend:** Code splitting, lazy loading, dan optimasi gambar akan diimplementasikan.
  - **Backend:** Optimasi query PostgreSQL dan penggunaan indeks database yang efisien.
- **Caching:** Memanfaatkan caching Vercel untuk aset statis dan caching data di level aplikasi jika diperlukan.

## 9. Monitoring dan Logging

- **Monitoring:** Menggunakan dashboard Supabase dan Vercel untuk memantau kesehatan aplikasi, performa, dan penggunaan.
- **Logging:** Menggunakan sistem logging bawaan Supabase dan Vercel untuk melacak error dan aktivitas.
- **Alerting:** Mengkonfigurasi alerting untuk error kritis.

## 10. Keterkaitan dengan PRD Lain

- **PRD Database Schema.md:** Menjadi dasar implementasi database di Supabase.
- **PRD Auth.md:** Menjadi dasar implementasi otentikasi dengan Supabase Auth.
- **PRD Security.md:** Menjadi panduan untuk implementasi fitur keamanan.
- **PRD Deployment & Operations Plan.md:** Dokumen ini adalah implementasi detail dari rencana tersebut.
- **PRD Error Handling & Logging.md:** Menjadi panduan untuk implementasi logging dan monitoring.
- **PRD Performance & Scalability.md:** Menjadi panduan untuk optimasi performa dan skalabilitas.
