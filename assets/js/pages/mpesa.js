/* ============================================================
   HaxOne — pages/mpesa.js  M-Pesa Features Panel
   ============================================================ */
(function () {
  'use strict';
  window.HaxOnePages = window.HaxOnePages || {};

  window.HaxOnePages['mpesa'] = {
    _activePanel: null,

    render(container) {
      const utils = window.HaxOne.utils;
      const gws   = window.HaxOne.store.get('gateways') || {};
      const daraja = gws.daraja || {};

      const FEATURES = [
        { id:'stk',        label:'STK Push',             desc:'Initiate customer payment prompt',        icon:'📱', action:'Launch Terminal', color:'#00a651' },
        { id:'till',       label:'Till Payment',         desc:'Buy Goods via Till Number',               icon:'🏪', action:'Configure',       color:'#00D4FF' },
        { id:'paybill',    label:'Paybill Payment',      desc:'Pay to Paybill account',                  icon:'🏦', action:'Configure',       color:'#6C63FF' },
        { id:'buygoods',   label:'Buy Goods',            desc:'Merchant buy goods',                      icon:'🛒', action:'Info',            color:'#FFD740' },
        { id:'pochi',      label:'Pochi la Biashara',    desc:'Personal business wallet payments',       icon:'👛', action:'Configure',       color:'#FF6B6B' },
        { id:'b2c',        label:'B2C Payments',         desc:'Business to Customer transfers',          icon:'💸', action:'Send Money',      color:'#00E676' },
        { id:'b2b',        label:'B2B Payments',         desc:'Business to Business transfers',          icon:'🏢', action:'Initiate',        color:'#00D4FF' },
        { id:'reversal',   label:'Transaction Reversal', desc:'Reverse failed transactions',             icon:'↩️', action:'Reverse',         color:'#FF9100' },
        { id:'refunds',    label:'Refunds',              desc:'Process customer refunds',                icon:'💰', action:'Process Refund',  color:'#E040FB' },
        { id:'balance',    label:'Balance Inquiry',      desc:'Check M-Pesa account balance',            icon:'💼', action:'Check Balance',   color:'#40C4FF' },
        { id:'status',     label:'Transaction Status',   desc:'Query any transaction status',            icon:'🔍', action:'Query',           color:'#69F0AE' },
        { id:'dynqr',      label:'Dynamic QR Code',      desc:'Generate per-transaction QR codes',       icon:'📲', action:'Generate QR',     color:'#6C63FF' },
        { id:'staticqr',   label:'Static QR Code',       desc:'Permanent merchant QR code',              icon:'📋', action:'View QR',         color:'#00a651' },
        { id:'validation', label:'Merchant Validation',  desc:'Configure validation URL endpoint',       icon:'✅', action:'Configure',       color:'#FFD740' },
        { id:'offline',    label:'Offline Sync',         desc:'Sync offline payment queue',              icon:'📡', action:'Sync Queue',      color:'#FF6B6B' }
      ];

      container.innerHTML = `
        <div class="hx-flex hx-items-center hx-justify-between hx-mb-24">
          <div>
            <h1>M-Pesa Features</h1>
            <p style="font-size:13px">Full Safaricom Daraja API feature suite</p>
          </div>
          <div class="hx-flex hx-gap-8 hx-items-center">
            <span class="hx-status-dot hx-status-dot--${daraja.health==='online'?'online':'offline'}"></span>
            <span style="font-size:12px;color:var(--hx-text-muted)">Daraja API • ${daraja.environment||'sandbox'} • ${daraja.health||'offline'}</span>
            <span class="hx-badge ${daraja.enabled?'hx-badge--success':'hx-badge--error'}">${daraja.enabled?'Active':'Inactive'}</span>
          </div>
        </div>

        <!-- Status Card -->
        <div class="hx-card hx-mb-24" style="background:linear-gradient(135deg,rgba(0,166,81,0.08),rgba(108,99,255,0.08));border-color:rgba(0,166,81,0.2)">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
            <div style="text-align:center">
              <div style="font-size:22px;font-weight:800;color:var(--hx-success)" id="mp-balance-display">KSh —</div>
              <div style="font-size:11px;color:var(--hx-text-muted)">Working Balance</div>
            </div>
            <div style="text-align:center">
              <div style="font-size:22px;font-weight:800;color:var(--hx-text)">${(window.HaxOne.store.get('transactions')||[]).filter(t=>t.method.startsWith('mpesa')).length}</div>
              <div style="font-size:11px;color:var(--hx-text-muted)">M-Pesa Transactions</div>
            </div>
            <div style="text-align:center">
              <div style="font-size:22px;font-weight:800;color:var(--hx-primary)">${daraja.shortCode||'174379'}</div>
              <div style="font-size:11px;color:var(--hx-text-muted)">Business Short Code</div>
            </div>
            <div style="text-align:center">
              <div style="font-size:22px;font-weight:800;color:var(--hx-warning)">${daraja.tillNumber||'N/A'}</div>
              <div style="font-size:11px;color:var(--hx-text-muted)">Till Number</div>
            </div>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="hx-grid-3 hx-mb-24 hx-stagger">
          ${FEATURES.map(f => `
            <div class="hx-card hx-card--hover" style="padding:16px">
              <div class="hx-flex hx-items-start hx-gap-12">
                <div style="width:42px;height:42px;border-radius:10px;background:${f.color}18;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">${f.icon}</div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:13px;font-weight:700;margin-bottom:2px">${f.label}</div>
                  <div style="font-size:11px;color:var(--hx-text-muted);margin-bottom:10px">${f.desc}</div>
                  <button class="hx-btn hx-btn--sm" style="background:${f.color}22;color:${f.color};border:1px solid ${f.color}44;font-size:11px" onclick="window.HaxOnePages.mpesa._openPanel('${f.id}')">
                    ${f.action}
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Interactive Panel -->
        <div id="mp-panel" style="display:none;margin-bottom:24px"></div>

        <!-- Receipt Settings -->
        <div class="hx-card hx-mb-24">
          <div class="hx-section-title hx-mb-16">📬 Receipt Delivery Settings</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
            ${[['SMS Confirmation','📱',true],['Email Receipt','📧',true],['WhatsApp Receipt','💬',false]].map(([lbl,icon,en])=>`
              <div style="background:var(--hx-surface-2);border-radius:8px;padding:14px">
                <div class="hx-flex hx-items-center hx-justify-between hx-mb-8">
                  <div style="font-size:14px;font-weight:600">${icon} ${lbl}</div>
                  <label class="hx-toggle">
                    <input type="checkbox" ${en?'checked':''}>
                    <div class="hx-toggle-track"></div>
                    <div class="hx-toggle-thumb"></div>
                  </label>
                </div>
                <button class="hx-btn hx-btn--ghost hx-btn--sm hx-w-full" onclick="window.HaxOne.toast.show('Test ${lbl} sent ✓','success')">Send Test</button>
              </div>
            `).join('')}
          </div>
          <div class="hx-form-group hx-mt-16">
            <label class="hx-label">Custom Message Template</label>
            <textarea class="hx-textarea" style="min-height:80px">Dear {name}, your payment of {amount} has been received. Ref: {receipt}. Thank you for shopping at HaxOne Store.</textarea>
          </div>
        </div>

        <!-- Settlement Reports -->
        <div class="hx-card">
          <div class="hx-section-title hx-mb-16">📊 Daily Settlement Reports</div>
          <div class="hx-flex hx-gap-12 hx-items-end">
            <div class="hx-form-group hx-flex-1" style="margin-bottom:0">
              <label class="hx-label">Report Date</label>
              <input type="date" class="hx-input" id="mp-report-date" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <button class="hx-btn hx-btn--primary" onclick="window.HaxOnePages.mpesa._generateReport()">📊 Generate Report</button>
            <button class="hx-btn hx-btn--ghost" onclick="window.HaxOne.utils.exportCSV(window.HaxOne.store.get('transactions')||[],'mpesa_transactions')">⬇ Export CSV</button>
          </div>
          <div id="mp-report-result" style="display:none;margin-top:16px"></div>
        </div>
      `;
    },

    _openPanel(id) {
      const panel = document.getElementById('mp-panel');
      if (!panel) return;
      if (this._activePanel === id) { panel.style.display='none'; this._activePanel=null; return; }
      this._activePanel = id;
      panel.style.display = 'block';
      panel.style.animation = 'hx-slide-up 0.3s ease';

      const panels = {
        stk:     () => { window.HaxOne.navigate('terminal'); },
        b2c:     () => this._panelB2C(panel),
        balance: () => this._panelBalance(panel),
        status:  () => this._panelStatus(panel),
        dynqr:   () => this._panelQR(panel, 'dynamic'),
        staticqr:() => this._panelQR(panel, 'static'),
        refunds: () => this._panelRefund(panel),
        offline: () => this._panelOffline(panel),
        reversal:() => this._panelReversal(panel),
        b2b:     () => this._panelB2B(panel),
        till:    () => this._panelInfo(panel,'Till Payment','Configure your Till Number ('+( (window.HaxOne.store.get('gateways')||{}).daraja?.tillNumber||'Not set')+'). Customers can pay directly to your till. Update it in Gateway Management.'),
        paybill: () => this._panelInfo(panel,'Paybill Payment','Your Paybill: '+((window.HaxOne.store.get('gateways')||{}).daraja?.paybillNumber||'Not set')+'. Configure in Gateway Management.'),
        buygoods:() => this._panelInfo(panel,'Buy Goods','Allows customers to pay using Buy Goods. Uses the same Till Number as regular till payments.'),
        pochi:   () => this._panelInfo(panel,'Pochi la Biashara','Enables personal business wallet payments. Configure via Daraja API portal.'),
        validation:()=> this._panelInfo(panel,'Merchant Validation','Your Validation URL: '+((window.HaxOne.store.get('gateways')||{}).daraja?.validationUrl||'Not configured')+'. Set in Gateway Management → Daraja.')
      };
      if (panels[id]) panels[id]();
    },

    _panelInfo(panel, title, msg) {
      panel.innerHTML = `<div class="hx-card hx-info-card"><div style="font-size:20px">ℹ️</div><div><strong>${title}</strong><br><span style="font-size:13px">${msg}</span><br><button class="hx-btn hx-btn--ghost hx-btn--sm hx-mt-16" onclick="window.HaxOne.navigate('gateways')">Open Gateway Settings</button></div></div>`;
    },

    _panelB2C(panel) {
      panel.innerHTML = `
        <div class="hx-card">
          <h3 class="hx-mb-16">💸 B2C Payment — Send Money to Customer</h3>
          <div class="hx-form-row">
            <div class="hx-form-group">
              <label class="hx-label">Customer Phone</label>
              <div class="hx-flex"><div class="hx-input-prefix">+254</div><input id="b2c-phone" class="hx-input" placeholder="7XX XXX XXX" style="border-radius:0 var(--hx-radius-sm) var(--hx-radius-sm) 0"></div>
            </div>
            <div class="hx-form-group">
              <label class="hx-label">Amount (KES)</label>
              <input id="b2c-amount" class="hx-input" type="number" min="10" placeholder="0.00">
            </div>
          </div>
          <div class="hx-form-group">
            <label class="hx-label">Occasion / Remarks</label>
            <input id="b2c-occasion" class="hx-input" placeholder="Payment description…">
          </div>
          <button id="b2c-send-btn" class="hx-btn hx-btn--mpesa">💸 Send Money</button>
          <div id="b2c-result" style="margin-top:12px"></div>
        </div>
      `;
      panel.querySelector('#b2c-send-btn').addEventListener('click', async () => {
        const btn = panel.querySelector('#b2c-send-btn');
        const phone = '254' + (panel.querySelector('#b2c-phone').value || '').replace(/\D/g,'');
        const amount = parseFloat(panel.querySelector('#b2c-amount').value) || 0;
        const occasion = panel.querySelector('#b2c-occasion').value || 'B2C Payment';
        if (!amount || amount < 10) { window.HaxOne.toast.show('Enter a valid amount (min KSh 10)','error'); return; }
        btn.classList.add('hx-btn--loading'); btn.textContent = '';
        try {
          const res = await window.HaxOne.mockAPI.b2cPayment({ phone, amount, occasion });
          panel.querySelector('#b2c-result').innerHTML = `<div class="hx-success-card">✓ B2C Payment initiated! Receipt: <strong>${res.TransactionReceipt}</strong></div>`;
          window.HaxOne.toast.show('B2C of KSh '+amount+' sent to +'+phone+' ✓','success');
        } catch(e) {
          panel.querySelector('#b2c-result').innerHTML = `<div style="color:var(--hx-error);font-size:13px">✗ ${e.message}</div>`;
          window.HaxOne.toast.show(e.message,'error');
        } finally {
          btn.classList.remove('hx-btn--loading'); btn.textContent = '💸 Send Money';
        }
      });
    },

    _panelBalance(panel) {
      panel.innerHTML = `
        <div class="hx-card" style="text-align:center">
          <h3 class="hx-mb-8">💼 Balance Inquiry</h3>
          <p style="color:var(--hx-text-muted);font-size:13px;margin-bottom:20px">Check your M-Pesa business account balance in real-time</p>
          <button id="bal-btn" class="hx-btn hx-btn--mpesa">🔍 Check Balance</button>
          <div id="bal-result" style="margin-top:20px"></div>
        </div>
      `;
      panel.querySelector('#bal-btn').addEventListener('click', async () => {
        const btn = panel.querySelector('#bal-btn');
        btn.classList.add('hx-btn--loading'); btn.textContent = '';
        try {
          const res = await window.HaxOne.mockAPI.balanceInquiry();
          const working = res.WorkingAccount.split('|')[2] || '0';
          const utility = res.UtilityAccount.split('|')[2] || '0';
          panel.querySelector('#bal-result').innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:400px;margin:0 auto">
              <div style="background:var(--hx-success-bg);border:1px solid rgba(0,230,118,0.2);border-radius:8px;padding:16px">
                <div style="font-size:11px;color:var(--hx-text-muted);margin-bottom:4px">Working Account</div>
                <div style="font-size:20px;font-weight:800;color:var(--hx-success)" id="mp-balance-display2">KSh ${parseFloat(working).toLocaleString('en-KE',{minimumFractionDigits:2})}</div>
              </div>
              <div style="background:var(--hx-info-bg);border:1px solid rgba(64,196,255,0.2);border-radius:8px;padding:16px">
                <div style="font-size:11px;color:var(--hx-text-muted);margin-bottom:4px">Utility Account</div>
                <div style="font-size:20px;font-weight:800;color:var(--hx-info)">KSh ${parseFloat(utility).toLocaleString('en-KE',{minimumFractionDigits:2})}</div>
              </div>
            </div>`;
          const b = document.getElementById('mp-balance-display');
          if (b) b.textContent = 'KSh ' + parseFloat(working).toLocaleString('en-KE',{minimumFractionDigits:2});
        } catch(e) { panel.querySelector('#bal-result').innerHTML = `<div style="color:var(--hx-error)">${e.message}</div>`; }
        finally { btn.classList.remove('hx-btn--loading'); btn.textContent = '🔍 Check Balance'; }
      });
    },

    _panelStatus(panel) {
      panel.innerHTML = `
        <div class="hx-card">
          <h3 class="hx-mb-16">🔍 Transaction Status Query</h3>
          <div class="hx-flex hx-gap-8">
            <input id="status-id" class="hx-input hx-flex-1" placeholder="Enter Transaction ID or M-Pesa Reference…" value="QHX${Math.random().toString(36).substr(2,7).toUpperCase()}">
            <button id="status-btn" class="hx-btn hx-btn--primary">Query</button>
          </div>
          <div id="status-result" style="margin-top:16px"></div>
        </div>
      `;
      panel.querySelector('#status-btn').addEventListener('click', async () => {
        const btn = panel.querySelector('#status-btn');
        const tid = panel.querySelector('#status-id').value;
        btn.classList.add('hx-btn--loading'); btn.textContent = '';
        try {
          const res = await window.HaxOne.mockAPI.transactionStatus(tid);
          panel.querySelector('#status-result').innerHTML = `
            <div class="hx-success-card">
              <strong>✓ ${res.ResultDesc}</strong><br>
              <span style="font-size:12px">Status: ${res.TransactionStatus} • Conversation ID: ${res.ConversationID}</span>
            </div>`;
        } catch(e) { panel.querySelector('#status-result').innerHTML = `<div style="color:var(--hx-error)">${e.message}</div>`; }
        finally { btn.classList.remove('hx-btn--loading'); btn.textContent = 'Query'; }
      });
    },

    _panelQR(panel, type) {
      panel.innerHTML = `
        <div class="hx-card">
          <h3 class="hx-mb-16">${type==='dynamic'?'📲 Dynamic':'📋 Static'} QR Code Generator</h3>
          <div style="display:grid;grid-template-columns:1fr auto;gap:20px;align-items:start">
            <div>
              ${type==='dynamic'?`<div class="hx-form-group"><label class="hx-label">Amount (KES)</label><input id="qr-amount" class="hx-input" type="number" placeholder="Enter amount…" oninput="window.HaxOnePages.mpesa._updateQR()"></div>`:''}
              <div class="hx-form-group">
                <label class="hx-label">Account Reference</label>
                <input id="qr-ref" class="hx-input" placeholder="${type==='static'?'Your merchant name':'Order ID, Invoice…'}" value="${type==='static'?'HaxOne Merchant':''}" oninput="window.HaxOnePages.mpesa._updateQR()">
              </div>
              <div class="hx-info-card hx-mb-16"><span>ℹ️</span> <span style="font-size:12px">This ${type} QR can be scanned using the M-Pesa app to initiate payment directly.</span></div>
              <button class="hx-btn hx-btn--primary" onclick="window.HaxOne.toast.show('QR Code downloaded ✓','success')">⬇ Download QR</button>
              <button class="hx-btn hx-btn--ghost" style="margin-left:8px" onclick="window.HaxOne.toast.show('QR Code printed ✓','success')">🖨️ Print</button>
            </div>
            <div id="qr-display" style="width:200px;height:200px;border:2px solid var(--hx-border);border-radius:12px;overflow:hidden;background:white;display:flex;align-items:center;justify-content:center">
              ${window.HaxOne.utils.generateQRPlaceholder('HaxOne|Default')}
            </div>
          </div>
        </div>
      `;
      window.HaxOnePages.mpesa._updateQR = () => {
        const amount = (document.getElementById('qr-amount')||{}).value || '';
        const ref    = (document.getElementById('qr-ref')||{}).value || 'HaxOne';
        const data   = `HaxOne|${ref}|${amount}`;
        const display = document.getElementById('qr-display');
        if (display) display.innerHTML = window.HaxOne.utils.generateQRPlaceholder(data);
      };
    },

    _panelRefund(panel) {
      const txns = window.HaxOne.store.get('transactions') || [];
      const mpesaTxns = txns.filter(t=>t.status==='success'&&t.method.startsWith('mpesa')).slice(0,10);
      panel.innerHTML = `
        <div class="hx-card">
          <h3 class="hx-mb-16">💰 Process M-Pesa Refund</h3>
          <div class="hx-form-row">
            <div class="hx-form-group">
              <label class="hx-label">Transaction / M-Pesa Reference</label>
              <select id="refund-txn" class="hx-select">
                <option value="">Select transaction…</option>
                ${mpesaTxns.map(t=>`<option value="${t.mpesaRef||t.id}">${t.mpesaRef||t.id} — ${window.HaxOne.utils.formatCurrency(t.amount)}</option>`).join('')}
              </select>
            </div>
            <div class="hx-form-group">
              <label class="hx-label">Refund Amount (KES)</label>
              <input id="refund-amount" class="hx-input" type="number" placeholder="Full or partial amount">
            </div>
          </div>
          <div class="hx-form-group">
            <label class="hx-label">Reason for Refund</label>
            <select id="refund-reason" class="hx-select">
              <option>Customer dissatisfied with service</option>
              <option>Wrong amount charged</option>
              <option>Duplicate transaction</option>
              <option>Item out of stock</option>
              <option>Customer request</option>
            </select>
          </div>
          <button id="refund-btn" class="hx-btn hx-btn--danger">↩ Process Refund</button>
          <div id="refund-result" style="margin-top:12px"></div>
        </div>
      `;
      panel.querySelector('#refund-btn').addEventListener('click', async () => {
        const btn = panel.querySelector('#refund-btn');
        const txnId = panel.querySelector('#refund-txn').value;
        const amount = parseFloat(panel.querySelector('#refund-amount').value) || 0;
        const reason = panel.querySelector('#refund-reason').value;
        if (!txnId || !amount) { window.HaxOne.toast.show('Select a transaction and enter refund amount','error'); return; }
        btn.classList.add('hx-btn--loading'); btn.textContent = '';
        try {
          const res = await window.HaxOne.mockAPI.processRefund({ transactionId: txnId, amount, reason });
          panel.querySelector('#refund-result').innerHTML = `<div class="hx-success-card">✓ ${res.message}<br><span style="font-size:12px">Refund ID: ${res.refundId}</span></div>`;
          window.HaxOne.toast.show('Refund of KSh '+amount+' processed ✓','success');
        } catch(e) {
          panel.querySelector('#refund-result').innerHTML = `<div style="color:var(--hx-error)">${e.message}</div>`;
          window.HaxOne.toast.show(e.message,'error');
        } finally { btn.classList.remove('hx-btn--loading'); btn.textContent = '↩ Process Refund'; }
      });
    },

    _panelOffline(panel) {
      const mockQueue = Array.from({length:5},(_,i)=>({ id:'OFF'+String(i+1).padStart(3,'0'), method:'mpesa_stk', amount:Math.round(Math.random()*5000+200), phone:'0'+Math.floor(Math.random()*900000000+100000000), time: new Date(Date.now()-Math.random()*3600000).toLocaleTimeString(), status:'pending' }));
      panel.innerHTML = `
        <div class="hx-card">
          <div class="hx-flex hx-items-center hx-justify-between hx-mb-16">
            <h3>📡 Offline Payment Sync Queue</h3>
            <button id="sync-all-btn" class="hx-btn hx-btn--primary hx-btn--sm">⚡ Sync All</button>
          </div>
          <div id="offline-queue">
            ${mockQueue.map(q=>`
              <div class="hx-sync-row" id="offline-${q.id}">
                <span class="hx-sync-icon">📱</span>
                <div class="hx-sync-info">
                  <div style="font-size:13px;font-weight:600">${q.phone} — ${window.HaxOne.utils.formatCurrency(q.amount)}</div>
                  <div style="font-size:11px;color:var(--hx-text-muted)">${q.time}</div>
                </div>
                <span class="hx-sync-status hx-sync-status--pending">⏳ Pending</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      panel.querySelector('#sync-all-btn').addEventListener('click', async () => {
        const btn = panel.querySelector('#sync-all-btn');
        btn.classList.add('hx-btn--loading'); btn.textContent = '';
        for (const q of mockQueue) {
          await new Promise(r=>setTimeout(r,400));
          const row = document.getElementById('offline-'+q.id);
          if (row) row.querySelector('.hx-sync-status').innerHTML = '<span class="hx-sync-status hx-sync-status--synced">✓ Synced</span>';
        }
        btn.classList.remove('hx-btn--loading'); btn.textContent = '✓ All Synced';
        btn.className = 'hx-btn hx-btn--success hx-btn--sm';
        window.HaxOne.toast.show('All 5 offline payments synced successfully ✓','success');
      });
    },

    _panelReversal(panel) {
      panel.innerHTML = `
        <div class="hx-card">
          <h3 class="hx-mb-16">↩️ Transaction Reversal</h3>
          <div class="hx-warning-card hx-mb-16"><span>⚠️</span> <span style="font-size:12px">Reversal is irreversible. Only use for genuine failed transactions that need reversal. M-Pesa processing may take up to 10 minutes.</span></div>
          <div class="hx-form-group"><label class="hx-label">Transaction ID</label><input id="rev-id" class="hx-input" placeholder="M-Pesa Transaction ID"></div>
          <div class="hx-form-group"><label class="hx-label">Remarks</label><input id="rev-remarks" class="hx-input" placeholder="Reason for reversal"></div>
          <button id="rev-btn" class="hx-btn hx-btn--danger">↩ Initiate Reversal</button>
          <div id="rev-result" style="margin-top:12px"></div>
        </div>
      `;
      panel.querySelector('#rev-btn').addEventListener('click', async () => {
        const btn=panel.querySelector('#rev-btn'); const txnId=panel.querySelector('#rev-id').value;
        if (!txnId){window.HaxOne.toast.show('Enter a Transaction ID','error');return;}
        btn.classList.add('hx-btn--loading');btn.textContent='';
        try{
          const res=await window.HaxOne.mockAPI.reverseTransaction(txnId);
          panel.querySelector('#rev-result').innerHTML=`<div class="hx-success-card">✓ ${res.ResultDesc}</div>`;
          window.HaxOne.toast.show('Transaction reversal initiated ✓','success');
        }catch(e){panel.querySelector('#rev-result').innerHTML=`<div style="color:var(--hx-error)">${e.message}</div>`;}
        finally{btn.classList.remove('hx-btn--loading');btn.textContent='↩ Initiate Reversal';}
      });
    },

    _panelB2B(panel) {
      panel.innerHTML = `
        <div class="hx-card">
          <h3 class="hx-mb-16">🏢 B2B Payment — Business to Business</h3>
          <div class="hx-form-row">
            <div class="hx-form-group"><label class="hx-label">Receiver Short Code</label><input id="b2b-code" class="hx-input" placeholder="Paybill / Till number"></div>
            <div class="hx-form-group"><label class="hx-label">Amount (KES)</label><input id="b2b-amount" class="hx-input" type="number" min="1" placeholder="0.00"></div>
          </div>
          <div class="hx-form-group"><label class="hx-label">Account Reference</label><input id="b2b-ref" class="hx-input" placeholder="Invoice / reference number"></div>
          <button id="b2b-btn" class="hx-btn hx-btn--primary">🏢 Send B2B Payment</button>
          <div id="b2b-result" style="margin-top:12px"></div>
        </div>
      `;
      panel.querySelector('#b2b-btn').addEventListener('click', async () => {
        const btn=panel.querySelector('#b2b-btn');
        btn.classList.add('hx-btn--loading');btn.textContent='';
        try{
          const res=await window.HaxOne.mockAPI.b2cPayment({phone:panel.querySelector('#b2b-code').value,amount:parseFloat(panel.querySelector('#b2b-amount').value)||0,occasion:panel.querySelector('#b2b-ref').value});
          panel.querySelector('#b2b-result').innerHTML=`<div class="hx-success-card">✓ B2B payment initiated. Receipt: <strong>${res.TransactionReceipt}</strong></div>`;
          window.HaxOne.toast.show('B2B payment sent ✓','success');
        }catch(e){panel.querySelector('#b2b-result').innerHTML=`<div style="color:var(--hx-error)">${e.message}</div>`;}
        finally{btn.classList.remove('hx-btn--loading');btn.textContent='🏢 Send B2B Payment';}
      });
    },

    async _generateReport() {
      const btn = document.querySelector('[onclick*="_generateReport"]');
      if (btn) btn.classList.add('hx-btn--loading');
      const date = document.getElementById('mp-report-date')?.value || new Date().toISOString().split('T')[0];
      try {
        const rep = await window.HaxOne.mockAPI.getSettlementReport(date);
        const result = document.getElementById('mp-report-result');
        if (result) {
          result.style.display = 'block';
          result.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px">
              ${[['Total Txns',rep.totalTransactions,'#6C63FF'],['Successful',rep.successful,'#00E676'],['Failed',rep.failed,'#FF5252'],['Net Amount',window.HaxOne.utils.formatCurrency(rep.netAmount),'#00D4FF']].map(([l,v,c])=>`
                <div style="background:var(--hx-surface-2);border-radius:8px;padding:12px;text-align:center">
                  <div style="font-size:18px;font-weight:800;color:${c}">${v}</div>
                  <div style="font-size:11px;color:var(--hx-text-muted)">${l}</div>
                </div>`).join('')}
            </div>
            <div class="hx-table-wrapper">
              <table class="hx-table">
                <thead><tr><th>Gateway</th><th>Transactions</th><th>Amount</th><th>Fees</th></tr></thead>
                <tbody>${rep.gateways.map(g=>`<tr><td>${window.HaxOne.utils.gatewayLabel(g.name)}</td><td>${g.transactions}</td><td>${window.HaxOne.utils.formatCurrency(g.amount)}</td><td>${window.HaxOne.utils.formatCurrency(g.fees)}</td></tr>`).join('')}</tbody>
              </table>
            </div>
          `;
        }
        window.HaxOne.toast.show('Settlement report generated for '+date,'success');
      } catch(e) { window.HaxOne.toast.show('Report generation failed: '+e.message,'error'); }
      if (btn) btn.classList.remove('hx-btn--loading');
    },

    destroy() { this._activePanel = null; }
  };
})();
