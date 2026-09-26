# Verifiche VC Beauty v3.0

Base: cartella originale `VC_Beauty_PWA_iPhone_v2_9_logo_restored` presente sul computer.

## Controlli completati

- 15 test automatici con SDK simulato: inizializzazione unica, tocco diretto,
  doppio tocco, permesso già concesso senza token, token ritardato, timeout e
  recupero, permesso negato/non concesso, browser non supportato, iPhone fuori
  dalla Home, configurazione mancante, errore login e nuovo tentativo,
  risposta di invio senza ID, sincronizzazione serializzata, cancellazione
  fallita e blocco degli invii senza subscription verificata.
- Prova con Edge headless a larghezza 390 px e SDK simulato: logo caricato,
  Entra apre il Calendario, pannello Notifiche, gesto utente ancora attivo al
  momento della richiesta, stato verde dopo subscription completa e invio
  della prova solo successivamente. Nessun errore JavaScript o overflow orizzontale.
- Confronto SHA-256: logo, tutte le icone, manifest, netlify.toml, le quattro
  Netlify Functions e il worker originale corrispondono esattamente alla v2.9.
- Il codice di calendario, clienti, servizi, incassi, backup e salvataggio locale
  è stato confrontato con la v2.9 ed è invariato.

## Prova da completare dopo il deploy

Questi controlli non costituiscono una prova su Safari/iPhone reale e non
verificano le credenziali Netlify/OneSignal. Dopo il deploy occorre completare
il consenso dall’app installata e verificare la ricezione di una notifica
di prova e di un promemoria programmato sul dispositivo.

Nessuna notifica è stata inviata a utenti reali durante i test locali.
