function json(data, status = 200) { return new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
}); }
function demoWorkflow(problem, name) {
  const words = problem.toLowerCase();
  const category = /\b(quotes?|quotations?|proposals?|estimates?|prices?|pricing)\b/.test(words) ? 'quote-follow-up'
    : /\b(visits?|surveys?|site|inspections?)\b/.test(words) ? 'site-visit'
      : /\b(missed|slow|late|unanswered|no response|forgot|follow[ -]?up)\b/.test(words) ? 'missed-enquiries' : 'other';
  const urgency = /\b(urgent|asap|today|immediately)\b/.test(words) ? 'high' : 'normal';
  const summary = problem.length > 240 ? `${problem.slice(0, 237)}...` : problem;
  return {
    category,
    urgency,
    summary,
    responseDraft: `Hi ${name},\n\nThanks for reaching out to RelayGrid AI. I understand that ${summary.charAt(0).toLowerCase()}${summary.slice(1)} We can review how this enquiry or follow-up step currently works and suggest a small, measurable next step.\n\nWould you be open to a short conversation about your current process?\n\nRegards,\nRelayGrid AI team\n\nDraft for human review.`,
    mode: 'rules'
  };
}

export default async request => {
  if (request.method !== 'POST') return json({ error: 'Use POST.' }, 405);
  const origin = request.headers.get('origin');
  try {
    if (!origin || new URL(origin).origin !== new URL(request.url).origin) return json({ error: 'Origin not allowed.' }, 403);
  } catch { return json({ error: 'Origin not allowed.' }, 403); }
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    return json({ error: 'Use application/json.' }, 415);
  }
  // Bound the actual request stream; never log enquiry data.
  const reader = request.body?.getReader();
  if (!reader) return json({ error: 'Enquiry body is required.' }, 400);
  let raw = '';
  let size = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16000) {
        await reader.cancel();
        return json({ error: 'Enquiry is too large.' }, 413);
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
  } catch { return json({ error: 'Could not read the enquiry. Please retry.' }, 400); }
  let body;
  try { body = JSON.parse(raw); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ error: 'Invalid enquiry.' }, 400);
  const limits = { name: 100, company: 140, email: 254, message: 2000, contact: 40, volume: 20, preferred: 20, website: 160 };
  const fields = {};
  for (const [key, max] of Object.entries(limits)) {
    const value = body[key] ?? '';
    if (typeof value !== 'string' || value.length > max || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value)) {
      return json({ error: `Please check ${key}; maximum length is ${max} characters.` }, 400);
    }
    fields[key] = value.trim();
  }
  if (fields.website) return json({ error: 'Enquiry could not be accepted.' }, 400);
  const { name, company, message, contact } = fields;
  const email = fields.email.toLowerCase();
  const volume = fields.volume || 'Not sure';
  const preferred = fields.preferred || 'email';
  if (!name || !company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || body.consent !== true ||
      (contact && !/^[+\d\s().-]{7,40}$/.test(contact)) ||
      !['Not sure', 'Under 20', '20–50', '51–150', '151–500', '500+'].includes(volume) ||
      !['email', 'whatsapp'].includes(preferred) || (preferred === 'whatsapp' && !contact)) {
    return json({ error: 'Check required fields, phone, hand-off preference and consent. WhatsApp preference needs a phone number.' }, 400);
  }
  const workflow = demoWorkflow(message, name);
  const reference = crypto.randomUUID();
  const record = {
    'form-name': 'relaygrid-enquiry', name, company, email, contact, volume, preferred, message,
    consent: 'yes', classification: workflow.category, urgency: workflow.urgency,
    summary: workflow.summary, response_draft: workflow.responseDraft, workflow_mode: workflow.mode,
    follow_up_status: 'Needs human review', reference, website: ''
  };
  return json({ ok: true, ...workflow, reference, record, recorded: false, followUpStatus: record.follow_up_status });
};
