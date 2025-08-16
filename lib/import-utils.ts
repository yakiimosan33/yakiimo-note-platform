import { marked } from 'marked'
import { JSDOM } from 'jsdom'

export interface ImportResult {
  title: string
  content_md: string
  content_html: string
  slug: string
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)
}

export async function processMarkdown(markdown: string): Promise<ImportResult> {
  const lines = markdown.split('\n')
  let title = ''
  let contentLines = [...lines]

  // 最初のH1タグをタイトルとして抽出
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('# ')) {
      title = line.substring(2).trim()
      contentLines = lines.slice(i + 1)
      break
    }
  }

  // タイトルが見つからない場合は最初の行をタイトルにする
  if (!title && lines.length > 0) {
    title = lines[0].trim()
    contentLines = lines.slice(1)
  }

  const content_md = contentLines.join('\n').trim()
  const content_html = await marked(content_md)
  const slug = generateSlug(title)

  return {
    title,
    content_md,
    content_html,
    slug,
  }
}

export async function extractContentFromUrl(url: string): Promise<ImportResult> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // タイトルを抽出
    let title = document.querySelector('title')?.textContent || ''
    if (!title) {
      const h1 = document.querySelector('h1')
      title = h1?.textContent || 'Untitled'
    }

    // メインコンテンツを抽出
    let content = ''
    const selectors = [
      'article',
      '[role="main"]',
      '.content',
      '.post-content',
      '.entry-content',
      'main',
      '.container'
    ]

    let contentElement = null
    for (const selector of selectors) {
      contentElement = document.querySelector(selector)
      if (contentElement) break
    }

    if (!contentElement) {
      contentElement = document.body
    }

    // 不要な要素を削除
    const unwantedSelectors = [
      'nav', 'header', 'footer', 'aside', '.sidebar',
      '.advertisement', '.ads', '.comments', 'script', 'style'
    ]
    unwantedSelectors.forEach(selector => {
      contentElement?.querySelectorAll(selector).forEach(el => el.remove())
    })

    content = contentElement?.textContent || ''
    content = content.replace(/\s+/g, ' ').trim()

    const content_md = content
    const content_html = content_md.replace(/\n/g, '<br>')
    const slug = generateSlug(title)

    return {
      title: title.trim(),
      content_md,
      content_html,
      slug,
    }
  } catch (error) {
    throw new Error(`URLからのコンテンツ抽出に失敗しました: ${error instanceof Error ? error.message : String(error)}`)
  }
}