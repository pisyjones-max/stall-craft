/**
 * main.js — точка входа, инициализация всех модулей
 */
(function(){
'use strict';

function init() {
  SC_UI.initTicker();
  SC_UI.initHeader();
  SC_UI.initAnimations();
  SC_UI.initCounters();
  SC_UI.initPhoneFormat();
  SC_UI.initSmoothScroll();
  SC_Calc.renderForm();
  SC_Calc.updateResult();
  SC_Portfolio.init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();