import { notFound } from 'next/navigation'
import { getTagByName } from '@/lib/tags'
import { getArticlesByTag } from '@/lib/articles'
import Link from 'next/link'
import { Metadata } from 'next'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const tagData = await getTagByName(decodedTag)

  if (!tagData) {
    return {
      title: 'タグが見つかりません',
    }
  }

  return {
    title: `#${tagData.name} - タグ検索`,
    description: `#${tagData.name}タグの記事一覧`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const tagData = await getTagByName(decodedTag)

  if (!tagData) {
    notFound()
  }

  const articles = await getArticlesByTag(decodedTag)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-4">
            #{tagData.name}
          </h1>
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full font-medium">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {articles.length}件の記事
          </div>
        </header>

        {articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">まだ記事がありません</h3>
            <p className="text-gray-500">このタグの記事が公開されるまでお待ちください</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <article 
                key={article.id} 
                className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out both'
                }}
              >
                {article.cover_image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.cover_image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="font-bold text-xl mb-3 line-clamp-2 leading-tight">
                    <Link 
                      href={`/a/${article.slug}`} 
                      className="text-gray-900 hover:text-teal-600 transition-colors duration-200"
                    >
                      {article.title}
                    </Link>
                  </h2>
                  {article.content_md && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {article.content_md.slice(0, 120)}...
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {article.category && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700">
                          {article.category.name}
                        </span>
                      )}
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700">
                        #{tagData.name}
                      </span>
                    </div>
                    {article.published_at && (
                      <time 
                        dateTime={article.published_at}
                        className="text-gray-400 text-xs font-medium"
                      >
                        {new Date(article.published_at).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}