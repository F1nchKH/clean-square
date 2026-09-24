# AGENTS.md

## 0. Agent Role, Documentation Gate, and Canonical Contract

The agent is an **implementer and verifier**, not the product owner. It may make small reversible implementation decisions, but it must not silently change product scope, pricing semantics, data handling, architecture, or release gates.

Before feature implementation, read `TZ.md`, `ARCHITECTURE.md`, `PLAN.md`, and this file. If they contain a known contradiction, missing mandatory value, or incompatible dependency/sequence, do **not** begin feature implementation until the documents are reconciled or the user explicitly authorizes work under the unresolved state. Documentation-only repair work is allowed.

Canonical project vocabulary and data rules:

- persisted submission: `Lead`; “Submit a request” is UI copy only; never create an `Order` domain entity;
- cleaning IDs: `maintenance`, `deep`, `post-renovation`;
- optional service: **add-on**; IDs `windows`, `fridge`, `oven`; field `addOns`;
- calculator output: calculation / calculation summary;
- section: `How It Works`;
- area: integer 10–500 inclusive;
- money: integer RUB;
- name: trim, 2–80 characters;
- phone: trim, 7–32 allowed characters (digits/spaces/`+`/parentheses/hyphen), containing 7–15 digits after formatting is removed;
- consent: exactly `true`;
- contacts: public env values are read through `src/config/site.ts`, not directly by components;
- API responses: `201` success, `400/VALIDATION_ERROR`, `500/SUBMISSION_ERROR`.

---

## Purpose

This file defines project-specific operating rules for AI coding agents working on **Clean Square**.

The project is a one-page cleaning-company demo. Default `SITE_MODE=portfolio` retains the UI but displays demo notices for contact and form actions, does not send leads, and rejects direct API submission. Explicit `SITE_MODE=live` enables the primary business flow:

```text
visitor
→ estimated price calculation
→ lead submission
```

The purpose of agent work is to complete and protect that flow with the least unnecessary complexity.

---

## 1. Instruction Priority

When instructions conflict, use this order:

1. The user's current explicit request.
2. `TZ.md` — product requirements and scope.
3. `ARCHITECTURE.md` — accepted technical architecture.
4. `PLAN.md` — implementation sequence and dependencies.
5. This `AGENTS.md`.
6. General agent assumptions.

Never ignore a more specific instruction in favor of a more general one.

If the user explicitly changes a product or architectural decision, implement the requested change and update affected documentation so the repository does not describe two different systems.

---

## 2. Default Working Style

Work on the concrete project task rather than giving generic advice.

Do not repeat already established context unless it is needed for the current decision or verification.

If the task is clear **and the documentation gate above is satisfied**, start implementation without unnecessary clarification.

Make small, reversible decisions independently, including:

- local variable names;
- placement of a small helper;
- minor component organization;
- obvious CSS details;
- straightforward refactoring needed to complete the task.

Ask a short clarification only when missing information materially changes:

- the product flow;
- project scope;
- data handling;
- architecture;
- a difficult-to-reverse decision.

Do not ask the user to decide trivial implementation details.

If several meaningful approaches exist, show only the differences that materially affect the decision. Do not overload the user with equivalent alternatives. If the user is uncertain about an important product or architecture choice, do not silently choose for them; identify the decisive criterion or ask one focused question.

For complex tasks, work in verifiable parts rather than one large hidden change.

---

## 3. Definition of “Done” for Agent Work

A task is done only when:

- the requested result works;
- the relevant behavior has been checked;
- the result is properly integrated and formatted;
- important changes are visible and understandable;
- verification depth matches the cost of a possible error.

A code change is not done merely because files were edited.

If verification cannot be completed, state exactly what was not verified.

---

## 4. Primary Product Invariant

The following flow must remain functional in live mode. Portfolio mode must keep the calculator and form UI, show demo notices, and never persist a lead:

```text
Hero
→ Calculator
→ Calculation Summary
→ Lead Form
→ POST /api/leads
→ Server Validation
→ Server Pricing
→ Supabase
→ Success State
```

Alternative contact path in live mode; portfolio buttons stay on-site:

```text
Lead Section
→ Telegram or MAX
```

Do not improve secondary UI at the cost of making this path harder, slower, or less reliable.

---

## 5. Required Product Functionality

Agents must preserve the UI below. Submission, persistence, success/retry states, and outbound contact links apply in live mode; portfolio mode must show clear demo notices and perform no submission or external navigation:

- Hero with CTA to the calculator;
- maintenance cleaning;
- deep cleaning;
- post-renovation cleaning;
- area input;
- window-cleaning add-on;
- refrigerator-interior add-on;
- oven-interior add-on;
- immediate estimated-price calculation;
- clear preliminary-price labeling;
- calculation summary;
- transfer of calculation state to the lead form;
- name field;
- phone field;
- consent field;
- final CTA near the end of the page;
- real server-side lead submission;
- server-side price recalculation;
- database persistence;
- success state;
- retryable error state;
- Telegram link;
- MAX link;
- benefits section with no more than four benefits;
- How It Works section with the four specified conceptual steps;
- three static fictional reviews;
- footer;
- mobile and desktop support.

Do not remove a required feature unless the user explicitly changes the specification.

---

## 6. Scope Guard

Do not add without an explicit requirement:

- registration;
- authentication;
- user accounts;
- payment;
- blog;
- separate service pages;
- complex map functionality;
- user-generated reviews;
- review moderation;
- admin panel;
- CRM;
- order-management UI;
- employee scheduling;
- built-in chat;
- AI features;
- CMS;
- speculative infrastructure for hypothetical future features.

Do not introduce a dependency because it may be useful later.

---

## 7. Verified Technical Baseline

Baseline date: **2026-09-23**.

Use:

```text
Node.js 24 LTS
Next.js 16.3.6
React packages compatible with and managed by the Next.js 16.3.6 App Router scaffold
TypeScript strict mode
Tailwind CSS 4.3
Zod 4.6
Supabase PostgreSQL
Supabase sb_secret_... server key
Vitest 5.x
Vite 8.3 for Vitest peer/test tooling
Playwright 1.63
Vercel
```

Verified context:

- React 19.3 is current stable upstream on 2026-09-23, but do not override the Next.js App Router's compatible React packages independently.
- Next.js 16.x is Active LTS; do not downgrade below 16.3.6 in this baseline because 16.3.6 contains the 2026-09-22 security update.
- Node 26 is Current, while Node 24 is LTS and remains the chosen production runtime.
- Vitest 5 requires Node.js >= 22.12 and Vite >= 6.4; Vite 8.3 satisfies the peer requirement.
- Tailwind CSS v4 browser baseline is Chrome 111+, Safari 16.4+, Firefox 128+, plus current Chromium-based Edge.
- Supabase is deprecating legacy `anon` and `service_role` keys by the end of 2026; new server work uses `sb_secret_...`.
- Commit and preserve the lockfile.
- Prefer compatible security patches.
- Do not perform unrelated major dependency upgrades.

---

## 8. Architecture Boundaries

Project areas:

```text
components/   presentation and interaction
config/       tariffs and static configuration
domain/       framework-independent types and business logic
validation/   runtime validation schemas
server/       server-only infrastructure
app/api/      HTTP boundary
```

Allowed dependency direction:

```text
UI ─────────┐
            ↓
          Domain

API ────────┤
            ↓
          Domain

API → Server Infrastructure → Supabase
```

The `domain` layer must not import:

- React;
- Next.js;
- Supabase;
- browser APIs.

---

## 9. Calculator Rules

### Single Source of Truth

Pricing configuration lives in:

```text
src/config/pricing.ts
```

Do not duplicate tariffs inside:

- JSX;
- API route handlers;
- form components;
- CSS;
- unrelated utility files.

### Formula and Configuration

```text
basePrice = max(minPrice, pricePerM2 × area)

totalPrice = basePrice + sum(selectedAddOns)
```

Canonical prices:

- `maintenance`: 45 RUB/m², minimum 2500 RUB;
- `deep`: 90 RUB/m², minimum 4500 RUB;
- `post-renovation`: 120 RUB/m², minimum 6000 RUB;
- `windows`: 1500 RUB;
- `fridge`: 700 RUB;
- `oven`: 700 RUB.

### Validation

Area must be an integer within:

```text
10–500 m² inclusive
```

Fractional area is invalid in MVP.

### Behavior

- Pricing logic is a pure function.
- Browser calculation is immediate and local.
- No request is made for every calculator input change.
- The server recalculates the price before persistence.
- The browser total is never trusted as authoritative.
- Pricing changes should normally require editing one configuration source, not several UI files.

---

## 10. State Management Rules

Do not add Redux, Zustand, or another global state library for current scope.

Prefer derived state:

```text
inputs → calculatePrice(inputs) → result
```

over independently mutable state:

```text
inputs + separately stored mutable total
```

Share calculator state through the smallest reasonable common client boundary required by `Calculator` and `LeadForm`.

Do not persist calculation or personal data in `localStorage` unless the user explicitly requests that behavior.

---

## 11. Next.js Server / Client Component Rules

Default to Server Components for static content.

Use `"use client"` only for code that requires:

- local React state;
- event handlers;
- interactive forms;
- browser-only APIs.

Expected client-side areas:

```text
Calculator
LeadForm
```

or one small parent interaction component that owns their shared state.

Do not mark `page.tsx`, the entire landing page, or static sections as client components merely for convenience.

---

## 12. TypeScript Rules

Use strict TypeScript.

Rules:

- Avoid `any` when a real type can be expressed.
- Prefer `unknown` plus narrowing for untrusted input.
- Domain functions must have clear input/output types.
- Cleaning and add-on IDs must use constrained types derived from or aligned with configuration.
- Do not use type assertions to silence genuine type errors.
- API responses must have explicit contracts.
- Do not introduce advanced type-level abstractions when simple types are sufficient.

---

## 13. React Rules

Prefer:

- focused functional components;
- local state where it naturally belongs;
- derived values from current state;
- composition over generic framework-like abstractions.

Do not use `useEffect` to calculate price from calculator state.

Do not add `useMemo` or `useCallback` mechanically. Add optimization only when there is a concrete reason.

Do not create custom hooks solely to move a few lines out of a component.

---

## 14. UI Rules

Visual direction:

- clean;
- calm;
- modern;
- task-oriented.

Primary visual hierarchy:

```text
Hero
↓
Calculator
↓
Lead Form
```

Avoid:

- decorative complexity;
- large numbers of interchangeable cards;
- heavy animation;
- unnecessary gradients and blur layers;
- repetitive CTAs without a distinct purpose;
- visuals that make the calculator harder to find or use.

The calculator must remain one of the strongest visual anchors on the page.

---

## 15. Responsive Rules

Every meaningful UI change must be checked in at least:

```text
mobile
desktop
```

For layout-sensitive work, also check approximately 320 px viewport width.

A component is not done if it works on desktop but breaks the mobile flow.

Do not introduce unintended horizontal scrolling.

---

## 16. Accessibility Rules

Required baseline:

- semantic HTML;
- real `<button>` elements for actions;
- real `<a>` elements for navigation/contact links;
- labels for form fields;
- keyboard operability;
- visible focus states;
- understandable validation messages;
- correct heading hierarchy.

Use ARIA only when native HTML semantics are insufficient.

Do not turn a generic `<div>` into an interactive control when a native element exists.

---

## 17. Form Rules

### Client Responsibilities

Client-side logic provides:

- fast validation feedback;
- form usability;
- submitting state;
- success/error rendering.

### Server Responsibilities

Server-side logic provides:

- authoritative validation;
- pricing recalculation;
- persistence orchestration.

Client validation is never sufficient for trust.

### Failed Submission

After an error:

- keep the name;
- keep the phone;
- keep the calculator state;
- allow retry.

### Active Submission

While a request is in flight:

- disable duplicate submission;
- show visible progress.

---

## 18. Runtime Validation Rules

In live mode, validate all `POST /api/leads` input with Zod 4.6. Portfolio mode rejects the request before reading its body.

Validate exactly:

- `name`: trimmed length 2–80;
- `phone`: trimmed length 7–32, only digits/spaces/`+`/parentheses/hyphen, 7–15 digits after formatting is removed;
- `cleaningType`: one of `maintenance`, `deep`, `post-renovation`;
- `area`: integer 10–500 inclusive;
- `addOns`: array containing only `windows`, `fridge`, `oven`; reject unknown IDs;
- `consent === true`.

Reject unknown business identifiers instead of coercing them into valid values.

Do not use untrusted values before validation/narrowing.

---

## 19. Personal Data Rules

Treat name and phone number as personal data.

Do not:

- log them without a concrete debugging need;
- include them in URLs;
- expose them in public error messages;
- persist them in client storage without a requirement;
- send them to unrelated third-party services.

The current demo stores submitted lead data only through the server-side Supabase path.

Consent copy in this fictional project is placeholder content. Do not claim legal compliance for a real jurisdiction unless the user provides that requirement and appropriate legal text is established.

---

## 20. Supabase Rules

Environment variables:

```env
SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

`SUPABASE_SECRET_KEY`:

- must contain the current `sb_secret_...` key type;
- is server-only;
- must never receive a `NEXT_PUBLIC_` prefix;
- must never be committed;
- may bypass RLS and therefore must remain behind the application's own server validation.

Do not implement direct browser insertion into the leads table.

Required path:

```text
Browser
→ /api/leads
→ server validation
→ server price recalculation
→ Supabase
```

Do not introduce the legacy `SUPABASE_SERVICE_ROLE_KEY` variable in a new implementation unless the user is specifically migrating an older project that still requires it.

---

## 21. API Error Rules

The browser receives this stable public contract:

```text
201 { "success": true }
400 { "success": false, "code": "VALIDATION_ERROR" }
500 { "success": false, "code": "SUBMISSION_ERROR" }
```

Never return:

- raw SQL errors;
- stack traces;
- credentials;
- Supabase internals;
- arbitrary exception messages.

Server-side logging must avoid unnecessary personal data.

---

## 22. Content and Configuration Rules

Centralize repeatable static values. `src/config/site.ts` is the only application module that reads the public contact environment variables. It also owns/export static site content such as up to four benefits, exactly three fictional reviews, and the four How It Works steps.

Do not hardcode the same:

- phone number;
- Telegram URL;
- MAX URL;
- tariff;
- benefit copy;
- review data;

across multiple components.

Use configuration for content/configuration and components for presentation.

No CMS is required.

---

## 23. Component Rules

Create a component when it:

- owns a distinct responsibility;
- has meaningful interactivity;
- is reused;
- materially improves readability.

Do not create a component simply to wrap one element.

Do not introduce abstraction layers such as repositories, factories, facades, or managers unless they solve a concrete problem in the current scope.

---

## 24. Dependency Rules

Before adding a package, check:

1. Can the current stack solve the task directly?
2. Does the dependency remove meaningful complexity?
3. Is its maintenance/security cost justified?

Do not install a package for a trivial utility function.

Do not change package manager after project initialization.

Do not perform unrelated dependency upgrades while implementing a feature.

If a security advisory affects the current stack, apply the smallest compatible safe upgrade and document any resulting architectural change.

---

## 25. Testing Rules

### Pricing

Pricing logic must have automated tests for:

- minimum prices;
- normal per-square-meter calculation;
- all cleaning types;
- add-ons;
- multiple add-ons;
- area boundaries.

### E2E

The live main flow must be testable as:

```text
landing
→ calculator
→ lead form
→ submission
→ success
```

Also test a failed live submission path and the configured Telegram/MAX destinations. In portfolio mode, test that contact buttons stay on-site, the form sends no request, and direct API calls do not persist.

### Locator Strategy

In Playwright, prefer user-visible locators such as:

- role;
- label;
- accessible name;
- stable text where appropriate.

Avoid brittle CSS-selector chains that encode implementation details.

### Bug Fixes

When a bug can reasonably be reproduced in an automated test:

1. add or adjust the test;
2. confirm the scenario is covered;
3. fix the implementation;
4. run the relevant test set.

---

## 26. Verification by Risk

Verification depth must match the possible consequences of an error.

### Low Risk

Examples:

- copy change;
- spacing change;
- small visual adjustment.

Check:

- affected UI;
- lint/typecheck if the edited code requires it.

### Medium Risk

Examples:

- calculator UI state;
- form validation;
- component refactoring.

Check:

- typecheck;
- relevant unit tests;
- affected manual flow.

### High Risk

Examples:

- pricing logic;
- API handling;
- database integration;
- environment variables;
- personal data handling;
- dependency security fixes.

Check:

- typecheck;
- relevant automated tests;
- error path;
- full affected flow;
- secrets/data exposure risk.

---

## 27. Standard Agent Workflow

For a non-trivial task:

1. Read all four project documents for non-trivial feature work and confirm the documentation gate is satisfied.
2. Read the relevant implementation and identify the smallest correct change surface.
3. Inspect existing code before editing it.
4. Implement the change.
5. Run proportionate verification.
6. Fix problems found by verification.
7. Update documentation if requirements or architecture changed.
8. Report what changed and what was verified.

If work can safely continue without user confirmation, continue.

Do not stop immediately after code generation when verification is available.

---

## 28. Architecture Changes

Do not change architecture silently.

If a task genuinely requires a deviation from `ARCHITECTURE.md`:

1. identify why the current architecture is insufficient;
2. choose the smallest viable change;
3. implement it;
4. update `ARCHITECTURE.md`;
5. update `TZ.md` if the product requirement changed;
6. update `PLAN.md` if implementation sequencing changed.

Code and documentation must describe the same project.

---

## 29. Handling Ambiguity

Make minor reversible decisions independently.

Examples:

- helper name;
- local JSX organization;
- small spacing choice;
- local utility type.

Do not silently decide major ambiguous questions such as:

- changing the business flow;
- adding required lead fields;
- changing pricing semantics;
- changing persistence strategy;
- removing a required feature;
- adding a real legal/compliance claim.

If the context is sufficient, do not ask unnecessary questions.

---

## 30. Technical Pushback

Do not automatically agree with an implementation approach that:

- breaks the main flow;
- weakens security;
- duplicates business logic;
- exposes personal data or secrets;
- significantly expands a one-week project;
- violates explicit scope.

When raising a problem:

1. state the concrete issue briefly;
2. provide one workable alternative;
3. continue once the relevant decision is established.

Do not overload the user with a long list of equivalent alternatives.

---

## 31. Forbidden Shortcuts

Do not:

- hardcode a fake final total instead of using the pricing function;
- trust a total received from the browser;
- replace real lead submission with `console.log`;
- treat a success toast as proof that persistence succeeded;
- expose a Supabase secret to the browser;
- commit secrets;
- skip mobile verification after layout changes;
- call a task complete when relevant tests or checks are failing;
- hide failed or skipped verification;
- ship placeholder Telegram/MAX URLs as if they were verified real contacts;
- claim the demo consent text establishes legal compliance;
- enable public production collection of real personal data while the `TZ.md` deployment gate is unsatisfied;
- introduce `Order`, `extras`, or `Process` as parallel domain/product terms for the canonical Lead, add-on, and How It Works concepts.

---

## 32. Definition of Done for a Change

A change is complete when:

- it solves the requested task;
- it does not break the primary business flow;
- it complies with `TZ.md`;
- it respects architectural constraints;
- it introduces no new TypeScript errors;
- relevant tests pass;
- verification matches the risk level;
- no accidental out-of-scope functionality was introduced;
- documentation is synchronized when requirements or architecture changed;
- no known contradiction remains among `TZ.md`, `ARCHITECTURE.md`, `PLAN.md`, and `AGENTS.md`.

Do not declare completion if a significant required check was not performed.

---

## 33. Completion Report

After a technical change, report concisely:

```text
Changed:
- ...

Verified:
- ...

Unchanged:
- ...

Risks / not verified:
- ...
```

If no unresolved risk remains:

```text
Risks / not verified:
- none
```

Do not repeat the whole implementation plan or already-known project context.

---

## 33.1. Deployment Gate

Default public portfolio mode must not send or persist leads. Preview/private live deployments may exercise the complete persistence flow with synthetic data. Public live production that accepts real names or phone numbers requires all of the following first:

- jurisdiction-appropriate privacy/consent text;
- operator/company details required by that text;
- real production destinations for enabled public contact paths (currently Telegram and MAX; public phone contact is disabled);
- verified production storage behavior consistent with the established privacy text.

Do not bypass persistence in preview merely because the public-production gate is not yet satisfied.

---

## 34. Final Project Principle

The project should not demonstrate how many technologies can be added.

It should demonstrate one complete, understandable, and verified business scenario:

```text
user understands the service
→ calculates an estimated price
→ submits real lead data
→ server validates and recalculates
→ system persists the lead
→ user receives clear confirmation
```
