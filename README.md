# VC Beauty v3.1 — aggiornamento promemoria

La v3.1 mantiene la registrazione push della v3.0 e corregge la gestione dei vecchi
promemoria già conclusi, già cancellati o non più presenti in OneSignal. Prima di
rimuovere un riferimento salvato, la Function verifica l’esito o lo stato effettivo
del messaggio. Gli errori di connessione e credenziali restano visibili, con un motivo
più preciso. Non vengono eliminati appuntamenti, clienti o altri dati dell’app.

Per aggiornare, carica tutti i file su GitHub, **compresa la cartella netlify**:
la correzione comprende `netlify/functions/push-cancel.js`. Dopo il deploy,
apri Impostazioni → Notifiche e premi **Risincronizza promemoria**.

Aggiornamento della v2.9 originale con logo ripristinato. Mantiene logo, icone,
schermata iniziale con Entra, apertura sul Calendario, calendario stile iPhone,
clienti, servizi, incassi, preferenze, dati locali e Netlify Functions.

## Cosa cambia

- OneSignal viene preparato una sola volta, prima di abilitare il pulsante.
- Consenti notifiche richiede il permesso direttamente dal tocco dell’utente.
- Completa anche la registrazione quando il permesso esiste ma manca il token.
- Esegue optIn e associa la subscription all’identità già usata dall’app.
- Mostra il verde solo con permesso, opt-in, subscription ID, token e identità verificati nel SDK.
- Aggiorna lo stato quando OneSignal completa la registrazione o cambia il permesso.
- Gestisce tempi di attesa, errori, permesso negato e apertura fuori dalla Home.
- La notifica di prova richiede una subscription attiva e una conferma di OneSignal.
- Le risincronizzazioni dei promemoria vengono eseguite in sequenza.

## Come aggiornare GitHub e Netlify

1. Nell’app attuale, usa **Impostazioni → Backup dati** e conserva il file JSON.
2. Estrai lo ZIP sul computer.
3. Nel repository GitHub già collegato al sito, carica **tutto il contenuto estratto**
   nella stessa cartella dei file attuali, sostituendo quelli con lo stesso nome.
   `index.html` e `netlify.toml` devono restare nella radice del progetto.
4. Includi anche `icons`, `push`, `netlify` e il nuovo `OneSignalSDKWorker.js`.
   Non caricare soltanto `index.html` e non caricare lo ZIP come singolo file.
5. Salva le modifiche su GitHub e attendi il deploy completato su Netlify.
6. Mantieni lo stesso sito/indirizzo Netlify. Chiudi e riapri VC Beauty sull’iPhone.
   In **Impostazioni → Notifiche**, in fondo, deve comparire **VC Beauty v3.1**.

Il progetto non richiede un comando di build o nuove dipendenze.
Usa GitHub collegato a Netlify per distribuire anche le Functions.
Il solo caricamento statico tramite trascinamento non basta per questo pacchetto.

Non eliminare l’app dalla Home e non cancellare i dati del sito per aggiornare:
i dati sono memorizzati sul dispositivo. L’aggiornamento conserva le stesse chiavi
di salvataggio; il backup resta consigliato.

## Prova sull’iPhone

1. Apri VC Beauty dall’icona sulla Home, su iOS 16.4 o successivo.
2. Vai in **Impostazioni → Notifiche** e attendi la preparazione.
3. Premi **Consenti notifiche**; se il permesso è già concesso, premi **Completa attivazione**.
4. Se compare la richiesta di iOS, scegli **Consenti**.
5. Attendi il messaggio verde **Notifiche attive: registrazione push verificata**.
6. Premi **Notifica di prova**, torna alla Home e controlla se arriva.
7. Controlla le preferenze e usa **Risincronizza promemoria** per riprogrammare gli eventi.

Una risposta di invio accettato da OneSignal non garantisce la consegna:
la prova finale è vedere arrivare la notifica sul dispositivo.

Per configurazione e problemi, leggi **README_NOTIFICHE.md**.
I controlli eseguiti sono riepilogati in **VERIFICHE_v3_1.md**.
