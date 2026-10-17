# RelayGrid AI — zero-upfront starter kit

**Working offer:** lead-to-site-visit and quote follow-up workflows for independent rooftop-solar installers.

**Working brand only:** “RelayGrid AI” has not been checked for company-name, domain, trademark or social-handle availability. Do not represent this as a registered company.

## What's included

- Premium responsive multi-page website (Home, Solutions, Industries, Process, Pricing, Resources, About, Contact, Privacy)
- A real Three.js WebGL hero visual loaded from a CDN, with an accessible CSS fallback
- Shared mobile navigation, active-page highlighting, FAQ interactions and scroll reveals
- Editable ROI scenario calculator (all inputs are assumptions, not promised business results)
- Contact form that opens a visitor's own email draft or WhatsApp draft; it does **not** upload or save form data on a server
- Research notes, sales discovery checklist, delivery scope and no-cost launch plan

## 1. Positioning: sell one outcome, not “AI automation”

**Buyer:** an owner or sales manager at a small rooftop-solar installer / EPC with a modest sales team.

**Problem hypothesis to validate:** enquiries arrive through multiple channels; responsibility for first response or a site survey is unclear; quotes can go without a defined follow-up date; the owner cannot easily see which leads have stalled.

**Offer:** “We set up a simple lead-to-visit and quote-follow-up system using the tools you already have. Every open enquiry gets an owner, a next step and a due date. We review operational changes after a short pilot.”

Avoid claiming that you will “recover 30% of leads,” “guarantee more sales,” or produce revenue without evidence. The ROI tool on the site is a scenario calculator, not a testimonial or forecast.

## 2. Why this niche is a reasonable first experiment

- **Large and policy-supported market in India:** the Government of India's rooftop-solar programme and PM-Surya Ghar scheme are relevant demand signals; an MNRE/PIB release reported 14.43 lakh rooftop systems installed from 1 Jan to 22 Dec 2025 under PM-Surya Ghar. This does **not** prove that every installer needs or will pay for automation.
- **Messaging-first context:** Meta stated in Sep 2025 that 91% of online adults in India chat with businesses weekly (citing Kantar 2025). Meta also introduced Business AI in WhatsApp for eligible Indian small and medium businesses in May 2026. This validates interest in faster responses but also means a generic FAQ bot is a weak differentiator.
- **Better offer:** connect lead intake, assignment, site-survey tracking, quote follow-up and weekly reporting; position AI as optional support. Existing CRM or native messaging tools may already cover parts of the workflow, so inspect each prospect's current setup first.
- **Competition limitation:** there is no reliable public dataset proving this exact micro-niche has “low competition.” The hypothesis to test is that a narrow, local implementation service can compete through workflow understanding, setup and accountability—not by claiming an uncontested market.

### Alternatives ranked for a solo beginner

Scores are a judgement model to help prioritize validation, not measured global market statistics. 5 is better. “Competition position” scores room to differentiate (5 = clearer room to differentiate; it does not mean no competitors).

| Niche + specific workflow | Pain/ROI clarity | Prospect access | Budget potential | Competition position | Delivery simplicity | Decision |
|---|---:|---:|---:|---:|---:|---|
| **Rooftop solar installers — enquiry → site visit → quote follow-up** | 5 | 3 | 4 | 3 | 4 | **Test first** |
| AC/RO repair companies — callback queue + maintenance reminders | 4 | 5 | 3 | 2 | 4 | Best fallback for easiest local prospecting |
| Small B2B distributors — quotation and reorder follow-up | 5 | 3 | 4 | 4 | 3 | Strong phase-two niche; more discovery needed |
| Coaching centres — enquiry → trial class → admission reminders | 4 | 5 | 3 | 2 | 4 | Easy to reach, crowded and seasonal |
| Real-estate brokers — lead qualification + visit scheduling | 5 | 4 | 4 | 1 | 4 | Lots of demand, but very noisy/competitive |
| Dental/medical clinics — appointment and recall workflows | 4 | 3 | 4 | 2 | 2 | Avoid as first niche; higher privacy and workflow risk |
| Small law firms — intake and document workflows | 4 | 2 | 4 | 3 | 2 | Avoid initially; sensitive information and risk |

### Market approach across regions

- **India — start here:** easier to do direct interviews and learn local workflows. Budgets may be tight. Offer a low-risk setup pilot and use existing client tools; keep WhatsApp messaging manual until an approved, funded integration is genuinely needed.
- **US/UK — test later:** potentially higher contract values, but stronger competition and more mature CRM expectations. Do not sell internationally until the setup is repeatable and a real case study exists.
- **Other regions — expand after evidence:** the workflow can travel, but privacy law, messaging rules, language, currency, time zones and system integrations differ. Don't treat one Indian pilot as global proof.

## 3. Suggested pricing to test (not market averages)

Use these as *initial experiments*, not promises:

- Free 15-minute discovery / workflow map; no custom build before scope is agreed.
- First paid pilot: **₹4,999 one-time** for one lead tracker, one intake route, follow-up reminders, approved message templates, handover and a short review.
- Optional ongoing support after a working pilot: **₹2,999/month** for a defined check-in, small agreed fixes and a basic operating report.
- Raise pricing only when actual impact, scope and support time support it. Larger custom integrations are separately scoped.

Keep WhatsApp Business Platform, SMS, telephony, model/API, domain, hosting add-ons and third-party connector costs outside the quote unless clearly listed. Never activate paid usage without the client's explicit agreement and funding. A customer may already have a suitable tool; don't rebuild unnecessarily.

## 4. No-upfront-cost stack

| Need | First choice | Why / caveat |
|---|---|---|
| Source control | GitHub Free public repository | Store the website, scripts, documentation and version history. Do not put keys, customer data or credentials in Git. |
| Static website hosting | Cloudflare Pages Free | Supports static assets and Git deployment. Free plans have limits; check current rules before launch. Use the free `pages.dev` subdomain first. |
| Landing-page visual | Static HTML/CSS + Three.js from CDN | No build step. 3D CDN dependency needs internet; CSS fallback remains if it fails. |
| Client's intake/tracker | Their existing Google Forms/Sheets/Gmail or CRM | No new tool cost if they already own and approve the account. Check individual account terms and quotas. |
| First automation | Small documented script or client-approved Activepieces core flow | Activepieces core is MIT-licensed; some enterprise/cloud features use commercial licensing. Review exact components and license before commercial deployment. |
| AI drafting (optional) | A free API/model tier for a sandbox only | Availability/limits/terms change. Never send confidential customer data to a free model tier without client approval and policy review. Avoid AI for the first pilot if rules-based automation is enough. |
| Booking | Use the client's current calendar link, or schedule manually | Cal.diy is a self-host option but still requires hosting and maintenance; don't add it before there is demand. |
| Contact form on this starter | Visitor's email client / WhatsApp draft | No database or hidden server endpoint. Set your email or WhatsApp number in `assets/js/config.js`. |

### Important license choices

- **Activepieces core:** `https://github.com/activepieces/activepieces` — the project says its core is MIT, while enterprise/cloud features are commercially licensed. Use only the licensed edition/features you understand.
- **n8n:** `https://github.com/n8n-io/n8n` is source-available under its Sustainable Use License, not OSI open source. It does allow some consulting/workflow services, but restrictions apply to offering a hosted automation product or making the platform available for customers to connect accounts. Read its current license before building a client service on it.
- **Dify:** `https://github.com/langgenius/dify` supports agentic workflows and RAG, but self-hosting needs a server and maintenance; it is overkill for a zero-budget first client.
- **Flowise:** `https://github.com/FlowiseAI/Flowise` builds LLM agents/flows. Helpful for later prototypes, but an LLM agent is not necessary for the core lead tracker.
- **Three.js:** `https://github.com/mrdoob/three.js` — 3D visual library used in the homepage via a pinned CDN version.
- **React Three Fiber:** `https://github.com/pmndrs/react-three-fiber` — useful if rebuilding this static site as a React app in the future.
- **Cal.diy:** `https://github.com/calcom/cal.diy` — MIT-licensed self-hostable scheduling option; needs hosting, so start with an existing calendar.
- **Supabase:** `https://github.com/supabase/supabase` / `https://supabase.com/pricing` — free database/auth tier can work for later prototypes but has project/inactivity/usage limits. Do not assume the free tier is a production SLA.

## 5. Put the site online

### Easiest path: GitHub → Cloudflare Pages

1. Extract `relaygrid-starter.zip` locally.
2. Create a **public** GitHub repository for the static website (example: `relaygrid-ai-site`). Public is optional for the code if your chosen hosting plan supports private repos, but a public repo makes sharing simpler. Never commit API keys or client data.
3. Upload the *contents* of this folder to the repository root: `index.html`, the other `.html` pages, `assets/`, `START_HERE.md` and `RESEARCH_AND_SALES_PLAN.md`.
4. Edit `assets/js/config.js`. Set `brandName`, `contactEmail` or `whatsappNumber`, and optionally `bookingUrl`. Use only a contact address/number you control.
5. Create a Cloudflare account, open Pages, connect the GitHub repository, and select a static deployment. Because this is plain HTML/CSS/JS, leave the build command blank and use the repository root as the output directory.
6. Deploy and test each page, the mobile menu, form draft, links and 3D fallback. The public URL will be on a free `pages.dev` subdomain unless you later buy a domain.
7. Before public launch: verify the working brand, remove placeholders, update privacy notice and confirm local business / tax / contract obligations with an appropriate adult/professional.

Cloudflare pricing and quotas can change. Its Pages documentation lists static asset requests as free and unlimited, while Pages Functions use Workers quotas; this starter uses no Pages Function.

### Local preview

Open `index.html` in a modern browser to check content, or use a simple local static server (e.g. `python -m http.server 8000` from this folder and visit `http://localhost:8000`). The WebGL hero loads Three.js from a CDN, so a network connection is needed for that optional scene.

## 6. Contact form behaviour (transparent by design)

This is a static website, so the contact form **does not save leads to a database or secretly post them anywhere**. Once configured:

- email mode prepares a `mailto:` draft using `contactEmail`; the visitor must press Send in their email app;
- WhatsApp mode prepares a message to `whatsappNumber`; the visitor must review and press Send;
- if neither option is set, the form explains that setup is incomplete.

This avoids a surprise API bill but means that it is not a hosted form service. Later, after validation, add a trusted form provider or a small protected server-side endpoint and update the privacy notice. Test it before publishing.

## 7. Seven-day validation sprint

**Day 1 — choose 25 prospects.** Build a short list of independent rooftop-solar installers in one city/region. Use public business contact channels; do not scrape private data or automate mass messages. Note each firm's lead sources, CRM clues and public service area.

**Day 2 — prepare the demo.** Use fake sample enquiries only. Show the pipeline: new enquiry → assigned owner → site-survey date → proposal → next follow-up → outcome. Do not fabricate customers, screenshots of real accounts, or performance claims.

**Days 3–4 — talk to owners.** Send a few thoughtful, personalized messages each day or ask for warm introductions. Ask how leads are tracked, where handoffs break, which software is already in place, and what missing follow-up costs them. Stop if asked not to contact them.

**Day 5 — qualify.** Continue only if several prospects independently describe the same costly problem, can show the workflow without exposing customer data, and have an owner willing to be accountable for implementation.

**Day 6 — write one pilot scope.** Describe the exact workflow, required access, data retention, approval points, fallback, deliverables, price, support window, third-party costs and success metrics. Get adult/guardian support for contracts and payments if you are under 18; never bypass platform age checks or use another person's account without permission.

**Day 7 — ask for a paid pilot.** If the problem is real, propose the small paid scope. If no one will pay, revisit the buyer/problem before writing more code. A free, time-boxed pilot can be considered only in exchange for specific learning access and permission to use an accurately anonymized case study—but do not promise results.

## 8. Outreach messages you can adapt

### First message

> Hi [Name] — I’m researching how smaller rooftop-solar teams handle enquiries between first contact, site survey and proposal follow-up. I’m building a small workflow that keeps every open lead assigned to an owner with a clear next action, using existing tools where possible. Could I ask you 3 quick questions about how your team handles this today? No worries if it isn't relevant.

### If they show interest

> Thanks. I won't ask for customer lists or credentials. If useful, we can map one lead journey with dummy data, agree what should stay human-approved, and define a small pilot with a written scope and success metrics before any live setup.

### Follow-up (once, only if appropriate)

> Hi [Name] — just closing the loop on my note about lead follow-up between enquiry, site survey and quote. If this isn't a priority, no problem and I won't keep messaging. If it is, I can share a short workflow map.

Do not send unsolicited bulk messages, scrape personal numbers, misrepresent your experience or claim you have results you have not produced.

## 9. Safety, data and trust

- Start with synthetic data. Ask for only the minimum access needed after a scoped agreement.
- Never ask the client to paste passwords or API keys into chat or a public repository; store secrets in provider settings, not in source code.
- Avoid sensitive sectors and high-impact decisions initially. For customer messaging, use permission-based communication, approved templates, opt-outs and human review.
- Keep logs of errors and a manual fallback. A failed automation must not silently discard a lead.
- Disclose all recurring/usage costs. Do not let a client's workflow unexpectedly trigger paid API usage.
- If under 18, involve a parent/guardian in contracts, payments, client accounts and any business/legal obligations. Do not work around age or identity verification requirements.

## 10. Research sources

Sources checked for this research snapshot (17 Oct 2026); policies, prices and limits can change:

- World Economic Forum, *Transforming Small Businesses: An AI Playbook for India's MSMEs* (17 Oct 2025): https://www.weforum.org/publications/transforming-small-businesses-an-ai-playbook-for-india-s-msmes/
- Government of India / PIB, renewable-energy capacity update including PM-Surya Ghar progress: https://nghm.mnre.gov.in/admin/uploads/176794038987418Press%20Release_Renewable%20Energy%20Capacity%20in%202025.pdf
- MNRE, Grid Connected Rooftop Solar Programme: https://mnre.gov.in/en/grid-connected-solar-rooftop-programme/
- Meta, Business AI on WhatsApp for Indian small businesses (May 2026): https://about.fb.com/news/2026/05/introducing-business-ai-on-whatsapp-for-small-businesses-in-india/
- Meta, India business messaging update (Sep 2025): https://about.fb.com/news/2025/09/bringing-new-tools-to-help-businesses-boost-engagement-customer-support-and-discoverability/
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare Pages Functions pricing: https://developers.cloudflare.com/pages/functions/pricing/
- Supabase pricing: https://supabase.com/pricing
- Gemini API pricing/terms: https://ai.google.dev/gemini-api/docs/pricing
- Activepieces licensing: https://github.com/activepieces/activepieces/blob/main/docs/about/license.mdx
- n8n Community License: https://github.com/n8n-io/n8n-docs/blob/main/docs/n8n-community-license/README.md
- Vercel Hobby terms (why it is not recommended for a commercial agency website): https://vercel.com/legal/terms

No independent dataset was found that measures competition for this exact micro-niche. The niche scores above are hypotheses to validate, not statistical claims.
