exports.handler = async function() {
  const appId = process.env.ONESIGNAL_APP_ID || '';
  const apiKey = process.env.ONESIGNAL_APP_API_KEY || '';
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify({
      configured: Boolean(appId && apiKey),
      appId,
      externalId: 'vc-beauty-valeria'
    })
  };
};
