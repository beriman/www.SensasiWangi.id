# Product Requirement Document (PRD) - Support & Maintenance Sensasiwangiid V2

## 1. Pendahuluan

Dokumen ini menguraikan persyaratan untuk dukungan dan pemeliharaan platform Sensasiwangiid V2 setelah peluncuran. Tujuannya adalah untuk memastikan ketersediaan layanan yang tinggi, respons cepat terhadap masalah, pembaruan yang teratur, dan kepuasan pengguna melalui dukungan yang efektif.

## 2. Tujuan Dukungan & Pemeliharaan

- **Memastikan Ketersediaan Layanan:** Meminimalkan downtime dan memastikan platform selalu dapat diakses oleh pengguna.
- **Menyelesaikan Masalah dengan Cepat:** Mengidentifikasi, mendiagnosis, dan memperbaiki bug serta insiden keamanan secara efisien.
- **Meningkatkan Pengalaman Pengguna:** Menyediakan saluran dukungan yang responsif dan membantu untuk pertanyaan dan masalah pengguna.
- **Menjaga Kinerja Optimal:** Melakukan pemeliharaan rutin untuk memastikan platform beroperasi pada performa puncak.
- **Mengelola Perubahan:** Menerapkan pembaruan fitur dan perbaikan secara terstruktur dan terkontrol.

## 3. Saluran Dukungan Pengguna

- **Pusat Bantuan/FAQ:** Bagian di platform yang berisi jawaban atas pertanyaan umum dan panduan penggunaan.
- **Sistem Tiket/Email:** Saluran utama bagi pengguna untuk melaporkan masalah atau mengajukan pertanyaan yang memerlukan bantuan personal.
- **Live Chat (Opsional):** Dukungan real-time untuk pertanyaan mendesak.
- **Forum Komunitas:** Pengguna dapat saling membantu dan mencari solusi dari masalah umum.
- **Media Sosial:** Pemantauan dan respons terhadap pertanyaan atau keluhan yang diajukan melalui media sosial.

## 4. Proses Dukungan Pengguna

- **Penerimaan Tiket:** Semua permintaan dukungan (bug, saran, kritik) dicatat dalam sistem tiket kustom yang datanya disimpan di Convex. Laporan akan secara otomatis terhubung dengan identitas pengguna melalui Clerk.
- **Prioritisasi:** Tiket diprioritaskan berdasarkan dampak dan urgensi (misalnya, kritis, tinggi, sedang, rendah).
- **Penugasan:** Tiket ditugaskan kepada anggota tim yang relevan.
- **Resolusi:** Tim dukungan bekerja untuk menyelesaikan masalah atau menjawab pertanyaan.
- **Komunikasi:** Pengguna diberitahu tentang status tiket dan resolusi.
- **Penutupan Tiket:** Tiket ditutup setelah masalah teratasi dan dikonfirmasi oleh pengguna.
- **Imbalan Gamifikasi (Bug Reporting):** Jika bug yang dilaporkan oleh pengguna berhasil direproduksi dan diperbaiki, pengguna tersebut akan diberikan imbalan Experience Points (EXP) sebagai bentuk apresiasi dan insentif untuk partisipasi aktif dalam menjaga kualitas platform.
- **Dashboard Admin untuk Laporan Pengguna:** Semua laporan bug, saran, dan kritik dari pengguna akan masuk ke dalam dashboard khusus admin. Dashboard ini akan mengambil data dari Convex, memungkinkan penyortiran laporan berdasarkan kriteria tertentu (misalnya, tanggal, prioritas, jenis laporan), dan memungkinkan admin untuk memberikan tanda 'sudah ditindaklanjuti' atau 'belum ditindaklanjuti' pada setiap laporan.

## 5. Pemeliharaan Sistem

### 5.1. Pemeliharaan Preventif

- **Pembaruan Perangkat Lunak:** Pembaruan rutin sistem operasi, database, library, dan dependensi.
- **Patch Keamanan:** Penerapan patch keamanan segera setelah tersedia.
- **Optimasi Database:** Pembersihan, indeks ulang, dan optimasi query secara berkala.
- **Pembersihan Log:** Pengelolaan dan pembersihan log untuk menghemat ruang penyimpanan.
- **Pemeriksaan Kesehatan Sistem:** Pemeriksaan rutin terhadap metrik performa dan penggunaan sumber daya.

### 5.2. Pemeliharaan Korektif (Bug Fixing)

- **Pelaporan Bug:** Proses yang jelas untuk melaporkan bug (internal dan eksternal).
- **Reproduksi Bug:** Langkah-langkah untuk mereproduksi bug.
- **Prioritisasi Bug:** Prioritisasi berdasarkan dampak dan frekuensi.
- **Perbaikan Bug:** Pengembangan dan pengujian perbaikan bug.
- **Deployment Perbaikan:** Proses deployment perbaikan ke lingkungan produksi.

### 5.3. Pemeliharaan Adaptif

- **Kompatibilitas:** Memastikan kompatibilitas dengan versi browser, sistem operasi, dan perangkat baru.
- **Perubahan Regulasi:** Menyesuaikan platform dengan perubahan regulasi atau hukum.

### 5.4. Pemeliharaan Perfektif

- **Peningkatan Performa:** Mengidentifikasi dan mengimplementasikan optimasi performa.
- **Refactoring Kode:** Perbaikan struktur kode untuk maintainability yang lebih baik tanpa mengubah fungsionalitas.

## 6. Manajemen Insiden

- **Deteksi Insiden:** Melalui pemantauan otomatis dan laporan pengguna.
- **Klasifikasi Insiden:** Mengklasifikasikan insiden berdasarkan tingkat keparahan dan dampak.
- **Respons Insiden:** Tim yang ditunjuk untuk merespons insiden (misalnya, tim DevOps, tim pengembangan).
- **Komunikasi Insiden:** Komunikasi internal dan eksternal yang jelas selama insiden.
- **Post-Mortem:** Analisis pasca-insiden untuk mengidentifikasi akar masalah dan mencegah terulangnya kembali.

## 7. Komunikasi & Pelaporan

- **Pembaruan Status:** Komunikasi rutin kepada pengguna tentang status platform (misalnya, melalui halaman status, pengumuman dalam aplikasi).
- **Laporan Dukungan:** Laporan berkala tentang volume tiket, waktu respons, dan tingkat resolusi.
- **Laporan Pemeliharaan:** Laporan tentang aktivitas pemeliharaan yang dilakukan dan dampaknya.

## 8. Peran dan Tanggung Jawab

- **Tim Dukungan Pelanggan:** Menangani pertanyaan dan masalah pengguna tingkat pertama.
- **Tim Pengembangan:** Memperbaiki bug, mengembangkan pembaruan, dan melakukan refactoring.
- **Tim DevOps/Operasi:** Mengelola infrastruktur, memantau sistem, dan melakukan pemeliharaan preventif.
- **Manajemen Produk:** Mengumpulkan umpan balik pengguna dan memprioritaskan perbaikan/fitur.

## 9. Alat dan Teknologi

- **Sistem Tiket:** Modul kustom yang dibangun di atas Convex untuk penyimpanan data laporan.
- **Dashboard Admin Kustom:** Dibangun untuk manajemen laporan bug, saran, dan kritik, dengan data dari Convex dan integrasi dengan Clerk untuk informasi pengguna.
- **Monitoring:** Prometheus & Grafana / New Relic / Datadog (untuk memantau performa aplikasi dan Convex).
- **Logging:** ELK Stack (Elasticsearch, Logstash, Kibana) / Splunk / Grafana Loki (untuk log aplikasi dan aktivitas Convex/Clerk).
- **Halaman Status:** Statuspage.io.
- **Komunikasi Internal:** Slack / Microsoft Teams.

## 10. Metrik Dukungan & Pemeliharaan

- **Waktu Respons Rata-rata (Average Response Time):** Waktu rata-rata untuk merespons tiket dukungan.
- **Waktu Resolusi Rata-rata (Average Resolution Time):** Waktu rata-rata untuk menyelesaikan tiket dukungan.
- **Tingkat Kepuasan Pelanggan (CSAT):** Diukur melalui survei setelah resolusi tiket.
- **Jumlah Bug yang Ditemukan/Diperbaiki:** Per sprint/rilis.
- **Uptime Sistem:** Persentase waktu sistem beroperasi.
- **Mean Time To Recover (MTTR):** Waktu rata-rata untuk memulihkan sistem setelah insiden.

## 11. Lampiran (Opsional)

- SLA (Service Level Agreement)
- Prosedur Operasi Standar (SOP) untuk Dukungan
- Daftar Kontak Darurat
