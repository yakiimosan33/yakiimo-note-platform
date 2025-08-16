import { createServerClient } from './supabase-server'
import { Tag } from '@/types/database'

export async function getTags(): Promise<Tag[]> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  if (error || !data) {
    return []
  }

  return data as Tag[]
}

export async function getTagByName(name: string): Promise<Tag | null> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('name', name)
    .single()

  if (error || !data) {
    return null
  }

  return data as Tag
}