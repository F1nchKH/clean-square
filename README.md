# Clean Square

One-page Clean Square demo. [TZ.md](TZ.md) defines the product and deployment gate; [PLAN.md](PLAN.md) tracks the implementation stages.

Use Node.js 24 and npm. Run `npm ci` to install the locked dependencies, then `npm run dev` to start the application. Copy `.env.example` to `.env.local` when environment values are available.

Run `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:e2e`, and `npm run build` before release. The default E2E run checks portfolio mode. For private live checks, set `SITE_MODE=live` before `npm run test:e2e`. Set `RUN_LIVE_INTEGRATION=1` as well to run the browser-to-Supabase test with synthetic data; it verifies and removes its own test row.

## Stage 7: Supabase persistence

Create a Supabase project, then apply [the leads migration](supabase/migrations/20260924000000_create_leads.sql) using the project's SQL editor. The table has database defaults for `id` and `created_at`, checks for the area range and consent, and Row Level Security with no browser policies. The migration explicitly grants `service_role` insert access when automatic table exposure is disabled and removes table grants from browser roles.

Set these **server-only** values in `.env.local` (or the private runtime environment):

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your-project-key
```

Use the project's current secret API key, never a publishable or legacy service-role key. Do not put the secret under a `NEXT_PUBLIC_` name. In private live mode, a missing or invalid key causes lead submission to fail closed with the public `SUBMISSION_ERROR` response. The browser posts to `/api/leads` only in live mode; only the server inserts into Supabase. Use synthetic data for private live testing. Public collection of real contact data remains subject to the release gate in `TZ.md`.

## Stage 8: portfolio controls and private live mode

Portfolio mode is the default. Telegram and MAX buttons show an in-page demo notice; the form sends no data, and direct API submissions are rejected. The fields are illustrative: do not enter real personal data. To exercise the working flow privately with synthetic data, set `SITE_MODE=live`.

Set live-mode public contacts in `.env.local` or the deployment environment:

```env
NEXT_PUBLIC_PHONE=
NEXT_PUBLIC_TELEGRAM_URL=
NEXT_PUBLIC_MAX_URL=
SITE_MODE=portfolio
```

Public phone contact is intentionally disabled: leave `NEXT_PUBLIC_PHONE` empty. In live mode, the lead form still requires a phone number. Telegram and MAX values must be complete HTTPS links to supplied direct-contact destinations. `src/config/site.ts` is the only application module that reads these values. Missing, malformed, or obvious placeholder links are omitted. Set mode and contacts before building or redeploying the static page. Public live collection of real personal data remains blocked by the release gate in `TZ.md`.
