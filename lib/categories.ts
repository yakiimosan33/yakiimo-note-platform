import { createServerClient } from './supabase-server'
import { Category } from '@/types/database'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error || !data) {
    return []
  }

  return data as Category[]
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return null
  }

  return data as Category
}