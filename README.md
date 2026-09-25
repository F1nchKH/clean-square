# Clean Square

**A one-page portfolio demo for a fictional cleaning company.** Visitors choose a cleaning type, area, and add-ons to see a preliminary price, then carry that calculation into a lead form. The public site demonstrates the flow without collecting contact data.

**[Open the live demo](https://clean-square.vercel.app)**

![Clean Square desktop landing page](public/portfolio/desktop.png)

<details>
<summary>Calculator and mobile screenshots</summary>

![Cleaning price calculator](public/portfolio/calculator.png)

![Clean Square on a mobile viewport](public/portfolio/mobile.png)

</details>

## What the project covers

- Three cleaning types, three optional add-ons, integer area validation (10–500 m²), and immediate estimated pricing from one shared tariff configuration.
- A calculation summary that follows the visitor into the lead form, with client validation and visible loading, success, and retry states in live mode.
- A Next.js API boundary that validates input with Zod, recalculates the price on the server, and inserts a lead into Supabase PostgreSQL. The browser never receives the secret key or supplies an authoritative total.
- Responsive, keyboard-accessible sections for services, benefits, How It Works, fictional reviews, and contact actions.

**Modes:** `SITE_MODE=portfolio` is the public default. Form and Telegram/MAX controls show on-page demo notices; the form makes no request and direct API submissions are rejected. Explicit `SITE_MODE=live` enables persistence and configured contact links for private testing with synthetic data. Public collection of real personal data requires the [deployment gate](TZ.md#211-deployment-gate) to be satisfied first.

## Stack and checks

Next.js 16 App Router, React, TypeScript, Tailwind CSS 4, Zod 4, Supabase PostgreSQL, Vitest, Playwright, and Vercel. Static sections remain server-rendered; the calculator and form share a small client state boundary. Pricing is a pure [domain function](src/domain/pricing.ts) used by both browser and server. The [architecture](ARCHITECTURE.md) and [product specification](TZ.md) document the full contracts.

Unit tests cover pricing, field validation, API responses, persistence behavior, and contact configuration. Playwright covers calculator and form interactions, portfolio safeguards, and the live flow with mocked submission; an opt-in integration test exercises Supabase with a synthetic row. GitHub Actions runs portfolio and mocked-live checks on pushes and pull requests.

## Run locally

Use Node.js 24 and npm:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The example configuration starts in portfolio mode and needs no Supabase credentials. To test live mode privately, set `SITE_MODE=live`, `SUPABASE_URL`, and the server-only `SUPABASE_SECRET_KEY` in `.env.local`; apply the [leads migration](supabase/migrations/20260924000000_create_leads.sql). `NEXT_PUBLIC_TELEGRAM_URL` and `NEXT_PUBLIC_MAX_URL` supply live contact destinations; public phone contact is disabled. Never prefix the Supabase secret with `NEXT_PUBLIC_`, commit `.env.local`, or use real personal data in tests. Mode and public contacts must be set before building or redeploying.

```bash
npm run typecheck
npm run lint
npm test
npm run test:e2e
npm run build
```

`npm run test:e2e` checks portfolio mode by default. With `SITE_MODE=live`, it checks live behavior; add `RUN_LIVE_INTEGRATION=1` to run the synthetic browser-to-Supabase test, which verifies and removes its test row.
