# Clean Square

Development workspace for the Clean Square demo. Product work starts in Stage 1 of [PLAN.md](PLAN.md).

Use Node.js 24 and npm. Run `npm ci` to install the locked dependencies, then `npm run dev` to start the application. Copy `.env.example` to `.env.local` when environment values are available.

Stage 0 checks: `npm run typecheck`, `npm run lint`, `npm run build`, `npm test`, and `npx playwright --version`. Business tests are added in later stages.

## Stage 7: Supabase persistence

Create a Supabase project, then apply [the leads migration](supabase/migrations/20260924000000_create_leads.sql) using the project's SQL editor. The table has database defaults for `id` and `created_at`, checks for the area range and consent, and Row Level Security with no browser policies. The migration explicitly grants `service_role` insert access when automatic table exposure is disabled and removes table grants from browser roles.

Set these **server-only** values in `.env.local` (or the private runtime environment):

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your-project-key
```

Use the project's current secret API key, never a publishable or legacy service-role key. Do not put the secret under a `NEXT_PUBLIC_` name. A missing or invalid key causes lead submission to fail closed with the public `SUBMISSION_ERROR` response. The browser posts to `/api/leads`; only the server inserts into Supabase. Use synthetic data for preview testing. Public collection of real contact data remains subject to the release gate in `TZ.md`.
