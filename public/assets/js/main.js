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

  // Make incomplete contact routing visible; never imply an enquiry was delivered.
  const contactSetupNote = document.querySelector('#contact-setup-note');
  if (contactSetupNote) {
    const emailConfigured = typeof config.contactEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail);
    const phoneConfigured = typeof config.whatsappNumber === 'string' && config.whatsappNumber.replace(/\D/g, '').length >= 8;
    const secureIntakeConfigured = Boolean(config.apiContactEnabled && config.turnstileSiteKey);
    contactSetupNote.hidden = emailConfigured || phoneConfigured || secureIntakeConfigured;
  }

  // Secure server intake is enabled only when both sides of Turnstile are configured.
  // Otherwise the visitor can prepare and send a message with their own email/WhatsApp app.
  const form = document.querySelector('#contact-form');
  if (form) {
    const status = document.querySelector('#form-status');
    const params = new URLSearchParams(location.search);
    const topic = params.get('topic');
    const message = form.querySelector('[name="message"]');
    const challengeContainer = form.querySelector('#turnstile-container');
    let turnstileToken = '';
    let turnstileWidgetId = null;
    if (topic && message && !message.value) message.value = `I'm interested in: ${topic.replace(/\+/g,' ')}.\n\nPlease share the next steps.`;

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
      script.onerror = () => { if (status) status.textContent = 'Anti-spam verification could not load. You can still prepare an email draft.'; };
      document.head.appendChild(script);
    } else if (challengeContainer) {
      challengeContainer.hidden = true;
    }

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const company = String(data.get('company') || '').trim();
      const email = String(data.get('email') || '').trim();
      const contact = String(data.get('contact') || '').trim();
      const problem = String(data.get('message') || '').trim();
      const volume = String(data.get('volume') || 'Not specified');
      const preference = String(data.get('preferred') || 'email');
      const body = `Name: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone / WhatsApp: ${contact}\nMonthly enquiries: ${volume}\n\nWorkflow issue:\n${problem}\n\nSent from the RelayGrid AI website.`;

      if (config.apiContactEnabled && config.turnstileSiteKey) {
        if (!turnstileToken) {
          if (status) status.textContent = 'Complete the anti-spam verification before secure submission, or use the email draft option.';
          return;
        }
        if (status) status.textContent = 'Submitting securely…';
        try {
          const response = await fetch('/api/leads', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, company, email, contact, volume, preferred: preference, message: problem, website: String(data.get('website') || ''), consent: data.get('consent') === 'on', turnstileToken }),
            signal: AbortSignal.timeout(10000)
          });
          const result = await response.json();
          if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to save enquiry');
          if (status) status.textContent = result.message || 'Thanks. Your request has been received.';
          form.reset(); turnstileToken = '';
          if (window.turnstile && turnstileWidgetId !== null) window.turnstile.reset(turnstileWidgetId);
          return;
        } catch {
          if (status) status.textContent = 'Secure submission is unavailable. Preparing a message draft instead; review and send it yourself.';
        }
      }

      if (preference === 'whatsapp' && config.whatsappNumber) {
        const url = `https://wa.me/${String(config.whatsappNumber).replace(/\D/g,'')}?text=${encodeURIComponent(body)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        if (status) status.textContent = 'WhatsApp opened with your message. Review it and tap Send in WhatsApp.';
        return;
      }
      if (config.contactEmail && config.contactEmail.includes('@')) {
        const mailto = `mailto:${encodeURIComponent(config.contactEmail)}?subject=${encodeURIComponent(`Workflow audit enquiry — ${company || name}`)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
        if (status) status.textContent = 'Your email app should open with the enquiry filled in. Review it and press Send.';
      } else if (config.whatsappNumber) {
        const url = `https://wa.me/${String(config.whatsappNumber).replace(/\D/g,'')}?text=${encodeURIComponent(body)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        if (status) status.textContent = 'WhatsApp opened with your message. Review it and tap Send in WhatsApp.';
      } else {
        if (status) status.textContent = 'Site setup needed: add a real contactEmail or whatsappNumber in assets/js/config.js before publishing.';
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
