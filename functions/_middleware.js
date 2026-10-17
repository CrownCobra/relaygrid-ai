export async function onRequest(context) {
  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self' mailto: https://wa.me",
    "script-src 'self' https://cdn.jsdelivr.net https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://challenges.cloudflare.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://challenges.cloudflare.com",
    "connect-src 'self' https://challenges.cloudflare.com",
    "frame-src https://challenges.cloudflare.com",
    "upgrade-insecure-requests"
  ].join('; '));
  if (new URL(context.request.url).protocol === 'https:') {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
