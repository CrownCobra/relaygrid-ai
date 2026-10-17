# Deployment checklist

## Before deployment

- [ ] Confirm this working name is available and decide who legally operates the service.
- [ ] Add a monitored email and optional business WhatsApp number to `public/assets/js/config.js`.
- [ ] Create Cloudflare Pages project from GitHub; output directory is `public`.
- [ ] Create D1 database and apply `migrations/0001_initial.sql`.
- [ ] Add D1 binding `DB` and Workers AI binding `AI`.
- [ ] Add `RATE_LIMIT_SALT` and `TURNSTILE_SECRET` as encrypted secrets. Set `ENVIRONMENT=production` as a variable.
- [ ] Create Turnstile for the deployed hostname and set the public site key in config.
- [ ] Optional: configure a trusted Activepieces webhook with `LEAD_WEBHOOK_URL` and `WEBHOOK_SECRET` secrets.
- [ ] Replace `public/privacy.html` placeholders and complete operator, retention and deletion details.
- [ ] Confirm no API secrets, `.dev.vars`, data exports, private customer files or test credentials are tracked in Git.

## Production smoke test

- [ ] `GET /api/health` shows expected bindings without returning secrets.
- [ ] Chat widget receives a reply from the AI binding; if not, the front end clearly explains demo fallback.
- [ ] Overlong chat messages are rejected; rapid repeated submissions are rate-limited.
- [ ] Contact form cannot store data without valid server-side Turnstile verification.
- [ ] Valid contact consent submits one D1 row; invalid email, missing consent, honeypot activity and replayed/expired Turnstile tokens are rejected or quietly ignored.
- [ ] Webhook receiver verifies the HMAC and deduplicates/rejects invalid events.
- [ ] Security headers exist and the site works with keyboard navigation and on mobile.
- [ ] Pricing, claims, AI disclosure, privacy notice and contact routes are accurate.
- [ ] Configure alerts for Workers AI quota, D1 usage, error rates and webhook failures.

## Rollback

Keep the previous successful deployment in Cloudflare. If a new integration behaves unexpectedly, turn off the binding or webhook secret, revert the commit, and review logs without exporting unnecessary personal data.
