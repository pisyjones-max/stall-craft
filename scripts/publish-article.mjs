#!/usr/bin/env node
/**
 * Публикация статьи блога Сталь Крафт.
 *
 * Использование:
 *   node scripts/publish-article.mjs content/blog/moya-statya.json
 *
 * Что делает:
 *   1. Проверяет JSON статьи, копирует в content/blog/, если файл лежал не там.
 *   2. Запускает scripts/build-blog.mjs — генерирует blog/<slug>/index.html,
 *      blog/index.html и обновляет sitemap.xml.
 *   3. git add/commit/push в main (Vercel задеплоит статически на пуш).
 *
 * Токен передавай через переменную окружения, не хранить в коде:
 *   GITHUB_TOKEN=ghp_xxx node scripts/publish-article.mjs content/blog/moya-statya.json
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const articlePathArg = process.argv[2]
if (!articlePathArg) {
  console.error('Укажи путь к JSON-файлу статьи: node scripts/publish-article.mjs content/blog/slug.json')
  process.exit(1)
}

const articlePath = path.resolve(process.cwd(), articlePathArg)
if (!fs.existsSync(articlePath)) {
  console.error(`Файл не найден: ${articlePath}`)
  process.exit(1)
}

const article = JSON.parse(fs.readFileSync(articlePath, 'utf-8'))

const required = ['slug', 'title', 'description', 'publishedAt', 'bodyMarkdown', 'excerpt']
for (const key of required) {
  if (!article[key]) {
    console.error(`В статье не хватает обязательного поля "${key}"`)
    process.exit(1)
  }
}

const expectedFilename = `${article.slug}.json`
if (path.basename(articlePath) !== expectedFilename) {
  console.error(`Имя файла должно совпадать со slug: ожидалось "${expectedFilename}"`)
  process.exit(1)
}

const targetPath = path.join(process.cwd(), 'content', 'blog', expectedFilename)
if (path.resolve(targetPath) !== articlePath) {
  fs.copyFileSync(articlePath, targetPath)
  console.log(`Скопировано в ${targetPath}`)
}

function run(cmd) {
  console.log(`\n$ ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
}

console.log('Генерация статичных страниц...')
run('node scripts/build-blog.mjs')

console.log('Коммит и пуш...')
const token = process.env.GITHUB_TOKEN
const remote = token
  ? `https://${token}@github.com/pisyjones-max/stall-craft.git`
  : null

run(`git add content/blog/${expectedFilename} blog sitemap.xml`)
try {
  run(`git commit -m "blog: добавлена статья — ${article.title}"`)
} catch {
  console.log('Нечего коммитить (файл не изменился) — пропускаю коммит.')
}

if (remote) {
  run(`GIT_TERMINAL_PROMPT=0 git push ${remote} HEAD:main`)
} else {
  run(`GIT_TERMINAL_PROMPT=0 git push origin HEAD:main`)
}

console.log(`\nГотово: https://sk-craft.platforma-msk.ru/blog/${article.slug}/`)
console.log('Vercel задеплоит автоматически на пуш в main.')
