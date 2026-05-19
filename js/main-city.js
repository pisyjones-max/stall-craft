/**
 * main-city.js — точка входа для городских страниц
 * Заменяет main.js (без portfolio, без полного calc)
 */
(function () {
'use strict';

/* ID города берём из data-атрибута на body */
function getCityId() {
  return document.body.dataset.city || 'ramenskoe';
}

function init() {
  SC_UI.initTicker();
  SC_UI.initHeader();
  SC_UI.initAnimations();
  SC_UI.initPhoneFormat();
  SC_UI.initSmoothScroll();

  /* Калькулятор — только вкладка гаражей */
  SC_Calc.setTab('garage');

  /* Городской движок */
  SC_CityPage.init(getCityId());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();