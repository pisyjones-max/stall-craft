/**
 * portfolio.js — Сетка проектов + кейс-модал + галерея + свайп + Умный Zoom (Sync)
 */
(function(){
'use strict';

const CASES   = window.SC_CASES;
const FILTERS = [
  { key:'all',    label:'Все проекты' },
  { key:'Навесы', label:'Навесы'      },
  { key:'Гаражи', label:'Гаражи'      },
  { key:'Ворота', label:'Ворота'      },
];

let activeFilter = 'all';
let currentIdx   = 0;
let galIdx       = 0;
let swipeStartX  = 0;
let swipeStartY  = 0;
let touchActive  = false;

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function svgPhoto() {
  return `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/></svg>`;
}

window.SC_placeholderHTML = () =>
  `<div class="sc-slide-placeholder">${svgPhoto()}<span>Фото недоступно</span></div>`;

/* ── FILTERS ────────────────────────────────────────────── */
function renderFilters() {
  const wrap = document.getElementById('pf-filters');
  if (!wrap) return;
  wrap.innerHTML = FILTERS.map(f => `
    <button
      style="padding:8px 18px;border-radius:99px;border:1.5px solid ${activeFilter===f.key?'var(--accent)':'var(--border)'};background:${activeFilter===f.key?'var(--accent)':'var(--surface)'};color:${activeFilter===f.key?'#fff':'var(--muted)'};font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;font-family:var(--fb)"
      onclick="SC_setFilter('${f.key}')">${f.label}</button>`).join('');
}

function setFilter(key) {
  activeFilter = key;
  renderFilters();
  renderGrid();
}

/* ── GRID ───────────────────────────────────────────────── */
function renderGrid() {
  const grid = document.getElementById('pf-grid');
  if (!grid) return;
  const list = activeFilter === 'all' ? CASES : CASES.filter(c => c.cat === activeFilter);
  if (!list.length) {
    grid.innerHTML = `<p style="color:var(--muted);font-size:.85rem;padding:48px 0;text-align:center;grid-column:1/-1">Проектов в этой категории пока нет</p>`;
    return;
  }
  grid.innerHTML = list.map(c => {
    const idx = CASES.indexOf(c);
    const mBg = c.accentBg.replace('0.13','0.07');
    const mainImg = (c.images && c.images.length > 0) ? c.images[0] : '';
    return `
    <article class="sc-pcard" role="button" tabindex="0" onclick="SC_openModal(${idx})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();SC_openModal(${idx})}">
      <div class="sc-pcard-img">
        ${mainImg ? `<img src="${esc(mainImg)}" alt="${esc(c.title)}" loading="lazy" onerror="this.parentElement.innerHTML=window.SC_placeholderHTML()">` : window.SC_placeholderHTML()}
      </div>
      <div class="sc-pcard-stripe" style="background:linear-gradient(90deg,transparent,${c.accentColor},transparent)"></div>
      <div class="sc-pcard-body">
        <div class="sc-pcard-top">
          <span class="sc-pcard-cat" style="background:${c.accentBg};color:${c.accentColor}">${esc(c.cat)}</span>
          <span class="sc-pcard-client">${esc(c.client)}</span>
        </div>
        <h3 class="sc-pcard-title">${esc(c.title)}</h3>
        <p class="sc-pcard-desc">${esc(c.desc)}</p>
        <div class="sc-pcard-metrics">${c.metrics.map(m=>`<div class="sc-metric" style="background:${mBg}"><div class="sc-metric-val" style="color:${c.accentColor}">${esc(m.v)}</div><div class="sc-metric-lbl">${esc(m.l)}</div></div>`).join('')}</div>
        <div class="sc-pcard-tags">${c.tags.map(t=>`<span class="sc-pcard-tag">${esc(t)}</span>`).join('')}</div>
        <div class="sc-pcard-cta"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Смотреть кейс</div>
      </div>
    </article>`;
  }).join('');
}

/* ── MODAL ──────────────────────────────────────────────── */
function openModal(idx) {
  currentIdx = idx; galIdx = 0;
  const ovl = document.getElementById('case-modal-ovl');
  if (!ovl) return;
  renderModalContent();
  ovl.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => requestAnimationFrame(() => ovl.classList.add('sc-visible')));
}

function closeModal() {
  const ovl = document.getElementById('case-modal-ovl');
  if (!ovl) return;
  ovl.classList.remove('sc-visible');
  setTimeout(() => { ovl.style.display = 'none'; document.body.style.overflow = ''; }, 240);
}

function renderModalContent() {
  const c = CASES[currentIdx];
  const imgs = Array.isArray(c.images) ? c.images : [];
  const track = document.getElementById('case-gallery-track');
  const dots = document.getElementById('case-gal-dots');
  const ctr = document.getElementById('case-gal-counter');
  if (!track) return;

  track.innerHTML = imgs.length ? imgs.map((src, i) => `
    <div class="sc-slide" style="cursor:zoom-in" onclick="SC_zoom('${esc(src)}')">
      <img src="${esc(src)}" alt="${esc(c.title)}" loading="lazy" onerror="this.parentNode.innerHTML=window.SC_placeholderHTML()"/>
    </div>`).join('') : `<div class="sc-slide"><div class="sc-slide-placeholder">${svgPhoto()}<span>Фото скоро будут</span></div></div>`;

  track.style.transform = 'translateX(0)';
  const hasMulti = imgs.length > 1;
  if (ctr) ctr.textContent = `1 / ${imgs.length}`;
  if (dots) dots.innerHTML = hasMulti ? imgs.map((_, i) => `<button class="sc-dot ${i===0?'active':''}" onclick="SC_galGoTo(${i})"></button>`).join('') : '';

  const col = document.getElementById('case-content-col');
  if (!col) return;
  const mBg = c.accentBg.replace('0.13','0.07');
  col.innerHTML = `
    <div class="cc-header-row"><span class="cc-badge" style="background:${c.accentBg};color:${c.accentColor}">${esc(c.cat)}</span><span class="cc-client">${esc(c.client)}</span></div>
    <h2 class="cc-title">${esc(c.title)}</h2>
    <div class="cc-metrics">${c.metrics.map(m=>`<div class="cc-metric" style="background:${mBg}"><div class="cc-metric-val" style="color:${c.accentColor}">${esc(m.v)}</div><div class="cc-metric-lbl">${esc(m.l)}</div></div>`).join('')}</div>
    <div><div class="cc-section-lbl">📌 Задача</div><p class="cc-section-text">${esc(c.problem)}</p></div>
    <div><div class="cc-section-lbl">⚙️ Решение</div><p class="cc-section-text">${esc(c.solution)}</p></div>
    <div class="cc-cta-box"><button class="cc-cta-btn" style="background:${c.accentColor};color:#fff" onclick="SC_closeModal();setTimeout(openLeadModal,260)">Заказать замер</button></div>`;
  col.scrollTop = 0;
}

/* ── LIGHTBOX (Zoom) ────────────────────────────────────── */
window.SC_zoom = function(src) {
  let lb = document.getElementById('sc-lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'sc-lightbox';
    lb.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:10000;display:none;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s;';
    lb.innerHTML = `
      <img id="lb-img" src="" style="max-width:90%;max-height:90%;border-radius:4px;box-shadow:0 0 40px rgba(0,0,0,0.5);transition:opacity 0.2s;user-select:none;">
      <div id="lb-prev" style="position:absolute;left:0;top:0;width:25%;height:100%;cursor:pointer;display:flex;align-items:center;padding-left:30px;color:#fff;font-size:60px;opacity:0.5;user-select:none;">&lsaquo;</div>
      <div id="lb-next" style="position:absolute;right:0;top:0;width:25%;height:100%;cursor:pointer;display:flex;align-items:center;justify-content:flex-end;padding-right:30px;color:#fff;font-size:60px;opacity:0.5;user-select:none;">&rsaquo;</div>
      <div id="lb-close" style="position:absolute;top:20px;right:25px;color:#fff;font-size:50px;cursor:pointer;z-index:10001;line-height:1;">&times;</div>`;
    lb.onclick = (e) => { if(e.target.id === 'sc-lightbox' || e.target.id === 'lb-close') SC_closeZoom(); };
    lb.querySelector('#lb-prev').onclick = (e) => { e.stopPropagation(); SC_zoomStep(-1); };
    lb.querySelector('#lb-next').onclick = (e) => { e.stopPropagation(); SC_zoomStep(1); };
    document.body.appendChild(lb);
  }
  const imgs = CASES[currentIdx]?.images || [];
  galIdx = imgs.indexOf(src) !== -1 ? imgs.indexOf(src) : 0;
  document.getElementById('lb-img').src = src;
  lb.style.display = 'flex';
  lb.querySelector('#lb-prev').style.display = imgs.length > 1 ? 'flex' : 'none';
  lb.querySelector('#lb-next').style.display = imgs.length > 1 ? 'flex' : 'none';
  requestAnimationFrame(() => lb.style.opacity = '1');
};

window.SC_closeZoom = function() {
  const lb = document.getElementById('sc-lightbox');
  if (lb) { lb.style.opacity = '0'; setTimeout(() => lb.style.display = 'none', 300); }
};

window.SC_zoomStep = function(step) {
  const imgs = CASES[currentIdx]?.images || [];
  if (imgs.length < 2) return;
  galIdx = (galIdx + step + imgs.length) % imgs.length;
  const img = document.getElementById('lb-img');
  img.style.opacity = '0';
  setTimeout(() => { img.src = imgs[galIdx]; img.style.opacity = '1'; galUpdate(imgs.length); }, 150);
};

/* ── NAV ────────────────────────────────────────────────── */
function galStep(d) {
  const imgs = CASES[currentIdx]?.images || [];
  if (imgs.length < 2) return;
  galIdx = Math.max(0, Math.min(imgs.length - 1, galIdx + d));
  galUpdate(imgs.length);
}
function galGoTo(i) {
  const len = (CASES[currentIdx]?.images || []).length;
  galIdx = i; galUpdate(len);
}
function galUpdate(total) {
  const track = document.getElementById('case-gallery-track');
  if (track) track.style.transform = `translateX(-${galIdx * 100}%)`;
  const ctr = document.getElementById('case-gal-counter');
  if (ctr) ctr.textContent = `${galIdx + 1} / ${total}`;
  const p = document.getElementById('sc-prev'), n = document.getElementById('sc-next');
  if (p) p.disabled = galIdx === 0; if (n) n.disabled = galIdx === total - 1;
  document.querySelectorAll('.sc-dot').forEach((d, i) => d.classList.toggle('active', i === galIdx));
}

function initSwipe() {
  const vp = document.getElementById('case-gallery-viewport'); if (!vp) return;
  vp.addEventListener('touchstart', e => { swipeStartX = e.touches[0].clientX; touchActive = true; }, { passive: true });
  vp.addEventListener('touchend', e => {
    if (!touchActive) return; touchActive = false;
    const dx = e.changedTouches[0].clientX - swipeStartX;
    if (Math.abs(dx) > 50) galStep(dx < 0 ? 1 : -1);
  }, { passive: true });
}

document.addEventListener('keydown', e => {
  const lb = document.getElementById('sc-lightbox');
  if (lb && lb.style.display === 'flex') {
    if (e.key === 'Escape') SC_closeZoom();
    if (e.key === 'ArrowLeft') SC_zoomStep(-1);
    if (e.key === 'ArrowRight') SC_zoomStep(1);
    return;
  }
  const ovl = document.getElementById('case-modal-ovl');
  if (!ovl || ovl.style.display === 'none') return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') galStep(-1);
  if (e.key === 'ArrowRight') galStep(1);
});

window.SC_setFilter = k => setFilter(k);
window.SC_openModal = idx => openModal(idx);
window.SC_closeModal = () => closeModal();
window.SC_galStep = d => galStep(d);
window.SC_galGoTo = i => galGoTo(i);
window.SC_Portfolio = { init() { renderFilters(); renderGrid(); initSwipe(); } };
})();