# Netlify deployment checklist

## Set up the existing site

- [ ] Confirm the existing Netlify site is connected to the intended GitHub repository and branch.
- [ ] Keep the build command empty and publish directory set to `public`; `netlify.toml` includes the function path and API route.
- [ ] Enable Netlify Forms form detection, then deploy.
- [ ] Leave all model-provider keys and other secrets unset. The lead workflow uses rules-based classification and drafting with no AI key.
- [ ] Do not add billing details or upgrade a plan for this demo.
- [ ] Check the existing team's plan and Forms usage before accepting real enquiries. Netlify has different limits for older and newer free accounts; stop if the dashboard shows a charge, usage-level upgrade, or payment prompt.
- [ ] Submit synthetic data and confirm the page displays the result and the submission appears in the Netlify Forms tab.
- [ ] Review each submission manually. Configure Netlify email notifications only if you want an alert; no reply is sent automatically.

## Before sharing with real prospects

- [ ] Add the actual operator identity and monitored contact information to the site.
- [ ] Replace the privacy notice placeholders and define who can access submissions and when they will be deleted.
- [ ] Confirm no API keys, credentials, test customer records, or private exports are tracked in Git.
- [ ] Check the applicable Netlify plan and form limits in the account before collecting real enquiries.

## Rollback

Use Netlify's deploy history to restore the previous successful deploy if a change causes a problem. Check new form submissions manually during the first demonstration.
