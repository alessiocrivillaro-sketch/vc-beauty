/* VC Beauty v3.0 — OneSignal Web SDK v16 registration. */
(function () {
  'use strict';

  class VCBeautyPush {
    constructor(onChange) {
      this.onChange = onChange;
      this.sdk = null;
      this.configured = false;
      this.ready = false;
      this.busy = false;
      this.loading = false;
      this.error = '';
      this.externalId = '';
      this.identityConfirmed = false;
      this.initPromise = null;
      this.loginPromise = null;
      this.waiters = new Set();
      this.changed = () => {
        for (const check of this.waiters) check();
        if (this.active && !this.busy) this.error = '';
        if (this.onChange) this.onChange();
      };
      window.addEventListener('focus', this.changed);
      document.addEventListener('visibilitychange', this.changed);
    }

    get permission() {
      return 'Notification' in window ? Notification.permission : 'unsupported';
    }

    get platformIssue() {
      const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const standalone = navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
      if (ios && !standalone) return 'Su iPhone apri VC Beauty dall’icona sulla Home. Se manca, apri il sito in Safari e scegli Condividi → Aggiungi a Home.';
      if (!window.isSecureContext) return 'Per attivare le notifiche apri VC Beauty dal suo indirizzo HTTPS su Netlify.';
      if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
        return 'Le notifiche push non sono disponibili in questo browser. Su iPhone serve iOS 16.4 o successivo e l’app aperta dalla Home.';
      }
      if (this.sdk && !this.sdk.Notifications.isPushSupported()) return 'Questo browser non supporta le notifiche push di OneSignal.';
      return '';
    }

    get active() {
      const sub = this.sdk?.User.PushSubscription;
      return !!(this.ready && this.identityConfirmed && this.permission === 'granted' &&
        this.sdk.User.externalId === this.externalId && sub?.optedIn === true && sub.id && sub.token);
    }

    get status() {
      if (this.platformIssue) return {kind: 'warn', message: this.platformIssue};
      if (this.loading) return {kind: '', message: 'Preparazione delle notifiche…'};
      if (this.busy) return {kind: '', message: 'Attivazione in corso: attendo la conferma della registrazione…'};
      if (this.permission === 'denied') return {kind: 'warn', message: 'Notifiche bloccate. Su iPhone vai in Impostazioni → Notifiche → VC Beauty e abilita Consenti notifiche. Poi riapri l’app e riprova.'};
      if (this.error) return {kind: 'warn', message: this.error};
      if (this.active) return {kind: 'ok', message: '✓ Notifiche attive: registrazione push verificata.'};
      if (!this.configured) return {kind: 'warn', message: 'Configurazione server push da completare. Controlla le variabili OneSignal su Netlify e pubblica di nuovo il sito.'};
      if (this.permission === 'granted') return {kind: 'warn', message: 'Permesso concesso, ma registrazione push da completare. Premi Completa attivazione.'};
      return {kind: '', message: 'Le notifiche non sono ancora state autorizzate.'};
    }

    deadline(promise, milliseconds, message) {
      let timer;
      return Promise.race([
        promise,
        new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), milliseconds); })
      ]).finally(() => clearTimeout(timer));
    }

    init() {
      if (this.initPromise) return this.initPromise;
      if (this.platformIssue) { this.changed(); return Promise.resolve(false); }
      this.loading = true;
      this.changed();
      this.initPromise = this.prepare().catch((error) => {
        this.error = error.message || 'Preparazione non riuscita. Ricarica l’app e riprova.';
        return false;
      }).finally(() => {
        this.loading = false;
        this.changed();
      });
      return this.initPromise;
    }

    async prepare() {
      const abort = new AbortController();
      const timer = setTimeout(() => abort.abort(), 12000);
      let cfg;
      try {
        const response = await fetch('/.netlify/functions/push-config', {cache: 'no-store', signal: abort.signal});
        if (!response.ok) throw new Error('Configurazione notifiche non raggiungibile. Controlla il deploy delle Netlify Functions e ricarica l’app.');
        cfg = await response.json();
      } catch (error) {
        if (error.name === 'AbortError' || error instanceof TypeError) throw new Error('Connessione al server non riuscita. Controlla Internet e ricarica l’app.');
        throw error;
      } finally { clearTimeout(timer); }
      this.configured = !!(cfg.configured && cfg.appId);
      if (!this.configured) return false;
      // Preserve the existing single-owner identity also used by Netlify Functions.
      this.externalId = cfg.externalId || 'vc-beauty-valeria';
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      const prepared = new Promise((resolve, reject) => {
        window.OneSignalDeferred.push(async (sdk) => {
          try {
            await sdk.init({
              appId: cfg.appId,
              serviceWorkerPath: 'push/onesignal/OneSignalSDKWorker.js',
              serviceWorkerParam: {scope: '/push/onesignal/'},
              notifyButton: {enable: false},
              promptOptions: {slidedown: {prompts: [{type: 'push', autoPrompt: false}]}}
            });
            this.sdk = sdk;
            sdk.Notifications.addEventListener('permissionChange', this.changed);
            sdk.User.PushSubscription.addEventListener('change', this.changed);
            sdk.User.addEventListener('change', this.changed);
            this.ready = true;
            this.error = '';
            // Restoring the known identity does not request permission or opt in.
            if (this.permission === 'granted') await this.identify();
            this.changed();
            resolve(true);
          } catch (error) {
            this.error = 'OneSignal non è pronto. Controlla Site URL, App ID e service worker, poi ricarica l’app.';
            this.changed();
            reject(new Error(this.error));
          }
        });
      });
      return this.deadline(prepared, 25000, 'OneSignal non risponde. Controlla Internet, eventuali blocchi del browser e ricarica l’app.');
    }

    async identify() {
      if (this.identityConfirmed && this.sdk.User.externalId === this.externalId) return;
      if (!this.loginPromise) {
        this.loginPromise = (async () => {
          await this.sdk.login(this.externalId);
          this.identityConfirmed = true;
        })().finally(() => { this.loginPromise = null; });
      }
      await this.deadline(this.loginPromise, 15000, 'Associazione a OneSignal non completata. Controlla Internet e riprova.');
    }

    waitForSubscription() {
      if (this.active) return Promise.resolve(true);
      return new Promise((resolve, reject) => {
        const cleanup = () => { clearTimeout(timer); this.waiters.delete(check); };
        const check = () => {
          if (this.active) { cleanup(); resolve(true); }
          else if (this.permission === 'denied') { cleanup(); reject(new Error('Il permesso notifiche è stato disattivato.')); }
        };
        const timer = setTimeout(() => {
          cleanup();
          reject(new Error('Permesso concesso, ma OneSignal non ha ancora confermato subscription e token. Controlla Internet e premi Completa attivazione per riprovare.'));
        }, 20000);
        this.waiters.add(check);
        check();
      });
    }

    async enable() {
      if (this.busy || this.platformIssue || this.permission === 'denied') { this.changed(); return false; }
      if (!this.ready || this.loading) {
        // Never defer a permission request past the original user gesture.
        this.init();
        return false;
      }
      this.busy = true;
      this.error = '';
      try {
        // No await, login, fetch or deferred queue before this call: preserve iOS activation.
        // Also repairs permission=granted with no token; optIn alone only flips the enabled flag.
        const permissionRequest = this.sdk.Notifications.requestPermission();
        this.changed();
        await this.deadline(permissionRequest, 60000, 'Richiesta non completata. Se hai chiuso la finestra, premi di nuovo Consenti notifiche.');
        if (this.permission !== 'granted') return false;
        if (!this.sdk.User.PushSubscription.optedIn) {
          await this.deadline(this.sdk.User.PushSubscription.optIn(), 20000, 'Iscrizione push non completata. Controlla Internet e riprova.');
        }
        await this.identify();
        await this.waitForSubscription();
        return true;
      } catch (error) {
        this.error = error.message || 'Attivazione non riuscita. Controlla Internet e riprova.';
        return false;
      } finally {
        this.busy = false;
        this.changed();
      }
    }
  }

  window.VCBeautyPush = VCBeautyPush;
})();
