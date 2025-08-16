import { notFound } from 'next/navigation'
import { getCategoryBySlug } from '@/lib/categories'
import { getArticlesByCategory } from '@/lib/articles'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'カテゴリが見つかりません',
    }
  }

  return {
    title: `${category.name} - カテゴリ`,
    description: `${category.name}カテゴリの記事一覧`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const articles = await getArticlesByCategory(slug)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-4">
            {category.name}
          </h1>
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-medium">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">まだ記事がありません</h3>
            <p className="text-gray-500">このカテゴリの記事が公開されるまでお待ちください</p>
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
                  <div className="aspect-video overflow-hidden relative">
                    <Image
                      src={article.cover_image_url}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700">
                      {category.name}
                    </span>
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