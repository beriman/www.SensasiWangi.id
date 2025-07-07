Product Requirements Document (PRD) - Modul Moderator

1.  Tujuan
    Modul Moderator bertujuan untuk memberdayakan pengguna terpilih (Moderator) dengan kemampuan untuk menjaga ketertiban, keamanan, dan kualitas konten di forum SensasiWangi.id. Moderator akan bertindak sebagai penegak aturan komunitas, membantu admin dalam mengelola konten dan interaksi pengguna, serta memastikan lingkungan diskusi yang positif dan konstruktif.

2.  Peran & Tanggung Jawab Moderator
    - Memantau aktivitas forum untuk memastikan kepatuhan terhadap aturan komunitas.
    - Meninjau dan menindaklanjuti laporan konten yang melanggar.
    - Mengambil tindakan moderasi terhadap thread dan balasan.
    - Mengambil tindakan moderasi terhadap pengguna yang melanggar aturan forum.
    - Menjadi contoh perilaku positif dan membantu pengguna lain.
    - **Kriteria Pengangkatan:** Moderator biasanya adalah pengguna yang memiliki reputasi baik di forum, aktif berkontribusi, dan memahami aturan komunitas. Proses seleksi dapat melibatkan nominasi, tinjauan oleh admin, dan persetujuan terhadap kode etik moderator.

3.  Fitur Utama

    3.1. Manajemen Peran Moderator (untuk Admin)
    _ **Penetapan Peran:** Admin (Super Admin) dapat menetapkan peran 'Moderator' kepada pengguna terdaftar melalui modul Manajemen Pengguna di Admin Panel.
    _ **Pencabutan Peran:** Admin dapat mencabut peran 'Moderator' dari pengguna. \* **Daftar Moderator:** Admin dapat melihat daftar semua pengguna yang memiliki peran Moderator.

    3.2. Akses & Tampilan Moderator
    _ **Dashboard Moderator (Opsional):** Halaman khusus di Admin Panel atau bagian terpisah yang hanya dapat diakses oleh Moderator, menampilkan:
    _ Ringkasan laporan konten yang belum ditinjau (dengan prioritas).
    _ Thread/balasan yang paling banyak dilaporkan.
    _ Statistik aktivitas moderasi mereka sendiri (jumlah tindakan, laporan yang diselesaikan).
    _ **UI/UX:** Dashboard akan menyediakan antarmuka yang jelas dan terorganisir untuk meninjau laporan dan aktivitas moderasi, mungkin dengan filter dan opsi sorting.
    _ **Alat Moderasi In-line:** Moderator akan memiliki opsi tambahan (misalnya, ikon atau menu konteks yang muncul saat hover atau klik kanan pada postingan/thread) yang terlihat langsung pada thread dan balasan di forum untuk melakukan tindakan moderasi secara cepat.

    3.3. Moderasi Konten Forum
    _ **Hapus Thread/Balasan:** Moderator dapat menghapus thread atau balasan yang melanggar aturan. Tindakan ini akan dicatat di Audit Log.
    _ **Edit Thread/Balasan:** Moderator dapat mengedit konten thread atau balasan (misalnya, menghapus informasi pribadi, memperbaiki format, menghapus bagian yang melanggar). Perubahan ini akan dicatat.
    _ **Pin Thread:** Moderator dapat "pin" thread penting agar selalu muncul di bagian atas daftar thread dalam kategori tertentu.
    _ **Kunci Thread:** Moderator dapat "kunci" thread untuk mencegah balasan baru.
    _ **Pindahkan Thread:** Moderator dapat memindahkan thread ke kategori/sub-kategori yang lebih sesuai.
    _ **Moderasi Laporan:**
    _ Melihat daftar laporan konten yang diajukan oleh pengguna.
    _ Meninjau konten yang dilaporkan.
    _ Mengambil tindakan yang sesuai (hapus, edit, abaikan laporan).
    _ Menandai laporan sebagai selesai.

    3.4. Moderasi Pengguna (dalam Konteks Forum)
    _ **Peringatan (Warning):** Moderator dapat mengirim peringatan resmi kepada pengguna yang melanggar aturan forum. Peringatan ini akan dicatat di profil pengguna dan dapat dilihat oleh admin. Peringatan akan dikomunikasikan kepada pengguna melalui notifikasi in-app dan email, dengan penjelasan pelanggaran.
    _ **Penangguhan Sementara (Temporary Suspension):** Moderator dapat menangguhkan akses pengguna ke forum untuk jangka waktu tertentu (misalnya, 24 jam, 3 hari, 7 hari). Selama penangguhan, pengguna tidak dapat membuat thread atau balasan. Pengguna akan diberitahu tentang durasi dan alasan penangguhan.
    _ **Blokir Permanen (Permanent Ban):** Moderator dapat memblokir pengguna secara permanen dari forum. Ini adalah tindakan terakhir untuk pelanggaran berat atau berulang. Pengguna akan diberitahu tentang pemblokiran dan alasan.
    _ **Pencatatan Tindakan:** Semua tindakan moderasi pengguna akan dicatat di Audit Log dan di profil pengguna yang bersangkutan.

    3.5. Notifikasi Moderator
    _ Menerima notifikasi real-time untuk laporan konten baru yang belum ditinjau.
    _ Menerima notifikasi untuk aktivitas penting di forum yang memerlukan perhatian moderasi.

4.  Hak Akses & Otorisasi
    - **Moderator:**
      - **Dapat:** Melakukan semua tindakan moderasi konten dan pengguna yang disebutkan di atas dalam lingkup forum.
      - **Tidak Dapat:** Mengakses modul Admin Panel lainnya (Manajemen Pengguna secara penuh, Manajemen Keuangan, Pengaturan Sistem global), mengubah peran pengguna, atau mengakses data sensitif di luar lingkup moderasi forum.
    - **Admin (Super Admin):** Memiliki akses penuh ke semua fitur moderasi dan dapat mengelola peran Moderator.

5.  User Flow Utama

    5.1. Admin Menetapkan Peran Moderator 1. Admin login ke Admin Panel. 2. Navigasi ke modul "Manajemen Pengguna". 3. Mencari pengguna yang ingin diangkat menjadi moderator. 4. Mengklik opsi "Edit Peran" atau "Kelola Hak Akses" pada profil pengguna tersebut. 5. Memilih peran 'Moderator' dari daftar peran yang tersedia. 6. Menyimpan perubahan. Pengguna tersebut kini memiliki hak akses moderator.

    5.2. Moderator Meninjau Laporan Konten 1. Moderator login. 2. Melihat notifikasi laporan baru atau mengakses Dashboard Moderator. 3. Mengklik laporan untuk meninjau thread/balasan yang dilaporkan. 4. Membaca konten dan alasan pelaporan. 5. Mengambil tindakan yang sesuai (misalnya, menghapus, mengedit, atau mengabaikan laporan). 6. Menandai laporan sebagai selesai.

    5.3. Moderator Mengambil Tindakan Terhadap Pengguna 1. Moderator menemukan pelanggaran aturan oleh pengguna atau meninjau laporan pengguna. 2. Mengakses profil pengguna yang melanggar atau menggunakan alat in-line pada postingan mereka. 3. Memilih tindakan moderasi (peringatan, penangguhan, blokir). 4. Memasukkan alasan tindakan dan durasi (jika penangguhan). 5. Mengkonfirmasi tindakan. Pengguna yang bersangkutan akan dinotifikasi (jika berlaku).

    5.4. Proses Banding (Opsional) \* Pengguna yang merasa tindakan moderasi tidak adil dapat mengajukan banding melalui sistem pelaporan. Banding akan ditinjau oleh Admin (Super Admin) atau tim moderasi senior. Keputusan banding akan bersifat final.

    5.5. Kolaborasi Moderator (Opsional)
    _ Jika ada beberapa moderator, sistem dapat mendukung kolaborasi melalui:
    _ Penugasan laporan kepada moderator tertentu.
    _ Catatan internal pada laporan untuk komunikasi antar moderator.
    _ Status laporan (misalnya, 'sedang ditinjau', 'menunggu keputusan'). \* **Pelatihan Moderator:** Moderator akan menerima pelatihan tentang aturan komunitas, penggunaan alat moderasi, dan etika moderasi untuk memastikan konsistensi dan keadilan dalam tindakan mereka.

6.  Teknologi & Integrasi
    - **Frontend:** React + Vite (untuk UI alat moderasi in-line dan Dashboard Moderator).
    - **Backend:** Convex (untuk menyimpan data forum, laporan, log moderasi, dan logika bisnis untuk tindakan moderasi).
    - **Otentikasi & Otorisasi:** Clerk (akan digunakan untuk manajemen peran pengguna dan menerapkan kontrol akses berbasis peran, memastikan hanya moderator yang dapat melakukan tindakan moderasi).
    - **Notifikasi:** Terintegrasi dengan modul Notifikasi untuk mengirim peringatan kepada pengguna dan notifikasi laporan kepada moderator.
    - **Audit Log:** Semua tindakan moderasi akan dicatat di `admin_logs` collection di database.

7.  Pengukuran Keberhasilan
    - Jumlah laporan konten yang ditinjau dan diselesaikan oleh moderator.
    - Waktu rata-rata penanganan laporan oleh moderator.
    - Jumlah tindakan moderasi yang diambil (hapus, edit, pin, kunci, peringatan, penangguhan, blokir).
    - Tingkat kepuasan pengguna terhadap moderasi forum.
    - Penurunan jumlah pelanggaran aturan forum seiring waktu.
