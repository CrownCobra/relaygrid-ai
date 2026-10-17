import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../public/assets/js/main.js', import.meta.url), 'utf8');
function setup(fetch) {
  const listeners = {};
  const button = { disabled: true };
  const status = { textContent: '' };
  const parts = Object.fromEntries(['category', 'urgency', 'mode', 'reference'].map(x => [`[data-workflow-${x}]`, {}]));
  parts['[data-response-draft]'] = {};
  const output = { hidden: true, querySelector: s => parts[s] };
  const form = { reportValidity: () => true, querySelector: () => button, addEventListener: (name, cb) => { listeners[name] = cb; }, reset: () => { throw new Error('Must retain details'); } };
  const nodes = { '#contact-form': form, '#form-status': status, '#workflow-output': output };
  const values = { name: 'Example Operator', company: 'Example Solar', email: 'operator@example.com', message: 'Need a quote', consent: 'on' };
  vm.runInNewContext(source, {
    window: { RELAY_CONFIG: {} }, location: { pathname: '/contact' },
    document: { querySelectorAll: () => [], querySelector: s => nodes[s] },
    FormData: class { get(key) { return values[key] || ''; } },
    fetch, AbortSignal, URLSearchParams, Date
  });
  return { submit: () => listeners.submit({ preventDefault() {} }), button, output, status, parts };
}
const workflow = { ok: true, category: 'quote-follow-up', urgency: 'normal', mode: 'rules', responseDraft: 'Draft for human review', reference: 'synthetic-reference', record: { 'form-name': 'relaygrid-enquiry', reference: 'synthetic-reference' } };
const accepted = () => ({ ok: true, json: async () => workflow });
test('classification failure never submits to Forms', async () => {
  let calls = 0;
  const ui = setup(async () => { calls++; throw new Error('Unavailable'); });
  await ui.submit();
  assert.equal(calls, 1);
  assert.equal(ui.output.hidden, true);
  assert.equal(ui.button.disabled, false);
});
test('Forms failure preserves useful draft and reference', async () => {
  let calls = 0;
  const ui = setup(async () => ++calls === 1 ? accepted() : { ok: false });
  await ui.submit();
  assert.equal(ui.output.hidden, false);
  assert.equal(ui.parts['[data-response-draft]'].value, workflow.responseDraft);
  assert.equal(ui.parts['[data-workflow-reference]'].textContent, workflow.reference);
  assert.match(ui.status.textContent, /Storage is unconfirmed/);
  assert.equal(ui.button.disabled, false);
});
test('HTML 200 remains unverified and repeat clicks are suppressed', async () => {
  let calls = 0;
  const ui = setup(async (url, options) => {
    calls++;
    if (calls === 1) return accepted();
    assert.equal(url, '/contact');
    assert.equal(new URLSearchParams(options.body).get('reference'), workflow.reference);
    return { ok: true }; // A static HTML 200 is NOT proof of storage.
  });
  const first = ui.submit();
  await ui.submit();
  await first;
  await ui.submit();
  assert.equal(calls, 2);
  assert.equal(ui.output.hidden, false);
  assert.match(ui.status.textContent, /storage is unverified/);
  assert.equal(ui.button.disabled, true);
});
