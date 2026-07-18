/* ============================================================
   HaxOne Payment Platform — components/modal.js
   ============================================================ */
(function () {
  'use strict';

  const Modal = {
    _isOpen: false,

    init() {
      const overlay = document.getElementById('hx-modal-overlay');
      if (!overlay) return;
      overlay.addEventListener('click', e => {
        if (e.target === overlay) this.close();
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && this._isOpen) this.close();
      });
    },

    open({ title, content, actions, size, closable }) {
      const overlay = document.getElementById('hx-modal-overlay');
      if (!overlay) return;
      closable = closable !== false;
      size = size || 'md';

      const actionBtns = (actions || []).map(a => {
        const cls = a.type === 'primary' ? 'hx-btn--primary' : a.type === 'danger' ? 'hx-btn--danger' : a.type === 'success' ? 'hx-btn--success' : 'hx-btn--ghost';
        return `<button class="hx-btn ${cls}" id="modal-action-${Math.random().toString(36).substr(2,5)}" data-action-id="${a.id || ''}">${a.label}</button>`;
      }).join('');

      overlay.innerHTML = `
        <div class="hx-modal hx-modal--${size}" role="dialog" aria-modal="true">
          <div class="hx-modal-header">
            <div class="hx-modal-title">${title || ''}</div>
            ${closable ? '<button class="hx-modal-close" id="hx-modal-close-btn" aria-label="Close">✕</button>' : ''}
          </div>
          <div class="hx-modal-body">${content || ''}</div>
          ${actionBtns ? `<div class="hx-modal-footer">${actionBtns}</div>` : ''}
        </div>
      `;

      if (closable) {
        const closeBtn = overlay.querySelector('#hx-modal-close-btn');
        if (closeBtn) closeBtn.addEventListener('click', () => this.close());
      }

      // Bind action buttons
      (actions || []).forEach(a => {
        if (a.onClick) {
          overlay.querySelectorAll(`[data-action-id="${a.id || ''}"]`).forEach(btn => {
            btn.addEventListener('click', () => a.onClick(btn));
          });
        }
      });

      overlay.classList.add('open');
      this._isOpen = true;
      document.body.style.overflow = 'hidden';
    },

    close() {
      const overlay = document.getElementById('hx-modal-overlay');
      if (!overlay) return;
      overlay.classList.remove('open');
      this._isOpen = false;
      document.body.style.overflow = '';
      setTimeout(() => { overlay.innerHTML = ''; }, 280);
    },

    setContent(html) {
      const body = document.querySelector('#hx-modal-overlay .hx-modal-body');
      if (body) body.innerHTML = html;
    },

    confirm({ title, message, onConfirm, danger }) {
      this.open({
        title: title || 'Confirm Action',
        content: `<p style="color:var(--hx-text-muted);font-size:14px;line-height:1.6">${message}</p>`,
        size: 'sm',
        actions: [
          { label: 'Cancel', id: 'cancel', type: 'ghost', onClick: () => this.close() },
          { label: danger ? 'Delete' : 'Confirm', id: 'confirm', type: danger ? 'danger' : 'primary', onClick: () => { this.close(); if (onConfirm) onConfirm(); } }
        ]
      });
    }
  };

  window.HaxOne = window.HaxOne || {};
  window.HaxOne.modal = Modal;
})();
