(() => {
  if (document.getElementById('rg-chat-launcher')) return;
  const style = document.createElement('link');
  style.rel = 'stylesheet'; style.href = 'assets/css/chat-widget.css'; document.head.appendChild(style);

  const launcher = document.createElement('button');
  launcher.id = 'rg-chat-launcher'; launcher.className = 'rg-chat-launcher'; launcher.type = 'button';
  launcher.textContent = 'Ask RelayGrid AI'; launcher.setAttribute('aria-expanded', 'false'); launcher.setAttribute('aria-controls', 'rg-chat-panel');
  const panel = document.createElement('section'); panel.id = 'rg-chat-panel'; panel.className = 'rg-chat-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'RelayGrid AI assistant');
  panel.innerHTML = '<header class="rg-chat-head"><div><strong>RelayGrid AI assistant</strong><small>Rules-based FAQ demo · no live AI</small></div><button class="rg-chat-close" type="button" aria-label="Close chat">×</button></header><div class="rg-chat-messages" aria-live="polite" aria-relevant="additions text"></div><form class="rg-chat-form"><label for="rg-chat-input" class="sr-only" style="position:absolute;left:-9999px">Your message</label><input class="rg-chat-input" id="rg-chat-input" name="message" maxlength="1200" autocomplete="off" placeholder="Ask about the pilot…" required><button class="rg-chat-send" type="submit">Send</button></form>';
  document.body.append(launcher, panel);
  const messagesEl = panel.querySelector('.rg-chat-messages');
  const form = panel.querySelector('form');
  const input = panel.querySelector('input');
  const close = panel.querySelector('.rg-chat-close');

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
    return 'I can explain the workflow, the proposed pilot, or privacy and security basics. For a custom request, please use the Contact page. This is a preset FAQ response; no live AI is connected.';
  }

  function open() { panel.classList.add('is-open'); launcher.setAttribute('aria-expanded', 'true'); input.focus(); if (!messagesEl.children.length) { addMessage('assistant', 'Hi! This is a local FAQ demo with preset replies. No live AI model processes your message.'); addMessage('assistant', 'Chat messages stay in this page and disappear when you reload. Use the Contact page to prepare an enquiry for human follow-up.', true); } }
  function shut() { panel.classList.remove('is-open'); launcher.setAttribute('aria-expanded', 'false'); launcher.focus(); }
  launcher.addEventListener('click', () => panel.classList.contains('is-open') ? shut() : open()); close.addEventListener('click', shut);
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && panel.classList.contains('is-open')) shut(); });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    addMessage('user', message);
    input.value = '';
    addMessage('assistant', fallback(message));
    input.focus();
  });
})();
