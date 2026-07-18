/* ============================================================
   HaxOne Payment Platform — components/sidebar.js
   ============================================================ */
(function () {
  'use strict';

  const NAV_ITEMS = [
    { id: 'dashboard',      label: 'Dashboard',          icon: 'chart',    badge: null },
    { id: 'terminal',       label: 'Payment Terminal',   icon: 'card',     badge: null },
    { id: 'gateways',       label: 'Gateway Management', icon: 'cog',      badge: null },
    { id: 'mpesa',          label: 'M-Pesa Features',    icon: 'mobile',   badge: null },
    { id: 'reconciliation', label: 'Reconciliation',     icon: 'scale',    badge: null },
    { id: 'transactions',   label: 'Transactions',       icon: 'list',     badge: null },
    { id: 'security',       label: 'Security Center',    icon: 'shield',   badge: '2' },
    { id: 'api-docs',       label: 'API Docs',           icon: 'code',     badge: null }
  ];

  const ICONS = {
    chart:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
    card:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    cog:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    mobile: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
    scale:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><path d="M3 9l9-6 9 6"/><path d="M3 9c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4"/><path d="M3 15c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4"/></svg>`,
    list:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
    shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    code:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    logout: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`
  };

  const LOGO_SVG = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sb-lg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6C63FF"/>
        <stop offset="100%" stop-color="#00D4FF"/>
      </linearGradient>
    </defs>
    <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="url(#sb-lg)"/>
    <text x="20" y="27" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="18" fill="white">H</text>
  </svg>`;

  const Sidebar = {
    _activeId: null,

    init() {
      const el = document.getElementById('hx-sidebar');
      if (!el) return;

      el.innerHTML = `
        <div class="hx-nav-logo">
          <div class="hx-nav-logo-icon">${LOGO_SVG}</div>
          <div>
            <div class="hx-nav-logo-text">HaxOne</div>
            <div class="hx-nav-logo-sub">PAYMENT PLATFORM</div>
          </div>
        </div>

        <nav class="hx-nav-section" id="hx-nav-items">
          <div class="hx-nav-section-label">Navigation</div>
          ${NAV_ITEMS.map(item => `
            <div class="hx-nav-item" data-page="${item.id}" id="nav-${item.id}" title="${item.label}">
              <span class="hx-nav-icon">${ICONS[item.icon] || ''}</span>
              <span class="hx-nav-label">${item.label}</span>
              ${item.badge ? `<span class="hx-nav-badge">${item.badge}</span>` : ''}
            </div>
          `).join('')}
        </nav>

        <div class="hx-nav-footer">
          <div class="hx-nav-avatar">AU</div>
          <div style="flex:1;min-width:0">
            <div class="hx-nav-user-name hx-truncate">Admin User</div>
            <div class="hx-nav-user-role">Super Admin</div>
          </div>
          <button class="hx-btn hx-btn--icon hx-btn--ghost" title="Logout" onclick="window.HaxOne.toast.show('Logout functionality would be implemented here.','info')" style="color:var(--hx-text-muted)">
            ${ICONS.logout}
          </button>
        </div>
      `;

      // Bind click events
      el.querySelectorAll('.hx-nav-item[data-page]').forEach(item => {
        item.addEventListener('click', () => {
          const page = item.getAttribute('data-page');
          if (window.HaxOne && window.HaxOne.navigate) {
            window.HaxOne.navigate(page);
          }
        });
      });
    },

    setActive(pageId) {
      this._activeId = pageId;
      document.querySelectorAll('.hx-nav-item[data-page]').forEach(item => {
        const isActive = item.getAttribute('data-page') === pageId;
        item.classList.toggle('hx-nav-item--active', isActive);
      });
    }
  };

  window.HaxOne = window.HaxOne || {};
  window.HaxOne.sidebar = Sidebar;
})();
