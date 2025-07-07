Product Requirements Document (PRD) - Strategi Pengujian

1. Tujuan
Dokumen ini menguraikan strategi pengujian komprehensif untuk platform SensasiWangi.id. Tujuannya adalah untuk memastikan kualitas, stabilitas, performa, dan keamanan perangkat lunak, serta meminimalkan cacat sebelum rilis ke produksi. Strategi ini akan memandu tim pengembangan dalam merencanakan, melaksanakan, dan melaporkan aktivitas pengujian.

2. Lingkup Pengujian
Pengujian akan mencakup seluruh aspek platform SensasiWangi.id, termasuk:
- **Frontend:** Antarmuka pengguna, interaksi pengguna, responsivitas, kompatibilitas browser.
- **Backend:** Logika bisnis, API, integrasi database, performa server.
- **Integrasi:** Interaksi antar modul (misalnya, Forum dengan Notifikasi, Marketplace dengan Financial Management), serta integrasi dengan layanan pihak ketiga (Clerk, Convex, AI Moderation API, dll.).
- **Database:** Integritas data, performa query.
- **Keamanan:** Kerentanan umum (XSS, CSRF, SQL Injection), otorisasi, autentikasi.
- **Performa:** Waktu respons, throughput, skalabilitas.
- **Usability:** Kemudahan penggunaan, alur pengguna yang intuitif.

3. Jenis Pengujian

3.1. Unit Testing
- **Tujuan:** Menguji unit kode terkecil secara terisolasi (fungsi, komponen, metode).
- **Cakupan:** Setiap fungsi atau komponen kritis harus memiliki cakupan unit test yang memadai.
- **Alat:** Vitest (untuk React/Vite frontend), framework pengujian bawaan Convex (jika tersedia untuk Convex functions).
- **Pelaksanaan:** Otomatis, dijalankan sebagai bagian dari proses CI/CD.

3.2. Integration Testing
- **Tujuan:** Menguji interaksi antara beberapa unit atau modul yang terintegrasi.
- **Cakupan:** Integrasi antara frontend dan backend, integrasi antar Convex functions, integrasi dengan layanan eksternal (Clerk, layanan email, dll.).
- **Alat:** Vitest (untuk integrasi frontend-backend), pengujian berbasis Convex functions.
- **Pelaksanaan:** Otomatis, dijalankan sebagai bagian dari proses CI/CD.

3.3. End-to-End (E2E) Testing
- **Tujuan:** Mensimulasikan alur pengguna secara menyeluruh dari awal hingga akhir untuk memverifikasi fungsionalitas sistem secara keseluruhan.
- **Cakupan:** Alur kritis seperti pendaftaran pengguna, pembuatan thread forum, pembelian produk, pengajuan tiket dukungan.
- **Alat:** Playwright atau Cypress.
- **Pelaksanaan:** Otomatis, dijalankan pada lingkungan staging sebelum deployment ke produksi.

3.4. Performance Testing
- **Tujuan:** Mengevaluasi performa sistem di bawah beban tertentu (misalnya, jumlah pengguna bersamaan, volume transaksi).
- **Cakupan:** Waktu respons API, waktu muat halaman, throughput sistem.
- **Alat:** Apache JMeter, k6, atau alat load testing lainnya.
- **Pelaksanaan:** Dilakukan secara berkala atau sebelum rilis besar.

3.5. Security Testing
- **Tujuan:** Mengidentifikasi kerentanan keamanan dalam aplikasi.
- **Cakupan:** Otentikasi, otorisasi, validasi input, manajemen sesi, konfigurasi server.
- **Alat:** OWASP ZAP, Burp Suite, atau alat pemindai kerentanan otomatis.
- **Pelaksanaan:** Dilakukan secara berkala, terutama setelah perubahan signifikan pada fitur keamanan.

3.6. Manual Testing / Exploratory Testing
- **Tujuan:** Menemukan cacat yang mungkin terlewat oleh pengujian otomatis, memverifikasi usability, dan memastikan pengalaman pengguna yang intuitif.
- **Cakupan:** Fitur baru, perubahan UI/UX, skenario edge case.
- **Pelaksanaan:** Dilakukan oleh QA tester atau tim produk.

4. Proses Pengujian
- **Perencanaan:** Tim QA/pengembangan akan membuat rencana pengujian untuk setiap fitur atau rilis, mengidentifikasi skenario pengujian, data uji, dan kriteria keberhasilan.
- **Pengembangan Test Case:** Menulis test case berdasarkan PRD dan spesifikasi fungsional.
- **Eksekusi Pengujian:** Menjalankan pengujian otomatis dan manual.
- **Pelaporan Cacat:** Mencatat cacat yang ditemukan dalam sistem pelacakan cacat (misalnya, Jira, GitHub Issues), dengan detail langkah-langkah reproduksi, hasil yang diharapkan, dan hasil aktual.
- **Verifikasi Cacat:** Memverifikasi perbaikan cacat setelah diimplementasikan.
- **Regresi:** Menjalankan pengujian regresi untuk memastikan perubahan baru tidak merusak fungsionalitas yang sudah ada.

5. Lingkungan Pengujian
- **Lingkungan Pengembangan Lokal:** Untuk unit dan integrasi testing awal.
- **Lingkungan Staging:** Lingkungan yang mereplikasi produksi untuk E2E, performa, dan security testing.

6. Tanggung Jawab
- **Tim Pengembangan:** Bertanggung jawab untuk menulis unit dan integration test, serta memperbaiki cacat yang ditemukan.
- **Tim QA (Quality Assurance):** Bertanggung jawab untuk merencanakan pengujian, menulis E2E dan manual test case, melaksanakan pengujian, dan melaporkan cacat.
- **Tim DevOps:** Bertanggung jawab untuk mengelola lingkungan pengujian dan pipeline CI/CD.

7. Alat & Infrastruktur
- **Version Control:** Git (GitHub/GitLab).
- **CI/CD:** GitHub Actions, GitLab CI/CD, atau Jenkins untuk otomatisasi pengujian.
- **Test Management Tool:** Jira, TestRail, atau alat lain untuk mengelola test case dan pelaporan cacat.
- **Code Quality Tools:** ESLint, Prettier, SonarQube (opsional).

8. Pengukuran Keberhasilan
- **Cakupan Kode (Code Coverage):** Persentase kode yang dicakup oleh unit test.
- **Tingkat Cacat (Defect Rate):** Jumlah cacat yang ditemukan per fitur atau per rilis.
- **Waktu Rata-rata Perbaikan Cacat (Mean Time To Repair - MTTR):** Waktu rata-rata yang dibutuhkan untuk memperbaiki cacat.
- **Tingkat Keberhasilan Pengujian Otomatis:** Persentase test case otomatis yang berhasil.
- **Jumlah Cacat yang Ditemukan di Produksi:** Indikator efektivitas strategi pengujian.
