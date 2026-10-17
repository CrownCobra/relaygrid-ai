export function json(data, status = 200, extraHeaders = {}) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders
    }
  });
}

export function validSameOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return true; // Non-browser requests still require rate limits and validation.
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

async function hash(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Stores a salted digest, not the raw visitor IP. Apply provider-level rate limits too.
export async function underRateLimit(request, env, action, limit, windowSeconds = 60) {
  if (!env.DB) return false;
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const salt = env.RATE_LIMIT_SALT || 'replace-this-salt-before-production';
  const key = (await hash(`${salt}:${action}:${ip}`)).slice(0, 48);
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSeconds);
  const row = await env.DB.prepare(
    'SELECT hits, window_start FROM rate_limits WHERE rate_key = ? AND action = ?'
  ).bind(key, action).first();

  if (row && row.window_start === windowStart && row.hits >= limit) return false;
  if (row && row.window_start === windowStart) {
    await env.DB.prepare(
      'UPDATE rate_limits SET hits = hits + 1, updated_at = ? WHERE rate_key = ? AND action = ?'
    ).bind(now, key, action).run();
  } else {
    await env.DB.prepare(
      `INSERT INTO rate_limits (rate_key, action, hits, window_start, updated_at)
       VALUES (?, ?, 1, ?, ?)
       ON CONFLICT(rate_key, action) DO UPDATE SET hits = 1, window_start = excluded.window_start, updated_at = excluded.updated_at`
    ).bind(key, action, windowStart, now).run();
  }
  return true;
}

export async function validateTurnstile(token, request, env) {
  if (!env.TURNSTILE_SECRET) {
    return env.ENVIRONMENT !== 'production' && env.ALLOW_UNVERIFIED_LEADS === 'true';
  }
  if (typeof token !== 'string' || token.length < 10 || token.length > 2048) return false;
  const form = new URLSearchParams();
  form.set('secret', env.TURNSTILE_SECRET);
  form.set('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) form.set('remoteip', ip);
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) return false;
    const result = await response.json();
    const host = new URL(request.url).hostname;
    return result.success === true && (!result.hostname || result.hostname === host);
  } catch {
    return false;
  }
}
