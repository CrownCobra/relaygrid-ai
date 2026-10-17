# Agent Workspace update: what changed and what is real

## What is new
- The homepage now has an Agent Workspace with five role cards and a clickable workflow simulation.
- The animation uses fictional sample text in the browser only. It does not use an AI model, call an API, contact prospects, send messages, book meetings, access a CRM, or save lead data.
- The chat opening message tells visitors that the live AI backend is not connected.
- The Contact page shows a setup notice while the email/WhatsApp destinations and secure intake are not configured.
- Added navigation/footer links to the Agent Workspace.

## To deploy the update
1. Extract this project over the existing local `relaygrid-ai` repository folder, allowing the `public` files to be overwritten. Do not delete or replace the existing `.git` folder.
2. Open GitHub Desktop. Review the changed files, then commit the update and push to `main`.
3. Netlify should deploy the new static site from the `public` directory. Test the homepage, Agent demo, chat opening message, and Contact page after deployment.

## Before accepting real customer enquiries
- Configure a monitored business email or WhatsApp number in `public/assets/js/config.js`, or build and test a secure form backend.
- The API functions under `functions/` use Cloudflare Pages runtime and bindings. They are not Netlify Functions and do not run just because `public/` is published by Netlify.
- Connect and test a real AI provider and only the specific tools the agent needs. Keep keys server-side. Test human approval and failure paths before enabling messages, calls, CRM writes, or storage.
- Review privacy wording and all third-party usage/limits before storing real data.
