# Verifiche VC Beauty v3.1

Base: VC Beauty v3.0 preparata in questa conversazione.

La schermata inviata dall’utente mostra la registrazione push verificata ma un errore
nella cancellazione dei vecchi promemoria. L’utente ha confermato che la notifica di
prova arriva sull’iPhone. La risposta precisa della precedente cancellazione non è
visibile nella schermata: il caso dei messaggi già terminati è un difetto individuato
nel codice, non una diagnosi confermata dai log del sito.

## Controlli locali completati

- 15 test della registrazione push e delle funzioni dell’app, già usati per la v3.0,
  eseguiti sulla v3.1. Invariati calendario, logo, icone, manifest e funzioni dell’app
  estranee alle notifiche. Invariati anche push-config, push-schedule e _onesignal.
- 15 nuovi test della cancellazione: successo esplicito, messaggio concluso o già
  cancellato verificato tramite API, messaggio inesistente, 404 generico, 400 con
  invio ancora pendente, identità messaggio/app diversa, credenziali errate, limite
  richieste, indisponibilità, timeout, risposta ambigua e input invalido.
- Test integrato: un vecchio ID confermato come concluso viene tolto dall’elenco
  dei promemoria da cancellare; la successiva programmazione procede e salva il nuovo ID.
- Gli errori non risolti conservano gli ID e impediscono la programmazione duplicata.

Le API OneSignal sono simulate nei test locali. Non sono state usate chiavi reali
né inviate notifiche reali durante questi controlli.

## Verifica dopo il deploy

Aprire Impostazioni → Notifiche, verificare la scritta VC Beauty v3.1 e premere
Risincronizza promemoria. Deve apparire Promemoria aggiornati. Se compare un errore,
la nuova versione ne mostra il motivo: quel messaggio permette di distinguere
credenziali, rete, limite richieste e altri problemi del servizio.

La risincronizzazione dei promemoria e la relativa consegna su iPhone devono ancora
essere verificate dopo la pubblicazione della v3.1.
