/**
 * portfolio.js — Сетка + Модал + Галерея + Свайп + Зум
 */
(function () {
'use strict';

const CASES   = window.SC_CASES;
const CTA_MAP = window.SC_CTA;

const FILTERS = [
  { key: 'all',    label: 'Все проекты' },
  { key: 'Навесы', label: 'Навесы'      },
  { key: 'Гаражи', label: 'Гаражи'      },
  { key: 'Ворота', label: 'Ворота'      },
];

const ACCENT = {
  'Навесы': { color:'rgb(126,204,154)', bg:'rgba(126,204,154,0.13)', btnBg:'rgb(126,204,154)', btnColor:'#0a2414' },
  'Гаражи': { color:'rgb(201,134,10)',  bg:'rgba(201,134,10,0.13)',  btnBg:'rgb(201,134,10)',  btnColor:'#fff'    },
  'Ворота': { color:'rgb(34,158,217)',  bg:'rgba(34,158,217,0.13)', btnBg:'rgb(34,158,217)', btnColor:'#fff'    },
};

/* ── Состояние ──────────────────────────────────────────── */
let activeFilter = 'all';
let currentIdx   = 0;
let galIdx       = 0;
let isZoomed     = false;

/* Свайп */
let swipeStartX  = 0;
let swipeStartY  = 0;
let touchActive  = false;

/* ── Утилиты ────────────────────────────────────────────── */
function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function accentOf(cat) { return ACCENT[cat] || ACCENT['Навесы']; }

function svgNoPhoto() {
  return `<svg width="48" height="48" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>`;
}

window.SC_placeholderHTML = () =>
  `<div class="sc-slide-placeholder">${svgNoPhoto()}<span>Фото недоступно</span></div>`;

/* ══════════════════════════════════════════════════════════
   ФИЛЬТРЫ
══════════════════════════════════════════════════════════ */
function renderFilters() {
  const wrap = document.getElementById('pf-filters');
  if (!wrap) return;
  wrap.innerHTML = FILTERS.map(f => {
    const on = activeFilter === f.key;
    return `<button
      style="padding:8px 18px;border-radius:99px;
             border:1.5px solid ${on ? 'var(--accent)' : 'var(--border)'};
             background:${on ? 'var(--accent)' : 'var(--surface)'};
             color:${on ? '#fff' : 'var(--muted)'};
             font-size:13px;font-weight:600;cursor:pointer;
             transition:all .15s;font-family:var(--fb)"
      onclick="SC_setFilter('${f.key}')">${f.label}</button>`;
  }).join('');
}

function setFilter(key) {
  activeFilter = key;
  renderFilters();
  renderGrid();
}

/* ══════════════════════════════════════════════════════════
   СЕТКА
══════════════════════════════════════════════════════════ */
function renderGrid() {
  const grid = document.getElementById('pf-grid');
  if (!grid) return;

  const list = activeFilter === 'all'
    ? CASES
    : CASES.filter(c => c.cat === activeFilter);

  if (!list.length) {
    grid.innerHTML = `<p style="color:var(--muted);font-size:.85rem;
      padding:48px 0;text-align:center;grid-column:1/-1">
      Проектов в этой категории пока нет</p>`;
    return;
  }

  grid.innerHTML = list.map(c => {
    const idx = CASES.indexOf(c);
    const a   = accentOf(c.cat);
    const img = c.images?.[0] || '';
    return `
    <article class="sc-pcard" role="button" tabindex="0"
      aria-label="Открыть кейс: ${esc(c.title)}"
      onclick="SC_openModal(${idx})"
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();SC_openModal(${idx})}">
      <div class="sc-pcard-photo">
        ${img
          ? `<img src="${esc(img)}" alt="${esc(c.title)}" loading="lazy"
               onerror="this.parentNode.innerHTML=window.SC_placeholderHTML()"/>`
          : `<div class="sc-slide-placeholder">${svgNoPhoto()}<span>Фото скоро появятся</span></div>`}
        <span class="sc-pcard-cat-badge"
          style="background:${a.bg};color:${a.color};border:1px solid ${a.color}20">
          ${esc(c.cat)}
        </span>
        <div class="sc-pcard-photo-stripe"
          style="background:linear-gradient(90deg,transparent,${a.color},transparent)"></div>
      </div>
      <div class="sc-pcard-foot">
        <span class="sc-pcard-foot-title">${esc(c.title)}</span>
        <span class="sc-pcard-foot-arrow" style="color:${a.color}" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </span>
      </div>
    </article>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════════
   МОДАЛ — открыть / закрыть
══════════════════════════════════════════════════════════ */
function openModal(idx) {
  currentIdx = idx;
  galIdx     = 0;
  isZoomed   = false;

  const ovl = document.getElementById('case-modal-ovl');
  if (!ovl) return;

  renderModalContent();

  ovl.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() =>
    requestAnimationFrame(() => ovl.classList.add('sc-visible'))
  );
}

/* стало */
function closeModal() {
  const ovl = document.getElementById('case-modal-ovl');
  if (!ovl) return;
  ovl.classList.remove('sc-visible');
  setTimeout(() => {
    ovl.style.display = 'none';
    document.body.style.overflow = '';
  }, 320);
}

/* ══════════════════════════════════════════════════════════
   МОДАЛ — контент
══════════════════════════════════════════════════════════ */
function renderModalContent() {
  const c    = CASES[currentIdx];
  const a    = accentOf(c.cat);
  const imgs = Array.isArray(c.images) ? c.images : [];
  const cta  = CTA_MAP[c.cat] || CTA_MAP['Навесы'];

  /* ── Галерея ── */
  const track = document.getElementById('case-gallery-track');
  const dots  = document.getElementById('case-gal-dots');
  const ctr   = document.getElementById('case-gal-counter');
  const btnP  = document.getElementById('sc-prev');
  const btnN  = document.getElementById('sc-next');
  if (!track) return;

  /* Строим слайды */
  track.innerHTML = imgs.length
    ? imgs.map(src => `
        <div class="sc-slide">
          <img src="${esc(src)}" alt="${esc(c.title)}" loading="lazy"
               draggable="false"
               onerror="this.parentNode.innerHTML=window.SC_placeholderHTML()"/>
        </div>`).join('')
    : `<div class="sc-slide">
         <div class="sc-slide-placeholder">
           ${svgNoPhoto()}<span>Фото этого объекта скоро появятся</span>
         </div>
       </div>`;

  /* Сбрасываем позицию трека */
  track.style.transition = 'none';
  track.style.transform  = 'translateX(0)';
  /* Принудительный reflow — чтобы transition не сработал при сбросе */
  track.getBoundingClientRect();
  track.style.transition = '';

  /* Стрелки */
  const multi = imgs.length > 1;
  if (btnP) { btnP.style.display = multi ? 'flex' : 'none'; btnP.disabled = true; }
  if (btnN) { btnN.style.display = multi ? 'flex' : 'none'; btnN.disabled = imgs.length <= 1; }

  /* Счётчик */
  if (ctr) {
    ctr.style.display = multi ? 'block' : 'none';
    ctr.textContent   = `1 / ${imgs.length}`;
  }

  /* Точки */
  if (dots) {
    dots.innerHTML = multi
      ? imgs.map((_, i) => `
          <button class="sc-dot ${i === 0 ? 'active' : ''}"
            onclick="SC_galGoTo(${i})"
            aria-label="Слайд ${i + 1}"></button>`).join('')
      : '';
  }

  /* ── Правая колонка ── */
  const col = document.getElementById('case-content-col');
  if (!col) return;

  col.innerHTML = `
    <div class="cc-header-row">
      <span class="cc-badge" style="background:${a.bg};color:${a.color}">${esc(c.cat)}</span>
    </div>
    <h2 class="cc-title">${esc(c.title)}</h2>

    <div class="cc-conv-block">
      <div class="cc-conv-badge" style="background:${a.bg};color:${a.color}">
        ${esc(cta.icon)} ${esc(cta.badge)}
      </div>
      <ul class="cc-conv-list">
        ${cta.points.map(p => `
          <li class="cc-conv-item">
            <span class="cc-conv-dot" style="background:${a.color}"></span>
            <span>${esc(p)}</span>
          </li>`).join('')}
      </ul>
    </div>

    <div class="cc-buttons">
      <button class="cc-btn-primary"
        style="background:${a.btnBg};color:${a.btnColor}"
        onclick="SC_closeModal();setTimeout(openLeadModal,260)">
        ${esc(cta.cta)}
      </button>
      <a class="cc-btn-tg"
        href="${esc(window.SC_CONFIG.tgLink)}"
        target="_blank" rel="noopener">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373
            12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.609c-.15.672-.546.836-1.104.52l-3.058-2.252-1.475
            1.418c-.163.163-.3.3-.614.3l.218-3.098 5.63-5.084c.245-.218-.053-.339-.38-.121L7.37
            14.44l-2.99-.936c-.65-.204-.663-.65.136-.962l11.674-4.503c.543-.196 1.018.133.372.21z"/>
        </svg>
        Написать в Telegram
      </a>
      <p class="cc-hint">${esc(cta.sub)}</p>
    </div>`;

  col.scrollTop = 0;
}

/* ══════════════════════════════════════════════════════════
   ГАЛЕРЕЯ — навигация
   ИСПРАВЛЕНИЕ: двигаем трек через translateX,
   каждый слайд имеет flex:0 0 100% — трек сдвигается
   на idx * 100% от ширины viewport (не трека!)
══════════════════════════════════════════════════════════ */
function galStep(d) {
  const imgs = CASES[currentIdx]?.images || [];
  if (imgs.length < 2) return;

  /* Снимаем зум при листании */
  setZoom(false);

  galIdx = Math.max(0, Math.min(imgs.length - 1, galIdx + d));
  galUpdate(imgs.length);
}

function galGoTo(i) {
  const total = (CASES[currentIdx]?.images || []).length;
  setZoom(false);
  galIdx = Math.max(0, Math.min(total - 1, i));
  galUpdate(total);
}

function galUpdate(total) {
  const track = document.getElementById('case-gallery-track');
  if (track) {
    /* КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ:
       translateX(-N * 100%) — сдвигаем трек влево на N слайдов.
       Каждый слайд flex:0 0 100% — занимает 100% ширины viewport.
       Трек = viewport * кол-во слайдов по ширине.
       Значит translateX(-galIdx * 100%) = показать нужный слайд. */
    track.style.transform = `translateX(-${galIdx * 100}%)`;
  }

  const ctr = document.getElementById('case-gal-counter');
  if (ctr) ctr.textContent = `${galIdx + 1} / ${total}`;

  const p = document.getElementById('sc-prev');
  const n = document.getElementById('sc-next');
  if (p) p.disabled = galIdx === 0;
  if (n) n.disabled = galIdx === total - 1;

  document.querySelectorAll('.sc-dot')
    .forEach((dot, i) => dot.classList.toggle('active', i === galIdx));
}



/* ══════════════════════════════════════════════════════════
   SWIPE + TOUCH ЗУМ
══════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════
   ЛАЙТБОКС — полноэкранный просмотр
══════════════════════════════════════════════════════════ */
const LB = {
  imgs:     [],
  idx:      0,
  swStartX: 0,
  swStartY: 0,
  swActive: false,

  open(images, startIdx) {
    this.imgs = images || [];
    this.idx  = startIdx || 0;
    if (!this.imgs.length) return;

    const lb = document.getElementById('sc-lightbox');
    if (!lb) return;

    this._buildSlides();
    this._updateNav();

    lb.classList.add('lb-visible');
    requestAnimationFrame(() =>
      requestAnimationFrame(() => lb.classList.add('lb-open'))
    );

    document.body.style.overflow = 'hidden';
  },

  close() {
    const lb = document.getElementById('sc-lightbox');
    if (!lb) return;
    lb.classList.remove('lb-open');
    setTimeout(() => {
      lb.classList.remove('lb-visible');
      const ovl = document.getElementById('case-modal-ovl');
      if (!ovl || ovl.style.display === 'none') {
        document.body.style.overflow = '';
      }
    }, 240);
  },

  step(d) {
    if (this.imgs.length < 2) return;
    this.idx = Math.max(0, Math.min(this.imgs.length - 1, this.idx + d));
    this._goTo(this.idx);
  },

  goTo(i) {
    this.idx = Math.max(0, Math.min(this.imgs.length - 1, i));
    this._goTo(this.idx);
  },

  _buildSlides() {
    const track = document.getElementById('sc-lb-track');
    if (!track) return;

    track.style.transition = 'none';
    track.style.transform  = 'translateX(0)';

    track.innerHTML = this.imgs.map(src => `
      <div class="sc-lb-slide">
        <img src="${esc(src)}" alt="Фото проекта"
             loading="lazy" draggable="false"
             onerror="this.parentNode.innerHTML=window.SC_placeholderHTML()"/>
      </div>`).join('');

    track.getBoundingClientRect();
    track.style.transition = '';
  },

  _goTo(idx) {
    const track = document.getElementById('sc-lb-track');
    if (track) track.style.transform = `translateX(-${idx * 100}%)`;
    this._updateNav();
  },

  _updateNav() {
    const total = this.imgs.length;
    const multi = total > 1;

    const ctr = document.getElementById('sc-lb-counter');
    if (ctr) {
      ctr.style.display = multi ? 'block' : 'none';
      ctr.textContent   = `${this.idx + 1} / ${total}`;
    }

    const p = document.getElementById('sc-lb-prev');
    const n = document.getElementById('sc-lb-next');
    if (p) { p.style.display = multi ? 'flex' : 'none'; p.disabled = this.idx === 0; }
    if (n) { n.style.display = multi ? 'flex' : 'none'; n.disabled = this.idx === total - 1; }

    const dots = document.getElementById('sc-lb-dots');
    if (dots) {
      dots.innerHTML = multi
        ? this.imgs.map((_, i) => `
            <button class="sc-lb-dot ${i === this.idx ? 'active' : ''}"
              onclick="window.LB.goTo(${i})"
              aria-label="Фото ${i + 1}"></button>`).join('')
        : '';
    }
  },

  init() {
    const lb = document.getElementById('sc-lightbox');
    if (!lb) return;

    /* Фон — закрыть */
    lb.addEventListener('click', e => {
      if (e.target === lb || e.target.id === 'sc-lb-track-wrap') this.close();
    });

    document.getElementById('sc-lb-close')
      ?.addEventListener('click', () => this.close());
    document.getElementById('sc-lb-prev')
      ?.addEventListener('click', e => { e.stopPropagation(); this.step(-1); });
    document.getElementById('sc-lb-next')
      ?.addEventListener('click', e => { e.stopPropagation(); this.step(1); });

    /* Touch свайп */
    lb.addEventListener('touchstart', e => {
      this.swStartX = e.touches[0].clientX;
      this.swStartY = e.touches[0].clientY;
      this.swActive = true;
    }, { passive: true });

    lb.addEventListener('touchmove', e => {
      if (!this.swActive) return;
      const dx = Math.abs(e.touches[0].clientX - this.swStartX);
      const dy = Math.abs(e.touches[0].clientY - this.swStartY);
      if (dx > dy && dx > 8) e.preventDefault();
    }, { passive: false });

    lb.addEventListener('touchend', e => {
      if (!this.swActive) return;
      this.swActive = false;
      const dx = e.changedTouches[0].clientX - this.swStartX;
      const dy = Math.abs(e.changedTouches[0].clientY - this.swStartY);
      if (Math.abs(dx) > 44 && dy < 80) this.step(dx < 0 ? 1 : -1);
    }, { passive: true });

    /* Клавиатура */
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('lb-open')) return;
      if (e.key === 'Escape')     { e.preventDefault(); this.close(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); this.step(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); this.step(1); }
    });
  },
};

window.LB = LB;

/* ══════════════════════════════════════════════════════════
   SWIPE в галерее модала + клик = лайтбокс
══════════════════════════════════════════════════════════ */
function initSwipe() {
  const vp = document.getElementById('case-gallery-viewport');
  if (!vp) return;

  /* Клик — открыть лайтбокс */
  vp.addEventListener('click', e => {
    if (e.target.closest('.sc-arr')) return;
    const imgs = CASES[currentIdx]?.images || [];
    if (!imgs.length) return;
    LB.open(imgs, galIdx);
  });

  /* Touch свайп в маленькой галерее */
  vp.addEventListener('touchstart', e => {
    swipeStartX = e.touches[0].clientX;
    swipeStartY = e.touches[0].clientY;
    touchActive = true;
  }, { passive: true });

  vp.addEventListener('touchmove', e => {
    if (!touchActive) return;
    const dx = Math.abs(e.touches[0].clientX - swipeStartX);
    const dy = Math.abs(e.touches[0].clientY - swipeStartY);
    if (dx > dy && dx > 8) e.preventDefault();
  }, { passive: false });

  vp.addEventListener('touchend', e => {
    if (!touchActive) return;
    touchActive = false;
    const dx = e.changedTouches[0].clientX - swipeStartX;
    const dy = Math.abs(e.changedTouches[0].clientY - swipeStartY);
    if (Math.abs(dx) > 44 && dy < 60) {
      galStep(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   КЛАВИАТУРА
══════════════════════════════════════════════════════════ */
/* стало — лайтбокс имеет приоритет, иначе закрываем модал */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    e.preventDefault();
    if (lb.classList.contains('lb-open')) {
      this.close();
    } else {
      closeModal();
    }
    return;
  }
  if (!lb.classList.contains('lb-open')) return;
  if (e.key === 'ArrowLeft')  { e.preventDefault(); this.step(-1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); this.step(1); }
});

/* ══════════════════════════════════════════════════════════
   ПУБЛИЧНОЕ API
══════════════════════════════════════════════════════════ */
window.SC_setFilter  = key => setFilter(key);
window.SC_openModal  = idx => openModal(idx);
window.SC_closeModal = ()  => closeModal();
window.SC_galStep    = d   => galStep(d);
window.SC_galGoTo    = i   => galGoTo(i);

window.SC_Portfolio = {
  init() {
    renderFilters();
    renderGrid();
    initSwipe();
    LB.init();
  },
};

/* Клик на оверлей модала — закрыть */
document.getElementById('case-modal-ovl')
  ?.addEventListener('click', e => {
    /* Не закрываем если лайтбокс открыт */
    if (window.LB && document.getElementById('sc-lightbox')?.classList.contains('lb-open')) return;
    if (e.target === document.getElementById('case-modal-ovl')) closeModal();
  });

/* Кнопка крестика в модале */
document.getElementById('case-close-btn')
  ?.addEventListener('click', e => {
    e.stopPropagation();
    closeModal();
  });

})();