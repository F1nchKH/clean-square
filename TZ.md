# Clean Square — product contract

Clean Square is a one-page website for a **fictional** cleaning company. Its working scenario is straightforward: a visitor chooses a cleaning service, sees a preliminary price, and can leave a lead. The public deployment runs in `portfolio` mode: it demonstrates the interface without collecting contacts. A private `live` mode exercises actual server-side persistence with synthetic data.

## Page and content

The page flows through hero, calculator, services, benefits, How It Works, reviews, lead form, final CTA, and footer. The hero leads directly to the calculator. The calculator stays prominent on mobile and desktop, and the current calculation follows the visitor into the lead form.

The site presents three cleaning types: maintenance, deep, and post-renovation. Window cleaning, refrigerator interior, and oven interior are paid add-ons. Service descriptions and visible tariffs come from `src/config/pricing.ts`.

The page also contains at most four benefits, four process steps (calculate, request, confirm details, clean), and exactly three **fictional** static reviews. The reviews are disclosed as fictional on the page. No business results, genuine customer quotes, or actual company credentials are implied.

## Pricing and data

```text
basePrice = max(minPrice, pricePerM2 × area)
totalPrice = basePrice + sum(selected add-ons)
```

| Cleaning type / ID | RUB per m² | Minimum RUB |
|---|---:|---:|
| Maintenance / `maintenance` | 45 | 2,500 |
| Deep / `deep` | 90 | 4,500 |
| Post-renovation / `post-renovation` | 120 | 6,000 |

| Add-on / ID | RUB |
|---|---:|
| Windows / `windows` | 1,500 |
| Refrigerator interior / `fridge` | 700 |
| Oven interior / `oven` | 700 |

These are project tariffs, not market claims. Prices and totals are integer RUB. Area is an integer from 10 to 500 m² inclusive. The calculator updates locally and labels its result as preliminary. Invalid area must not produce a valid total or be submitted.

The persisted submission is a **Lead**, never an order. The request contains `name`, `phone`, `cleaningType`, `area`, `addOns`, and `consent`. Name is trimmed and 2–80 characters. Phone is trimmed, 7–32 allowed characters (digits, spaces, `+`, parentheses, hyphen), and 7–15 digits after formatting is removed. Consent must be exactly `true`. Unknown service IDs are rejected.

## Submission and trust

In `live` mode, the browser sends the lead to `POST /api/leads`. The server validates all input, recalculates the price using its own tariff configuration, and writes through its server-only Supabase secret. It never trusts a browser-supplied total. The stable public API responses are:

| Status | Body |
|---|---|
| 201 | `{ "success": true }` |
| 400 | `{ "success": false, "code": "VALIDATION_ERROR" }` |
| 500 | `{ "success": false, "code": "SUBMISSION_ERROR" }` |

The form provides field feedback, progress, confirmation, and a retryable error state that preserves entered details. Telegram and MAX are alternative contact links in live mode, configured through public environment values in `src/config/site.ts`. Public phone contact is disabled.

In default `portfolio` mode, the form and contact controls remain visible but stay on-site. No lead request is sent, direct API submissions fail closed before the body is read, and no personal data is stored. The form explicitly asks visitors not to enter real contact details.

## Deployment gate

The public version must remain in portfolio mode until jurisdiction-appropriate privacy and consent wording, required operator details, real contact destinations, and storage behavior consistent with that wording have been established. Private live tests may use synthetic records. The current consent copy is example text; it is not a claim of legal compliance.

## Quality bar

The site supports 320 px and wider screens, keyboard navigation, visible focus, semantic controls, labelled fields, clear errors, and reduced-motion preferences. Unit tests cover pricing, validation, contacts, and API/persistence boundaries. Browser tests cover the calculator, form, contact behavior, and private live path.

Scope stays limited to this flow. There are no accounts, payments, admin UI, CRM, blog, CMS, chat, or user-generated reviews.
