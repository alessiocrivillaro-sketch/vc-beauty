# VC Beauty v2.2 — Push OneSignal + Netlify Functions

Questa versione contiene DAVVERO le Netlify Functions necessarie.

## File server inclusi
- `netlify/functions/push-config.js`
- `netlify/functions/push-schedule.js`
- `netlify/functions/push-cancel.js`
- `netlify/functions/_onesignal.js`
- `push/onesignal/OneSignalSDKWorker.js`
- `netlify.toml`

## Variabili Netlify richieste
- `ONESIGNAL_APP_ID`
- `ONESIGNAL_APP_API_KEY`

## Deploy
Per pubblicare anche le Functions usa GitHub collegato a Netlify oppure Netlify CLI.
Il drag-and-drop statico non è il metodo consigliato per questo pacchetto.

### Netlify CLI
1. Installa Node.js.
2. `npm install -g netlify-cli`
3. Apri il terminale nella cartella del progetto.
4. `netlify login`
5. `netlify link`
6. `netlify deploy --prod`

## Test rapido del server
Dopo il deploy, apri nel browser:
`https://TUO-SITO.netlify.app/.netlify/functions/push-config`

Deve rispondere con JSON simile a:
`{"configured":true,"appId":"...","externalId":"vc-beauty-valeria"}`

La API key NON viene mai restituita al browser.
