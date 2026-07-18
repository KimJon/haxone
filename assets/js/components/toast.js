/* ============================================================
   HaxOne Payment Platform — components/toast.js
   ============================================================ */
(function () {
  'use strict';

  const ICONS = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  let _count = 0;

  const Toast = {
    init() {
      let container = document.getElementById('hx-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'hx-toast-container';
        document.body.appendChild(container);
      }
    },

    show(message, type, duration) {
      type = type || 'info';
      duration = duration || 4000;

      const container = document.getElementById('hx-toast-container');
      if (!container) return;

      // Limit to 5 toasts
      const existing = container.querySelectorAll('.hx-toast');
      if (existing.length >= 5) existing[existing.length - 1].remove();

      const id = 'toast-' + (++_count);
      const toast = document.createElement('div');
      toast.id = id;
      toast.className = `hx-toast hx-toast--${type}`;

      // Split message if it has a title separator (first sentence as title)
      let titleHtml = '', msgHtml = message;
      if (message.length > 60) {
        const firstDot = message.indexOf('.');
        if (firstDot > 10 && firstDot < 60) {
          titleHtml = `<div class="hx-toast-title">${message.substring(0, firstDot + 1)}</div>`;
          msgHtml = message.substring(firstDot + 1).trim();
        }
      }

      toast.innerHTML = `
        <span class="hx-toast-icon">${ICONS[type] || 'ℹ️'}</span>
        <div class="hx-toast-body">
          ${titleHtml}
          <div class="hx-toast-msg">${msgHtml}</div>
        </div>
        <button class="hx-toast-close" aria-label="Close">✕</button>
        <div class="hx-toast-progress" style="width:100%"></div>
      `;

      toast.querySelector('.hx-toast-close').addEventListener('click', () => this._remove(toast));
      container.insertBefore(toast, container.firstChild);

      // Animate progress bar
      const bar = toast.querySelector('.hx-toast-progress');
      requestAnimationFrame(() => {
        bar.style.transition = `width ${duration}ms linear`;
        bar.style.width = '0%';
      });

      const timer = setTimeout(() => this._remove(toast), duration);
      toast._removeTimer = timer;
    },

    _remove(toast) {
      clearTimeout(toast._removeTimer);
      toast.style.animation = 'hx-slide-out-right 0.28s ease forwards';
      setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 280);
    },

    success(msg, dur) { this.show(msg, 'success', dur); },
    error(msg, dur)   { this.show(msg, 'error',   dur); },
    warning(msg, dur) { this.show(msg, 'warning',  dur); },
    info(msg, dur)    { this.show(msg, 'info',     dur); }
  };

  window.HaxOne = window.HaxOne || {};
  window.HaxOne.toast = Toast;
})();
