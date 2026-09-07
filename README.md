# VC Beauty — PWA iPhone v1.3

Nuove modifiche incluse:
- schermata iniziale per entrare nell'app con pulsante "Inizia"
- home aggiornata con gli appuntamenti DEL MESE, non più del giorno
- riepilogo del mese
- stile rosa chiaro mantenuto
- funzioni precedenti mantenute

## Come aggiornare su Netlify
1. Estrai lo ZIP
2. Vai nel progetto Netlify
3. Fai un nuovo deploy dei file
4. Apri il link su iPhone
5. Se non vedi le modifiche subito, ricarica la pagina o chiudi e riapri la web app

- splash screen aggiornata per assomigliare di più al riferimento: logo centrale su sfondo rosa pieno e pulsante Inizia in basso

- logo dell’app aggiornato con il file inviato dall’utente
- icona app aggiornata con il nuovo logo VC Beauty
- logo visibile anche nella schermata iniziale e nella home

- icona Home iPhone aggiornata con crop corretto del logo, senza bordo bianco esterno
- aggiunto apple-touch-icon specifico per iPhone
- per vedere la nuova icona su iPhone bisogna eliminare la vecchia app dalla Home e aggiungerla di nuovo da Safari

- icona dell’app aggiornata usando l’ultimo logo inviato dall’utente
- logo aggiornato anche per schermata iniziale e home
- per vedere la nuova icona su iPhone occorre eliminare la vecchia dalla Home e aggiungerla di nuovo


## v1.8 — correzioni iPhone
- zoom disattivato
- schermata iniziale bloccata su una sola pagina, senza scroll
- pulsante Inizia sempre visibile
- corretti tagli orizzontali delle card appuntamento
- layout Home adattato meglio agli iPhone stretti
- ridotte dimensioni di alcuni testi e badge su mobile

- nella schermata iniziale il pulsante "Inizia" è stato sostituito con "Entra"


## v2.0 Notifiche
- nuova schermata Impostazioni > Notifiche
- richiesta permesso notifiche iPhone
- tipi selezionabili: lavoro, personale, da confermare, da incassare, riepilogo giornaliero
- scelta anticipo promemoria
- notifica di prova
- preferenze salvate localmente

Nota: per notifiche automatiche affidabili quando la PWA è chiusa serve in seguito un servizio Web Push/backend.


## Correzione logo v2.4
Sono stati ripristinati:
- `manifest.webmanifest`
- `icons/logo.png`
- `icons/apple-touch-icon.png`
- `icons/icon-192.png`
- `icons/icon-512.png`

Il logo utilizzato è quello inviato dall'utente per VC Beauty.
Dopo il deploy GitHub/Netlify, per aggiornare l'icona sulla Home dell'iPhone
può essere necessario rimuovere VC Beauty dalla Home e aggiungerla di nuovo da Safari.
