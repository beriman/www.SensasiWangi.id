Product Requirements Document (PRD) - Modul Sambatan (Group Buy)

1. Tujuan
Modul Sambatan bertujuan untuk memfasilitasi pembelian produk secara kolektif (group buy) di platform SensasiWangi.id, memungkinkan penjual menawarkan harga khusus untuk pembelian dalam jumlah besar atau target partisipan tertentu, dan memberikan keuntungan harga bagi pembeli. Tujuannya adalah untuk meningkatkan volume penjualan, mendorong interaksi komunitas, dan memberikan nilai tambah bagi pengguna.

2. Fitur Utama

2.1. Pembuatan Sambatan oleh Penjual
- **Inisiasi:** Penjual dapat membuat listing produk baru di Marketplace dan memilih opsi "Buat Sambatan".
- **Parameter Sambatan:** Penjual harus menentukan parameter berikut:
    - **Produk:** Produk yang akan dijual dalam skema sambatan.
    - **Target Partisipan/Kuantitas:** Jumlah minimum pembeli atau total kuantitas produk yang harus tercapai agar sambatan berhasil (misalnya, "minimal 10 pembeli" atau "minimal 50 unit produk").
    - **Kuantitas Minimum per Pembeli:** Kuantitas minimum produk yang harus diambil oleh setiap pembeli dalam satu partisipasi sambatan.
    - **Kuantitas Maksimum per Pembeli:** Kuantitas maksimum produk yang dapat diambil oleh setiap pembeli dalam satu partisipasi sambatan.
    - **Harga/Penawaran Khusus:** Harga diskon atau penawaran khusus yang hanya berlaku jika target sambatan tercapai.
    - **Batas Waktu (Deadline):** Tanggal dan waktu terakhir bagi pembeli untuk bergabung. Jika target tidak tercapai hingga batas waktu ini, sambatan akan dibatalkan.
    - **Deskripsi Sambatan:** Penjelasan detail tentang sambatan, termasuk manfaat bagi pembeli, estimasi waktu pengiriman setelah target tercapai, dll.
- **Publikasi:** Setelah semua detail diisi, listing sambatan akan tampil di Marketplace dengan indikator khusus (misalnya, "Sambatan Aktif", "Group Buy").

2.2. Partisipasi Pembeli
- **Penemuan:** Pembeli dapat menemukan listing sambatan di Marketplace, baik melalui pencarian, filter, atau halaman khusus sambatan.
- **Bergabung:** Pembeli yang tertarik dapat mengklik tombol "Gabung Sambatan" pada halaman produk sambatan.
- **Pembayaran Awal:** Pembeli akan diminta untuk melakukan pembayaran sesuai harga sambatan. Dana ini akan langsung masuk ke Rekening Bersama SensasiWangi.id (sistem escrow).
    - **Fase Awal (Manual):** Pembeli melakukan transfer manual dan mengunggah bukti transfer. Admin Keuangan akan memverifikasi pembayaran secara manual.
    - **Fase Lanjut (Virtual Account BRI):** Pembeli membayar melalui Virtual Account unik, dan pembayaran terverifikasi secara otomatis.
- **Status Partisipan:** Setelah pembayaran terverifikasi, pembeli akan terdaftar sebagai partisipan sambatan.

2.3. Pelacakan Status Sambatan
- **Progress Bar:** Halaman detail produk sambatan akan menampilkan progress bar yang menunjukkan berapa banyak partisipan/kuantitas yang sudah terkumpul dibandingkan dengan target.
- **Jumlah Partisipan/Kuantitas Saat Ini:** Angka aktual partisipan atau kuantitas yang sudah bergabung akan diperbarui secara real-time.
- **Sisa Waktu:** Hitung mundur waktu hingga batas waktu sambatan berakhir.

2.4. Notifikasi Sambatan
- **Untuk Penjual:**
    - Notifikasi setiap kali ada pembeli baru bergabung.
    - Notifikasi saat target tercapai.
    - Notifikasi jika sambatan dibatalkan.
- **Untuk Pembeli (Partisipan):**
    - Konfirmasi berhasil bergabung dengan sambatan.
    - Notifikasi saat target tercapai.
    - Notifikasi jika sambatan dibatalkan (dengan informasi pengembalian dana).
    - Notifikasi saat produk dikirim (setelah sambatan berhasil).

2.5. Penyelesaian Sambatan
- **Target Tercapai:**
    - Jika target partisipan/kuantitas tercapai sebelum atau pada batas waktu, sambatan dianggap berhasil.
    - Sistem akan mengunci partisipasi baru.
    - Penjual akan menerima notifikasi bahwa sambatan berhasil dan dapat mulai memproses pesanan.
    - Dana dari Rekening Bersama akan tetap ditahan hingga penjual mengirimkan barang dan pembeli mengkonfirmasi penerimaan.
    - Setelah konfirmasi penerimaan dari pembeli, dana akan dilepaskan ke penjual (setelah dipotong biaya admin), mengikuti alur pelepasan dana di `PRD Financial Management.md`.
- **Target Tidak Tercapai (Pembatalan Otomatis):**
    - Jika target partisipan/kuantitas tidak tercapai hingga batas waktu, sambatan akan otomatis dibatalkan.
    - Semua partisipan akan menerima notifikasi pembatalan.
    - **Pengembalian Dana Otomatis:** Dana yang telah dibayarkan oleh partisipan akan secara otomatis dikembalikan sepenuhnya ke rekening/metode pembayaran asal mereka. Proses ini akan diproses oleh Admin Keuangan (manual di fase awal, otomatis di fase lanjut).

2.6. Peran Admin dalam Sambatan
- **Verifikasi Pembayaran:** Admin Keuangan memverifikasi pembayaran manual dari partisipan sambatan.
- **Pemantauan:** Admin dapat memantau semua sambatan aktif, progresnya, dan statusnya melalui Admin Panel.
- **Intervensi (Opsional):** Dalam kasus tertentu (misalnya, masalah teknis, pelanggaran aturan), admin mungkin memiliki kemampuan untuk membatalkan sambatan secara manual atau memperpanjang batas waktu (dengan persetujuan penjual dan notifikasi ke partisipan).
- **Pelepasan Dana:** Admin Keuangan bertanggung jawab untuk melepaskan dana ke penjual setelah sambatan berhasil dan barang diterima pembeli.
- **Pengembalian Dana:** Admin Keuangan memproses pengembalian dana jika sambatan dibatalkan.

3. User Flow Utama

3.1. Penjual Membuat Sambatan
1. Penjual login ke dashboard.
2. Navigasi ke bagian "Manajemen Produk" atau "Buat Sambatan Baru".
3. Pilih produk yang akan disambat atau buat produk baru.
4. Aktifkan opsi "Buat Sambatan" dan isi parameter yang diperlukan (target, harga khusus, batas waktu, deskripsi).
5. Publikasikan sambatan.

3.2. Pembeli Bergabung dengan Sambatan
1. Pembeli menemukan listing sambatan di Marketplace.
2. Mengklik "Gabung Sambatan".
3. Melakukan pembayaran awal ke Rekening Bersama.
4. Menerima konfirmasi partisipasi.

3.3. Penyelesaian Sambatan (Skenario Berhasil)
1. Target partisipan/kuantitas tercapai sebelum batas waktu.
2. Penjual menerima notifikasi keberhasilan dan mulai memproses pesanan.
3. Pembeli menerima produk dan mengkonfirmasi penerimaan.
4. Dana dilepaskan dari Rekening Bersama ke penjual.

3.4. Penyelesaian Sambatan (Skenario Gagal)
1. Batas waktu tercapai dan target partisipan/kuantitas tidak tercapai.
2. Sambatan otomatis dibatalkan.
3. Semua partisipan menerima notifikasi pembatalan dan pengembalian dana otomatis diproses.

4. Teknologi & Integrasi
- **Backend:** Convex (untuk penyimpanan data sambatan, status, partisipan, dan logika bisnis terkait).
- **Frontend:** React + Vite (untuk UI pembuatan sambatan, tampilan detail sambatan, progress bar, dan notifikasi).
- **Otentikasi:** Clerk (untuk manajemen pengguna dan hak akses penjual/pembeli).
- **Integrasi Marketplace:** Modul Sambatan akan terintegrasi erat dengan modul Marketplace untuk listing produk dan alur pembelian.
- **Integrasi Financial Management:** Terintegrasi dengan `PRD Financial Management.md` untuk penanganan escrow, verifikasi pembayaran, pelepasan dana, dan pengembalian dana.
- **Integrasi Notifikasi:** Terintegrasi dengan `PRD Notification.md` untuk pengiriman notifikasi status sambatan kepada penjual dan pembeli.
- **Database Schema:** Penambahan field `isSambatan`, `minParticipants`, `targetQuantity`, `currentParticipants`, `deadline`, `specialPrice`, `sambatanStatus` di koleksi `marketplace_products`. Koleksi `sambatan_participants` untuk mencatat partisipasi pembeli.

5. Pengukuran Keberhasilan
- Jumlah sambatan yang berhasil dibuat dan diselesaikan.
- Tingkat keberhasilan sambatan (persentase sambatan yang mencapai target).
- Jumlah partisipan rata-rata per sambatan.
- Volume penjualan yang dihasilkan dari sambatan.
- Tingkat kepuasan pengguna (penjual dan pembeli) terhadap fitur sambatan.
- Waktu rata-rata penyelesaian sambatan.
