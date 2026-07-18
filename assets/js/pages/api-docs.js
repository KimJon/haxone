/* ============================================================
   HaxOne — pages/api-docs.js   API Documentation
   ============================================================ */
(function () {
  'use strict';
  window.HaxOnePages = window.HaxOnePages || {};

  const ENDPOINTS = [
    { method:'POST', path:'/api/v1/mpesa/stk-push',          tag:'M-Pesa',  desc:'Initiate STK Push to customer phone', params:[{n:'phone',t:'string',r:true,d:'Customer phone (2547xxxxxxxx)'},{n:'amount',t:'number',r:true,d:'Amount in KES'},{n:'account_ref',t:'string',r:false,d:'Reference (order ID)'},{n:'description',t:'string',r:false,d:'Payment description'}] },
    { method:'POST', path:'/api/v1/mpesa/stk-query',         tag:'M-Pesa',  desc:'Query STK Push status',               params:[{n:'checkout_request_id',t:'string',r:true,d:'CheckoutRequestID from STK push'}] },
    { method:'GET',  path:'/api/v1/mpesa/balance',            tag:'M-Pesa',  desc:'Get M-Pesa account balance',          params:[] },
    { method:'POST', path:'/api/v1/mpesa/b2c',               tag:'M-Pesa',  desc:'B2C disbursement to customer',        params:[{n:'phone',t:'string',r:true,d:'Recipient phone'},{n:'amount',t:'number',r:true,d:'Amount in KES'},{n:'occasion',t:'string',r:false,d:'Remarks'}] },
    { method:'POST', path:'/api/v1/mpesa/reversal',          tag:'M-Pesa',  desc:'Reverse a transaction',               params:[{n:'transaction_id',t:'string',r:true,d:'M-Pesa transaction ID'}] },
    { method:'POST', path:'/api/v1/paypal/order',            tag:'PayPal',  desc:'Create PayPal order',                 params:[{n:'amount',t:'number',r:true,d:'Amount in KES (auto-converted to USD)'},{n:'description',t:'string',r:false,d:'Order description'}] },
    { method:'POST', path:'/api/v1/paypal/capture',          tag:'PayPal',  desc:'Capture approved PayPal order',       params:[{n:'order_id',t:'string',r:true,d:'PayPal order ID'}] },
    { method:'POST', path:'/api/v1/charge',                  tag:'General', desc:'Generic charge any gateway',          params:[{n:'amount',t:'number',r:true,d:'Amount in KES'},{n:'gateway',t:'string',r:true,d:'Gateway: daraja|paypal|stripe|paystack'},{n:'method',t:'string',r:true,d:'Method: mpesa_stk|card|bank_transfer|etc'}] },
    { method:'POST', path:'/api/v1/refund',                  tag:'General', desc:'Refund a transaction',                params:[{n:'transaction_id',t:'string',r:true,d:'HaxOne transaction ID'},{n:'amount',t:'number',r:false,d:'Partial refund amount (full if omitted)'},{n:'reason',t:'string',r:false,d:'Refund reason'}] },
    { method:'GET',  path:'/api/v1/transactions',            tag:'General', desc:'List transactions (paginated)',       params:[{n:'page',t:'number',r:false,d:'Page number'},{n:'per_page',t:'number',r:false,d:'Per page (max 100)'},{n:'status',t:'string',r:false,d:'Filter: success|failed|pending'},{n:'gateway',t:'string',r:false,d:'Filter by gateway'}] },
    { method:'GET',  path:'/api/v1/transactions/:id',        tag:'General', desc:'Get single transaction details',     params:[{n:'id',t:'string',r:true,d:'HaxOne transaction ID'}] },
    { method:'POST', path:'/api/v1/payment-link',            tag:'General', desc:'Generate payment link',               params:[{n:'amount',t:'number',r:true,d:'Amount in KES'},{n:'description',t:'string',r:true,d:'Payment purpose'},{n:'expires_in_hours',t:'number',r:false,d:'Link expiry (default 24h)'}] },
    { method:'POST', path:'/api/v1/mpesa/qr',               tag:'M-Pesa',  desc:'Generate M-Pesa QR code',            params:[{n:'amount',t:'number',r:false,d:'For dynamic QR, leave empty for static'},{n:'account_ref',t:'string',r:false,d:'Account reference'}] },
    { method:'GET',  path:'/api/v1/gateways/health',         tag:'General', desc:'Check all gateway statuses',         params:[] },
    { method:'POST', path:'/api/v1/webhooks/verify',         tag:'General', desc:'Verify webhook signature',           params:[{n:'payload',t:'object',r:true,d:'Raw webhook body'},{n:'signature',t:'string',r:true,d:'X-Signature header value'},{n:'gateway',t:'string',r:true,d:'Source gateway'}] }
  ];

  const TAGS = ['All', 'M-Pesa', 'PayPal', 'General'];
  const METHOD_COLORS = { GET:'#00D4FF', POST:'#6C63FF', PUT:'#FFD740', DELETE:'#FF5252' };

  window.HaxOnePages['api-docs'] = {
    _activeTag: 'All',
    _activeEndpoint: null,

    render(container) {
      container.innerHTML = `
        <div style="display:grid;grid-template-columns:280px 1fr;gap:20px;height:calc(100vh-88px-48px);min-height:600px">

          <!-- Sidebar -->
          <div style="display:flex;flex-direction:column;gap:12px">
            <!-- API Key -->
            <div class="hx-card" style="padding:14px">
              <div class="hx-text-label hx-mb-8">Your API Key</div>
              <div class="hx-flex hx-gap-4 hx-items-center">
                <code id="api-key-display" style="font-size:11px;background:var(--hx-surface-2);padding:6px 8px;border-radius:6px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">hx_live_****_****_****</code>
                <button class="hx-btn hx-btn--icon hx-btn--ghost" onclick="window.HaxOnePages['api-docs']._toggleKey()" title="Reveal">👁</button>
                <button class="hx-btn hx-btn--icon hx-btn--ghost" onclick="navigator.clipboard.writeText('hx_live_demo_key_abc123');window.HaxOne.toast.show('API key copied ✓','success')" title="Copy">📋</button>
              </div>
              <div class="hx-flex hx-gap-6 hx-mt-10">
                <span class="hx-badge hx-badge--success" style="font-size:10px">● Live</span>
                <span class="hx-badge hx-badge--info" style="font-size:10px">v1</span>
              </div>
            </div>

            <!-- Tags -->
            <div class="hx-card" style="padding:14px;flex:1;overflow-y:auto">
              <div class="hx-text-label hx-mb-10">Endpoints</div>
              ${TAGS.map(tag=>`<div class="hx-api-tag${tag===this._activeTag?' hx-api-tag--active':''}" data-tag="${tag}" onclick="window.HaxOnePages['api-docs']._filterTag('${tag}')">${tag}</div>`).join('')}
              <div style="margin-top:12px;border-top:1px solid var(--hx-border);padding-top:12px">
                ${ENDPOINTS.filter(e=>this._activeTag==='All'||e.tag===this._activeTag).map(ep=>`
                  <div class="hx-api-endpoint-item" data-ep="${ep.path}" onclick="window.HaxOnePages['api-docs']._selectEndpoint('${ep.path.replace(/'/g,'')}')">
                    <span class="hx-method-badge hx-method-badge--${ep.method.toLowerCase()}">${ep.method}</span>
                    <span style="font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${ep.path}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Base URL + Rate Limits -->
            <div class="hx-card" style="padding:14px">
              <div class="hx-text-label hx-mb-6">Base URL</div>
              <code style="font-size:10px;color:var(--hx-secondary)">https://api.haxone.com</code>
              <div class="hx-text-label hx-mt-10 hx-mb-4">Rate Limit</div>
              <div style="font-size:11px;color:var(--hx-text-muted)">1,000 req/min per key<br>10,000 req/day free tier</div>
            </div>
          </div>

          <!-- Main Content -->
          <div style="overflow-y:auto;padding-right:4px">
            <div id="api-main">
              ${this._renderOverview()}
            </div>
          </div>
        </div>
      `;
    },

    _renderOverview() {
      return `
        <div class="hx-card hx-mb-16" style="background:linear-gradient(135deg,rgba(108,99,255,0.08),rgba(0,212,255,0.08));border-color:rgba(108,99,255,0.2)">
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
            <div style="font-size:40px">🔌</div>
            <div>
              <h2>HaxOne Payment API</h2>
              <p style="color:var(--hx-text-muted);font-size:13px">RESTful API for integrating 27+ payment methods into any application</p>
              <div class="hx-flex hx-gap-8 hx-mt-8">
                <span class="hx-badge hx-badge--success">v1.0</span>
                <span class="hx-badge hx-badge--info">REST/JSON</span>
                <span class="hx-badge hx-badge--info">Webhooks</span>
                <span class="hx-badge hx-badge--success">HTTPS Only</span>
              </div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
            ${[['${ENDPOINTS.length}','Total Endpoints','#6C63FF'],['3','Environments','#00D4FF'],['27+','Payment Methods','#00E676'],['99.9%','Uptime SLA','#FFD740']].map(([v,l,c])=>`
              <div style="text-align:center;background:var(--hx-surface);border-radius:8px;padding:12px">
                <div style="font-size:20px;font-weight:800;color:${c}">${v}</div>
                <div style="font-size:11px;color:var(--hx-text-muted)">${l}</div>
              </div>`).join('')}
          </div>
        </div>

        <!-- Authentication -->
        <div class="hx-card hx-mb-16">
          <div class="hx-section-title hx-mb-12">🔑 Authentication</div>
          <p style="font-size:13px;color:var(--hx-text-muted);margin-bottom:12px">All API requests must include your API key in the Authorization header:</p>
          <div class="hx-code-block">Authorization: Bearer hx_live_your_api_key_here</div>
          <div class="hx-info-card hx-mt-12"><span>ℹ️</span><span style="font-size:12px">Never expose your secret key in client-side code. Use environment variables and server-to-server calls for sensitive operations.</span></div>
        </div>

        <!-- Endpoints Overview -->
        <div class="hx-card hx-mb-16">
          <div class="hx-section-title hx-mb-12">📋 All Endpoints</div>
          <div class="hx-table-wrapper" style="border:none">
            <table class="hx-table">
              <thead><tr><th>Method</th><th>Endpoint</th><th>Category</th><th>Description</th></tr></thead>
              <tbody>
                ${ENDPOINTS.map(ep=>`
                  <tr style="cursor:pointer" onclick="window.HaxOnePages['api-docs']._selectEndpoint('${ep.path.replace(/'/g,'')}')">
                    <td><span class="hx-method-badge hx-method-badge--${ep.method.toLowerCase()}">${ep.method}</span></td>
                    <td><code style="font-size:11px">${ep.path}</code></td>
                    <td><span class="hx-badge hx-badge--info" style="font-size:10px">${ep.tag}</span></td>
                    <td style="font-size:12px;color:var(--hx-text-muted)">${ep.desc}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- SDK Install -->
        <div class="hx-card">
          <div class="hx-section-title hx-mb-12">📦 Quick Start</div>
          <div class="hx-tabs" id="sdk-tabs">
            <div class="hx-tab hx-tab--active" data-lang="node">Node.js</div>
            <div class="hx-tab" data-lang="python">Python</div>
            <div class="hx-tab" data-lang="php">PHP</div>
            <div class="hx-tab" data-lang="curl">cURL</div>
          </div>
          <div id="sdk-code" class="hx-code-block" style="overflow-x:auto;white-space:pre">${this._getCodeExample('node')}</div>
          <script>document.getElementById('sdk-tabs')&&document.getElementById('sdk-tabs').querySelectorAll('.hx-tab').forEach(t=>t.addEventListener('click',()=>{document.querySelectorAll('#sdk-tabs .hx-tab').forEach(x=>x.classList.remove('hx-tab--active'));t.classList.add('hx-tab--active');document.getElementById('sdk-code').textContent=window.HaxOnePages['api-docs']._getCodeExample(t.dataset.lang);}));</script>
        </div>
      `;
    },

    _getCodeExample(lang) {
      const examples = {
        node: `// Install: npm install @haxone/sdk
const HaxOne = require('@haxone/sdk');
const client = new HaxOne({ apiKey: 'hx_live_your_key' });

// M-Pesa STK Push
const response = await client.mpesa.stkPush({
  phone: '254712345678',
  amount: 1000,
  accountRef: 'Order-001',
  description: 'Payment for goods'
});
console.log(response.CheckoutRequestID);`,
        python: `# Install: pip install haxone
from haxone import HaxOneClient

client = HaxOneClient(api_key='hx_live_your_key')

# M-Pesa STK Push
response = client.mpesa.stk_push(
    phone='254712345678',
    amount=1000,
    account_ref='Order-001',
    description='Payment for goods'
)
print(response['CheckoutRequestID'])`,
        php: `<?php
// Install: composer require haxone/php-sdk
use HaxOne\\Client;

$client = new Client(['api_key' => 'hx_live_your_key']);

// M-Pesa STK Push
$response = $client->mpesa->stkPush([
    'phone'       => '254712345678',
    'amount'      => 1000,
    'account_ref' => 'Order-001',
    'description' => 'Payment for goods'
]);
echo $response['CheckoutRequestID'];`,
        curl: `curl -X POST https://api.haxone.com/api/v1/mpesa/stk-push \\
  -H "Authorization: Bearer hx_live_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "254712345678",
    "amount": 1000,
    "account_ref": "Order-001",
    "description": "Payment for goods"
  }'`
      };
      return examples[lang] || '';
    },

    _selectEndpoint(path) {
      const ep = ENDPOINTS.find(e => e.path === path);
      if (!ep) return;
      this._activeEndpoint = path;
      const main = document.getElementById('api-main');
      if (!main) return;

      const color = METHOD_COLORS[ep.method] || '#888';
      const reqBody = ep.params.filter(p=>p.r).reduce((o,p)=>{o[p.n]=p.t==='number'?1000:p.t==='boolean'?true:'value';return o;},{});

      main.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <button class="hx-btn hx-btn--ghost hx-btn--sm" onclick="document.getElementById('api-main').innerHTML=window.HaxOnePages['api-docs']._renderOverview()">← Back to Overview</button>
          <button class="hx-btn hx-btn--primary hx-btn--sm" onclick="window.HaxOnePages['api-docs']._tryEndpoint('${path.replace(/'/g,'')}')">▷ Try It Out</button>
        </div>

        <div class="hx-card hx-mb-16">
          <div class="hx-flex hx-items-center hx-gap-12 hx-mb-12">
            <span class="hx-method-badge hx-method-badge--${ep.method.toLowerCase()}" style="font-size:13px;padding:6px 12px">${ep.method}</span>
            <code style="font-size:14px;color:var(--hx-text)">${ep.path}</code>
            <span class="hx-badge hx-badge--info" style="margin-left:auto">${ep.tag}</span>
          </div>
          <p style="color:var(--hx-text-muted);font-size:13px">${ep.desc}</p>
        </div>

        ${ep.params.length ? `
        <div class="hx-card hx-mb-16">
          <div class="hx-section-title hx-mb-12">Parameters</div>
          <div class="hx-table-wrapper" style="border:none">
            <table class="hx-table">
              <thead><tr><th>Name</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
              <tbody>
                ${ep.params.map(p=>`<tr>
                  <td><code>${p.n}</code></td>
                  <td><span class="hx-badge hx-badge--info" style="font-size:10px">${p.t}</span></td>
                  <td>${p.r?'<span class="hx-badge hx-badge--error" style="font-size:10px">required</span>':'<span style="font-size:11px;color:var(--hx-text-muted)">optional</span>'}</td>
                  <td style="font-size:12px;color:var(--hx-text-muted)">${p.d}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
        ` : ''}

        <div class="hx-card hx-mb-16">
          <div class="hx-section-title hx-mb-12">Request Example</div>
          <div class="hx-code-block" style="overflow-x:auto;white-space:pre">curl -X ${ep.method} https://api.haxone.com${ep.path} \\
  -H "Authorization: Bearer hx_live_your_key" \\
  -H "Content-Type: application/json"${ep.method==='POST'?` \\
  -d '${JSON.stringify(reqBody,null,2)}'`:''}</div>
        </div>

        <div class="hx-card hx-mb-16">
          <div class="hx-section-title hx-mb-12">Response</div>
          <div class="hx-code-block" style="overflow-x:auto;white-space:pre">${this._getMockResponse(ep.path)}</div>
        </div>

        <!-- Try it out section -->
        <div class="hx-card" id="try-it-area" style="display:none">
          <div class="hx-section-title hx-mb-12">▷ Live Request</div>
          ${ep.params.map(p=>`<div class="hx-form-group"><label class="hx-label">${p.n} <span style="color:${p.r?'var(--hx-error)':'var(--hx-text-dim)'}">${p.r?'*required':'optional'}</span></label><input class="hx-input" id="try-${p.n}" placeholder="${p.t}" type="${p.t==='number'?'number':'text'}"></div>`).join('')}
          <button class="hx-btn hx-btn--primary hx-mt-8" onclick="window.HaxOnePages['api-docs']._executeRequest('${path.replace(/'/g,'')}')">▷ Execute</button>
          <div id="try-response" style="margin-top:12px"></div>
        </div>
      `;
    },

    _tryEndpoint(path) {
      const area = document.getElementById('try-it-area');
      if (area) area.style.display = 'block';
      area?.scrollIntoView({ behavior:'smooth' });
    },

    async _executeRequest(path) {
      const ep = ENDPOINTS.find(e => e.path === path);
      if (!ep) return;
      const params = {};
      ep.params.forEach(p => {
        const el = document.getElementById('try-' + p.n);
        if (el && el.value) params[p.n] = el.type==='number'?parseFloat(el.value):el.value;
      });
      const resp = document.getElementById('try-response');
      if (resp) resp.innerHTML = '<div class="hx-spinner" style="margin:12px auto"></div>';
      await new Promise(r=>setTimeout(r,800+Math.random()*600));
      const mock = JSON.parse(this._getMockResponse(path));
      if (resp) resp.innerHTML = `<div class="hx-code-block" style="white-space:pre;overflow-x:auto">${JSON.stringify(mock,null,2)}</div>`;
      window.HaxOne.toast.show('Request executed successfully ✓','success');
    },

    _getMockResponse(path) {
      const responses = {
        '/api/v1/mpesa/stk-push':    JSON.stringify({ MerchantRequestID:'12345-67890', CheckoutRequestID:'ws_CO_'+Date.now(), ResponseCode:'0', CustomerMessage:'Request accepted for processing' },null,2),
        '/api/v1/mpesa/balance':     JSON.stringify({ WorkingAccount:'Working Account|KES|245830.00', UtilityAccount:'Utility Account|KES|12400.00', ResultCode:'0' },null,2),
        '/api/v1/charge':            JSON.stringify({ id:'TXN'+Date.now(), status:'success', amount:1000, currency:'KES', gateway:'daraja', receipt:'QHX8A3Z1', created_at:new Date().toISOString() },null,2),
        '/api/v1/transactions':      JSON.stringify({ data:[{id:'TXN001',amount:5000,status:'success',method:'mpesa_stk'}], meta:{total:80,page:1,per_page:25} },null,2),
        '/api/v1/gateways/health':   JSON.stringify({ daraja:{status:'online',ping:'142ms'}, paypal:{status:'online',ping:'112ms'}, stripe:{status:'offline',error:'Credentials not configured'} },null,2),
      };
      return responses[path] || JSON.stringify({ success:true, message:'Request processed successfully', timestamp:new Date().toISOString() },null,2);
    },

    _filterTag(tag) {
      this._activeTag = tag;
      document.querySelectorAll('.hx-api-tag').forEach(el => el.classList.toggle('hx-api-tag--active', el.dataset.tag===tag));
      const list = document.querySelector('#api-main') ? null : null;
      const sidebar = document.querySelector('[data-ep]')?.parentElement;
      if (sidebar) {
        const items = ENDPOINTS.filter(e=>tag==='All'||e.tag===tag);
        sidebar.innerHTML = items.map(ep=>`<div class="hx-api-endpoint-item" data-ep="${ep.path}" onclick="window.HaxOnePages['api-docs']._selectEndpoint('${ep.path.replace(/'/g,'')}')"><span class="hx-method-badge hx-method-badge--${ep.method.toLowerCase()}">${ep.method}</span><span style="font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${ep.path}</span></div>`).join('');
      }
    },

    _toggleKey() {
      const el = document.getElementById('api-key-display');
      if (!el) return;
      el.textContent = el.textContent.includes('*') ? 'hx_live_demo_key_abc123xyz456' : 'hx_live_****_****_****';
    },

    destroy() {}
  };
})();
