(() => {
  if (document.getElementById('rg-chat-launcher')) return;
  const config = window.RELAY_CONFIG || {};
  const style = document.createElement('link');
  style.rel = 'stylesheet'; style.href = 'assets/css/chat-widget.css'; document.head.appendChild(style);

  const launcher = document.createElement('button');
  launcher.id = 'rg-chat-launcher'; launcher.className = 'rg-chat-launcher'; launcher.type = 'button';
  launcher.textContent = 'Ask RelayGrid AI'; launcher.setAttribute('aria-expanded', 'false'); launcher.setAttribute('aria-controls', 'rg-chat-panel');
  const panel = document.createElement('section'); panel.id = 'rg-chat-panel'; panel.className = 'rg-chat-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'RelayGrid AI assistant');
  panel.innerHTML = '<header class="rg-chat-head"><div><strong>RelayGrid AI assistant</strong><small>AI assistant · not a human representative</small></div><button class="rg-chat-close" type="button" aria-label="Close chat">×</button></header><div class="rg-chat-messages" aria-live="polite" aria-relevant="additions text"></div><form class="rg-chat-form"><label for="rg-chat-input" class="sr-only" style="position:absolute;left:-9999px">Your message</label><input class="rg-chat-input" id="rg-chat-input" name="message" maxlength="1200" autocomplete="off" placeholder="Ask about the pilot…" required><button class="rg-chat-send" type="submit">Send</button></form>';
  document.body.append(launcher, panel);
  const messagesEl = panel.querySelector('.rg-chat-messages');
  const form = panel.querySelector('form');
  const input = panel.querySelector('input');
  const send = panel.querySelector('.rg-chat-send');
  const close = panel.querySelector('.rg-chat-close');
  const history = [];

  function addMessage(role, text, system = false) {
    const div = document.createElement('div'); div.className = `rg-chat-msg ${system ? 'system' : role}`;
    div.textContent = text; messagesEl.appendChild(div); messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function fallback(text) {
    const lower = text.toLowerCase();
    if (/price|cost|₹|pricing|month/.test(lower)) return 'Our proposed pilot is ₹4,999 for setup and ₹2,999/month for support, subject to scope. These are test prices, not a guaranteed quote. Use the Contact page to request a written scope.';
    if (/call|phone|voice/.test(lower)) return 'A consent-based voice assistant can be added for inbound calls or callbacks explicitly requested by a customer. Phone numbers, telephony services, compliance and usage can add costs.';
    if (/security|privacy|data/.test(lower)) return 'We aim to collect only the information needed, use server-side validation, keep API keys out of source code, and limit access. A production deployment still needs a security review and a completed privacy notice.';
    if (/demo|work|how|solar|lead|quote|visit|follow/.test(lower)) return 'RelayGrid helps rooftop-solar installers track enquiries, assign next actions, remind the team about site visits, and follow up on quotes. Start with the Contact page for a scoped workflow audit.';
    if (/human|person|real/.test(lower)) return 'I am an automated demo assistant, not a human salesperson. A person must review custom scopes, contracts and unusual requests.';
    return 'I can explain the workflow, the proposed pilot, or privacy and security basics. For a custom request, please use the Contact page. This response is running in demo mode until the AI backend is connected.';
  }

  function open() { panel.classList.add('is-open'); launcher.setAttribute('aria-expanded', 'true'); input.focus(); if (!messagesEl.children.length) { addMessage('assistant', 'Hi! I can explain our lead-follow-up workflow, pilot pricing, and next steps. What would you like to know?'); addMessage('assistant', 'This assistant does not send messages or book meetings on its own.', true); } }
  function shut() { panel.classList.remove('is-open'); launcher.setAttribute('aria-expanded', 'false'); launcher.focus(); }
  launcher.addEventListener('click', () => panel.classList.contains('is-open') ? shut() : open()); close.addEventListener('click', shut);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && panel.classList.contains('is-open')) shut(); });

  form.addEventListener('submit', async event => {
    event.preventDefault(); const message = input.value.trim(); if (!message) return;
    addMessage('user', message); input.value = ''; input.disabled = true; send.disabled = true; send.textContent = '…';
    let reply = '';
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, history: history.slice(-6) }), signal: AbortSignal.timeout(12000) });
      const result = await response.json();
      if (!response.ok || !result.reply) throw new Error('AI backend unavailable');
      reply = result.reply;
    } catch {
      reply = fallback(message);
      addMessage('assistant', 'Demo fallback — the live AI backend is not connected or temporarily unavailable.', true);
    }
    history.push({ role: 'user', content: message }, { role: 'assistant', content: reply });
    addMessage('assistant', reply);
    input.disabled = false; send.disabled = false; send.textContent = 'Send'; input.focus();
  });
})();
