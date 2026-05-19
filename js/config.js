/**
 * config.js — публичные настройки (без секретов!)
 */
window.SC_CONFIG = {
  phone:        '+79252055299',
  phoneDisplay: '+7 (925) 205-52-99',
  email:        '9252055299@mail.ru',
  emailCC:      'sysoeveg@yandex.ru',
  tgLink:       'https://t.me/+79252055299',
  vkLink:       'https://vk.com/club234525361',
  address:      'г. Раменское, ул. Нефтегазосъёмки, 19',
  workHours:    'Пн–Пт 8:00–19:00 · Сб 9:00–17:00',
  devName:      'Novation',
  devLink:      'https://sale.ads.msk.ru/',
  devPhone:     '+7 915 468-39-25',
  apiEndpoint:  '/craft/api/lead.php',
};

/* ── КОНВЕРСИОННЫЕ БЛОКИ ПО КАТЕГОРИЯМ ───────────────────── */
window.SC_CTA = {
  'Навесы': {
    icon: '🏗️',
    badge: 'Под ключ за 1 день',
    points: [
      '📐 Бесплатный выезд и замер в день обращения',
      '🎨 Порошковая покраска в любой цвет RAL',
      '⚡ Срок изготовления и монтажа — 1 день',
      '🔩 Поликарбонат, профнастил или мягкая кровля — на ваш выбор',
      '🛡️ Гарантия 10 лет на конструкцию',
    ],
    cta: 'Записаться на бесплатный замер',
    sub: 'Рассчитаем стоимость прямо на объекте — бесплатно',
  },
  'Гаражи': {
    icon: '🏠',
    badge: 'Сборка за 3–5 дней',
    points: [
      '📐 Бесплатный выезд замерщика в день обращения',
      '🏭 Изготовление на собственном заводе — 3–5 дней',
      '🎨 Порошковая покраска, цвет RAL на ваш выбор',
      '🔒 Секционные или распашные ворота в комплекте',
      '🧊 Утепление минватой 100 мм — опционально',
    ],
    cta: 'Узнать цену своего гаража',
    sub: 'Замер бесплатно — цена фиксируется в договоре',
  },
  'Ворота': {
    icon: '🚪',
    badge: 'Монтаж за 1 день',
    points: [
      '📐 Бесплатный замер и подбор автоматики',
      '🤖 Привод FAAC, CAME, Hormann — на ваш выбор',
      '📱 Управление с пульта, смартфона и домофона',
      '⚡ Монтаж под ключ за 1 рабочий день',
      '🛡️ Гарантия на автоматику — 3 года, на ворота — 10 лет',
    ],
    cta: 'Подобрать ворота с автоматикой',
    sub: 'Приедем, замерим, подберём привод — всё бесплатно',
  },
};

/* ── КЕЙСЫ ────────────────────────────────────────────────── */
window.SC_CASES = [
  {
    cat: 'Навесы',
    title: 'Навесы',
    images: [
      "img/portfolio/canopies/canopies_1.webp",
      "img/portfolio/canopies/canopies_10.webp",
      "img/portfolio/canopies/canopies_11.webp",
      "img/portfolio/canopies/canopies_12.webp",
      "img/portfolio/canopies/canopies_13.webp",
      "img/portfolio/canopies/canopies_14.webp",
      "img/portfolio/canopies/canopies_15.webp",
    ],
  },
  {
    cat: 'Навесы',
    title: 'Навесы',
    images: [
      "img/portfolio/canopies/canopies_2.webp",
      "img/portfolio/canopies/canopies_3.webp",
      "img/portfolio/canopies/canopies_5.webp",
      "img/portfolio/canopies/canopies_6.webp",
      "img/portfolio/canopies/canopies_7.webp",
      "img/portfolio/canopies/canopies_8.webp",
      "img/portfolio/canopies/canopies_9.webp",
    ],
  },
  {
    cat: 'Гаражи',
    title: 'Гаражи',
    images: [
      "img/portfolio/garages/garages_1.webp",
      "img/portfolio/garages/garages_10.webp",
      "img/portfolio/garages/garages_11.webp",
      "img/portfolio/garages/garages_12.webp",
      "img/portfolio/garages/garages_13.webp",
      "img/portfolio/garages/garages_14.webp",
    ],
  },
  {
    cat: 'Гаражи',
    title: 'Гаражи',
    images: [
      "img/portfolio/garages/garages_4.webp",
      "img/portfolio/garages/garages_5.webp",
      "img/portfolio/garages/garages_6.webp",
      "img/portfolio/garages/garages_7.webp",
      "img/portfolio/garages/garages_9.webp",
    ],
  },
  {
    cat: 'Ворота',
    title: 'Откатные ворота',
    images: [
      "img/portfolio/gates/gates_1.webp",
      "img/portfolio/gates/gates_10.webp",
      "img/portfolio/gates/gates_11.webp",
      "img/portfolio/gates/gates_12.webp",
      "img/portfolio/gates/gates_13.webp",
      "img/portfolio/gates/gates_3.webp",
      "img/portfolio/gates/gates_4.webp",
    ],
  },
  {
    cat: 'Ворота',
    title: 'Секционные ворота',
    images: [
      "img/portfolio/gates/gates_6.webp",
      "img/portfolio/gates/gates_7.webp",
      "img/portfolio/gates/gates_8.webp",
      "img/portfolio/gates/gates_9.webp",
    ],
  },
];

/* ── ДАННЫЕ КАЛЬКУЛЯТОРА определены в calc.js ────────────── */