/* ============================================================
   HaxOne Payment Platform — components/charts.js
   Canvas-based charting (no external libs)
   ============================================================ */
(function () {
  'use strict';

  const BRAND_COLORS = ['#6C63FF','#00D4FF','#FF6B6B','#FFD740','#00E676','#FF9100','#E040FB','#40C4FF'];

  function dpr() { return window.devicePixelRatio || 1; }

  function setupCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const ratio = dpr();
    canvas.width  = rect.width  * ratio;
    canvas.height = rect.height * ratio;
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    return { ctx, w: rect.width, h: rect.height };
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  const Charts = {

    /* ── Line Chart ── */
    drawLine(canvas, data, options) {
      if (!canvas) return;
      options = options || {};
      const { ctx, w, h } = setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const pad = { top: 20, right: 16, bottom: 40, left: 60 };
      const cw = w - pad.left - pad.right;
      const ch = h - pad.top  - pad.bottom;

      if (!data || !data.datasets || !data.datasets.length || !data.labels) return;

      const allValues = data.datasets.flatMap(d => d.values || []);
      const minVal = 0;
      const maxVal = Math.max(...allValues) * 1.1 || 1;

      const toX = i  => pad.left + (i / (data.labels.length - 1)) * cw;
      const toY = v  => pad.top  + (1 - (v - minVal) / (maxVal - minVal)) * ch;

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      const gridLines = 5;
      for (let i = 0; i <= gridLines; i++) {
        const y = pad.top + (i / gridLines) * ch;
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke();
        const val = maxVal - (i / gridLines) * (maxVal - minVal);
        ctx.fillStyle = 'rgba(232,234,240,0.35)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(val >= 1000 ? (val/1000).toFixed(0) + 'k' : val.toFixed(0), pad.left - 8, y + 4);
      }

      // X-axis labels
      ctx.fillStyle = 'rgba(232,234,240,0.4)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      const labelStep = Math.max(1, Math.floor(data.labels.length / 8));
      data.labels.forEach((lbl, i) => {
        if (i % labelStep === 0) {
          ctx.fillText(lbl, toX(i), h - pad.bottom + 16);
        }
      });

      // Draw each dataset
      data.datasets.forEach((dataset, di) => {
        const color = dataset.color || BRAND_COLORS[di % BRAND_COLORS.length];
        const pts = dataset.values.map((v, i) => ({ x: toX(i), y: toY(v) }));
        if (pts.length < 2) return;

        // Gradient fill
        if (dataset.fill !== false) {
          const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
          grad.addColorStop(0, color + '40');
          grad.addColorStop(1, color + '00');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pad.top + ch);
          pts.forEach(p => ctx.lineTo(p.x, p.y));
          ctx.lineTo(pts[pts.length - 1].x, pad.top + ch);
          ctx.closePath();
          ctx.fill();
        }

        // Line
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        pts.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
        ctx.stroke();

        // Points
        pts.forEach((p, i) => {
          if (data.labels.length <= 30 || i % Math.ceil(data.labels.length / 15) === 0) {
            ctx.fillStyle = 'var(--hx-surface, #111827)';
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          }
        });
      });

      // Hover tooltip via mousemove
      const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const myIndex = Math.round((mx - pad.left) / cw * (data.labels.length - 1));
        if (myIndex < 0 || myIndex >= data.labels.length) return;

        // Redraw
        Charts.drawLine(canvas, data, { ...options, _noHover: true });
        const { ctx: c2 } = setupCanvas(canvas);

        // Vertical line
        const x = toX(myIndex);
        c2.setTransform(dpr(), 0, 0, dpr(), 0, 0);
        c2.strokeStyle = 'rgba(108,99,255,0.5)'; c2.lineWidth = 1; c2.setLineDash([4,4]);
        c2.beginPath(); c2.moveTo(x, pad.top); c2.lineTo(x, pad.top + ch); c2.stroke();
        c2.setLineDash([]);

        // Tooltip box
        const tooltipY = pad.top + 10;
        const label = data.labels[myIndex];
        const vals  = data.datasets.map(ds => ({ label: ds.label, value: ds.values[myIndex], color: ds.color || BRAND_COLORS[0] }));
        const bw = 120, bh = 16 + vals.length * 18;
        const bx = x + 10 + bw > w - pad.right ? x - bw - 10 : x + 10;
        c2.fillStyle = 'rgba(17,24,39,0.95)';
        c2.strokeStyle = 'rgba(108,99,255,0.4)';
        c2.lineWidth = 1;
        roundRect(c2, bx, tooltipY, bw, bh, 6);
        c2.fill(); c2.stroke();
        c2.fillStyle = 'rgba(232,234,240,0.8)'; c2.font = 'bold 10px Inter,sans-serif'; c2.textAlign = 'left';
        c2.fillText(label, bx + 10, tooltipY + 14);
        vals.forEach((v, i) => {
          c2.fillStyle = v.color; c2.font = '10px Inter,sans-serif';
          const vText = typeof v.value === 'number' && v.value >= 1000 ? 'KSh ' + (v.value / 1000).toFixed(1) + 'k' : String(v.value || 0);
          c2.fillText((v.label || '') + ': ' + vText, bx + 10, tooltipY + 14 + (i + 1) * 18);
        });
      };

      if (!options._noHover) {
        canvas.removeEventListener('mousemove', canvas._hxMove);
        canvas._hxMove = handleMouseMove;
        canvas.addEventListener('mousemove', canvas._hxMove);
        canvas.addEventListener('mouseleave', () => Charts.drawLine(canvas, data, { ...options, _noHover: true }));
      }
    },

    /* ── Donut Chart ── */
    drawDonut(canvas, segments, options) {
      if (!canvas || !segments || !segments.length) return;
      options = options || {};
      const { ctx, w, h } = setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2, cy = (h - 40) / 2;
      const r = Math.min(cx, cy) - 10;
      const inner = r * 0.6;
      const total = segments.reduce((s, seg) => s + (seg.value || 0), 0);
      if (!total) return;

      let startAngle = -Math.PI / 2;
      segments.forEach((seg, i) => {
        const slice = (seg.value / total) * Math.PI * 2;
        const color = seg.color || BRAND_COLORS[i % BRAND_COLORS.length];
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, startAngle + slice);
        ctx.closePath();
        ctx.fill();
        // Gap
        ctx.fillStyle = '#111827';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#111827';
        ctx.stroke();
        startAngle += slice;
      });

      // Inner hole
      ctx.fillStyle = '#111827';
      ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI * 2); ctx.fill();

      // Center text
      if (options.centerValue) {
        ctx.fillStyle = '#E8EAF0'; ctx.font = 'bold 22px Inter,sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(options.centerValue, cx, cy + 2);
        if (options.centerLabel) {
          ctx.fillStyle = 'rgba(232,234,240,0.5)'; ctx.font = '11px Inter,sans-serif';
          ctx.fillText(options.centerLabel, cx, cy + 18);
        }
      }

      // Legend
      const legendY = (h - 40) + 10;
      const colW = w / Math.min(segments.length, 4);
      segments.forEach((seg, i) => {
        const lx = (i % 4) * colW + 8;
        const ly = legendY + Math.floor(i / 4) * 18;
        const color = seg.color || BRAND_COLORS[i % BRAND_COLORS.length];
        ctx.fillStyle = color;
        ctx.fillRect(lx, ly, 10, 10);
        ctx.fillStyle = 'rgba(232,234,240,0.6)'; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'left';
        const pct = ((seg.value / total) * 100).toFixed(1) + '%';
        ctx.fillText((seg.label || '') + ' ' + pct, lx + 14, ly + 9);
      });
    },

    /* ── Bar Chart ── */
    drawBar(canvas, data, options) {
      if (!canvas || !data || !data.values || !data.values.length) return;
      options = options || {};
      const { ctx, w, h } = setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const pad = { top: 16, right: 12, bottom: 36, left: 50 };
      const cw = w - pad.left - pad.right;
      const ch = h - pad.top  - pad.bottom;
      const maxVal = Math.max(...data.values) * 1.1 || 1;
      const n = data.values.length;
      const barW = Math.max(4, (cw / n) * 0.65);
      const gap  = cw / n;

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = pad.top + (i / 4) * ch;
        ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke();
        const v = maxVal - (i / 4) * maxVal;
        ctx.fillStyle = 'rgba(232,234,240,0.35)'; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'right';
        ctx.fillText(v >= 1000 ? (v/1000).toFixed(0)+'k' : v.toFixed(0), pad.left - 6, y + 4);
      }

      data.values.forEach((v, i) => {
        const barH = (v / maxVal) * ch;
        const x = pad.left + i * gap + (gap - barW) / 2;
        const y = pad.top + ch - barH;
        const color = (data.colors && data.colors[i]) || BRAND_COLORS[i % BRAND_COLORS.length];
        const grad = ctx.createLinearGradient(0, y, 0, y + barH);
        grad.addColorStop(0, color + 'ee');
        grad.addColorStop(1, color + '66');
        ctx.fillStyle = grad;
        ctx.beginPath();
        roundRect(ctx, x, y, barW, barH, 4);
        ctx.fill();

        // X label
        if (data.labels && data.labels[i]) {
          ctx.fillStyle = 'rgba(232,234,240,0.45)'; ctx.font = '9px Inter,sans-serif'; ctx.textAlign = 'center';
          ctx.fillText(data.labels[i], x + barW / 2, h - pad.bottom + 14);
        }

        // Value on top
        if (options.showValues && v > 0) {
          ctx.fillStyle = 'rgba(232,234,240,0.7)'; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'center';
          ctx.fillText(v >= 1000 ? (v/1000).toFixed(1)+'k' : v, x + barW / 2, y - 4);
        }
      });
    },

    /* ── Sparkline ── */
    drawSparkline(canvas, data, options) {
      if (!canvas || !data || !data.length) return;
      options = options || {};
      const { ctx, w, h } = setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);

      const min = Math.min(...data);
      const max = Math.max(...data) || 1;
      const pts = data.map((v, i) => ({
        x: (i / (data.length - 1)) * w,
        y: h - ((v - min) / (max - min)) * h * 0.85 - h * 0.07
      }));
      if (pts.length < 2) return;

      const color = options.color || '#6C63FF';

      if (options.fill !== false) {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, color + '50');
        grad.addColorStop(1, color + '00');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.moveTo(pts[0].x, h);
        pts.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(pts[pts.length-1].x, h); ctx.closePath(); ctx.fill();
      }

      ctx.strokeStyle = color; ctx.lineWidth = options.strokeWidth || 2;
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath();
      pts.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
      ctx.stroke();
    },

    /* ── Score Gauge (for Security page) ── */
    drawGauge(canvas, score, maxScore) {
      if (!canvas) return;
      maxScore = maxScore || 100;
      const { ctx, w, h } = setupCanvas(canvas);
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) / 2 - 8;
      const startA = Math.PI * 0.75;
      const endA   = Math.PI * 2.25;
      const arcLen  = endA - startA;
      const pct = score / maxScore;
      const color = pct > 0.8 ? '#00E676' : pct > 0.6 ? '#FFD740' : '#FF5252';

      // Track
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 10; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(cx, cy, r, startA, endA); ctx.stroke();

      // Fill
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, color + 'aa'); grad.addColorStop(1, color);
      ctx.strokeStyle = grad; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.arc(cx, cy, r, startA, startA + arcLen * pct); ctx.stroke();

      // Score text
      ctx.fillStyle = '#E8EAF0'; ctx.font = 'bold 28px Inter,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(score, cx, cy + 6);
      ctx.fillStyle = 'rgba(232,234,240,0.45)'; ctx.font = '11px Inter,sans-serif';
      ctx.fillText('/' + maxScore, cx, cy + 22);
    }
  };

  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w/2, h/2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  window.HaxOne = window.HaxOne || {};
  window.HaxOne.charts = Charts;
})();
