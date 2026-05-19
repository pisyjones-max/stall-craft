/**
 * ui.js — Header, Ticker, Анимации, Счётчики, Телефон, Скролл
 */
(function(){
'use strict';

const TICKERS = [
  '⚡ Монтаж навесов и ворот за 1 день — без выходных',
  '🛡️ Гарантия 10 лет на все конструкции — письменно',
  '🏭 Собственное производство · Цены без наценок посредников',
  '📐 Бесплатный выезд и замер в день обращения',
  '🚗 Карпорт из поликарбоната 5×4 м — от 28 000 ₽',
  '🏠 Сборный утеплённый гараж 4×6 м — от 78 000 ₽',
  '🚪 Откатные ворота с автоматикой — от 66 000 ₽',
  '✅ Официальный договор с каждым клиентом',
];

window.SC_UI = {

  /* ── TICKER ─────────────────────────────────────────── */
  initTicker() {
    const track = document.getElementById('ticker-track');
    if (!track) return;
    track.innerHTML = [...TICKERS, ...TICKERS]
      .map(t => `<span class="ticker-item"><span class="ticker-dot"></span>${t}</span>`)
      .join('');
  },

  /* ── HEADER ─────────────────────────────────────────── */
  initHeader() {
    const header   = document.getElementById('header');
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-a');

    const onScroll = () => {
      if (header) header.classList.toggle('scrolled', window.scrollY > 20);

      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 90) current = s.id;
      });
      navLinks.forEach(l => {
        const href = (l.getAttribute('href') || '').replace('#', '');
        l.classList.toggle('active', href === current);
      });

      const floatCta = document.getElementById('float-cta');
      if (floatCta) floatCta.classList.toggle('visible', window.scrollY > 600);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  },

  /* ── MOBILE NAV ─────────────────────────────────────── */
  toggleMobileNav() {
    document.getElementById('mob-nav-panel')?.classList.contains('open')
      ? this.closeMobileNav()
      : this.openMobileNav();
  },

  openMobileNav() {
    const ovl   = document.getElementById('mob-nav-ovl');
    const panel = document.getElementById('mob-nav-panel');
    const btn   = document.getElementById('mob-toggle');
    if (!ovl || !panel) return;
    ovl.style.display   = 'block';
    panel.style.display = 'flex';
    requestAnimationFrame(() => {
      ovl.classList.add('visible');
      panel.classList.add('open');
    });
    btn?.classList.add('open');
    btn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  },

  closeMobileNav() {
    const ovl   = document.getElementById('mob-nav-ovl');
    const panel = document.getElementById('mob-nav-panel');
    const btn   = document.getElementById('mob-toggle');
    ovl?.classList.remove('visible');
    panel?.classList.remove('open');
    btn?.classList.remove('open');
    btn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (ovl)   ovl.style.display   = 'none';
      if (panel) panel.style.display = 'none';
    }, 280);
  },

  /* ── COUNTERS ───────────────────────────────────────── */
  initCounters() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting || e.target.dataset.done) return;
        e.target.dataset.done = '1';
        this._animCount(e.target, parseFloat(e.target.dataset.counter), e.target.dataset.suffix || '');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-counter]').forEach(el => obs.observe(el));
  },

  _animCount(el, target, suffix) {
    const start  = performance.now();
    const dur    = 1600;
    const isFloat = target % 1 !== 0;
    const update = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const v = isFloat ? (e * target).toFixed(1) : Math.floor(e * target);
      el.textContent = Number(v).toLocaleString('ru-RU') + suffix;
      if (p < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString('ru-RU') + suffix;
    };
    requestAnimationFrame(update);
  },

  /* ── SCROLL ANIMATIONS ──────────────────────────────── */
  initAnimations() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-anim]').forEach(el => obs.observe(el));
  },

  /* ── PHONE FORMAT ───────────────────────────────────── */
  initPhoneFormat() {
    document.querySelectorAll('input[type="tel"]').forEach(inp => {
      inp.addEventListener('input', function () {
        let v = this.value.replace(/\D/g, '');
        if (v.startsWith('8')) v = '7' + v.slice(1);
        if (v.startsWith('7')) {
          const m = v.match(/^7?(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
          if (m) this.value = [
            '+7 (' + (m[1] || ''),
            m[2] ? ') ' + m[2] : '',
            m[3] ? '-' + m[3] : '',
            m[4] ? '-' + m[4] : '',
          ].join('');
        }
        this.classList.remove('error');
      });
    });
    document.querySelectorAll('input[type="text"]').forEach(inp => {
      inp.addEventListener('input', () => inp.classList.remove('error'));
    });
  },

  /* ── SMOOTH SCROLL ──────────────────────────────────── */
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
      });
    });
  },

  /* ── TOAST ──────────────────────────────────────────── */
  showToast(message, type = 'info') {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.setAttribute('role', 'alert');
    t.innerHTML = `<span>${type==='success'?'✅':type==='error'?'⚠️':'ℹ️'}</span><span>${message}</span>`;
    c.appendChild(t);
    setTimeout(() => {
      t.classList.add('out');
      t.addEventListener('animationend', () => t.remove(), { once: true });
    }, 4000);
  },

};

/* Глобальные хелперы для вызова из HTML */
window.toggleMobileNav  = () => SC_UI.toggleMobileNav();
window.closeMobileNav   = () => SC_UI.closeMobileNav();
window.showToast        = (m, t) => SC_UI.showToast(m, t);

})();