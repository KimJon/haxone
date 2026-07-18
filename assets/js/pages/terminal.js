/* ============================================================
   HaxOne — pages/terminal.js
   Payment Terminal — M-Pesa STK + PayPal first
   ============================================================ */
(function () {
  'use strict';
  window.HaxOnePages = window.HaxOnePages || {};

  window.HaxOnePages['terminal'] = {
    _state: { amount: '', discount: 0, selectedMethod: 'mpesa_stk' },

    render(container) {
      const store = window.HaxOne.store;
      const utils = window.HaxOne.utils;
      const settings = store.get('settings') || {};
      const taxRate = settings.taxRate || 0.16;
      const s = this._state;
      s.amount = ''; s.discount = 0; s.selectedMethod = 'mpesa_stk';

      const ALL_METHODS = [
        { id:'mpesa_stk',     label:'M-Pesa STK Push',  icon:'📱', group:'featured',      color:'#00a651' },
        { id:'paypal',        label:'PayPal',            icon:'🅿️', group:'featured',      color:'#003087' },
        { id:'mpesa_till',    label:'M-Pesa Till',       icon:'🏪', group:'mobile_money' },
        { id:'mpesa_paybill', label:'Paybill',           icon:'🏦', group:'mobile_money' },
        { id:'mpesa_qr',      label:'M-Pesa QR',         icon:'📲', group:'mobile_money' },
        { id:'mpesa_pochi',   label:'Pochi la Biashara', icon:'👛', group:'mobile_money' },
        { id:'airtel_money',  label:'Airtel Money',      icon:'📶', group:'mobile_money' },
        { id:'mtn_momo',      label:'MTN MoMo',          icon:'🟡', group:'mobile_money' },
        { id:'orange_money',  label:'Orange Money',      icon:'🟠', group:'mobile_money' },
        { id:'cellulant',     label:'Cellulant',         icon:'🟢', group:'digital' },
        { id:'stripe',        label:'Stripe',            icon:'⚡', group:'digital' },
        { id:'flutterwave',   label:'Flutterwave',       icon:'🌊', group:'digital' },
        { id:'pesapal',       label:'Pesapal',           icon:'💰', group:'digital' },
        { id:'paystack',      label:'Paystack',          icon:'⚡', group:'digital' },
        { id:'dpo',           label:'DPO Group',         icon:'🌍', group:'digital' },
        { id:'yoco',          label:'Yoco',              icon:'💳', group:'digital' },
        { id:'card_visa',     label:'Visa',              icon:'💳', group:'cards' },
        { id:'card_mastercard',label:'Mastercard',       icon:'💳', group:'cards' },
        { id:'card_amex',     label:'Amex',              icon:'💳', group:'cards' },
        { id:'google_pay',    label:'Google Pay',        icon:'🔵', group:'cards' },
        { id:'apple_pay',     label:'Apple Pay',         icon:'🍎', group:'cards' },
        { id:'cash',          label:'Cash',              icon:'💵', group:'other' },
        { id:'bank_transfer', label:'Bank Transfer',     icon:'🏦', group:'other' },
        { id:'gift_card',     label:'Gift Card',         icon:'🎁', group:'other' },
        { id:'store_credit',  label:'Store Credit',      icon:'⭐', group:'other' },
      ];

      const nonFeatured = ALL_METHODS.filter(m => m.group !== 'featured');
      const groups = { mobile_money:'Mobile Money', digital:'Digital Wallets', cards:'Cards & Wallets', other:'Other Methods' };

      container.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 440px;gap:20px;height:calc(100vh - 88px - 48px);min-height:600px">

          <!-- LEFT: Amount + Numpad -->
          <div style="display:flex;flex-direction:column;gap:16px;overflow-y:auto;padding-right:4px">
            <div class="hx-amount-display">
              <div class="hx-amount-main"><span class="hx-amount-currency">KSh</span><span id="t-amount-display">0.00</span></div>
              <div class="hx-amount-breakdown">
                <div class="hx-amount-row"><span>Subtotal</span><span id="t-subtotal">KSh 0.00</span></div>
                <div class="hx-amount-row"><span>Tax (${(taxRate*100).toFixed(0)}%)</span><span id="t-tax">KSh 0.00</span></div>
                <div class="hx-amount-row"><span>Discount</span><span id="t-discount" style="color:var(--hx-success)">-KSh 0.00</span></div>
                <div class="hx-amount-row total"><span>Total Due</span><span id="t-total">KSh 0.00</span></div>
              </div>
            </div>

            <!-- Quick amounts -->
            <div>
              <div class="hx-text-label hx-mb-8">Quick Amounts</div>
              <div class="hx-quick-amounts">
                ${[100,250,500,1000,2000,5000,10000,20000].map(v=>`<button class="hx-quick-btn" data-quick="${v}">${v>=1000?(v/1000)+'k':v}</button>`).join('')}
              </div>
            </div>

            <!-- Numpad -->
            <div class="hx-numpad" id="t-numpad">
              ${[1,2,3,4,5,6,7,8,9,'.',0,'⌫'].map(k=>`<button class="hx-numpad-key${k==='⌫'?' hx-numpad-key--del':''}" data-key="${k}">${k}</button>`).join('')}
            </div>

            <!-- Discount -->
            <div style="display:flex;gap:8px;align-items:flex-end">
              <div class="hx-form-group" style="flex:1;margin-bottom:0">
                <label class="hx-label">Discount Amount (KSh)</label>
                <input id="t-discount-input" class="hx-input" type="number" min="0" placeholder="0.00">
              </div>
              <button class="hx-btn hx-btn--secondary" onclick="window.HaxOnePages.terminal._applyDiscount()">Apply</button>
              <button class="hx-btn hx-btn--ghost" onclick="window.HaxOnePages.terminal._clearAll()">Clear</button>
              <button class="hx-btn hx-btn--ghost" onclick="window.HaxOnePages.terminal._splitBill()">Split</button>
              <button class="hx-btn hx-btn--ghost" onclick="window.HaxOnePages.terminal._partialPayment()">Partial</button>
            </div>

            <!-- Recent Transactions -->
            <div class="hx-card" style="flex:1">
              <div class="hx-flex hx-items-center hx-justify-between hx-mb-12">
                <div style="font-size:13px;font-weight:600">Recent Transactions</div>
                <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOne.navigate('transactions')">View all →</button>
              </div>
              <div id="t-recent-list" style="display:flex;flex-direction:column;gap:6px">
                ${(window.HaxOne.store.get('transactions')||[]).slice(0,5).map(t=>`
                  <div style="display:flex;align-items:center;gap:8px;padding:6px;border-radius:6px;background:var(--hx-surface-2)">
                    <span style="font-size:16px">${utils.methodIcon(t.method)}</span>
                    <div style="flex:1;min-width:0">
                      <div style="font-size:12px;font-weight:600">${utils.methodLabel(t.method)}</div>
                      <div style="font-size:11px;color:var(--hx-text-muted)">${utils.formatDate(t.timestamp,'relative')}</div>
                    </div>
                    <div style="text-align:right">
                      <div style="font-size:12px;font-weight:700">${utils.formatCurrency(t.amount)}</div>
                      ${utils.statusBadge(t.status)}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- RIGHT: Payment Methods + Flow -->
          <div style="display:flex;flex-direction:column;gap:12px;overflow-y:auto;padding-right:2px">

            <!-- FEATURED: M-Pesa STK -->
            <div class="hx-card" id="method-mpesa_stk" data-method="mpesa_stk" style="border:2px solid rgba(0,166,81,0.4);cursor:pointer;padding:14px;background:rgba(0,166,81,0.05)" onclick="window.HaxOnePages.terminal._selectMethod('mpesa_stk')">
              <div class="hx-flex hx-items-center hx-gap-10">
                <div style="width:44px;height:44px;border-radius:10px;background:rgba(0,166,81,0.12);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">📱</div>
                <div style="flex:1">
                  <div style="font-size:14px;font-weight:700;color:var(--hx-text)">M-Pesa STK Push</div>
                  <div style="font-size:11px;color:var(--hx-text-muted)">Instant • Auto-confirm • Kenya's #1</div>
                </div>
                <span class="hx-badge hx-badge--success" style="font-size:10px">FEATURED</span>
              </div>
            </div>

            <!-- FEATURED: PayPal -->
            <div class="hx-card" id="method-paypal" data-method="paypal" style="border:2px solid rgba(0,48,135,0.35);cursor:pointer;padding:14px;background:rgba(0,48,135,0.05)" onclick="window.HaxOnePages.terminal._selectMethod('paypal')">
              <div class="hx-flex hx-items-center hx-gap-10">
                <div style="width:44px;height:44px;border-radius:10px;background:rgba(0,48,135,0.12);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">🅿️</div>
                <div style="flex:1">
                  <div style="font-size:14px;font-weight:700;color:var(--hx-text)">PayPal</div>
                  <div style="font-size:11px;color:var(--hx-text-muted)">Secure • Global • 400M+ users</div>
                </div>
                <span class="hx-badge hx-badge--info" style="font-size:10px">ONLINE</span>
              </div>
            </div>

            <!-- Other methods -->
            <div style="max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:8px">
              ${Object.entries(groups).map(([gId, gName]) => {
                const gMethods = nonFeatured.filter(m=>m.group===gId);
                if (!gMethods.length) return '';
                return `<div>
                  <div class="hx-text-label" style="padding:4px 0">${gName}</div>
                  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">
                    ${gMethods.map(m=>`
                      <div class="hx-pay-method" data-method="${m.id}" onclick="window.HaxOnePages.terminal._selectMethod('${m.id}')" id="method-${m.id}">
                        <span class="hx-pay-method-icon">${m.icon}</span>
                        <span style="font-size:11px">${m.label}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>`;
              }).join('')}
            </div>

            <!-- Payment Flow Area -->
            <div id="t-flow-area" class="hx-card" style="flex:1;min-height:200px">
              <div style="text-align:center;padding:20px;color:var(--hx-text-muted)">
                <div style="font-size:32px;margin-bottom:8px">💳</div>
                <div style="font-size:13px">Enter amount and select a payment method above, then press Charge</div>
              </div>
            </div>

            <!-- Charge Button -->
            <button id="t-charge-btn" class="hx-charge-btn" disabled onclick="window.HaxOnePages.terminal._charge()">
              ⚡ Charge KSh 0.00
            </button>
          </div>
        </div>
      `;

      this._bindNumpad(container, taxRate);
      this._selectMethod('mpesa_stk');
    },

    _selectMethod(method) {
      this._state.selectedMethod = method;
      document.querySelectorAll('[data-method]').forEach(el => {
        const m = el.getAttribute('data-method');
        el.classList.toggle('hx-pay-method--active', m === method);
        if (m === 'mpesa_stk' || m === 'paypal') {
          el.style.borderColor = m === method ? (m==='mpesa_stk'?'rgba(0,166,81,0.8)':'rgba(0,112,186,0.8)') : (m==='mpesa_stk'?'rgba(0,166,81,0.4)':'rgba(0,48,135,0.35)');
        }
      });
    },

    _bindNumpad(container, taxRate) {
      const s = this._state;
      const self = this;

      const updateDisplay = () => {
        const raw = parseFloat(s.amount) || 0;
        const disc = parseFloat(s.discount) || 0;
        const tax = raw * taxRate;
        const total = Math.max(0, raw + tax - disc);
        const displayStr = s.amount === '' ? '0.00' : (s.amount.endsWith('.') ? s.amount + '—' : parseFloat(s.amount).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2}));
        const el = document.getElementById('t-amount-display'); if (el) el.textContent = displayStr;
        const f = v => 'KSh ' + v.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2});
        ['t-subtotal','t-tax','t-discount','t-total'].forEach((id,i) => {
          const e2 = document.getElementById(id);
          if (e2) e2.textContent = i===2?'-'+f(disc) : f([raw,tax,disc,total][i]);
        });
        const cb = document.getElementById('t-charge-btn');
        if (cb) { cb.disabled = total <= 0; cb.textContent = `⚡ Charge ${f(total)}`; }
      };

      container.querySelector('#t-numpad').addEventListener('click', e => {
        const key = e.target.dataset.key;
        if (!key) return;
        if (key === '⌫') { s.amount = s.amount.slice(0,-1); }
        else if (key === '.') { if (!s.amount.includes('.')) s.amount += '.'; }
        else {
          if (s.amount.includes('.') && s.amount.split('.')[1].length >= 2) return;
          s.amount += key;
        }
        updateDisplay();
      });

      container.querySelectorAll('.hx-quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          s.amount = btn.dataset.quick;
          updateDisplay();
        });
      });
    },

    _applyDiscount() {
      const inp = document.getElementById('t-discount-input');
      this._state.discount = parseFloat(inp && inp.value) || 0;
      const container = document.getElementById('hx-page-content');
      const taxRate = (window.HaxOne.store.get('settings')||{}).taxRate || 0.16;
      const raw = parseFloat(this._state.amount) || 0;
      const tax = raw * taxRate;
      const disc = this._state.discount;
      const total = Math.max(0, raw + tax - disc);
      const f = v => 'KSh ' + v.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2});
      const d = document.getElementById('t-discount'); if (d) d.textContent = '-' + f(disc);
      const t = document.getElementById('t-total');    if (t) t.textContent = f(total);
      const cb = document.getElementById('t-charge-btn');
      if (cb) { cb.disabled = total <= 0; cb.textContent = `⚡ Charge ${f(total)}`; }
      window.HaxOne.toast.show('Discount of KSh ' + disc.toFixed(2) + ' applied', 'success');
    },

    _clearAll() {
      this._state.amount = '';
      this._state.discount = 0;
      const inp = document.getElementById('t-discount-input'); if (inp) inp.value = '';
      ['t-amount-display','t-subtotal','t-tax','t-discount','t-total'].forEach(id => {
        const e = document.getElementById(id);
        if (e) e.textContent = id==='t-amount-display'?'0.00':id==='t-discount'?'-KSh 0.00':'KSh 0.00';
      });
      const cb = document.getElementById('t-charge-btn'); if (cb) { cb.disabled=true; cb.textContent='⚡ Charge KSh 0.00'; }
      const flow = document.getElementById('t-flow-area');
      if (flow) flow.innerHTML = `<div style="text-align:center;padding:20px;color:var(--hx-text-muted)"><div style="font-size:32px;margin-bottom:8px">💳</div><div style="font-size:13px">Enter amount and select a payment method, then press Charge</div></div>`;
    },

    _splitBill() {
      window.HaxOne.modal.open({
        title: '🔀 Split Bill',
        size: 'sm',
        content: `
          <div class="hx-form-group">
            <label class="hx-label">Total Amount</label>
            <input class="hx-input" value="${window.HaxOne.utils.formatCurrency(parseFloat(this._state.amount)||0)}" readonly>
          </div>
          <div class="hx-form-group">
            <label class="hx-label">Number of People</label>
            <input id="split-count" class="hx-input" type="number" min="2" max="20" value="2">
          </div>
          <div id="split-result" style="background:var(--hx-surface-2);border-radius:8px;padding:12px;text-align:center;margin-top:8px">
            <div style="font-size:22px;font-weight:800;color:var(--hx-primary)" id="split-amount">${window.HaxOne.utils.formatCurrency((parseFloat(this._state.amount)||0)/2)}</div>
            <div style="font-size:12px;color:var(--hx-text-muted)">per person</div>
          </div>
        `,
        actions: [{ label:'Close', type:'ghost', id:'close', onClick:()=>window.HaxOne.modal.close() }]
      });
      setTimeout(() => {
        const inp = document.getElementById('split-count');
        if (inp) inp.addEventListener('input', () => {
          const n = Math.max(1, parseInt(inp.value)||1);
          const ea = (parseFloat(this._state.amount)||0) / n;
          const el = document.getElementById('split-amount');
          if (el) el.textContent = window.HaxOne.utils.formatCurrency(ea);
        });
      }, 100);
    },

    _partialPayment() {
      window.HaxOne.modal.open({
        title: '🌗 Partial Payment',
        size: 'sm',
        content: `
          <div class="hx-form-group">
            <label class="hx-label">Total Amount</label>
            <input class="hx-input" value="${window.HaxOne.utils.formatCurrency(parseFloat(this._state.amount)||0)}" readonly>
          </div>
          <div class="hx-form-group">
            <label class="hx-label">Partial Amount (KSh)</label>
            <input id="partial-amount" class="hx-input" type="number" min="1" placeholder="Enter amount to pay now">
          </div>
        `,
        actions: [
          { label:'Cancel', type:'ghost', id:'close', onClick:()=>window.HaxOne.modal.close() },
          { label:'Apply Partial', type:'primary', id:'apply-partial', onClick:() => {
              const el = document.getElementById('partial-amount');
              const partial = parseFloat(el?.value) || 0;
              const total = parseFloat(this._state.amount) || 0;
              if (partial > 0 && partial <= total) {
                this._state.amount = partial.toString();
                const taxRate = (window.HaxOne.store.get('settings')||{}).taxRate || 0.16;
                const raw = partial;
                const tax = raw * taxRate;
                const disc = this._state.discount;
                const finalTotal = Math.max(0, raw + tax - disc);
                const displayStr = this._state.amount === '' ? '0.00' : parseFloat(this._state.amount).toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2});
                const amtEl = document.getElementById('t-amount-display'); if(amtEl) amtEl.textContent = displayStr;
                const f = v => 'KSh ' + v.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2});
                const subEl = document.getElementById('t-subtotal'); if(subEl) subEl.textContent = f(raw);
                const taxEl = document.getElementById('t-tax'); if(taxEl) taxEl.textContent = f(tax);
                const dEl = document.getElementById('t-discount'); if (dEl) dEl.textContent = '-' + f(disc);
                const tEl = document.getElementById('t-total');    if (tEl) tEl.textContent = f(finalTotal);
                const cb = document.getElementById('t-charge-btn');
                if (cb) { cb.disabled = finalTotal <= 0; cb.textContent = '⚡ Charge ' + f(finalTotal); }
                window.HaxOne.modal.close();
                window.HaxOne.toast.show('Partial payment amount set to ' + f(partial), 'info');
              } else {
                window.HaxOne.toast.show('Enter a valid partial amount', 'error');
              }
          }}
        ]
      });
    },

    _charge() {
      const s = this._state;
      const taxRate = (window.HaxOne.store.get('settings')||{}).taxRate || 0.16;
      const raw = parseFloat(s.amount) || 0;
      if (raw <= 0) return;
      const total = Math.max(0, raw + raw * taxRate - (s.discount || 0));
      const flowArea = document.getElementById('t-flow-area');
      if (!flowArea) return;

      if (s.selectedMethod === 'mpesa_stk') {
        window.HaxOne.paymentFlow.initSTK(flowArea, {
          amount: total,
          onSuccess: (res) => this._onPaymentSuccess({ ...res, amount: total }),
          onFailure: (err) => window.HaxOne.toast.show('Payment failed: ' + (err.message||'Unknown error'), 'error'),
          onCancel: () => {
            flowArea.innerHTML = `<div style="text-align:center;padding:20px;color:var(--hx-text-muted)"><div style="font-size:32px;margin-bottom:8px">❌</div><div>Payment cancelled</div></div>`;
          }
        });
      } else if (s.selectedMethod === 'paypal') {
        window.HaxOne.paymentFlow.initPayPal(flowArea, {
          amount: total,
          onSuccess: (res) => this._onPaymentSuccess({ ...res, amount: total }),
          onFailure: () => window.HaxOne.toast.show('PayPal payment failed.', 'error'),
          onCancel: () => {
            flowArea.innerHTML = `<div style="text-align:center;padding:20px;color:var(--hx-text-muted)"><div style="font-size:32px;margin-bottom:8px">❌</div><div>Payment cancelled</div></div>`;
          }
        });
      } else if (s.selectedMethod === 'cash') {
        this._showCashFlow(flowArea, total);
      } else {
        this._showGenericFlow(flowArea, total, s.selectedMethod);
      }
    },

    _showCashFlow(flowArea, total) {
      const fmt = window.HaxOne.utils.formatCurrency;
      flowArea.innerHTML = `
        <div>
          <div style="font-size:32px;text-align:center;margin-bottom:12px">💵</div>
          <h3 style="text-align:center;margin-bottom:16px">Cash Payment</h3>
          <div style="background:var(--hx-surface-2);padding:12px;border-radius:8px;margin-bottom:16px;text-align:center">
            <div style="color:var(--hx-text-muted);font-size:12px">Amount Due</div>
            <div style="font-size:24px;font-weight:800;color:var(--hx-text)">${fmt(total)}</div>
          </div>
          <div class="hx-form-group">
            <label class="hx-label">Cash Received</label>
            <input id="cash-received" class="hx-input" type="number" placeholder="0.00" style="font-size:18px;text-align:right">
          </div>
          <div style="background:rgba(0,230,118,0.08);border:1px solid rgba(0,230,118,0.2);border-radius:8px;padding:12px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
            <span style="color:var(--hx-text-muted)">Change Due</span>
            <span id="cash-change" style="font-size:20px;font-weight:800;color:var(--hx-success)">${fmt(0)}</span>
          </div>
          <button id="cash-complete-btn" class="hx-btn hx-btn--success hx-w-full" style="padding:14px;font-size:15px" disabled>✓ Complete Cash Sale</button>
        </div>
      `;
      const inp = flowArea.querySelector('#cash-received');
      const changeEl = flowArea.querySelector('#cash-change');
      const btn = flowArea.querySelector('#cash-complete-btn');
      inp.addEventListener('input', () => {
        const received = parseFloat(inp.value) || 0;
        const change = Math.max(0, received - total);
        changeEl.textContent = fmt(change);
        changeEl.style.color = received >= total ? 'var(--hx-success)' : 'var(--hx-error)';
        btn.disabled = received < total;
      });
      btn.addEventListener('click', () => {
        this._onPaymentSuccess({ amount: total, method: 'cash', receipt: window.HaxOne.utils.generateId('RCP') });
      });
      inp.focus();
    },

    _showGenericFlow(flowArea, total, method) {
      const utils = window.HaxOne.utils;
      flowArea.innerHTML = `
        <div style="text-align:center;padding:16px">
          <div style="font-size:40px;margin-bottom:8px">${utils.methodIcon(method)}</div>
          <h3 style="margin-bottom:4px">${utils.methodLabel(method)}</h3>
          <p style="color:var(--hx-text-muted);font-size:13px;margin-bottom:20px">Processing via ${utils.methodLabel(method)}</p>
          <div style="background:var(--hx-surface-2);border-radius:8px;padding:12px;margin-bottom:20px">
            <div style="font-size:22px;font-weight:800">${utils.formatCurrency(total)}</div>
          </div>
          <button id="generic-pay-btn" class="hx-btn hx-btn--primary hx-w-full" style="padding:14px;font-size:15px">Process ${utils.formatCurrency(total)} Payment</button>
        </div>
      `;
      flowArea.querySelector('#generic-pay-btn').addEventListener('click', async (e) => {
        const btn = e.target; btn.classList.add('hx-btn--loading'); btn.textContent = '';
        await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
        if (Math.random() > 0.08) {
          btn.classList.remove('hx-btn--loading');
          this._onPaymentSuccess({ amount: total, method, receipt: utils.generateId('RCP') });
        } else {
          btn.classList.remove('hx-btn--loading'); btn.textContent = 'Process Payment';
          window.HaxOne.toast.show('Payment declined. Please try again.', 'error');
        }
      });
    },

    _onPaymentSuccess(data) {
      const utils = window.HaxOne.utils;
      const settings = window.HaxOne.store.get('settings') || {};
      const txn = {
        id: utils.generateId('TXN'),
        mpesaRef: data.receipt || null,
        amount: data.amount,
        currency: 'KES',
        method: data.method || this._state.selectedMethod,
        status: 'success',
        gateway: data.method === 'paypal' ? 'paypal' : data.method && data.method.startsWith('mpesa') ? 'daraja' : 'local',
        fee: Math.round(data.amount * 0.015 * 100) / 100,
        timestamp: new Date().toISOString(),
        receipt: data.receipt || utils.generateId('RCP')
      };
      window.HaxOne.store.update('transactions', ts => [txn, ...ts]);
      window.dispatchEvent(new CustomEvent('hx:newTransaction', { detail: txn }));

      // Show receipt modal
      window.HaxOne.modal.open({
        title: '🧾 Payment Receipt',
        size: 'sm',
        content: `
          <div class="hx-receipt">
            <div class="hx-receipt-header">
              <div class="hx-receipt-business">${settings.businessName || 'HaxOne Store'}</div>
              <div style="font-size:11px;color:#666;margin-top:4px">${settings.businessEmail || ''}</div>
            </div>
            <div class="hx-receipt-row"><span>Date</span><span>${utils.formatDate(txn.timestamp,'date')}</span></div>
            <div class="hx-receipt-row"><span>Time</span><span>${utils.formatDate(txn.timestamp,'time')}</span></div>
            <div class="hx-receipt-row"><span>Receipt #</span><span>${txn.receipt}</span></div>
            <div class="hx-receipt-divider"></div>
            <div class="hx-receipt-row"><span>Subtotal</span><span>${utils.formatCurrency(parseFloat(this._state.amount)||data.amount)}</span></div>
            <div class="hx-receipt-row"><span>Tax (16%)</span><span>${utils.formatCurrency((parseFloat(this._state.amount)||0)*0.16)}</span></div>
            ${this._state.discount>0?`<div class="hx-receipt-row"><span>Discount</span><span>-${utils.formatCurrency(this._state.discount)}</span></div>`:''}
            <div class="hx-receipt-divider"></div>
            <div class="hx-receipt-row hx-receipt-total"><span>TOTAL PAID</span><span>${utils.formatCurrency(data.amount)}</span></div>
            <div class="hx-receipt-divider"></div>
            <div class="hx-receipt-row"><span>Method</span><span>${utils.methodLabel(txn.method)}</span></div>
            ${txn.mpesaRef?`<div class="hx-receipt-row"><span>M-Pesa Ref</span><span>${txn.mpesaRef}</span></div>`:''}
            <div class="hx-receipt-footer">Thank you for your business!<br>Powered by HaxOne</div>
          </div>
          <div class="hx-flex hx-gap-8 hx-mt-16" style="justify-content:center">
            <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.print()">🖨️ Print</button>
            <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOne.toast.show('Email receipt sent to customer ✓','success')">📧 Email</button>
            ${settings.smsEnabled?`<button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOne.toast.show('SMS receipt sent ✓','success')">📱 SMS</button>`:''}
            ${settings.whatsappEnabled?`<button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOne.toast.show('WhatsApp receipt sent ✓','success')">💬 WhatsApp</button>`:''}
          </div>
        `,
        actions: [{ label:'✓ New Sale', type:'primary', id:'new-sale', onClick:()=>{ window.HaxOne.modal.close(); this._clearAll(); } }]
      });
    },

    destroy() {}
  };
})();
