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

- `GET /api/brands` – Indonesian brands
- `GET /api/perfumers` – Indonesian perfumers
- `GET /api/fragrances` – Indonesian fragrances
- `GET /api/stats` – Overall database statistics
