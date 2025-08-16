# チケット11: 画像最適化システム

## 概要
Webパフォーマンスを向上させるための画像最適化システムを実装する。

## 作業内容
- [ ] Next.js Image コンポーネントの活用
- [ ] 画像フォーマット最適化
- [ ] レスポンシブ画像対応
- [ ] 遅延読み込み実装
- [ ] 画像キャッシュ戦略

## 技術仕様
- `next/image` コンポーネント使用
- WebP/AVIF フォーマット対応
- レスポンシブ画像配信
- プレースホルダー画像

## 実装ファイル
```
/components/image/
  - OptimizedImage.tsx      # 最適化画像コンポーネント
  - ArticleImage.tsx        # 記事内画像
  - CoverImage.tsx          # カバー画像
  - ImageGallery.tsx        # 画像ギャラリー
/lib/image/
  - image-utils.ts          # 画像ユーティリティ
  - image-processor.ts      # 画像処理
```

## Next.js Image設定
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-supabase-project.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
};
```

## 最適化コンポーネント
```typescript
// components/image/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

## 記事内画像コンポーネント
```typescript
// components/image/ArticleImage.tsx
interface ArticleImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export function ArticleImage({ src, alt, caption }: ArticleImageProps) {
  return (
    <figure className="article-image">
      <OptimizedImage
        src={src}
        alt={alt}
        width={800}
        height={600}
        className="rounded-lg"
      />
      {caption && (
        <figcaption className="text-sm text-gray-600 mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
```

## レスポンシブ画像対応
```typescript
// 画面サイズに応じた画像サイズ
export function ResponsiveImage({ src, alt }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={630}
      sizes="(max-width: 640px) 100vw, 
             (max-width: 1024px) 80vw, 
             (max-width: 1200px) 60vw, 
             50vw"
      className="w-full h-auto"
    />
  );
}
```

## 遅延読み込み設定
```typescript
// 重要な画像は priority、その他は遅延読み込み
export function ImageWithLazyLoading({ 
  src, 
  alt, 
  priority = false 
}: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      priority={priority} // above the foldの画像のみtrue
      loading={priority ? 'eager' : 'lazy'}
      className="transition-opacity duration-300"
    />
  );
}
```

## プレースホルダー画像
```typescript
// lib/image/image-utils.ts
export function generateBlurDataURL(width: number, height: number): string {
  // 単色のぼかし画像を生成
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL();
}

// SVGプレースホルダー
export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" opacity="0.5" />
  <animateTransform attributeName="transform" attributeType="XML" values="-${w} 0;${w} 0;${w} 0" dur="1s" repeatCount="indefinite"/>
</svg>`;

export const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
```

## 画像キャッシュ戦略
```typescript
// next.config.ts でキャッシュ設定
const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 31536000, // 1年
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};
```

## パフォーマンス監視
```typescript
// 画像読み込み監視
export function useImageLoadTime(src: string) {
  const [loadTime, setLoadTime] = useState<number | null>(null);
  
  useEffect(() => {
    const startTime = Date.now();
    const img = new window.Image();
    
    img.onload = () => {
      setLoadTime(Date.now() - startTime);
    };
    
    img.src = src;
  }, [src]);
  
  return loadTime;
}
```

## 画像フォーマット変換
```typescript
// アップロード時にWebP変換
export async function convertToWebP(file: File): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
            type: 'image/webp',
          });
          resolve(webpFile);
        }
      }, 'image/webp', 0.8);
    };
    
    img.src = URL.createObjectURL(file);
  });
}
```

## 完了条件
- [ ] Next.js Imageコンポーネントが適切に設定されている
- [ ] WebP/AVIF フォーマットが自動選択される
- [ ] レスポンシブ画像が正しく配信される
- [ ] 遅延読み込みが動作する
- [ ] プレースホルダーが表示される
- [ ] 画像キャッシュが適切に設定されている
- [ ] パフォーマンスが向上している

## 関連チケット
- 05-article-viewing.md
- 08-storage-setup.md
- 12-ui-components.md
- 15-performance-optimization.md

## 注意事項
- 画像のalt属性を適切に設定
- アクセシビリティを考慮した実装
- 帯域幅を考慮したサイズ設定