const { randomUUID } = require('crypto');
const { API_BASE, env, headers } = require('./_onesignal');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  try {
    const { appId, apiKey } = env();
    const body = JSON.parse(event.body || '{}');
    const { title, message, sendAfter, externalId, url, idempotencyKey } = body;
    if (!title || !message || !externalId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    // OneSignal accepts idempotency_key only as a UUID. Older VC Beauty builds
    // sent readable strings such as "test-123...". Generate a valid UUID
    // whenever the incoming value is missing or is not already a UUID.
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const safeIdempotencyKey = (typeof idempotencyKey === 'string' && uuidRe.test(idempotencyKey))
      ? idempotencyKey
      : randomUUID();

    const payload = {
      app_id: appId,
      target_channel: 'push',
      include_aliases: { external_id: [externalId] },
      headings: { en: title, it: title },
      contents: { en: message, it: message },
      ...(sendAfter ? { send_after: sendAfter } : {}),
      ...(url ? { url } : {}),
      idempotency_key: safeIdempotencyKey
    };

    const resp = await fetch(API_BASE, {
      method: 'POST',
      headers: headers(apiKey),
      body: JSON.stringify(payload)
    });
    const data = await resp.json().catch(() => ({}));
    return {
      statusCode: resp.ok ? 200 : resp.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resp.ok ? data : { error: data.errors || data.error || 'OneSignal error', details: data })
    };
  } catch (e) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: e.message }) };
  }
};
