import { json, validSameOrigin, underRateLimit, validateTurnstile } from '../_lib/security.js';

const textField = (value, max) => typeof value === 'string' ? value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').slice(0, max) : '';

export async function onRequestPost({ request, env }) {
  if (!validSameOrigin(request)) return json({ error: 'Origin not allowed.' }, 403);
  if (!env.DB) return json({ error: 'Lead intake is not configured yet.' }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }

  // Quietly accept the honeypot to avoid revealing anti-spam rules.
  if (textField(body?.website, 200)) return json({ ok: true, message: 'Thanks. Your request has been received.' }, 202);

  const name = textField(body?.name, 100);
  const company = textField(body?.company, 140);
  const email = textField(body?.email, 254).toLowerCase();
  const phone = textField(body?.contact, 40);
  const volume = textField(body?.volume, 40);
  const preferred = textField(body?.preferred, 20);
  const problem = textField(body?.message, 2000);
  const consent = body?.consent === true;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !company || !emailOk || !problem || !consent) {
    return json({ error: 'Please check the required fields and consent checkbox.' }, 400);
  }
  if (!(await underRateLimit(request, env, 'lead', 5, 3600))) return json({ error: 'Too many submissions. Please try again later.' }, 429);
  if (!(await validateTurnstile(body?.turnstileToken, request, env))) {
    return json({ error: 'The anti-spam check was not verified. Please retry or use the email draft option.' }, 403);
  }

  try {
    const createdAt = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO leads (name, company, email, phone, monthly_volume, preferred, problem, consent_contact, source, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'website', ?)`
    ).bind(name, company, email, phone, volume, preferred, problem, createdAt).run();

    // Optional notification to a webhook you control. The receiver should verify the HMAC
    // and timestamp before creating tasks or sending any customer-facing message.
    if (env.LEAD_WEBHOOK_URL && env.WEBHOOK_SECRET) {
      try {
        const webhookUrl = new URL(env.LEAD_WEBHOOK_URL);
        if (webhookUrl.protocol === 'https:') {
          const timestamp = String(Math.floor(Date.now() / 1000));
          const payload = JSON.stringify({ event: 'lead.created', timestamp, lead: { name, company, email, phone, monthlyVolume: volume, preferred, problem, createdAt } });
          const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
          const signatureBytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${payload}`));
          const signature = [...new Uint8Array(signatureBytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');
          await fetch(webhookUrl.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-RelayGrid-Timestamp': timestamp, 'X-RelayGrid-Signature': `sha256=${signature}` },
            body: payload,
            signal: AbortSignal.timeout(2500)
          });
        }
      } catch {
        // Do not fail an already-stored enquiry when the optional notification service fails.
      }
    }
    return json({ ok: true, message: 'Thanks. Your request has been received. We will review it before responding.' }, 201);
  } catch {
    return json({ error: 'The request could not be saved. Please use the email draft option.' }, 500);
  }
}
