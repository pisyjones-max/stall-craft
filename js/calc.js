(function(){
'use strict';

window.SC_CALC = {
  carport: {
    materials: {
      'polycarbonate': { label: 'Поликарбонат сотовый', perM2: 8000 },
      'profiled_poly': { label: 'Профилированный поликарбонат (с монт.)', perM2: 9000 },
      'corrugated':    { label: 'Профнастил МП-20', perM2: 8000 },
      'metal_tile':    { label: 'Металлочерепица', perM2: 9000 }
    },
    poles: {
      4: { label: '4 опоры (стандарт)', add: 0 },      // Базовая цена за м2 уже включает 4 опоры
      6: { label: '6 опор (усиленный)', add: 8000 },
      8: { label: '8 опор (макс. устойчивость)', add: 16000 }
    }
  },
  garage: {
    types: {
      'standard': { label: 'Сэндвич-панели (ППС/Минвата)', perM2: 25000 },
      'pir':      { label: 'Пирпанель', perM2: 28000 }
    },
    doors: {
      'none':      { label: 'Без ворот', add: 0 },
      'sectional': { label: 'Секционные с приводом (3х2м)', add: 160000 }
    }
  },
  gates: {
    prices: {
      4: { none: 80000,  auto: 130000 },
      5: { none: 90000,  auto: 135000 },
      6: { none: 130000, auto: 180000 }
    },
    options: {
      'none':     { label: 'Стандарт', add: 0 },
      'inner':    { label: 'Калитка в воротах', add: 15000 },
      'separate': { label: 'Отдельная калитка', add: 20000 }
    }
  }
};

let category  = 'carport';
let state = {
  carport: { material:'polycarbonate', poles:4, width:5, depth:4 },
  garage:  { type:'standard', door:'sectional', width:4, depth:6 },
  gates:   { width:4, auto:'none', option:'none' },
};

const CALC = window.SC_CALC;

window.SC_Calc = {
  setTab(cat) {
    category = cat;
    document.querySelectorAll('.ctab').forEach(b => b.classList.toggle('active', b.id === `tab-${cat}`));
    this.renderForm();
    this.updateResult();
    this.injectConsent(); // Добавляем приписку ФЗ-152 при смене таба
  },
  setOption(cat, field, val) {
    state[cat][field] = val;
    this.renderForm();
    this.updateResult();
  },
  setDim(cat, field, val) {
    state[cat][field] = parseFloat(val) || 0;
    this.updateResult();
  },

  // Вспомогательная функция для вставки текста 152-ФЗ в калькулятор
  injectConsent() {
    // Ищем контейнер с результатом калькулятора
    const resultPanel = document.querySelector('.calc-result-panel');
    if (!resultPanel) return;

    // Проверяем, нет ли там уже этой надписи
    if (resultPanel.querySelector('.calc-consent')) return;

    const consent = document.createElement('div');
    consent.className = 'calc-consent';
    consent.style = 'margin-top:15px; font-size:10px; color:rgba(0,0,0,0.5); line-height:1.2; text-align:center;';
    consent.innerHTML = `Нажимая кнопку заказа, вы соглашаетесь с <a href="/privacy.pdf" target="_blank" style="color:inherit;text-decoration:underline;">политикой обработки персональных данных</a>`;

    resultPanel.appendChild(consent);
  },

  renderForm() {
    const area = document.getElementById('calc-form-area');
    if (!area) return;
    if (category === 'carport') {
      const s = state.carport;
      area.innerHTML = `<div class="calc-form-panel">
        <div class="calc-form-title">🏗️ Конфигурация навеса</div>
        <div class="finp-wrap">
          <label class="dim-label">Тип кровли</label>
          <div class="pill-group">${Object.entries(CALC.carport.materials).map(([k,m])=>`<button class="pill ${s.material===k?'active':''}" onclick="SC_Calc.setOption('carport','material','${k}')">${m.label}</button>`).join('')}</div>
        </div>
        <div class="dim-grid">
          <div class="dim-wrap"><div class="dim-label">Ширина (м)</div><input class="dim-input" type="number" value="${s.width}" oninput="SC_Calc.setDim('carport','width',this.value)"></div>
          <div class="dim-wrap"><div class="dim-label">Глубина (м)</div><input class="dim-input" type="number" value="${s.depth}" oninput="SC_Calc.setDim('carport','depth',this.value)"></div>
        </div>
        <div class="finp-wrap">
          <label class="dim-label">Количество опор</label>
          <div class="pill-group">${Object.entries(CALC.carport.poles).map(([k,p])=>`<button class="pill ${s.poles==k?'active':''}" onclick="SC_Calc.setOption('carport','poles',${k})">${p.label}</button>`).join('')}</div>
        </div>
      </div>`;
    } else if (category === 'garage') {
      const s = state.garage;
      area.innerHTML = `<div class="calc-form-panel"><div class="calc-form-title">🏠 Конфигурация гаража</div><div class="finp-wrap"><label class="dim-label">Материал стен</label><div class="pill-group">${Object.entries(CALC.garage.types).map(([k,t])=>`<button class="pill ${s.type===k?'active':''}" onclick="SC_Calc.setOption('garage','type','${k}')">${t.label}</button>`).join('')}</div></div><div class="dim-grid"><div class="dim-wrap"><div class="dim-label">Ширина (м)</div><input class="dim-input" type="number" value="${s.width}" oninput="SC_Calc.setDim('garage','width',this.value)"></div><div class="dim-wrap"><div class="dim-label">Глубина (м)</div><input class="dim-input" type="number" value="${s.depth}" oninput="SC_Calc.setDim('garage','depth',this.value)"></div></div><div class="finp-wrap"><label class="dim-label">Дополнительно</label><div class="pill-group">${Object.entries(CALC.garage.doors).map(([k,d])=>`<button class="pill ${s.door===k?'active':''}" onclick="SC_Calc.setOption('garage','door','${k}')">${d.label}</button>`).join('')}</div></div></div>`;
    } else {
      const s = state.gates;
      area.innerHTML = `<div class="calc-form-panel"><div class="calc-form-title">🚪 Конфигурация ворот</div><div class="finp-wrap"><label class="dim-label">Ширина проема</label><div class="pill-group">${[4,5,6].map(w=>`<button class="pill ${s.width==w?'active':''}" onclick="SC_Calc.setOption('gates','width',${w})">${w} м</button>`).join('')}</div></div><div class="finp-wrap"><label class="dim-label">Управление</label><div class="pill-group"><button class="pill ${s.auto==='none'?'active':''}" onclick="SC_Calc.setOption('gates','auto','none')">Ручное</button><button class="pill ${s.auto==='auto'?'active':''}" onclick="SC_Calc.setOption('gates','auto','auto')">С автоматикой</button></div></div><div class="finp-wrap"><label class="dim-label">Доп. опции</label><div class="pill-group">${Object.entries(CALC.gates.options).map(([k,o])=>`<button class="pill ${s.option===k?'active':''}" onclick="SC_Calc.setOption('gates','option','${k}')">${o.label}</button>`).join('')}</div></div></div>`;
    }
  },
  updateResult() {
    let total = 0, r1_v = 0, r2_v = 0, r3_v = 0, r1_t = '', r2_t = '', r3_t = '';
    const fmt = n => n.toLocaleString('ru-RU') + ' ₽';

    if (category === 'carport') {
      const s = state.carport, m = CALC.carport.materials[s.material], area = s.width * s.depth;
      r1_t = `Каркас (${s.width}х${s.depth}м)`;
      r2_t = m.label;
      r2_v = area * m.perM2;
      r3_t = CALC.carport.poles[s.poles].label;
      r3_v = CALC.carport.poles[s.poles].add;
    } else if (category === 'garage') {
      const s = state.garage, t = CALC.garage.types[s.type], d = CALC.garage.doors[s.door], area = s.width * s.depth;
      r1_t = `Гараж (${s.width}х${s.depth}м)`; r1_v = area * t.perM2;
      r2_t = `Материал: ${t.label}`; r3_t = d.label; r3_v = d.add;
    } else {
      const s = state.gates, base = CALC.gates.prices[s.width][s.auto], opt = CALC.gates.options[s.option].add;
      r1_t = `Ворота ${s.width}м`; r1_v = base;
      r2_t = s.auto==='auto'?'С автоматикой':'Без автоматики';
      r3_t = CALC.gates.options[s.option].label; r3_v = opt;
    }

    total = r1_v + r2_v + r3_v;

    const rows = document.querySelectorAll('.crp-row');
    if(rows[0]){
        rows[0].querySelector('span').textContent = r1_t;
        rows[0].querySelector('.crp-val').textContent = r1_v > 0 ? fmt(r1_v) : '—';
    }
    if(rows[1]){
        rows[1].querySelector('span').textContent = r2_t;
        rows[1].querySelector('.crp-val').textContent = r2_v > 0 ? fmt(r2_v) : '—';
    }
    if(rows[2]){
        rows[2].querySelector('span').textContent = r3_t;
        rows[2].querySelector('.crp-val').textContent = r3_v > 0 ? fmt(r3_v) : 'Включено';
    }

    if(document.getElementById('c-total-val')) document.getElementById('c-total-val').textContent = fmt(total);
    if(document.getElementById('crp-price-display')) document.getElementById('crp-price-display').textContent = 'от ' + fmt(total);

    this.injectConsent(); // На всякий случай запускаем при каждом обновлении
  }
};
// Инициализация после загрузки DOM (исправление для мобильных браузеров)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SC_Calc.setTab('carport'));
} else {
  SC_Calc.setTab('carport');
}
})();