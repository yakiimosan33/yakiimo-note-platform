import { notFound } from 'next/navigation'
import { getArticleBySlug } from '@/lib/articles'
import { ArticleGate } from '@/components/article-gate'
import { Metadata } from 'next'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title: '記事が見つかりません',
    }
  }

  return {
    title: article.title,
    description: article.content_md ? article.content_md.slice(0, 160) : undefined,
    openGraph: {
      title: article.title,
      description: article.content_md ? article.content_md.slice(0, 160) : undefined,
      images: article.cover_image_url ? [article.cover_image_url] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* カバー画像 */}
        {article.cover_image_url && (
          <div className="mb-8 rounded-3xl overflow-hidden shadow-xl">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full h-80 object-cover"
            />
          </div>
        )}

        {/* 記事ヘッダー */}
        <header className="mb-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-teal-400 to-blue-500 rounded-full"></div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">{article.title}</h1>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {article.category && (
              <span className="bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 px-4 py-2 rounded-full font-medium">
                {article.category.name}
              </span>
            )}
            {article.published_at && (
              <div className="flex items-center text-gray-500 space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time dateTime={article.published_at}>
                  {new Date(article.published_at).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            )}
          </div>
        </header>

        {/* 記事コンテンツ */}
        <ArticleGate>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <article className="prose prose-lg max-w-none p-8 prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-4 prose-blockquote:border-teal-400 prose-blockquote:bg-teal-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg">
              {article.content_html ? (
                <div dangerouslySetInnerHTML={{ __html: article.content_html }} />
              ) : (
                <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-6 rounded-xl border border-gray-200">
                  {article.content_md}
                </div>
              )}
            </article>
          </div>
        </ArticleGate>

        {/* 記事フッター */}
        <footer className="mt-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">yakiimo-note</p>
                <p className="text-sm text-gray-500">記事をお読みいただきありがとうございました</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 p-2 rounded-xl transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}