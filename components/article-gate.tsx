'use client'

import { useAuth } from '@/lib/auth-context'
import { canReadArticle, markFreeReadUsed } from '@/lib/free-read-control'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ArticleGateProps {
  children: React.ReactNode
  onAllowRead?: () => void
}

export function ArticleGate({ children, onAllowRead }: ArticleGateProps) {
  const { user, loading } = useAuth()
  const [canRead, setCanRead] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading) {
      const allowed = canReadArticle(!!user)
      setCanRead(allowed)
      
      if (allowed && !user) {
        // 未ログインユーザーの無料閲覧を記録
        markFreeReadUsed()
        onAllowRead?.()
      }
    }
  }, [user, loading, mounted, onAllowRead])

  if (loading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    )
  }

  if (!canRead) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">続きを読むにはログインが必要です</h2>
        <p className="text-gray-600 mb-6">
          無料で閲覧できる記事は1本までです。続きを読むにはログインしてください。
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ログインする
        </Link>
      </div>
    )
  }

  return <>{children}</>
}