import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../netlify/functions/lead-workflow.mjs';
const origin = 'https://relaygrid-ai.netlify.app';
const valid = { name: 'Sample Operator', company: 'Example Solar', email: 'operator@example.com', message: 'Our quotes need a follow-up owner today.', consent: true };
const request = (data = valid, options = {}) => new Request(`${origin}/api/lead-workflow`, {
  method: 'POST', headers: { origin, 'content-type': 'application/json', ...options.headers },
  body: options.raw ?? JSON.stringify(data)
});

test('classifies and returns a canonical, unrecorded draft without network calls', async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('External network is forbidden'); };
  try {
    const response = await handler(request({ ...valid, email: ' Operator@Example.COM ' }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const result = await response.json();
    assert.equal(result.category, 'quote-follow-up');
    assert.equal(result.urgency, 'high');
    assert.equal(result.mode, 'rules');
    assert.equal(result.recorded, false);
    assert.equal(result.record.email, 'operator@example.com');
    assert.equal(result.record.reference, result.reference);
    assert.match(result.responseDraft, /Draft for human review/);
  } finally { globalThis.fetch = previous; }
});
for (const [message, category] of [['Arrange a site survey', 'site-visit'], ['We missed an enquiry', 'missed-enquiries'], ['Explain this template', 'other'], ['Need pricing', 'quote-follow-up']]) {
  test(`classifies ${category}: ${message}`, async () => {
    const result = await (await handler(request({ ...valid, message }))).json();
    assert.equal(result.category, category);
  });
}
for (const changes of [
  { consent: false }, { consent: 'true' }, { name: '' }, { company: ' ' }, { email: 'invalid' },
  { message: '' }, { name: 'x'.repeat(101) }, { message: 'x'.repeat(2001) }, { company: {} },
  { email: 'x'.repeat(255) }, { website: 'spam' }, { contact: 'javascript:alert(1)' },
  { contact: 'x'.repeat(41) }, { volume: 'unlisted' }, { preferred: 'sms' }, { preferred: 'whatsapp' },
  { message: 'bad\u0000text' }
]) {
  test(`rejects invalid ${Object.keys(changes)[0]} (${JSON.stringify(changes).length})`, async () => {
    assert.equal((await handler(request({ ...valid, ...changes }))).status, 400);
  });
}
test('accepts bounded optional contact and preference', async () => {
  assert.equal((await handler(request({ ...valid, contact: '+91 90000 00000', preferred: 'whatsapp', volume: '20–50' }))).status, 200);
});
for (const raw of ['null', '[]', '1', '{']) {
  test(`rejects non-object or malformed JSON ${raw}`, async () => assert.equal((await handler(request(valid, { raw }))).status, 400));
}
test('bounds actual streamed request bytes', async () => assert.equal((await handler(request(valid, { raw: 'x'.repeat(16001) }))).status, 413));
test('rejects missing or cross-site origins', async () => {
  for (const value of ['', 'null', 'https://evil.example']) assert.equal((await handler(request(valid, { headers: { origin: value } }))).status, 403);
});
test('requires POST and JSON', async () => {
  assert.equal((await handler(new Request(`${origin}/api/lead-workflow`))).status, 405);
  assert.equal((await handler(request(valid, { headers: { 'content-type': 'text/plain' } }))).status, 415);
});
