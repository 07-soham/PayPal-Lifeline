# PayPal Lifeline

PayPal Lifeline is an independent hackathon demo that connects people seeking help with essential expenses to community supporters. It is not an official PayPal product. Contributions in this MVP are paid to the request organizer through PayPal checkout; Lifeline does not hold funds or pay utilities, pharmacies, or other providers directly. No request is described as verified.

## Run locally

Requires Node.js 22.13+ (Node 24 recommended). The app uses Node's built-in HTTP and SQLite modules; no npm packages are required.

```powershell
Copy-Item .env.example .env
# Set SESSION_SECRET to a long random value in .env
# Example generator in PowerShell 7: [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
npm run dev
```

Open http://localhost:3000. SQLite is created in `data/lifeline.sqlite`. Keep `.env` and `data/` private. To reset local demo data, stop the server and remove the `data` folder. There are no fictional people or seeded payment confirmations.

## Configure PayPal Sandbox

1. Create a PayPal developer app and select Sandbox.
2. Put the Sandbox REST app Client ID in `PAYPAL_CLIENT_ID` and Secret in `PAYPAL_CLIENT_SECRET` in `.env`. Never use these in browser code or commit them.
3. Keep `PAYPAL_ENVIRONMENT=sandbox`.
4. Restart the server. The UI will offer checkout only when credentials are present.
5. Create two user accounts, publish a request as one user, then sign in as the other and open the request.
6. Enter an amount, check the explicit payment consent, select Continue to PayPal, and approve with a Sandbox personal account.
7. PayPal redirects back with the order token. Lifeline calls the capture API server-side and checks order/capture state, currency, and amount before changing the contribution to completed.

The browser does not mark a payment successful. If credentials are missing, contributions are disabled with a setup message. A Sandbox checkout was not run unless the operator supplies valid Sandbox credentials.

## AI configuration

Without `OPENAI_API_KEY`, request structuring uses a clearly labeled local rule-based helper and does not claim an AI call occurred. Optional server-side OpenAI configuration accepts `OPENAI_API_KEY` and `OPENAI_MODEL`. Only the user's short free-text description is sent; no documents or payment data are collected. Structured model results are validated, and service failures return the labeled fallback.

## Commands

```powershell
npm run dev       # auto-restarting local server
npm start         # server
npm run check     # JavaScript syntax checks
npm test          # request structuring/API smoke test
```

There is no separate migration command: startup creates the SQLite schema with foreign keys and indexes. No sample seed script is provided, so no fictional beneficiaries or payments can be mistaken for real ones.

## Architecture and current scope

- `server.js`: HTTP API, SQLite schema, password hashing (scrypt), HttpOnly/SameSite sessions, request ownership, AI structuring, PayPal OAuth/order/capture, audit and report records.
- `public/`: responsive HTML/CSS/JS client; public marketplace and request form, login/signup, dashboard, reporting, payment checkout handoff.
- `test/`: API smoke coverage for category/amount extraction and prompt-injection-style text being handled as data.
- Currency is stored in integer minor units. Totals include only `completed` contributions. Pending orders are not counted as received.

## Implemented and planned

Implemented: public request marketplace with search/category/sort; signup/login/logout; persistent requests and contributions; owner-scoped dashboard; optional AI structuring and safe rule fallback; explicit consent; contribution cap validation; PayPal Sandbox OAuth/order/capture verification; moderation reports and audit events; responsive UI.

Planned: production-grade multi-instance concurrency controls and rate limiting, verified PayPal webhook signature handling/reconciliation, refunds, account deletion and retention automation, dedicated admin moderation actions/UI (admin API is permission-protected), evidence uploads, email notifications, broader unit/browser tests, and hardened deployment configuration. The current local SQLite reservation flow is intended for a single-process demo, not production traffic. Do not treat AI flags as proof or use this MVP to make eligibility decisions.

## Security and deployment notes

Use a unique high-entropy `SESSION_SECRET`; serve behind HTTPS; set `NODE_ENV=production` so session cookies include Secure. Set secrets through the deployment provider's secret manager. SQLite is local durable storage and is not shared across multiple server instances. Set up backups and retention/deletion controls before handling real users. Add rate limiting, CSRF strategy for cross-site deployments, verified webhooks and operational monitoring before public deployment. Never upload sensitive evidence in this MVP.
