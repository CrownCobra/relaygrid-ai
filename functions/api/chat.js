import { json, validSameOrigin, underRateLimit } from '../_lib/security.js';

const SYSTEM_PROMPT = `You are RelayGrid AI's website assistant. Be friendly, concise, honest, and useful. The agency is testing a service for small rooftop-solar installers: lead tracking, site-visit reminders, quote follow-up, and a simple operating report. Proposed pilot pricing may be discussed as a starting hypothesis only: ₹4,999 one-time setup and ₹2,999/month support, always subject to scope and confirmation. Never guarantee sales, revenue, conversion lifts, savings, or business success. Never invent clients, testimonials, certifications, case studies, or results. Do not pretend to be human; if asked, clearly say you are an AI assistant. Do not request passwords, payment details, government identifiers, customer lists, or confidential data. Do not claim you sent an email, booked a call, changed a workflow, issued an invoice, or took any external action. Direct interested people to the website contact form. Ask permission before requesting contact information. For complex pricing, legal, security, integrations, or contracts, say that a written scope and human review are needed. Do not agree to unsolicited automated calls or messages; support inbound enquiries and follow-ups people have explicitly requested. If the answer is not in the approved information, say so and suggest using the contact form. Keep answers under 120 words.`;

export async function onRequestPost({ request, env }) {
  if (!validSameOrigin(request)) return json({ error: 'Origin not allowed.' }, 403);
  if (!env.DB || !env.AI) return json({ error: 'The AI service is not configured yet.' }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON.' }, 400); }
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > 1200) return json({ error: 'Message must be between 1 and 1200 characters.' }, 400);
  if (!(await underRateLimit(request, env, 'chat', 20, 60))) return json({ error: 'Please wait a moment before sending another message.' }, 429);

  const history = Array.isArray(body?.history) ? body.history.slice(-6) : [];
  const safeHistory = [];
  for (const item of history) {
    if (!item || item.role !== 'user' || typeof item.content !== 'string') continue;
    const content = item.content.trim().slice(0, 1000);
    if (content) safeHistory.push({ role: item.role, content });
  }

  try {
    const result = await env.AI.run('@cf/meta/llama-3.2-3b-instruct', {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...safeHistory,
        { role: 'user', content: message }
      ],
      max_tokens: 240,
      temperature: 0.25
    });
    const reply = typeof result?.response === 'string' ? result.response.trim() : '';
    if (!reply) throw new Error('Empty model response');
    // Conversations are not written to D1 by this endpoint.
    return json({ reply, mode: 'ai' });
  } catch {
    return json({ error: 'The assistant is temporarily unavailable. Please use the contact form.' }, 502);
  }
}
