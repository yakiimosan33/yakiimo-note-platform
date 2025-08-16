import { getArticles } from '@/lib/articles'
import { getCategories } from '@/lib/categories'
import Link from 'next/link'

export default async function Home() {
  const articles = await getArticles(10)
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20">
      {/* ヒーローセクション */}
      <header className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-50/50 to-blue-50/50"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-400 to-blue-500 rounded-3xl mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-6">
              yakiimo-note
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              個人が執筆した記事をプラットフォーム上で公開し、<br />
              ユーザーに閲覧してもらうNote風のWebアプリケーション
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* カテゴリセクション */}
        {categories.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center mb-8">
              <div className="w-1 h-6 bg-gradient-to-b from-teal-400 to-blue-500 rounded-full mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-900">カテゴリ</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/c/${category.slug}`}
                  className="group bg-white border border-gray-200 px-6 py-3 rounded-2xl hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out both'
                  }}
                >
                  <span className="font-medium text-gray-700 group-hover:text-teal-700 transition-colors">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 記事セクション */}
        <section>
          <div className="flex items-center mb-8">
            <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-red-500 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-900">最新記事</h2>
          </div>
          
          {articles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">まだ記事がありません</h3>
              <p className="text-gray-500">管理画面から記事をインポートしてください</p>
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
                    <h3 className="font-bold text-xl mb-3 line-clamp-2 leading-tight">
                      <Link 
                        href={`/a/${article.slug}`} 
                        className="text-gray-900 hover:text-teal-600 transition-colors duration-200"
                      >
                        {article.title}
                      </Link>
                    </h3>
                    {article.content_md && (
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                        {article.content_md.slice(0, 120)}...
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {article.category && (
                          <span className="bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium">
                            {article.category.name}
                          </span>
                        )}
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
        </section>
      </div>
    </div>
  )
}
