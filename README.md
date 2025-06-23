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

- **Bronze**: <100 points – no discount
- **Silver**: 100+ points – 5% marketplace discount and access to exclusive content
- **Gold**: 500+ points – 10% marketplace discount and exclusive content

Discounts are automatically applied when creating marketplace orders.
