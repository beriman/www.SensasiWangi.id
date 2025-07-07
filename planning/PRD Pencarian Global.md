Product Requirements Document (PRD) - Modul Pencarian Global

1. Tujuan
Modul Pencarian Global bertujuan untuk menyediakan fungsionalitas pencarian yang komprehensif dan efisien di seluruh platform SensasiWangi.id. Tujuannya adalah untuk memungkinkan pengguna menemukan informasi, produk, diskusi, dan profil dengan cepat dan relevan, meningkatkan pengalaman pengguna dan navigasi platform secara keseluruhan.

2. Fitur Utama

2.1. Cakupan Pencarian
- **Pencarian Lintas Modul:** Kemampuan untuk mencari di seluruh modul utama platform, termasuk:
    - Forum (thread, balasan, judul, isi, tag, penulis)
    - Marketplace (nama produk, deskripsi, kategori, penjual, ulasan)
    - Profil Pengguna (username, display name, bio)
    - Konten CMS (artikel, halaman statis, pengumuman, patch notes)
    - Nusantarum (perfumer, brand, varian parfum)
- **Prioritas Hasil:** Hasil pencarian akan diprioritaskan berdasarkan relevansi dan jenis konten (misalnya, hasil dari modul yang paling sering diakses pengguna atau konten yang paling populer).

2.2. Fungsionalitas Pencarian
- **Pencarian Kata Kunci:** Mendukung pencarian berdasarkan satu atau beberapa kata kunci.
- **Pencarian Frasa:** Mendukung pencarian frasa eksak (misalnya, menggunakan tanda kutip).
- **Operator Boolean:** Mendukung operator AND, OR, NOT untuk pencarian yang lebih spesifik.
- **Pencarian Fuzzy/Typo Tolerance:** Memberikan hasil yang relevan meskipun ada kesalahan ketik kecil.
- **Auto-suggest/Autocomplete:** Memberikan saran pencarian saat pengguna mengetik.
- **Highlight Hasil:** Menyorot kata kunci yang cocok dalam hasil pencarian.

2.3. Filter dan Sorting
- **Filter Berdasarkan Modul:** Pengguna dapat memfilter hasil pencarian untuk hanya menampilkan hasil dari modul tertentu (misalnya, hanya Forum, hanya Marketplace).
- **Filter Berdasarkan Kategori/Tag:** Filter spesifik modul (misalnya, kategori forum, kategori produk, tag konten).
- **Filter Berdasarkan Penulis/Penjual:** Filter hasil berdasarkan pengguna yang membuat konten atau menjual produk.
- **Filter Berdasarkan Tanggal:** Filter berdasarkan rentang tanggal publikasi/pembuatan.
- **Sorting:** Mengurutkan hasil pencarian berdasarkan:
    - Relevansi (default)
    - Terbaru (tanggal publikasi/pembuatan)
    - Popularitas (jumlah upvote, jumlah tampilan, jumlah transaksi)
    - Harga (untuk produk marketplace)

2.4. Antarmuka Pengguna (UI)
- **Global Search Bar:** Bilah pencarian yang terlihat jelas di header navigasi utama platform.
- **Halaman Hasil Pencarian:** Halaman khusus untuk menampilkan hasil pencarian dengan opsi filter dan sorting yang mudah diakses.
- **Pencarian Spesifik Modul:** Bilah pencarian juga dapat muncul di dalam setiap modul untuk pencarian yang lebih terfokus.

3. User Flow Utama

3.1. Melakukan Pencarian Global
1. Pengguna memasukkan kata kunci di bilah pencarian global.
2. Sistem menampilkan hasil pencarian yang relevan dari seluruh platform.
3. Pengguna dapat menggunakan filter dan sorting untuk mempersempit hasil.
4. Mengklik hasil pencarian akan mengarahkan pengguna ke halaman detail konten/produk/profil yang relevan.

3.2. Melakukan Pencarian Spesifik Modul
1. Pengguna berada di dalam modul tertentu (misalnya, Forum).
2. Memasukkan kata kunci di bilah pencarian modul.
3. Sistem menampilkan hasil pencarian yang relevan hanya dari modul tersebut.

4. Teknologi & Integrasi
- **Backend:** Convex (untuk menyimpan data yang akan diindeks dan logika bisnis pencarian).
- **Search Engine/Indexing Solution:** Integrasi dengan solusi pencarian eksternal yang kuat dan skalabel (misalnya, Algolia, Elasticsearch, atau Convex search capabilities jika sudah matang untuk pencarian kompleks).
- **Frontend:** React + Vite (untuk UI bilah pencarian, halaman hasil pencarian, filter, dan sorting).
- **Integrasi dengan Modul Lain:** Setiap modul akan menyediakan data yang terstruktur agar dapat diindeks oleh mesin pencari.

5. Pengukuran Keberhasilan
- **Tingkat Keberhasilan Pencarian:** Persentase pencarian yang menghasilkan hasil relevan.
- **Waktu Respons Pencarian:** Waktu rata-rata yang dibutuhkan untuk menampilkan hasil pencarian.
- **Tingkat Penggunaan Filter/Sorting:** Mengukur seberapa sering pengguna menggunakan fitur filter dan sorting.
- **Tingkat Klik (CTR) Hasil Pencarian:** Persentase klik pada hasil pencarian.
- **Jumlah Pencarian Tanpa Hasil:** Mengidentifikasi area di mana konten mungkin kurang atau perlu dioptimalkan.
- **Peningkatan Engagement:** Mengukur apakah pencarian yang efektif berkorelasi dengan peningkatan interaksi pengguna di platform.
