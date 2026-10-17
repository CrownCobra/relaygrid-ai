# RelayGrid AI architecture

## Netlify lead workflow

1. The contact form in `public/contact.html` collects the visitor's details and consent.
2. `netlify/functions/lead-workflow.mjs` validates every collected field and uses bounded rules to classify the issue and prepare a draft. It rejects overlong inputs, checks consent and same-origin requests, and never calls a model or another service.
3. The browser displays the draft and reference, then posts the canonical validated fields and draft to Netlify Forms. HTTP success does not prove storage; an operator must find the reference in the Forms inbox. Inputs remain available when storage fails.
4. A person reviews the submission in Netlify and decides whether and how to respond.

No email, WhatsApp, CRM update, or follow-up reminder is sent automatically. There is no model-provider branch, API key requirement, Cloudflare dependency, database, or new account in this workflow.

## Other site components

- Static pages, styles, and browser scripts are served from `public/`.
- The chat widget uses local preset FAQ replies and sends no network requests.
- The Agent Workspace is a browser-only simulation with fictional activity.
- The repository's `functions/` directory belongs to an earlier backend setup. It is not the function directory deployed by `netlify.toml`.

## Data boundaries

The submitted contact fields and generated rules-based draft are sent to Netlify Forms for human review. Use synthetic values during setup. Before collecting real enquiries, identify the operator, set a retention/deletion period, and complete the privacy notice.

Netlify Forms is the existing platform persistence primitive; no custom database was added. Direct Forms posts can bypass the preparation function, so inbox fields and derived classifications remain untrusted and need human review. The honeypot and Netlify spam filtering do not guarantee abuse prevention. No custom server-side rate limiter is claimed. There is no public records/list endpoint. Never automate decisions from a submission or log raw contact content. Use the Netlify dashboard for access, deletion, and manual follow-up ownership.
