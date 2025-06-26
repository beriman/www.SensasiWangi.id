# Vite + Clerk + Convex Template

A modern SaaS template built with Vite for lightning-fast frontend development, Clerk for authentication, and Convex for real-time database functionality.

## Overview

This template provides a complete foundation for building a SaaS application with:

- **Vite** - Modern frontend tooling with instant HMR and optimized builds
- **Clerk** - Secure authentication and user management
- **Convex** - Real-time database with serverless functions
- **No Payments** - No payment processing

### Authentication

This template uses Clerk for authentication. Single Sign-On via OAuth providers
is enabled along with optional Two-Factor Authentication (2FA) when configured
in your Clerk dashboard.

## Documentation

For detailed setup instructions and configuration guides, visit our [comprehensive documentation](https://tempolabsinc.mintlify.app/ViteClerkConvexStripe).
## Public API

This repository exposes a small REST server that proxies Convex queries so third parties can pull data programmatically.

Run the server with:

```bash
node api-server.js
```

Ensure the `CONVEX_URL` environment variable points to your Convex deployment.

Available endpoints:

- `GET /api/brands` – Indonesian brands (only verified)
- `GET /api/perfumers` – Indonesian perfumers (only verified)
- `GET /api/fragrances` – Indonesian fragrances (only verified)
- `GET /api/stats` – Overall database statistics

Use the optional `verified=true` query parameter to explicitly fetch verified
records for marketplace or course integrations.

## Reward System

User contributions earn points which unlock reward tiers:

- **Bronze**: <5000 points – no discount
- **Silver**: 5000+ points – 5% marketplace discount and access to exclusive content
- **Gold**: 10000+ points – 10% marketplace discount and exclusive content

Discounts are automatically applied when creating marketplace orders.

## Fitur Profile

Fitur Profile dirancang untuk meningkatkan engagement pengguna melalui sistem gamifikasi yang mencakup:

- **Sistem Poin dan Level**: Pengguna mendapatkan poin dari aktivitas seperti menyelesaikan modul kursus, berpartisipasi di forum, transaksi marketplace, dan memberikan ulasan. Poin akan menentukan level pengguna (dari Pemula hingga Master).
- **Badge Prestasi**: Pengguna dapat mengoleksi badge berdasarkan pencapaian tertentu, seperti "Ahli Citrus" atau "Raja Woody".
- **Leaderboard Komunitas**: Terdapat papan peringkat global, bulanan, dan berdasarkan minat untuk mendorong kompetisi sehat.

Detail perencanaan fitur dapat dilihat di: [`planning/USER/profile-plan.md`](/planning/USER/profile-plan.md)

### Implementasi
- **Backend**: Menggunakan Convex function untuk menghitung poin dan menyimpan data di database.
- **Frontend**: Halaman profil baru dengan komponen `UserStats` dan integrasi Clerk.
- **Integrasi**: Notifikasi pencapaian dan update real-time menggunakan Convex subscriptions.

_Versi dokumen: 1.1.0 (Updated: Juni 2025)_

## Development Seeds

Populate your Convex deployment with sample marketplace data using:

```bash
CONVEX_URL=<your_convex_url> npx ts-node scripts/seed.ts
```

The command calls `api.marketplace.initializeSampleData` to insert starter brands, perfumers and fragrances for local testing.

## Running Tests

Jest is configured for both unit and integration tests located under the `tests/` directory.

- Run all tests:

```bash
npm test
```

- Run only unit tests:

```bash
npm test tests/unit
```

- Run only integration tests:

```bash
npm test tests/integration
```

## Third-Party Services Setup

### BRI Payments

Configure the following environment variables to enable Bank BRI virtual account and QRIS payments:

```bash
BRI_BASE_URL=https://sandbox.partner.api.bri.co.id
BRI_CLIENT_ID=<your_client_id>
BRI_CLIENT_SECRET=<your_client_secret>
BRI_INSTITUTION_CODE=<institution_code>
BRI_BRIVA_NO=<briva_number>
```

### Cloudinary

Image uploads rely on Cloudinary. Set these variables in your `.env`:

```bash
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_UPLOAD_PRESET=<upload_preset>
```

### RajaOngkir

For shipping cost calculations we use [RajaOngkir](https://rajaongkir.com/).
Create a free account and generate an API key from your dashboard, then set:

```bash
RAJAONGKIR_API_KEY=<your_rajaongkir_key>
```

### Email Service

Transactional emails are sent via your preferred provider. Define at least:

```bash
EMAIL_FROM=<no-reply@example.com>
RESEND_API_KEY=<your_api_key>
```
