# RegisterKaro Subscription Billing Platform

A subscription billing platform for a generic SaaS tool — plan discovery, checkout, payments, webhooks, subscription lifecycle management (upgrade/downgrade/cancel), invoicing, and notifications.

Built as a take-home assignment. See **[ARCHITECTURE.md](https://github.com/manavjangid5/registerkaro-subscription-platform/blob/main/ARCHITECTURE.md)** for the data model, state machines, and the reasoning behind every flow decision — that document is the primary deliverable.

## Tech stack


| Layer       | Tech                                                           |
| ----------- | -------------------------------------------------------------- |
| Frontend    | Next.js 15 (App Router) + React + TypeScript + Tailwind        |
| Backend     | Node.js + Express + TypeScript                                 |
| Persistence | MongoDB + Mongoose                                             |
| Payments    | Razorpay (test mode)                                           |
| Auth        | JWT (access + refresh tokens), bcrypt                          |
| Validation  | Zod, shared between frontend and backend via `packages/shared` |
| Testing     | Vitest                                                         |
| Monorepo    | pnpm workspaces                                                |


## Prerequisites

- Node.js 18+ (tested on Node 22)
- pnpm (`npm install -g pnpm`)
- A MongoDB connection string (a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster works fine — no local Mongo install needed)
- A [Razorpay](https://dashboard.razorpay.com/) test-mode account (Key ID + Key Secret)

## Setup (should take under 10 minutes)

### 1. Clone and install

```bash
git clone https://github.com/manavjangid5/registerkaro-subscription-platform.git
cd registerkaro-subscription-platform
pnpm install

```

If pnpm prompts about ignored build scripts, run:

```bash
pnpm approve-builds
pnpm install

```

### 2. Configure environment variables

```bash
cp apps/api/.env.example apps/api/.env

```

Edit `apps/api/.env` and fill in:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=<your MongoDB connection string>
JWT_ACCESS_SECRET=<any random string, 32+ characters>
JWT_REFRESH_SECRET=<a DIFFERENT random string, 32+ characters>
RAZORPAY_KEY_ID=<from Razorpay test-mode dashboard>
RAZORPAY_KEY_SECRET=<from Razorpay test-mode dashboard>
RAZORPAY_WEBHOOK_SECRET=<any string you choose — see webhook note below>
RESEND_API_KEY=<from Resend dashboard, or a placeholder — see note below>
EMAIL_FROM=billing@example.com

```

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000

```

**Note on** `RAZORPAY_WEBHOOK_SECRET`**:** since this app runs locally, Razorpay's servers cannot reach `localhost` to deliver real webhooks. This project includes a signed webhook simulation script (see step 5) that lets you trigger and replay `payment.captured`/`payment.failed` events locally, using this same secret to sign the payload exactly as Razorpay would. Pick any string here — it just needs to match on both sides, which it does automatically since the simulator reads the same `.env`.

**Note on** `RESEND_API_KEY`**:** notifications are logged to the database (`NotificationLog` collection) on every relevant event but are not sent as real emails in this build — see the "Known limitations" section in ARCHITECTURE.md. A placeholder value is fine here.

### 3. Seed the plan catalog

```bash
pnpm --filter @registerkaro/api seed:plans

```

Seeds Basic and Pro tiers, each with Monthly and Yearly pricing.

### 4. Run the app

In two separate terminals:

```bash
# Terminal 1 — API (http://localhost:4000)
pnpm --filter @registerkaro/api dev

# Terminal 2 — Web (http://localhost:3000)
pnpm --filter @registerkaro/web dev

```

Visit `http://localhost:3000`.

### 5. Try the full flow

1. **Register** an account, then browse `/pricing`
2. Click **Subscribe** on any plan — Razorpay's test checkout widget opens
  - Test card: `4111 1111 1111 1111`, any future expiry, any CVV
  - Test OTP: `1221`
3. You'll land on a "confirming payment" screen. **Because Razorpay cannot deliver a real webhook to localhost**, confirm the payment manually using the included simulator: 
  ```bash
  pnpm --filter @registerkaro/api simulate:webhook <razorpayOrderId> payment.captured

  ```
  Find `<razorpayOrderId>` in the `payments` collection in MongoDB (most recent document), or in the `/checkout` response in your browser's Network tab.
4. Refresh — your subscription is now active. Visit `/subscriptions` to see it, preview an upgrade/downgrade, cancel, or resume.
5. **To prove webhook idempotency** (the assignment's core grading criterion): run the exact same `simulate:webhook` command again with the same order id. The first call returns `processed`; the second returns `already_processed`, with no duplicate subscription, invoice, or notification created.

### 6. Run tests

```bash
pnpm --filter @registerkaro/api test

```

## Project structure

```
apps/
  api/      Express backend — routes, models, webhook handling, cron sweep
  web/      Next.js frontend — pricing, checkout, auth, subscription management
packages/
  shared/          Zod schemas + TypeScript types shared by both apps
  eslint-config/   Shared lint configuration

```

## Known limitations

See the "Key Decisions & Trade-offs" section in [ARCHITECTURE.md](https://github.com/manavjangid5/registerkaro-subscription-platform/blob/main/ARCHITECTURE.md) for a full list, including: notifications are logged but not actually emailed, refresh tokens are stored in `localStorage` rather than an httpOnly cookie, and the cron-based renewal/expiry sweep is a simplified stand-in for a durable job queue.