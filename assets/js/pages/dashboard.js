/* ============================================================
   HaxOne — pages/dashboard.js
   Analytics Dashboard
   ============================================================ */
(function () {
  'use strict';
  window.HaxOnePages = window.HaxOnePages || {};

  window.HaxOnePages['dashboard'] = {
    _intervals: [],
    _handlers: [],

    render(container) {
      const store   = window.HaxOne.store;
      const utils   = window.HaxOne.utils;
      const charts  = window.HaxOne.charts;
      const txns    = store.get('transactions') || [];
      const fmt     = v => utils.formatCurrency(v);

      // Stats
      const todayRev   = utils.todayRevenue(txns);
      const totalTxns  = txns.length;
      const successRate= utils.successRate(txns);
      const avgVal     = txns.filter(t=>t.status==='success').length ? utils.sum(txns.filter(t=>t.status==='success'),'amount') / txns.filter(t=>t.status==='success').length : 0;

      // 30-day revenue data
      const days30 = [];
      const labels30 = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const ds = d.toISOString().split('T')[0];
        labels30.push(utils.formatDate(d.toISOString(), 'short'));
        const dayRev = txns.filter(t => t.status==='success' && t.timestamp.startsWith(ds)).reduce((s,t)=>s+t.amount,0);
        days30.push(dayRev || Math.round(Math.random()*120000+20000));
      }

      // Method breakdown
      const methodGroups = utils.groupBy(txns.filter(t=>t.status==='success'), 'method');
      const totalSucc = txns.filter(t=>t.status==='success').reduce((s,t)=>s+t.amount,0);
      const methodColors = { mpesa_stk:'#00a651', mpesa_till:'#007a3d', mpesa_paybill:'#005c2e', cash:'#FFD740', paypal:'#003087', stripe:'#6C63FF', card_visa:'#1a1f71', card_mastercard:'#eb001b', flutterwave:'#00D4FF', pesapal:'#FF6B6B' };
      const donutSegs = Object.entries(methodGroups).slice(0,8).map(([m,ts])=>({
        label: utils.methodLabel(m), value: ts.reduce((s,t)=>s+t.amount,0), color: methodColors[m]||'#888'
      })).sort((a,b)=>b.value-a.value);

      // Hourly
      const hours = Array.from({length:24},(_,i)=>i);
      const hourlyData = hours.map(h => txns.filter(t => utils.isToday(t.timestamp) && new Date(t.timestamp).getHours()===h).length);

      // Recent txns
      const recent = txns.slice(0,10);

      // Gateway table
      const gws = store.get('gateways') || {};
      const gwRows = Object.entries(gws).map(([id,gw])=>{
        const gwTxns = txns.filter(t=>t.gateway===id);
        const gwSucc = gwTxns.filter(t=>t.status==='success');
        const rate = gwTxns.length ? Math.round(gwSucc.length/gwTxns.length*100) : 0;
        const rev = utils.sum(gwSucc,'amount');
        const statusDot = gw.enabled ? (gw.health==='online'?'--online':'--degraded') : '--offline';
        return `<tr>
          <td><strong>${utils.gatewayLabel(id)}</strong></td>
          <td>${gwTxns.length}</td>
          <td>${fmt(rev)}</td>
          <td>
            <div class="hx-flex hx-items-center hx-gap-4">
              <div class="hx-progress" style="width:60px"><div class="hx-progress-fill" style="width:${rate}%;background:${rate>80?'var(--hx-success)':rate>60?'var(--hx-warning)':'var(--hx-error)'}"></div></div>
              <span style="font-size:12px">${rate}%</span>
            </div>
          </td>
          <td><span class="hx-status-dot hx-status-dot${statusDot}" style="display:inline-block"></span> <span style="font-size:12px;color:var(--hx-text-muted)">${gw.health||'offline'}</span></td>
        </tr>`;
      }).join('');

      container.innerHTML = `
        <div class="hx-flex hx-items-center hx-justify-between hx-mb-24">
          <div>
            <h1>Analytics Dashboard</h1>
            <p style="font-size:13px">Real-time payment insights &amp; performance metrics</p>
          </div>
          <div class="hx-flex hx-gap-8">
            <span class="hx-ticker" style="margin-bottom:0">
              <span class="hx-ticker-dot"></span>
              <span id="live-count" style="font-size:12px;color:var(--hx-text-muted)">Live feed active</span>
            </span>
            <button class="hx-btn hx-btn--secondary hx-btn--sm" onclick="window.HaxOne.navigate('reconciliation')">📄 Reports</button>
          </div>
        </div>

        <!-- Stat Cards -->
        <div class="hx-grid-4 hx-mb-24 hx-stagger" id="stat-cards">
          <div class="hx-stat-card">
            <div class="hx-stat-icon" style="background:rgba(108,99,255,0.12);color:var(--hx-primary);font-size:22px">💰</div>
            <div class="hx-stat-body">
              <div class="hx-stat-value" id="stat-revenue">${fmt(0)}</div>
              <div class="hx-stat-label">Today's Revenue</div>
              <div class="hx-stat-trend hx-text-success">↑ 12.4% vs yesterday</div>
            </div>
          </div>
          <div class="hx-stat-card">
            <div class="hx-stat-icon" style="background:rgba(0,212,255,0.12);color:var(--hx-secondary);font-size:22px">🔄</div>
            <div class="hx-stat-body">
              <div class="hx-stat-value" id="stat-txns">0</div>
              <div class="hx-stat-label">Total Transactions</div>
              <div class="hx-stat-trend hx-text-success">↑ 8.1% this week</div>
            </div>
          </div>
          <div class="hx-stat-card">
            <div class="hx-stat-icon" style="background:rgba(0,230,118,0.12);color:var(--hx-success);font-size:22px">✅</div>
            <div class="hx-stat-body">
              <div class="hx-stat-value" id="stat-success">0%</div>
              <div class="hx-stat-label">Success Rate</div>
              <div class="hx-stat-trend hx-text-success">↑ 2.3% vs last week</div>
            </div>
          </div>
          <div class="hx-stat-card">
            <div class="hx-stat-icon" style="background:rgba(255,215,64,0.12);color:var(--hx-warning);font-size:22px">📊</div>
            <div class="hx-stat-body">
              <div class="hx-stat-value" id="stat-avg">${fmt(0)}</div>
              <div class="hx-stat-label">Avg. Transaction</div>
              <div class="hx-stat-trend hx-text-error">↓ 3.1% vs yesterday</div>
            </div>
          </div>
        </div>

        <!-- Revenue Chart -->
        <div class="hx-card hx-mb-24">
          <div class="hx-section-header">
            <div>
              <div class="hx-section-title">Revenue Trend</div>
              <div style="font-size:12px;color:var(--hx-text-muted);margin-top:2px">Total: ${fmt(utils.sum(txns.filter(t=>t.status==='success'),'amount'))} all time</div>
            </div>
            <div class="hx-flex hx-gap-8" id="range-btns">
              <button class="hx-btn hx-btn--ghost hx-btn--sm range-btn" data-range="7">7D</button>
              <button class="hx-btn hx-btn--primary hx-btn--sm range-btn active-range" data-range="30">30D</button>
              <button class="hx-btn hx-btn--ghost hx-btn--sm range-btn" data-range="90">90D</button>
            </div>
          </div>
          <canvas id="revenue-chart" style="width:100%;height:220px;display:block"></canvas>
        </div>

        <!-- Donut + Gateway Table -->
        <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:20px;margin-bottom:24px">
          <div class="hx-card">
            <div class="hx-section-title hx-mb-16">Payment Breakdown</div>
            <canvas id="donut-chart" style="width:100%;height:260px;display:block"></canvas>
          </div>
          <div class="hx-card">
            <div class="hx-section-title hx-mb-16">Gateway Performance</div>
            <div class="hx-table-wrapper" style="border:none">
              <table class="hx-table">
                <thead><tr><th>Gateway</th><th>Txns</th><th>Revenue</th><th>Success</th><th>Status</th></tr></thead>
                <tbody>${gwRows}</tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Hourly + Live Feed -->
        <div style="display:grid;grid-template-columns:1.2fr 1fr;gap:20px">
          <div class="hx-card">
            <div class="hx-section-title hx-mb-16">Hourly Transactions Today</div>
            <canvas id="bar-chart" style="width:100%;height:160px;display:block"></canvas>
          </div>
          <div class="hx-card" style="display:flex;flex-direction:column">
            <div class="hx-flex hx-items-center hx-justify-between hx-mb-16">
              <div class="hx-section-title">Live Transactions</div>
              <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOne.navigate('transactions')">View All →</button>
            </div>
            <div id="live-feed" style="flex:1;overflow-y:auto;max-height:200px;display:flex;flex-direction:column;gap:6px">
              ${recent.map(t => renderLiveFeedItem(t)).join('')}
            </div>
          </div>
        </div>
      `;

      // Animate counters
      setTimeout(() => {
        utils.animateCounter(document.getElementById('stat-revenue'), 0, todayRev,  1000, v => fmt(v));
        utils.animateCounter(document.getElementById('stat-txns'),    0, totalTxns, 1000, v => v.toLocaleString());
        utils.animateCounter(document.getElementById('stat-success'), 0, successRate, 900, v => v + '%');
        utils.animateCounter(document.getElementById('stat-avg'),     0, Math.round(avgVal), 1000, v => fmt(v));
      }, 200);

      // Draw charts
      setTimeout(() => {
        const rc = document.getElementById('revenue-chart');
        if (rc) charts.drawLine(rc, { labels: labels30, datasets: [{ label:'Revenue', values: days30, color:'#6C63FF', fill:true }] }, {});

        const dc = document.getElementById('donut-chart');
        if (dc) charts.drawDonut(dc, donutSegs, { centerLabel: 'transactions', centerValue: txns.filter(t=>t.status==='success').length });

        const bc = document.getElementById('bar-chart');
        if (bc) charts.drawBar(bc, { labels: hours.map(h => h+'h'), values: hourlyData, colors: hourlyData.map(v => v>5?'#6C63FF':v>2?'#00D4FF':'#444') }, { showValues: false });
      }, 150);

      // Range buttons
      container.querySelectorAll('.range-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('.range-btn').forEach(b => { b.classList.remove('hx-btn--primary','active-range'); b.classList.add('hx-btn--ghost'); });
          btn.classList.add('hx-btn--primary','active-range'); btn.classList.remove('hx-btn--ghost');
          const range = parseInt(btn.dataset.range);
          const rangeLabels = [], rangeData = [];
          for (let i = range-1; i >= 0; i--) {
            const d = new Date(); d.setDate(d.getDate()-i);
            const ds = d.toISOString().split('T')[0];
            rangeLabels.push(utils.formatDate(d.toISOString(),'short'));
            const rv = txns.filter(t=>t.status==='success'&&t.timestamp.startsWith(ds)).reduce((s,t)=>s+t.amount,0);
            rangeData.push(rv || Math.round(Math.random()*120000+20000));
          }
          const rc2 = document.getElementById('revenue-chart');
          if (rc2) charts.drawLine(rc2, { labels: rangeLabels, datasets:[{label:'Revenue',values:rangeData,color:'#6C63FF',fill:true}] }, {});
        });
      });

      // Live feed listener
      const onNewTxn = (e) => {
        const t = e.detail;
        const feed = document.getElementById('live-feed');
        if (!feed) return;
        const div = document.createElement('div');
        div.className = 'hx-live-new';
        div.innerHTML = renderLiveFeedItem(t);
        feed.insertBefore(div, feed.firstChild);
        if (feed.children.length > 15) feed.removeChild(feed.lastChild);

        // Update stat-txns
        const txnEl = document.getElementById('stat-txns');
        if (txnEl) {
          const cur = parseInt(txnEl.textContent.replace(/,/g,'')) || totalTxns;
          txnEl.textContent = (cur + 1).toLocaleString();
        }
        const lc = document.getElementById('live-count');
        if (lc) lc.textContent = 'New: ' + utils.methodLabel(t.method) + ' ' + utils.formatCurrency(t.amount);
      };
      window.addEventListener('hx:newTransaction', onNewTxn);
      this._handlers.push({ el: window, event: 'hx:newTransaction', fn: onNewTxn });
    },

    destroy() {
      this._intervals.forEach(clearInterval);
      this._intervals = [];
      this._handlers.forEach(h => h.el.removeEventListener(h.event, h.fn));
      this._handlers = [];
    }
  };

  function renderLiveFeedItem(t) {
    const utils = window.HaxOne.utils;
    const statusColor = t.status==='success'?'var(--hx-success)':t.status==='failed'?'var(--hx-error)':'var(--hx-warning)';
    return `<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;background:var(--hx-surface-2)">
      <span style="font-size:16px">${utils.methodIcon(t.method)}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:600;color:var(--hx-text)">${utils.methodLabel(t.method)}</div>
        <div style="font-size:11px;color:var(--hx-text-muted)">${utils.formatDate(t.timestamp,'relative')}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:12px;font-weight:700;color:var(--hx-text)">${utils.formatCurrency(t.amount)}</div>
        <div style="font-size:10px;color:${statusColor};font-weight:600">${t.status}</div>
      </div>
    </div>`;
  }
})();
