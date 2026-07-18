/* ============================================================
   HaxOne — components/payment-flow.js
   STK Push + PayPal flow wizards
   ============================================================ */
(function () {
  'use strict';

  const PaymentFlow = {

    /* ══ M-Pesa STK Push Flow ══ */
    initSTK(container, config) {
      config = config || {};
      const { amount, onSuccess, onFailure, onCancel } = config;
      const fmt = window.HaxOne.utils.formatCurrency;
      let stage = 1, checkoutId = null, countdownTimer = null, resendTimer = null, pollAborted = false;

      const render = (html) => { container.innerHTML = html; };

      const showStage1 = () => {
        render(`
          <div style="text-align:center;padding:8px 0 16px">
            <div style="font-size:40px;margin-bottom:8px">📱</div>
            <h3 style="color:var(--hx-text);margin-bottom:4px">M-Pesa STK Push</h3>
            <p style="color:var(--hx-text-muted);font-size:13px">Customer will receive a PIN prompt on their phone</p>
          </div>

          <div style="background:rgba(0,166,81,0.08);border:1px solid rgba(0,166,81,0.2);border-radius:var(--hx-radius);padding:14px 18px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center">
            <span style="color:var(--hx-text-muted);font-size:13px">Amount Due</span>
            <span style="font-size:20px;font-weight:800;color:#00a651">${fmt(amount)}</span>
          </div>

          <div class="hx-form-group">
            <label class="hx-label">Customer Phone Number</label>
            <div class="hx-flex hx-gap-8">
              <div class="hx-input-prefix" style="border-radius:var(--hx-radius-sm) 0 0 var(--hx-radius-sm)">🇰🇪 +254</div>
              <input id="stk-phone" class="hx-input" placeholder="7XX XXX XXX" maxlength="9" type="tel" style="border-radius:0 var(--hx-radius-sm) var(--hx-radius-sm) 0">
            </div>
          </div>

          <div class="hx-form-group">
            <label class="hx-label">Account Reference <span style="color:var(--hx-text-dim)">(optional)</span></label>
            <input id="stk-ref" class="hx-input" placeholder="Order #, Invoice #…" value="HaxOne Sale">
          </div>

          <button id="stk-initiate-btn" class="hx-btn hx-btn--mpesa hx-w-full" style="margin-top:4px;padding:14px;font-size:15px" disabled>
            📱 Send STK Push
          </button>
          <button class="hx-btn hx-btn--ghost hx-w-full" style="margin-top:8px" onclick="if(window.HaxOne.paymentFlow._onCancel)window.HaxOne.paymentFlow._onCancel()">
            Cancel
          </button>
        `);
        window.HaxOne.paymentFlow._onCancel = onCancel;

        const phoneInput = container.querySelector('#stk-phone');
        const btn = container.querySelector('#stk-initiate-btn');
        phoneInput.addEventListener('input', () => {
          btn.disabled = phoneInput.value.replace(/\D/g,'').length < 9;
        });
        phoneInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !btn.disabled) btn.click(); });
        btn.addEventListener('click', () => {
          const phone = '254' + phoneInput.value.replace(/\D/g,'');
          const ref   = container.querySelector('#stk-ref').value || 'HaxOne';
          initSTK(phone, ref);
        });
        setTimeout(() => phoneInput.focus(), 100);
      };

      const initSTK = async (phone, ref) => {
        pollAborted = false;
        const btn = container.querySelector('#stk-initiate-btn');
        if (btn) { btn.classList.add('hx-btn--loading'); btn.disabled = true; btn.textContent = ''; }

        try {
          const res = await window.HaxOne.mockAPI.initSTKPush({ phone, amount, accountRef: ref, description: 'HaxOne Payment' });
          checkoutId = res.CheckoutRequestID;
          showStage2(phone, ref);
          pollForResult();
        } catch(e) {
          if (btn) { btn.classList.remove('hx-btn--loading'); btn.disabled = false; btn.textContent = '📱 Send STK Push'; }
          window.HaxOne.toast.show(e.message || 'STK Push failed. Please try again.', 'error');
        }
      };

      const showStage2 = (phone, ref) => {
        stage = 2;
        let seconds = 60, resendAllowed = false;
        render(`
          <div style="text-align:center;padding:20px 0">
            <div style="position:relative;display:inline-block;margin-bottom:24px">
              <div style="width:80px;height:80px;border-radius:50%;background:rgba(0,166,81,0.12);display:flex;align-items:center;justify-content:center;font-size:36px;position:relative" id="stk-phone-icon">
                📱
                <div class="hx-stk-rings"></div>
              </div>
            </div>
            <h3 style="color:var(--hx-text);margin-bottom:8px">STK Push Sent!</h3>
            <p style="color:var(--hx-text-muted);font-size:13px;margin-bottom:4px">Prompt sent to <strong style="color:var(--hx-text)">+${phone}</strong></p>
            <p style="color:var(--hx-text-muted);font-size:13px">Ask customer to enter their M-Pesa PIN</p>
          </div>

          <div style="background:var(--hx-surface-2);border:1px solid var(--hx-border);border-radius:var(--hx-radius);padding:16px;margin-bottom:16px">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px">
              <span style="font-size:13px;color:var(--hx-text-muted)">Status</span>
              <span style="color:var(--hx-warning);font-size:13px;font-weight:600" id="stk-status-text">
                ⏳ Waiting for PIN…<span class="hx-typing-dot"></span><span class="hx-typing-dot"></span><span class="hx-typing-dot"></span>
              </span>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="font-size:13px;color:var(--hx-text-muted)">Expires in</span>
              <span style="font-size:13px;font-weight:700;color:var(--hx-text)" id="stk-countdown">60s</span>
            </div>
          </div>

          <div id="stk-log" style="background:var(--hx-surface-2);border:1px solid var(--hx-border);border-radius:var(--hx-radius-sm);padding:12px;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--hx-text-muted);max-height:90px;overflow-y:auto;margin-bottom:16px"></div>

          <div class="hx-flex hx-gap-8">
            <button id="stk-resend-btn" class="hx-btn hx-btn--ghost hx-flex-1" disabled>⟳ Resend (20s)</button>
            <button class="hx-btn hx-btn--danger" onclick="if(window.HaxOne.paymentFlow._onCancel){pollAborted=true;clearInterval(window.HaxOne.paymentFlow._countdown);clearTimeout(window.HaxOne.paymentFlow._resendT);window.HaxOne.paymentFlow._onCancel()}" style="min-width:90px">Cancel</button>
          </div>
        `);

        const log = container.querySelector('#stk-log');
        const addLog = msg => { if (log) log.innerHTML += `<div>${new Date().toLocaleTimeString()} — ${msg}</div>`; log.scrollTop = 999; };
        addLog('STK Push initiated successfully');
        addLog(`PIN prompt sent to +${phone}`);

        // Countdown
        countdownTimer = setInterval(() => {
          seconds--;
          const el = container.querySelector('#stk-countdown');
          if (el) el.textContent = seconds + 's';
          if (seconds === 20) {
            const rb = container.querySelector('#stk-resend-btn');
            if (rb) { rb.disabled = false; rb.textContent = '⟳ Resend STK'; }
          }
          if (seconds <= 0) {
            clearInterval(countdownTimer);
            addLog('Request timed out');
            showStage3Fail({ ResultCode: 'TIMEOUT', ResultDesc: 'Payment request expired. Please try again.' });
          }
        }, 1000);
        window.HaxOne.paymentFlow._countdown = countdownTimer;

        const rb = container.querySelector('#stk-resend-btn');
        if (rb) rb.addEventListener('click', () => {
          addLog('Resending STK Push…');
          initSTK(phone, ref);
        });
      };

      const pollForResult = async () => {
        try {
          const res = await window.HaxOne.mockAPI.pollSTKStatus(checkoutId);
          if (pollAborted) return;
          clearInterval(countdownTimer);
          if (res.ResultCode === '0') {
            showStage3Success(res);
          } else {
            showStage3Fail(res);
          }
        } catch(e) {
          if (!pollAborted) showStage3Fail({ ResultCode: 'ERROR', ResultDesc: e.message });
        }
      };

      const showStage3Success = (res) => {
        stage = 3;
        render(`
          <div style="text-align:center;padding:20px 0">
            <svg width="80" height="80" viewBox="0 0 80 80" style="margin-bottom:16px">
              <circle cx="40" cy="40" r="36" fill="rgba(0,230,118,0.12)" stroke="#00E676" stroke-width="3" class="hx-success-circle-path"/>
              <path d="M24 40 L35 51 L56 29" fill="none" stroke="#00E676" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="hx-check-path"/>
            </svg>
            <h3 style="color:var(--hx-success);margin-bottom:8px;font-size:20px">Payment Successful! 🎉</h3>
            <p style="color:var(--hx-text-muted);font-size:13px">M-Pesa transaction confirmed</p>
          </div>

          <div style="background:var(--hx-success-bg);border:1px solid rgba(0,230,118,0.2);border-radius:var(--hx-radius);padding:16px;margin-bottom:16px">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="color:var(--hx-text-muted);font-size:13px">Amount Paid</span>
              <span style="color:var(--hx-success);font-weight:800;font-size:16px">${fmt(amount)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="color:var(--hx-text-muted);font-size:13px">M-Pesa Receipt</span>
              <span style="color:var(--hx-text);font-weight:700;font-family:'JetBrains Mono',monospace">${res.MpesaReceiptNumber || 'QHXDEMO01'}</span>
            </div>
            <div style="display:flex;justify-content:space-between">
              <span style="color:var(--hx-text-muted);font-size:13px">Time</span>
              <span style="color:var(--hx-text);font-size:13px">${new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          <div class="hx-flex hx-gap-8">
            <button class="hx-btn hx-btn--ghost hx-flex-1" onclick="window.print()">🖨️ Print</button>
            <button class="hx-btn hx-btn--primary hx-flex-1" id="stk-new-payment-btn">⚡ New Payment</button>
          </div>
        `);

        window.HaxOne.utils.confetti();
        window.HaxOne.toast.show('Payment of ' + fmt(amount) + ' received via M-Pesa ✓', 'success', 6000);

        container.querySelector('#stk-new-payment-btn').addEventListener('click', () => {
          if (onSuccess) onSuccess({ amount, receipt: res.MpesaReceiptNumber, method: 'mpesa_stk' });
        });
        if (onSuccess) setTimeout(() => onSuccess({ amount, receipt: res.MpesaReceiptNumber, method: 'mpesa_stk' }), 6000);
      };

      const showStage3Fail = (res) => {
        stage = 3;
        const msg = res.ResultDesc || 'Payment failed. Please try again.';
        render(`
          <div style="text-align:center;padding:20px 0">
            <svg width="80" height="80" viewBox="0 0 80 80" style="margin-bottom:16px">
              <circle cx="40" cy="40" r="36" fill="rgba(255,82,82,0.12)" stroke="#FF5252" stroke-width="3"/>
              <path d="M27 27 L53 53 M53 27 L27 53" fill="none" stroke="#FF5252" stroke-width="4" stroke-linecap="round" class="hx-x-path"/>
            </svg>
            <h3 style="color:var(--hx-error);margin-bottom:8px">${res.ResultCode === '1032' ? 'Payment Cancelled' : res.ResultCode === 'TIMEOUT' ? 'Request Timed Out' : 'Payment Failed'}</h3>
            <p style="color:var(--hx-text-muted);font-size:13px;padding:0 20px">${msg}</p>
          </div>

          <div class="hx-flex hx-gap-8" style="margin-top:8px">
            <button class="hx-btn hx-btn--ghost hx-flex-1" onclick="if(window.HaxOne.paymentFlow._onCancel)window.HaxOne.paymentFlow._onCancel()">Cancel</button>
            <button class="hx-btn hx-btn--primary hx-flex-1" id="stk-retry-btn">⟳ Retry Payment</button>
          </div>
        `);

        container.querySelector('#stk-retry-btn').addEventListener('click', () => {
          pollAborted = false;
          showStage1();
        });
        if (onFailure) onFailure({ code: res.ResultCode, message: msg });
      };

      showStage1();
    },

    /* ══ PayPal Flow ══ */
    initPayPal(container, config) {
      config = config || {};
      const { amount, onSuccess, onFailure, onCancel } = config;
      const fmt = window.HaxOne.utils.formatCurrency;
      const usdAmount = (amount / 130).toFixed(2);

      container.innerHTML = `
        <div style="text-align:center;padding:8px 0 16px">
          <svg width="100" height="28" viewBox="0 0 100 28" style="margin-bottom:12px">
            <text x="0" y="22" font-family="Arial,sans-serif" font-weight="900" font-size="22" fill="#003087">Pay</text>
            <text x="38" y="22" font-family="Arial,sans-serif" font-weight="900" font-size="22" fill="#009cde">Pal</text>
          </svg>
          <p style="color:var(--hx-text-muted);font-size:13px">Secure payment via PayPal</p>
        </div>

        <div style="background:rgba(0,48,135,0.08);border:1px solid rgba(0,48,135,0.2);border-radius:var(--hx-radius);padding:16px;margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="color:var(--hx-text-muted);font-size:13px">Amount (KES)</span>
            <span style="color:var(--hx-text);font-weight:700">${fmt(amount)}</span>
          </div>
          <div style="display:flex;justify-content:space-between">
            <span style="color:var(--hx-text-muted);font-size:13px">Amount (USD)</span>
            <span style="color:var(--hx-text);font-weight:700">$ ${usdAmount}</span>
          </div>
        </div>

        <div id="paypal-flow-stage">
          <button id="paypal-btn" class="hx-btn hx-btn--paypal hx-w-full" style="padding:14px;font-size:15px;margin-bottom:8px">
            🅿️ Pay with PayPal
          </button>
          <button class="hx-btn hx-btn--ghost hx-w-full" onclick="if(window.HaxOne.paymentFlow._ppCancel)window.HaxOne.paymentFlow._ppCancel()">
            Cancel
          </button>
        </div>
      `;

      window.HaxOne.paymentFlow._ppCancel = onCancel;
      container.querySelector('#paypal-btn').addEventListener('click', async () => {
        const btn = container.querySelector('#paypal-btn');
        btn.classList.add('hx-btn--loading'); btn.textContent = '';

        try {
          const order = await window.HaxOne.mockAPI.createPayPalOrder({ amount, currency: 'USD' });
          // Simulate redirect & approval
          container.querySelector('#paypal-flow-stage').innerHTML = `
            <div style="background:var(--hx-surface-2);border:1px solid var(--hx-border);border-radius:var(--hx-radius);padding:20px;text-align:center">
              <div class="hx-spinner hx-spinner--lg" style="margin:0 auto 12px"></div>
              <p style="color:var(--hx-text-muted);font-size:13px">Redirecting to PayPal secure checkout…</p>
              <p style="color:var(--hx-text-dim);font-size:11px;margin-top:4px">Order ID: ${order.id}</p>
            </div>
          `;

          await new Promise(r => setTimeout(r, 2000));

          // Fake approval screen
          container.querySelector('#paypal-flow-stage').innerHTML = `
            <div style="background:#003087;border-radius:var(--hx-radius);padding:20px;margin-bottom:12px">
              <div style="color:white;text-align:center;margin-bottom:16px">
                <svg width="80" height="22" viewBox="0 0 80 22"><text x="0" y="18" font-family="Arial" font-weight="900" font-size="18" fill="white">Pay</text><text x="30" y="18" font-family="Arial" font-weight="900" font-size="18" fill="#9ecde8">Pal</text></svg>
              </div>
              <div style="background:rgba(255,255,255,0.1);border-radius:8px;padding:12px;margin-bottom:12px">
                <div style="color:rgba(255,255,255,0.7);font-size:11px;margin-bottom:2px">Paying to</div>
                <div style="color:white;font-weight:700">HaxOne Store</div>
              </div>
              <div style="background:rgba(255,255,255,0.1);border-radius:8px;padding:12px;margin-bottom:12px">
                <div style="color:rgba(255,255,255,0.7);font-size:11px;margin-bottom:2px">Amount</div>
                <div style="color:white;font-weight:700;font-size:18px">$ ${usdAmount} USD</div>
              </div>
              <div style="background:rgba(255,255,255,0.1);border-radius:8px;padding:12px;margin-bottom:12px">
                <div style="color:rgba(255,255,255,0.7);font-size:11px;margin-bottom:2px">From</div>
                <div style="color:white;font-weight:700">customer@example.com</div>
              </div>
              <button id="paypal-approve-btn" style="width:100%;background:#ffc439;border:none;border-radius:6px;padding:12px;font-weight:800;font-size:15px;cursor:pointer;color:#111;transition:all 0.2s">
                Approve Payment
              </button>
            </div>
            <button class="hx-btn hx-btn--ghost hx-w-full" onclick="if(window.HaxOne.paymentFlow._ppCancel)window.HaxOne.paymentFlow._ppCancel()">Cancel</button>
          `;

          const approveBtn = container.querySelector('#paypal-approve-btn');
          approveBtn.addEventListener('mouseenter', () => approveBtn.style.background = '#f0b429');
          approveBtn.addEventListener('mouseleave', () => approveBtn.style.background = '#ffc439');
          approveBtn.addEventListener('click', async () => {
            approveBtn.textContent = 'Processing…'; approveBtn.disabled = true;
            const capture = await window.HaxOne.mockAPI.capturePayPalOrder(order.id);

            container.querySelector('#paypal-flow-stage').innerHTML = `
              <div style="text-align:center;padding:16px">
                <svg width="70" height="70" viewBox="0 0 70 70" style="margin-bottom:12px">
                  <circle cx="35" cy="35" r="32" fill="rgba(0,230,118,0.12)" stroke="#00E676" stroke-width="3" class="hx-success-circle-path"/>
                  <path d="M20 35 L30 45 L50 25" fill="none" stroke="#00E676" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="hx-check-path"/>
                </svg>
                <h3 style="color:var(--hx-success);margin-bottom:6px">Payment Successful!</h3>
                <p style="color:var(--hx-text-muted);font-size:12px">PayPal capture ID: ${capture.purchase_units[0].payments.captures[0].id}</p>
                <p style="color:var(--hx-text-muted);font-size:12px">${capture.payer.email_address}</p>
              </div>
              <button class="hx-btn hx-btn--success hx-w-full" id="paypal-done-btn" style="margin-top:8px">✓ Done</button>
            `;

            window.HaxOne.utils.confetti();
            window.HaxOne.toast.show('PayPal payment of $' + usdAmount + ' captured successfully ✓', 'success', 5000);

            container.querySelector('#paypal-done-btn').addEventListener('click', () => {
              if (onSuccess) onSuccess({ amount, method: 'paypal', orderId: order.id, captureId: capture.purchase_units[0].payments.captures[0].id });
            });
          });

        } catch(e) {
          window.HaxOne.toast.show('PayPal error: ' + e.message, 'error');
          if (onFailure) onFailure(e);
        }
      });
    }
  };

  window.HaxOne = window.HaxOne || {};
  window.HaxOne.paymentFlow = PaymentFlow;
})();
