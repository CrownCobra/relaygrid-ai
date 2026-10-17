# RelayGrid AI system architecture

## Components

1. Static website in `public/` — nine connected pages and the 3D hero.
2. Chat widget in `public/assets/js/chat-widget.js` — sends messages to `/api/chat` and shows a clearly marked fallback if the backend isn't ready.
3. Pages Function `functions/api/chat.js` — validates same-origin requests, applies an IP-digest rate limit, passes a short conversation context to Workers AI and does not write chat messages to D1.
4. Pages Function `functions/api/leads.js` — validates form fields and contact consent, checks the honeypot, requires server-verified Turnstile for production intake, rate-limits submissions, and stores minimum lead details in D1.
5. D1 migration in `migrations/` — schema for leads and request-limit counters.
6. Optional trusted webhook — after a valid lead is stored, the lead handler can notify a configured Activepieces webhook with an HMAC signature. The webhook URL and signing secret belong in Cloudflare secrets, not browser code.

## Agent roles (planned)

- Prospect researcher: enriches a small list of relevant businesses from permitted public sources, records source URLs and uncertainty, and queues review. It does not mass-scrape or send messages autonomously.
- Inbound sales assistant: answers approved service questions, qualifies needs and directs the prospect to the contact form. It does not invent case studies, quote custom scopes without review, or claim a meeting is booked.
- Customer support agent: answers from approved client documentation, creates draft tasks, and escalates unclear or sensitive issues.
- Delivery/QA agent: drafts automation workflows, test cases, handover notes and runbooks; cannot access client production credentials or deploy without approval.
- Security reviewer: checks permission boundaries, secret leaks, dependency changes, input validation, retention policy and logs.

These role definitions are a staged design. The first deploy activates only the website, the chat endpoint and secure lead intake. Each later tool integration needs its own credentials, permissions, audit path and test.

## Data boundaries

- Chat endpoint: receives user message and bounded recent turns; does not write the conversation into project D1.
- Lead intake: stores the explicitly submitted enquiry fields to enable a reply. Complete the privacy notice and retention/deletion plan before real usage.
- Rate limits: stores a salted digest of the connecting IP, not the plain IP. Set a unique random salt, apply provider-level rate limits and define a cleanup schedule for old rows.
- Webhook: send only necessary lead fields to a destination you control. Validate the signature and don't forward data to arbitrary destinations.

## What makes this agentic?

Agents can plan or draft next actions, but every external capability is a bounded tool. The orchestration decides when a task can run automatically and when it requires a person. Autonomy should grow only after tests, visibility, reversibility and customer consent exist.
