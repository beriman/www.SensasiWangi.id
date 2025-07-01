Product Requirements Document (PRD) - Marketplace SensasiWangi.id
1. Gambaran Umum
Marketplace SensasiWangi.id adalah platform jual beli komunitas untuk penggemar dan pembuat parfum di Indonesia. Marketplace ini bersifat C2C (customer-to-customer) dan mendukung jual beli parfum jadi, bahan baku, alat-alat perfumery, serta fitur unik seperti Sambatan (pembelian kolektif). Marketplace ini menggunakan sistem rekening bersama dan dipantau oleh admin keuangan.

2. Tujuan
Memfasilitasi transaksi antar anggota komunitas parfum.

Memberikan ruang jual-beli yang adil, aman, dan transparan.

Menyediakan fitur khusus seperti Sambatan, wishlist, dan review komunitas.

3. Fitur Utama
A. Produk & Kategori
Kategori Produk:

Parfum Jadi

Bahan Baku (Raw Material)

Alat Perfumery

Lain-lain

Setiap produk memiliki:

Judul, Deskripsi, Harga, Kategori

Gambar utama + galeri (max 5 foto)

Stok

Tipe: Produk Biasa / Sambatan

B. Halaman Marketplace
Daftar semua produk

Filter berdasarkan kategori, harga, dan tipe (Biasa/Sambatan)

Pencarian produk

Sorting: Terbaru, Terpopuler, Harga

C. Halaman Detail Produk
Menampilkan semua detail produk

Informasi penjual + ratingnya

Tombol beli / ikut sambatan

Link share ke WhatsApp, IG, X (Twitter)

Review dan rating pengguna

D. Sambatan (Group Buy)
Produk bertipe "Sambatan"

Menampilkan kuota sambatan, sisa slot, waktu tersisa

Pembayaran akan ditahan sampai sambatan sukses

Jika tidak tercapai, dana dikembalikan

E. Proses Pembelian
Metode: Transfer ke Rekening Bersama

Langkah:

Buyer checkout → dapat kode unik & info transfer

Buyer transfer → admin verifikasi

Penjual kirim barang → buyer konfirmasi

Admin lepas dana ke penjual

F. Lapak Penjual (Dashboard Seller)
Daftar produk milik penjual

Edit produk / hapus produk

Status penjualan & statistik

Melihat daftar order yang masuk

Upload resi pengiriman

G. Ulasan & Rating
Hanya pembeli terverifikasi yang bisa memberikan review

Rating bintang (1–5)

Teks + opsi foto bukti

Penjual dapat membalas review

H. Wishlist
User bisa menambahkan produk ke daftar wishlist

Halaman khusus wishlist user

I. Moderasi Admin
Admin keuangan:

Verifikasi pembayaran buyer

Menyimpan catatan pengeluaran dan distribusi

Verifikasi bukti pengiriman

Melepaskan dana ke penjual

Admin moderasi konten:

Tinjau produk baru, review spam, dan laporan

4. Database (Convex Schema Contoh)
ts
Copy
Edit
products {
  id: string,
  title: string,
  description: string,
  category: "parfum" | "raw" | "alat" | "lain",
  price: number,
  type: "biasa" | "sambatan",
  stock: number,
  seller_id: string,
  images: string[],
  created_at: Date
}

orders {
  id: string,
  buyer_id: string,
  product_id: string,
  quantity: number,
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled",
  payment_proof: string,
  is_sambatan: boolean,
  created_at: Date
}

reviews {
  id: string,
  product_id: string,
  buyer_id: string,
  rating: number,
  content: string,
  image?: string,
  created_at: Date
}

wishlist {
  user_id: string,
  product_id: string
}
5. Teknologi
Frontend: React + Vite + TailwindCSS

Auth: Clerk

Backend: Convex

Database: Convex DB

Pembayaran: Rekening Bersama (manual + validasi admin)

Integrasi Share: Social Meta Tag + Dynamic URL

6. Alur Kerja Penjual (Workflow Ringkas)
Login → Masuk ke Lapak Saya

Tambahkan produk → isi data + upload gambar

Pantau pesanan masuk

Kirim barang setelah pembayaran diverifikasi

Masukkan nomor resi

Setelah buyer konfirmasi → dana cair

7. Halaman yang Dibutuhkan
/marketplace → halaman utama semua produk

/marketplace/product/[productId] → detail produk

/marketplace/sell → form tambah produk

/marketplace/dashboard → dashboard penjual

/marketplace/wishlist → daftar wishlist user

/marketplace/orders → histori pembelian

/marketplace/sambatan → daftar sambatan aktif

/admin/finance → verifikasi & distribusi pembayaran

8. Fitur Mendatang (Opsional)
QR Code untuk konfirmasi pembayaran

Export data penjualan ke Excel/CSV

Live Chat pembeli-penjual

