// api/lead.js — Vercel Serverless Function
// Принимает заявки с сайта и шлёт их в Telegram (замена lead.php, PHP на Vercel не работает).
// Переменные окружения: TG_TOKEN, TG_CHAT_ID — задаются в Vercel → Settings → Environment Variables.

function tgEsc(s) {
  return String(s || '').replace(/([_*`\[])/g, '\\$1');
}

async function sendTG(text) {
  const token = process.env.TG_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  if (!token || !chatId) {
    console.error('[SK-Craft] TG_TOKEN / TG_CHAT_ID не заданы в переменных окружения');
    return false;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });
    return res.ok;
  } catch (e) {
    console.error('[SK-Craft] TG error:', e);
    return false;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const data = req.body || {};
  const { name, phone, comment, type, source } = data;

  if (!phone) {
    res.status(400).json({ success: false, error: 'No phone provided' });
    return;
  }

  const text =
    `🔧 *Новая заявка — Сталь Крафт*\n\n` +
    `👤 *Имя:* ${tgEsc(name || '—')}\n` +
    `📱 *Телефон:* ${tgEsc(phone)}\n` +
    `🏗️ *Тип:* ${tgEsc(type || '—')}\n` +
    `📍 *Источник:* ${tgEsc(source || '—')}\n` +
    `💬 ${tgEsc(comment || '—')}\n` +
    `🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`;

  const ok = await sendTG(text);

  res.status(200).json({ success: ok });
}
