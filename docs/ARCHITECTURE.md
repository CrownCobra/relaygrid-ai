# RelayGrid AI architecture

## Netlify lead workflow

1. The contact form in `public/contact.html` collects the visitor's details and consent.
2. `netlify/functions/lead-workflow.mjs` validates the required fields and uses bounded rules to classify the issue and prepare a draft when no model-provider key is configured.
3. The browser submits the form fields and draft to Netlify Forms.
4. A person reviews the submission in Netlify and decides whether and how to respond.

No email, WhatsApp, CRM update, or follow-up reminder is sent automatically. No model key is required or configured for this demo.

## Other site components

- Static pages, styles, and browser scripts are served from `public/`.
- The chat widget calls an endpoint that is not part of this Netlify deployment; when unavailable it displays its canned FAQ fallback.
- The Agent Workspace is a browser-only simulation with fictional activity.
- The repository's `functions/` directory belongs to an earlier backend setup. It is not the function directory deployed by `netlify.toml`.

## Data boundaries

The submitted contact fields and generated rules-based draft are sent to Netlify Forms for human review. Use synthetic values during setup. Before collecting real enquiries, identify the operator, set a retention/deletion period, and complete the privacy notice.
