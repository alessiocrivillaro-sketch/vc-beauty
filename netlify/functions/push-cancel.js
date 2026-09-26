const { API_BASE, env, headers } = require('./_onesignal');

function reply(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) };
}
function providerMessage(data) {
  const messages = data?.errors || data?.error;
  return (Array.isArray(messages) ? messages.filter(x => typeof x === 'string').join(' ') : typeof messages === 'string' ? messages : '').slice(0, 350);
}
function missingNotification(response, data) {
  // A missing app, an HTML 404 and authentication errors are not evidence that this message is gone.
  return response.status === 404 && /^Notification not found\.?$/i.test(providerMessage(data).trim());
}
async function callOneSignal(url, method, apiKey) {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 7000);
  try {
    const response = await fetch(url, { method, headers: headers(apiKey), signal: abort.signal });
    const data = await response.json().catch(() => ({}));
    return { response, data };
  } finally { clearTimeout(timer); }
}
function failure(response, data) {
  const code = response.status;
  let error = 'OneSignal non ha confermato la cancellazione del promemoria.';
  if (code === 401 || code === 403) error = 'OneSignal rifiuta le credenziali. Controlla App ID e chiave API su Netlify.';
  else if (code === 429) error = 'OneSignal ha ricevuto troppe richieste. Attendi un minuto e riprova.';
  else if (code >= 500) error = 'OneSignal è temporaneamente non disponibile. Riprova tra poco.';
  const detail = providerMessage(data);
  return reply(response.ok ? 502 : code, { success: false, error: `${error} (HTTP ${code})${detail ? ' '+detail : ''}` });
}

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return reply(405, { success: false, error: 'Method not allowed' });
  }
  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return reply(400, { success: false, error: 'Invalid JSON' }); }
  const id = body?.id;
  if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return reply(400, { success: false, error: 'Invalid notification id' });
  }
  try {
    const { appId, apiKey } = env();
    const url = `${API_BASE}/${encodeURIComponent(id)}?app_id=${encodeURIComponent(appId)}`;
    const { response, data } = await callOneSignal(url, 'DELETE', apiKey);
    if (response.ok && data.success === true) return reply(200, { success: true, outcome: 'canceled' });
    if (missingNotification(response, data)) return reply(200, { success: true, outcome: 'not_found' });

    // OneSignal rejects cancellation of completed messages with HTTP 400.
    // Verify their actual state before removing a saved ID; never swallow a generic 400.
    if (response.status === 400 || (response.ok && data.success === false)) {
      const checked = await callOneSignal(url, 'GET', apiKey);
      if (missingNotification(checked.response, checked.data)) return reply(200, { success: true, outcome: 'not_found' });
      const message = checked.data;
      if (checked.response.ok && message.id === id && (!message.app_id || message.app_id === appId)) {
        if (message.canceled === true) return reply(200, { success: true, outcome: 'already_canceled' });
        if (typeof message.completed_at === 'number' && Number.isFinite(message.completed_at) && message.completed_at > 0) {
          return reply(200, { success: true, outcome: 'completed' });
        }
      }
      if (!checked.response.ok) return failure(checked.response, checked.data);
    }
    return failure(response, data);
  } catch (e) {
    return reply(e.name === 'AbortError' ? 504 : 500, {
      success: false,
      error: e.name === 'AbortError' ? 'OneSignal non ha risposto in tempo. Riprova tra poco.' : 'Cancellazione non riuscita. Controlla la connessione del server e le variabili OneSignal su Netlify.'
    });
  }
};
