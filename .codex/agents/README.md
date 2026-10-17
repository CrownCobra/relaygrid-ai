# RelayGrid project agent team

These project-scoped Codex agents are RelayGrid-specific adaptations of roles from [The Agency](https://github.com/msitarzewski/agency-agents), a 230+ role collection. The upstream project provides Codex custom-agent TOML profiles; Codex reads project profiles from the .codex/agents folder.

## Team

| Role | Project responsibility |
| --- | --- |
| Business Strategist | Founder-level strategy and first-revenue focus. The upstream collection does not name a CEO agent. |
| Chief of Staff | Cross-functional coordination and work prioritization. |
| Growth Hacker | No-spend growth experiments. |
| Content Creator | Evidence-based marketing copy. |
| Sales Outreach | Prospect qualification and human-reviewed drafts only. |
| Offer & Lead Gen Strategist | Narrow, testable offer and lead-capture plan. |
| Email Marketing Strategist | Consent-aware email drafts; no sending. |
| Frontend Developer | Existing static HTML, CSS, and JavaScript site. |
| Backend Architect | Existing Netlify Functions workflow. |

## Use

Open this repository as a trusted Codex project and ask for the role by name, for example:

> Have the Business Strategist and Offer & Lead Gen Strategist propose one ₹0 pilot offer, then ask Sales Outreach to draft a message for a prospect I provide.

These are coding/workflow subagents for Codex. They do not run on the public Netlify site, do not act in the background, and do not provide extra model access. They inherit the current Codex session's model, tools, and permissions.

All roles follow RelayGrid's constraints: no Cloudflare, API keys, paid upgrades, invented proof, or sending external messages without human approval. The site remains the existing Netlify project.

## Source and license

Adapted from the corresponding role concepts in msitarzewski/agency-agents (MIT License, copyright 2025 AgentLand Contributors). See AGENCY_AGENTS_LICENSE.txt and the upstream profiles linked below:

- [Business Strategist](https://github.com/msitarzewski/agency-agents/blob/main/specialized/business-strategist.md)
- [Chief of Staff](https://github.com/msitarzewski/agency-agents/blob/main/specialized/specialized-chief-of-staff.md)
- [Growth Hacker](https://github.com/msitarzewski/agency-agents/blob/main/marketing/marketing-growth-hacker.md)
- [Content Creator](https://github.com/msitarzewski/agency-agents/blob/main/marketing/marketing-content-creator.md)
- [Sales Outreach](https://github.com/msitarzewski/agency-agents/blob/main/specialized/sales-outreach.md)
- [Offer & Lead Gen Strategist](https://github.com/msitarzewski/agency-agents/blob/main/sales/sales-offer-lead-gen-strategist.md)
- [Email Marketing Strategist](https://github.com/msitarzewski/agency-agents/blob/main/marketing/marketing-email-strategist.md)
- [Frontend Developer](https://github.com/msitarzewski/agency-agents/blob/main/engineering/engineering-frontend-developer.md)
- [Backend Architect](https://github.com/msitarzewski/agency-agents/blob/main/engineering/engineering-backend-architect.md)
