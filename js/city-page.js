/**
 * city-page.js — движок городских SEO-страниц
 * Подключается ТОЛЬКО на городских страницах
 */
(function () {
'use strict';

/* ══════════════════════════════════════════════════════════
   БАЗА ГОРОДОВ
══════════════════════════════════════════════════════════ */
window.SC_CITIES = {
  ramenskoe: {
    id:         'ramenskoe',
    city:       'Раменское',
    cityPrep:   'в Раменском',
    cityGen:    'Раменского',
    cityDat:    'Раменскому',
    region:     'Московская область',
    regionShort:'МО',
    distance:   '42 км от МКАД',
    driveTime:  '50 минут',
    phone:      '+7 (997) 547-13-51',
    slug:       'garazhi-ramenskoe',
    service:    'garazhi',
    serviceRu:  'Гаражи',
    lat:        '55.5667',
    lon:        '38.2311',
    /* Вариант контента: 0, 1 или 2 — разный для каждого города */
    variant:    0,
    /* Порядок фото в портфолио */
    photoOrder: [0, 1, 2, 3],
    /* Соседние города для перелинковки */
    nearby: ['zhukovskiy', 'kolomna', 'bronnitsy', 'voskresensk'],
  },
  zhukovskiy: {
    id:         'zhukovskiy',
    city:       'Жуковский',
    cityPrep:   'в Жуковском',
    cityGen:    'Жуковского',
    cityDat:    'Жуковскому',
    region:     'Московская область',
    regionShort:'МО',
    distance:   '35 км от МКАД',
    driveTime:  '40 минут',
    phone:      '+7 (997) 547-13-51',
    slug:       'garazhi-zhukovskiy',
    service:    'garazhi',
    serviceRu:  'Гаражи',
    lat:        '55.5983',
    lon:        '38.1169',
    variant:    1,
    photoOrder: [2, 0, 3, 1],
    nearby: ['ramenskoe', 'kolomna', 'lyubertsy', 'bronnitsy'],
  },
  kolomna: {
    id:         'kolomna',
    city:       'Коломна',
    cityPrep:   'в Коломне',
    cityGen:    'Коломны',
    cityDat:    'Коломне',
    region:     'Московская область',
    regionShort:'МО',
    distance:   '105 км от МКАД',
    driveTime:  '1.5 часа',
    phone:      '+7 (997) 547-13-51',
    slug:       'garazhi-kolomna',
    service:    'garazhi',
    serviceRu:  'Гаражи',
    lat:        '55.0833',
    lon:        '38.7667',
    variant:    2,
    photoOrder: [3, 2, 1, 0],
    nearby: ['ramenskoe', 'voskresensk', 'kashira', 'ozeriy'],
  },
  bronnitsy: {
    id:         'bronnitsy',
    city:       'Бронницы',
    cityPrep:   'в Бронницах',
    cityGen:    'Бронниц',
    cityDat:    'Бронницам',
    region:     'Московская область',
    regionShort:'МО',
    distance:   '55 км от МКАД',
    driveTime:  '1 час',
    phone:      '+7 (997) 547-13-51',
    slug:       'garazhi-bronnitsy',
    service:    'garazhi',
    serviceRu:  'Гаражи',
    lat:        '55.4258',
    lon:        '38.2694',
    variant:    0,
    photoOrder: [1, 3, 0, 2],
    nearby: ['ramenskoe', 'zhukovskiy', 'voskresensk', 'kolomna'],
  },
  voskresensk: {
    id:         'voskresensk',
    city:       'Воскресенск',
    cityPrep:   'в Воскресенске',
    cityGen:    'Воскресенска',
    cityDat:    'Воскресенску',
    region:     'Московская область',
    regionShort:'МО',
    distance:   '80 км от МКАД',
    driveTime:  '1 час 20 минут',
    phone:      '+7 (997) 547-13-51',
    slug:       'garazhi-voskresensk',
    service:    'garazhi',
    serviceRu:  'Гаражи',
    lat:        '55.3167',
    lon:        '38.6833',
    variant:    1,
    photoOrder: [2, 1, 3, 0],
    nearby: ['kolomna', 'ramenskoe', 'bronnitsy', 'egoryevsk'],
  },
};

/* ══════════════════════════════════════════════════════════
   ВАРИАТИВНЫЕ ТЕКСТЫ
   variant 0 / 1 / 2 — разная структура, не просто замена города
══════════════════════════════════════════════════════════ */
const VARIANTS = {

  /* ── Интро (Hero subtitle) ── */
  intro: [
    /* 0 */ (c) => `Производим и устанавливаем металлические гаражи ${c.cityPrep} за 3–5 дней.
      Собственный завод, порошковая покраска, официальный договор с гарантией 10 лет.`,

    /* 1 */ (c) => `Нужен надёжный гараж ${c.cityPrep}? Мы изготовим и смонтируем
      за 3–5 дней — без посредников, напрямую с производства.
      Гарантия 10 лет, цена фиксируется в договоре.`,

    /* 2 */ (c) => `Сталь Крафт — производитель гаражей для жителей ${c.cityGen}.
      От замера до сдачи объекта — 3 до 7 дней. Стоимость под ключ известна
      до начала работ. Гарантия на конструкцию 10 лет.`,
  ],

  /* ── H1 ── */
  h1: [
    /* 0 */ (c) => `Металлические гаражи ${c.cityPrep} — под ключ за 3–5 дней`,
    /* 1 */ (c) => `Купить гараж ${c.cityPrep}: производство и монтаж от завода`,
    /* 2 */ (c) => `Гаражи из металла ${c.cityPrep} — собственное производство`,
  ],

  /* ── Title (мета) ── */
  metaTitle: [
    /* 0 */ (c) => `Металлические гаражи ${c.cityPrep} — цены от завода | Сталь Крафт`,
    /* 1 */ (c) => `Купить гараж ${c.cityPrep}: монтаж за 3–5 дней | Сталь Крафт`,
    /* 2 */ (c) => `Гараж ${c.cityPrep} под ключ — гарантия 10 лет | Сталь Крафт`,
  ],

  /* ── Description (мета) ── */
  metaDesc: [
    /* 0 */ (c) => `Металлические гаражи ${c.cityPrep} от производителя. Монтаж за 3–5 дней, порошковая покраска, гарантия 10 лет. Бесплатный замер. Звоните: ${c.phone}.`,
    /* 1 */ (c) => `Купить гараж ${c.cityPrep} по цене завода. Изготовление и монтаж под ключ за 3–5 дней. Секционные ворота в комплекте. Гарантия 10 лет. ${c.phone}.`,
    /* 2 */ (c) => `Гаражи из металла ${c.cityPrep}: от замера до установки — 3–7 дней. Собственное производство, официальный договор, гарантия 10 лет. Тел. ${c.phone}.`,
  ],

  /* ── Преимущества (разные формулировки) ── */
  benefits: [
    /* 0 */ (c) => [
      { icon:'🏭', title:'Своё производство', text:`Изготавливаем на заводе в ${c.cityGen} области. Никаких посредников — цена ниже рынка на 20–30%.` },
      { icon:'⚡', title:'Монтаж за 1 день',  text:`Бригада приедет в ${c.city} и установит гараж за одну рабочую смену.` },
      { icon:'🎨', title:'Покраска в любой цвет', text:`Порошковое покрытие держится 15+ лет. Выбирайте любой оттенок по каталогу RAL.` },
      { icon:'📄', title:'Договор и гарантия', text:`Фиксируем цену, сроки и условия гарантии письменно до начала работ.` },
    ],
    /* 1 */ (c) => [
      { icon:'📐', title:'Бесплатный замер', text:`Замерщик приедет ${c.cityPrep} в день обращения. Точный расчёт стоимости на месте — бесплатно.` },
      { icon:'🔩', title:'Металл от производителя', text:`Закупаем сталь напрямую с комбинатов. Толщина стенки — 2 мм, оцинковка — 120 г/м².` },
      { icon:'🧊', title:'Утеплённые варианты', text:`Минеральная вата 100 мм — температура ${c.cityPrep} при -25°C в гараже держится выше 0°C.` },
      { icon:'🚗', title:'Ворота в комплекте', text:`Распашные или секционные — включены в стоимость. Автоматика по желанию.` },
    ],
    /* 2 */ (c) => [
      { icon:'🛡️', title:'10 лет гарантии', text:`Письменная гарантия на всю конструкцию. За 10 лет ни одного гарантийного случая отказа несущих элементов.` },
      { icon:'📦', title:'Любой размер', text:`Стандарт 3×6, 4×6, 6×9 м или нестандарт под ваш участок ${c.cityPrep}. Проект — бесплатно.` },
      { icon:'⏱️', title:'Срок — 3–5 дней', text:`Производство и монтаж от первого звонка до сдачи ключей — без затяжных ожиданий.` },
      { icon:'💰', title:'Цена без сюрпризов', text:`Итоговая стоимость фиксируется до начала работ. Допрасходы возможны только с вашего письменного согласия.` },
    ],
  ],

  /* ── CTA ── */
  cta: [
    /* 0 */ (c) => ({ primary: `Узнать цену гаража ${c.cityPrep}`, secondary: 'Бесплатный замер сегодня' }),
    /* 1 */ (c) => ({ primary: `Заказать гараж ${c.cityPrep}`, secondary: 'Рассчитать стоимость' }),
    /* 2 */ (c) => ({ primary: 'Записаться на бесплатный замер', secondary: `Смотреть проекты ${c.cityPrep}` }),
  ],

  /* ── Особенности работы в городе ── */
  cityFeatures: [
    /* 0 */ (c) => [
      { icon:'🚚', title:'Логистика', text:`Доставляем конструкции ${c.cityPrep} собственным транспортом. Расстояние ${c.distance} — доставка включена в стоимость при заказе от 60 000 ₽.` },
      { icon:'⏰', title:'Сроки', text:`Выезд замерщика ${c.cityPrep} — в день обращения. Монтаж — через 3–5 дней после замера и согласования проекта.` },
      { icon:'📍', title:'Знаем местность', text:`Работаем в ${c.cityGen} с 2018 года. Знаем особенности грунтов и требования местных администраций.` },
    ],
    /* 1 */ (c) => [
      { icon:'🗓️', title:'Планирование', text:`Запись на замер ${c.cityPrep} — за 1 день. Не нужно ждать неделями, выезжаем оперативно.` },
      { icon:'🚛', title:'Доставка', text:`${c.city} — ${c.distance}. Доставка входит в смету, никаких доплат за километраж при стандартном заказе.` },
      { icon:'🔧', title:'Бригада', text:`Профессиональная монтажная бригада работает ${c.cityPrep} постоянно. Опыт в регионе — более 80 объектов.` },
    ],
    /* 2 */ (c) => [
      { icon:'📏', title:'Выезд и замер', text:`Наш специалист приедет ${c.cityPrep} бесплатно, снимет размеры и составит смету прямо на месте за 30 минут.` },
      { icon:'🏗️', title:'Монтаж', text:`После согласования проекта монтажная команда прибывает в течение 3–5 рабочих дней. Монтаж — 1 день.` },
      { icon:'🌍', title:'Регион', text:`${c.city}, ${c.region} — постоянный регион обслуживания. Гарантийные выезды без дополнительной оплаты.` },
    ],
  ],

  /* ── FAQ вопросы ── */
  faq: [
    /* 0 */ (c) => [
      { q:`Сколько стоит металлический гараж ${c.cityPrep}?`,
        a:`Стоимость гаража ${c.cityPrep} зависит от размера и комплектации. Стандартный гараж 3×6 м — от 55 000 ₽, утеплённый 4×6 м — от 78 000 ₽. Точную цену рассчитаем при бесплатном выезде замерщика.` },
      { q:`Сколько времени займёт установка гаража ${c.cityPrep}?`,
        a:`Монтаж одного гаража занимает 1 рабочий день. Срок от замера до готового объекта — 3–5 дней с учётом изготовления на производстве.` },
      { q:`Нужен ли фундамент под металлический гараж ${c.cityPrep}?`,
        a:`Для стандартных металлических гаражей фундамент не обязателен — достаточно ровной площадки. Подробнее расскажет замерщик при выезде.` },
      { q:`Есть ли гарантия на гараж ${c.cityPrep}?`,
        a:`Да, письменная гарантия на конструкцию — 10 лет. Гарантийные выезды ${c.cityPrep} — бесплатно.` },
    ],
    /* 1 */ (c) => [
      { q:`Какая цена гаража под ключ ${c.cityPrep}?`,
        a:`Цена гаража под ключ ${c.cityPrep}: стандарт 3×6 м — от 55 000 ₽, утеплённый с секционными воротами — от 130 000 ₽. Финальная стоимость фиксируется в договоре.` },
      { q:`Как быстро привезут и поставят гараж ${c.cityPrep}?`,
        a:`После подписания договора: изготовление — 3–5 дней, доставка и монтаж ${c.cityPrep} — 1 день. Итого от заявки до готового гаража — 5–7 рабочих дней.` },
      { q:`Можно ли заказать гараж нестандартного размера ${c.cityPrep}?`,
        a:`Да, изготавливаем гаражи любых размеров под ваш участок ${c.cityPrep}. Нестандартный проект разрабатывается бесплатно.` },
      { q:`Включена ли доставка ${c.cityPrep} в стоимость?`,
        a:`Доставка ${c.cityPrep} (${c.distance}) включена в стоимость при заказе от 60 000 ₽. Условия уточняйте при заказе.` },
    ],
    /* 2 */ (c) => [
      { q:`Почём гараж из металла ${c.cityPrep} в 2025 году?`,
        a:`Актуальные цены на металлические гаражи ${c.cityPrep}: 3×6 м от 55 000 ₽, 4×6 м утеплённый от 78 000 ₽. Цены с учётом доставки и монтажа.` },
      { q:`За сколько дней установят гараж ${c.cityPrep}?`,
        a:`Производство занимает 3–5 дней. Монтаж бригады ${c.cityPrep} — 1 рабочий день. Суммарно от звонка до ключей — 5–7 дней.` },
      { q:`Дают ли гарантию на гараж ${c.cityPrep}?`,
        a:`Гарантия 10 лет — письменно, в договоре. Гарантийное обслуживание выполняется ${c.cityPrep} бесплатно в течение всего срока.` },
      { q:`Нужно ли разрешение на установку гаража ${c.cityPrep}?`,
        a:`Для временного металлического гаража разрешение на строительство, как правило, не требуется. Уточните в местной администрации ${c.cityGen} — поможем с консультацией.` },
    ],
  ],

};

/* ══════════════════════════════════════════════════════════
   РЕНДЕР СТРАНИЦЫ
══════════════════════════════════════════════════════════ */
window.SC_CityPage = {

  cityData: null,

  init(cityId) {
    const c = window.SC_CITIES[cityId];
    if (!c) { console.warn('[SC] City not found:', cityId); return; }
    this.cityData = c;
    const v = c.variant;

    this._setMeta(c, v);
    this._renderHero(c, v);
    this._renderBenefits(c, v);
    this._renderCityFeatures(c, v);
    this._renderFaq(c, v);
    this._renderNearby(c);
    this._renderSchema(c);
    this._renderBreadcrumb(c);
  },

  /* ── Мета-теги ── */
  _setMeta(c, v) {
    document.title = VARIANTS.metaTitle[v](c);

    this._setOrCreate('meta[name="description"]', 'meta', {
      name: 'description', content: VARIANTS.metaDesc[v](c),
    });
    this._setOrCreate('link[rel="canonical"]', 'link', {
      rel: 'canonical',
      href: `https://ads.msk.ru/${c.slug}/`,
    });
    this._setOrCreate('meta[property="og:title"]', 'meta', {
      property: 'og:title', content: VARIANTS.metaTitle[v](c),
    });
    this._setOrCreate('meta[property="og:description"]', 'meta', {
      property: 'og:description', content: VARIANTS.metaDesc[v](c),
    });
    this._setOrCreate('meta[property="og:url"]', 'meta', {
      property: 'og:url',
      href: `https://ads.msk.ru/${c.slug}/`,
    });
  },

  /* ── Hero ── */
  _renderHero(c, v) {
    const h1El = document.getElementById('city-h1');
    if (h1El) h1El.textContent = VARIANTS.h1[v](c);

    const introEl = document.getElementById('city-intro');
    if (introEl) introEl.textContent = VARIANTS.intro[v](c);

    const cta = VARIANTS.cta[v](c);
    const ctaPrimary = document.getElementById('city-cta-primary');
    const ctaSecondary = document.getElementById('city-cta-secondary');
    if (ctaPrimary)   ctaPrimary.textContent   = cta.primary;
    if (ctaSecondary) ctaSecondary.textContent = cta.secondary;

    /* Плашка с городом */
    const eyebrowEl = document.getElementById('city-eyebrow');
    if (eyebrowEl) eyebrowEl.textContent = `${c.serviceRu} ${c.cityPrep} · ${c.region}`;
  },

  /* ── Преимущества ── */
  _renderBenefits(c, v) {
    const grid = document.getElementById('city-benefits-grid');
    if (!grid) return;
    const items = VARIANTS.benefits[v](c);
    grid.innerHTML = items.map(b => `
      <div class="ben-card" data-anim="">
        <div class="ben-icon dark" aria-hidden="true">${b.icon}</div>
        <div>
          <div class="ben-title">${b.title}</div>
          <div class="ben-desc">${b.text}</div>
        </div>
      </div>`).join('');
    /* Запускаем анимации на новых элементах */
    if (window.SC_UI) SC_UI.initAnimations();
  },

  /* ── Особенности работы в городе ── */
  _renderCityFeatures(c, v) {
    const section = document.getElementById('city-features-section');
    if (!section) return;

    const items = VARIANTS.cityFeatures[v](c);
    const grid  = section.querySelector('#city-features-grid');
    if (!grid) return;

    grid.innerHTML = items.map(f => `
      <div class="city-feature-card">
        <div class="city-feature-icon" aria-hidden="true">${f.icon}</div>
        <div class="city-feature-title">${f.title}</div>
        <div class="city-feature-text">${f.text}</div>
      </div>`).join('');
  },

  /* ── FAQ ── */
  _renderFaq(c, v) {
    const list = document.getElementById('city-faq-list');
    if (!list) return;

    const items = VARIANTS.faq[v](c);
    list.innerHTML = items.map((item, i) => `
      <div class="city-faq-item" id="faq-${i}">
        <button class="city-faq-q" aria-expanded="false" aria-controls="faq-a-${i}"
          onclick="SC_CityPage.toggleFaq(${i})">
          <span>${item.q}</span>
          <svg class="city-faq-chevron" width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="city-faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-${i}">
          <div class="city-faq-a-inner">${item.a}</div>
        </div>
      </div>`).join('');
  },

  toggleFaq(i) {
    const btn = document.querySelector(`#faq-${i} .city-faq-q`);
    const ans = document.getElementById(`faq-a-${i}`);
    if (!btn || !ans) return;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    ans.classList.toggle('open', !isOpen);
  },

  /* ── Перелинковка ── */
  _renderNearby(c) {
    const wrap = document.getElementById('city-nearby-list');
    if (!wrap) return;

    const links = c.nearby
      .map(id => window.SC_CITIES[id])
      .filter(Boolean)
      .map(nc => `
        <a href="/${nc.slug}/" class="city-nearby-link">
          <span class="city-nearby-icon" aria-hidden="true">📍</span>
          <span>${nc.serviceRu} ${nc.cityPrep}</span>
        </a>`)
      .join('');

    wrap.innerHTML = links;
  },

  /* ── Хлебные крошки ── */
  _renderBreadcrumb(c) {
    const bc = document.getElementById('city-breadcrumb');
    if (!bc) return;
    bc.innerHTML = `
      <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a itemprop="item" href="/craft/"><span itemprop="name">Сталь Крафт</span></a>
          <meta itemprop="position" content="1"/>
        </li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a itemprop="item" href="/craft/#categories">
            <span itemprop="name">${c.serviceRu}</span>
          </a>
          <meta itemprop="position" content="2"/>
        </li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <span itemprop="name">${c.serviceRu} ${c.cityPrep}</span>
          <meta itemprop="position" content="3"/>
        </li>
      </ol>`;
  },

  /* ── Schema.org ── */
  _renderSchema(c) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `https://ads.msk.ru/${c.slug}/`,
      'name': 'Сталь Крафт',
      'description': VARIANTS.metaDesc[c.variant](c),
      'url': `https://ads.msk.ru/${c.slug}/`,
      'telephone': c.phone,
      'image': 'https://ads.msk.ru/craft/img/og-cover.webp',
      'priceRange': '₽₽',
      /* areaServed — ТОЛЬКО текущий город, не весь список */
      'areaServed': {
        '@type': 'City',
        'name': c.city,
        'containedInPlace': {
          '@type': 'AdministrativeArea',
          'name': c.region,
        },
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': c.lat,
        'longitude': c.lon,
      },
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Раменское',
        'addressRegion': c.region,
        'addressCountry': 'RU',
      },
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': `${c.serviceRu} ${c.cityPrep}`,
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': `Металлический гараж ${c.cityPrep}`,
              'areaServed': c.city,
            },
            'priceSpecification': {
              '@type': 'UnitPriceSpecification',
              'price': '55000',
              'priceCurrency': 'RUB',
              'unitText': 'комплект',
            },
          },
        ],
      },
      /* FAQ Schema */
      'mainEntity': VARIANTS.faq[c.variant](c).map(item => ({
        '@type': 'Question',
        'name': item.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.a,
        },
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  },

  /* ── Утилита: найти или создать мета-тег ── */
  _setOrCreate(selector, tag, attrs) {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement(tag);
      document.head.appendChild(el);
    }
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  },

};

window.SC_CityPage = window.SC_CityPage;

})();