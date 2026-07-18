/* ============================================================
   HaxOne Payment Platform — app.js
   Bootstrap: Router, navigation, SPA shell init
   ============================================================ */
(function () {
  'use strict';

  const PAGES = ['dashboard','terminal','gateways','mpesa','reconciliation','transactions','security','api-docs'];
  let _currentPage = null;
  let _currentModule = null;

  const App = {
    init() {
      // Init components
      window.HaxOne.toast.init();
      window.HaxOne.modal.init();
      window.HaxOne.sidebar.init();
      window.HaxOne.header.init();

      // Determine start page
      const hash = location.hash.replace('#','') || 'dashboard';
      const startPage = PAGES.includes(hash) ? hash : 'dashboard';

      // Route
      this.navigate(startPage);

      // Confetti style injection
      this._injectDynamicStyles();

      // Hide splash screen
      setTimeout(() => {
        const splash = document.getElementById('hx-splash');
        if (splash) {
          splash.style.opacity = '0';
          splash.style.transition = 'opacity 0.5s ease';
          setTimeout(() => { if (splash) splash.remove(); }, 500);
        }
      }, 800);

      console.log('%c🔷 HaxOne Payment Platform v1.0 loaded', 'color:#6C63FF;font-weight:bold;font-size:14px');
    },

    navigate(pageId) {
      if (!PAGES.includes(pageId)) { console.warn('Unknown page:', pageId); return; }
      if (_currentPage === pageId) return;

      // Destroy current page
      if (_currentModule && typeof _currentModule.destroy === 'function') {
        try { _currentModule.destroy(); } catch(e) {}
      }

      _currentPage = pageId;
      location.hash = pageId;

      // Update sidebar + header
      window.HaxOne.sidebar.setActive(pageId);
      window.HaxOne.header.setTitle(pageId);

      // Render page
      const container = document.getElementById('hx-page-content');
      if (!container) return;
      container.innerHTML = '';
      container.scrollTop = 0;
      container.classList.remove('hx-page-enter');
      void container.offsetWidth; // trigger reflow
      container.classList.add('hx-page-enter');

      const mod = window.HaxOnePages && window.HaxOnePages[pageId];
      if (mod) {
        try {
          mod.render(container);
          _currentModule = mod;
        } catch(e) {
          console.error('Page render error:', e);
          container.innerHTML = `
            <div style="text-align:center;padding:60px;color:var(--hx-text-muted)">
              <div style="font-size:48px;margin-bottom:16px">⚠️</div>
              <h2>Page Error</h2>
              <p style="font-size:13px;margin-bottom:20px">${e.message}</p>
              <button class="hx-btn hx-btn--primary" onclick="window.HaxOne.navigate('dashboard')">← Back to Dashboard</button>
            </div>
          `;
        }
      } else {
        container.innerHTML = `
          <div style="text-align:center;padding:60px;color:var(--hx-text-muted)">
            <div style="font-size:48px;margin-bottom:16px">🚧</div>
            <h2>Page Not Found</h2>
            <p style="font-size:13px">The page "${pageId}" could not be found.</p>
          </div>
        `;
      }
    },

    _injectDynamicStyles() {
      const style = document.createElement('style');
      style.textContent = `
        /* Confetti */
        .hx-confetti-piece {
          position: fixed;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          pointer-events: none;
          z-index: 9999;
          animation: hx-confetti-fall 1.8s cubic-bezier(.25,.46,.45,.94) forwards;
        }
        @keyframes hx-confetti-fall {
          0%   { transform: translateY(0) rotate(0deg) translateX(0); opacity: 1; }
          100% { transform: translateY(60vh) rotate(720deg) translateX(var(--cx, 100px)); opacity: 0; }
        }

        /* Search bar */
        .hx-search { position: relative; }
        .hx-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--hx-text-muted); pointer-events: none; }

        /* Input prefix */
        .hx-input-prefix {
          display: flex; align-items: center; padding: 10px 12px;
          background: var(--hx-surface-2); border: 1px solid var(--hx-border);
          border-right: none; color: var(--hx-text-muted); font-size: 13px; white-space: nowrap;
          border-radius: var(--hx-radius-sm) 0 0 var(--hx-radius-sm);
        }

        /* Amount display */
        .hx-amount-display { background: var(--hx-surface); border: 1px solid var(--hx-border); border-radius: var(--hx-radius); padding: 20px; }
        .hx-amount-main { font-size: 48px; font-weight: 900; letter-spacing: -2px; color: var(--hx-text); text-align: right; margin-bottom: 16px; }
        .hx-amount-currency { font-size: 22px; font-weight: 600; color: var(--hx-text-muted); margin-right: 6px; vertical-align: baseline; }
        .hx-amount-breakdown { border-top: 1px solid var(--hx-border); padding-top: 12px; display: flex; flex-direction: column; gap: 6px; }
        .hx-amount-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--hx-text-muted); }
        .hx-amount-row.total { font-size: 14px; font-weight: 700; color: var(--hx-text); border-top: 1px solid var(--hx-border); padding-top: 6px; }

        /* Quick amounts */
        .hx-quick-amounts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
        .hx-quick-btn { padding: 8px; background: var(--hx-surface-2); border: 1px solid var(--hx-border); border-radius: 6px; color: var(--hx-text); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
        .hx-quick-btn:hover { background: var(--hx-surface-3); border-color: var(--hx-primary); color: var(--hx-primary); transform: translateY(-1px); }

        /* Charge button */
        .hx-charge-btn { width: 100%; padding: 18px; font-size: 17px; font-weight: 800; background: linear-gradient(135deg, var(--hx-primary), var(--hx-secondary)); border: none; border-radius: var(--hx-radius); color: white; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 20px rgba(108,99,255,0.3); }
        .hx-charge-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(108,99,255,0.4); }
        .hx-charge-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

        /* Payment method mini cards */
        .hx-pay-method { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 6px; border: 1px solid var(--hx-border); border-radius: 8px; cursor: pointer; transition: all 0.15s; background: var(--hx-surface-2); font-size: 11px; text-align: center; }
        .hx-pay-method:hover { border-color: var(--hx-primary); background: rgba(108,99,255,0.06); transform: translateY(-1px); }
        .hx-pay-method--active { border-color: var(--hx-primary) !important; background: rgba(108,99,255,0.1) !important; }
        .hx-pay-method-icon { font-size: 20px; }

        /* Gateway card */
        .hx-gateway-card { background: var(--hx-surface); border: 1px solid var(--hx-border); border-radius: var(--hx-radius); padding: 14px; cursor: pointer; transition: all 0.2s; flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .hx-gateway-card:hover { border-color: var(--hx-primary); transform: translateY(-2px); box-shadow: 0 4px 20px rgba(108,99,255,0.1); }
        .hx-gateway-card--active { border-color: var(--hx-primary); background: rgba(108,99,255,0.05); }
        .hx-gateway-name { font-size: 12px; font-weight: 700; }
        .hx-gateway-status { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--hx-text-muted); }
        .hx-toggle-wrap { display: flex; align-items: center; gap: 6px; cursor: pointer; }

        /* Secret input group */
        .hx-secret-group { position: relative; }
        .hx-secret-group input { padding-right: 40px; }
        .hx-secret-toggle { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--hx-text-muted); cursor: pointer; padding: 4px; }

        /* Form row */
        .hx-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        /* M-Pesa STK button */
        .hx-btn--mpesa { background: #00a651 !important; color: white !important; border: none; }
        .hx-btn--mpesa:hover { background: #008c44 !important; transform: translateY(-1px); }
        .hx-btn--paypal { background: #003087 !important; color: white !important; border: none; }
        .hx-btn--paypal:hover { background: #002069 !important; }

        /* Alert rows */
        .hx-alert-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px; background: var(--hx-surface-2); border-left: 3px solid; }
        .hx-alert-row--high { border-color: var(--hx-error); }
        .hx-alert-row--medium { border-color: var(--hx-warning); }
        .hx-alert-row--low { border-color: var(--hx-success); }
        .hx-alert-icon { font-size: 20px; flex-shrink: 0; }
        .hx-alert-body { flex: 1; min-width: 0; }
        .hx-alert-msg { font-size: 13px; font-weight: 500; }
        .hx-alert-time { font-size: 11px; color: var(--hx-text-muted); margin-top: 2px; }

        /* Rule rows */
        .hx-rule-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px; background: var(--hx-surface-2); }

        /* Sync rows */
        .hx-sync-row { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 8px; background: var(--hx-surface-2); margin-bottom: 6px; }
        .hx-sync-icon { font-size: 20px; }
        .hx-sync-info { flex: 1; }
        .hx-sync-status { font-size: 11px; }
        .hx-sync-status--pending { color: var(--hx-warning); }
        .hx-sync-status--synced  { color: var(--hx-success); }

        /* API Docs */
        .hx-api-tag { padding: 7px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; color: var(--hx-text-muted); transition: all 0.15s; }
        .hx-api-tag:hover { background: var(--hx-surface-2); color: var(--hx-text); }
        .hx-api-tag--active { background: rgba(108,99,255,0.1); color: var(--hx-primary); }
        .hx-api-endpoint-item { display: flex; align-items: center; gap: 8px; padding: 7px 8px; border-radius: 6px; cursor: pointer; transition: all 0.15s; margin-bottom: 2px; }
        .hx-api-endpoint-item:hover { background: var(--hx-surface-2); }
        .hx-method-badge { display: inline-flex; align-items: center; justify-content: center; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-weight: 800; letter-spacing: 0.05em; flex-shrink: 0; min-width: 42px; }
        .hx-method-badge--get    { background: rgba(0,212,255,0.15); color: #00D4FF; }
        .hx-method-badge--post   { background: rgba(108,99,255,0.15); color: #6C63FF; }
        .hx-method-badge--put    { background: rgba(255,215,64,0.15); color: #FFD740; }
        .hx-method-badge--delete { background: rgba(255,82,82,0.15); color: #FF5252; }
        .hx-code-block { background: var(--hx-surface-2); border: 1px solid var(--hx-border); border-radius: 8px; padding: 16px; font-family: 'JetBrains Mono',monospace; font-size: 12px; color: var(--hx-text); line-height: 1.6; }

        /* Section utilities */
        .hx-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0; }
        .hx-section-title { font-size: 14px; font-weight: 700; color: var(--hx-text); }
        .hx-mb-8 { margin-bottom: 8px; } .hx-mb-12 { margin-bottom: 12px; } .hx-mb-16 { margin-bottom: 16px; } .hx-mb-20 { margin-bottom: 20px; } .hx-mb-24 { margin-bottom: 24px; }
        .hx-mt-8 { margin-top: 8px; } .hx-mt-10 { margin-top: 10px; } .hx-mt-16 { margin-top: 16px; } .hx-mt-20 { margin-top: 20px; }
        .hx-flex-1 { flex: 1; } .hx-w-full { width: 100%; } .hx-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        /* Cards misc */
        .hx-card--hover { transition: all 0.2s; cursor: pointer; }
        .hx-card--hover:hover { border-color: var(--hx-primary); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(108,99,255,0.08); }
        .hx-info-card { display: flex; align-items: flex-start; gap: 8px; background: rgba(0,212,255,0.06); border: 1px solid rgba(0,212,255,0.15); border-radius: 8px; padding: 10px 14px; }
        .hx-warning-card { display: flex; align-items: flex-start; gap: 8px; background: rgba(255,215,64,0.06); border: 1px solid rgba(255,215,64,0.2); border-radius: 8px; padding: 10px 14px; }
        .hx-success-card { background: rgba(0,230,118,0.06); border: 1px solid rgba(0,230,118,0.2); border-radius: 8px; padding: 12px 16px; color: var(--hx-success); font-size: 13px; }
        .hx-error-bg  { background: rgba(255,82,82,0.06); }
        .hx-success-bg { background: rgba(0,230,118,0.06); }
        .hx-info-bg { background: rgba(0,212,255,0.06); }

        /* Receipt */
        .hx-receipt { font-family: 'Courier New', monospace; }
        .hx-receipt-header { text-align: center; padding-bottom: 12px; border-bottom: 1px dashed #ccc; margin-bottom: 12px; }
        .hx-receipt-business { font-size: 15px; font-weight: 700; }
        .hx-receipt-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
        .hx-receipt-total { font-weight: 900; font-size: 14px; }
        .hx-receipt-divider { border-top: 1px dashed var(--hx-border); margin: 8px 0; }
        .hx-receipt-footer { text-align: center; font-size: 11px; color: var(--hx-text-muted); margin-top: 12px; }

        /* Live ticker */
        .hx-ticker { display: flex; align-items: center; gap: 8px; }
        .hx-ticker-dot { width: 8px; height: 8px; background: var(--hx-success); border-radius: 50%; animation: hx-pulse-glow 1.5s ease infinite; }

        /* Progress bar */
        .hx-progress { height: 4px; background: var(--hx-surface-2); border-radius: 2px; overflow: hidden; }
        .hx-progress-fill { height: 100%; border-radius: 2px; transition: width 0.5s ease; }

        /* Stat cards */
        .hx-stat-card { background: var(--hx-surface); border: 1px solid var(--hx-border); border-radius: var(--hx-radius); padding: 16px; display: flex; gap: 12px; align-items: flex-start; transition: all 0.2s; }
        .hx-stat-card:hover { border-color: var(--hx-primary); transform: translateY(-1px); }
        .hx-stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .hx-stat-body { flex: 1; min-width: 0; }
        .hx-stat-value { font-size: 20px; font-weight: 800; color: var(--hx-text); line-height: 1.2; }
        .hx-stat-label { font-size: 11px; color: var(--hx-text-muted); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.05em; }
        .hx-stat-trend { font-size: 11px; margin-top: 4px; font-weight: 600; }
        .hx-text-success { color: var(--hx-success) !important; }
        .hx-text-error   { color: var(--hx-error) !important; }
        .hx-text-warning { color: var(--hx-warning) !important; }

        /* Grids */
        .hx-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .hx-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .hx-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 1200px) { .hx-grid-4 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 1000px) { .hx-grid-3 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .hx-grid-2, .hx-grid-3, .hx-grid-4 { grid-template-columns: 1fr; } }
      `;
      document.head.appendChild(style);
    }
  };

  // Expose to global
  window.HaxOne.navigate = (page) => App.navigate(page);

  // Kickstart
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }
})();
