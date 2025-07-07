# Product Requirement Document (PRD) - Performance & Scalability Sensasiwangiid V2

## 1. Pendahuluan

Dokumen ini menguraikan persyaratan performa dan skalabilitas untuk platform Sensasiwangiid V2. Tujuannya adalah untuk memastikan bahwa platform dapat menangani beban pengguna yang terus bertambah, mempertahankan waktu respons yang cepat, dan menyediakan pengalaman pengguna yang mulus bahkan di bawah kondisi puncak. Dokumen ini melengkapi bagian skalabilitas di PRD Technical Architecture.

## 2. Tujuan Performa

- **Waktu Respons Halaman:**
  - Halaman utama (Landing Page, Forum, Marketplace): < 2 detik (first contentful paint).
  - Halaman detail (Produk, Thread, Profil): < 1.5 detik.
  - Halaman dengan interaksi tinggi (Checkout, Kirim Pesan): < 1 detik.
- **Waktu Respons API:**
  - API baca (query): < 200 ms.
  - API tulis (mutasi): < 500 ms.
- **Throughput:**
  - Mampu menangani 1000 permintaan per detik (RPS) pada beban normal.
  - Mampu menangani 5000 RPS pada beban puncak.
- **Tingkat Kesalahan:**
  - Tingkat kesalahan server (HTTP 5xx) < 0.1%.
- **Ketersediaan (Uptime):**
  - Target uptime 99.9% (tidak termasuk downtime terencana).

## 3. Tujuan Skalabilitas

- **Pengguna Bersamaan:** Mampu mendukung 10.000 pengguna bersamaan (concurrent users) dengan performa yang stabil.
- **Volume Data:** Mampu mengelola pertumbuhan data hingga 1 TB dalam 2 tahun pertama tanpa degradasi performa yang signifikan.
- **Pertumbuhan Pengguna:** Mampu mengakomodasi pertumbuhan pengguna hingga 100.000 pengguna terdaftar dalam 1 tahun.
- **Fleksibilitas Skala:** Sistem harus dapat di-scale secara horizontal (menambah instance server/layanan) dan vertikal (meningkatkan kapasitas instance) sesuai kebutuhan.

## 4. Strategi Optimasi Performa

### 4.1. Optimasi Frontend

- **Lazy Loading:** Memuat komponen, gambar, dan data hanya saat dibutuhkan (misalnya, gambar di luar viewport, modul yang jarang digunakan).
- **Code Splitting:** Memecah bundle JavaScript menjadi bagian-bagian yang lebih kecil untuk mengurangi waktu muat awal.
- **Image Optimization:** Menggunakan format gambar yang efisien (WebP), kompresi, dan ukuran responsif.
- **Caching Browser:** Memanfaatkan caching browser untuk aset statis (CSS, JS, gambar).
- **CDN (Content Delivery Network):** Menggunakan CDN untuk menyajikan aset statis lebih cepat kepada pengguna secara global.
- **Minimal DOM Manipulation:** Mengurangi manipulasi DOM yang berlebihan untuk performa rendering yang lebih baik.

### 4.2. Optimasi Backend (Convex & Functions)

- **Query Optimization:** Mendesain query Convex yang efisien, memanfaatkan indeks yang tepat.
- **Indeks Database:** Memastikan semua field yang sering digunakan dalam query, filter, dan sorting memiliki indeks yang sesuai di Convex.
- **Batching:** Menggabungkan beberapa operasi database menjadi satu permintaan untuk mengurangi overhead jaringan.
- **Debouncing/Throttling:** Menerapkan debouncing/throttling pada fungsi-fungsi yang sering dipanggil untuk mengurangi beban server.
- **Optimasi Convex Functions:** Menulis Convex functions yang efisien, menghindari operasi yang mahal di jalur kritis.
- **Caching Data:** Mengimplementasikan caching di Convex (jika didukung) atau di sisi aplikasi untuk data yang sering diakses dan jarang berubah.

### 4.3. Optimasi Otentikasi (Clerk)

- **Clerk SDK Optimization:** Memanfaatkan fitur caching dan optimasi yang disediakan oleh Clerk SDK untuk meminimalkan panggilan ke server otentikasi.
- **Session Management:** Mengoptimalkan manajemen sesi untuk mengurangi overhead otentikasi pada setiap permintaan.

### 4.4. Optimasi Jaringan

- **HTTP/2 atau HTTP/3:** Memanfaatkan protokol jaringan terbaru untuk multiplexing dan kompresi header.
- **GZIP Compression:** Mengaktifkan kompresi GZIP untuk respons server.
- **Minifikasi:** Minifikasi file CSS, JavaScript, dan HTML.

## 5. Strategi Skalabilitas

### 5.1. Skalabilitas Horizontal

- **Stateless Components:** Mendesain komponen aplikasi agar stateless sebisa mungkin untuk memudahkan penskalaan horizontal.
- **Load Balancing:** Menggunakan load balancer untuk mendistribusikan traffic secara merata ke beberapa instance aplikasi (jika ada backend terpisah).
- **Convex Scalability:** Mengandalkan skalabilitas bawaan Convex untuk database dan backend functions. Memahami batasan dan opsi penskalaan yang ditawarkan oleh Convex pada tier yang digunakan.
- **Clerk Scalability:** Mengandalkan skalabilitas bawaan Clerk untuk manajemen otentikasi.

### 5.2. Skalabilitas Vertikal

- Meningkatkan kapasitas sumber daya (CPU, RAM) pada instance server jika diperlukan untuk komponen yang tidak dapat di-scale secara horizontal (misalnya, database tertentu jika tidak menggunakan Convex sepenuhnya).

### 5.3. Arsitektur Microservices/Modular

- Jika proyek berkembang, arsitektur modular atau microservices akan mempermudah penskalaan bagian-bagian tertentu dari sistem secara independen.

### 5.4. Database Scalability (Convex)

- Memanfaatkan fitur skalabilitas Convex seperti sharding otomatis (jika tersedia) atau strategi partisi data untuk menangani volume data yang besar.
- Memantau penggunaan sumber daya Convex dan mengoptimalkan skema/query jika ada bottleneck.

## 6. Pengujian Beban (Load Testing) & Pemantauan Performa

### 6.1. Pengujian Beban

- **Alat:** Menggunakan alat pengujian beban seperti JMeter, K6, atau Locust.
- **Skenario Pengujian:** Mensimulasikan skenario pengguna yang realistis (misalnya, pendaftaran, login, browsing produk, membuat postingan forum, checkout).
- **Lingkungan Pengujian:** Melakukan pengujian beban di lingkungan yang menyerupai produksi (staging).
- **Metrik yang Diukur:** Waktu respons, throughput, tingkat kesalahan, penggunaan sumber daya.

### 6.2. Pemantauan Performa (Monitoring)

- **APM (Application Performance Monitoring):** Menggunakan alat APM (misalnya, New Relic, Datadog, Prometheus & Grafana) untuk memantau performa aplikasi secara real-time.
- **Logging:** Mengumpulkan log dari semua komponen sistem (frontend, backend, Convex, Clerk) untuk analisis performa dan debugging.
- **Alerting:** Mengatur peringatan untuk metrik performa yang melampaui ambang batas (misalnya, waktu respons tinggi, tingkat kesalahan meningkat).
- **Dashboard Performa:** Membuat dashboard khusus untuk memvisualisasikan metrik performa kunci.

## 7. Tanggung Jawab

- **Tim Pengembangan:** Bertanggung jawab untuk mengimplementasikan praktik coding yang efisien, mengoptimalkan query, dan memastikan skalabilitas kode.
- **Tim DevOps/Operasi:** Bertanggung jawab untuk mengelola infrastruktur, mengkonfigurasi load balancing, memantau sistem, dan melakukan pengujian beban.
- **Manajemen Produk:** Mendefinisikan tujuan performa dan skalabilitas berdasarkan kebutuhan bisnis.

## 8. Lampiran (Opsional)

- Hasil Pengujian Beban
- Diagram Arsitektur Skalabilitas
- Daftar Metrik Performa Detail
- Rencana Optimasi Berkelanjutan
