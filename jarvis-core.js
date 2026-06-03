// ============================================================
// JARVIS CORE — Shared storage, charts, and utilities
// ============================================================
(function(global){
'use strict';

// ===== STORAGE =====
const J = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del: (k) => { try { localStorage.removeItem(k); } catch {} },
  keys: (prefix) => { const out = []; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(prefix)) out.push(k); } return out; }
};

// ===== DATE HELPERS =====
const D = {
  key: (d) => { const dt = d || new Date(); return dt.getFullYear() + '-' + String(dt.getMonth()+1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0'); },
  fromKey: (s) => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); },
  fmt: (d, opts) => new Date(d).toLocaleDateString('it-IT', opts || {day:'2-digit',month:'short'}),
  fmtFull: (d) => new Date(d).toLocaleDateString('it-IT', {weekday:'short',day:'numeric',month:'short',year:'numeric'}),
  daysAgo: (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; },
  rangeKeys: (days) => { const keys = []; for (let i = days-1; i >= 0; i--) keys.push(D.key(D.daysAgo(i))); return keys; },
  monthKeys: (months) => {
    const keys = new Set(); const now = new Date();
    for (let i = 0; i < months * 31; i++) { const d = D.daysAgo(i); if (i < months * 31) keys.add(D.key(d).slice(0,7)); }
    return [...keys].slice(0, months);
  },
  yearKeys: () => { const keys = new Set(); for (let i = 0; i < 365; i++) keys.add(D.key(D.daysAgo(i)).slice(0,7)); return [...keys]; }
};

// ===== SVG SPARKLINE =====
function sparkline(data, color, filled, height) {
  if (!data || data.length < 2) return '';
  const h = height || 40; const w = 200;
  const vals = data.map(v => v === null ? 0 : v);
  const min = Math.min(...vals.filter(v=>v>0)) * 0.95;
  const max = Math.max(...vals) * 1.05 || 1;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const path = 'M ' + pts.join(' L ');
  const areaPath = path + ` L ${w},${h} L 0,${h} Z`;
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:${h}px">
    <defs><linearGradient id="sg_${color.replace('#','')}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </linearGradient></defs>
    ${filled ? `<path d="${areaPath}" fill="url(#sg_${color.replace('#','')})" />` : ''}
    <path d="${path}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="${pts[pts.length-1].split(',')[0]}" cy="${pts[pts.length-1].split(',')[1]}" r="2.5" fill="${color}"/>
  </svg>`;
}

// ===== BAR CHART =====
function barChart(labels, values, color, maxOverride) {
  const max = maxOverride || Math.max(...values.filter(v=>v>0)) * 1.1 || 1;
  const barW = Math.floor(280 / labels.length) - 3;
  const bars = labels.map((l, i) => {
    const h = Math.round((values[i] || 0) / max * 60);
    const x = i * (barW + 3);
    return `<g>
      <rect x="${x}" y="${60-h}" width="${barW}" height="${h}" fill="${color}" rx="2" opacity="0.8"/>
      <text x="${x + barW/2}" y="76" text-anchor="middle" font-family="Share Tech Mono" font-size="7" fill="rgba(224,244,255,0.4)">${l}</text>
    </g>`;
  }).join('');
  return `<svg viewBox="0 0 280 80" style="width:100%;height:80px">${bars}</svg>`;
}

// ===== RING CHART =====
function updateRing(elId, score, color) {
  const el = document.getElementById(elId);
  if (!el) return;
  const circ = 263.9;
  el.style.strokeDashoffset = circ * (1 - (score||0)/100);
  el.style.stroke = color || 'var(--cyan)';
}

// Export
global.JARVIS = { J, D, sparkline, barChart, updateRing };
})(window);
