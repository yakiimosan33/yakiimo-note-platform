# チケット13: SEO最適化

## 概要
検索エンジン最適化（SEO）とソーシャルメディア対応を実装する。

## 作業内容
- [ ] メタデータの動的生成
- [ ] OGP（Open Graph Protocol）対応
- [ ] 構造化データの実装
- [ ] sitemap.xml生成
- [ ] robots.txt設定
- [ ] パフォーマンス最適化

## メタデータ設定

### 基本メタデータ
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://yakiimo-note.com'),
  title: {
    template: '%s | やきいもNote',
    default: 'やきいもNote - 技術記事プラットフォーム',
  },
  description: '最新の技術記事を無料で閲覧できるプラットフォーム',
  keywords: ['技術記事', 'プログラミング', 'エンジニア', 'ブログ'],
  authors: [{ name: 'やきいも', url: 'https://yakiimo-note.com' }],
  creator: 'やきいも',
  publisher: 'やきいもNote',
  category: 'technology',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://yakiimo-note.com',
    siteName: 'やきいもNote',
    title: 'やきいもNote - 技術記事プラットフォーム',
    description: '最新の技術記事を無料で閲覧できるプラットフォーム',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'やきいもNote',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yakiimo_note',
    creator: '@yakiimo_note',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

### 記事ページメタデータ
```typescript
// app/a/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: '記事が見つかりません',
    };
  }
  
  const publishedTime = article.published_at;
  const modifiedTime = article.updated_at || article.published_at;
  
  return {
    title: article.title,
    description: article.excerpt || `${article.title} - やきいもNoteで公開中`,
    keywords: article.tags?.map(tag => tag.name) || [],
    authors: [{ name: 'やきいも' }],
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      publishedTime,
      modifiedTime,
      authors: ['やきいも'],
      section: article.category?.name,
      tags: article.tags?.map(tag => tag.name),
      images: [
        {
          url: article.cover_image_url || '/default-og-image.png',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.cover_image_url || '/default-og-image.png'],
    },
    alternates: {
      canonical: `/a/${article.slug}`,
    },
  };
}
```

## 構造化データ

### Article Schema
```typescript
// lib/seo/structured-data.ts
export function generateArticleSchema(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.cover_image_url,
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: {
      '@type': 'Person',
      name: 'やきいも',
      url: 'https://yakiimo-note.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'やきいもNote',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yakiimo-note.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://yakiimo-note.com/a/${article.slug}`,
    },
    articleSection: article.category?.name,
    keywords: article.tags?.map(tag => tag.name).join(', '),
  };
}

// 使用例
export function ArticleJsonLd({ article }: { article: Article }) {
  const schema = generateArticleSchema(article);
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### WebSite Schema
```typescript
// lib/seo/website-schema.ts
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'やきいもNote',
  url: 'https://yakiimo-note.com',
  description: '最新の技術記事を無料で閲覧できるプラットフォーム',
  publisher: {
    '@type': 'Organization',
    name: 'やきいもNote',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://yakiimo-note.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};
```

## Sitemap生成
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yakiimo-note.com';
  
  // 静的ページ
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];
  
  // 記事ページ
  const articles = await getPublishedArticles();
  const articlePages = articles.map((article) => ({
    url: `${baseUrl}/a/${article.slug}`,
    lastModified: new Date(article.updated_at || article.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  // カテゴリページ
  const categories = await getCategories();
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/c/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));
  
  return [...staticPages, ...articlePages, ...categoryPages];
}
```

## Robots.txt
```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/a/', '/c/', '/tags/'],
      disallow: ['/admin/', '/auth/', '/api/'],
    },
    sitemap: 'https://yakiimo-note.com/sitemap.xml',
  };
}
```

## OG画像動的生成
```typescript
// app/a/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/server';

export const runtime = 'edge';
export const alt = '記事のOG画像';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return new ImageResponse(
      (
        <div style={{ 
          display: 'flex', 
          width: '100%', 
          height: '100%',
          backgroundColor: '#1f2937',
          color: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          記事が見つかりません
        </div>
      ),
      { ...size }
    );
  }
  
  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        padding: 48,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}>
          <h1 style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: '#111827',
            lineHeight: 1.2,
            marginBottom: 24,
          }}>
            {article.title}
          </h1>
          
          {article.excerpt && (
            <p style={{
              fontSize: 24,
              color: '#6b7280',
              lineHeight: 1.5,
            }}>
              {article.excerpt.slice(0, 100)}...
            </p>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <span style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: '#2563eb',
            }}>
              やきいもNote
            </span>
          </div>
          
          {article.category && (
            <span style={{
              fontSize: 20,
              color: '#6b7280',
              backgroundColor: '#f3f4f6',
              padding: '8px 16px',
              borderRadius: 8,
            }}>
              {article.category.name}
            </span>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
```

## パフォーマンス最適化
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // 静的生成の最適化
  output: 'standalone',
  
  // 画像最適化
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // 圧縮設定
  compress: true,
  
  // ヘッダー設定
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};
```

## 完了条件
- [ ] 動的メタデータが正しく生成される
- [ ] OGP対応が完了している
- [ ] 構造化データが実装されている
- [ ] sitemap.xmlが自動生成される
- [ ] robots.txtが適切に設定されている
- [ ] Core Web Vitalsが良好
- [ ] 検索エンジンでの表示が適切

## 関連チケット
- 05-article-viewing.md
- 10-routing-pages.md
- 11-image-optimization.md
- 15-performance-optimization.md

## 注意事項
- コンテンツの品質がSEOの基本
- 過度なSEO対策は避ける
- ユーザー体験を最優先にする