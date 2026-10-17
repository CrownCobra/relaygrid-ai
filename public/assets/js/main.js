(() => {
  const config = window.RELAY_CONFIG || {};
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  document.querySelectorAll('[data-brand]').forEach(el => el.textContent = config.brandName || 'RelayGrid AI');
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open'); toggle.setAttribute('aria-expanded','false');
    }));
  }
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === current || (current === '' && href === 'index.html')) a.setAttribute('aria-current','page');
  });
  const bookingLinks = document.querySelectorAll('[data-booking]');
  bookingLinks.forEach(link => {
    if (config.bookingUrl) link.href = config.bookingUrl;
    else link.href = 'contact.html?topic=workflow%20audit';
  });
  document.querySelectorAll('[data-whatsapp]').forEach(link => {
    if (config.whatsappNumber) {
      link.href = `https://wa.me/${String(config.whatsappNumber).replace(/\D/g,'')}`;
      link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.classList.remove('is-unconfigured');
    } else {
      link.href = 'contact.html';
      link.title = 'Add your WhatsApp number in assets/js/config.js to activate this shortcut';
    }
  });
  const observer = ('IntersectionObserver' in window) ? new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, {threshold: .08}) : null;
  document.querySelectorAll('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('visible'));

  document.querySelectorAll('.faq-q').forEach(button => button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const opening = !item.classList.contains('open');
    item.classList.toggle('open', opening);
    button.setAttribute('aria-expanded', String(opening));
  }));

  // Keep Netlify Forms in demo mode until a synthetic submission is verified.
  const contactSetupNote = document.querySelector('#contact-setup-note');
  if (contactSetupNote) {
    contactSetupNote.hidden = config.netlifyFormsConfigured === true;
  }

  // One enquiry workflow: classify, draft, then record the follow-up in Netlify Forms.
  const form = document.querySelector('#contact-form');
  if (form) {
    const status = document.querySelector('#form-status');
    const output = document.querySelector('#workflow-output');
    const challengeContainer = form.querySelector('#turnstile-container');
    let turnstileToken = '';
    let turnstileWidgetId = null;
    if (config.turnstileSiteKey && challengeContainer) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true; script.defer = true;
      script.onload = () => {
        if (!window.turnstile) return;
        turnstileWidgetId = window.turnstile.render(challengeContainer, {
          sitekey: config.turnstileSiteKey,
          callback: token => { turnstileToken = token; },
          'expired-callback': () => { turnstileToken = ''; },
          'error-callback': () => { turnstileToken = ''; }
        });
      };
      script.onerror = () => { if (status) status.textContent = 'Anti-spam verification could not load. Please try again later.'; };
      document.head.appendChild(script);
    } else if (challengeContainer) challengeContainer.hidden = true;

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const company = String(data.get('company') || '').trim();
      const email = String(data.get('email') || '').trim();
      const message = String(data.get('message') || '').trim();
      const website = String(data.get('website') || '').trim();
      if (website) return;
      if (status) status.textContent = 'Checking the enquiry and preparing a draft…';
      let workflow;
      try {
        const response = await fetch('/api/lead-workflow', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, company, email, message, website, consent: data.get('consent') === 'on', turnstileToken }),
          signal: AbortSignal.timeout(15000)
        });
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || 'Workflow is unavailable');
        workflow = result;
      } catch (error) {
        if (status) status.textContent = error.message || 'Workflow is unavailable. Your details were not recorded.';
        return;
      }

      const fields = {
        'form-name': 'relaygrid-enquiry',
        name,
        company,
        email,
        contact: String(data.get('contact') || '').trim(),
        volume: String(data.get('volume') || 'Not sure'),
        preferred: String(data.get('preferred') || 'email'),
        message,
        consent: 'yes',
        classification: workflow.category,
        urgency: workflow.urgency,
        summary: workflow.summary,
        response_draft: workflow.responseDraft,
        workflow_mode: workflow.mode,
        follow_up_status: 'Needs human review',
        website: ''
      };
      try {
        const stored = await fetch('/contact.html', {
          method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(fields).toString(), signal: AbortSignal.timeout(10000)
        });
        if (!stored.ok) throw new Error('Netlify did not accept the enquiry record.');
        if (output) {
          output.hidden = false;
          output.querySelector('[data-workflow-category]').textContent = workflow.category.replaceAll('-', ' ');
          output.querySelector('[data-workflow-urgency]').textContent = workflow.urgency;
          output.querySelector('[data-workflow-mode]').textContent = 'Rule-based demo';
          output.querySelector('[data-response-draft]').value = workflow.responseDraft;
        }
        if (status) status.textContent = 'Submission request returned successfully. Verify it appears in your Netlify Forms tab before using this with real enquiries.';
        form.reset();
        turnstileToken = '';
        if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
      } catch (error) {
        if (status) status.textContent = `${error.message} Your details were not confirmed as recorded.`;
      }
    });
  }
  // Editable, scenario-based ROI calculator. Outputs are arithmetic, not promised results.
  const calc = document.querySelector('#roi-calculator-fields');
  if (calc) {
    const fields = ['leads','missed','recoverable','closeRate','profit','monthlyCost'];
    const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Number.isFinite(n) ? n : 0);
    const update = () => {
      const v = {};
      fields.forEach(key => { const el = calc.querySelector(`[name="${key}"]`); v[key] = el ? Math.max(0, Number(el.value) || 0) : 0; });
      const atRisk = v.leads * v.missed / 100;
      const recovered = atRisk * v.recoverable / 100;
      const jobs = recovered * v.closeRate / 100;
      const contribution = jobs * v.profit;
      const net = contribution - v.monthlyCost;
      const out = (id, value) => { const el = document.querySelector(id); if (el) el.textContent = value; };
      out('#calc-risk', atRisk.toFixed(1)); out('#calc-recovered', recovered.toFixed(1));
      out('#calc-jobs', jobs.toFixed(2)); out('#calc-contribution', money(contribution));
      out('#calc-net', money(net));
    };
    fields.forEach(key => { const el = calc.querySelector(`[name="${key}"]`); if (el) el.addEventListener('input', update); });
    update();
  }
})();
