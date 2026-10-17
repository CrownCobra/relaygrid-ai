# RelayGrid AI — agent-ready agency starter

A GitHub-ready starter for a small, AI-assisted automation agency. It combines the existing premium multi-page 3D website with optional server-side AI chat and secure lead intake on Cloudflare Pages.

> **Status: starter, not a finished autonomous company.** The website is ready for configuration. The chat endpoint works after Workers AI and D1 are bound. Secure database lead intake works after D1 and Turnstile are configured. Voice calls, email sending, CRM writes, payment processing, client-specific automations and fully autonomous sales are not active by default.

## Included

- Responsive website: Home, Solutions, Industries, Process, Pricing, Resources, About, Contact and Privacy.
- 3D homepage visual with a CSS fallback.
- AI chat endpoint using Cloudflare Workers AI when the `AI` binding is set; transparent rule-based demo fallback when it is unavailable.
- D1-backed enquiry storage with server-side validation, consent checkbox, honeypot, rate limiting and Turnstile validation.
- Security headers, same-origin checks, private secret handling, and no public endpoint that lists customer leads.
- Agent role cards, sales policy, voice integration plan, and deployment checklist.

## Recommended stack

- **Website + backend:** Cloudflare Pages + Pages Functions.
- **Lead database:** Cloudflare D1.
- **Website assistant:** Cloudflare Workers AI (configured binding and current free usage allowance required).
- **Workflow automation:** Activepieces Community Edition, connected only after a paying client and a clear workflow exist.
- **Voice agent later:** LiveKit Agents or Pipecat with a telephony provider. Phone numbers, connectivity, compliant call routes and usage may cost money.
- **Git hosting:** GitHub. Never commit `.dev.vars`, tokens, credentials or customer exports.

Official references: [Pages Functions](https://developers.cloudflare.com/pages/functions/), [Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/), [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), [Cloudflare secrets](https://developers.cloudflare.com/workers/configuration/secrets/), [Turnstile](https://developers.cloudflare.com/turnstile/get-started/), [Activepieces](https://github.com/activepieces/activepieces), [LiveKit Agents](https://github.com/livekit/agents).

## Quick start

1. Create a GitHub repository, for example `relaygrid-ai`, and push this folder's contents.
2. Create a Cloudflare Pages project from that repository. Set the output directory to `public`; there is no frontend build command.
3. Create a D1 database named `relaygrid-db` (for example with `npx wrangler d1 create relaygrid-db`). Run `npx wrangler d1 execute relaygrid-db --file=migrations/0001_initial.sql --remote` to apply the schema.
4. Set up these Pages bindings:
   - D1 database binding named `DB`.
   - Workers AI binding named `AI`.
5. In Pages settings, add secrets:
   - `RATE_LIMIT_SALT`: a long random string, unique to this deployment.
   - `TURNSTILE_SECRET`: server-side Turnstile secret.
   - `ENVIRONMENT`: set to `production` as a regular variable.
   - Optional `LEAD_WEBHOOK_URL` and `WEBHOOK_SECRET` for a trusted HTTPS webhook; the receiver must validate `X-RelayGrid-Signature` as HMAC-SHA256 over `timestamp.payload` and reject timestamps older than five minutes.
6. Create a Turnstile widget for your production hostname. Put its **public site key** in `public/assets/js/config.js` as `turnstileSiteKey`. Store the **secret key only in Cloudflare Pages settings**.
7. Set `contactEmail` in `public/assets/js/config.js` to a monitored email you control. Optionally configure a WhatsApp business number you control. Do not publish placeholders.
8. Deploy, then test `/api/health`, the chat widget and the form. Verify the D1 lead row is created only after valid server-side anti-spam validation.

The starter's `wrangler.toml` includes placeholders. Replace the D1 database ID before CLI deployment, or add bindings in the Cloudflare dashboard. A CI workflow checks site links and JavaScript syntax on pushes and pull requests. If the dashboard is used, verify the `AI` binding name is exactly `AI` and the database binding name is exactly `DB`.

## Local development

Requires Node.js and Wrangler. Create `.dev.vars` locally for development-only settings; it is ignored by Git. Do not reuse production secrets in local development. Use `npx wrangler pages dev public --d1 DB=relaygrid-db --ai AI`, adjusting the local D1 database alias and Wrangler version as needed. Apply the migration to the local D1 database before testing. Workers AI development calls still use your Cloudflare account and count against current usage quotas.

The static pages can be previewed without API bindings, but chat will use its clearly marked demo fallback and the contact form will prepare a draft rather than store details.

## What is and isn't automatic

| Capability | Status in this repo |
|---|---|
| Premium multi-page website | Included |
| 3D hero | Included with fallback |
| Website AI chat | API included; requires Workers AI binding and current quota |
| Lead form database intake | API included; requires D1 + Turnstile site/secret keys |
| Rate limiting / basic security headers | Included; configure a unique rate-limit salt and provider-level controls |
| Secure customer-facing outbound email | Not included; integrate a reputable provider and consent/opt-out controls |
| Autonomous prospect scraping / mass cold outreach | Intentionally not included |
| Voice calling | Integration plan only; requires voice agent, phone infrastructure and consent workflow |
| AI-built client projects, billing, contracts, legal review | Requires approval and separate systems |

The assistant cannot guarantee that a prospect will buy, guarantee results, claim fake case studies, or perform an action without an enabled integration. Do not market this starter as fully autonomous or production-audited.

## Security before going public

- Review and complete `public/privacy.html` with the actual operator identity, data retention and providers.
- Set a unique random `RATE_LIMIT_SALT`; do not leave the default.
- Set Turnstile secrets in Cloudflare, never in browser JavaScript or Git.
- Use Cloudflare rate-limit rules and monitor usage; application-level limits are not a substitute for platform controls.
- Use synthetic data during testing; never store customer passwords or unnecessary sensitive information.
- Use D1 access controls and do not create a public endpoint to list all leads. Periodically remove expired rate-limit records and apply the agreed lead retention/deletion schedule. The optional webhook must verify its HMAC signature and timestamp before acting. Lead rows can be reviewed in the restricted D1 console; do not expose an unauthenticated list endpoint.
- Review current privacy, marketing, telecom and AI-disclosure requirements in each target market before any sales automation.
- In production, any voice agent must disclose that it is AI, obey opt-outs, and place only inbound calls or callbacks the customer explicitly requested unless a lawful, reviewed alternative is in place.

## Agent role specifications

The `agents/` files specify a future multi-agent workflow: prospect research, inbound sales, customer support, delivery/QA and security review. These are role instructions, not five deployed autonomous agents. Connect them incrementally after validating the service with real customers and reviewing every tool permission.

## Start narrow

First sell and deliver the lead-to-visit workflow for a single solar installer. Use the website to capture inbound interest. Measure response time, next-action ownership, visits booked and overdue quote follow-up. Add agent autonomy only when the result can be reviewed and undone safely.
