# Tech Context

## Teknologi yang Digunakan
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Convex
- **Styling**: shadcn/ui
- **State Management**: Convex state management
- **Authentication**: Clerk

## Setup Pengembangan
1. Install dependencies: `npm install`
2. Jalankan development server: `npm run dev`
3. Konfigurasi environment variables untuk Clerk dan Convex

## Constraints Teknis
1. Data disimpan di Convex internal storage
2. Autentikasi wajib melalui Clerk
3. UI harus menggunakan komponen shadcn/ui

## Dependensi Utama
- `convex`: Untuk backend dan database
- `clerk/nextjs`: Untuk autentikasi
- `shadcn/ui`: Untuk komponen UI

## Pola Penggunaan Tools
- Pengembangan lokal: `npm run dev`
- Testing: Jest + Testing Library
- Deployment: Vercel