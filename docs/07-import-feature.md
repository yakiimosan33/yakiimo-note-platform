# チケット07: インポート機能

## 概要
Markdownファイルや外部URLから記事をインポートする機能を実装する。

## 作業内容
- [ ] Markdownファイルインポート
- [ ] URLコンテンツインポート
- [ ] 画像の自動アップロード
- [ ] インポート履歴管理
- [ ] エラーハンドリング

## ページ構成
```
/app/admin/import/
  - page.tsx                # インポート画面
  - history/
    - page.tsx              # インポート履歴
```

## インポート機能設計
```
/lib/import/
  - markdown-importer.ts    # Markdownインポート
  - url-importer.ts         # URLインポート
  - image-processor.ts      # 画像処理
  - content-parser.ts       # コンテンツ解析
```

## Markdownインポート
- [ ] ファイルアップロード
- [ ] フロントマター解析
- [ ] 画像ファイル抽出
- [ ] Supabase Storageアップロード
- [ ] 記事データ保存

### 実装例
```typescript
// markdownファイル処理
async function processMarkdownFile(file: File) {
  const content = await file.text();
  const { data: frontmatter, content: markdown } = matter(content);
  
  // 画像抽出・アップロード
  const processedMarkdown = await processImages(markdown);
  
  // 記事作成
  await createArticle({
    title: frontmatter.title,
    content_md: processedMarkdown,
    status: 'draft'
  });
}
```

## URLインポート
- [ ] URL入力フォーム
- [ ] Readability.jsによるコンテンツ抽出
- [ ] HTMLからMarkdown変換
- [ ] 画像URLの処理
- [ ] メタデータ抽出

### 実装例
```typescript
// URL コンテンツ取得
async function importFromUrl(url: string) {
  const response = await fetch(url);
  const html = await response.text();
  
  // Readabilityで本文抽出
  const article = await extractContent(html);
  
  // HTMLをMarkdownに変換
  const markdown = htmlToMarkdown(article.content);
  
  return {
    title: article.title,
    content: markdown,
    excerpt: article.excerpt
  };
}
```

## 画像処理
- [ ] ローカル画像の検出
- [ ] Supabase Storageアップロード
- [ ] URL書き換え
- [ ] 画像最適化

## インポート履歴
- [ ] インポート処理の記録
- [ ] ステータス管理（処理中/完了/失敗）
- [ ] エラーログ保存
- [ ] 再実行機能

## UI/UX
```
/components/import/
  - MarkdownUploader.tsx    # Markdownアップロード
  - UrlImporter.tsx         # URLインポート
  - ImportProgress.tsx      # 進捗表示
  - ImportHistory.tsx       # 履歴表示
```

## エラーハンドリング
- [ ] ファイル形式チェック
- [ ] ファイルサイズ制限
- [ ] ネットワークエラー対応
- [ ] パース失敗時の処理
- [ ] 重複チェック

## バックグラウンド処理
- [ ] 大容量ファイルの非同期処理
- [ ] 進捗状況の表示
- [ ] キャンセル機能

## 完了条件
- [ ] Markdownファイルのインポートが動作
- [ ] URLからのインポートが動作
- [ ] 画像が正しくアップロードされる
- [ ] インポート履歴が記録される
- [ ] エラー時の適切な処理
- [ ] UI/UXが直感的

## 関連チケット
- 02-database-setup.md
- 06-article-management.md
- 08-storage-setup.md
- 09-admin-auth.md

## 注意事項
- 著作権を考慮したインポート
- 大容量ファイルの処理性能
- セキュリティ（悪意あるファイル対策）