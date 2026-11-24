# Arena Sport DZ — website orders

Arabic sports-frame storefront with server-priced COD checkout, NOEST integration and Meta Pixel/CAPI.

## Run

Use Node.js 24. Install dependencies with `npm ci`. Link the intended Vercel project, provision Neon Postgres, and pull development variables into the ignored `.env.local` file. Fill the server-only variables listed in `.env.example`, then run:

```sh
npm run db:migrate
npm run dev
```

Never put access tokens in tracked code. The build exports only the two public HTML pages and `assets/`; server code, SQL, private data and environment files are not public assets.

## Order and delivery flow

- Select one of four age-specific models: black/red or transparent with branches and elastic for ages 12+, or black/transparent children models with elastic only for ages 5–11. Every model costs 2,900 DZD. Then explicitly choose a wilaya and delivery method. Canonical active communes, station codes and account fees come from NOEST.
- The server computes product price (2,900 DZD per frame), shipping and the COD total. It ignores client-submitted totals.
- A UUID/idempotency key and hashed receipt token identify a durable order intent before NOEST is contacted.
- Only NOEST acceptance with a tracking code produces an accepted receipt and Purchase outbox record.
- An uncertain response stays pending. Retrying the same request never blindly creates another parcel.
- Phone confirmation and carrier validation remain manual in the NOEST dashboard. This application never calls the validation/dispatch endpoint.
- Browser and server Purchase use the same `purchase:<internal UUID>` event ID. Loading the thank-you URL alone cannot produce a Purchase.
- Purchase value excludes customer-paid shipping. The carrier COD amount includes it.
- CAPI delivery uses a durable outbox; a failed event does not cancel an accepted order.
- Production page visits wake due background work: Meta retries at most once per minute and carrier synchronization at most once per 15 minutes. PostgreSQL leases coordinate instances. The daily authenticated reconciliation remains a fallback when there is no traffic. These are due-work intervals, not a promise of a timer while the site has no visits.
- Carrier references, carrier status synchronization and Meta retries fail independently. A NOEST failure cannot skip the first Meta retry pass. Newly found delivery events receive a second bounded flush after synchronization.
- Delivered custom events are separate from Purchase. Returned and returning parcels remain distinct from current delivered parcels and cash received.
- NOEST naive event times are interpreted as Algeria time (UTC+1); verify this against the current provider contract before enabling delivery events.

## Routes

Public: `GET /api/products`, `GET /api/delivery`, `POST /api/orders`, and token-protected `POST /api/orders/receipt`.

Internal routes require `Authorization: Bearer <CRON_SECRET>`:

- `GET /api/internal/reconcile`: bounded daily synchronization.
- `GET /api/internal/metrics`: aggregate order and event delivery counts, with no customer list.
- `POST /api/internal/reconcile-order`: resolve one pending order using a manually verified tracking code. The server checks its reference and amount before acceptance.

The private ledger stores customer data and event identifiers. Keep database and internal-route credentials server-side. Never make the ledger or provider responses a public export.

Metrics include pending/dead CAPI counts, the oldest pending event, last successful send and maintenance job state. Job failures log only generic codes. Inspect pending orders or missing trackings manually; these changes do not recreate parcels or re-emit old Purchase events.

## Preview isolation and attribution

Vercel Preview/Development deployments cannot read the production checkout references, create orders, expose receipts or run integration jobs. The form explains that orders are disabled. The production Meta bootstrap runs only on landing-arena-sport.vercel.app. Tests inject isolated services and a fake browser pixel. To deliberately use non-Vercel local live integrations, set ALLOW_LOCAL_LIVE_INTEGRATIONS=true with appropriate development credentials; do not use production credentials for synthetic orders.

UTM-only visits now save a fresh attribution context. The server retains its observed timestamp for comparing internal attribution windows; saved context does not mean Meta attributed the order in its seven-day window. Browser and server Purchase IDs stay unchanged.

Run the additive schema migration before publishing this version; integration_jobs is required for coordinated background work. Rolling back the application does not require dropping this table.

## Tests

```sh
npm test
npx playwright install chromium
npm run test:browser
npm run build
```

Unit/integration tests run against PGlite PostgreSQL. Browser tests use a dedicated local fixture server and stubs; they cannot send real NOEST parcels or Meta events. Do not point automated browser tests at a production order form.

Meta's Test Events code is a debugging aid, not a sandbox: Meta states those events can still be used for targeting and measurement. Validate live transport with genuine actions, such as an actual PageView; keep synthetic Purchase tests in local fixtures. See https://developers.facebook.com/documentation/ads-commerce/conversions-api/using-the-api#testEvents. Never create fake production Purchase events to increase signal volume. A controlled NOEST smoke parcel must remain unvalidated, be explicitly labelled as a test, and be deleted after verification.

## Creative assets

`assets/banners/arena-sport/` contains two creative concepts, each in feed, vertical and square fallback formats. Arabic captions, campaign decisions and account performance evidence are maintained in the owner's private campaign handoff, not in this public repository.

For editable source and generation prompts, use the owner's local creative package. `scripts/render-creatives.js` exports a supplied local `creative.html` package and checks typography before writing images. Usage: `node scripts/render-creatives.js <absolute-package-directory> v2`. The current v2 assets distinguish ages 12+ with branches/elastic from children ages 5–11 with elastic only.

The deployed domain and Facebook Page identity must agree with the intended storefront before any ad is published.

## Switching the NOEST account

Store the new account in NOEST_USER_GUID and NOEST_API_TOKEN. Preserve the previous pair in server-only NOEST_LEGACY_USER_GUID and NOEST_LEGACY_API_TOKEN while its orders need tracking. New orders always use the current account; legacy credentials are used only for tracking/reconciling earlier orders. Untagged orders predate this change and resolve to the legacy account when configured. Account identity is saved as a one-way fingerprint, never a token. Keep legacy credentials until their orders no longer require reconciliation.

Reference data and account-specific fees are cached separately by account identity, so a switch cannot silently reuse the previous account fees. Do not move existing orders to another account or re-emit Purchase when changing credentials. Test the new reference APIs and stage a production build before promoting it.

When NOEST cannot find a saved tracking, the order remains accepted in the ledger and is marked tracking_unavailable for review. It is not recreated, cancelled, or counted as a new Purchase. Later polling can recover it if the provider returns the tracking again. Internal metrics expose the unavailable count.
