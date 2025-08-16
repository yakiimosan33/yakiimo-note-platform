# チケット03: 認証システムの構築

## 概要
Supabase AuthとNext.js App Routerを連携した認証システムを構築する。

## 作業内容
- [×] Supabase Auth設定
- [×] Magic Link認証の実装
- [×] ミドルウェアの実装
- [×] 認証コンテキストの作成
- [×] ログイン・ログアウト機能
- [×] 認証状態の管理

## 技術仕様
- Magic Link（メールリンク）認証
- サーバーサイド認証の優先
- `@supabase/ssr`を使用したCookie管理

## 実装ファイル
```
/middleware.ts                 # 認証ミドルウェア
/app/auth/
  - callback/
    - route.ts                # Auth callback handler
/app/login/
  - page.tsx                  # ログインページ
/lib/auth/
  - server.ts                 # サーバーサイド認証
  - client.ts                 # クライアントサイド認証
/components/auth/
  - LoginForm.tsx             # ログインフォーム
  - LogoutButton.tsx          # ログアウトボタン
```

## Supabase Auth設定
- [×] Site URLの設定
- [×] メールテンプレートのカスタマイズ
- [×] リダイレクトURLの設定

## ベストプラクティス遵守
- [×] `supabase.auth.getUser()`を使用（`getSession()`は禁止）
- [×] Server Componentsでの認証チェック
- [×] 適切なCookie設定（HttpOnly、Secure、SameSite）
- [×] トークンリフレッシュの実装

## ミドルウェア実装
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // トークンリフレッシュ
  // 認証が必要なページのアクセス制御
  // ユーザー情報の更新
}
```

## 完了条件
- [×] Magic Link認証が動作する
- [×] ログイン・ログアウトが正常に機能する
- [×] 認証状態がサーバー・クライアント間で同期される
- [×] 保護されたページへのアクセス制御が機能する
- [×] トークンの自動リフレッシュが動作する

## 関連チケット
- 01-project-setup.md
- 04-free-read-control.md
- 09-admin-auth.md

## 注意事項
- 本番環境でのメール送信設定が必要
- セキュリティヘッダーの適切な設定
- CSRF対策の実装