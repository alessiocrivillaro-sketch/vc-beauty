const API_BASE = 'https://api.onesignal.com/notifications';

function env() {
  const appId = process.env.ONESIGNAL_APP_ID;
  const apiKey = process.env.ONESIGNAL_APP_API_KEY;
  if (!appId || !apiKey) throw new Error('OneSignal environment variables missing');
  return { appId, apiKey };
}

function headers(apiKey) {
  return {
    'Authorization': `Key ${apiKey}`,
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json'
  };
}

module.exports = { API_BASE, env, headers };
