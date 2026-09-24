# Technical Specification: “Clean Square”

## 0. Canonical Contract

This file is the product source of truth. External technical facts in the baseline were re-verified for **2026-09-23**; demo business values remain explicit project assumptions rather than claims about the cleaning market.

Canonical terminology:

| Concept | Canonical term / code | Rule |
|---|---|---|
| Persisted customer submission | **Lead** | Use `lead` in domain/API/database language. “Submit a request” is allowed only as user-facing CTA copy. Do not introduce an `Order` domain entity. |
| Cleaning option | **cleaning type** / `CleaningTypeId` | IDs: `maintenance`, `deep`, `post-renovation`. |
| Optional paid service | **add-on** / `AddOnId` | IDs: `windows`, `fridge`, `oven`. API/domain field: `addOns`. |
| Calculator output | **calculation** / **calculation summary** | The price is always estimated/preliminary. |
| Process section | **How It Works** | Component/config names should follow this wording rather than introduce `Process` as a second product term. |

Canonical data rules:

- `area` is an **integer number of square metres**, inclusive range **10–500**. Fractional values are invalid in MVP.
- All configured prices and calculated totals are integer **RUB** values; kopeks and monetary rounding are outside MVP.
- `name`: trim surrounding whitespace; accepted length **2–80 characters**; do not restrict to a specific alphabet.
- `phone`: trim surrounding whitespace; accepted raw length **7–32 characters**; allowed characters are digits, spaces, `+`, `(`, `)`, and `-`; after removing formatting it must contain **7–15 digits**. Preserve the trimmed user-entered representation for persistence.
- `consent` must be exactly `true` for submission.
- Public contact values are environment values read and exported through `src/config/site.ts`; UI components must not read environment variables directly.

Stable API contract:

- success: `201 Created` with `{ "success": true }`;
- invalid payload: `400 Bad Request` with `{ "success": false, "code": "VALIDATION_ERROR" }`;
- persistence/internal submission failure: `500 Internal Server Error` with `{ "success": false, "code": "SUBMISSION_ERROR" }`.

---

## 1. Product Goal

Build a one-page website for the fictional cleaning company **Clean Square**.

The primary business flow is:

```text
visitor → preliminary price calculation → lead submission
```

The website lets a visitor estimate the cleaning price. Default portfolio mode demonstrates the lead and contact controls without sending data or leaving the site. Explicit `SITE_MODE=live` enables lead submission and direct Telegram/MAX links in private previews with synthetic data; public live launch remains subject to the deployment gate.

A secondary goal is to serve as a portfolio project that demonstrates a complete business scenario rather than only a visually polished frontend.

---

## 2. Target Audience

People who need apartment or house cleaning and want to understand the approximate price before contacting the company.

---

## 3. Product Format

- One responsive landing page.
- No separate user-facing pages in MVP.
- Full usability on mobile and desktop.
- The price calculator is one of the primary visual and functional elements of the page.

---

## 4. Page Structure

The landing page contains the following sections in this order:

1. Hero.
2. Services.
3. Price Calculator.
4. Benefits.
5. How It Works.
6. Reviews.
7. Lead Form + Telegram / MAX.
8. Final CTA.
9. Footer.

---

## 5. Hero

The first screen must contain:

- company identification;
- a short and clear cleaning-service value proposition;
- the primary CTA: **“Calculate price”**.

The CTA must scroll the user to the calculator section.

---

## 6. Services

MVP includes exactly three cleaning types:

1. Maintenance cleaning.
2. Deep cleaning.
3. Post-renovation cleaning.

Each service displays:

- name;
- short description;
- the shared configured `pricePerM2` and `minPrice` values (for example “from … RUB” and “… RUB/m²”), without duplicating tariff literals in the component.

---

## 7. Price Calculator

### 7.1. User Inputs

The user selects:

- cleaning type;
- property area;
- optional add-on services.

MVP add-ons:

- window cleaning;
- refrigerator interior cleaning;
- oven interior cleaning.

### 7.2. Pricing Formula

```text
basePrice = max(minPrice[type], pricePerM2[type] × area)

totalPrice = basePrice + sum(selectedAddOns)
```

Demo tariffs:

| Cleaning type | Price per m² | Minimum price |
|---|---:|---:|
| Maintenance cleaning | RUB 45 | RUB 2,500 |
| Deep cleaning | RUB 90 | RUB 4,500 |
| Post-renovation cleaning | RUB 120 | RUB 6,000 |

Demo add-on prices:

| Add-on | Price |
|---|---:|
| Window cleaning | RUB 1,500 |
| Refrigerator interior | RUB 700 |
| Oven interior | RUB 700 |

These values are **demo assumptions**, not externally verified market prices. They must be stored in one shared configuration source and must not be duplicated inside UI components.

### 7.3. Area Validation

- Area is entered as a number.
- MVP accepted range: **10–500 m²**.
- Values outside the range are invalid.
- Invalid input must not produce a valid calculation total or be accepted for submission.

The 10–500 m² range is a project assumption introduced to make validation deterministic; it was not defined in the source brief.

### 7.4. Calculator Behavior

The displayed price must:

- update without page reload;
- recalculate immediately after changing cleaning type, area, or add-ons;
- always be labeled as **preliminary / estimated**, never as a final contractual price.

### 7.5. Calculation Result

For a valid calculation, display:

- selected cleaning type;
- area;
- selected add-ons;
- estimated total price;
- CTA: **“Submit a request”**.

The CTA scrolls to the lead form and preserves the current calculation parameters.

---

## 8. Lead Form

Required user fields:

- name;
- phone number;
- consent to personal-data processing.

Validation contract:

- `name`: trimmed, 2–80 characters;
- `phone`: trimmed, 7–32 characters, only digits/spaces/`+`/parentheses/hyphen, with 7–15 digits after formatting characters are removed;
- `consent`: exactly `true`.

Automatically included calculation data:

- cleaning type;
- area;
- selected add-ons;
- server-calculated estimated price.

Validation must run both client-side for UX and server-side for trust and data integrity.

After successful submission, the user must see a clear confirmation state.

If submission fails, the user must see a clear error and be able to retry without re-entering the form and calculation data.

The project is fictional. Any consent wording included in the demo is placeholder product copy, not a claim of legal compliance. A real deployment must replace it with jurisdiction-appropriate privacy and consent text.

---

## 9. Lead Submission and Storage

MVP uses a server endpoint inside the Next.js application and PostgreSQL through Supabase.

The browser must not write directly to the leads table with elevated credentials.

The server must:

1. receive the form payload;
2. validate it;
3. recalculate the price from trusted server-side configuration;
4. ignore any client-provided total as a source of truth;
5. save the lead;
6. return the stable API response defined in Section 0.

Canonical request payload fields are `name`, `phone`, `cleaningType`, `area`, `addOns`, and `consent`. The client does not need to send a price.

Minimum lead data:

```text
id
name
phone
cleaningType
area
addOns
calculatedPrice
consent
createdAt
```

---

## 10. Alternative Contact Channels

The lead section must also contain:

- Telegram;
- MAX.

In live mode, both links must open the configured company profile, chat, or other appropriate direct-contact destination. In portfolio mode, Telegram and MAX buttons stay on the page and show a clear demo notice.

Telegram and MAX destinations are configuration values used only in live mode. Public phone contact is intentionally disabled. Portfolio mode keeps the form fields for demonstration but neither validates nor submits them; live mode requires the phone field for a callback.

---

## 11. Benefits

Show no more than four concrete benefits.

MVP copy may communicate that:

- the customer sees an estimated price before a call;
- the company brings cleaning products and equipment;
- a convenient time can be arranged;
- issues reported after cleaning can be corrected.

---

## 12. How It Works

Use exactly these four conceptual steps (copy may be polished without changing meaning):

1. The visitor calculates an estimated price.
2. The visitor submits a request.
3. The company confirms details and timing.
4. The cleaning is performed.

This section must support the main flow rather than duplicate the calculator.

---

## 13. Reviews

Use exactly three static fictional reviews for the demo.

Review structure:

```text
name
text
rating
```

Users cannot add, edit, or moderate reviews.

---

## 14. Final CTA

Before the footer, repeat one concise conversion action:

- if a valid calculation exists, the CTA submits/moves to the lead form using the current calculation;
- otherwise, it returns the user to the calculator.

This CTA may be visually integrated with the lead section, but the conversion action must be clearly present near the end of the page.

---

## 15. Footer

The footer contains:

- company name;
- public phone number only when that contact path is enabled in live mode;
- Telegram and MAX controls (in-page demo notices in portfolio mode; links in live mode);
- basic service information.

---

## 16. Visual Requirements

The visual style must be:

- clean;
- calm;
- modern;
- focused on task completion rather than decorative effects.

The intended interaction hierarchy is:

1. understand the service;
2. reach the calculator;
3. get an estimated price;
4. submit a request.

Avoid:

- excessive decorative cards;
- heavy animation;
- repeated identical CTAs across many sections;
- effects that compete with the calculator or lead form.

---

## 17. Responsive UX and Accessibility

The site must work correctly from **320 px viewport width** upward.

Required baseline:

- no unintended horizontal scrolling;
- readable typography;
- usable touch targets;
- keyboard-accessible interactive elements;
- visible focus states;
- explicit labels for form controls;
- clear validation messages;
- clear loading state during submission;
- duplicate submission disabled while a request is in flight.

Browser target for MVP: current evergreen browsers. Tailwind CSS 4.x does not target legacy browsers; support for older browser generations is explicitly outside MVP unless added as a new requirement.

---

## 18. Basic SEO

Provide:

- page `<title>`;
- meta description;
- correct heading hierarchy;
- semantic HTML;
- favicon and basic metadata.

No advanced SEO infrastructure is required.

---

## 19. Explicitly Out of Scope

Do not implement:

- user accounts;
- registration or authentication;
- online payment;
- blog;
- separate service pages;
- complex interactive maps;
- user-generated reviews;
- review moderation;
- admin panel;
- CRM or order-management system;
- employee scheduling;
- built-in website chat;
- AI features;
- CMS;
- speculative “future-proof” functionality that does not serve the primary flow.

---

## 20. Technical Baseline

Verified for **2026-09-23** and chosen for this project:

- **Node.js 24 LTS** as the runtime baseline. Node.js 26 is Current on this date; production projects should use an LTS line.
- **Next.js 16.3.6** using the App Router. Next.js 16.x is Active LTS; 16.3.6 is the security-patched release published on 2026-09-22.
- **React** is framework-managed for the App Router. React 19.3 is the current stable upstream release on this date, but the project must keep the `react`/`react-dom` versions selected as compatible by the Next.js 16.3.6 scaffold instead of forcing an independent version.
- **TypeScript** with strict type checking.
- **Tailwind CSS 4.3** for styling. Tailwind v4 targets modern browsers; project minimums follow its documented baseline: Chrome 111+, Safari 16.4+, Firefox 128+, and current Chromium-based Edge.
- **Zod 4.6** for runtime validation.
- **Supabase PostgreSQL** for lead persistence.
- **Supabase secret API key (`sb_secret_...`)** for server-only elevated access. New work must not start on the legacy `service_role` key; Supabase states that legacy `anon` and `service_role` keys are being deprecated by the end of 2026.
- **Vitest 5** for unit tests. It requires Node.js >= 22.12 and Vite >= 6.4.
- **Vite 8.3** as the explicit Vitest peer dependency/test tooling baseline; it is not the application bundler for Next.js.
- **Playwright 1.63** for end-to-end tests.
- **Vercel** for deployment.

Dependencies are locked by the committed package lockfile. Compatible security patch upgrades are allowed and preferred; major upgrades require an explicit task and documentation update.

Official verification anchors used for this baseline:

- Node.js releases: https://nodejs.org/en/about/previous-releases
- Next.js support policy and 2026-09-22 security release: https://nextjs.org/support-policy and https://nextjs.org/blog
- React 19.3: https://react.dev/blog/2026/09/09/react-19-3
- Tailwind CSS 4.3 and compatibility: https://tailwindcss.com/blog/tailwindcss-v4-3 and https://tailwindcss.com/docs/compatibility
- Zod 4.6: https://zod.dev/blog/zod-4-6
- Vitest 5 requirements: https://vitest.dev/guide/migration/
- Vite releases: https://vite.dev/releases
- Playwright release notes: https://playwright.dev/docs/release-notes
- Supabase key migration: https://supabase.com/docs/guides/getting-started/migrating-to-new-api-keys

---

## 21. Assumptions

The source brief intentionally left several implementation decisions open. This specification resolves them as follows:

- lead storage: Supabase PostgreSQL;
- application backend: Next.js route handler, not a separate service;
- deployment: Vercel;
- pricing values: demo values defined above; they are not claims about current market prices;
- area validation: integer 10–500 m²;
- money: integer RUB, without kopeks;
- lead validation: exact name/phone rules are defined in Section 0;
- site mode: `SITE_MODE=portfolio` by default; only explicit `SITE_MODE=live` enables server submission and external contact links;
- live-mode public contacts: `NEXT_PUBLIC_PHONE` (optional; currently disabled), `NEXT_PUBLIC_TELEGRAM_URL`, and `NEXT_PUBLIC_MAX_URL`, read centrally through `src/config/site.ts`;
- company identity and reviews: fictional demo content;
- legal/privacy copy: placeholder until a real deployment jurisdiction and operator are known;
- public live production that accepts real personal data is blocked until jurisdiction-appropriate privacy/consent text and operator details are supplied. Preview/private live testing may use synthetic lead data; public portfolio mode sends no leads.

---

## 21.1. Deployment Gate

Default portfolio mode makes no client lead request, rejects direct API submissions, and does not expose external contact links. Before any public live deployment that can accept real names or phone numbers:

- replace placeholder privacy/consent copy with jurisdiction-appropriate text;
- provide the real operator/company identity required by that text;
- provide real production destinations for enabled public contact paths (currently Telegram and MAX; public phone contact is disabled);
- verify that production storage and retention behavior matches the established privacy text.

Until these prerequisites exist, public portfolio mode and preview/private live deployment with synthetic test leads are valid. Public live collection of real personal data remains blocked. The full lead persistence path must still work in private live testing.

---

## 22. Definition of Done

### Functionality

- [ ] All required landing-page sections are implemented.
- [ ] A final CTA near the end of the page lets the user return to the calculator or submit a request.
- [ ] Hero CTA moves the user to the calculator.
- [ ] All three cleaning types can be selected.
- [ ] Area accepts only integer values from 10 through 500 inclusive.
- [ ] Each add-on can be independently selected and deselected.
- [ ] Price recalculates without page reload.
- [ ] Client calculation uses the shared pricing configuration.
- [ ] The result is explicitly labeled as estimated/preliminary.
- [ ] Calculation data is preserved when moving to the lead form.
- [ ] In live mode, name and phone follow the canonical validation rules from Section 0.
- [ ] In live mode, the form cannot be submitted without consent.
- [ ] In live mode, lead submission goes through the server endpoint; in portfolio mode, the form shows a demo notice without a request.
- [ ] In live mode, the server recalculates the authoritative estimated price.
- [ ] In live mode, a valid lead is persisted in PostgreSQL.
- [ ] In live mode, successful submission displays a confirmation state.
- [ ] In live mode, failed submission displays a useful error state and permits retry.
- [ ] In live mode, the Telegram link opens the configured destination; in portfolio mode, its button shows a demo notice.
- [ ] Exactly three fictional reviews are rendered.
- [ ] No more than four benefits are rendered.
- [ ] How It Works contains the four required conceptual steps.
- [ ] Page title, meta description, semantic HTML, heading hierarchy, and favicon are present.
- [ ] In live mode, the MAX link opens the configured destination; in portfolio mode, its button shows a demo notice.
- [ ] The complete live flow has no dead ends; portfolio actions explain their demo behavior.

### UI and Accessibility

- [ ] Layout works on mobile and desktop.
- [ ] No unintended horizontal overflow at supported viewport sizes.
- [ ] The calculator remains a primary visual element.
- [ ] Form states are understandable.
- [ ] Interactive controls are keyboard-accessible.
- [ ] Focus states are visible.
- [ ] Form controls have accessible labels.

### Engineering Quality

- [ ] Node.js runtime matches the supported project baseline.
- [ ] TypeScript type checking passes.
- [ ] Linting passes.
- [ ] Production build succeeds.
- [ ] Pricing logic is covered by unit tests.
- [ ] The primary lead flow is covered by an E2E test.
- [ ] The form error path is tested.
- [ ] No server secret is exposed to the browser or committed to Git.
- [ ] Production or preview deployment uses a working database configuration with synthetic test data until the public-production privacy gate is satisfied.
- [ ] Public production accepting real personal data is not enabled while the Section 21.1 deployment gate is unsatisfied.
- [ ] No explicitly out-of-scope functionality has been added.
