# Clean Square — architecture

Clean Square is a small Next.js App Router application. Static landing-page content is rendered on the server. A narrow client boundary owns the calculator and lead-form state. The same pure pricing function serves the browser preview and the server's authoritative calculation.

```text
Browser
  → local calculator (no request for each change)
  → lead form
  → POST /api/leads
  → Zod validation
  → server price recalculation
  → Supabase PostgreSQL
```

The product rules, tariffs, field constraints, and deployment gate are in [TZ.md](TZ.md). This document describes where the code enforces them.

## Code boundaries

| Area | Responsibility |
|---|---|
| `src/app/page.tsx` | Server-rendered page structure and static sections |
| `src/components/` | Interactive calculator, form, contacts, and presentation |
| `src/config/pricing.ts` | The single tariff source |
| `src/config/site.ts` | Site mode, public contact configuration, benefits, steps, fictional reviews |
| `src/domain/` | Framework-independent IDs, types, and pure pricing |
| `src/validation/` | Client feedback and server request schemas |
| `src/app/api/leads/route.ts` | HTTP boundary and public response contract |
| `src/server/` | Server-only lead persistence and Supabase client |
| `supabase/migrations/` | The leads table and database constraints |

Dependencies flow from UI and API into the domain, and from the API into server infrastructure. Domain code imports no React, Next.js, Supabase, or browser APIs. The landing page stays a Server Component; only interaction owners use `"use client"`. No global state package or separate backend is required.

`CalculationProvider` owns cleaning type, area text, and selected add-ons for the calculator and lead form. The total is derived from current inputs; it is not stored as a second mutable value. Personal data is not placed in local storage.

## Trust boundary

The browser sends `name`, `phone`, `cleaningType`, `area`, `addOns`, and `consent`. The API treats the request as untrusted, validates it with Zod, and recalculates `calculatedPrice` from `src/config/pricing.ts`. A client total is neither needed nor authoritative.

The Supabase `sb_secret_...` key is read only by server code as `SUPABASE_SECRET_KEY`. It must never use a `NEXT_PUBLIC_` prefix. The browser cannot insert directly into the leads table. Public errors use only the fixed 201/400/500 response shapes in [TZ.md](TZ.md), without SQL details, stack traces, or personal data. Logging avoids submitted names and phone numbers.

Portfolio mode is the safe default for absent or unrecognized `SITE_MODE` values. The form makes no request; `POST /api/leads` rejects before parsing the body. In explicit `SITE_MODE=live`, form submission and configured Telegram/MAX destinations work. Public contact variables are read only through `src/config/site.ts`; invalid or placeholder destinations are discarded. Production collection of real personal data is subject to the [deployment gate](TZ.md#deployment-gate).

## Storage

The SQL migration defines a `leads` table with the submitted fields, integer calculated price, consent, ID, and creation timestamp. The application validates exact field formats. Database constraints provide additional bounds, and only the server-side key can write leads. Private integration tests create a synthetic lead, verify persistence, and remove it.

## Build and verification

Node.js 24, Next.js 16.3.6, React packages compatible with that version, TypeScript strict mode, Tailwind CSS 4, Zod 4, Supabase PostgreSQL, Vitest 5, Playwright 1.63, and Vercel form the current stack. The lockfile fixes installed versions. `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:e2e`, and `npm run build` are the verification commands. GitHub Actions runs the non-secret checks on pushes and pull requests; private Supabase integration is opt-in.

The site uses native form controls, visible focus, responsive layouts down to 320 px, and reduced-motion handling. Its single interior image is an illustrative generated asset, not a photograph of the fictional company's work.
