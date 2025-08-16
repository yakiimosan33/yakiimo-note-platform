# チケット04: 無料閲覧制御システム

## 概要
未ログインユーザーに対して「最初の1記事のみ無料閲覧」を実装する。

## 作業内容
- [ ] localStorage による閲覧状態管理
- [ ] サーバーサイドでの匿名ID管理（強化版）
- [ ] 閲覧制限UIの実装
- [ ] ログイン誘導機能

## 技術仕様

### クライアントサイド制御
- localStorage: `firstFreeReadUsed = true`
- 記事詳細ページでの制御ロジック

### サーバーサイド制御（強化版）
- Cookie による匿名UUID管理
- `free_reads` テーブルでの記録
- Rate Limiting対応

## 実装ファイル
```
/lib/free-read/
  - client.ts               # クライアント制御
  - server.ts               # サーバー制御
/components/article/
  - FreeReadGate.tsx        # 閲覧制限コンポーネント
  - LoginPrompt.tsx         # ログイン誘導
/hooks/
  - useFreeRead.ts          # 閲覧状態管理フック
```

## 実装ロジック

### クライアント側
```typescript
// 記事詳細ページでの制御
const canRead = user || !localStorage.getItem('firstFreeReadUsed');
if (!canRead) {
  // ログイン誘導表示
}
```

### サーバー側（強化版）
```typescript
// 匿名IDの管理
const anonId = cookies.get('anon_id') || generateUUID();
const hasUsedFreeRead = await checkFreeRead(anonId);
```

## UI/UX仕様
- [ ] 記事の一部プレビュー表示
- [ ] グラデーションフェードアウト
- [ ] ログインボタンの目立つ配置
- [ ] 残り閲覧可能数の表示

## セキュリティ考慮
- [ ] 簡易なブラウザ制御（localStorage）
- [ ] VPN等による回避は許容範囲
- [ ] 将来的な厳格化への拡張性

## 完了条件
- [ ] 未ログインで1記事目は全文閲覧可能
- [ ] 2記事目以降はログイン誘導が表示される
- [ ] ログイン後は制限なく閲覧可能
- [ ] localStorage制御が正常に動作する
- [ ] UI/UXが自然で分かりやすい

## 関連チケット
- 03-auth-setup.md
- 05-article-viewing.md
- 12-ui-components.md

## 注意事項
- 過度な制限でユーザー体験を損なわないよう注意
- 将来的な課金機能との整合性を考慮