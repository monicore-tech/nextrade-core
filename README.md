<div align="center">

# NexTrade Core

**A production-grade, full-stack e-commerce platform built on the Vercel-native stack.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-nextrade--core.vercel.app-black?style=for-the-badge&logo=vercel)](https://nextrade-core.vercel.app)
[![Ask DeepWiki](https://img.shields.io/badge/Ask-DeepWiki-blue?style=for-the-badge)](https://deepwiki.com/monicore-tech/nextrade-core)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[**View Demo**](https://nextrade-core.vercel.app) · [**Report a Bug**](https://github.com/monicore-tech/nextrade-core/issues) · [**Request a Feature**](https://github.com/monicore-tech/nextrade-core/issues)

</div>

---

## What Is This?

NexTrade Core is a complete, production-ready e-commerce application—not a tutorial starter. It ships with a real storefront, persistent cart, authenticated checkout, customer reviews, and a data-driven admin dashboard. All built on a serverless architecture that deploys to Vercel in a single click.

It uses the [DummyJSON API](https://dummyjson.com) as the product catalog (100+ products, 30+ categories) so you never need to manage product data, and keeps your own PostgreSQL database (via [Neon](https://neon.tech)) lean—only storing users, carts, orders, and reviews.

---

## Features

### Storefront
- Paginated product grid with live data from DummyJSON
- Auto-generated category navigation (updates when the API adds categories)
- Product detail pages with image carousel, live stock badge, and star ratings
- Debounced search with a clear button — no API spam on every keystroke
- Skeleton loaders instead of blank screens during data fetching

### Cart & Checkout
- Persistent cart stored in `localStorage` (works without login)
- Add, remove, and update quantities with instant UI feedback
- Server Action-based checkout that writes to your database and clears the cart

### Authentication
- Email + password registration and login via Auth.js (NextAuth v5)
- Passwords hashed with bcrypt (12 rounds)
- JWT sessions with `role` field for admin access control
- Route protection via Next.js Proxy (middleware)

### Customer Reviews
- Signed-in users can leave a 1–5 star rating + written review per product
- One review per user per product (enforced at the database level)
- Reviews stored in Neon and displayed with animated entry

### Admin Dashboard *(role-protected)*
- **Revenue** — Bar chart (daily) + line chart (cumulative), last 30 days
- **Inventory** — All 100 products sorted by stock level, with pulsing critical alerts for stock ≤ 5
- **Analytics** — Top-selling categories by units sold and revenue (Recharts bar charts)

### UI / UX
- Dark mode with system preference detection and manual toggle
- Framer Motion animations on product cards (spring lift on hover)
- Inter + Playfair Display font pairing
- Fully responsive — mobile nav with full category sheet

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) | Vercel-native, Server Components, Server Actions, ISR |
| Language | TypeScript (strict mode) | End-to-end type safety |
| Database | [Neon](https://neon.tech) (serverless Postgres) | 1-click Vercel integration, DB branching |
| ORM | [Drizzle ORM](https://orm.drizzle.team) | Fully typed queries, lightweight, works in edge runtime |
| Auth | [Auth.js v5](https://authjs.dev) | Industry-standard for Next.js, JWT sessions |
| UI Components | [shadcn/ui](https://ui.shadcn.com) + [Base UI](https://base-ui.com) | You own the code, zero runtime overhead |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) | Utility-first, pairs perfectly with shadcn |
| Animation | [Framer Motion](https://www.framer.com/motion) | Production-grade spring animations |
| Charts | [Recharts](https://recharts.org) | Composable, works with React 18 |
| Validation | [Zod](https://zod.dev) | Schema validation at every API boundary |
| Product Data | [DummyJSON API](https://dummyjson.com) | 100+ products, no backend needed |

---

## Project Structure

```
src/
├── app/
│   ├── admin/                  # Role-protected dashboard
│   │   ├── analytics/          # Category sales charts
│   │   ├── inventory/          # Stock tracker with pulse alerts
│   │   └── page.tsx            # Revenue charts
│   ├── api/
│   │   ├── auth/               # NextAuth handlers + register endpoint
│   │   └── reviews/            # GET + POST reviews
│   ├── auth/                   # Login and register pages
│   ├── cart/                   # Cart page
│   ├── category/[slug]/        # ISR category pages
│   ├── checkout/               # Checkout + confirmation
│   ├── orders/                 # Order history
│   ├── product/[id]/           # Product detail + reviews
│   └── search/                 # Search results
├── components/
│   ├── admin/                  # Revenue and category chart components
│   ├── ui/                     # shadcn/ui primitives (you own these)
│   ├── hero.tsx                # Homepage hero section
│   ├── navbar.tsx              # Sticky nav with search, cart, dark mode
│   ├── product-card.tsx        # Animated product card
│   ├── product-grid.tsx        # Grid + skeleton loader
│   └── product-reviews.tsx     # Star picker + review list
├── contexts/
│   └── cart-context.tsx        # localStorage cart with React reducer
├── lib/
│   ├── actions/
│   │   └── checkout.ts         # Place order Server Action
│   ├── db/
│   │   ├── schema.ts           # Drizzle schema (users, carts, orders, reviews)
│   │   └── index.ts            # Neon + Drizzle client (lazy init)
│   └── dummyApi.ts             # Typed DummyJSON client with Zod schemas
├── auth.ts                     # Auth.js config (credentials provider)
└── proxy.ts                    # Route protection middleware
```

---

## Getting Started

### Prerequisites

- Node.js v20+
- A [Neon](https://neon.tech) account (free tier is enough)

### 1. Clone

```bash
git clone https://github.com/monicore-tech/nextrade-core.git
cd nextrade-core
npm install
```

### 2. Environment Variables

Create `.env.local` in the project root:

```env
# Neon connection string — from your Neon project dashboard
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Generate with: openssl rand -base64 32
AUTH_SECRET="your-secret-here"

# Your local or production URL
AUTH_URL="http://localhost:3000"

# Leave as-is unless you're proxying DummyJSON
DUMMYJSON_BASE_URL="https://dummyjson.com"
```

### 3. Push the Database Schema

```bash
DATABASE_URL="your-connection-string" npx drizzle-kit push
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Granting Admin Access

The `/admin` dashboard is role-protected. After registering a user through the UI, promote it to admin by running this SQL against your Neon database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

You can run this in the [Neon SQL Editor](https://console.neon.tech) — no extra tools needed.

---

## Deployment

This project is designed to deploy on Vercel with zero config changes.

1. Push to GitHub (already done)
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add the three environment variables (`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`)
4. Deploy

Every push to `main` triggers an automatic redeploy.

---

## Architecture Decisions

**Why not store products in the database?**
DummyJSON provides live product data (prices, stock levels, images). Copying it locally creates state drift — your DB becomes stale the moment the API updates. We only store the `productId` in orders and reviews, then fetch live product data on demand.

**Why Drizzle over Prisma?**
Drizzle generates zero runtime overhead and works natively in Vercel's edge/serverless environment. Prisma's query engine is a binary that adds cold-start latency.

**Why Auth.js credentials over OAuth?**
For a self-contained demo that anyone can run without setting up OAuth apps. The architecture supports adding GitHub/Google providers in 10 lines.

---

## License

MIT — do whatever you want with it.
