/* ============================================================
   HaxOne — pages/gateways.js
   Gateway Management
   ============================================================ */
(function () {
  'use strict';
  window.HaxOnePages = window.HaxOnePages || {};

  const GW_CONFIGS = {
    daraja: {
      name: 'Daraja (M-Pesa)', emoji: '📱', color: '#00a651',
      fields: [
        { key:'consumerKey',    label:'Consumer Key',       type:'text',   mask:true },
        { key:'consumerSecret', label:'Consumer Secret',    type:'text',   mask:true },
        { key:'shortCode',      label:'Business Short Code',type:'text' },
        { key:'tillNumber',     label:'Till Number',        type:'text' },
        { key:'paybillNumber',  label:'Paybill Number',     type:'text' },
        { key:'passkey',        label:'Passkey',            type:'text',   mask:true },
        { key:'initiatorName',  label:'Initiator Name',     type:'text' },
        { key:'callbackUrl',    label:'Callback URL',       type:'url' },
        { key:'validationUrl',  label:'Validation URL',     type:'url' },
        { key:'confirmationUrl',label:'Confirmation URL',   type:'url' }
      ]
    },
    pesapal: {
      name: 'Pesapal', emoji: '💰', color: '#e63946',
      fields: [
        { key:'consumerKey',    label:'Consumer Key',    type:'text', mask:true },
        { key:'consumerSecret', label:'Consumer Secret', type:'text', mask:true },
        { key:'ipnUrl',         label:'IPN URL',         type:'url' }
      ]
    },
    paystack: {
      name: 'Paystack', emoji: '⚡', color: '#00C3F7',
      fields: [
        { key:'publicKey',   label:'Public Key',   type:'text' },
        { key:'secretKey',   label:'Secret Key',   type:'text', mask:true },
        { key:'webhookUrl',  label:'Webhook URL',  type:'url' }
      ]
    },
    flutterwave: {
      name: 'Flutterwave', emoji: '🌊', color: '#F5A623',
      fields: [
        { key:'publicKey',      label:'Public Key',      type:'text' },
        { key:'secretKey',      label:'Secret Key',      type:'text', mask:true },
        { key:'encryptionKey',  label:'Encryption Key',  type:'text', mask:true },
        { key:'webhookUrl',     label:'Webhook URL',     type:'url' }
      ]
    },
    stripe: {
      name: 'Stripe', emoji: '💳', color: '#6772E5',
      fields: [
        { key:'publishableKey', label:'Publishable Key', type:'text' },
        { key:'secretKey',      label:'Secret Key',      type:'text', mask:true },
        { key:'webhookSecret',  label:'Webhook Secret',  type:'text', mask:true }
      ]
    },
    paypal: {
      name: 'PayPal', emoji: '🅿️', color: '#003087',
      fields: [
        { key:'clientId',     label:'Client ID',     type:'text' },
        { key:'clientSecret', label:'Client Secret', type:'text', mask:true },
        { key:'webhookId',    label:'Webhook ID',    type:'text' }
      ]
    },
    dpo: {
      name: 'DPO Group', emoji: '🌍', color: '#1B4F72',
      fields: [
        { key:'companyToken',  label:'Company Token', type:'text', mask:true },
        { key:'serviceType',   label:'Service Type',  type:'text' },
        { key:'merchantCode',  label:'Merchant Code', type:'text' }
      ]
    }
  };

  window.HaxOnePages['gateways'] = {
    _activeGw: 'daraja',

    render(container) {
      const store = window.HaxOne.store;
      const utils = window.HaxOne.utils;
      const gws = store.get('gateways') || {};

      container.innerHTML = `
        <div class="hx-flex hx-items-center hx-justify-between hx-mb-24">
          <div>
            <h1>Gateway Management</h1>
            <p style="font-size:13px">Configure payment provider credentials and settings</p>
          </div>
          <button class="hx-btn hx-btn--primary hx-btn--sm" onclick="window.HaxOnePages.gateways._testAll()">🔍 Test All Connections</button>
        </div>

        <!-- Health Summary Cards -->
        <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:4px;margin-bottom:24px">
          ${Object.entries(GW_CONFIGS).map(([id, cfg]) => {
            const gw = gws[id] || {};
            const health = gw.health || 'offline';
            const dotClass = gw.enabled && health==='online' ? '--online' : gw.enabled && health==='degraded' ? '--pending' : '--offline';
            return `<div class="hx-gateway-card" onclick="window.HaxOnePages.gateways._switchTab('${id}')" id="gw-card-${id}" style="min-width:140px">
              <div style="font-size:28px">${cfg.emoji}</div>
              <div class="hx-gateway-name">${cfg.name}</div>
              <div class="hx-gateway-status">
                <span class="hx-status-dot hx-status-dot${dotClass}"></span>
                <span>${health}</span>
                ${gw.lastPing && gw.lastPing !== '-' ? `<span style="margin-left:auto;font-size:10px;color:var(--hx-text-dim)">${gw.lastPing}</span>` : ''}
              </div>
              <label class="hx-toggle-wrap" onclick="event.stopPropagation()">
                <label class="hx-toggle">
                  <input type="checkbox" ${gw.enabled?'checked':''} onchange="window.HaxOnePages.gateways._toggleGateway('${id}',this.checked)">
                  <div class="hx-toggle-track"></div>
                  <div class="hx-toggle-thumb"></div>
                </label>
                <span style="font-size:11px;color:var(--hx-text-muted)">${gw.enabled?'Enabled':'Disabled'}</span>
              </label>
            </div>`;
          }).join('')}
        </div>

        <!-- Tabs -->
        <div class="hx-tabs" id="gw-tabs">
          ${Object.entries(GW_CONFIGS).map(([id,cfg])=>`<div class="hx-tab${id===this._activeGw?' hx-tab--active':''}" data-gw="${id}" onclick="window.HaxOnePages.gateways._switchTab('${id}')">${cfg.emoji} ${cfg.name}</div>`).join('')}
        </div>

        <!-- Form Area -->
        <div id="gw-form-area"></div>
      `;

      this._renderForm(this._activeGw, container);
    },

    _switchTab(id) {
      this._activeGw = id;
      document.querySelectorAll('.hx-tab[data-gw]').forEach(t => t.classList.toggle('hx-tab--active', t.dataset.gw === id));
      document.querySelectorAll('.hx-gateway-card').forEach(c => c.classList.toggle('hx-gateway-card--active', c.id === 'gw-card-'+id));
      const area = document.getElementById('gw-form-area');
      if (area) this._renderForm(id, area);
    },

    _renderForm(id, parent) {
      const cfg = GW_CONFIGS[id];
      const store = window.HaxOne.store;
      const gws = store.get('gateways') || {};
      const gw = gws[id] || {};
      const area = parent.id === 'gw-form-area' ? parent : parent.querySelector('#gw-form-area');
      if (!area) return;

      area.innerHTML = `
        <div class="hx-card" style="border-color:${gw.enabled?cfg.color+'40':'var(--hx-border)'};opacity:${gw.enabled?1:0.7}">
          <!-- Header -->
          <div class="hx-flex hx-items-center hx-gap-16 hx-mb-24">
            <div style="width:52px;height:52px;border-radius:12px;background:${cfg.color}18;display:flex;align-items:center;justify-content:center;font-size:28px">${cfg.emoji}</div>
            <div style="flex:1">
              <h2>${cfg.name}</h2>
              <div class="hx-flex hx-items-center hx-gap-8 hx-mt-4">
                <span class="hx-status-dot hx-status-dot--${gw.enabled&&gw.health==='online'?'online':'offline'}"></span>
                <span style="font-size:12px;color:var(--hx-text-muted)">${gw.enabled?gw.health||'offline':'Disabled'}</span>
                ${gw.lastChecked?`<span style="font-size:11px;color:var(--hx-text-dim)">• Checked ${window.HaxOne.utils.formatDate(gw.lastChecked,'relative')}</span>`:''}
              </div>
            </div>
            <div class="hx-flex hx-gap-8">
              <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOnePages.gateways._testConnection('${id}')" id="test-btn-${id}">
                🔍 Test Connection
              </button>
              <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="window.HaxOnePages.gateways._rotateKeys('${id}')">🔄 Rotate Keys</button>
            </div>
          </div>

          <!-- Environment Toggle -->
          <div class="hx-flex hx-items-center hx-justify-between hx-mb-20" style="background:var(--hx-surface-2);border-radius:8px;padding:12px 16px">
            <div>
              <div style="font-size:13px;font-weight:600">Environment</div>
              <div style="font-size:12px;color:var(--hx-text-muted)">Toggle between sandbox and production</div>
            </div>
            <div class="hx-flex hx-gap-8 hx-items-center">
              <span style="font-size:12px;color:${gw.environment==='sandbox'?'var(--hx-warning)':'var(--hx-text-muted)'}">Sandbox</span>
              <label class="hx-toggle">
                <input type="checkbox" ${gw.environment==='production'?'checked':''} onchange="window.HaxOnePages.gateways._setEnv('${id}',this.checked?'production':'sandbox')">
                <div class="hx-toggle-track"></div>
                <div class="hx-toggle-thumb"></div>
              </label>
              <span style="font-size:12px;color:${gw.environment==='production'?'var(--hx-success)':'var(--hx-text-muted)'}">Production</span>
              <span class="hx-badge ${gw.environment==='production'?'hx-badge--success':'hx-badge--warning'}">${gw.environment||'sandbox'}</span>
            </div>
          </div>

          <!-- Credential Fields -->
          <div class="hx-form-row" style="grid-template-columns:1fr 1fr">
            ${cfg.fields.map(f => `
              <div class="hx-form-group">
                <label class="hx-label">${f.label}</label>
                ${f.mask ? `
                  <div class="hx-secret-group">
                    <input id="${id}-${f.key}" class="hx-input" type="password" placeholder="Enter ${f.label}…" value="${gw[f.key]||''}" autocomplete="off">
                    <button class="hx-secret-toggle" type="button" onclick="window.HaxOnePages.gateways._toggleSecret('${id}-${f.key}',this)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                ` : `<input id="${id}-${f.key}" class="hx-input" type="${f.type||'text'}" placeholder="Enter ${f.label}…" value="${gw[f.key]||''}">`}
              </div>
            `).join('')}
          </div>

          <!-- Webhook Verification -->
          <div class="hx-flex hx-items-center hx-justify-between" style="background:var(--hx-surface-2);border-radius:8px;padding:12px 16px;margin-bottom:16px">
            <div>
              <div style="font-size:13px;font-weight:600">Webhook Signature Verification</div>
              <div style="font-size:12px;color:var(--hx-text-muted)">Verify webhook payloads are from ${cfg.name}</div>
            </div>
            <label class="hx-toggle">
              <input type="checkbox" checked>
              <div class="hx-toggle-track"></div>
              <div class="hx-toggle-thumb"></div>
            </label>
          </div>

          <!-- Test Result -->
          <div id="test-result-${id}" style="display:none;margin-bottom:16px"></div>

          <!-- Save -->
          <div class="hx-flex hx-gap-8 hx-justify-end">
            <button class="hx-btn hx-btn--ghost" onclick="window.HaxOnePages.gateways._resetForm('${id}')">Reset</button>
            <button class="hx-btn hx-btn--primary" onclick="window.HaxOnePages.gateways._saveGateway('${id}')">💾 Save Configuration</button>
          </div>
        </div>
      `;
    },

    _toggleSecret(inputId, btn) {
      const inp = document.getElementById(inputId);
      if (!inp) return;
      inp.type = inp.type === 'password' ? 'text' : 'password';
    },

    _setEnv(id, env) {
      const gws = window.HaxOne.store.get('gateways') || {};
      gws[id] = { ...(gws[id]||{}), environment: env };
      window.HaxOne.store.set('gateways', gws);
      window.HaxOne.toast.show(`${GW_CONFIGS[id].name} switched to ${env} mode`, 'info');
    },

    _toggleGateway(id, enabled) {
      const gws = window.HaxOne.store.get('gateways') || {};
      gws[id] = { ...(gws[id]||{}), enabled };
      window.HaxOne.store.set('gateways', gws);
      window.HaxOne.toast.show(`${GW_CONFIGS[id].name} ${enabled?'enabled':'disabled'}`, enabled?'success':'warning');
    },

    _saveGateway(id) {
      const cfg = GW_CONFIGS[id];
      const gws = window.HaxOne.store.get('gateways') || {};
      const updated = { ...(gws[id]||{}) };
      cfg.fields.forEach(f => {
        const el = document.getElementById(`${id}-${f.key}`);
        if (el) updated[f.key] = el.value;
      });
      gws[id] = updated;
      window.HaxOne.store.set('gateways', gws);
      window.HaxOne.toast.show(`${cfg.name} configuration saved successfully ✓`, 'success');
    },

    _resetForm(id) {
      window.HaxOne.modal.confirm({
        title: 'Reset Configuration?',
        message: `This will clear all saved credentials for ${GW_CONFIGS[id].name}. This cannot be undone.`,
        danger: true,
        onConfirm: () => {
          const gws = window.HaxOne.store.get('gateways') || {};
          const cfg = GW_CONFIGS[id];
          cfg.fields.forEach(f => { gws[id][f.key] = ''; });
          window.HaxOne.store.set('gateways', gws);
          this._renderForm(id, document.getElementById('gw-form-area'));
          window.HaxOne.toast.show(`${cfg.name} credentials cleared`, 'info');
        }
      });
    },

    async _testConnection(id) {
      const btn = document.getElementById(`test-btn-${id}`);
      if (btn) { btn.classList.add('hx-btn--loading'); btn.textContent = ''; }
      const resultDiv = document.getElementById(`test-result-${id}`);

      try {
        const res = await window.HaxOne.mockAPI.testGatewayConnection(id);
        if (resultDiv) {
          resultDiv.style.display = 'block';
          resultDiv.innerHTML = `<div class="hx-success-card"><strong>✓ Connection Successful</strong><br><span style="font-size:12px">${res.message}</span> <span style="color:var(--hx-text-muted);font-size:11px">Ping: ${res.ping}</span></div>`;
        }
        // Update health
        const gws = window.HaxOne.store.get('gateways') || {};
        gws[id] = { ...(gws[id]||{}), health:'online', lastPing: res.ping, lastChecked: new Date().toISOString() };
        window.HaxOne.store.set('gateways', gws);
        window.HaxOne.toast.show(`${GW_CONFIGS[id].name} — Connection successful (${res.ping})`, 'success');
      } catch(e) {
        if (resultDiv) {
          resultDiv.style.display = 'block';
          resultDiv.innerHTML = `<div style="background:var(--hx-error-bg);border:1px solid rgba(255,82,82,0.2);border-radius:8px;padding:12px;color:var(--hx-error)"><strong>✗ Connection Failed</strong><br><span style="font-size:12px">${e.message}</span></div>`;
        }
        const gws = window.HaxOne.store.get('gateways') || {};
        gws[id] = { ...(gws[id]||{}), health:'offline', lastChecked: new Date().toISOString() };
        window.HaxOne.store.set('gateways', gws);
        window.HaxOne.toast.show(`${GW_CONFIGS[id].name} — Connection failed: ${e.message}`, 'error');
      } finally {
        if (btn) { btn.classList.remove('hx-btn--loading'); btn.textContent = '🔍 Test Connection'; }
      }
    },

    async _testAll() {
      window.HaxOne.toast.show('Testing all gateway connections…', 'info');
      const ids = Object.keys(GW_CONFIGS);
      for (const id of ids) {
        try {
          const res = await window.HaxOne.mockAPI.testGatewayConnection(id);
          const gws = window.HaxOne.store.get('gateways') || {};
          gws[id] = { ...(gws[id]||{}), health:'online', lastPing:res.ping, lastChecked:new Date().toISOString() };
          window.HaxOne.store.set('gateways', gws);
        } catch(e) {
          const gws = window.HaxOne.store.get('gateways') || {};
          gws[id] = { ...(gws[id]||{}), health:'offline', lastChecked:new Date().toISOString() };
          window.HaxOne.store.set('gateways', gws);
        }
      }
      window.HaxOne.toast.show('All gateway tests completed ✓', 'success');
    },

    _rotateKeys(id) {
      window.HaxOne.modal.confirm({
        title: '⚠️ Rotate API Keys',
        message: `Rotating keys for ${GW_CONFIGS[id].name} will invalidate current credentials. You will need to update your API keys from the ${GW_CONFIGS[id].name} dashboard. Proceed?`,
        danger: true,
        onConfirm: () => {
          GW_CONFIGS[id].fields.filter(f=>f.mask).forEach(f => {
            const el = document.getElementById(`${id}-${f.key}`);
            if (el) el.value = '';
          });
          window.HaxOne.toast.show(`Keys cleared. Please enter new ${GW_CONFIGS[id].name} API keys.`, 'warning', 6000);
        }
      });
    },

    destroy() {}
  };
})();
