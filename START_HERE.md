# Start here — RelayGrid AI agent-ready starter

This repository now includes the premium multi-page website plus optional Cloudflare Pages Functions for AI chat and secure lead capture. The README explains which features are working, what is still integration-only, and how to deploy safely.

## Fastest route

1. Create a GitHub repository and upload the repository contents.
2. Connect the repo to Cloudflare Pages with output folder `public` and no frontend build command.
3. Create a D1 database and apply `migrations/0001_initial.sql`.
4. Add D1 binding `DB` and Workers AI binding `AI` under Pages project settings. For Pages Functions, Workers AI binding setup is configured through the dashboard.
5. Add encrypted secrets `RATE_LIMIT_SALT` and `TURNSTILE_SECRET`, and variable `ENVIRONMENT=production`.
6. Create a Turnstile widget for the production hostname and place only its public site key in `public/assets/js/config.js`.
7. Add a real contact email in that same config file. Test `/api/health`, AI chat and the form before sharing your site.

## Don't skip this

- The website can be previewed without an AI backend, but chat will use a clearly marked demo fallback.
- Secure database lead capture requires D1 plus server-side Turnstile verification. Without the site key it falls back to an email/WhatsApp draft.
- Voice calling and connected outbound sales are not activated. Voice requires separate telephony/agent credentials, cost checks and a reviewed consent workflow.
- Complete the privacy notice, set your real business details, and use a parent/guardian for contracts and payment-account setup if you are under 18.

Run `python scripts/check_site.py` and the JavaScript syntax checks before deploying. See `docs/DEPLOYMENT.md` for the full checklist.
