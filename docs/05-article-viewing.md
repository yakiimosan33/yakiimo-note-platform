# チケット05: 記事閲覧機能

## 概要
記事の表示、一覧、検索機能を実装する。

## 作業内容
- [ ] ホームページ（最新記事一覧）
- [ ] 記事詳細ページ
- [ ] カテゴリ別一覧ページ
- [ ] タグ検索機能
- [ ] Markdownレンダリング
- [ ] 画像表示最適化

## ページ構成
```
/app/
  - page.tsx                # ホームページ
  - a/[slug]/
    - page.tsx              # 記事詳細
  - c/[slug]/
    - page.tsx              # カテゴリ一覧
  - tags/[tag]/
    - page.tsx              # タグ検索結果
```

## コンポーネント設計
```
/components/article/
  - ArticleCard.tsx         # 記事カード
  - ArticleContent.tsx      # 記事本文
  - ArticleHeader.tsx       # 記事ヘッダー
  - ArticleList.tsx         # 記事一覧
  - CategoryBadge.tsx       # カテゴリバッジ
  - TagList.tsx             # タグリスト
/components/layout/
  - Header.tsx              # ヘッダー
  - Footer.tsx              # フッター
  - Navigation.tsx          # ナビゲーション
```

## データフェッチング
- [ ] Server Componentsでの記事取得
- [ ] 公開記事のみ取得（RLS）
- [ ] ページネーション対応
- [ ] 検索・フィルタリング機能

## Markdownレンダリング
- [ ] `react-markdown` または `@next/mdx` の導入
- [ ] シンタックスハイライト
- [ ] XSS対策（サニタイズ）
- [ ] カスタムコンポーネント対応

## SEO対応
- [ ] 動的メタデータ生成
- [ ] OGPタグ設定
- [ ] 構造化データ
- [ ] sitemap.xml生成

## パフォーマンス最適化
- [ ] `next/image` での画像最適化
- [ ] ページキャッシング設定
- [ ] 必要に応じたSuspense境界
- [ ] 動的インポート

## 実装例
```typescript
// app/a/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug);
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.cover_image_url],
    },
  };
}
```

## 完了条件
- [ ] 全ページが正常に表示される
- [ ] 記事内容がMarkdownで正しくレンダリングされる
- [ ] カテゴリ・タグでの絞り込みが動作する
- [ ] レスポンシブ対応が完了している
- [ ] SEOメタデータが適切に設定される
- [ ] 画像が最適化されて表示される

## 関連チケット
- 02-database-setup.md
- 04-free-read-control.md
- 12-ui-components.md
- 13-seo-optimization.md

## 注意事項
- セキュリティホールを作らないよう、HTMLサニタイズを徹底
- パフォーマンスを考慮したデータフェッチング
- アクセシビリティ対応