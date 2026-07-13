#!/usr/bin/env node
/**
 * Генерирует черновик статьи блога Сталь Крафт через Anthropic API по теме.
 *
 * Использование:
 *   ANTHROPIC_API_KEY=sk-ant-xxx node scripts/generate-article.mjs "Ворота откатные или распашные"
 *
 * Результат: content/blog/<slug>.json — проверь глазами, потом публикуй через
 * scripts/publish-article.mjs. Автопубликации без проверки здесь нарочно нет.
 */

import fs from 'node:fs'
import path from 'node:path'

const topic = process.argv.slice(2).join(' ')
if (!topic) {
  console.error('Укажи тему: node scripts/generate-article.mjs "Ворота откатные или распашные"')
  process.exit(1)
}

const apiKey = process.env.ANTHROPIC_API_KEY
if (!apiKey) {
  console.error('Нужна переменная окружения ANTHROPIC_API_KEY')
  process.exit(1)
}

const SYSTEM_PROMPT = `Ты — автор блога Сталь Крафт (навесы, гаражи, откатные и распашные ворота под ключ, Раменский округ Московской области).
Компания — лид-агрегатор: передаёт заявки подрядчикам, а не продаёт от одного юрлица. Не упоминай конкретное юрлицо-исполнителя.
Пиши конкретно, по делу, без "воды", без точных цен (только диапазоны или "зависит от") и без гарантий сроков, которые ты не знаешь.
Верни ТОЛЬКО валидный JSON без markdown-обёртки, без пояснений до или после, со следующими полями:
{
  "slug": "латиницей-через-дефис",
  "title": "заголовок статьи на русском",
  "description": "мета-описание до 160 символов",
  "keywords": ["3-6 ключевых фраз"],
  "publishedAt": "YYYY-MM-DD (сегодняшняя дата)",
  "excerpt": "1-2 предложения для превью в списке статей",
  "bodyMarkdown": "текст статьи в markdown, с ## заголовками разделов, 700-1200 слов"
}`

const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-5',
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `Тема статьи: ${topic}` }],
  }),
})

if (!response.ok) {
  console.error(`Anthropic API вернул ошибку: ${response.status} ${await response.text()}`)
  process.exit(1)
}

const data = await response.json()
const textBlock = data.content.find(b => b.type === 'text')
if (!textBlock) {
  console.error('В ответе модели нет текстового блока')
  process.exit(1)
}

let article
try {
  const cleaned = textBlock.text.trim().replace(/^```json\n?/, '').replace(/```$/, '')
  article = JSON.parse(cleaned)
} catch (e) {
  console.error('Не удалось распарсить JSON от модели. Сырой ответ:')
  console.error(textBlock.text)
  process.exit(1)
}

const outDir = path.join(process.cwd(), 'content', 'blog')
fs.mkdirSync(outDir, { recursive: true })
const outPath = path.join(outDir, `${article.slug}.json`)
fs.writeFileSync(outPath, JSON.stringify(article, null, 2) + '\n')

console.log(`Черновик сохранён: ${outPath}`)
console.log('Проверь текст глазами, поправь что нужно, потом публикуй:')
console.log(`  node scripts/publish-article.mjs ${path.relative(process.cwd(), outPath)}`)
