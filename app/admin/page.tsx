'use client'

import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { Article } from '@/types/database'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const { user, loading } = useAuth()
  const [articles, setArticles] = useState<Article[]>([])
  const [articlesLoading, setArticlesLoading] = useState(true)

  const loadArticles = useCallback(async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('記事の取得に失敗しました:', error)
      } else {
        setArticles(data || [])
      }
    } catch (error) {
      console.error('記事の取得中にエラーが発生しました:', error)
    } finally {
      setArticlesLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadArticles()
    }
  }, [user, loadArticles])

  const toggleStatus = async (articleId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    const updates: { status: string; published_at?: string } = { status: newStatus }
    
    if (newStatus === 'published') {
      updates.published_at = new Date().toISOString()
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', articleId)

      if (error) {
        console.error('ステータス更新に失敗しました:', error)
        alert('ステータス更新に失敗しました')
      } else {
        loadArticles()
      }
    } catch (error) {
      console.error('ステータス更新中にエラーが発生しました:', error)
      alert('ステータス更新中にエラーが発生しました')
    }
  }

  const deleteArticle = async (articleId: string, title: string) => {
    if (!confirm(`記事「${title}」を削除しますか？この操作は取り消せません。`)) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId)

      if (error) {
        console.error('記事の削除に失敗しました:', error)
        alert('記事の削除に失敗しました')
      } else {
        loadArticles()
      }
    } catch (error) {
      console.error('記事削除中にエラーが発生しました:', error)
      alert('記事削除中にエラーが発生しました')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center mt-8">
        <h1 className="text-2xl font-bold mb-4">管理者ログインが必要です</h1>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ログイン
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-8 bg-gradient-to-b from-orange-400 to-red-500 rounded-full"></div>
            <h1 className="text-3xl font-bold text-gray-900">記事管理</h1>
          </div>
          <Link
            href="/admin/import"
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-green-500 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>記事をインポート</span>
          </Link>
        </div>

        {articlesLoading ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-6 h-6 bg-teal-400 rounded-full animate-pulse"></div>
              <div className="w-6 h-6 bg-blue-400 rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-6 h-6 bg-purple-400 rounded-full animate-pulse animation-delay-400"></div>
            </div>
            <p className="text-gray-600">記事を読み込み中...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">まだ記事がありません</h3>
            <p className="text-gray-500 mb-6">最初の記事をインポートして始めましょう</p>
            <Link
              href="/admin/import"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-teal-500 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>最初の記事をインポート</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      タイトル
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      カテゴリ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      作成日
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {articles.map((article, index) => (
                    <tr 
                      key={article.id} 
                      className="hover:bg-gray-50/50 transition-colors duration-150"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out both'
                      }}
                    >
                      <td className="px-6 py-6">
                        <div className="max-w-xs">
                          <div className="text-sm font-semibold text-gray-900 line-clamp-2">
                            {article.status === 'published' ? (
                              <Link href={`/a/${article.slug}`} className="hover:text-teal-600 transition-colors">
                                {article.title}
                              </Link>
                            ) : (
                              article.title
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 font-mono">/{article.slug}</div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {article.category?.name || '未分類'}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                          article.status === 'published'
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
                            : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800'
                        }`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            article.status === 'published' ? 'bg-green-400' : 'bg-yellow-400'
                          }`}></div>
                          {article.status === 'published' ? '公開' : '下書き'}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
                        {new Date(article.created_at).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => toggleStatus(article.id, article.status)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 transform hover:scale-105 ${
                            article.status === 'published'
                              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 hover:from-yellow-200 hover:to-orange-200'
                              : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200'
                          }`}
                        >
                          {article.status === 'published' ? '下書きに戻す' : '公開する'}
                        </button>
                        <button
                          onClick={() => deleteArticle(article.id, article.title)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-red-100 to-pink-100 text-red-800 hover:from-red-200 hover:to-pink-200 transition-all duration-200 transform hover:scale-105"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}