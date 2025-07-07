PRD Modul Marketplace – sensasiwangi.id

1. Tujuan

Modul Marketplace bertujuan menjadi tempat jual-beli antara pengguna secara C2C (Customer to Customer), dengan fitur unggulan seperti pencatatan transaksi, ulasan produk, dan sambatan (group buy).

2. Fitur Utama

2.1 Jual-Beli Produk

Pengguna dengan langganan penjual aktif dapat membuat listing produk yang ingin dijual. Jika langganan tidak aktif atau kedaluwarsa, produk yang diunggah tidak akan terlihat di marketplace.

Produk dibagi ke dalam kategori:

Parfum atau Produk Jadi

Raw Material (bahan baku)

Alat

Lain-lain

Penjual bisa:

- Upload foto produk (minimal 1, maksimal 5 gambar per produk. Rekomendasi resolusi: 800x800px, ukuran file < 2MB. Gambar akan dioptimalkan secara otomatis).
- Menentukan harga.
- Deskripsi produk (mendukung Rich Text Editor untuk format teks). Konten deskripsi akan melalui proses moderasi konten (lihat `PRD Moderasi Konten.md`).
- Menentukan ketersediaan stok.
- Mengunggah produk baru di marketplace akan memberikan 15 EXP (sesuai PRD Gamifikasi).
- **Validasi Produk:** Produk yang diunggah akan melalui proses validasi awal (misalnya, kelengkapan informasi, format gambar). Moderasi manual oleh admin dapat diterapkan untuk penjual baru atau produk tertentu.
- **Variasi Produk (Fase Lanjut):** Di masa mendatang, produk dapat mendukung variasi (misalnya, ukuran, warna, aroma) dengan stok dan harga yang berbeda untuk setiap variasi.

2.2 Halaman Produk

Detail produk: nama, foto, harga, deskripsi, kategori

Informasi penjual (username & link ke profil)

Tombol "Beli Sekarang" atau "Gabung Sambatan"

Tombol share ke sosial media (WhatsApp, Twitter, IG)

Ulasan pengguna ditampilkan di bawah deskripsi produk

**Diskusi di Forum:** Tombol atau tautan "Diskusi di Forum" akan tersedia di halaman detail produk. Mengklik tautan ini akan mengarahkan pengguna ke thread forum khusus untuk produk tersebut (jika ada) atau memberikan opsi untuk membuat thread baru dengan judul yang sudah terisi otomatis.

**Rekomendasi Produk:** Bagian "Produk Terkait" akan menampilkan rekomendasi produk berdasarkan kategori, riwayat pembelian, atau produk yang sering dilihat bersama.
**Pertanyaan & Jawaban (Fase Lanjut):** Pembeli dapat mengajukan pertanyaan tentang produk langsung di halaman produk, dan penjual dapat menjawabnya. Pertanyaan dan jawaban akan terlihat publik.

2.3 Checkout & Pembayaran

Semua transaksi pembayaran dan nilai moneter akan diproses dalam Rupiah (IDR), sesuai dengan ketentuan di PRD Financial Management.

**Fase Awal (Rekening Bersama Manual):**
Proses checkout dilakukan melalui transfer manual ke "Rekening Bersama sensasiwangi.id".
Admin keuangan akan memverifikasi pembayaran secara manual dan memantau status pengiriman.
Setelah pembeli mengkonfirmasi penerimaan barang, dana akan ditransfer ke penjual (setelah dipotong biaya admin). Menyelesaikan transaksi (sebagai pembeli atau penjual) akan memberikan 20 EXP (sesuai PRD Gamifikasi).

**Fase Lanjut (Integrasi Virtual Account BRI):**
Setelah koordinasi dengan BRI selesai, sistem akan mengintegrasikan pembayaran melalui Virtual Account BRI untuk proses yang lebih otomatis dan efisien.
Pembayaran akan langsung terverifikasi oleh sistem, mengurangi intervensi manual admin.

2.4 Sambatan (Group Buy)
Detail lengkap mengenai fitur Sambatan (Group Buy) dijelaskan dalam `PRD Sambatan.md`. Fitur ini memungkinkan pembelian produk secara kolektif dengan harga khusus jika target partisipan atau kuantitas tercapai.

- **Integrasi dengan Modul Lain:**
  - **Marketplace:** Listing produk sambatan, alur checkout.
  - **Financial Management:** Penahanan dana (escrow), verifikasi pembayaran, pelepasan dana, pengembalian dana, perhitungan biaya admin.
  - **Notification:** Pengiriman notifikasi status sambatan.
  - **Admin Panel:** Manajemen sambatan oleh admin.
  - **Database Schema:** Koleksi `marketplace_products` akan memiliki field tambahan untuk parameter sambatan (`isSambatan`, `minParticipants`, `targetQuantity`, `currentParticipants`). Koleksi `marketplace_orders` akan memiliki field `isSambatanOrder` dan `sambatanId`.
  - **Sambatan:** Detail lengkap di `PRD Sambatan.md`.

2.5 Wishlist

Pengguna bisa menyimpan produk favorit

Ditampilkan di halaman profil atau halaman khusus wishlist

2.6 Ulasan dan Rating

- Pembeli dapat memberikan review dan rating (1-5 bintang).
- Rating ditampilkan dalam bentuk bintang dan komentar.
- **Kriteria Pemberian Ulasan:** Hanya pembeli terverifikasi yang telah menyelesaikan transaksi dan menerima barang yang dapat memberikan ulasan. Batas waktu untuk memberikan ulasan adalah X hari setelah konfirmasi penerimaan barang.
- **Konten Ulasan Kaya:** Pengguna dapat menyertakan tautan video (misalnya, dari YouTube, TikTok) atau gambar (misalnya, dari Instagram, Facebook) dalam ulasan mereka untuk memberikan konteks visual atau audio yang lebih kaya. Tautan akan di-embed secara otomatis jika memungkinkan. Konten ulasan akan melalui proses moderasi konten (lihat `PRD Moderasi Konten.md`).
- **Moderasi Ulasan (Fase Lanjut):** Ulasan akan dimoderasi untuk memastikan tidak ada konten yang tidak pantas atau spam. Admin dapat menghapus atau menyembunyikan ulasan yang melanggar.

2.7 Dashboard Penjual (Lapak)

Penjual bisa mengelola:

- Produk aktif.
- Stok.
- **Status Pemesanan:** Penjual dapat melihat daftar pesanan yang masuk dan memperbarui status pesanan (misalnya, 'diproses', 'dikirim', 'selesai').
- **Manajemen Pengiriman:** Penjual dapat menginput nomor resi pengiriman dan mencetak label pengiriman sederhana (jika diimplementasikan).
- **Komunikasi Pembeli:** Penjual dapat berkomunikasi langsung dengan pembeli terkait pesanan melalui sistem pesan internal (lihat `PRD Private Messaging.md`).
- **Statistik Penjualan:** Melihat statistik penjualan (misalnya, penjualan per produk, penjualan per periode, performa pengiriman, pendapatan bersih).
- Menutup listing jika stok habis atau barang tidak dijual lagi.

2.8 Penyelesaian Sengketa (Dispute Resolution)

Mekanisme pelaporan sengketa oleh pembeli atau penjual akan disediakan.
Proses mediasi akan dilakukan oleh admin untuk mencapai kesepakatan.
**Alur Sengketa:**

1. Pembeli/Penjual mengajukan sengketa melalui platform dengan menyertakan bukti.
2. Admin akan meninjau sengketa dan menghubungi kedua belah pihak untuk mediasi.
3. Jika sengketa tidak terselesaikan melalui mediasi, admin akan membuat keputusan berdasarkan bukti yang ada.
4. Kebijakan pengembalian dana/barang akan diterapkan sesuai keputusan admin. Kebijakan ini akan dijelaskan secara terpisah dalam dokumen Kebijakan Pengguna.

2.9 Logistik Pengiriman

Penjual bertanggung jawab penuh atas pengiriman barang.
Platform akan menyediakan kolom untuk nomor resi pengiriman yang wajib diisi oleh penjual.
**Perhitungan Biaya Pengiriman:**

- Pembeli dapat melihat estimasi biaya pengiriman saat checkout, dihitung menggunakan API RajaOngkir berdasarkan lokasi penjual, lokasi pembeli, berat/dimensi produk, dan pilihan kurir.
- Sistem akan menampilkan pilihan kurir yang didukung oleh RajaOngkir (misalnya, JNE, TIKI, POS Indonesia).
  **Pelacakan Pengiriman:**
- Pembeli dapat melacak status pengiriman melalui nomor resi yang diberikan penjual, dengan tautan langsung ke halaman pelacakan di situs kurir terkait atau melalui integrasi pelacakan RajaOngkir API.
- Penjual juga dapat memantau status pengiriman melalui dashboard mereka.
  **Catatan:** Platform tidak menyediakan integrasi langsung dengan jasa kurir pada fase awal. Penjual diharapkan menggunakan jasa kurir yang terpercaya dan memberikan informasi pelacakan yang akurat.
  **Penanganan Masalah Pengiriman:**
  Jika terjadi masalah pengiriman (misalnya, barang hilang/rusak), pembeli dapat mengajukan sengketa melalui mekanisme yang telah disediakan. Admin akan memediasi dan membantu penyelesaian masalah.
  **Integrasi Kurir (Fase Lanjut):** Di masa mendatang, platform dapat mempertimbangkan integrasi yang lebih dalam dengan API jasa kurir untuk otomatisasi pencetakan label pengiriman, pelacakan status yang lebih akurat, dan perhitungan biaya pengiriman yang lebih kompleks.

3. Hak Akses

Pengguna (buyer):

Membeli produk, mengikuti sambatan, memberi review

Pengguna (penjual):

Membuat dan mengelola produk, menerima pesanan

Admin Keuangan:

Verifikasi pembayaran, proses release dana, monitoring laporan

4. Teknologi

Frontend: React (Vite), Tailwind, Clerk (auth)

Backend: Convex (database, mutation, query)

5. Catatan Khusus

Integrasi dengan sistem notifikasi untuk update status pesanan

Transaksi melalui sistem rekening bersama demi keamanan C2C

Tidak menggunakan metode pembayaran otomatis terlebih dahulu, cukup dengan validasi manual oleh admin

6. Alur Pembeli

Buka marketplace → klik produk

Klik "Beli Sekarang" atau "Gabung Sambatan"

Transfer ke rekening bersama

Admin verifikasi

Penjual kirim barang → pembeli konfirmasi

Admin kirim dana ke penjual

7. Alur Penjual

Buka dashboard "Lapak"

Tambahkan produk → isi info dan upload gambar

Tunggu pesanan masuk

Kirim barang jika sudah ada transfer masuk

Pantau status pengiriman dan review

8. Alur Admin Keuangan

Verifikasi transfer masuk dari buyer

Tandai order sebagai "dibayar"

Tunggu konfirmasi dari buyer bahwa barang diterima

Transfer dana ke penjual setelah potongan biaya admin

Update status "Selesai"
