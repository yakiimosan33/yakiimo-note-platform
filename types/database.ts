export interface Category {
  id: string
  slug: string
  name: string
  created_at: string
}

export interface Article {
  id: string
  slug: string
  title: string
  content_md?: string
  content_html?: string
  cover_image_url?: string
  status: 'draft' | 'published'
  category_id?: string
  created_at: string
  published_at?: string
  category?: Category
}

export interface Tag {
  id: string
  name: string
}

export interface ArticleTag {
  article_id: string
  tag_id: string
}

export interface Import {
  id: string
  source_type: 'markdown' | 'url'
  source_ref: string
  status: 'pending' | 'success' | 'error'
  message?: string
  article_id?: string
  created_at: string
}

export interface FreeRead {
  anon_id: string
  used_at: string
}