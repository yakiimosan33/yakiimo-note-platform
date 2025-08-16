# チケット08: ストレージ設定

## 概要
Supabase Storageを使用した画像・ファイル管理システムを構築する。

## 作業内容
- [ ] Supabase Storageバケット作成
- [ ] ストレージポリシー設定
- [ ] 画像アップロード機能
- [ ] ファイル管理機能
- [ ] 画像最適化

## ストレージ構成
```
Buckets:
  - articles-images/        # 記事内画像
    - {article_id}/         # 記事ごとのディレクトリ
      - image1.jpg
      - image2.png
  - cover-images/           # カバー画像
    - {article_id}.jpg
  - uploads/                # 一時アップロード
    - {session_id}/
```

## ポリシー設定
- [ ] 認証済みユーザーのみアップロード可能
- [ ] 全ユーザーが画像閲覧可能
- [ ] 管理者のみ削除可能
- [ ] ファイルサイズ制限

### RLS Policy例
```sql
-- 画像閲覧（全ユーザー）
CREATE POLICY "Public can view images" ON storage.objects
FOR SELECT USING (bucket_id = 'articles-images');

-- 画像アップロード（認証済みユーザー）
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'articles-images' AND auth.role() = 'authenticated');
```

## アップロード機能
```
/lib/storage/
  - upload.ts               # アップロード機能
  - image-optimizer.ts      # 画像最適化
  - file-validator.ts       # ファイル検証
```

### 実装例
```typescript
// 画像アップロード
async function uploadImage(file: File, articleId: string): Promise<string> {
  // ファイル検証
  validateImageFile(file);
  
  // 画像最適化
  const optimizedFile = await optimizeImage(file);
  
  // Supabase Storage にアップロード
  const { data, error } = await supabase.storage
    .from('articles-images')
    .upload(`${articleId}/${file.name}`, optimizedFile);
    
  if (error) throw error;
  
  // 公開URLを返す
  return getPublicUrl(data.path);
}
```

## 画像最適化
- [ ] WebP形式への変換
- [ ] リサイズ処理
- [ ] 圧縮率調整
- [ ] レスポンシブ画像生成

## ドラッグ&ドロップ機能
```
/components/storage/
  - ImageUploader.tsx       # 画像アップローダー
  - DragDropZone.tsx        # ドラッグ&ドロップ
  - ImagePreview.tsx        # プレビュー表示
  - ProgressBar.tsx         # アップロード進捗
```

## ファイル管理
- [ ] アップロード済みファイル一覧
- [ ] ファイル削除機能
- [ ] ファイル情報表示
- [ ] 使用量監視

## セキュリティ
- [ ] ファイル形式チェック
- [ ] ファイルサイズ制限
- [ ] ウイルススキャン（将来対応）
- [ ] 不正ファイル検出

## パフォーマンス最適化
- [ ] 並列アップロード
- [ ] チャンクアップロード（大容量ファイル）
- [ ] キャッシュ最適化
- [ ] CDN連携

## エラーハンドリング
- [ ] ネットワークエラー
- [ ] 容量制限エラー
- [ ] アクセス権限エラー
- [ ] ファイル破損エラー

## 完了条件
- [ ] Storageバケットが正しく設定されている
- [ ] 画像アップロードが正常に動作
- [ ] ファイルが適切に最適化される
- [ ] ドラッグ&ドロップが動作
- [ ] セキュリティポリシーが適用されている
- [ ] エラー処理が適切に実装されている

## 関連チケット
- 01-project-setup.md
- 05-article-viewing.md
- 07-import-feature.md
- 11-image-optimization.md

## 注意事項
- ストレージ容量の監視
- バックアップ戦略の検討
- 画像の著作権管理