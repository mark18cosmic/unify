# UnifyGames — PS5 Game Store

E-commerce storefront + admin panel for **UnifyGames** (unifygames.mv), the Maldivian
Unify Games Club selling physical PS5 games. No online payment gateway — checkout is
**Bank Transfer** or **Cash on Delivery**, confirmed manually by an admin.

Built with **Next.js (App Router)**, **Prisma**, **NextAuth (Auth.js)** — everything runs
inside Next.js, deployable to **Vercel**.

---

## Quick start (local)

```bash
npm install          # installs deps + runs prisma generate
npm run setup        # creates the SQLite DB and seeds admin + demo games
npm run dev          # http://localhost:3000
```

Then:
- **Store:** http://localhost:3000
- **Admin:** http://localhost:3000/admin  → login: `admin@unifygames.mv` / `unify2026`

> Change the admin credentials in `.env` **before** running `npm run setup`.

---

## Environment (`.env`)

Copy `.env.example` → `.env` and fill in:

| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | `file:./dev.db` for SQLite locally, or a Postgres URL for prod |
| `AUTH_SECRET` | Random secret for NextAuth — generate with `npx auth secret` |
| `AUTH_TRUST_HOST` | `true` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin login |
| `BANK_NAME` / `BANK_ACCOUNT_NAME` / `BANK_ACCOUNT_NUMBER` | Shown at checkout & on order confirmation |

---

## Features

### Storefront
- Home with hero, featured & new titles, community/tournament promo
- Shop grid with search + genre filter, MVR pricing, In / Low / Out of stock badges
- Game detail page (cover, description, condition, add to cart / buy now)
- Cart (localStorage) → Checkout with **Bank Transfer** or **Cash on Delivery** only
- Order confirmation with reference number + payment / delivery next-steps
- About (Unify Games Club) + Contact (WhatsApp / socials)

### Admin (`/admin`, credentials login)
- Dashboard: totals, awaiting-payment count, confirmed revenue, low/out-of-stock alerts
- Games CRUD: title, cover image URL, price, genre, condition, SKU, description,
  published/draft toggle, featured toggle, low-stock threshold
- Stock: manual +/- adjustments with reason (restock / correction / sale) and a stock history log
- Orders: filter by status, order detail with customer + payment/delivery info
  - **Mark as Paid & Confirm** for bank transfers
  - Manual status updates (Pending → Confirmed → Shipped → Completed / Cancelled)
  - Stock auto-decrements the first time an order becomes **Confirmed**

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Add a Postgres database (Vercel Postgres / Neon) and switch the datasource:
   - In `prisma/schema.prisma` set `provider = "postgresql"`.
   - Set `DATABASE_URL` to the Postgres connection string in Vercel env vars.
4. Add all other env vars from the table above (`AUTH_SECRET`, admin creds, bank details).
5. After first deploy, run migrations + seed against prod:
   ```bash
   npx prisma db push
   npm run db:seed
   ```
   (or run these from a local shell with prod `DATABASE_URL`).

> **SQLite is for local dev only** — Vercel's filesystem is read-only at runtime, so use
> Postgres/Neon in production. The only code change needed is the Prisma `provider`.

---

## Project structure

```
prisma/schema.prisma      # Admin, Product, StockLog, Order, OrderItem
prisma/seed.ts            # admin + demo PS5 catalogue
src/app/(shop)/           # public storefront (home, shop, cart, checkout, order, about, contact)
src/app/admin/            # dashboard, games CRUD, orders
src/lib/auth.ts           # NextAuth credentials provider
src/lib/orderActions.ts   # customer checkout server action
src/lib/adminActions.ts   # product CRUD, stock adjust, order status
src/components/            # UI (cart provider, cards, forms, badges, logo)
```

## Brand
Orange (`#F26522`) on black, rounded bold headings, "U" ribbon mark used as logo + favicon.
