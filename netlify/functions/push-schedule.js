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

    const payload = {
      app_id: appId,
      target_channel: 'push',
      include_aliases: { external_id: [externalId] },
      headings: { en: title, it: title },
      contents: { en: message, it: message },
      ...(sendAfter ? { send_after: sendAfter } : {}),
      ...(url ? { url } : {}),
      ...(idempotencyKey ? { idempotency_key: idempotencyKey } : {})
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
