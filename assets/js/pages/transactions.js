/* ============================================================
   HaxOne — pages/transactions.js  Transaction History
   ============================================================ */
(function () {
  'use strict';
  window.HaxOnePages = window.HaxOnePages || {};

  window.HaxOnePages['transactions'] = {
    _filters: { search:'', method:'all', status:'all', gateway:'all', dateFrom:'', dateTo:'' },
    _page: 1,
    _perPage: 25,

    render(container) {
      const utils = window.HaxOne.utils;
      container.innerHTML = `
        <div class="hx-flex hx-items-center hx-justify-between hx-mb-20">
          <div>
            <h1>Transaction History</h1>
            <p style="font-size:13px" id="tx-count-label">Loading…</p>
          </div>
          <div class="hx-flex hx-gap-8">
            <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOnePages.transactions._exportAll()">⬇ Export CSV</button>
            <button class="hx-btn hx-btn--primary hx-btn--sm" onclick="window.HaxOne.navigate('terminal')">⚡ New Transaction</button>
          </div>
        </div>

        <!-- Filters -->
        <div class="hx-card hx-mb-16" style="padding:14px 16px">
          <div style="display:grid;grid-template-columns:1fr auto auto auto auto auto;gap:10px;align-items:end">
            <div>
              <label class="hx-label">Search</label>
              <div class="hx-search" style="max-width:100%">
                <span class="hx-search-icon"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
                <input id="tx-search" class="hx-input" placeholder="Search ID, receipt, phone…" style="padding-left:32px">
              </div>
            </div>
            <div>
              <label class="hx-label">Status</label>
              <select id="tx-status" class="hx-select"><option value="all">All</option><option value="success">Success</option><option value="failed">Failed</option><option value="pending">Pending</option></select>
            </div>
            <div>
              <label class="hx-label">Method</label>
              <select id="tx-method" class="hx-select">
                <option value="all">All Methods</option>
                <option value="mpesa_stk">M-Pesa STK</option>
                <option value="mpesa_till">M-Pesa Till</option>
                <option value="mpesa_paybill">Paybill</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
                <option value="cash">Cash</option>
                <option value="card_visa">Visa</option>
                <option value="flutterwave">Flutterwave</option>
              </select>
            </div>
            <div>
              <label class="hx-label">Gateway</label>
              <select id="tx-gateway" class="hx-select"><option value="all">All</option><option value="daraja">Daraja</option><option value="paypal">PayPal</option><option value="stripe">Stripe</option><option value="flutterwave">Flutterwave</option><option value="local">Local</option></select>
            </div>
            <div>
              <label class="hx-label">From</label>
              <input type="date" id="tx-from" class="hx-input" style="max-width:130px">
            </div>
            <button class="hx-btn hx-btn--ghost hx-btn--sm" id="tx-reset-btn" style="margin-top:16px">✕ Reset</button>
          </div>
        </div>

        <!-- Table -->
        <div class="hx-table-wrapper" id="tx-table-wrapper">
          <table class="hx-table" id="tx-table">
            <thead>
              <tr>
                <th><input type="checkbox" id="tx-select-all"></th>
                <th>ID</th>
                <th>Date</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Fee</th>
                <th>Net</th>
                <th>Status</th>
                <th>Receipt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="tx-tbody"></tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="hx-flex hx-items-center hx-justify-between hx-mt-16" id="tx-pagination">
          <div style="font-size:12px;color:var(--hx-text-muted)" id="tx-page-label"></div>
          <div class="hx-flex hx-gap-6" id="tx-page-btns"></div>
        </div>

        <!-- Bulk action bar (shows when rows selected) -->
        <div id="tx-bulk-bar" style="display:none;position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--hx-surface-2);border:1px solid var(--hx-border);border-radius:12px;padding:12px 20px;display:none;align-items:center;gap:12px;box-shadow:var(--hx-shadow);z-index:100">
          <span id="tx-bulk-count" style="font-size:13px;font-weight:600">0 selected</span>
          <button class="hx-btn hx-btn--sm hx-btn--ghost" onclick="window.HaxOne.utils.exportCSV(window.HaxOnePages.transactions._getSelected(),'selected_transactions')">⬇ Export Selected</button>
          <button class="hx-btn hx-btn--sm hx-btn--danger" onclick="window.HaxOnePages.transactions._refundSelected()">↩ Refund Selected</button>
        </div>
      `;

      this._bindFilters(container);
      this._page = 1;
      this._renderTable();
    },

    _bindFilters(container) {
      const debounced = window.HaxOne.utils.debounce(() => { this._page=1; this._renderTable(); }, 250);
      ['tx-search','tx-status','tx-method','tx-gateway','tx-from'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => {
          this._filters.search = document.getElementById('tx-search')?.value||'';
          this._filters.status = document.getElementById('tx-status')?.value||'all';
          this._filters.method = document.getElementById('tx-method')?.value||'all';
          this._filters.gateway= document.getElementById('tx-gateway')?.value||'all';
          this._filters.dateFrom= document.getElementById('tx-from')?.value||'';
          debounced();
        });
      });
      document.getElementById('tx-reset-btn')?.addEventListener('click', () => {
        ['tx-search','tx-from'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
        ['tx-status','tx-method','tx-gateway'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='all';});
        this._filters = { search:'',method:'all',status:'all',gateway:'all',dateFrom:'',dateTo:'' };
        this._page=1; this._renderTable();
      });
      document.getElementById('tx-select-all')?.addEventListener('change', (e) => {
        document.querySelectorAll('.tx-row-check').forEach(c => c.checked = e.target.checked);
        this._updateBulkBar();
      });
    },

    _getFiltered() {
      const f = this._filters;
      const txns = window.HaxOne.store.get('transactions') || [];
      return txns.filter(t => {
        if (f.search) {
          const s = f.search.toLowerCase();
          if (!(t.id?.toLowerCase().includes(s)||t.receipt?.toLowerCase().includes(s)||t.mpesaRef?.toLowerCase().includes(s)||(t.phone||'').includes(s))) return false;
        }
        if (f.status !== 'all' && t.status !== f.status) return false;
        if (f.method !== 'all' && t.method !== f.method) return false;
        if (f.gateway !== 'all' && t.gateway !== f.gateway) return false;
        if (f.dateFrom && t.timestamp < f.dateFrom) return false;
        return true;
      });
    },

    _renderTable() {
      const utils = window.HaxOne.utils;
      const all  = this._getFiltered();
      const total = all.length;
      const from  = (this._page - 1) * this._perPage;
      const page  = all.slice(from, from + this._perPage);
      const totalPages = Math.ceil(total / this._perPage);

      const label = document.getElementById('tx-count-label');
      if (label) label.textContent = total.toLocaleString() + ' transaction' + (total!==1?'s':'') + (this._filters.search||this._filters.status!=='all'?' (filtered)':'');

      const tbody = document.getElementById('tx-tbody');
      if (!tbody) return;

      if (!page.length) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:40px;color:var(--hx-text-muted)">No transactions found for the selected filters.</td></tr>`;
      } else {
        tbody.innerHTML = page.map((t, i) => `
          <tr class="hx-row-in" style="animation-delay:${i*0.02}s">
            <td><input type="checkbox" class="tx-row-check" data-id="${t.id}" onchange="window.HaxOnePages.transactions._updateBulkBar()"></td>
            <td style="font-family:monospace;font-size:11px;color:var(--hx-text-muted)">${t.id}</td>
            <td style="font-size:12px;white-space:nowrap">${utils.formatDate(t.timestamp,'full')}</td>
            <td style="font-size:12px"><span style="margin-right:4px">${utils.methodIcon(t.method)}</span>${utils.methodLabel(t.method)}</td>
            <td style="font-weight:700">${utils.formatCurrency(t.amount)}</td>
            <td style="color:var(--hx-text-muted);font-size:12px">${utils.formatCurrency(t.fee||0)}</td>
            <td style="font-size:12px">${utils.formatCurrency((t.amount||0)-(t.fee||0))}</td>
            <td>${utils.statusBadge(t.status)}</td>
            <td style="font-family:monospace;font-size:11px">${t.receipt||t.mpesaRef||'—'}</td>
            <td>
              <div class="hx-flex hx-gap-4">
                <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOnePages.transactions._viewDetails('${t.id}')" title="View">👁</button>
                ${t.status==='success'?`<button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOnePages.transactions._refund('${t.id}')" title="Refund">↩</button>`:''}
              </div>
            </td>
          </tr>
        `).join('');
      }

      // Pagination
      const pLabel = document.getElementById('tx-page-label');
      const pBtns  = document.getElementById('tx-page-btns');
      if (pLabel) pLabel.textContent = `Showing ${from+1}–${Math.min(from+this._perPage,total)} of ${total}`;
      if (pBtns) {
        const maxBtns = 7;
        let btns = '';
        btns += `<button class="hx-btn hx-btn--ghost hx-btn--sm" ${this._page<=1?'disabled':''} onclick="window.HaxOnePages.transactions._goPage(${this._page-1})">‹ Prev</button>`;
        for (let p = Math.max(1,this._page-2); p <= Math.min(totalPages,this._page+2); p++) {
          btns += `<button class="hx-btn ${p===this._page?'hx-btn--primary':'hx-btn--ghost'} hx-btn--sm" onclick="window.HaxOnePages.transactions._goPage(${p})">${p}</button>`;
        }
        btns += `<button class="hx-btn hx-btn--ghost hx-btn--sm" ${this._page>=totalPages?'disabled':''} onclick="window.HaxOnePages.transactions._goPage(${this._page+1})">Next ›</button>`;
        pBtns.innerHTML = btns;
      }
    },

    _goPage(p) { this._page = p; this._renderTable(); window.scrollTo(0,0); },

    _updateBulkBar() {
      const selected = document.querySelectorAll('.tx-row-check:checked').length;
      const bar = document.getElementById('tx-bulk-bar');
      if (bar) { bar.style.display = selected ? 'flex' : 'none'; }
      const cnt = document.getElementById('tx-bulk-count');
      if (cnt) cnt.textContent = selected + ' selected';
    },

    _getSelected() {
      const ids = Array.from(document.querySelectorAll('.tx-row-check:checked')).map(c => c.dataset.id);
      const txns = window.HaxOne.store.get('transactions') || [];
      return txns.filter(t => ids.includes(t.id));
    },

    _viewDetails(id) {
      const utils = window.HaxOne.utils;
      const txns = window.HaxOne.store.get('transactions') || [];
      const t = txns.find(x => x.id === id);
      if (!t) return;
      window.HaxOne.modal.open({
        title: '🔍 Transaction Details',
        size: 'md',
        content: `
          <div class="hx-receipt" style="max-width:360px;margin:0 auto">
            <div style="text-align:center;margin-bottom:16px">
              <div style="font-size:40px">${utils.methodIcon(t.method)}</div>
              <div style="font-size:16px;font-weight:700;margin-top:8px">${utils.methodLabel(t.method)}</div>
              ${utils.statusBadge(t.status)}
            </div>
            ${[
              ['Transaction ID',t.id,'monospace'],
              ['Amount',utils.formatCurrency(t.amount),''],
              ['Fee',utils.formatCurrency(t.fee||0),''],
              ['Net',utils.formatCurrency((t.amount||0)-(t.fee||0)),''],
              ['Receipt',t.receipt||'—','monospace'],
              t.mpesaRef?['M-Pesa Ref',t.mpesaRef,'monospace']:null,
              t.phone?['Phone',t.phone,'']:null,
              ['Gateway',utils.gatewayLabel(t.gateway||'local'),''],
              ['Date',utils.formatDate(t.timestamp,'full'),''],
            ].filter(Boolean).map(([l,v,f])=>`
              <div class="hx-receipt-row">
                <span>${l}</span>
                <span style="${f?'font-family:'+f+',monospace;font-size:11px':'font-weight:600'}">${v}</span>
              </div>
            `).join('')}
          </div>
          <div class="hx-flex hx-gap-8 hx-mt-16" style="justify-content:center">
            <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.print()">🖨️ Print</button>
            <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOne.toast.show('Receipt emailed ✓','success')">📧 Email</button>
          </div>
        `,
        actions: [{ label:'Close', type:'ghost', id:'close', onClick:()=>window.HaxOne.modal.close() }]
      });
    },

    _refund(id) {
      const txns = window.HaxOne.store.get('transactions') || [];
      const t = txns.find(x => x.id === id);
      if (!t) return;
      window.HaxOne.modal.confirm({
        title: '↩ Refund Transaction',
        message: `Refund ${window.HaxOne.utils.formatCurrency(t.amount)} to customer for transaction ${t.id}? This action cannot be undone.`,
        danger: true,
        onConfirm: async () => {
          try {
            await window.HaxOne.mockAPI.processRefund({ transactionId: t.id, amount: t.amount, reason: 'Manual refund via HaxOne' });
            window.HaxOne.store.update('transactions', ts => ts.map(x => x.id === id ? { ...x, status:'refunded' } : x));
            this._renderTable();
            window.HaxOne.toast.show('Refund of '+window.HaxOne.utils.formatCurrency(t.amount)+' processed ✓','success');
          } catch(e) { window.HaxOne.toast.show('Refund failed: '+e.message,'error'); }
        }
      });
    },

    _refundSelected() {
      const selected = this._getSelected().filter(t=>t.status==='success');
      if (!selected.length) { window.HaxOne.toast.show('No refundable transactions selected','warning'); return; }
      window.HaxOne.modal.confirm({
        title: 'Bulk Refund',
        message: `Refund ${selected.length} transaction(s) totalling ${window.HaxOne.utils.formatCurrency(window.HaxOne.utils.sum(selected,'amount'))}?`,
        danger: true,
        onConfirm: () => {
          const ids = selected.map(t=>t.id);
          window.HaxOne.store.update('transactions', ts => ts.map(t => ids.includes(t.id)?{...t,status:'refunded'}:t));
          this._renderTable();
          window.HaxOne.toast.show(ids.length+' refunds processed ✓','success');
        }
      });
    },

    _exportAll() {
      const txns = this._getFiltered();
      window.HaxOne.utils.exportCSV(txns, 'haxone_transactions_' + new Date().toISOString().split('T')[0]);
      window.HaxOne.toast.show('Exported '+txns.length+' transactions ✓','success');
    },

    destroy() {
      this._filters = { search:'', method:'all', status:'all', gateway:'all', dateFrom:'', dateTo:'' };
      this._page = 1;
    }
  };
})();
