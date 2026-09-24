# Clean Square

Development workspace for the Clean Square demo. Product work starts in Stage 1 of [PLAN.md](PLAN.md).

Use Node.js 24 and npm. Run `npm ci` to install the locked dependencies, then `npm run dev` to start the application. Copy `.env.example` to `.env.local` when environment values are available.

Stage 0 checks: `npm run typecheck`, `npm run lint`, `npm run build`, `npm test`, and `npx playwright --version`. Business tests are added in later stages.
