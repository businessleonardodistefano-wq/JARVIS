(function () {
  'use strict';

  const TOPBAR_SUPABASE_URL = '';
  const TOPBAR_SUPABASE_KEY = '';

  const css = `
.topbar {
  position: sticky; top: 0; z-index: 40;
  display: flex; gap: 6px;
  padding: max(10px, env(safe-area-inset-top)) 14px 10px;
  background: #0a0a0b;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
}
.topbar-pill {
  flex: 1 1 0; min-width: 0;
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 11px;
  text-decoration: none;
  color: #FAFAFA;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s, border-color 0.15s;
}
.topbar-pill:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.10); }
.topbar-pill-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #6ee7b7; flex-shrink: 0;
}
.topbar-pill.warn .topbar-pill-dot { background: #fbbf24; }
.topbar-pill.miss .topbar-pill-dot {
  background: #ff8a8a;
  animation: topbar-miss-pulse 1.6s ease-in-out infinite;
}
@keyframes topbar-miss-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
  50%       { box-shadow: 0 0 0 5px rgba(239,68,68,0); }
}
.topbar-pill-label {
  font-size: 9px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  flex-shrink: 0;
}
.topbar-pill-count {
  margin-left: auto;
  font-family: ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  font-size: 11px; font-weight: 700;
  color: #FAFAFA;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.topbar-water-wrap { flex: 1 1 0; min-width: 0; display: flex; }
.topbar-water-pill {
  flex: 1; min-width: 0;
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 10px;
  background: rgba(125,211,252,0.07);
  border: 1px solid rgba(125,211,252,0.14);
  border-right: none;
  border-radius: 11px 0 0 11px;
  text-decoration: none; color: #FAFAFA;
  -webkit-tap-highlight-color: transparent;
}
.topbar-water-pill .topbar-pill-dot { background: #7DD3FC; }
.topbar-water-add {
  flex: 0 0 auto; width: 34px;
  border: 1px solid rgba(125,211,252,0.14);
  background: linear-gradient(180deg,rgba(125,211,252,0.22),rgba(110,231,183,0.22));
  color: #fff;
  font-family: inherit; font-size: 17px; font-weight: 700;
  cursor: pointer;
  border-radius: 0 11px 11px 0;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s, transform 0.10s;
}
.topbar-water-add:active { transform: scale(0.94); }
.topbar-water-add.flash { background: linear-gradient(180deg,rgba(125,211,252,0.65),rgba(110,231,183,0.65)); }
html, body { -webkit-text-size-adjust: 100%; }
@media (max-width: 480px) {
  .topbar { padding-left: 8px; padding-right: 8px; gap: 4px; }
  .topbar-pill, .topbar-water-pill { padding: 7px 8px; gap: 5px; }
  .topbar-pill-label { font-size: 8px; }
  .topbar-pill-count { font-size: 10px; }
  .topbar-water-add { width: 30px; font-size: 15px; }
}
@media (max-width: 340px) { .topbar-pill-label { display: none; } }
.modal-bg,.modal,.po-modal-bg,.po-modal { overscroll-behavior: contain; }
body.topbar-modal-open { overflow: hidden; touch-action: none; }
`;

  const html = `
<header class="topbar" id="topbar" role="navigation" aria-label="Quick stats">
  <a href="index.html" class="topbar-pill" id="topbarGoals">
    <span class="topbar-pill-dot"></span>
    <span class="topbar-pill-label">GOALS</span>
    <span class="topbar-pill-count" id="topbarGoalsCount">—/—</span>
  </a>
  <a href="vitals.html" class="topbar-pill" id="topbarVitals">
    <span class="topbar-pill-dot" style="background:#00f5ff"></span>
    <span class="topbar-pill-label">VITALS</span>
  </a>
  <a href="gym.html" class="topbar-pill" id="topbarGym">
    <span class="topbar-pill-dot" style="background:#ff8800"></span>
    <span class="topbar-pill-label">GYM</span>
  </a>
  <a href="health.html" class="topbar-pill" id="topbarStack">
    <span class="topbar-pill-dot"></span>
    <span class="topbar-pill-label">STACK</span>
    <span class="topbar-pill-count" id="topbarStackCount">—/—</span>
  </a>
  <a href="finance.html" class="topbar-pill" id="topbarFinance">
    <span class="topbar-pill-dot" style="background:#ffe000"></span>
    <span class="topbar-pill-label">€</span>
  </a>
</header>
`;

  function injectStyleAndHTML() {
    if (document.getElementById('topbar')) return;
    const style = document.createElement('style');
    style.id = 'topbar-style';
    style.textContent = css;
    document.head.appendChild(style);
    const wrap = document.createElement('div');
    wrap.innerHTML = html.trim();
    document.body.insertBefore(wrap.firstChild, document.body.firstChild);
  }

  function activeDateKey() {
    const now = new Date();
    const d = new Date(now);
    if (now.getHours() < 6) d.setDate(d.getDate() - 1);
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function calendarDateKey() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }

  function getGoalsProgress() {
    try {
      const goals = JSON.parse(localStorage.getItem('goals:' + activeDateKey())) || [];
      const total = goals.length; const done = goals.filter(g => g && g.done).length;
      return { done, total };
    } catch { return { done: 0, total: 0 }; }
  }
  function getStackProgress() {
    try {
      const items = JSON.parse(localStorage.getItem('stack:items')) || [];
      const taken = JSON.parse(localStorage.getItem('stack:taken:' + activeDateKey())) || {};
      const total = items.length; const done = items.filter(i => i && taken[i.id]).length;
      return { done, total };
    } catch { return { done: 0, total: 0 }; }
  }
  function getWaterProgress() {
    try {
      const state = JSON.parse(localStorage.getItem('po_water_v1'));
      if (!state) return { done: 0, total: 8 };
      const done = (state.logs || {})[calendarDateKey()] || 0;
      return { done, total: state.dailyTarget || 8 };
    } catch { return { done: 0, total: 8 }; }
  }

  function classifyStatus(done, total) {
    if (total === 0) return 'idle';
    if (done >= total) return 'good';
    if (new Date().getHours() >= 18 && done < total * 0.5) return 'miss';
    return 'warn';
  }
  function setPillStatus(el, status) {
    if (!el) return;
    el.classList.remove('good','warn','miss');
    if (status === 'warn' || status === 'miss') el.classList.add(status);
  }

  function render() {
    const g = getGoalsProgress(); const s = getStackProgress(); const w = getWaterProgress();
    const gc = document.getElementById('topbarGoalsCount');
    const sc = document.getElementById('topbarStackCount');
    const wc = document.getElementById('topbarWaterCount');
    if (gc) gc.textContent = g.total ? g.done + '/' + g.total : '0/0';
    if (sc) sc.textContent = s.total ? s.done + '/' + s.total : '0/0';
    if (wc) wc.textContent = w.total ? w.done + '/' + w.total : '0/0';
    setPillStatus(document.getElementById('topbarGoals'), classifyStatus(g.done, g.total));
    setPillStatus(document.getElementById('topbarStack'), classifyStatus(s.done, s.total));
    setPillStatus(document.getElementById('topbarWater'), classifyStatus(w.done, w.total));
  }

  function addWater() {
    try {
      let state = JSON.parse(localStorage.getItem('po_water_v1')) || { logs: {}, dailyTarget: 8 };
      state.logs = state.logs || {};
      const k = calendarDateKey();
      state.logs[k] = (state.logs[k] || 0) + 1;
      localStorage.setItem('po_water_v1', JSON.stringify(state));
    } catch {}
    render();
    const btn = document.getElementById('topbarWaterAdd');
    if (btn) { btn.classList.add('flash'); setTimeout(() => btn.classList.remove('flash'), 220); }
  }

  function boot() {
    injectStyleAndHTML();
    const btn = document.getElementById('topbarWaterAdd');
    if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); addWater(); });
    render();
    window.addEventListener('storage', render);
    window.addEventListener('focus', render);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
    setInterval(render, 30000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
