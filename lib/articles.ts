import { createServerClient } from './supabase-server'
import { Article } from '@/types/database'

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createServerClient()
  
  // URLデコードを行う（日本語スラッグ対応）
  const decodedSlug = decodeURIComponent(slug)
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('slug', decodedSlug)
    .eq('status', 'published')
    .single()

  if (error || !data) {
    return null
  }

  return data as Article
}

export async function getArticles(limit?: number): Promise<Article[]> {
  const supabase = await createServerClient()
  
  let query = supabase
    .from('articles')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error || !data) {
    return []
  }

  return data as Article[]
}

export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('status', 'published')
    .eq('category.slug', categorySlug)
    .order('published_at', { ascending: false })

  if (error || !data) {
    return []
  }

  return data as Article[]
}

export async function getArticlesByTag(tagName: string): Promise<Article[]> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(*),
      article_tags!inner(
        tag:tags!inner(*)
      )
    `)
    .eq('status', 'published')
    .eq('article_tags.tag.name', tagName)
    .order('published_at', { ascending: false })

  if (error || !data) {
    return []
  }

  return data as Article[]
}