# チケット09: 管理者権限システム

## 概要
管理者のみがアクセス可能な機能の認証・認可システムを構築する。

## 作業内容
- [ ] 管理者判定ロジック
- [ ] 管理者認証ミドルウェア
- [ ] アクセス制御機能
- [ ] 管理画面レイアウト
- [ ] 権限チェック機能

## 管理者判定方法

### 方法1: メールアドレスベース
```typescript
// 環境変数で管理者メールを設定
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];

function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email);
}
```

### 方法2: Supabaseカスタムクレーム
```sql
-- ユーザーにroleカラムを追加
ALTER TABLE auth.users ADD COLUMN role TEXT DEFAULT 'user';
```

## 認証機能実装
```
/lib/auth/
  - admin.ts                # 管理者認証
  - permissions.ts          # 権限管理
/middleware/
  - admin-auth.ts           # 管理者ミドルウェア
```

### 実装例
```typescript
// 管理者チェック
export async function checkAdminAuth(): Promise<User | null> {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || !isAdmin(user.email)) {
    return null;
  }
  
  return user;
}

// 管理画面でのガード
export async function requireAdmin() {
  const user = await checkAdminAuth();
  if (!user) {
    redirect('/login?message=Admin access required');
  }
  return user;
}
```

## ミドルウェア実装
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // 管理画面へのアクセス
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const user = await checkAdminAuth();
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}

export const config = {
  matcher: ['/admin/:path*']
};
```

## 管理画面レイアウト
```
/app/admin/
  - layout.tsx              # 管理画面レイアウト
  - components/
    - AdminHeader.tsx       # 管理ヘッダー
    - AdminNav.tsx          # ナビゲーション
    - AdminSidebar.tsx      # サイドバー
```

### レイアウト実装
```typescript
// app/admin/layout.tsx
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 管理者認証チェック
  await requireAdmin();
  
  return (
    <div className="admin-layout">
      <AdminHeader />
      <AdminSidebar />
      <main>{children}</main>
    </div>
  );
}
```

## 権限管理システム
```typescript
// 権限レベル定義
type Permission = 'read' | 'write' | 'delete' | 'admin';

interface UserPermissions {
  articles: Permission[];
  categories: Permission[];
  users: Permission[];
}

// 権限チェック
function hasPermission(user: User, resource: string, action: Permission): boolean {
  // 権限ロジック実装
}
```

## コンポーネントレベルの制御
```typescript
// 管理者のみ表示するコンポーネント
export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();
  
  if (!isAdmin) return null;
  
  return <>{children}</>;
}
```

## セキュリティ強化
- [ ] セッションタイムアウト
- [ ] 不正アクセス検知
- [ ] ログイン試行制限
- [ ] 二要素認証（将来対応）

## ログ・監査機能
- [ ] 管理者アクションのログ記録
- [ ] アクセスログ
- [ ] 不正アクセス通知

## エラーハンドリング
- [ ] 権限不足時の適切なエラー表示
- [ ] セッション切れ時の再認証
- [ ] 不正アクセス時のリダイレクト

## 完了条件
- [ ] 管理者のみ管理画面にアクセス可能
- [ ] 一般ユーザーは適切にリダイレクトされる
- [ ] 管理者権限の判定が正確
- [ ] セキュリティが適切に実装されている
- [ ] エラー処理が適切

## 関連チケット
- 03-auth-setup.md
- 06-article-management.md
- 07-import-feature.md
- 14-security-hardening.md

## 注意事項
- 管理者権限の慎重な管理
- 本番環境での管理者メール設定
- セキュリティログの監視