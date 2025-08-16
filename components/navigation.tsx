'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function Navigation() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:from-teal-500 group-hover:to-blue-500 transition-all duration-200">
                yakiimo-note
              </span>
            </Link>
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
            >
              記事一覧
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-blue-500 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
                <span className="text-gray-500 text-sm">読み込み中...</span>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
                >
                  管理画面
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 group-hover:w-full transition-all duration-200"></span>
                </Link>
                <div className="h-6 border-l border-gray-200"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-teal-400 to-blue-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-teal-500 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                ログイン
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}