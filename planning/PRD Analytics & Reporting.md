# Product Requirement Document (PRD) - Analytics & Reporting Sensasiwangiid V2

## 1. Pendahuluan

Dokumen ini menguraikan persyaratan untuk pengumpulan data, pelacakan metrik, penyimpanan, visualisasi, dan pelaporan untuk platform Sensasiwangiid V2. Tujuannya adalah untuk menyediakan wawasan yang dapat ditindaklanjuti mengenai kinerja platform, perilaku pengguna, dan efektivitas fitur, mendukung pengambilan keputusan berbasis data.

## 2. Tujuan Analitik & Pelaporan

- **Memahami Perilaku Pengguna:** Mengidentifikasi bagaimana pengguna berinteraksi dengan platform, fitur yang paling sering digunakan, dan titik-titik hambatan.
- **Mengukur Kinerja Bisnis:** Melacak metrik kunci yang relevan dengan tujuan bisnis (misalnya, konversi, retensi, pendapatan).
- **Mengidentifikasi Peluang Peningkatan:** Menemukan area di mana platform dapat dioptimalkan untuk pengalaman pengguna yang lebih baik atau efisiensi operasional.
- **Mendukung Pengambilan Keputusan:** Menyediakan data yang akurat dan relevan untuk tim produk, pemasaran, operasional, dan manajemen.
- **Memantau Kesehatan Sistem:** Melacak metrik performa dan penggunaan sumber daya untuk memastikan stabilitas dan ketersediaan.

## 3. Metrik Kunci yang Akan Dilacak

### 3.1. Metrik Pengguna

- **Akuisisi:** Jumlah pendaftaran baru, sumber akuisisi (referral, organik, kampanye).
- **Aktivasi:** Tingkat penyelesaian onboarding, penggunaan fitur inti pertama kali.
- **Retensi:** Tingkat retensi pengguna (harian, mingguan, bulanan), churn rate.
- **Engagement:** Sesi per pengguna, durasi sesi, jumlah halaman/fitur yang dilihat, interaksi dengan forum/pesan pribadi.

### 3.1.2. Metrik Pesan Pribadi

- **Jumlah Pesan Terkirim:** Total pesan pribadi yang dikirim.
- **Jumlah Percakapan Baru:** Total percakapan pribadi yang dimulai.
- **Waktu Respons Pesan:** Waktu rata-rata yang dibutuhkan pengguna untuk membalas pesan.
- **Jumlah Pengguna Aktif Pesan:** Jumlah pengguna yang aktif mengirim atau menerima pesan.
- **Jumlah Laporan Penyalahgunaan Pesan:** Metrik terkait moderasi pesan pribadi.

### 3.1.1. Metrik Gamifikasi

- **Perolehan EXP:** Jumlah total EXP yang diperoleh pengguna, EXP per aktivitas.
- **Peningkatan Level:** Jumlah pengguna yang mencapai level tertentu, waktu rata-rata untuk naik level.
- **Perolehan Badge:** Jumlah badge yang diperoleh, badge terpopuler.
- **Papan Peringkat:** Posisi pengguna di papan peringkat.
- **Partisipasi Bonus Harian:** Jumlah pengguna yang mengklaim bonus EXP harian.

- **Demografi:** Data demografi pengguna (jika dikumpulkan dan relevan).

### 3.2. Metrik Bisnis & Fungsional

- **Catatan:** Semua metrik finansial di bawah ini akan diukur dalam Rupiah (IDR).
- **Marketplace:**
  - Jumlah produk yang diunggah/dijual.
  - Jumlah transaksi, nilai transaksi rata-rata (AOV).
  - Tingkat konversi pembelian.
  - Produk terlaris, kategori terpopuler.
  - Tingkat pengembalian/pembatalan.
  - Jumlah sambatan yang dibuat dan berhasil diselesaikan (sesuai PRD Sambatan.md).
  - Tingkat partisipasi dalam sambatan.
- **Forum:**
  - Jumlah postingan baru, balasan.
  - Topik terpopuler, pengguna paling aktif.
  - Waktu yang dihabiskan di forum.
- **Learning:**
  - Jumlah kursus yang diakses/diselesaikan.
  - Tingkat penyelesaian kursus.
  - Modul terpopuler.
  - Jumlah pengguna yang memperoleh sertifikat.
  - Waktu rata-rata yang dihabiskan di modul pembelajaran.
- **Financial Management:**
  - Jumlah pembayaran/penarikan.
  - Nilai total transaksi finansial.
  - Biaya transaksi.
- **Admin/Moderator:**
  - Aktivitas admin/moderator (misalnya, moderasi konten, manajemen pengguna).
  - Waktu respons moderasi.
- **Dukungan Pelanggan:**
  - Jumlah tiket yang diajukan.
  - Waktu respons rata-rata tiket.
  - Waktu penyelesaian rata-rata tiket.
  - Tingkat kepuasan pelanggan (CSAT) dari tiket.
- **Saran dan Kritik:**
  - Jumlah saran dan kritik yang diajukan.
  - Persentase masukan yang ditindaklanjuti.
  - Waktu rata-rata tindak lanjut masukan.
  - Jumlah EXP yang diberikan melalui fitur ini.
- **Manajemen Konten (CMS):**
  - Jumlah konten baru yang dipublikasikan per periode.
  - Jumlah tampilan halaman (page views) untuk artikel/halaman statis.
  - Waktu rata-rata yang dihabiskan pengguna di halaman konten.
  - Tingkat klik (CTR) dari preview konten di landing page.
  - Peningkatan peringkat SEO untuk kata kunci relevan.
- **Moderasi Konten:**
  - Jumlah konten yang terdeteksi secara otomatis.
  - Akurasi deteksi otomatis (tingkat false positive/negative).
  - Waktu rata-rata peninjauan manual.
  - Persentase konten yang ditindaklanjuti/dihapus.
  - Jumlah peringatan/pemblokiran akun.
  - Tingkat pelanggaran berulang oleh pengguna.
- **Nusantarum:**
  - Jumlah entitas (perfumer, brand, varian) dalam database.
  - Jumlah pencarian yang dilakukan di Nusantarum.
  - Tingkat kepuasan pengguna terhadap kualitas dan kelengkapan data.
  - Jumlah kontribusi data dari komunitas.
  - Tingkat adopsi fitur Nusantarum.

### 3.3. Metrik Performa & Kesehatan Sistem

- Waktu muat halaman (page load time).
- Waktu respons API.
- Tingkat kesalahan (error rate).
- Penggunaan sumber daya server (CPU, memori, disk).
- Uptime/Downtime.

## 4. Pengumpulan Data

- **Event Tracking:** Menggunakan event tracking untuk mencatat interaksi pengguna (misalnya, klik tombol, kunjungan halaman, penyelesaian formulir).
- **Server-Side Logging:** Mengumpulkan log dari backend untuk aktivitas sistem, error, dan performa API.
- **Database Metrics:** Mengumpulkan metrik langsung dari database (misalnya, performa query, ukuran database).
- **Integrasi Pihak Ketiga:** Mengintegrasikan dengan layanan analitik pihak ketiga (misalnya, Google Analytics, Mixpanel, Amplitude) untuk pelacakan pengguna di frontend.

## 5. Penyimpanan Data Analitik

- **Data Warehouse/Lake:** Data analitik akan disimpan dalam data warehouse atau data lake terpisah dari database operasional untuk analisis skala besar dan performa.
- **Skema Data:** Skema data akan dirancang untuk mendukung query analitik yang efisien.
- **Retensi Data:** Kebijakan retensi data akan ditentukan berdasarkan kebutuhan bisnis dan regulasi.

## 6. Visualisasi Data & Pelaporan

### 6.1. Dashboard

- **Dashboard Pengguna:** Ringkasan metrik pengguna utama (akuisi, retensi, engagement).
- **Dashboard Bisnis:** Ringkasan metrik marketplace, finansial, dan performa bisnis.
- **Dashboard Operasional:** Metrik kesehatan sistem, error, dan penggunaan sumber daya.
- **Kustomisasi:** Kemampuan untuk membuat dashboard kustom berdasarkan kebutuhan departemen.

### 6.2. Jenis Laporan

- **Laporan Reguler:** Laporan mingguan/bulanan yang dikirimkan secara otomatis ke pemangku kepentingan.
- **Laporan Ad-hoc:** Kemampuan untuk membuat laporan sesuai permintaan untuk analisis mendalam.
- **Laporan Tren:** Analisis tren metrik dari waktu ke waktu.
- **Laporan Segmentasi:** Analisis metrik berdasarkan segmen pengguna (misalnya, pengguna baru vs. pengguna lama, pembeli vs. penjual).

### 6.3. Alat Visualisasi

- **Business Intelligence (BI) Tool:** Looker Studio (Google Data Studio) / Metabase / Power BI / Tableau (pilih salah satu).
- **Integrasi:** Integrasi dengan alat analitik pihak ketiga untuk visualisasi data frontend.

## 7. Tanggung Jawab

- **Tim Produk:** Mendefinisikan metrik kunci dan persyaratan pelaporan.
- **Tim Pengembangan:** Mengimplementasikan pengumpulan data, membangun pipeline data, dan mengintegrasikan alat analitik.
- **Tim Analitik/Data (jika ada):** Melakukan analisis data, membuat dashboard dan laporan, serta memberikan wawasan.

## 8. Implementasi & Integrasi

- **Data Extraction dari Convex:** Menggunakan Convex API atau fitur ekspor data untuk mengekstrak data mentah.
- **Data Extraction dari Clerk:** Menggunakan Clerk API atau webhook untuk mengekstrak data pengguna.
- **Frontend Tracking:** Menggunakan Google Analytics 4 (GA4) atau Mixpanel SDK untuk pelacakan event pengguna di frontend.
- **Data Pipeline:** Membangun pipeline untuk mengekstrak, mentransformasi, dan memuat data (ETL) dari Convex, Clerk, dan sumber lainnya ke data warehouse/lake untuk analisis terpusat.

## 9. Keamanan Data Analitik

- **Anonimisasi/Pseudonimisasi:** Data pribadi yang sensitif harus dianonimkan atau dipseudonimkan sebelum disimpan di sistem analitik.
- **Kontrol Akses:** Kontrol akses yang ketat ke data analitik dan dashboard.
- **Kepatuhan:** Memastikan pengumpulan dan penyimpanan data analitik mematuhi regulasi privasi data (misalnya, GDPR).

## 10. Lampiran (Opsional)

- Daftar Event Tracking Detail
- Contoh Dashboard/Laporan
- Diagram Alur Data Analitik
