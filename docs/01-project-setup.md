# チケット01: プロジェクト初期設定

## 概要
Next.js + Supabase プロジェクトの基本セットアップを行う。

## 作業内容
- [×] Supabaseプロジェクトの作成
- [×] 環境変数の設定
- [×] Supabaseクライアントの設定
- [×] 基本的なディレクトリ構造の構築

## 技術仕様
- Next.js 15 + App Router
- Supabase (DB, Auth, Storage)
- TypeScript
- Tailwind CSS v4

## 必要なパッケージ
```bash
npm install @supabase/supabase-js @supabase/ssr
```

## ファイル構成
```
/lib
  /supabase
    - client.ts      # Client Component用
    - server.ts      # Server Component用
    - middleware.ts  # Middleware用
/types
  - supabase.ts     # 型定義
.env.local         # 環境変数
```

## 環境変数
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 完了条件
- [×] Supabaseプロジェクトが作成され、接続確認ができる
- [×] 環境変数が正しく設定されている
- [×] 基本的なSupabaseクライアントが動作する
- [×] TypeScript型が生成されている

## 関連チケット
- 02-database-setup.md
- 03-auth-setup.md

## 注意事項
- 本番環境用の環境変数は別途設定が必要
- Supabaseプロジェクトの地域設定を適切に選択する