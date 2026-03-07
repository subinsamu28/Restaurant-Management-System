<div align="center">

# 🍽️ Bella Cucina RMS

### Production-Grade Restaurant Management System

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue?style=for-the-badge)](LICENSE)

A full-stack, multi-tenant restaurant management platform featuring real-time Kitchen Display System, Point of Sale, interactive table floor plans, inventory tracking, staff management, analytics dashboards, and reservation handling — secured with Row Level Security, RBAC (6 roles), and defense-in-depth authentication.

[**Live Demo**](https://bella-cucina-rms.vercel.app) · [**Setup Guide**](docs/SETUP.md) · [**Specification**](docs/SPECIFICATION.md) · [**Report Bug**](../../issues) · [**Request Feature**](../../issues)

<br/>

<img src="https://bella-cucina-rms.vercel.app/" alt="Dashboard Preview" width="90%" />

</div>

---

## ✨ Why This Exists

Most open-source restaurant systems are either outdated PHP monoliths or simple CRUD apps that ignore the real complexity of running a restaurant. Bella Cucina RMS is different — it's built from the ground up with the same architecture patterns used by commercial platforms like Toast, Square for Restaurants, and Lightspeed, but on a modern, free-tier-deployable stack that anyone can self-host.

Every design decision — from integer-based monetary calculations (dinero.js) to broadcast-based realtime (not postgres_changes) to triple-layer auth verification — exists because it solves a real problem that surfaces at production scale.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL                                │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  Edge        │  │  Serverless  │  │  Static / ISR     │  │
│  │  Middleware   │  │  Functions   │  │  Pages            │  │
│  │              │  │              │  │                   │  │
│  │ • Auth guard │  │ • Reports    │  │ • Landing page    │  │
│  │ • Rate limit │  │ • Payments   │  │ • Public menu     │  │
│  │ • CSP nonce  │  │ • Cron jobs  │  │ • Legal pages     │  │
│  │ • Role route │  │ • PDF export │  │                   │  │
│  └──────┬───────┘  └──────┬───────┘  └───────────────────┘  │
│         │                 │                                   │
│  ┌──────┴─────────────────┴──────────────────────────────┐   │
│  │              Next.js 14+ App Router                    │   │
│  │         React Server Components + Server Actions       │   │
│  │              TanStack Query + Zustand                  │   │
│  └───────────────────────┬───────────────────────────────┘   │
└──────────────────────────┼───────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                     SUPABASE                                  │
│  ┌───────────┐  ┌────────┴───┐  ┌──────────┐  ┌──────────┐  │
│  │ PostgreSQL │  │  Auth      │  │ Realtime │  │ Storage  │  │
│  │            │  │            │  │          │  │          │  │
│  │ • 15+ tbl  │  │ • Email/PW │  │ • Orders │  │ • Menu   │  │
│  │ • RLS on   │  │ • OAuth    │  │ • Tables │  │   images │  │
│  │   all tbl  │  │ • MFA/TOTP │  │ • KDS    │  │ • Logos  │  │
│  │ • Triggers │  │ • JWT+RBAC │  │ • Alerts │  │          │  │
│  └───────────┘  └────────────┘  └──────────┘  └──────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 📦 Feature Modules

### 📊 Dashboard
Real-time overview with KPI cards (revenue, active orders, table occupancy, average ticket size), weekly revenue area chart, active order feed, popular items ranking, order type breakdown donut chart, upcoming reservation cards, and low-stock alert banners. Every widget streams independently via Suspense boundaries.

### 🛒 Order Management
Full order lifecycle engine supporting eight states: Pending → Confirmed → Preparing → Ready → Served → Completed, plus Cancelled and Voided. Course-based firing (appetizers, mains, desserts sent separately), priority flagging, elapsed-time tracking with color-coded urgency (green < 10min, amber 10–15min, red > 15min), and a slide-over detail panel with itemized breakdown.

### 👨‍🍳 Kitchen Display System (KDS)
Dark-themed full-screen interface optimized for wall-mounted kitchen screens. Tickets display in columns sorted by age, with station-based filtering (grill, pasta, pizza, salad, bar). Individual item bump buttons and "Bump All Ready" per ticket. Audio alerts on new orders (browser-permission-gated). Sub-second updates via Supabase Realtime broadcast channels.

### 💳 Point of Sale (POS)
Split-panel touchscreen layout — category-tabbed menu grid on the left, live cart with quantity controls on the right. One-tap item addition, inline modifier selection, table assignment, subtotal/tax/total calculation, and "Send to Kitchen" action. Supports card and cash payment flows with tip calculation.

### 🍝 Menu Management
Grid and list views with category emoji tabs, food cost margin progress bars, allergen badges (gluten, dairy, egg, fish, nuts, sulfites), preparation time indicators, kitchen station routing tags, and one-click 86 toggle. Modifier groups and individual modifier management for customizable items.

### 🪑 Table & Floor Plan
Visual grid of all tables with real-time color-coded status indicators (green=available, red=occupied, amber=reserved, yellow=cleaning, gray=blocked). Section filtering (main, patio, bar, private). Displays elapsed dining time, current guest count, and assigned server on occupied tables. Supports square, circle, and rectangle table shapes.

### 📅 Reservations
Calendar-based booking with time slots, party size, table assignment, and customer notes. PostgreSQL exclusion constraints prevent double-booking at the database level. Confirmation and reminder notification triggers. Digital waitlist with estimated wait times.

### 📦 Inventory
Stock tracking with quantity progress bars, low-stock threshold alerts (red banner), cost-per-unit display, par level management, supplier tracking, and last-restock timestamps. Recipe linkage automatically deducts ingredients when orders are placed. Auto-86 menu items when required ingredients hit zero.

### 👥 Staff Management
Employee profiles with role assignment, hourly rate configuration, and 4-digit PIN for quick POS login. Six roles with granular permission matrix. Performance metrics per server: orders handled, average check size, tip earnings, void/comp frequency.

### 📈 Analytics & Reporting
Comprehensive reporting dashboard with period toggles (today/week/month): revenue & tips bar chart, hourly order distribution heatmap, top items by revenue, server performance leaderboard, order type breakdown, food cost percentage, labor cost ratio, and payment method summary. Materialized views for historical data, real-time queries for today.

### ❤️ Customer Management
Customer profiles with visit history, cumulative spend, loyalty points, dietary preference tags, VIP indicators, and special notes. Points-based loyalty system with configurable earn rate and redemption threshold.

### ⚙️ Settings & Security
Restaurant configuration (name, address, currency, tax rate, timezone), full RBAC permission matrix visualization, and security status dashboard showing: Two-Factor Auth (TOTP), Row Level Security, Rate Limiting, CSP Headers, HSTS, and Audit Logging — all with real-time enabled/disabled status.

---

## 🔐 Security Architecture

This system implements **defense-in-depth** — three independent layers that each enforce access control, so a bypass at any single layer doesn't compromise data.

| Layer | Technology | What It Does |
|---|---|---|
| **Layer 1 — Edge** | Next.js Middleware | Redirects unauthenticated users, basic role routing, rate limiting (5 login attempts/15min via Upstash Redis), CSP nonce generation |
| **Layer 2 — Application** | Data Access Layer (`dal.ts`) | Re-verifies session via `supabase.auth.getUser()` before every database query, enforces role-based permissions, uses `server-only` import guard |
| **Layer 3 — Database** | Supabase RLS | Row Level Security policies on ALL 15+ tables, tenant isolation via `user_belongs_to_restaurant()`, role-based write policies, immutable audit logs |

**Additional security measures:** HSTS with preload, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy restricting camera/microphone/geolocation, input validation on client AND server via shared Zod schemas, integer-based monetary calculations (never floating-point), hashed PIN codes, and `(SELECT auth.uid())` wrapping for RLS performance optimization.

---

## 🛠️ Tech Stack

| Category | Technology | Why This Choice |
|---|---|---|
| **Framework** | Next.js 14+ (App Router) | React Server Components, Server Actions, streaming SSR, edge middleware, ISR |
| **Language** | TypeScript (strict) | Type-safe database queries via Supabase codegen, Zod schema inference |
| **Database** | Supabase (PostgreSQL) | RLS, Realtime subscriptions, Auth, Storage, Edge Functions — unified platform |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first with accessible, customizable component primitives |
| **Auth** | Supabase Auth + @supabase/ssr | Cookie-based sessions, TOTP MFA, OAuth, JWT with custom RBAC claims |
| **State** | TanStack Query + Zustand + nuqs | Server state, client state, URL state — each handled by the right tool |
| **Forms** | react-hook-form + Zod | Performant forms with shared client/server validation schemas |
| **Charts** | Recharts | Composable, responsive chart components with good TypeScript support |
| **Animations** | Framer Motion | GPU-accelerated page transitions, AnimatePresence, spring physics |
| **Money** | dinero.js v2 | Integer-based currency math — no floating-point rounding errors |
| **Dates** | date-fns | Tree-shakeable, immutable, locale-aware date operations |
| **Rate Limiting** | Upstash Redis | Serverless-compatible sliding window rate limiter at the edge |
| **Monitoring** | Sentry + Vercel Analytics | Error tracking, performance monitoring, session replay on errors |
| **Hosting** | Vercel | Edge network, serverless functions, cron jobs, preview deployments |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js v18.17+** and **npm v9+** installed. You'll also need free accounts on [GitHub](https://github.com), [Vercel](https://vercel.com), and [Supabase](https://supabase.com).

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/subinsamu28/bella-cucina-rms.git
cd bella-cucina-rms

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Then edit .env.local with your Supabase credentials

# 4. Set up the database (requires Supabase CLI)
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push

# 5. Generate TypeScript types from your database
npm run db:types

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and you're running.

> 📖 **For the complete step-by-step walkthrough** — including Supabase project creation, auth provider configuration, Upstash Redis setup, and Vercel deployment 

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript check without building |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | E2E tests (Playwright) |
| `npm run db:reset` | Reset local database + apply migrations + seed |
| `npm run db:push` | Push migrations to remote Supabase |
| `npm run db:types` | Regenerate TypeScript types from database schema |
| `npm run analyze` | Bundle size analysis |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/              # Landing page, pricing, legal
│   ├── auth/                  # Sign-in, sign-up, callback, password reset
│   ├── (dashboard)/           # Protected dashboard area
│   │   ├── dashboard/         # Overview with KPI widgets
│   │   ├── orders/            # Order management + detail view
│   │   ├── kitchen/           # Kitchen Display System
│   │   ├── menu/              # Menu CRUD + categories
│   │   ├── tables/            # Floor plan + table status
│   │   ├── reservations/      # Booking calendar + waitlist
│   │   ├── inventory/         # Stock tracking + alerts
│   │   ├── staff/             # Employee profiles + shifts
│   │   ├── analytics/         # Sales, labor, food cost reports
│   │   ├── customers/         # CRM + loyalty points
│   │   └── settings/          # Restaurant config + security
│   ├── pos/                   # Full-screen POS interface
│   └── api/                   # Webhooks, cron jobs, public API
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   ├── common/                # Shared components (DataTable, KPICard, etc.)
│   └── providers/             # Theme, Query, Realtime providers
├── lib/
│   ├── supabase/              # Client, server, admin, middleware utilities
│   ├── dal.ts                 # Data Access Layer (auth verification)
│   ├── safe-action.ts         # next-safe-action configuration
│   └── utils.ts               # Helpers (cn, formatCurrency, elapsed)
├── hooks/                     # useRealtimeOrders, useRealtimeTables, etc.
├── stores/                    # Zustand stores (cart, UI preferences)
├── schemas/                   # Shared Zod validation schemas
├── types/                     # database.types.ts (auto-generated)
└── config/                    # Site config, navigation, permissions
```

Each feature module follows a consistent internal pattern: `_components/` for UI, `_lib/` containing `*.actions.ts` (thin Server Actions), `*.service.ts` (testable business logic), `*.loader.ts` (data fetching), and `*.schema.ts` (Zod validation).

---

## 🗄️ Database Schema

The PostgreSQL schema contains **15+ tables** with full referential integrity, organized around the multi-tenant `restaurants` table:

```
restaurants ─┬─ staff_members ──── auth.users
             ├─ categories ─── menu_items ─┬─ modifier_groups ─── modifiers
             │                             └─ recipe_items ─── inventory_items
             ├─ restaurant_tables
             ├─ orders ─┬─ order_items
             │          └─ payments
             ├─ reservations
             ├─ shifts
             ├─ customers
             └─ audit_logs
```

All tables have RLS enabled with tenant isolation enforced via `user_belongs_to_restaurant()`. The `audit_logs` table is immutable (INSERT-only RLS, no UPDATE or DELETE policies).

---

## 👥 Role-Based Access Control

Six roles with granular permissions, injected into JWT via Supabase Auth Hook:

| Permission | Owner | Manager | Chef | Waiter | Cashier | Host |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Restaurant Settings | ✅ | — | — | — | — | — |
| Manage Staff | ✅ | ✅ | — | — | — | — |
| Manage Menu | ✅ | ✅ | ✅ | — | — | — |
| Create Orders | ✅ | ✅ | — | ✅ | ✅ | — |
| View All Orders | ✅ | ✅ | ✅ | — | — | — |
| Void Orders | ✅ | ✅ | — | — | — | — |
| Process Payments | ✅ | ✅ | — | — | ✅ | — |
| View Reports | ✅ | ✅ | — | — | — | — |
| Manage Tables | ✅ | ✅ | — | ✅ | — | ✅ |
| Manage Reservations | ✅ | ✅ | — | — | — | ✅ |
| Manage Inventory | ✅ | ✅ | ✅ | — | — | — |

---

## 🌐 Deployment

The application is designed for one-click deployment on Vercel with Supabase as the backend.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/subinsamu28/bella-cucina-rms&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY&envDescription=Supabase%20credentials%20required&envLink=https://supabase.com/dashboard/project/_/settings/api)

**Required environment variables:**

```env
NEXT_PUBLIC_SUPABASE_URL=         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anon/public key
NEXT_PUBLIC_SITE_URL=             # Your deployment URL
SUPABASE_SERVICE_ROLE_KEY=        # Server-only — mark as Sensitive
SUPABASE_DB_URL=                  # Server-only — mark as Sensitive
CRON_SECRET=                      # Server-only — mark as Sensitive
UPSTASH_REDIS_REST_URL=           # For rate limiting (optional)
UPSTASH_REDIS_REST_TOKEN=         # For rate limiting (optional)
```

### Free Tier Limits

| Service | Free Limit | How We Stay Under |
|---|---|---|
| Vercel Serverless | 60s execution, 1M invocations/mo | RPC for complex queries, batched operations |
| Vercel Bandwidth | 100 GB/mo | next/image optimization, Brotli, minimal client JS |
| Supabase Database | 500 MB | Efficient schema, monthly order archival |
| Supabase Realtime | 200 concurrent connections | Broadcast channels per-restaurant, not per-row |
| Supabase Auth | 50,000 MAU | Staff-only auth (not customer-facing) |

---

## 🧪 Testing

```bash
# Unit tests — service layer, Zod schemas, Zustand stores
npm run test

# E2E tests — complete user flows across all roles
npm run test:e2e

# Type checking
npm run type-check
```

The testing strategy follows a pyramid approach: unit tests for business logic and validation schemas (Vitest), component tests for interactive UI elements (Vitest + React Testing Library), E2E tests for critical flows like login → order → kitchen → payment (Playwright), and dedicated RLS tests that authenticate as different roles and verify data visibility boundaries.

---

## 🗺️ Roadmap

- [x] Core dashboard with real-time KPIs
- [x] Full order lifecycle management
- [x] Kitchen Display System with station filtering
- [x] POS interface with cart management
- [x] Menu management with allergen tracking
- [x] Table floor plan with live status
- [x] Reservation system with double-booking prevention
- [x] Inventory tracking with low-stock alerts
- [x] Staff management with RBAC
- [x] Analytics dashboard with Recharts
- [x] Customer profiles with loyalty points
- [ ] Stripe payment integration
- [ ] PDF receipt generation
- [ ] SMS/email notification system (Resend)
- [ ] Multi-language support (i18n)
- [ ] Offline POS mode with service workers
- [ ] Native mobile app (React Native)
- [ ] AI-powered demand forecasting
- [ ] QR code table ordering for guests

---

## 🤝 Contributing

Contributions are welcome! Whether it's bug fixes, new features, documentation improvements, or performance optimizations — all help is appreciated.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure your code passes `npm run lint`, `npm run type-check`, and `npm run test` before submitting.

---

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0** — see the [LICENSE](LICENSE) file for details.

This means you're free to use, modify, and distribute this software, but if you run a modified version as a network service, you must make the source code available to users of that service under the same license.

---

## 👤 Author

**Subin Samu**

[![Portfolio](https://img.shields.io/badge/Portfolio-subinsamu.com-F59E0B?style=flat-square)](https://subinsamu.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-subin--samu-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/subin-samu/)
[![GitHub](https://img.shields.io/badge/GitHub-subinsamu28-181717?style=flat-square&logo=github)](https://github.com/subinsamu28)

---

<div align="center">

**If this project helped you, consider giving it a ⭐**

Built with ☕ and 🍝 in Munich, Germany

</div>
