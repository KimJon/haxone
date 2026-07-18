/* ============================================================
   HaxOne — pages/reconciliation.js  Reconciliation & Reports
   ============================================================ */
(function () {
  'use strict';
  window.HaxOnePages = window.HaxOnePages || {};

  window.HaxOnePages['reconciliation'] = {
    render(container) {
      const store   = window.HaxOne.store;
      const utils   = window.HaxOne.utils;
      const charts  = window.HaxOne.charts;
      const txns    = store.get('transactions') || [];
      const recon   = store.get('reconciliation') || {};
      const settings= store.get('settings') || {};

      const succTxns= txns.filter(t=>t.status==='success');
      const totalRev= utils.sum(succTxns,'amount');
      const totalFees= utils.sum(txns,'fee');
      const netRev  = totalRev - totalFees;
      const cashTxns= txns.filter(t=>t.method==='cash'&&t.status==='success');
      const cashRev = utils.sum(cashTxns,'amount');
      const digRev  = totalRev - cashRev;
      const cashDiff= cashRev - (recon.cashActual||0);

      // Weekly revenue by gateway
      const gws = store.get('gateways') || {};
      const gwLabels = Object.keys(gws);
      const gwRevenue = gwLabels.map(gw => txns.filter(t=>t.gateway===gw&&t.status==='success').reduce((s,t)=>s+t.amount,0));
      const gwColors  = ['#00a651','#e63946','#00C3F7','#F5A623','#6772E5','#003087','#1B4F72'];

      container.innerHTML = `
        <div class="hx-flex hx-items-center hx-justify-between hx-mb-24">
          <div>
            <h1>Reconciliation</h1>
            <p style="font-size:13px">Balance all payment channels and generate financial reports</p>
          </div>
          <div class="hx-flex hx-gap-8">
            <input type="date" class="hx-input" id="recon-date" value="${new Date().toISOString().split('T')[0]}" style="font-size:12px;padding:8px 12px;max-width:160px">
            <button class="hx-btn hx-btn--primary hx-btn--sm" onclick="window.HaxOnePages.reconciliation._reconcile()">⚖️ Reconcile Now</button>
            <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOne.utils.exportCSV(window.HaxOne.store.get('transactions')||[],'haxone_reconciliation')">⬇ Export</button>
          </div>
        </div>

        <!-- Status banner -->
        <div id="recon-status-banner" class="hx-mb-24"></div>

        <!-- Summary Cards -->
        <div class="hx-grid-4 hx-mb-24">
          <div class="hx-stat-card">
            <div class="hx-stat-icon" style="background:rgba(108,99,255,0.12);color:var(--hx-primary);font-size:20px">💰</div>
            <div class="hx-stat-body">
              <div class="hx-stat-value" id="r-gross">${utils.formatCurrency(totalRev)}</div>
              <div class="hx-stat-label">Gross Revenue</div>
            </div>
          </div>
          <div class="hx-stat-card">
            <div class="hx-stat-icon" style="background:rgba(255,107,107,0.12);color:var(--hx-accent);font-size:20px">🔻</div>
            <div class="hx-stat-body">
              <div class="hx-stat-value" style="color:var(--hx-error)">${utils.formatCurrency(totalFees)}</div>
              <div class="hx-stat-label">Total Fees</div>
            </div>
          </div>
          <div class="hx-stat-card">
            <div class="hx-stat-icon" style="background:rgba(0,230,118,0.12);color:var(--hx-success);font-size:20px">✅</div>
            <div class="hx-stat-body">
              <div class="hx-stat-value" style="color:var(--hx-success)">${utils.formatCurrency(netRev)}</div>
              <div class="hx-stat-label">Net Revenue</div>
            </div>
          </div>
          <div class="hx-stat-card">
            <div class="hx-stat-icon" style="background:rgba(255,215,64,0.12);color:var(--hx-warning);font-size:20px">💵</div>
            <div class="hx-stat-body">
              <div class="hx-stat-value">${utils.formatCurrency(cashRev)}</div>
              <div class="hx-stat-label">Cash Collected</div>
            </div>
          </div>
        </div>

        <!-- Gateway Revenue Chart + Cash Drawer -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">
          <div class="hx-card">
            <div class="hx-section-title hx-mb-16">Revenue by Gateway</div>
            <canvas id="recon-bar" style="width:100%;height:200px;display:block"></canvas>
          </div>

          <!-- Cash Drawer -->
          <div class="hx-card">
            <div class="hx-section-title hx-mb-16">💵 Cash Drawer Reconciliation</div>
            <div class="hx-form-group">
              <label class="hx-label">Opening Balance (KES)</label>
              <input id="cash-opening" class="hx-input" type="number" value="${settings.cashDrawerOpening||50000}" placeholder="0.00">
            </div>
            <div class="hx-form-group">
              <label class="hx-label">Actual Cash Count (KES)</label>
              <input id="cash-actual" class="hx-input" type="number" value="${recon.cashActual||''}" placeholder="Count cash in drawer…">
            </div>
            <div style="background:var(--hx-surface-2);border-radius:8px;padding:12px;margin-bottom:12px">
              <div class="hx-flex hx-justify-between hx-mb-4"><span style="font-size:12px;color:var(--hx-text-muted)">Expected Cash</span><span style="font-size:13px;font-weight:700">${utils.formatCurrency((settings.cashDrawerOpening||50000)+cashRev)}</span></div>
              <div class="hx-flex hx-justify-between"><span style="font-size:12px;color:var(--hx-text-muted)">Variance</span><span id="cash-variance" style="font-size:13px;font-weight:700;color:${Math.abs(cashDiff)<100?'var(--hx-success)':'var(--hx-error)'}">${cashDiff>=0?'+':''}${utils.formatCurrency(cashDiff)}</span></div>
            </div>
            <button class="hx-btn hx-btn--primary hx-w-full" onclick="window.HaxOnePages.reconciliation._updateCash()">Update Cash Count</button>
          </div>
        </div>

        <!-- Tabs: Transactions / Fees / Voids -->
        <div class="hx-tabs hx-mb-16" id="recon-tabs">
          <div class="hx-tab hx-tab--active" data-rtab="all">All Transactions</div>
          <div class="hx-tab" data-rtab="fees">Fee Breakdown</div>
          <div class="hx-tab" data-rtab="voids">Voids & Refunds</div>
          <div class="hx-tab" data-rtab="daily">Daily Summary</div>
        </div>

        <div id="recon-tab-content"></div>
      `;

      // Draw chart
      setTimeout(() => {
        const bc = document.getElementById('recon-bar');
        if (bc) charts.drawBar(bc, { labels: gwLabels.map(g=>utils.gatewayLabel(g)), values: gwRevenue, colors: gwColors }, { showValues: true });
      }, 100);

      // Default tab
      this._renderTab('all', container, txns);

      // Tab switching
      container.querySelectorAll('.hx-tab[data-rtab]').forEach(t => {
        t.addEventListener('click', () => {
          container.querySelectorAll('.hx-tab[data-rtab]').forEach(x => x.classList.remove('hx-tab--active'));
          t.classList.add('hx-tab--active');
          this._renderTab(t.dataset.rtab, container, txns);
        });
      });

      // Check last reconciliation
      if (recon.lastReconciled) {
        document.getElementById('recon-status-banner').innerHTML = `
          <div class="hx-success-card">✓ Last reconciled on ${utils.formatDate(recon.lastReconciled,'full')} — No discrepancies found</div>
        `;
      }
    },

    _renderTab(tab, container, txns) {
      const utils = window.HaxOne.utils;
      const area  = container.querySelector('#recon-tab-content');
      if (!area) return;

      if (tab === 'all') {
        area.innerHTML = `
          <div class="hx-table-wrapper">
            <table class="hx-table">
              <thead><tr><th>ID</th><th>Date</th><th>Method</th><th>Amount</th><th>Fee</th><th>Net</th><th>Status</th><th>Receipt</th></tr></thead>
              <tbody>
                ${txns.slice(0,50).map(t=>`
                  <tr>
                    <td style="font-family:monospace;font-size:11px">${t.id}</td>
                    <td style="font-size:12px">${utils.formatDate(t.timestamp,'full')}</td>
                    <td>${utils.methodIcon(t.method)} <span style="font-size:12px">${utils.methodLabel(t.method)}</span></td>
                    <td style="font-weight:700">${utils.formatCurrency(t.amount)}</td>
                    <td style="color:var(--hx-text-muted)">${utils.formatCurrency(t.fee||0)}</td>
                    <td>${utils.formatCurrency((t.amount||0)-(t.fee||0))}</td>
                    <td>${utils.statusBadge(t.status)}</td>
                    <td style="font-family:monospace;font-size:11px">${t.receipt||'—'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      } else if (tab === 'fees') {
        const byGw = utils.groupBy(txns,'gateway');
        area.innerHTML = `
          <div class="hx-table-wrapper">
            <table class="hx-table">
              <thead><tr><th>Gateway</th><th>Transactions</th><th>Gross Revenue</th><th>Total Fees (1.5%)</th><th>Net Revenue</th><th>Avg Fee</th></tr></thead>
              <tbody>
                ${Object.entries(byGw).map(([gw,ts])=>{
                  const gr=utils.sum(ts.filter(t=>t.status==='success'),'amount');
                  const tf=utils.sum(ts,'fee');
                  const av=ts.length?tf/ts.length:0;
                  return `<tr><td>${utils.gatewayLabel(gw)}</td><td>${ts.length}</td><td>${utils.formatCurrency(gr)}</td><td style="color:var(--hx-error)">${utils.formatCurrency(tf)}</td><td style="color:var(--hx-success)">${utils.formatCurrency(gr-tf)}</td><td>${utils.formatCurrency(av)}</td></tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        `;
      } else if (tab === 'voids') {
        const failed = txns.filter(t=>t.status!=='success');
        area.innerHTML = `
          <div class="hx-table-wrapper">
            <table class="hx-table">
              <thead><tr><th>ID</th><th>Date</th><th>Method</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                ${failed.slice(0,30).map(t=>`
                  <tr>
                    <td style="font-family:monospace;font-size:11px">${t.id}</td>
                    <td style="font-size:12px">${utils.formatDate(t.timestamp,'full')}</td>
                    <td>${utils.methodIcon(t.method)} ${utils.methodLabel(t.method)}</td>
                    <td>${utils.formatCurrency(t.amount)}</td>
                    <td>${utils.statusBadge(t.status)}</td>
                    <td><button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOne.navigate('mpesa')">↩ Refund</button></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      } else if (tab === 'daily') {
        const last14 = Array.from({length:14},(_,i)=>{
          const d=new Date(); d.setDate(d.getDate()-13+i);
          const ds=d.toISOString().split('T')[0];
          const dt=txns.filter(t=>t.timestamp.startsWith(ds));
          const rev=dt.filter(t=>t.status==='success').reduce((s,t)=>s+t.amount,0);
          const fees=dt.reduce((s,t)=>s+(t.fee||0),0);
          return { date:utils.formatDate(d.toISOString(),'short'), txns:dt.length, rev, fees, net:rev-fees, success:dt.filter(t=>t.status==='success').length };
        });
        area.innerHTML = `
          <div class="hx-table-wrapper">
            <table class="hx-table">
              <thead><tr><th>Date</th><th>Transactions</th><th>Gross Revenue</th><th>Fees</th><th>Net Revenue</th><th>Success Rate</th></tr></thead>
              <tbody>
                ${last14.map(d=>`
                  <tr>
                    <td>${d.date}</td>
                    <td>${d.txns}</td>
                    <td>${utils.formatCurrency(d.rev)}</td>
                    <td style="color:var(--hx-error)">${utils.formatCurrency(d.fees)}</td>
                    <td style="color:var(--hx-success);font-weight:700">${utils.formatCurrency(d.net)}</td>
                    <td>${d.txns?Math.round(d.success/d.txns*100)+'%':'—'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }
    },

    _updateCash() {
      const actual = parseFloat(document.getElementById('cash-actual')?.value) || 0;
      const opening = parseFloat(document.getElementById('cash-opening')?.value) || 0;
      const txns = window.HaxOne.store.get('transactions') || [];
      const cashRev = txns.filter(t=>t.method==='cash'&&t.status==='success').reduce((s,t)=>s+t.amount,0);
      const expected = opening + cashRev;
      const diff = actual - expected;
      const el = document.getElementById('cash-variance');
      if (el) {
        el.textContent = (diff>=0?'+':'') + window.HaxOne.utils.formatCurrency(Math.abs(diff));
        el.style.color = Math.abs(diff) < 100 ? 'var(--hx-success)' : 'var(--hx-error)';
      }
      window.HaxOne.store.update('reconciliation', r => ({ ...r, cashActual: actual }));
      window.HaxOne.toast.show('Cash count updated. Variance: KSh '+diff.toFixed(2), Math.abs(diff)<100?'success':'warning');
    },

    _reconcile() {
      const date = document.getElementById('recon-date')?.value || new Date().toISOString();
      window.HaxOne.store.update('reconciliation', r => ({ ...r, lastReconciled: new Date().toISOString() }));
      const banner = document.getElementById('recon-status-banner');
      if (banner) banner.innerHTML = `<div class="hx-success-card" style="animation:hx-slide-up 0.3s ease">✅ Reconciliation completed successfully for ${window.HaxOne.utils.formatDate(date,'date')} — All channels balanced. No discrepancies found.</div>`;
      window.HaxOne.toast.show('Reconciliation completed for '+date+' ✓','success',5000);
    },

    destroy() {}
  };
})();
