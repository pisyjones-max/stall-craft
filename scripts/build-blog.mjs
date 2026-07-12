#!/usr/bin/env node
/**
 * Генерирует статичные HTML-страницы блога Сталь Крафт из content/blog/*.json.
 *
 * Использование:
 *   node scripts/build-blog.mjs
 *
 * Что делает:
 *   1. Читает все content/blog/*.json.
 *   2. Рендерит markdown в HTML (marked) и подставляет в шаблон scripts/blog-template.html.
 *   3. Пишет blog/<slug>/index.html для каждой статьи и blog/index.html со списком.
 *   4. Обновляет sitemap-blog.xml (по аналогии с уже существующим sitemap-cities.xml).
 *
 * Скрипт НЕ коммитит и не пушит сам — это делает scripts/publish-article.mjs,
 * который сначала вызывает этот генератор, потом собирает и деплоит через отдельный флаг.
 */

import fs from 'node:fs'
import path from 'node:path'
import { marked } from 'marked'

const ROOT = process.cwd()
const BLOG_CONTENT_DIR = path.join(ROOT, 'content', 'blog')
const BLOG_OUTPUT_DIR = path.join(ROOT, 'blog')
const SITE_URL = 'https://sk-craft.platforma-msk.ru'

const TEMPLATE = fs.readFileSync(path.join(ROOT, 'scripts', 'blog-template.html'), 'utf-8')
const LIST_TEMPLATE = fs.readFileSync(path.join(ROOT, 'scripts', 'blog-index-template.html'), 'utf-8')

function getArticles() {
  if (!fs.existsSync(BLOG_CONTENT_DIR)) return []
  return fs
    .readdirSync(BLOG_CONTENT_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(BLOG_CONTENT_DIR, f), 'utf-8')))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
}

function render(template, vars) {
  let out = template
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, value)
  }
  return out
}

const articles = getArticles()
fs.mkdirSync(BLOG_OUTPUT_DIR, { recursive: true })

for (const a of articles) {
  const html = marked.parse(a.bodyMarkdown, { async: false })
  const page = render(TEMPLATE, {
    title: a.title,
    description: a.description,
    keywords: (a.keywords || []).join(', '),
    slug: a.slug,
    publishedAt: a.publishedAt,
    body: html,
    siteUrl: SITE_URL,
  })
  const dir = path.join(BLOG_OUTPUT_DIR, a.slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), page)
  console.log(`Сгенерировано: blog/${a.slug}/index.html`)
}

const listItemsHtml = articles
  .map(
    a => `
    <a class="blog-card" href="/blog/${a.slug}/">
      <div class="blog-card-date">${new Date(a.publishedAt).toLocaleDateString('ru-RU')}</div>
      <div class="blog-card-title">${a.title}</div>
      <div class="blog-card-excerpt">${a.excerpt}</div>
    </a>`
  )
  .join('\n')

fs.writeFileSync(path.join(BLOG_OUTPUT_DIR, 'index.html'), render(LIST_TEMPLATE, { items: listItemsHtml, siteUrl: SITE_URL }))
console.log('Сгенерировано: blog/index.html')

// Важно: НЕ создаём отдельный sitemap-blog.xml (как sitemap-cities.xml, который
// нигде не подключён и указывает на несуществующие страницы). Вместо этого
// добавляем урлы статей прямо в главный sitemap.xml, который реально читают
// Яндекс и Google — он указан в robots.txt.
const mainSitemapPath = path.join(ROOT, 'sitemap.xml')
const existingXml = fs.readFileSync(mainSitemapPath, 'utf-8')

const blogUrlBlock = [
  `  <url>\n    <loc>${SITE_URL}/blog/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`,
  ...articles.map(
    a => `  <url>\n    <loc>${SITE_URL}/blog/${a.slug}/</loc>\n    <lastmod>${a.publishedAt}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
  ),
].join('\n')

const startMarker = '  <!-- BLOG URLS START (генерируется scripts/build-blog.mjs, не редактировать руками) -->'
const endMarker = '  <!-- BLOG URLS END -->'
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
const withoutOldBlock = existingXml.replace(
  new RegExp(`${escapeRegExp(startMarker)}[\\s\\S]*?${escapeRegExp(endMarker)}\\n?`),
  ''
)
const newXml = withoutOldBlock.replace(
  '</urlset>',
  `${startMarker}\n${blogUrlBlock}\n${endMarker}\n</urlset>`
)
fs.writeFileSync(mainSitemapPath, newXml)
console.log('sitemap.xml обновлён (урлы блога вставлены между маркерами BLOG URLS).')
