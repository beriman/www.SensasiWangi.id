User Profile

Purpose

Central space for users to manage their identity, social interaction, and activities within the platform.

Sections & Features

1. Profile Information

Avatar + Cover Image (with upload)

Display Name + Username

Bio (max 500 characters)

Custom Title (Business Tier only)

Social media links (optional)

2. Stats & Gamification

Bagian ini menampilkan ringkasan pencapaian pengguna dalam platform, yang bertujuan untuk mendorong partisipasi aktif. Untuk detail lengkap mengenai mekanisme perolehan EXP, kriteria level, manfaat, dan jenis-jenis badge, silakan merujuk ke **PRD Gamifikasi.md**.

**Statistik yang Ditampilkan:**

- Total EXP (experience points)
- Level Badge
- Jumlah Thread & Replies
- Reputation (rasio upvotes vs downvotes)
- Daftar Badge yang dimiliki

3. Tabs / Navigation

Overview

Latest activity (thread replies, new posts)

Forum

Threads started

Replies given

Marketplace

Products listed

Orders made

Wishlist

Store Manager (if user is a seller)

Product management (edit/delete)

Transaction history

Learning

Courses enrolled (lihat `PRD Learning.md`)

Certificates (lihat `PRD Learning.md`)

Progress tracking (lihat `PRD Learning.md`)

Support Tickets

Ticket history

Suggestions & Criticisms

Submitted suggestions and criticisms

Nusantarum Contributions

Submitted perfumers, brands, and variants

4. Social Features

Follow / Unfollow

View followers / following

Message (to open private conversation) (lihat `PRD Private Messaging.md`)

5. Settings Panel

Change Password

Change Email / Username

Manage Privacy (public / friends only / private)

Delete Account

6. Membership Area

Show current plan: Free / Business

Comparison table inline

CTA to upgrade if on Free

Data Model Notes

Table: users

id, username, display_name, avatar_url, cover_url, bio, level, exp, is_business

Table: user_followers

follower_id, following_id

Table: user_activity

log of all major actions

Table: messages, threads, marketplace_products, etc. for joined views
