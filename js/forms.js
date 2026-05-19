/**
 * forms.js — Лид-формы и отправка
 */
(function(){
'use strict';

const CFG = window.SC_CONFIG;

let leadType      = 'carport';
let modalLeadType = 'carport';

// Вспомогательная функция для вставки текста согласия (152-ФЗ)
function injectConsentText(containerSelector, buttonSelector) {
  const container = document.querySelector(containerSelector);
  const btn = document.querySelector(buttonSelector);
  if (!container || !btn || container.querySelector('.sc-consent')) return;

  const consent = document.createElement('div');
  consent.className = 'sc-consent';
  consent.style = 'margin-top:14px; font-size:11px; line-height:1.3; color:var(--muted); opacity:0.8; text-align:center;';
  consent.innerHTML = `Нажимая кнопку, вы соглашаетесь с <a href="/privacy.html" target="_blank" style="text-decoration:underline; color:inherit;">условиями обработки персональных данных</a>`;

  // Вставляем сразу после кнопки
  btn.parentNode.insertBefore(consent, btn.nextSibling);
}

/* ── LEAD SECTION FORM ──────────────────────────────────── */
window.selectLeadType = function(btn) {
  document.querySelectorAll('[data-lft]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  leadType = btn.dataset.lft;
};

window.submitLeadForm = async function() {
  const name    = document.getElementById('lf-name')?.value.trim()    || '';
  const phone   = document.getElementById('lf-phone')?.value.trim()   || '';
  const comment = document.getElementById('lf-comment')?.value.trim() || '';

  if (!validateFields(['lf-name','lf-phone'])) {
    SC_UI.showToast('Пожалуйста, заполните обязательные поля', 'error');
    return;
  }

  const btn = document.querySelector('#lead-form-body .lead-submit');
  setSubmitLoading(btn, true);

  await sendLead({ name, phone, comment, type: leadType, source: 'section-form' });

  document.getElementById('lead-form-body').style.display = 'none';
  document.getElementById('lead-success').style.display   = 'block';
  SC_UI.showToast('Заявка принята! Ждите звонка в течение 15 минут.', 'success');
};

/* ── LEAD MODAL ─────────────────────────────────────────── */
window.openLeadModal = function() {
  const modal = document.getElementById('lead-modal');
  if (!modal) return;
  document.getElementById('modal-body').style.display    = '';
  document.getElementById('modal-success').style.display = 'none';
  document.querySelectorAll('[data-mlft]').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-mlft="carport"]')?.classList.add('active');
  modalLeadType = 'carport';

  // Инъекция согласия в модалку при открытии
  setTimeout(() => {
    injectConsentText('#modal-form', '#modal-form .lead-submit');
  }, 10);

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeLeadModal = function() {
  document.getElementById('lead-modal')?.classList.remove('open');
  document.body.style.overflow = '';
};

window.openModal  = window.openLeadModal;
window.closeModal = window.closeLeadModal;

window.handleModalClick = function(e) {
  if (e.target === document.getElementById('lead-modal')) window.closeLeadModal();
};

window.selectModalType = function(btn) {
  document.querySelectorAll('[data-mlft]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  modalLeadType = btn.dataset.mlft;
};

window.submitModal = async function() {
  const name    = document.getElementById('m-name')?.value.trim()    || '';
  const phone   = document.getElementById('m-phone')?.value.trim()   || '';
  const comment = document.getElementById('m-comment')?.value.trim() || '';

  if (!validateFields(['m-name','m-phone'])) {
    SC_UI.showToast('Пожалуйста, заполните имя и телефон', 'error');
    return;
  }

  const btn = document.querySelector('#modal-form .lead-submit');
  setSubmitLoading(btn, true);

  await sendLead({ name, phone, comment, type: modalLeadType, source: 'modal' });

  document.getElementById('modal-body').style.display    = 'none';
  document.getElementById('modal-success').style.display = 'block';
  SC_UI.showToast('Заявка принята! Звоним в течение 15 минут.', 'success');
};

/* ── KEYBOARD ───────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (document.getElementById('lead-modal')?.classList.contains('open')) window.closeLeadModal();
  if (document.getElementById('mob-nav-panel')?.classList.contains('open')) SC_UI.closeMobileNav();
});

/* ── HELPERS ────────────────────────────────────────────── */
function validateFields(ids) {
  let valid = true;
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const ok = !!el.value.trim();
    el.classList.toggle('error', !ok);
    if (!ok) valid = false;
  });
  return valid;
}

function setSubmitLoading(btn, loading) {
  if (!btn) return;
  btn.textContent = loading ? 'Отправляем...' : 'Записаться';
  btn.disabled    = loading;
}

async function sendLead(data) {
  try {
    await fetch(CFG.apiEndpoint, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
      signal:  AbortSignal.timeout(6000),
    });
  } catch (e) {
    console.warn('[SC] API недоступен:', e.message);
  }
}

// Инициализация при загрузке для статической формы в секции
document.addEventListener('DOMContentLoaded', () => {
  injectConsentText('#lead-form-body', '#lead-form-body .lead-submit');
});

})();