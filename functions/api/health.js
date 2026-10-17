import { json } from '../_lib/security.js';

export async function onRequestGet({ env }) {
  return json({
    ok: true,
    service: 'relaygrid-api',
    chatConfigured: Boolean(env.AI),
    leadStorageConfigured: Boolean(env.DB),
    leadChallengeConfigured: Boolean(env.TURNSTILE_SECRET)
  });
}
