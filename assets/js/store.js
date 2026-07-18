/* ============================================================
   HaxOne Payment Platform — store.js
   Reactive localStorage-backed state manager
   ============================================================ */
(function () {
  'use strict';

  function generateMockTransactions(count) {
    const methods = ['mpesa_stk','mpesa_till','mpesa_paybill','paypal','stripe','card_visa','card_mastercard','cash','flutterwave','pesapal','airtel_money'];
    const statuses = ['success','success','success','success','success','failed','pending','success'];
    const items = ['Groceries','Electronics','Clothing','Food & Beverages','Fuel','Services','Subscription','Medical','Education','Hardware'];
    const txns = [];
    const now = Date.now();
    for (let i = 0; i < count; i++) {
      const method = methods[Math.floor(Math.random() * methods.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const amount = Math.round((Math.random() * 48000 + 200) * 100) / 100;
      const daysAgo = Math.floor(Math.random() * 30);
      txns.push({
        id: 'TXN' + String(i + 1).padStart(6, '0'),
        mpesaRef: method.startsWith('mpesa') ? 'QHX' + Math.random().toString(36).substr(2,7).toUpperCase() : null,
        amount,
        currency: 'KES',
        method,
        status,
        item: items[Math.floor(Math.random() * items.length)],
        phone: (method.startsWith('mpesa') || method === 'airtel_money') ? '07' + Math.floor(Math.random() * 90000000 + 10000000) : null,
        gateway: method.startsWith('mpesa') ? 'daraja' : method === 'paypal' ? 'paypal' : method === 'stripe' ? 'stripe' : method === 'flutterwave' ? 'flutterwave' : method === 'pesapal' ? 'pesapal' : 'local',
        fee: Math.round(amount * 0.015 * 100) / 100,
        timestamp: new Date(now - daysAgo * 86400000 - Math.random() * 86400000).toISOString(),
        receipt: 'RCP' + Math.random().toString(36).substr(2,8).toUpperCase()
      });
    }
    return txns.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  const DEFAULTS = {
    gateways: {
      daraja:     { enabled: true,  environment: 'sandbox', consumerKey: 'hx_ck_demo_1234', consumerSecret: '', shortCode: '174379', passkey: '', tillNumber: '5001799', paybillNumber: '400200', initiatorName: 'testapi', callbackUrl: 'https://api.haxone.com/mpesa/callback', validationUrl: '', confirmationUrl: '', health: 'online', lastPing: '142ms', lastChecked: new Date().toISOString() },
      pesapal:    { enabled: false, environment: 'sandbox', consumerKey: '', consumerSecret: '', ipnUrl: '', health: 'offline', lastPing: '-', lastChecked: null },
      paystack:   { enabled: true,  environment: 'sandbox', publicKey: 'pk_test_demo_haxone', secretKey: '', webhookUrl: 'https://api.haxone.com/paystack/webhook', health: 'online', lastPing: '63ms', lastChecked: new Date().toISOString() },
      flutterwave:{ enabled: false, environment: 'sandbox', publicKey: '', secretKey: '', encryptionKey: '', webhookUrl: '', health: 'offline', lastPing: '-', lastChecked: null },
      stripe:     { enabled: false, environment: 'sandbox', publishableKey: '', secretKey: '', webhookSecret: '', health: 'offline', lastPing: '-', lastChecked: null },
      paypal:     { enabled: true,  environment: 'sandbox', clientId: 'AX_demo_haxone_client_id', clientSecret: '', webhookId: '', health: 'online', lastPing: '112ms', lastChecked: new Date().toISOString() },
      dpo:        { enabled: false, environment: 'sandbox', companyToken: '', serviceType: '', merchantCode: '', health: 'offline', lastPing: '-', lastChecked: null }
    },
    transactions: generateMockTransactions(80),
    settings: {
      currency: 'KES',
      currencySymbol: 'KSh',
      taxRate: 0.16,
      businessName: 'HaxOne Store',
      businessEmail: 'payments@haxone.com',
      businessPhone: '+254700000000',
      smsEnabled: true,
      emailEnabled: true,
      whatsappEnabled: false,
      cashDrawerOpening: 50000
    },
    reconciliation: { lastReconciled: null, cashDrawer: 50000, cashActual: 0 },
    credentials: {}
  };

  const Store = {
    _data: {},
    _subs: {},

    init() {
      const keys = Object.keys(DEFAULTS);
      keys.forEach(key => {
        try {
          const raw = localStorage.getItem('hx_' + key);
          this._data[key] = raw ? JSON.parse(raw) : DEFAULTS[key];
        } catch (e) {
          this._data[key] = DEFAULTS[key];
        }
      });
    },

    get(key) {
      return this._data[key];
    },

    set(key, value) {
      this._data[key] = value;
      try { localStorage.setItem('hx_' + key, JSON.stringify(value)); } catch (e) { /* quota */ }
      (this._subs[key] || []).forEach(cb => { try { cb(value); } catch (e) {} });
    },

    update(key, updaterFn) {
      this.set(key, updaterFn(this.get(key)));
    },

    subscribe(key, cb) {
      if (!this._subs[key]) this._subs[key] = [];
      this._subs[key].push(cb);
      return () => { this._subs[key] = this._subs[key].filter(s => s !== cb); };
    },

    reset(key) {
      this.set(key, DEFAULTS[key]);
    }
  };

  Store.init();
  window.HaxOne = window.HaxOne || {};
  window.HaxOne.store = Store;
})();
