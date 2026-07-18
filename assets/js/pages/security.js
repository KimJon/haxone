/* ============================================================
   HaxOne — pages/security.js  Security Center
   ============================================================ */
(function () {
  'use strict';
  window.HaxOnePages = window.HaxOnePages || {};

  window.HaxOnePages['security'] = {
    render(container) {
      const utils   = window.HaxOne.utils;
      const charts  = window.HaxOne.charts;
      const alerts  = window.HaxOne.mockAPI.generateFraudAlerts();
      const settings= window.HaxOne.store.get('settings') || {};
      const score   = 84;

      container.innerHTML = `
        <div class="hx-flex hx-items-center hx-justify-between hx-mb-24">
          <div>
            <h1>Security Center</h1>
            <p style="font-size:13px">Fraud detection, audit logs, and compliance management</p>
          </div>
          <div class="hx-flex hx-gap-8">
            <span class="hx-badge hx-badge--success">🔐 PCI DSS Level 2</span>
            <span class="hx-badge hx-badge--info">TLS 1.3</span>
            <span class="hx-badge hx-badge--success">256-bit AES</span>
          </div>
        </div>

        <!-- Security Score + Stats -->
        <div style="display:grid;grid-template-columns:220px 1fr;gap:20px;margin-bottom:24px">
          <div class="hx-card" style="display:flex;flex-direction:column;align-items:center;justify-content:center">
            <div class="hx-text-label hx-mb-8">Security Score</div>
            <canvas id="gauge-chart" style="width:160px;height:120px;display:block"></canvas>
            <div style="font-size:12px;color:var(--hx-success);font-weight:600;margin-top:8px">Good</div>
            <div style="font-size:11px;color:var(--hx-text-muted)">16 points to Excellent</div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
            ${[
              ['🚨', 'Active Alerts',  '2', 'var(--hx-error)',   'High severity'],
              ['⚠️', 'Warnings',        '4', 'var(--hx-warning)', 'Need review'],
              ['✅', 'Passed Checks',  '47', 'var(--hx-success)', 'Last 24h'],
              ['🔐', 'Blocked IPs',    '12', 'var(--hx-primary)', 'Fraud prevention'],
              ['🔍', 'Reviewed Today', '89', 'var(--hx-secondary)','Transactions'],
              ['📋', 'Audit Events',  '234', 'var(--hx-text)',    'Last 7 days']
            ].map(([ic,lb,v,c,sub])=>`
              <div class="hx-stat-card">
                <div class="hx-stat-icon" style="font-size:20px;background:transparent">${ic}</div>
                <div class="hx-stat-body">
                  <div class="hx-stat-value" style="color:${c}">${v}</div>
                  <div class="hx-stat-label">${lb}</div>
                  <div style="font-size:11px;color:var(--hx-text-dim)">${sub}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Fraud Alerts -->
        <div class="hx-card hx-mb-24">
          <div class="hx-section-header">
            <div class="hx-section-title">⚠️ Fraud Detection Alerts</div>
            <div class="hx-flex hx-gap-8">
              <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOne.toast.show('All alerts cleared','success')">Clear All</button>
              <button class="hx-btn hx-btn--primary hx-btn--sm" onclick="window.HaxOnePages.security._runFraudScan()">🔍 Run Scan</button>
            </div>
          </div>
          <div id="fraud-alerts-list" style="display:flex;flex-direction:column;gap:8px;margin-top:16px">
            ${alerts.map(a => `
              <div class="hx-alert-row hx-alert-row--${a.severity}" id="alert-${a.id}">
                <span class="hx-alert-icon">${a.icon}</span>
                <div class="hx-alert-body">
                  <div class="hx-alert-msg">${a.message}</div>
                  <div class="hx-alert-time">${a.time}</div>
                </div>
                <div class="hx-flex hx-gap-6">
                  ${a.action?`<button class="hx-btn hx-btn--sm hx-btn--ghost" onclick="window.HaxOnePages.security._handleAlert('${a.id}','${a.action}')">${a.action}</button>`:''}
                  <button class="hx-btn hx-btn--sm hx-btn--ghost" onclick="document.getElementById('alert-${a.id}').style.display='none';window.HaxOne.toast.show('Alert dismissed','info')">✕</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Settings Tabs -->
        <div class="hx-tabs hx-mb-16">
          <div class="hx-tab hx-tab--active" data-sec="rules">Fraud Rules</div>
          <div class="hx-tab" data-sec="auth">Authentication</div>
          <div class="hx-tab" data-sec="audit">Audit Log</div>
          <div class="hx-tab" data-sec="compliance">Compliance</div>
          <div class="hx-tab" data-sec="users">User Management</div>
        </div>
        <div id="sec-tab-content"></div>
      `;

      // Draw gauge
      setTimeout(() => {
        const gc = document.getElementById('gauge-chart');
        if (gc) charts.drawGauge(gc, score, 100);
      }, 100);

      // Default tab
      this._renderSecTab('rules', container);

      container.querySelectorAll('.hx-tab[data-sec]').forEach(t => {
        t.addEventListener('click', () => {
          container.querySelectorAll('.hx-tab[data-sec]').forEach(x => x.classList.remove('hx-tab--active'));
          t.classList.add('hx-tab--active');
          this._renderSecTab(t.dataset.sec, container);
        });
      });
    },

    _renderSecTab(tab, container) {
      const area = container.querySelector('#sec-tab-content');
      if (!area) return;

      if (tab === 'rules') {
        const RULES = [
          { label:'Velocity Check',         desc:'Block >5 transactions from same phone in 10 minutes',            enabled:true,  severity:'high' },
          { label:'Large Transaction Alert', desc:'Flag transactions over KSh 50,000 for manual review',             enabled:true,  severity:'high' },
          { label:'Duplicate Detection',    desc:'Detect and block duplicate transactions within 60 seconds',       enabled:true,  severity:'high' },
          { label:'Geo-Restriction',         desc:'Block transactions from outside allowed countries',               enabled:false, severity:'medium' },
          { label:'OTP Verification',        desc:'Require OTP for transactions over KSh 10,000',                   enabled:false, severity:'medium' },
          { label:'IP Blacklisting',         desc:'Block requests from known malicious IP addresses',               enabled:true,  severity:'medium' },
          { label:'Device Fingerprinting',   desc:'Track and validate device signatures per merchant',              enabled:false, severity:'low' },
          { label:'Time-based Restriction',  desc:'Block transactions outside business hours (8AM–10PM)',           enabled:false, severity:'low' },
          { label:'Split Payment Detection', desc:'Flag payments that appear to split a single large transaction',  enabled:true,  severity:'medium' },
          { label:'Card BIN Validation',     desc:'Validate card BINs against allowed ranges',                      enabled:true,  severity:'low' }
        ];
        area.innerHTML = `
          <div class="hx-card">
            <div class="hx-section-header hx-mb-16">
              <div style="font-size:13px;font-weight:600">Fraud Detection Rules (${RULES.filter(r=>r.enabled).length}/${RULES.length} active)</div>
              <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOne.toast.show('All rules saved ✓','success')">💾 Save All</button>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px">
              ${RULES.map((r,i)=>`
                <div class="hx-rule-row">
                  <div class="hx-flex hx-items-center hx-gap-8" style="flex:1;min-width:0">
                    <span class="hx-badge hx-badge--${r.severity==='high'?'error':r.severity==='medium'?'warning':'info'}" style="font-size:9px">${r.severity.toUpperCase()}</span>
                    <div>
                      <div style="font-size:13px;font-weight:600">${r.label}</div>
                      <div style="font-size:11px;color:var(--hx-text-muted)">${r.desc}</div>
                    </div>
                  </div>
                  <div class="hx-flex hx-gap-8 hx-items-center">
                    <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOne.toast.show('Rule config coming soon','info')">Configure</button>
                    <label class="hx-toggle">
                      <input type="checkbox" ${r.enabled?'checked':''}>
                      <div class="hx-toggle-track"></div>
                      <div class="hx-toggle-thumb"></div>
                    </label>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      } else if (tab === 'auth') {
        area.innerHTML = `
          <div class="hx-card">
            <div class="hx-section-title hx-mb-20">Authentication Settings</div>
            <div style="display:flex;flex-direction:column;gap:16px">
              ${[
                ['Two-Factor Authentication','Require TOTP app for admin logins',true],
                ['API Key Rotation Reminder','Remind every 90 days to rotate API keys',true],
                ['Session Timeout','Auto-logout after 30 minutes of inactivity',true],
                ['IP Whitelist for API Access','Only allow API calls from whitelisted IPs',false],
                ['Webhook Signature Verification','Verify all incoming webhook signatures',true],
                ['Login Attempt Lockout','Lock account after 5 failed login attempts',true]
              ].map(([l,d,e])=>`
                <div class="hx-flex hx-items-center hx-justify-between hx-rule-row">
                  <div>
                    <div style="font-size:13px;font-weight:600">${l}</div>
                    <div style="font-size:12px;color:var(--hx-text-muted)">${d}</div>
                  </div>
                  <label class="hx-toggle">
                    <input type="checkbox" ${e?'checked':''}>
                    <div class="hx-toggle-track"></div>
                    <div class="hx-toggle-thumb"></div>
                  </label>
                </div>
              `).join('')}
            </div>
            <div class="hx-form-group hx-mt-20">
              <label class="hx-label">IP Whitelist (one per line)</label>
              <textarea class="hx-textarea" placeholder="192.168.1.1&#10;10.0.0.0/24&#10;203.0.113.0/24" style="min-height:100px;font-family:monospace;font-size:12px"></textarea>
            </div>
            <button class="hx-btn hx-btn--primary" onclick="window.HaxOne.toast.show('Auth settings saved ✓','success')">💾 Save Settings</button>
          </div>
        `;

      } else if (tab === 'audit') {
        const auditLogs = Array.from({length:30},(_,i)=>{
          const actions = ['LOGIN','API_KEY_VIEWED','TRANSACTION_CREATED','REFUND_PROCESSED','GATEWAY_CONFIGURED','SETTINGS_UPDATED','WEBHOOK_RECEIVED','FRAUD_ALERT_DISMISSED'];
          const users = ['Admin User','System','API','Webhook'];
          return {
            time: new Date(Date.now()-i*900000).toISOString(),
            action: actions[Math.floor(Math.random()*actions.length)],
            user: users[Math.floor(Math.random()*users.length)],
            ip: '203.0.113.'+Math.floor(Math.random()*255),
            result: Math.random()>0.1?'success':'failure'
          };
        });
        area.innerHTML = `
          <div class="hx-table-wrapper">
            <table class="hx-table">
              <thead><tr><th>Time</th><th>Action</th><th>User</th><th>IP Address</th><th>Result</th></tr></thead>
              <tbody>
                ${auditLogs.map(l=>`
                  <tr>
                    <td style="font-size:12px">${window.HaxOne.utils.formatDate(l.time,'full')}</td>
                    <td><code style="font-size:11px;background:var(--hx-surface-2);padding:2px 6px;border-radius:4px">${l.action}</code></td>
                    <td style="font-size:12px">${l.user}</td>
                    <td style="font-family:monospace;font-size:11px">${l.ip}</td>
                    <td><span class="hx-badge ${l.result==='success'?'hx-badge--success':'hx-badge--error'}">${l.result}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;

      } else if (tab === 'compliance') {
        const checks = [
          {name:'PCI DSS Level 2',           status:'compliant',   desc:'Payment Card Industry Data Security Standard'},
          {name:'TLS 1.3 Encryption',         status:'compliant',   desc:'All data in transit encrypted with TLS 1.3'},
          {name:'AES-256 Data at Rest',       status:'compliant',   desc:'Sensitive data encrypted at rest'},
          {name:'GDPR Data Protection',       status:'compliant',   desc:'EU General Data Protection Regulation'},
          {name:'CBK Compliance (Kenya)',     status:'compliant',   desc:'Central Bank of Kenya payment regulations'},
          {name:'Card Tokenization',          status:'compliant',   desc:'No raw card numbers stored'},
          {name:'3DS2 Authentication',        status:'partial',     desc:'3D Secure 2.0 for card payments'},
          {name:'SWIFT Compliance',           status:'partial',     desc:'International wire transfer standards'},
          {name:'ISO 27001',                  status:'review',      desc:'Information security management standard'},
        ];
        area.innerHTML = `
          <div class="hx-card">
            <div class="hx-section-title hx-mb-20">Compliance Status</div>
            <div style="display:flex;flex-direction:column;gap:10px">
              ${checks.map(c=>`
                <div class="hx-rule-row">
                  <div style="width:24px;height:24px;border-radius:50%;background:${c.status==='compliant'?'rgba(0,230,118,0.15)':c.status==='partial'?'rgba(255,215,64,0.15)':'rgba(255,82,82,0.15)'};display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">
                    ${c.status==='compliant'?'✓':c.status==='partial'?'◐':'!'}
                  </div>
                  <div style="flex:1">
                    <div style="font-size:13px;font-weight:600">${c.name}</div>
                    <div style="font-size:11px;color:var(--hx-text-muted)">${c.desc}</div>
                  </div>
                  <span class="hx-badge ${c.status==='compliant'?'hx-badge--success':c.status==='partial'?'hx-badge--warning':'hx-badge--error'}">${c.status==='compliant'?'Compliant':c.status==='partial'?'Partial':'Review'}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;

      } else if (tab === 'users') {
        const users = [
          { name:'Admin User',   email:'admin@haxone.com',   role:'Super Admin',  status:'active',   lastLogin:'2 hours ago' },
          { name:'John Doe',     email:'john@haxone.com',    role:'Manager',      status:'active',   lastLogin:'1 day ago' },
          { name:'Jane Smith',   email:'jane@haxone.com',    role:'Cashier',      status:'active',   lastLogin:'3 hours ago' },
          { name:'Mike Brown',   email:'mike@haxone.com',    role:'Viewer',       status:'inactive', lastLogin:'5 days ago' },
          { name:'API Service',  email:'api@haxone.com',     role:'API Access',   status:'active',   lastLogin:'5 minutes ago' },
        ];
        area.innerHTML = `
          <div class="hx-card">
            <div class="hx-section-header hx-mb-16">
              <div style="font-size:13px;font-weight:600">User Access Management</div>
              <button class="hx-btn hx-btn--primary hx-btn--sm" onclick="window.HaxOne.toast.show('User invitation feature coming soon','info')">+ Invite User</button>
            </div>
            <div class="hx-table-wrapper" style="border:none">
              <table class="hx-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
                <tbody>
                  ${users.map(u=>`
                    <tr>
                      <td>
                        <div class="hx-flex hx-items-center hx-gap-8">
                          <div style="width:32px;height:32px;border-radius:50%;background:var(--hx-primary);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700">${u.name.split(' ').map(n=>n[0]).join('')}</div>
                          <span style="font-size:13px;font-weight:600">${u.name}</span>
                        </div>
                      </td>
                      <td style="font-size:12px">${u.email}</td>
                      <td><span class="hx-badge hx-badge--info">${u.role}</span></td>
                      <td><span class="hx-badge ${u.status==='active'?'hx-badge--success':'hx-badge--error'}">${u.status}</span></td>
                      <td style="font-size:12px;color:var(--hx-text-muted)">${u.lastLogin}</td>
                      <td>
                        <div class="hx-flex hx-gap-4">
                          <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOne.toast.show('User editor coming soon','info')">Edit</button>
                          ${u.name!=='Admin User'?`<button class="hx-btn hx-btn--ghost hx-btn--sm" style="color:var(--hx-error)" onclick="window.HaxOne.toast.show('User access revoked','warning')">Revoke</button>`:''}
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }
    },

    _handleAlert(id, action) {
      const row = document.getElementById('alert-' + id);
      if (row) row.style.opacity = '0.5';
      window.HaxOne.toast.show(`Action "${action}" taken on alert #${id} ✓`, 'success');
    },

    async _runFraudScan() {
      const btn = event.target;
      btn.classList.add('hx-btn--loading'); btn.textContent = '';
      await new Promise(r => setTimeout(r, 2000));
      btn.classList.remove('hx-btn--loading'); btn.textContent = '🔍 Run Scan';
      window.HaxOne.toast.show('Fraud scan completed. 47 transactions verified, 2 flagged for review.', 'success', 5000);
    },

    destroy() {}
  };
})();
