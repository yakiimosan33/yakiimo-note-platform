# チケット10: ルーティングとページ構成

## 概要
Next.js App Routerを使用したページ構成とルーティングシステムを実装する。

## 作業内容
- [ ] 基本ページ構成の実装
- [ ] 動的ルーティング設定
- [ ] レイアウト階層の構築
- [ ] ナビゲーション機能
- [ ] エラーページ・ローディングページ

## ページ構成
```
/app/
  ├── layout.tsx            # ルートレイアウト
  ├── page.tsx              # ホームページ（記事一覧）
  ├── globals.css           # グローバルスタイル
  ├── loading.tsx           # グローバルローディング
  ├── error.tsx             # グローバルエラー
  ├── not-found.tsx         # 404ページ
  │
  ├── a/                    # 記事詳細
  │   └── [slug]/
  │       ├── page.tsx      # 記事詳細ページ
  │       ├── loading.tsx   # 記事ローディング
  │       └── error.tsx     # 記事エラー
  │
  ├── c/                    # カテゴリ別一覧
  │   └── [slug]/
  │       ├── page.tsx      # カテゴリページ
  │       └── loading.tsx   # カテゴリローディング
  │
  ├── tags/                 # タグ検索
  │   └── [tag]/
  │       └── page.tsx      # タグ検索結果
  │
  ├── login/                # ログイン
  │   └── page.tsx          # ログインページ
  │
  ├── auth/                 # 認証コールバック
  │   └── callback/
  │       └── route.ts      # Supabase認証コールバック
  │
  └── admin/                # 管理画面
      ├── layout.tsx        # 管理画面レイアウト
      ├── page.tsx          # 管理ダッシュボード
      ├── articles/
      │   ├── page.tsx      # 記事管理一覧
      │   └── [id]/
      │       └── page.tsx  # 記事編集
      ├── categories/
      │   └── page.tsx      # カテゴリ管理
      └── import/
          ├── page.tsx      # インポート画面
          └── history/
              └── page.tsx  # インポート履歴
```

## レイアウト実装

### ルートレイアウト
```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={geistSans.variable}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

### 管理画面レイアウト
```typescript
// app/admin/layout.tsx
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <AdminHeader />
        {children}
      </div>
    </div>
  );
}
```

## 動的ルーティング

### 記事詳細ページ
```typescript
// app/a/[slug]/page.tsx
interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    notFound();
  }
  
  return <ArticleContent article={article} />;
}
```

## ナビゲーション
```
/components/navigation/
  - Header.tsx              # メインヘッダー
  - Footer.tsx              # フッター
  - Breadcrumbs.tsx         # パンくずリスト
  - CategoryNav.tsx         # カテゴリナビ
  - AdminNav.tsx            # 管理画面ナビ
```

### 実装例
```typescript
// components/navigation/Header.tsx
export function Header() {
  return (
    <header className="header">
      <nav>
        <Link href="/">ホーム</Link>
        <CategoryNav />
        <AuthButton />
      </nav>
    </header>
  );
}
```

## エラー・ローディングページ

### ローディングページ
```typescript
// app/loading.tsx
export default function Loading() {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <p>読み込み中...</p>
    </div>
  );
}
```

### エラーページ
```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>エラーが発生しました</h2>
      <button onClick={reset}>再試行</button>
    </div>
  );
}
```

## SEO・メタデータ
```typescript
// 動的メタデータ生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.cover_image_url],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.cover_image_url],
    },
  };
}
```

## パフォーマンス最適化
- [ ] 静的生成（SSG）の活用
- [ ] 増分静的再生成（ISR）
- [ ] Suspense境界の適切な配置
- [ ] 動的インポート

## 完了条件
- [ ] 全ページが正常にアクセスできる
- [ ] 動的ルーティングが正しく動作
- [ ] レイアウト階層が適切に実装されている
- [ ] ナビゲーションが直感的
- [ ] エラー・ローディング処理が適切
- [ ] SEOメタデータが正しく設定される

## 関連チケット
- 05-article-viewing.md
- 09-admin-auth.md
- 12-ui-components.md
- 13-seo-optimization.md

## 注意事項
- URL構造の将来的な変更を考慮した設計
- SEOに配慮したURL命名
- アクセシビリティの確保