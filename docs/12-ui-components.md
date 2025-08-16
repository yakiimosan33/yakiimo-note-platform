# チケット12: UIコンポーネント設計

## 概要
再利用可能で一貫性のあるUIコンポーネントライブラリを構築する。

## 作業内容
- [ ] デザインシステムの定義
- [ ] 基本UIコンポーネント実装
- [ ] レイアウトコンポーネント
- [ ] 記事表示コンポーネント
- [ ] フォームコンポーネント
- [ ] レスポンシブ対応

## デザインシステム
```
/styles/
  - design-tokens.css       # デザイントークン
  - components.css          # コンポーネントスタイル
/components/ui/
  - Button.tsx              # ボタン
  - Input.tsx               # 入力フィールド
  - Card.tsx                # カード
  - Badge.tsx               # バッジ
  - Modal.tsx               # モーダル
  - Dropdown.tsx            # ドロップダウン
  - Loading.tsx             # ローディング
```

## デザイントークン
```css
/* styles/design-tokens.css */
:root {
  /* カラーパレット */
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-secondary: #64748b;
  --color-accent: #f59e0b;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* グレースケール */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-500: #6b7280;
  --color-gray-900: #111827;
  
  /* タイポグラフィ */
  --font-family-sans: var(--font-geist-sans);
  --font-family-mono: var(--font-geist-mono);
  
  /* スペーシング */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* ボーダー */
  --border-radius-sm: 0.375rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 0.75rem;
  
  /* シャドウ */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

## 基本UIコンポーネント

### Button
```typescript
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors';
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner className="mr-2" />}
      {children}
    </button>
  );
}
```

### Card
```typescript
// components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false 
}: CardProps) {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div className={`
      bg-white rounded-lg border border-gray-200 shadow-sm
      ${paddingStyles[padding]}
      ${hover ? 'hover:shadow-md transition-shadow' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}
```

## 記事表示コンポーネント

### ArticleCard
```typescript
// components/article/ArticleCard.tsx
interface ArticleCardProps {
  article: Article;
  showExcerpt?: boolean;
  imageSize?: 'sm' | 'md' | 'lg';
}

export function ArticleCard({ 
  article, 
  showExcerpt = true,
  imageSize = 'md'
}: ArticleCardProps) {
  const imageSizes = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
  };
  
  return (
    <Card hover className="overflow-hidden">
      {article.cover_image_url && (
        <div className={`relative ${imageSizes[imageSize]} overflow-hidden`}>
          <OptimizedImage
            src={article.cover_image_url}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          {article.category && (
            <CategoryBadge category={article.category} />
          )}
          <time className="text-sm text-gray-500">
            {formatDate(article.published_at)}
          </time>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          <Link href={`/a/${article.slug}`} className="hover:text-primary">
            {article.title}
          </Link>
        </h3>
        
        {showExcerpt && article.excerpt && (
          <p className="text-gray-600 line-clamp-3 mb-4">
            {article.excerpt}
          </p>
        )}
        
        {article.tags && article.tags.length > 0 && (
          <TagList tags={article.tags} size="sm" />
        )}
      </div>
    </Card>
  );
}
```

### TagList
```typescript
// components/article/TagList.tsx
interface TagListProps {
  tags: Tag[];
  size?: 'sm' | 'md';
  limit?: number;
}

export function TagList({ tags, size = 'md', limit }: TagListProps) {
  const displayTags = limit ? tags.slice(0, limit) : tags;
  
  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map((tag) => (
        <Badge 
          key={tag.id} 
          variant="secondary" 
          size={size}
        >
          <Link href={`/tags/${tag.name}`}>
            #{tag.name}
          </Link>
        </Badge>
      ))}
      {limit && tags.length > limit && (
        <Badge variant="outline" size={size}>
          +{tags.length - limit}
        </Badge>
      )}
    </div>
  );
}
```

## フォームコンポーネント

### Input
```typescript
// components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export function Input({ 
  label, 
  error, 
  helpText, 
  className = '', 
  ...props 
}: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`
          block w-full px-3 py-2 border border-gray-300 rounded-md
          placeholder-gray-400 focus:outline-none focus:ring-2 
          focus:ring-primary focus:border-transparent
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
```

## レスポンシブ設計
```typescript
// hooks/useBreakpoint.ts
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState('md');
  
  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else setBreakpoint('xl');
    };
    
    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);
  
  return breakpoint;
}
```

## アニメーション
```css
/* styles/animations.css */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
```

## 完了条件
- [ ] デザインシステムが定義されている
- [ ] 基本UIコンポーネントが実装されている
- [ ] 記事表示コンポーネントが動作する
- [ ] フォームコンポーネントが使いやすい
- [ ] レスポンシブ対応が完了している
- [ ] アクセシビリティが考慮されている
- [ ] 一貫性のあるデザインが実現されている

## 関連チケット
- 05-article-viewing.md
- 10-routing-pages.md
- 11-image-optimization.md
- 16-accessibility.md

## 注意事項
- Tailwind CSSとの適切な組み合わせ
- パフォーマンスを考慮したコンポーネント設計
- 将来的な拡張性を考慮