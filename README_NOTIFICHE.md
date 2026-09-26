# VC Beauty v3.1 — configurazione notifiche

## Netlify

Mantieni le variabili già configurate:

- `ONESIGNAL_APP_ID`
- `ONESIGNAL_APP_API_KEY`

Devono essere disponibili alle Netlify Functions. Dopo una modifica alle variabili,
esegui un nuovo deploy. Non inserire la chiave API segreta in `index.html`, negli
script del browser o in GitHub. Lo ZIP non contiene credenziali.

Apri sul tuo sito `/.netlify/functions/push-config` e verifica `configured: true`.
Questo conferma la presenza delle variabili, non verifica che le credenziali siano valide.
La risposta contiene App ID e l’identità dell’app, mai la chiave API segreta.

Sono incluse `push-config`, `push-schedule`, `push-cancel` e `_onesignal`.
La v3.1 aggiorna `push-cancel`: un vecchio messaggio confermato come concluso,
cancellato o inesistente non impedisce più la nuova programmazione.
Gli altri errori restano bloccanti per evitare di programmare notifiche duplicate.
L’identità esistente resta `vc-beauty-valeria`; questa versione conserva il modello
dell’app personale già presente nella v2.9 e non introduce account multipli.

## OneSignal Web

- Usa la stessa app OneSignal e lo stesso App ID configurato su Netlify.
- Il Site URL deve corrispondere all’origine HTTPS del sito pubblicato.
  L’indirizzo riportato nella conversazione era `https://resplendent-nougat-0cddaf.netlify.app`.
- Con **Custom Code**, il codice usa il worker originale:
  `push/onesignal/OneSignalSDKWorker.js`, scope `/push/onesignal/`.
- Con **Typical Site**, controlla anche le impostazioni del worker nel pannello
  OneSignal: alcune opzioni del codice vengono sostituite da quelle del pannello.
  È incluso anche `/OneSignalSDKWorker.js` per la configurazione con percorso standard.
  Non servono due registrazioni manuali: sceglie il percorso il SDK in base alla configurazione.
- Disattiva eventuali richieste automatiche configurate nel pannello se vuoi
  richiedere il consenso solo dal pulsante dell’app.
- Il worker configurato deve aprirsi pubblicamente come JavaScript, senza redirect
  o pagina HTML. Il file originale e il suo percorso sono conservati.

L’app non tenta più di registrare il file `sw.js`, che era richiamato ma assente
nel pacchetto v2.9. La registrazione del worker push è gestita da OneSignal.

## Cosa indicano i messaggi

- **Preparazione…**: attendi prima di premere il pulsante. Non parte una richiesta
  automatica di permesso al termine dell’attesa: serve un nuovo tocco sul pulsante.
- **Permesso concesso, ma registrazione push da completare**: il consenso del
  sistema non basta. Premi **Completa attivazione** e attendi la verifica.
- **Notifiche attive: registrazione push verificata**: il SDK espone permesso
  concesso, opt-in, subscription ID, token e identità attesa.
- **Notifiche bloccate**: riabilitale nelle impostazioni dell’iPhone, poi riapri l’app.
- **OneSignal non risponde**: controlla Internet, Site URL, App ID, worker ed eventuali
  blocchi del browser. Ricarica l’app e riprova.
- **Promemoria non aggiornati**: l’iscrizione e la programmazione sono operazioni
  distinte. Premi **Risincronizza promemoria** dopo aver risolto la connessione/configurazione.

Su iPhone e iPad occorre iOS/iPadOS 16.4 o successivo e aprire l’app dalla Home.
Se non è installata: Safari → Condividi → Aggiungi a Home. Per un’app già installata,
non è necessario rimuoverla per questo aggiornamento.

## Controllo finale

In OneSignal → Pubblico/Abbonamenti, cerca la subscription associata all’identità
`vc-beauty-valeria`. Deve risultare iscritta e avere un token. Eventuali vecchie
righe “Never Subscribed” possono riferirsi a precedenti sessioni o browser:
controlla anche data e dispositivo della nuova registrazione.

Invia una prova dall’app. Se OneSignal la accetta ma non appare sull’iPhone,
controlla le impostazioni Notifiche e Full immersion dell’iPhone e lo stato di
consegna nel pannello OneSignal.

I promemoria restano quelli della versione precedente: vengono programmati dalle
Functions a partire dagli eventi e dalle preferenze salvati nell’app. Non è stato
aggiunto un sistema di sincronizzazione dei dati tra dispositivi.

## Riferimenti tecnici

- [OneSignal Web SDK v16](https://documentation.onesignal.com/docs/en/web-sdk-reference)
- [OneSignal su iOS](https://documentation.onesignal.com/docs/en/web-push-for-ios)
- [Configurazione service worker](https://documentation.onesignal.com/docs/en/onesignal-service-worker)
- [Requisiti Apple Web Push](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers)
- [Cancellazione messaggi OneSignal](https://documentation.onesignal.com/reference/cancel-message)
- [Verifica stato messaggio](https://documentation.onesignal.com/reference/view-message)
