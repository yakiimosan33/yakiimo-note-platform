import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { processMarkdown, extractContentFromUrl } from '@/lib/import-utils'

export async function POST(request: NextRequest) {
  try {
    const { type, content, url } = await request.json()
    
    const supabase = await createServerClient()
    
    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    let importResult
    let sourceRef = ''

    if (type === 'markdown') {
      if (!content?.trim()) {
        return NextResponse.json({ error: 'Markdownコンテンツを入力してください' }, { status: 400 })
      }
      importResult = await processMarkdown(content)
      sourceRef = 'manual-input'
    } else if (type === 'url') {
      if (!url?.trim()) {
        return NextResponse.json({ error: 'URLを入力してください' }, { status: 400 })
      }
      importResult = await extractContentFromUrl(url)
      sourceRef = url
    } else {
      return NextResponse.json({ error: '無効なインポートタイプです' }, { status: 400 })
    }

    // スラグの重複チェック
    const { data: existingArticle } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', importResult.slug)
      .single()

    if (existingArticle) {
      importResult.slug = `${importResult.slug}-${Date.now()}`
    }

    // インポート履歴を記録
    const { data: importRecord, error: importError } = await supabase
      .from('imports')
      .insert({
        source_type: type,
        source_ref: sourceRef,
        status: 'pending'
      })
      .select()
      .single()

    if (importError) {
      return NextResponse.json({ error: 'インポート履歴の作成に失敗しました' }, { status: 500 })
    }

    // 記事を作成
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert({
        ...importResult,
        status: 'draft'
      })
      .select()
      .single()

    if (articleError) {
      // インポート履歴を失敗として更新
      await supabase
        .from('imports')
        .update({
          status: 'error',
          message: articleError.message
        })
        .eq('id', importRecord.id)

      return NextResponse.json({ error: '記事の作成に失敗しました' }, { status: 500 })
    }

    // インポート履歴を成功として更新
    await supabase
      .from('imports')
      .update({
        status: 'success',
        article_id: article.id
      })
      .eq('id', importRecord.id)

    return NextResponse.json({ 
      success: true, 
      message: 'インポートが完了しました',
      article: article
    })

  } catch (error) {
    console.error('インポートエラー:', error)
    return NextResponse.json({ 
      error: `インポート中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}` 
    }, { status: 500 })
  }
}