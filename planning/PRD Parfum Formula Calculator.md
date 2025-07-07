# Product Requirement Document (PRD) - Parfum Formula Calculator

## 1. Pendahuluan

Dokumen ini menguraikan persyaratan untuk modul "Kalkulator Formula Parfum" di platform SensasiWangi.id. Modul ini bertujuan untuk menyediakan alat bantu yang efisien dan akurat bagi para perfumer (pembuat parfum) dalam menghitung dan mengelola formulasi parfum mereka. Alat ini akan membantu dalam konversi unit, perhitungan persentase, dan manajemen inventaris bahan baku.

## 2. Tujuan

- Mempermudah perfumer dalam menghitung proporsi bahan baku dalam formulasi parfum.
- Mengurangi kesalahan perhitungan manual.
- Menyediakan antarmuka yang intuitif untuk manajemen formula.
- Mendukung konversi unit yang umum digunakan dalam perfumery.

## 3. Fitur Utama

### 3.1. Manajemen Bahan Baku (Ingredients Management)
- **Daftar Bahan Baku:** Pengguna dapat memasukkan dan menyimpan daftar bahan baku yang mereka miliki, termasuk:
    - Nama Bahan Baku (misalnya, "Iso E Super", "Rose Absolute", "Ethanol")
    - Densitas (Density) dalam g/mL (opsional, untuk konversi volume ke berat)
    - Harga per unit (misalnya, per gram atau per mL)
    - Catatan tambahan (misalnya, supplier, karakteristik aroma).
- **Pencarian & Filter:** Kemampuan untuk mencari dan memfilter bahan baku yang tersimpan.

### 3.2. Pembuatan dan Pengelolaan Formula
- **Buat Formula Baru:** Pengguna dapat membuat formula parfum baru dengan memberikan nama formula.
- **Penambahan Bahan Baku ke Formula:** Pengguna dapat menambahkan bahan baku dari daftar mereka ke dalam formula.
- **Input Proporsi:** Untuk setiap bahan baku dalam formula, pengguna dapat memasukkan proporsi dalam:
    - **Persentase (%):** Total persentase harus 100%.
    - **Berat (gram):** Pengguna dapat memasukkan berat absolut untuk setiap bahan.
    - **Tetes (Drops):** Jika densitas bahan baku diketahui, sistem dapat mengestimasi berat dari jumlah tetes.
- **Perhitungan Otomatis:**
    - Jika total berat/volume diinginkan dimasukkan, sistem akan menghitung berat/volume masing-masing bahan berdasarkan persentase.
    - Jika berat masing-masing bahan dimasukkan, sistem akan menghitung persentase relatifnya.
    - Konversi antara gram, mL, dan tetes (jika densitas tersedia).
- **Simpan Formula:** Pengguna dapat menyimpan formula yang telah dibuat untuk penggunaan di masa mendatang.
- **Edit/Hapus Formula:** Pengguna dapat mengedit atau menghapus formula yang tersimpan.
- **Duplikasi Formula:** Kemampuan untuk menduplikasi formula yang sudah ada sebagai dasar untuk formula baru.

### 3.3. Perhitungan Batch (Batch Calculation)
- Pengguna dapat memasukkan total volume atau berat batch yang ingin mereka buat (misalnya, 100 gram, 50 mL).
- Sistem akan secara otomatis menghitung jumlah (berat/volume) masing-masing bahan baku yang dibutuhkan untuk batch tersebut berdasarkan formula yang dipilih.
- **Estimasi Biaya:** Sistem akan mengestimasi total biaya produksi batch berdasarkan harga bahan baku yang dimasukkan.

### 3.4. Validasi & Peringatan
- **Total Persentase:** Peringatan jika total persentase bahan baku tidak sama dengan 100%.
- **Bahan Baku Hilang:** Peringatan jika ada bahan baku dalam formula yang tidak memiliki densitas (jika perhitungan volume/tetes diperlukan).
- **Stok:** (Opsional, untuk fase lanjut) Integrasi dengan manajemen inventaris untuk memberikan peringatan jika bahan baku tidak mencukupi.

### 3.5. Antarmuka Pengguna (UI/UX)
- Desain yang bersih dan intuitif, mengikuti gaya Neumorphism platform.
- Input field yang jelas dan mudah digunakan.
- Tampilan hasil perhitungan yang mudah dibaca.

## 4. User Flow Utama

### 4.1. Membuat Formula Baru
1. Pengguna login dan navigasi ke modul "Kalkulator Formula Parfum".
2. Klik "Buat Formula Baru".
3. Masukkan nama formula.
4. Tambahkan bahan baku satu per satu dari daftar yang tersedia atau masukkan bahan baku baru.
5. Masukkan proporsi (persentase atau berat) untuk setiap bahan baku.
6. Sistem melakukan perhitungan otomatis dan menampilkan hasilnya.
7. Simpan formula.

### 4.2. Menghitung Batch Produksi
1. Pengguna memilih formula yang sudah tersimpan.
2. Masukkan total volume atau berat batch yang diinginkan.
3. Sistem menampilkan jumlah masing-masing bahan baku yang dibutuhkan dan estimasi biaya.

## 5. Teknologi & Integrasi

- **Frontend:** React + Vite (untuk UI kalkulator dan manajemen formula).
- **Backend:** Convex (untuk menyimpan data bahan baku dan formula parfum).
    - Convex Functions akan digunakan untuk menyimpan, mengambil, dan memperbarui data formula.
- **Otentikasi:** Clerk (untuk manajemen pengguna dan memastikan hanya pengguna terautentikasi yang dapat mengakses dan menyimpan formula mereka).

## 6. Database Schema (Convex)

### 6.1. `ingredients` Collection
- **Tujuan:** Menyimpan daftar bahan baku yang dimiliki pengguna.
- **Fields:**
    - `_id`: (Convex ID)
    - `userId`: (Convex ID) `_id` dari `users` pemilik bahan baku (indexed).
    - `name`: (string) Nama bahan baku (unique per user).
    - `density`: (number, optional) Densitas dalam g/mL.
    - `pricePerUnit`: (number, optional) Harga per unit (misalnya, per gram).
    - `unit`: (string, optional) Unit harga (e.g., 'gram', 'ml').
    - `notes`: (string, optional) Catatan tambahan.
    - `createdAt`: (number)
    - `updatedAt`: (number)

### 6.2. `formulas` Collection
- **Tujuan:** Menyimpan formula parfum yang dibuat pengguna.
- **Fields:**
    - `_id`: (Convex ID)
    - `userId`: (Convex ID) `_id` dari `users` pemilik formula (indexed).
    - `name`: (string) Nama formula (unique per user).
    - `description`: (string, optional) Deskripsi formula.
    - `ingredients`: (array of object) Array objek yang berisi:
        - `ingredientId`: (Convex ID) `_id` dari `ingredients` collection.
        - `percentage`: (number, optional) Proporsi dalam persentase.
        - `weight`: (number, optional) Proporsi dalam berat (gram).
        - `drops`: (number, optional) Proporsi dalam tetes.
    - `createdAt`: (number)
    - `updatedAt`: (number)

## 7. Pengukuran Keberhasilan

- Jumlah formula yang dibuat dan disimpan oleh pengguna.
- Frekuensi penggunaan kalkulator.
- Feedback pengguna tentang akurasi dan kemudahan penggunaan.
- Peningkatan jumlah perfumer yang aktif di platform.
