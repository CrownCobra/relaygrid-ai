# Instructions for coding agents

This repository is an early-stage business starter. Optimize for secure, honest, low-cost and maintainable delivery—not for maximum autonomy.

## Non-negotiable constraints

- Never claim sales, conversions, testimonials, certifications, revenue or customer results that are not evidenced in the repo.
- Never add secrets, access tokens or production customer data to source control.
- Never bypass Turnstile, consent, rate limits, access control, opt-out handling or provider safeguards.
- Never build unsolicited automated voice calls or bulk messaging as the default workflow. Support inbound requests and callbacks that a customer explicitly requested, after reviewing local rules.
- Do not let an LLM directly execute shell commands, access unrestricted URLs, read all customer records, issue refunds, sign contracts or spend money without strict tooling and human approval.
- Do not expose a public lead-list endpoint or log raw chat content/contact details unnecessarily.
- Keep a human approval point for pricing exceptions, contracts, client-data access, external messages and deployments.

## Engineering expectations

- Validate and length-limit all untrusted input server-side.
- Use prepared SQL statements; never interpolate user strings into SQL.
- Keep API keys in Cloudflare secrets and local `.dev.vars` only.
- Fail safely and show a clear next step to the user; don't claim an action succeeded before receiving the integration result.
- Update `public/privacy.html`, docs and tests whenever data collection or third-party integrations change.
- Verify affected pages, keyboard navigation, mobile layout, API responses and security controls before changing deployment files.
