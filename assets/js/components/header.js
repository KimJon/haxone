/* ============================================================
   HaxOne Payment Platform — components/header.js + modal.js + toast.js + charts.js
   All in one file for efficiency
   ============================================================ */

/* ── HEADER ── */
(function () {
  'use strict';

  const PAGE_TITLES = {
    dashboard:      { title: 'Analytics Dashboard',  emoji: '📊' },
    terminal:       { title: 'Payment Terminal',      emoji: '💳' },
    gateways:       { title: 'Gateway Management',    emoji: '⚙️' },
    mpesa:          { title: 'M-Pesa Features',       emoji: '📱' },
    reconciliation: { title: 'Reconciliation',        emoji: '⚖️' },
    transactions:   { title: 'Transaction History',   emoji: '📋' },
    security:       { title: 'Security Center',       emoji: '🛡️' },
    'api-docs':     { title: 'API Documentation',     emoji: '🔌' }
  };

  const Header = {
    _clockInterval: null,

    init() {
      const el = document.getElementById('hx-header');
      if (!el) return;

      el.innerHTML = `
        <div class="hx-header-title" id="hx-page-title">
          <span class="page-emoji">📊</span>
          <span class="page-name">Analytics Dashboard</span>
        </div>

        <div class="hx-header-search hx-search" style="max-width:280px">
          <span class="hx-search-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input class="hx-input" placeholder="Search transactions, receipts…" style="font-size:12px;padding:7px 14px 7px 36px" onfocus="window.HaxOne.navigate('transactions')">
        </div>

        <div class="hx-header-right">
          <div class="hx-header-clock" id="hx-clock">--:--:--</div>

          <button class="hx-header-icon-btn" title="Notifications" id="hx-notif-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span class="hx-notif-badge">3</span>
          </button>

          <button class="hx-header-icon-btn" title="Settings" onclick="window.HaxOne.navigate('security')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>

          <div class="hx-header-user" onclick="window.HaxOne.toast.show('User profile settings coming soon.','info')">
            <div class="hx-header-avatar">AU</div>
            <span class="hx-header-username">Admin</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      `;

      // Notifications popup
      document.getElementById('hx-notif-btn').addEventListener('click', () => {
        window.HaxOne.toast.show('3 unread notifications — Security scan completed, New transaction, Gateway health alert', 'info', 5000);
      });

      this._startClock();
    },

    _startClock() {
      const update = () => {
        const el = document.getElementById('hx-clock');
        if (el) el.textContent = new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      };
      update();
      this._clockInterval = setInterval(update, 1000);
    },

    setTitle(pageId) {
      const info = PAGE_TITLES[pageId] || { title: pageId, emoji: '📄' };
      const el = document.getElementById('hx-page-title');
      if (el) {
        el.querySelector('.page-emoji').textContent = info.emoji;
        el.querySelector('.page-name').textContent = info.title;
      }
    },

    destroy() {
      if (this._clockInterval) clearInterval(this._clockInterval);
    }
  };

  window.HaxOne = window.HaxOne || {};
  window.HaxOne.header = Header;
})();
