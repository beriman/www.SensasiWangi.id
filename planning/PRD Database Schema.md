# Product Requirements Document (PRD) - Database Schema (Supabase / PostgreSQL)

## 1. Tujuan

Dokumen ini mendefinisikan struktur database (schema) untuk platform SensasiWangi.id. Tujuannya adalah untuk memastikan konsistensi data, integritas, efisiensi penyimpanan dan pengambilan data, serta mendukung semua fitur yang dijelaskan dalam dokumen PRD lainnya. Schema ini dirancang untuk **Supabase** dengan database **PostgreSQL**.

## 2. Prinsip Umum

- **Normalisasi:** Data akan dinormalisasi untuk mengurangi redundansi dan meningkatkan integritas data.
- **Integritas Data:** Memastikan data akurat dan konsisten melalui penggunaan tipe data yang tepat, constraint (seperti `NOT NULL`, `UNIQUE`), dan foreign key.
- **Skalabilitas:** Desain schema akan mempertimbangkan pertumbuhan data di masa depan dan performa query.
- **Keamanan:** Struktur data akan mendukung implementasi **Row Level Security (RLS)** di Supabase.
- **Fleksibilitas:** Memungkinkan penambahan fitur baru dengan modifikasi schema yang minimal.

## 3. Teknologi Database

- **Backend Utama:** **Supabase**
- **Database:** **PostgreSQL**
- **Catatan:** Tipe data akan merujuk pada tipe data standar PostgreSQL.

## 4. Definisi Schema

Berikut adalah definisi tabel dan kolom di dalamnya.

---

### **Tabel `users`**
- **Tujuan:** Menyimpan informasi profil publik pengguna. Tabel ini memiliki relasi 1-ke-1 dengan tabel `auth.users` milik Supabase.
- **Kolom:**
  - `id`: **UUID** (Primary Key, Foreign Key ke `auth.users.id`).
  - `email`: **VARCHAR(255)** (Unique, diambil dari `auth.users.email`).
  - `username`: **VARCHAR(50)** (Unique, Not Null).
  - `display_name`: **VARCHAR(100)** (Not Null).
  - `avatar_url`: **TEXT**.
  - `cover_image_url`: **TEXT**.
  - `bio`: **TEXT** (max 500 chars).
  - `custom_title`: **VARCHAR(100)**.
  - `role`: **VARCHAR(50)** (Default: 'user', Enum: 'guest', 'user', 'seller', 'moderator', 'admin', 'super_admin').
  - `is_business`: **BOOLEAN** (Default: false).
  - `level`: **INTEGER** (Default: 1).
  - `exp`: **INTEGER** (Default: 0).
  - `status`: **VARCHAR(50)** (Default: 'active', Enum: 'active', 'pending_verification', 'suspended', 'banned').
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).
  - `updated_at`: **TIMESTAMPTZ** (Default: `now()`).
  - `last_login_at`: **TIMESTAMPTZ**.
  - `notification_preferences`: **JSONB**.
  - `privacy_settings`: **JSONB**.
  - `blocked_users`: **UUID[]**.
  - `interests`: **TEXT[]**.

---

### **Tabel `user_followers`**
- **Tujuan:** Menyimpan hubungan follow/following antar pengguna.
- **Kolom:**
  - `follower_id`: **UUID** (Primary Key, Foreign Key ke `users.id`).
  - `following_id`: **UUID** (Primary Key, Foreign Key ke `users.id`).
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).

---

### **Tabel `forum_categories`**
- **Tujuan:** Menyimpan struktur kategori dan sub-kategori forum.
- **Kolom:**
  - `id`: **SERIAL** (Primary Key).
  - `name`: **VARCHAR(255)** (Unique, Not Null).
  - `slug`: **VARCHAR(255)** (Unique, Not Null).
  - `description`: **TEXT**.
  - `parent_id`: **INTEGER** (Foreign Key ke `forum_categories.id`).
  - `display_order`: **INTEGER**.
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).
  - `updated_at`: **TIMESTAMPTZ** (Default: `now()`).

---

### **Tabel `forum_threads`**
- **Tujuan:** Menyimpan informasi thread forum.
- **Kolom:**
  - `id`: **SERIAL** (Primary Key).
  - `category_id`: **INTEGER** (Not Null, Foreign Key ke `forum_categories.id`).
  - `author_id`: **UUID** (Not Null, Foreign Key ke `users.id`).
  - `title`: **TEXT** (Not Null).
  - `content`: **TEXT**.
  - `tags`: **TEXT[]**.
  - `status`: **VARCHAR(50)** (Default: 'active', Enum: 'active', 'locked', 'pinned', 'deleted').
  - `view_count`: **INTEGER** (Default: 0).
  - `reply_count`: **INTEGER** (Default: 0).
  - `upvote_count`: **INTEGER** (Default: 0).
  - `downvote_count`: **INTEGER** (Default: 0).
  - `marketplace_product_id`: **INTEGER** (Unique, Foreign Key ke `marketplace_products.id`).
  - `last_reply_at`: **TIMESTAMPTZ**.
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).
  - `updated_at`: **TIMESTAMPTZ** (Default: `now()`).

---

### **Tabel `forum_replies`**
- **Tujuan:** Menyimpan balasan pada thread forum.
- **Kolom:**
  - `id`: **SERIAL** (Primary Key).
  - `thread_id`: **INTEGER** (Not Null, Foreign Key ke `forum_threads.id`).
  - `author_id`: **UUID** (Not Null, Foreign Key ke `users.id`).
  - `content`: **TEXT**.
  - `parent_id`: **INTEGER** (Foreign Key ke `forum_replies.id`).
  - `upvote_count`: **INTEGER** (Default: 0).
  - `downvote_count`: **INTEGER** (Default: 0).
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).
  - `updated_at`: **TIMESTAMPTZ** (Default: `now()`).

---

### **Tabel `forum_votes`**
- **Tujuan:** Menyimpan informasi voting pada thread dan balasan.
- **Kolom:**
  - `user_id`: **UUID** (Primary Key, Foreign Key ke `users.id`).
  - `entity_id`: **INTEGER** (Primary Key).
  - `entity_type`: **VARCHAR(50)** (Primary Key, Enum: 'thread', 'reply').
  - `vote_type`: **VARCHAR(50)** (Not Null, Enum: 'upvote', 'downvote').
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).

---

### **Tabel `marketplace_categories`**
- **Tujuan:** Menyimpan kategori produk marketplace.
- **Kolom:**
  - `id`: **SERIAL** (Primary Key).
  - `name`: **VARCHAR(255)** (Unique, Not Null).
  - `slug`: **VARCHAR(255)** (Unique, Not Null).
  - `description`: **TEXT**.
  - `display_order`: **INTEGER**.
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).
  - `updated_at`: **TIMESTAMPTZ** (Default: `now()`).

---

### **Tabel `marketplace_products`**
- **Tujuan:** Menyimpan informasi produk yang dijual di marketplace.
- **Kolom:**
  - `id`: **SERIAL** (Primary Key).
  - `seller_id`: **UUID** (Not Null, Foreign Key ke `users.id`).
  - `category_id`: **INTEGER** (Not Null, Foreign Key ke `marketplace_categories.id`).
  - `name`: **TEXT** (Not Null).
  - `description`: **TEXT**.
  - `price`: **NUMERIC(12, 2)** (Not Null).
  - `stock`: **INTEGER** (Not Null).
  - `images`: **TEXT[]**.
  - `status`: **VARCHAR(50)** (Default: 'draft', Enum: 'active', 'draft', 'sold_out', 'moderation_pending', 'rejected').
  - `is_sambatan`: **BOOLEAN** (Default: false).
  - `min_participants`: **INTEGER**.
  - `current_participants`: **INTEGER**.
  - `target_quantity`: **INTEGER**.
  - `sold_count`: **INTEGER** (Default: 0).
  - `view_count`: **INTEGER** (Default: 0).
  - `rating_average`: **NUMERIC(3, 2)** (Default: 0).
  - `review_count`: **INTEGER** (Default: 0).
  - `forum_thread_id`: **INTEGER** (Unique, Foreign Key ke `forum_threads.id`).
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).
  - `updated_at`: **TIMESTAMPTZ** (Default: `now()`).

---

### **Tabel `marketplace_orders`**
- **Tujuan:** Menyimpan informasi pesanan/transaksi di marketplace.
- **Kolom:**
  - `id`: **SERIAL** (Primary Key).
  - `buyer_id`: **UUID** (Not Null, Foreign Key ke `users.id`).
  - `seller_id`: **UUID** (Not Null, Foreign Key ke `users.id`).
  - `product_id`: **INTEGER** (Not Null, Foreign Key ke `marketplace_products.id`).
  - `quantity`: **INTEGER** (Not Null).
  - `total_price`: **NUMERIC(12, 2)** (Not Null).
  - `admin_fee`: **NUMERIC(12, 2)**.
  - `net_seller_amount`: **NUMERIC(12, 2)**.
  - `payment_method`: **VARCHAR(100)**.
  - `payment_status`: **VARCHAR(50)** (Default: 'pending', Enum: 'pending', 'paid', 'failed', 'refunded').
  - `shipping_address`: **JSONB**.
  - `tracking_number`: **VARCHAR(255)**.
  - `order_status`: **VARCHAR(50)** (Default: 'pending', Enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled').
  - `is_sambatan_order`: **BOOLEAN** (Default: false).
  - `sambatan_id`: **INTEGER** (Foreign Key ke `marketplace_products.id`).
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).
  - `updated_at`: **TIMESTAMPTZ** (Default: `now()`).
  - `delivered_at`: **TIMESTAMPTZ**.
  - `funds_released_at`: **TIMESTAMPTZ**.

---

### **Tabel `marketplace_reviews`**
- **Tujuan:** Menyimpan ulasan dan rating produk.
- **Kolom:**
  - `id`: **SERIAL** (Primary Key).
  - `product_id`: **INTEGER** (Not Null, Foreign Key ke `marketplace_products.id`).
  - `reviewer_id`: **UUID** (Not Null, Foreign Key ke `users.id`).
  - `order_id`: **INTEGER** (Unique, Not Null, Foreign Key ke `marketplace_orders.id`).
  - `rating`: **INTEGER** (Not Null, Check: 1-5).
  - `comment`: **TEXT**.
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).
  - `updated_at`: **TIMESTAMPTZ** (Default: `now()`).

---

### **Tabel `marketplace_wishlists`**
- **Tujuan:** Menyimpan daftar keinginan produk pengguna.
- **Kolom:**
  - `user_id`: **UUID** (Primary Key, Foreign Key ke `users.id`).
  - `product_id`: **INTEGER** (Primary Key, Foreign Key ke `marketplace_products.id`).
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).

---

### **Tabel `private_conversations`**
- **Tujuan:** Menyimpan metadata percakapan pribadi.
- **Kolom:**
  - `id`: **SERIAL** (Primary Key).
  - `participant_ids`: **UUID[]** (Not Null).
  - `last_message_id`: **INTEGER** (Foreign Key ke `private_messages.id`).
  - `last_message_at`: **TIMESTAMPTZ**.
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).
  - `updated_at`: **TIMESTAMPTZ** (Default: `now()`).

---

### **Tabel `private_messages`**
- **Tujuan:** Menyimpan pesan pribadi antar pengguna.
- **Kolom:**
  - `id`: **SERIAL** (Primary Key).
  - `conversation_id`: **INTEGER** (Not Null, Foreign Key ke `private_conversations.id`).
  - `sender_id`: **UUID** (Not Null, Foreign Key ke `users.id`).
  - `receiver_id`: **UUID** (Not Null, Foreign Key ke `users.id`).
  - `content`: **TEXT**.
  - `is_read`: **BOOLEAN** (Default: false).
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).

---

### **Tabel `reports`**
- **Tujuan:** Menyimpan laporan konten atau pengguna yang melanggar aturan.
- **Kolom:**
  - `id`: **SERIAL** (Primary Key).
  - `reporter_id`: **UUID** (Not Null, Foreign Key ke `users.id`).
  - `entity_id`: **TEXT** (Not Null).
  - `entity_type`: **VARCHAR(100)** (Not Null, Enum: 'forum_thread', 'forum_reply', 'marketplace_product', 'user', 'private_message').
  - `reason`: **TEXT** (Not Null).
  - `status`: **VARCHAR(50)** (Default: 'pending', Enum: 'pending', 'reviewed', 'resolved', 'rejected').
  - `admin_notes`: **TEXT**.
  - `resolved_by`: **UUID** (Foreign Key ke `users.id`).
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).
  - `updated_at`: **TIMESTAMPTZ** (Default: `now()`).

---

### **Tabel `notifications`**
- **Tujuan:** Menyimpan notifikasi untuk pengguna.
- **Kolom:**
  - `id`: **SERIAL** (Primary Key).
  - `user_id`: **UUID** (Not Null, Foreign Key ke `users.id`).
  - `type`: **VARCHAR(100)** (Not Null, Enum: 'new_reply', 'new_message', 'order_status_update', 'report_resolved', 'mention').
  - `message`: **TEXT** (Not Null).
  - `link`: **TEXT**.
  - `is_read`: **BOOLEAN** (Default: false).
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).

---

### **Tabel `admin_logs`**
- **Tujuan:** Mencatat semua tindakan yang dilakukan oleh admin untuk audit dan keamanan.
- **Kolom:**
  - `id`: **SERIAL** (Primary Key).
  - `admin_id`: **UUID** (Not Null, Foreign Key ke `users.id`).
  - `action`: **TEXT** (Not Null).
  - `entity_type`: **VARCHAR(100)**.
  - `entity_id`: **TEXT**.
  - `details`: **JSONB**.
  - `ip_address`: **VARCHAR(255)**.
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).

---

### **Tabel `badges`**
- **Tujuan:** Menyimpan definisi badge yang dapat diberikan kepada pengguna.
- **Kolom:**
  - `id`: **SERIAL** (Primary Key).
  - `name`: **VARCHAR(255)** (Unique, Not Null).
  - `description`: **TEXT**.
  - `image_url`: **TEXT**.
  - `criteria`: **TEXT**.
  - `exp_award`: **INTEGER**.
  - `created_at`: **TIMESTAMPTZ** (Default: `now()`).
  - `updated_at`: **TIMESTAMPTZ** (Default: `now()`).

---

### **Tabel `user_badges`**
- **Tujuan:** Menyimpan badge yang telah diberikan kepada pengguna.
- **Kolom:**
  - `user_id`: **UUID** (Primary Key, Foreign Key ke `users.id`).
  - `badge_id`: **INTEGER** (Primary Key, Foreign Key ke `badges.id`).
  - `awarded_at`: **TIMESTAMPTZ** (Default: `now()`).

---

## 5. Hubungan Antar Entitas (Relationships)

Hubungan di PostgreSQL diimplementasikan melalui **Foreign Key Constraints**. Contoh:
- `forum_threads.author_id` mereferensikan `users.id`.
- `marketplace_products.seller_id` mereferensikan `users.id`.
- `reports.entity_id` akan menggunakan **Polymorphic Association** (misalnya, `entity_id` (TEXT) dan `entity_type` (VARCHAR) columns) karena tidak ada dukungan bawaan yang mudah.

## 6. Strategi Pengindeksan (Indexing Strategy)

Pengindeksan sangat penting untuk performa query. Indeks akan dibuat pada:
- **Primary Keys:** Otomatis diindeks.
- **Foreign Keys:** Harus diindeks secara manual untuk performa join yang cepat.
- **Kolom yang Sering Dicari/Filter:** `users.username`, `users.email`, `forum_threads.title`, dll.
- **Kolom untuk Sorting:** `created_at`, `updated_at`, `last_reply_at`.
- **Pencarian Teks:** Menggunakan **Full-Text Search (FTS)** di PostgreSQL dengan `tsvector` dan `tsquery`.

## 7. Aturan Keamanan (Security Rules)

- **Row Level Security (RLS):** Supabase memungkinkan definisi kebijakan keamanan langsung pada tabel SQL. Ini akan digunakan secara ekstensif untuk:
  - **Read Access:** Siapa yang dapat membaca baris data (e.g., `SELECT` policy).
  - **Write Access:** Siapa yang dapat membuat, memperbarui, atau menghapus baris data (e.g., `INSERT`, `UPDATE`, `DELETE` policies).
- **Validasi Data:** Menggunakan `CHECK` constraints di PostgreSQL dan validasi di level aplikasi/API.

## 8. Pertimbangan Masa Depan

- **Data Analytics:** Memanfaatkan kemampuan PostgreSQL atau integrasi dengan data warehouse.
- **Caching:** Implementasi strategi caching di level aplikasi atau menggunakan layanan seperti Redis.
- **Backup & Restore:** Menggunakan fitur backup dan Point-in-Time Recovery (PITR) dari Supabase.
- **Migrasi Schema:** Menggunakan alat migrasi database seperti `dbdev` dari Supabase atau Flyway/Liquibase untuk mengelola perubahan schema.