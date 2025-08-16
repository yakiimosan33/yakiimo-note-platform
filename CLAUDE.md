# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

「yakiimo-note」は、個人が執筆した記事をプラットフォーム上で公開し、ユーザーに閲覧してもらうNote風のWebアプリケーションです。未ログインユーザーは最初の1記事のみ無料で全文閲覧可能で、2本目以降はログインが必要になる仕組みです。

## コマンド

開発でよく使用するコマンド:
- `npm run dev` - Turbopack有効化した開発サーバーを起動
- `npm run build` - 本番用ビルド
- `npm start` - 本番サーバー起動
- `npm run lint` - Next.jsリント実行

## アーキテクチャ

### 技術スタック
- **Next.js 15.4.6** (App Router使用)
- **React 19.1.0** と **React DOM 19.1.0**
- **TypeScript 5** (strict設定)
- **Tailwind CSS v4** (PostCSS plugin設定)
- **Supabase** (データベース、認証、ストレージ)
- **Vercel** (デプロイ先)

### プロジェクト構造
- `app/` - Next.js App Routerディレクトリ:
  - `layout.tsx` - Geistフォントとグローバルスタイルを含むルートレイアウト
  - `page.tsx` - ホームページコンポーネント
  - `globals.css` - Tailwindインポートとカスタムプロパティを含むグローバルスタイル
  - `c/[slug]/` - カテゴリ別記事一覧ページ
  - `tags/[tag]/` - タグ検索結果ページ
  - `a/[slug]/` - 記事詳細ページ（閲覧制限あり）
  - `login/` - ログインページ
  - `admin/` - 管理者専用ページ
    - `import/` - インポート画面
    - `articles/` - 記事一覧・公開/下書き切替
- `public/` - 静的アセット（アイコン等）
- `lib/` - ユーティリティ関数とSupabase設定
- `components/` - 再利用可能なReactコンポーネント
- `types/` - TypeScript型定義

### データベース設計 (Supabase)

#### テーブル構造:
- **categories** - 記事カテゴリ（id, slug, name, created_at）
- **articles** - 記事情報（id, slug, title, content_md, content_html, cover_image_url, status, category_id, created_at, published_at）
- **tags** - タグ（id, name）
- **article_tags** - 記事とタグの関連（article_id, tag_id）
- **imports** - インポート履歴（id, source_type, source_ref, status, message, article_id, created_at）
- **free_reads** - 無料閲覧記録（anon_id, used_at）

### 主要機能

#### 記事閲覧制御
- localStorageで `firstFreeReadUsed=true` を管理
- 未ログインユーザーは1記事のみ無料閲覧可能
- 2本目以降はログイン必須

#### 認証システム
- Supabase Authを使用
- Magic Link（メールリンク）によるログイン

#### 記事管理
- 管理者のみ記事投稿可能
- Markdownファイルインポート機能
- URLからコンテンツ抽出・インポート機能
- 下書き/公開ステータス管理

#### ストレージ
- 記事内画像・添付ファイルはSupabase Storageに保存

### セキュリティ
- Row Level Security (RLS) で公開記事のみselect可能
- HTMLレンダリング時のサニタイズでXSS防止
- 管理者機能へのアクセス制御

### 開発ノート
- モダンなReactパターン（関数コンポーネント）を使用
- TailwindユーティリティクラスとカスタムCSS変数でスタイリング
- TypeScriptパスエイリアス（`@/*`）を設定
- ライト/ダークモード対応
- OGP/SEO対応予定

### Next.js ベストプラクティス

#### ディレクトリ構造
- `app/` - App Routerの構造に従い、ページとレイアウトを配置
- `components/` - 再利用可能なコンポーネント（UI/feature別に整理）
- `lib/` - ユーティリティ関数、設定ファイル、API クライアント
- `types/` - TypeScript型定義ファイル
- `hooks/` - カスタムフック
- `utils/` - 汎用ヘルパー関数

#### ファイル命名規則
- コンポーネント: PascalCase（`ArticleCard.tsx`）
- ページ: kebab-case（`page.tsx`, `layout.tsx`）
- ユーティリティ: camelCase（`supabase.ts`, `auth.ts`）
- 型定義: PascalCase（`Article.ts`, `User.ts`）

#### コンポーネント設計
- Server Componentsを優先し、必要な場合のみClient Components（'use client'）を使用
- プロップスの型定義を必須とし、interfaceまたはtypeで明示
- デフォルトエクスポートよりも名前付きエクスポートを推奨
- 1つのファイルには1つの主要コンポーネントのみ

#### パフォーマンス最適化
- `next/image`を使用した画像最適化
- `next/font`でフォント最適化
- 適切な場所での`loading.tsx`と`error.tsx`の配置
- メタデータ生成は`generateMetadata`関数を使用
- 必要に応じて`Suspense`境界を設定

#### データフェッチング
- Server Componentsでのデータフェッチングを優先
- `fetch`のキャッシュ機能を適切に活用
- エラーハンドリングを適切に実装
- ローディング状態の適切な管理

#### セキュリティとアクセシビリティ
- CSP（Content Security Policy）の設定
- 適切なHTMLセマンティクス
- キーボードナビゲーション対応
- スクリーンリーダー対応
- 色のコントラスト比を考慮

#### TypeScript規則
- strict モードを有効化
- any型の使用を避け、適切な型定義
- オプショナルチェーニング（?.）とnull合体演算子（??）の活用
- ユニオン型と型ガードの適切な使用

#### App Router 特有のベストプラクティス
- ページとレイアウトは適切な階層構造で配置（`app/layout.tsx`, `app/page.tsx`）
- 共通レイアウトは上位の`layout.tsx`で定義
- ローディングUIは`loading.tsx`、エラーUIは`error.tsx`で管理
- 動的ルートは`[param]`、キャッチオールルートは`[...slug]`を使用
- ルートグループ`(group)`で論理的にルートを整理
- メタデータは各ページの`generateMetadata`関数で生成
- Server Actionsは`actions.ts`ファイルに分離して管理
- Client Componentsは最小限に留め、インタラクティブな部分のみに適用
- `redirect()`, `notFound()`関数を適切に使用
- パラレルルート`@folder`とインターセプトルート`(.)folder`を必要に応じて活用

#### Supabase Auth with Next.js ベストプラクティス

##### クライアント作成
- **Server Component用**: 各ルートで新しいSupabaseクライアントを作成
- **Client Component用**: `createBrowserClient()`でシングルトンパターンを使用
- Server ActionsやRoute Handlersでは専用のサーバーサイドクライアントを使用

##### 認証セキュリティルール
- **重要**: ページやユーザーデータの保護には常に`supabase.auth.getUser()`を使用
- **禁止**: サーバーコード内で`supabase.auth.getSession()`を信頼してはいけない
- サーバーはCookieからセッションを取得するが、これは誰でも偽装可能

##### ミドルウェアの役割
- 期限切れの認証トークンをリフレッシュ（`supabase.auth.getUser()`を呼び出し）
- リフレッシュされたトークンをServer Componentsに渡す
- ブラウザサイドのトークンを更新
- 認証が必要なページへのアクセス制御

##### Cookie・セッション管理
- `@supabase/ssr`パッケージを使用してフレームワーク非依存のCookie処理
- 認証済みリクエストではNext.jsデータキャッシングをオプトアウト
- Cookieの適切な設定（HttpOnly、Secure、SameSite）

##### メール確認フロー
- サーバーサイド認証フローをサポートするようにメールテンプレートをカスタマイズ
- 確認URLにトークン詳細を含めるよう修正
- Magic Linkの適切なリダイレクト処理

##### セキュリティガイドライン
- 認証状態の検証は必ずサーバーサイドで実行
- クライアントサイドの認証状態は表示目的のみに使用
- 重要な操作前には必ずユーザー認証を再確認
- RLS（Row Level Security）ポリシーでデータアクセスを制御

#### コードスタイル
- ESLint + Prettierでコード整形
- コンポーネント内での適切な関数定義順序（型定義 → コンポーネント → エクスポート）
- JSDocコメントでコンポーネントの用途を明記
- 複雑なロジックは別ファイルに分離
- Server ActionsとClient Componentsを明確に分離

### バックログ
**v0 (MVP)**
- 記事閲覧 + ログイン制御（1本無料）
- Markdown/URLインポート
- カテゴリ一覧・タグ検索
- 管理UI（公開/下書き切替）

**v0.1**
- 画像ドラッグ&ドロップアップロード
- 下書きプレビューURL (noindex)

**v1 (将来的拡張)**
- 匿名ID + Rate Limitで「1本無料」を厳格化
- 会員限定公開
- 課金機能（記事単体購入/サブスク/投げ銭）