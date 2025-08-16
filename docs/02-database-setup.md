# チケット02: データベース設計と構築

## 概要
Supabaseデータベースのテーブル作成とRLS（Row Level Security）ポリシーの設定を行う。

## 作業内容
- [×] categoriesテーブルの作成
- [×] articlesテーブルの作成
- [×] tagsテーブルの作成
- [×] article_tagsテーブルの作成
- [×] importsテーブルの作成
- [×] free_readsテーブルの作成
- [ ] RLSポリシーの設定
- [×] TypeScript型の生成

## データベーススキーマ

### categories
```sql
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz default now()
);
```

### articles
```sql
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content_md text not null,
  content_html text,
  cover_image_url text,
  status text not null default 'draft',
  category_id uuid references public.categories(id),
  created_at timestamptz default now(),
  published_at timestamptz
);
```

### tags
```sql
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);
```

### article_tags
```sql
create table public.article_tags (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);
```

### imports
```sql
create table public.imports (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  source_ref text,
  status text not null,
  message text,
  article_id uuid references public.articles(id),
  created_at timestamptz default now()
);
```

### free_reads
```sql
create table public.free_reads (
  anon_id text primary key,
  used_at timestamptz default now()
);
```

## RLSポリシー
- [ ] 公開記事のみselect可能にする
- [ ] 管理者のみ記事編集可能にする
- [ ] カテゴリ・タグは誰でも閲覧可能

## 完了条件
- [×] 全テーブルが作成されている
- [ ] RLSポリシーが正しく設定されている
- [×] TypeScript型が自動生成されている
- [×] テストデータの投入が完了している

## 関連チケット
- 01-project-setup.md
- 05-article-viewing.md
- 06-article-management.md

## 注意事項
- 本番データの移行計画を事前に検討する
- バックアップとリストア手順を確認する