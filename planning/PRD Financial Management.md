Product Requirements Document (PRD) - Modul Manajemen Keuangan

1.  Tujuan
    Modul Manajemen Keuangan bertujuan untuk mengelola semua aspek pergerakan dana di dalam platform SensasiWangi.id, khususnya yang terkait dengan transaksi marketplace. Ini mencakup proses pembayaran, penahanan dana, pelepasan dana, serta pelaporan keuangan. Dashboard Admin Keuangan menyediakan antarmuka terpusat dan efisien bagi Admin Keuangan untuk memantau, memverifikasi, mengelola, dan melaporkan semua transaksi finansial, memastikan transparansi, akuntabilitas, dan efisiensi, baik pada fase awal manual maupun adaptasi otomatisasi di masa mendatang.

2.  Fitur Utama

    2.1. Proses Pembayaran Pembeli
    _ **Fase Awal (Rekening Bersama Manual):**
    _ Pembeli memilih produk dan melanjutkan ke checkout.
    _ Sistem menampilkan detail pembayaran: total harga, biaya admin (jika ada), dan nomor rekening "Rekening Bersama sensasiwangi.id" (atau QR code untuk transfer).
    _ Pembeli melakukan transfer manual dan mengunggah bukti transfer (screenshot/foto) melalui antarmuka yang disediakan.
    _ Sistem mencatat status pembayaran sebagai 'pending_verification'.
    _ **Fase Lanjut (Virtual Account BRI):**
    _ Pembeli memilih produk dan melanjutkan ke checkout.
    _ Sistem menghasilkan Virtual Account BRI unik untuk setiap transaksi.
    _ Pembeli melakukan pembayaran ke Virtual Account tersebut.
    _ Sistem secara otomatis mendeteksi pembayaran dan mengubah status pembayaran menjadi 'paid'.

    2.2. Penahanan Dana (Escrow-like System)
    _ Dana dari pembeli (baik melalui transfer manual maupun VA) akan ditahan oleh SensasiWangi.id (sebagai "Rekening Bersama") hingga transaksi selesai.
    _ Dana akan dilepaskan ke penjual hanya setelah pembeli mengkonfirmasi penerimaan barang dalam kondisi baik, atau setelah periode waktu tertentu jika tidak ada sengketa. \    _ Untuk sambatan/group buy, dana akan ditahan hingga target partisipan/kuantitas terpenuhi dan admin memverifikasi (lihat `PRD Sambatan.md` untuk detail).

    2.3. Manajemen Langganan Penjual (Seller Subscription Management)
    _ **Paket Langganan:** Mendefinisikan paket langganan bulanan/tahunan untuk penjual (misalnya, Basic Seller, Pro Seller) dengan fitur dan batasan yang berbeda (misalnya, jumlah listing, akses fitur premium, akses ke kursus premium di Modul Pembelajaran).
    _ **Pembayaran Langganan:** Penjual akan membayar biaya langganan secara berkala (bulanan/tahunan) untuk mempertahankan akses ke fitur penjualan.
    _ **Status Langganan:** Sistem akan melacak status langganan penjual (aktif, kedaluwarsa, dibatalkan).
    _ **Notifikasi Otomatis:** Mengirim notifikasi otomatis kepada penjual mengenai status langganan (misalnya, pengingat perpanjangan, konfirmasi pembayaran, pemberitahuan kedaluwarsa).
    _ **Pembatalan & Pengembalian Dana:** Mendefinisikan kebijakan pembatalan langganan dan pengembalian dana (jika ada).

    2.4. Pelepasan Dana ke Penjual
    _ **Pemicu Pelepasan Dana:**
    _ Pembeli mengkonfirmasi penerimaan barang melalui platform.
    _ Admin secara manual mengkonfirmasi penerimaan barang (jika pembeli tidak merespons).
    _ Sengketa telah diselesaikan dan keputusan menguntungkan penjual.
    _ **Proses Pelepasan Dana:**
    _ **Fase Awal (Manual):** Admin Keuangan akan secara manual melakukan transfer dana ke rekening bank penjual setelah memverifikasi semua kondisi terpenuhi. Admin akan mencatat detail transfer di Admin Panel.
    _ **Fase Lanjut (Otomatis/Semi-Otomatis):** Setelah integrasi dengan sistem perbankan (misalnya, API BRI), proses pelepasan dana dapat diotomatisasi atau semi-otomatis, mengurangi intervensi manual.
    _ Sistem akan mencatat tanggal dan waktu pelepasan dana.

    2.5. Proses Pengembalian Dana (Refund)
    _ **Pemicu Refund:**
    _ Pembatalan pesanan sebelum pengiriman.
    _ Sengketa diselesaikan dengan keputusan refund kepada pembeli.
    _ Sambatan/group buy gagal mencapai target (lihat `PRD Sambatan.md` untuk detail).
    _ **Proses Refund:**
    _ Admin Keuangan akan memproses refund secara manual ke rekening pembeli. \* Sistem akan mencatat detail refund, termasuk jumlah dan alasan.

    2.6. Manajemen Sengketa Keuangan
    _ Terintegrasi dengan modul Pelaporan (Reports) dan Admin Panel.
    _ Admin dapat menahan pelepasan dana jika ada sengketa yang sedang berlangsung. \* Admin dapat memproses refund atau pelepasan dana berdasarkan hasil mediasi sengketa.

    2.7. Dashboard Admin Keuangan (Antarmuka Pengguna)
    _ **Ringkasan Dashboard (Overview):**
    _ **Statistik Utama:** Total Penjualan (GMV), Total Biaya Admin Terkumpul, Total Dana Ditahan (Escrow), Jumlah Transaksi Pending Verifikasi Pembayaran, Jumlah Transaksi Pending Pelepasan Dana, Jumlah Sengketa Keuangan Aktif.
    _ **Grafik Tren:** Visualisasi tren penjualan, biaya admin, atau jumlah transaksi dari waktu ke waktu.
    _ **Notifikasi/Alert:** Peringatan untuk transaksi yang memerlukan perhatian segera.
    _ **Manajemen Verifikasi Pembayaran (untuk Transfer Manual):**
    _ **Daftar Transaksi Pending Verifikasi:** Tabel dengan detail pesanan, pembeli, penjual, jumlah, tanggal.
    _ **Detail Verifikasi:** Mengklik pesanan menampilkan bukti transfer, kolom input verifikasi.
    _ **Aksi:** Verifikasi Pembayaran, Tolak Pembayaran, Hubungi Pembeli.
    _ **Manajemen Pelepasan Dana ke Penjual:**
    _ **Daftar Transaksi Siap Dilepaskan:** Tabel dengan detail pesanan, penjual, pembeli, jumlah, potongan admin, jumlah bersih.
    _ **Detail Pelepasan Dana:** Mengklik pesanan menampilkan detail rekening penjual, kolom input transfer.
    _ **Aksi:** Proses Pelepasan Dana, Tahan Dana, Hubungi Penjual.
    _ **Manajemen Sengketa Keuangan:**
    _ **Daftar Sengketa Aktif:** Tabel dengan ID Sengketa, ID Pesanan, Pelapor, Pihak Terlibat, Status, Tanggal.
    _ **Detail Sengketa:** Mengklik sengketa menampilkan kronologi, bukti, kolom catatan mediasi.
    _ **Aksi:** Mediasi, Putuskan Sengketa, Tahan/Lepaskan Dana.
    _ **Pelaporan & Analisis Keuangan:**
    _ **Filter & Pencarian:** Berdasarkan tanggal, status, pembeli, penjual, ID pesanan.
    _ **Jenis Laporan:** Laporan Transaksi, Laporan Biaya Admin, Laporan Dana Ditahan, Laporan Refund.
    _ **Ekspor Data:** Opsi unduh CSV/Excel.
    _ **Pengaturan Keuangan:**
    _ **Persentase Biaya Admin:** Konfigurasi persentase biaya admin. \* **Batas Waktu Konfirmasi:** Mengatur batas waktu konfirmasi penerimaan barang.

3.  User Flow Utama (Admin Keuangan)

    3.1. Memverifikasi Pembayaran Manual 1. Admin Keuangan login ke Admin Panel. 2. Navigasi ke Dashboard Admin Keuangan. 3. Melihat notifikasi atau daftar "Transaksi Pending Verifikasi Pembayaran". 4. Mengklik pesanan yang relevan untuk melihat detail dan bukti transfer. 5. Membandingkan dengan mutasi bank. 6. Mengklik "Verifikasi Pembayaran" jika valid. 7. Status pesanan diperbarui, notifikasi ke penjual dikirim.

    3.2. Melepaskan Dana ke Penjual 1. Admin Keuangan melihat notifikasi atau daftar "Transaksi Siap Dilepaskan". 2. Mengklik pesanan yang relevan untuk melihat detail dan rekening penjual. 3. Melakukan transfer dana secara manual melalui sistem perbankan. 4. Menginput nomor referensi transfer dan mengklik "Proses Pelepasan Dana". 5. Status pesanan diperbarui, notifikasi ke penjual dikirim.

    3.3. Mengelola Sengketa Keuangan 1. Admin Keuangan menerima notifikasi sengketa baru atau melihat di dashboard. 2. Navigasi ke "Manajemen Sengketa Keuangan". 3. Mengklik sengketa untuk meninjau detail dan bukti. 4. Melakukan mediasi dengan pembeli dan penjual. 5. Membuat keputusan dan mengambil tindakan yang sesuai (misalnya, melepaskan dana, memproses refund).

    3.4. Admin Memproses Refund 1. Admin Keuangan mengakses Dashboard Admin Keuangan. 2. Melihat pesanan yang memerlukan refund (misalnya, dari laporan sengketa atau pembatalan). 3. Memproses transfer dana kembali ke pembeli. 4. Mencatat detail refund dan mengubah status pesanan menjadi 'refunded'.

4.  Teknologi & Integrasi
    - **Frontend:** React + Vite (untuk membangun antarmuka dashboard, tabel, grafik, formulir).
    - **Backend:** Convex (untuk semua data transaksi, status, sengketa, dan logika bisnis terkait keuangan).
      - Convex functions akan digunakan untuk operasi CRUD pada data keuangan, perhitungan, dan pembaruan status.
    - **Otentikasi & Otorisasi:** Clerk (untuk mengidentifikasi peran pengguna, terutama Admin Keuangan).
    - **Charting Library:** Integrasi dengan library charting (misalnya, Recharts, Chart.js) untuk visualisasi data.
    - **Export Library:** Integrasi dengan library untuk ekspor data ke CSV/Excel.
    - **Integrasi Perbankan (Fase Lanjut):**
      - **Virtual Account BRI:** Integrasi melalui API BRI untuk pembuatan VA unik per transaksi dan deteksi pembayaran otomatis. Ini akan melibatkan penanganan webhook dari BRI untuk pembaruan status pembayaran secara real-time.
      - **Transfer Dana Otomatis:** Potensi integrasi API transfer dana dari BRI untuk otomatisasi pelepasan dana ke penjual, dengan otorisasi yang aman (misalnya, melalui token API atau kredensial yang dienkripsi).

    4.5. Logistik & Pengiriman API
    - **RajaOngkir API:** Integrasi dengan RajaOngkir API untuk:
        - **Perhitungan Biaya Pengiriman:** Menghitung estimasi biaya pengiriman berdasarkan lokasi penjual, lokasi pembeli, berat/dimensi produk, dan pilihan kurir.
        - **Pelacakan Pengiriman:** Memungkinkan pelacakan status pengiriman melalui nomor resi yang diberikan penjual.

    4.6. Penanganan Error dan Edge Cases
    - **Pembayaran Tidak Sesuai:** Sistem akan menandai pembayaran yang jumlahnya tidak sesuai atau tidak teridentifikasi. Admin akan meninjau secara manual dan menghubungi pembeli.
    - **Bukti Transfer Palsu:** Admin akan memiliki kemampuan untuk menolak bukti transfer yang dicurigai palsu dan memblokir pengguna yang mencoba penipuan.
    - **Barang Tidak Dikirim/Rusak:** Jika penjual tidak mengirim barang atau barang rusak, sengketa akan diproses melalui modul Manajemen Sengketa Keuangan.
    - **Pembeli Tidak Konfirmasi Penerimaan:** Setelah periode waktu tertentu (misalnya, 7 hari setelah status 'shipped'), jika pembeli tidak mengkonfirmasi penerimaan, sistem dapat secara otomatis menandai barang 'delivered' dan memicu pelepasan dana, kecuali ada sengketa aktif.
    - **Masalah Teknis API Bank:** Sistem akan memiliki mekanisme retry dan logging untuk kegagalan komunikasi dengan API bank. Admin akan diberitahu untuk intervensi manual jika diperlukan.

    4.7. Notifikasi Terkait Keuangan
    - **Untuk Pembeli:** Notifikasi pembayaran berhasil, status pesanan berubah (dikirim, diterima), refund diproses, sengketa diajukan/diselesaikan.
    - **Untuk Penjual:** Notifikasi pesanan baru (dibayar), dana dilepaskan, sengketa diajukan/diselesaikan.
    - **Untuk Admin Keuangan:** Notifikasi pembayaran pending verifikasi, sengketa baru, transaksi yang memerlukan perhatian khusus.

    4.8. Keamanan Data Finansial
    - Semua data finansial sensitif akan dienkripsi saat disimpan di Convex.
    - Akses ke data finansial akan dibatasi secara ketat berdasarkan peran pengguna (hanya Admin Keuangan).
    - Tidak ada informasi kartu kredit atau detail rekening bank lengkap yang akan disimpan di frontend atau log yang tidak aman.
    - Penerapan praktik terbaik keamanan web (HTTPS, validasi input, pencegahan XSS/CSRF).

    4.9. UI/UX Dashboard Admin Keuangan
    - Desain dashboard akan intuitif dan mudah digunakan, dengan wireframe/sketsa yang jelas untuk setiap bagian (misalnya, tabel transaksi, formulir verifikasi, tampilan detail sengketa) untuk memandu pengembangan frontend.

    4.10. Mata Uang
    - Semua transaksi finansial, tampilan harga, biaya, dan laporan keuangan di seluruh platform akan menggunakan mata uang Rupiah (IDR) secara eksklusif.

5.  Pengukuran Keberhasilan
    - Tingkat keberhasilan transaksi (persentase transaksi yang berhasil diselesaikan).
    - Waktu rata-rata verifikasi pembayaran (untuk fase manual).
    - Waktu rata-rata pelepasan dana ke penjual.
    - Jumlah sengketa keuangan.
    - Akurasi pelaporan keuangan.
    - Tingkat kepuasan Admin Keuangan terhadap efisiensi dashboard.
    - Pengurangan kesalahan manual dalam proses keuangan.
