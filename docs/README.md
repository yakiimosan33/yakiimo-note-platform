# やきいもNote 開発チケット一覧

## 概要
このディレクトリには、やきいもNoteプラットフォームの機能開発チケットが格納されています。各チケットは独立した機能単位で分割され、todo管理機能付きで進捗を追跡できます。

## チケット進捗管理
各チケット内のtodoリストは以下の形式で管理します：
- `[ ]` 未完了
- `[×]` 完了

## 開発順序（推奨）

### フェーズ1: 基盤構築
1. **[01-project-setup.md](./01-project-setup.md)** - プロジェクト初期設定
2. **[02-database-setup.md](./02-database-setup.md)** - データベース設計と構築  
3. **[03-auth-setup.md](./03-auth-setup.md)** - 認証システムの構築
4. **[08-storage-setup.md](./08-storage-setup.md)** - ストレージ設定

### フェーズ2: コア機能
5. **[10-routing-pages.md](./10-routing-pages.md)** - ルーティングとページ構成
6. **[12-ui-components.md](./12-ui-components.md)** - UIコンポーネント設計
7. **[05-article-viewing.md](./05-article-viewing.md)** - 記事閲覧機能
8. **[04-free-read-control.md](./04-free-read-control.md)** - 無料閲覧制御システム

### フェーズ3: 管理機能
9. **[09-admin-auth.md](./09-admin-auth.md)** - 管理者権限システム
10. **[06-article-management.md](./06-article-management.md)** - 記事管理機能
11. **[07-import-feature.md](./07-import-feature.md)** - インポート機能

### フェーズ4: 最適化・改善
12. **[11-image-optimization.md](./11-image-optimization.md)** - 画像最適化システム
13. **[13-seo-optimization.md](./13-seo-optimization.md)** - SEO最適化

## 各チケットの構成
各チケットファイルには以下のセクションが含まれています：

- **概要**: 機能の説明
- **作業内容**: 実装すべき項目のチェックリスト
- **技術仕様**: 使用技術・実装方法
- **実装ファイル**: 作成・修正するファイル一覧
- **完了条件**: 機能完成の判定基準
- **関連チケット**: 依存関係のあるチケット
- **注意事項**: 実装時の注意点

## 依存関係
```
01-project-setup (基盤)
├── 02-database-setup
├── 03-auth-setup
└── 08-storage-setup
    ├── 10-routing-pages
    ├── 12-ui-components
    └── 05-article-viewing
        ├── 04-free-read-control
        ├── 09-admin-auth
        ├── 06-article-management
        ├── 07-import-feature
        ├── 11-image-optimization
        └── 13-seo-optimization
```

## 進捗確認方法
1. 各チケットファイルを開く
2. チェックリスト（`[ ]`/`[×]`）で進捗を確認
3. 完了条件をすべて満たしているかチェック
4. 関連チケットとの整合性を確認

## 開発ガイドライン
- 必ず関連チケットの完了を確認してから着手
- 各機能は独立してテスト可能な状態で実装
- セキュリティとパフォーマンスを常に考慮
- Next.js・Supabaseのベストプラクティスに従う
- コードレビューとテストを忘れずに実施

## 質問・課題があれば
実装中に不明点や技術的な課題が発生した場合は、該当チケットの「注意事項」セクションを確認し、必要に応じて追加調査や設計見直しを行ってください。