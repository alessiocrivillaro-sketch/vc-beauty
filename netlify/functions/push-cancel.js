const { API_BASE, env, headers } = require('./_onesignal');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  try {
    const { appId, apiKey } = env();
    const body = JSON.parse(event.body || '{}');
    const id = body.id;
    if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'Missing notification id' }) };

    const resp = await fetch(`${API_BASE}/${encodeURIComponent(id)}?app_id=${encodeURIComponent(appId)}`, {
      method: 'DELETE',
      headers: headers(apiKey)
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
