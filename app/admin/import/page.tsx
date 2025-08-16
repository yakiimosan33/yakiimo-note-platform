'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ImportPage() {
  const { user, loading } = useAuth()
  const [importType, setImportType] = useState<'markdown' | 'url'>('markdown')
  const [markdownContent, setMarkdownContent] = useState('')
  const [url, setUrl] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsImporting(true)
    setMessage('')

    try {
      const payload = {
        type: importType,
        content: importType === 'markdown' ? markdownContent : undefined,
        url: importType === 'url' ? url : undefined,
      }

      const response = await fetch('/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'インポートに失敗しました')
      }

      setMessage('インポートが完了しました！')
      setTimeout(() => {
        router.push('/admin')
      }, 2000)

    } catch (error) {
      console.error('インポートエラー:', error)
      setMessage(`エラー: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsImporting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-teal-400 rounded-full animate-pulse"></div>
          <div className="w-6 h-6 bg-blue-400 rounded-full animate-pulse animation-delay-200"></div>
          <div className="w-6 h-6 bg-purple-400 rounded-full animate-pulse animation-delay-400"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">管理者ログインが必要です</h1>
            <p className="text-gray-600 mb-6">記事をインポートするには管理者権限が必要です</p>
            <Link
              href="/login"
              className="inline-block bg-gradient-to-r from-teal-400 to-blue-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-teal-500 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              ログイン
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
            >
              <div className="w-8 h-8 bg-gray-100 group-hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="font-medium">管理画面に戻る</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></div>
            <h1 className="text-3xl font-bold text-gray-900">記事をインポート</h1>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-4">インポート方法を選択</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`group relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                importType === 'markdown' 
                  ? 'border-teal-400 bg-teal-50' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
                <input
                  type="radio"
                  value="markdown"
                  checked={importType === 'markdown'}
                  onChange={(e) => setImportType(e.target.value as 'markdown' | 'url')}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    importType === 'markdown' 
                      ? 'border-teal-400 bg-teal-400' 
                      : 'border-gray-300'
                  }`}>
                    {importType === 'markdown' && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Markdownファイル</div>
                    <div className="text-sm text-gray-600">Markdown形式でコンテンツを直接入力</div>
                  </div>
                </div>
              </label>
              <label className={`group relative p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                importType === 'url' 
                  ? 'border-teal-400 bg-teal-50' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
                <input
                  type="radio"
                  value="url"
                  checked={importType === 'url'}
                  onChange={(e) => setImportType(e.target.value as 'markdown' | 'url')}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    importType === 'url' 
                      ? 'border-teal-400 bg-teal-400' 
                      : 'border-gray-300'
                  }`}>
                    {importType === 'url' && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">URLから抽出</div>
                    <div className="text-sm text-gray-600">Webページからコンテンツを自動抽出</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <form onSubmit={handleImport} className="space-y-6">
            {importType === 'markdown' ? (
              <div>
                <label htmlFor="markdown" className="block text-lg font-semibold text-gray-900 mb-3">
                  Markdownコンテンツ
                </label>
                <div className="relative">
                  <textarea
                    id="markdown"
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                    placeholder="# 記事タイトル

記事の内容をMarkdown形式で入力してください..."
                    rows={20}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 font-mono text-sm bg-gray-50 resize-none"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-500 border border-gray-200">
                      Markdown
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="url" className="block text-lg font-semibold text-gray-900 mb-3">
                  URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 text-gray-900 bg-gray-50"
                  />
                  <div className="absolute top-4 right-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-blue-700">
                      URLからタイトルと本文を自動抽出します。対応しているサイトの記事URLを入力してください。
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isImporting || (importType === 'markdown' ? !markdownContent.trim() : !url.trim())}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-4 px-6 rounded-2xl font-semibold hover:from-green-500 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {isImporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>インポート中...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <span>インポートする</span>
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-2xl border ${
              message.includes('エラー') 
                ? 'bg-red-50 border-red-200'
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center space-x-3">
                {message.includes('エラー') ? (
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div>
                  <div className={`font-semibold ${
                    message.includes('エラー') ? 'text-red-800' : 'text-green-800'
                  }`}>
                    {message.includes('エラー') ? 'エラーが発生しました' : 'インポート成功'}
                  </div>
                  <div className={`text-sm ${
                    message.includes('エラー') ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {message}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}