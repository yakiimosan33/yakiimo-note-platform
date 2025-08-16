# チケット06: 記事管理機能

## 概要
管理者向けの記事管理インターフェースを実装する。

## 作業内容
- [ ] 管理者認証チェック
- [ ] 記事一覧表示（下書き・公開状態）
- [ ] 記事のステータス切り替え
- [ ] 記事編集機能
- [ ] 記事削除機能
- [ ] カテゴリ管理

## ページ構成
```
/app/admin/
  - layout.tsx              # 管理画面レイアウト
  - page.tsx                # 管理ダッシュボード
  - articles/
    - page.tsx              # 記事一覧
    - [id]/
      - page.tsx            # 記事編集
  - categories/
    - page.tsx              # カテゴリ管理
```

## 管理者認証
- [ ] 管理者判定ロジック
- [ ] アクセス制御ミドルウェア
- [ ] 不正アクセス時のリダイレクト

## 記事管理機能
```
/components/admin/
  - ArticleTable.tsx        # 記事一覧テーブル
  - StatusToggle.tsx        # 公開/下書き切り替え
  - ArticleEditor.tsx       # 記事編集フォーム
  - DeleteButton.tsx        # 削除ボタン
  - CategoryManager.tsx     # カテゴリ管理
```

## Server Actions
```
/lib/actions/
  - article-actions.ts      # 記事操作
  - category-actions.ts     # カテゴリ操作
```

## 実装機能詳細

### 記事一覧表示
- [ ] ページネーション
- [ ] ステータス絞り込み
- [ ] 検索機能
- [ ] ソート機能

### ステータス管理
```typescript
// 公開/下書き切り替え
async function toggleStatus(articleId: string, status: 'draft' | 'published') {
  const publishedAt = status === 'published' ? new Date() : null;
  await supabase
    .from('articles')
    .update({ status, published_at: publishedAt })
    .eq('id', articleId);
}
```

### 記事編集
- [ ] Markdownエディタ
- [ ] リアルタイムプレビュー
- [ ] 画像アップロード
- [ ] タグ管理
- [ ] カテゴリ選択

## セキュリティ
- [ ] 管理者権限チェック
- [ ] CSRF対策
- [ ] 入力値検証
- [ ] XSS対策

## UI/UX
- [ ] レスポンシブ対応
- [ ] 直感的なインターフェース
- [ ] 操作確認ダイアログ
- [ ] 成功・エラーメッセージ

## 完了条件
- [ ] 管理者のみアクセス可能
- [ ] 記事の一覧表示が正常に動作
- [ ] 公開/下書き切り替えが動作
- [ ] 記事編集機能が動作
- [ ] 記事削除機能が動作
- [ ] カテゴリ管理が動作
- [ ] レスポンシブ対応完了

## 関連チケット
- 02-database-setup.md
- 03-auth-setup.md
- 07-import-feature.md
- 09-admin-auth.md

## 注意事項
- 誤操作防止のための確認ダイアログ
- データ整合性の維持
- バックアップ機能の検討