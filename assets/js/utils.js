/* ============================================================
   HaxOne Payment Platform — utils.js
   Shared utility functions
   ============================================================ */
(function () {
  'use strict';

  const Utils = {
    formatCurrency(amount, symbol) {
      symbol = symbol || (window.HaxOne.store && window.HaxOne.store.get('settings').currencySymbol) || 'KSh';
      return symbol + '\u00a0' + Number(amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    formatDate(iso, format) {
      if (!iso) return '—';
      const d = new Date(iso);
      if (isNaN(d)) return iso;
      format = format || 'full';
      if (format === 'full')     return d.toLocaleString('en-KE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      if (format === 'date')     return d.toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' });
      if (format === 'time')     return d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
      if (format === 'short')    return d.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
      if (format === 'relative') return Utils.timeAgo(d);
      return d.toLocaleString();
    },

    timeAgo(date) {
      const secs = Math.floor((Date.now() - new Date(date)) / 1000);
      if (secs < 5)   return 'just now';
      if (secs < 60)  return secs + 's ago';
      if (secs < 3600) return Math.floor(secs / 60) + 'm ago';
      if (secs < 86400) return Math.floor(secs / 3600) + 'h ago';
      return Math.floor(secs / 86400) + 'd ago';
    },

    methodLabel(method) {
      const labels = {
        mpesa_stk: 'M-Pesa STK Push', mpesa_till: 'M-Pesa Till', mpesa_paybill: 'M-Pesa Paybill',
        mpesa_qr: 'M-Pesa QR Code', mpesa_pochi: 'Pochi la Biashara', mpesa_b2c: 'M-Pesa B2C',
        paypal: 'PayPal', stripe: 'Stripe', flutterwave: 'Flutterwave', pesapal: 'Pesapal',
        paystack: 'Paystack', dpo: 'DPO Group', yoco: 'Yoco', cellulant: 'Cellulant',
        airtel_money: 'Airtel Money', mtn_momo: 'MTN MoMo', orange_money: 'Orange Money',
        card_visa: 'Visa Card', card_mastercard: 'Mastercard', card_amex: 'Amex',
        google_pay: 'Google Pay', apple_pay: 'Apple Pay', bank_transfer: 'Bank Transfer',
        cash: 'Cash', gift_card: 'Gift Card', store_credit: 'Store Credit'
      };
      return labels[method] || (method ? method.replace(/_/g, ' ') : '—');
    },

    methodIcon(method) {
      const icons = {
        mpesa_stk: '📱', mpesa_till: '🏪', mpesa_paybill: '🏦', mpesa_qr: '📲', mpesa_pochi: '👛',
        paypal: '🅿️', stripe: '💳', flutterwave: '🌊', pesapal: '💰', paystack: '⚡',
        dpo: '🌍', yoco: '💳', cellulant: '📡', airtel_money: '📶', mtn_momo: '🟡',
        orange_money: '🟠', card_visa: '💳', card_mastercard: '💳', card_amex: '💳',
        google_pay: '🔵', apple_pay: '🍎', bank_transfer: '🏦', cash: '💵',
        gift_card: '🎁', store_credit: '⭐'
      };
      return icons[method] || '💳';
    },

    gatewayLabel(gw) {
      const labels = { daraja: 'Daraja (M-Pesa)', pesapal: 'Pesapal', paystack: 'Paystack', flutterwave: 'Flutterwave', stripe: 'Stripe', paypal: 'PayPal', dpo: 'DPO Group', local: 'Local' };
      return labels[gw] || gw;
    },

    statusBadge(status) {
      const map = {
        success:  ['hx-badge--success', '✓ Success'],
        failed:   ['hx-badge--error',   '✗ Failed'],
        pending:  ['hx-badge--pending', '⏳ Pending'],
        refunded: ['hx-badge--info',    '↩ Refunded'],
        online:   ['hx-badge--success', '● Online'],
        offline:  ['hx-badge--error',   '● Offline'],
        degraded: ['hx-badge--warning', '● Degraded']
      };
      const [cls, label] = map[status] || ['hx-badge--neutral', status];
      return `<span class="hx-badge ${cls}">${label}</span>`;
    },

    formatPhone(phone) {
      if (!phone) return '';
      let p = String(phone).replace(/\D/g, '');
      if (p.startsWith('0') && p.length === 10) p = '254' + p.slice(1);
      if (!p.startsWith('254') && !p.startsWith('+')) p = '254' + p;
      return '+' + p.replace(/^\+/, '');
    },

    validatePhone(phone) {
      const p = String(phone).replace(/\D/g, '');
      return p.length >= 9 && p.length <= 13;
    },

    generateId(prefix) {
      prefix = prefix || 'HX';
      return prefix + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
    },

    animateCounter(el, from, to, duration, formatter) {
      if (!el) return;
      duration = duration || 1000;
      formatter = formatter || (v => v);
      const start = performance.now();
      const step = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatter(Math.round(from + (to - from) * eased));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },

    exportCSV(data, filename) {
      if (!data || !data.length) return;
      const headers = Object.keys(data[0]);
      const rows = data.map(row => headers.map(h => {
        const v = row[h] != null ? row[h] : '';
        return '"' + String(v).replace(/"/g, '""') + '"';
      }).join(','));
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = (filename || 'export') + '.csv'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },

    clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    },

    debounce(fn, ms) {
      let t;
      return function () {
        const args = arguments;
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), ms);
      };
    },

    sum(arr, key) {
      return arr.reduce((s, item) => s + (key ? (item[key] || 0) : (item || 0)), 0);
    },

    groupBy(arr, key) {
      return arr.reduce((acc, item) => {
        const k = item[key];
        if (!acc[k]) acc[k] = [];
        acc[k].push(item);
        return acc;
      }, {});
    },

    generateQRPlaceholder(data) {
      const size = 200;
      const cells = 21;
      const cs = size / cells;
      let rects = '';
      let seed = (data || 'HaxOne').split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
      const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
      const marker = (x, y) => [
        `<rect x="${x * cs}" y="${y * cs}" width="${7 * cs}" height="${7 * cs}" fill="#1a1a2e"/>`,
        `<rect x="${(x+1)*cs}" y="${(y+1)*cs}" width="${5*cs}" height="${5*cs}" fill="white"/>`,
        `<rect x="${(x+2)*cs}" y="${(y+2)*cs}" width="${3*cs}" height="${3*cs}" fill="#6C63FF"/>`
      ].join('');
      for (let r = 0; r < cells; r++) {
        for (let c = 0; c < cells; c++) {
          const inCorner = (r < 8 && c < 8) || (r < 8 && c >= cells - 7) || (r >= cells - 7 && c < 8);
          if (inCorner) continue;
          if (rand() > 0.52) rects += `<rect x="${c*cs}" y="${r*cs}" width="${cs}" height="${cs}" fill="#1a1a2e"/>`;
        }
      }
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="white"/>${rects}${marker(0,0)}${marker(cells-7,0)}${marker(0,cells-7)}</svg>`;
    },

    // Trigger confetti burst from center of screen
    confetti() {
      const colors = ['#6C63FF','#00D4FF','#FF6B6B','#FFD740','#00E676'];
      for (let i = 0; i < 40; i++) {
        const el = document.createElement('div');
        el.className = 'hx-confetti-piece';
        el.style.cssText = `left:${40+Math.random()*20}vw;top:${20+Math.random()*30}vh;background:${colors[i%colors.length]};--cx:${(Math.random()-0.5)*400}px;animation-delay:${Math.random()*0.3}s;`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2000);
      }
    },

    escapeHtml(str) {
      const d = document.createElement('div');
      d.textContent = str;
      return d.innerHTML;
    },

    isToday(iso) {
      const d = new Date(iso);
      const n = new Date();
      return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
    },

    todayRevenue(transactions) {
      return transactions
        .filter(t => t.status === 'success' && Utils.isToday(t.timestamp))
        .reduce((s, t) => s + t.amount, 0);
    },

    successRate(transactions) {
      if (!transactions.length) return 0;
      const ok = transactions.filter(t => t.status === 'success').length;
      return Math.round((ok / transactions.length) * 100);
    }
  };

  window.HaxOne = window.HaxOne || {};
  window.HaxOne.utils = Utils;
})();
