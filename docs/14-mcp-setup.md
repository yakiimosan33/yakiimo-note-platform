# チケット14: MCP（Model Context Protocol）設定

## 概要
Claude Codeでyakiimo-noteプロジェクトを効率的に開発するためのMCP設定を行う。

## 作業内容
- [×] MCP設定ファイルの作成
- [×] 環境変数の設定
- [×] Supabase MCP連携
- [×] ファイルシステムアクセス設定
- [×] Git統合設定
- [×] PostgreSQLデータベース接続

## MCP設定ファイル構成

### .claude/mcp.json
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=${SUPABASE_PROJECT_REF}"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem@latest",
        "プロジェクトルートパス"
      ]
    },
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git@latest",
        "--repository=プロジェクトルートパス"
      ]
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres@latest"
      ],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${SUPABASE_DB_URL}"
      }
    }
  }
}
```

## 環境変数設定

### 必要な環境変数
```bash
# Supabase基本設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# MCP用設定
SUPABASE_PROJECT_REF=your_project_ref
SUPABASE_ACCESS_TOKEN=your_access_token
SUPABASE_DB_URL=postgresql://postgres:[password]@db.[project_ref].supabase.co:5432/postgres

# 管理者設定
ADMIN_EMAILS=your-email@example.com
```

## 各MCPサーバーの機能

### 1. Supabase MCP
- [ ] データベーススキーマの確認
- [ ] テーブルデータの参照
- [ ] RLSポリシーの確認
- [ ] ストレージ情報の取得

**使用例:**
```bash
# テーブル一覧取得
supabase:list_tables

# 特定テーブルのスキーマ確認
supabase:describe_table articles

# データの確認
supabase:query "SELECT * FROM articles LIMIT 5"
```

### 2. Filesystem MCP
- [ ] プロジェクトファイルの読み書き
- [ ] ディレクトリ構造の確認
- [ ] ファイル検索機能

**使用例:**
```bash
# ファイル一覧
filesystem:list_directory app/

# ファイル内容確認
filesystem:read_file app/page.tsx

# ファイル作成・編集
filesystem:write_file new-component.tsx
```

### 3. Git MCP
- [ ] コミット履歴の確認
- [ ] ブランチ管理
- [ ] 変更差分の確認
- [ ] マージ状況の把握

**使用例:**
```bash
# 現在の状態確認
git:status

# コミット履歴
git:log --oneline -10

# 変更差分
git:diff HEAD~1
```

### 4. PostgreSQL MCP
- [ ] 直接的なDB操作
- [ ] 複雑なクエリ実行
- [ ] パフォーマンス分析
- [ ] データ分析

## セキュリティ設定

### アクセストークンの取得
1. **Supabaseダッシュボード**にアクセス
2. **Settings** → **API** → **Project API keys**
3. **Project Reference ID**をコピー
4. **Access Tokens**で新しいトークンを作成

### 権限設定
- [ ] 読み取り専用アクセス（開発時）
- [ ] 必要最小限の権限付与
- [ ] 本番環境用の別トークン

## 使用方法

### Claude Codeでの起動
```bash
# プロジェクトディレクトリで実行
claude --mcp-config=.claude/mcp.json
```

### トラブルシューティング
- [ ] Node.jsバージョン確認（v18以上推奨）
- [ ] npxの動作確認
- [ ] 環境変数の設定確認
- [ ] ネットワーク接続確認

## パフォーマンス最適化
- [ ] 必要なMCPサーバーのみ有効化
- [ ] キャッシュ設定の最適化
- [ ] タイムアウト設定の調整

## 完了条件
- [×] MCP設定ファイルが正しく作成されている
- [×] 環境変数が適切に設定されている
- [×] 全MCPサーバーが正常に動作する
- [×] Claude CodeからSupabaseデータにアクセスできる
- [×] ファイルシステム操作が可能
- [×] Git操作が実行できる
- [×] セキュリティが適切に設定されている

## 関連チケット
- 01-project-setup.md
- 02-database-setup.md
- 03-auth-setup.md

## 注意事項
- **セキュリティ**: アクセストークンを直接設定ファイルに記載しない
- **権限管理**: 最小権限の原則に従う
- **バックアップ**: 設定ファイルのバックアップを取る
- **更新**: MCPサーバーの定期的な更新確認

## 今後の拡張
- カスタムMCPサーバーの開発
- 外部API連携の追加
- 開発ツール統合の強化