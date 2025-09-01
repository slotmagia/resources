# 组件规格说明书

## 目录
1. [基础UI组件](#基础UI组件)
2. [布局组件](#布局组件)
3. [业务组件](#业务组件)
4. [表单组件](#表单组件)
5. [功能组件](#功能组件)

## 基础UI组件

### Button 按钮组件

#### 设计规格
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}
```

#### 视觉规格
- **主要按钮**: 蓝色背景 (#3B82F6)，白色文字
- **次要按钮**: 灰色背景 (#6B7280)，白色文字
- **轮廓按钮**: 透明背景，蓝色边框和文字
- **幽灵按钮**: 透明背景，悬停时显示背景色
- **危险按钮**: 红色背景 (#EF4444)，白色文字

#### 尺寸规格
- **sm**: 高度 32px，水平内边距 12px，字体 14px
- **md**: 高度 40px，水平内边距 16px，字体 16px
- **lg**: 高度 48px，水平内边距 24px，字体 18px

#### 使用示例
```tsx
<Button variant="primary" size="md" loading={isSubmitting}>
  提交订单
</Button>

<Button variant="outline" icon={<DownloadIcon />} iconPosition="left">
  下载文件
</Button>
```

---

### Card 卡片组件

#### 设计规格
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  children: React.ReactNode;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
```

#### 视觉规格
- **默认卡片**: 白色背景，轻微阴影
- **轮廓卡片**: 透明背景，边框样式
- **悬浮卡片**: 更明显的阴影效果
- **圆角**: 8px
- **阴影**: 0 1px 3px rgba(0,0,0,0.1)

#### 使用示例
```tsx
<Card variant="elevated" hoverable>
  <Card.Header 
    title="资源标题" 
    subtitle="作者名称"
    actions={<Button variant="ghost" size="sm">更多</Button>}
  />
  <Card.Content>
    <p>资源描述内容...</p>
  </Card.Content>
  <Card.Footer>
    <div className="flex justify-between">
      <span>￥29.99</span>
      <Button size="sm">立即购买</Button>
    </div>
  </Card.Footer>
</Card>
```

---

### Modal 模态框组件

#### 设计规格
```typescript
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
}

interface ModalHeaderProps {
  children: React.ReactNode;
  closeButton?: boolean;
}

interface ModalContentProps {
  children: React.ReactNode;
}

interface ModalFooterProps {
  children: React.ReactNode;
}
```

#### 视觉规格
- **遮罩层**: 半透明黑色 rgba(0,0,0,0.5)
- **模态框**: 白色背景，圆角 12px
- **动画**: 淡入淡出 + 缩放效果
- **z-index**: 1000

#### 尺寸规格
- **sm**: 最大宽度 400px
- **md**: 最大宽度 600px
- **lg**: 最大宽度 800px
- **xl**: 最大宽度 1200px
- **full**: 全屏显示

## 布局组件

### MainLayout 主布局

#### 设计规格
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showSidebar?: boolean;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}
```

#### 布局结构
```
┌─────────────────────────────────┐
│            Header               │
├─────────────┬───────────────────┤
│             │                   │
│   Sidebar   │   Main Content    │
│   (可选)     │                   │
│             │                   │
├─────────────┴───────────────────┤
│            Footer               │
└─────────────────────────────────┘
```

#### 响应式行为
- **桌面端**: 侧边栏固定显示
- **平板端**: 侧边栏可折叠
- **移动端**: 侧边栏变为抽屉式

---

### Header 头部组件

#### 设计规格
```typescript
interface HeaderProps {
  logo?: React.ReactNode;
  navigation?: NavigationItem[];
  actions?: React.ReactNode;
  searchBar?: React.ReactNode;
  user?: UserInfo;
  onMenuToggle?: () => void;
  sticky?: boolean;
}

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavigationItem[];
  active?: boolean;
}
```

#### 布局结构
```
┌─────┬──────────────┬─────────┬──────────┐
│Logo │ Navigation   │ Search  │ Actions  │
└─────┴──────────────┴─────────┴──────────┘
```

#### 功能特性
- 粘性定位支持
- 下拉导航菜单
- 用户头像和菜单
- 搜索栏集成
- 响应式导航

## 业务组件

### ResourceCard 资源卡片

#### 设计规格
```typescript
interface ResourceCardProps {
  resource: Resource;
  variant?: 'grid' | 'list';
  showActions?: boolean;
  onView?: (resource: Resource) => void;
  onDownload?: (resource: Resource) => void;
  onAddToCart?: (resource: Resource) => void;
  onFavorite?: (resource: Resource) => void;
  className?: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  stats: {
    downloads: number;
    views: number;
    rating: number;
    reviewCount: number;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

type ResourceType = 'video' | 'software' | 'document' | 'article' | 'file';
```

#### 网格视图布局
```
┌─────────────────────────┐
│      Thumbnail          │
├─────────────────────────┤
│ Title                   │
│ Author • Category       │
│ ⭐ 4.8 (123) • 1.2k↓   │
│ ─────────────────────   │
│ ￥29.99 ￥39.99        │
│ [下载] [❤️] [🛒]        │
└─────────────────────────┘
```

#### 列表视图布局
```
┌───────┬─────────────────────────────────────┬──────────┐
│Thumb  │ Title                               │ Actions  │
│       │ Author • Category • ⭐ 4.8 (123)   │ [下载]   │
│       │ Description preview...              │ [❤️]     │
│       │ ￥29.99 ￥39.99 • 1.2k downloads   │ [🛒]     │
└───────┴─────────────────────────────────────┴──────────┘
```

---

### ResourceDetail 资源详情

#### 设计规格
```typescript
interface ResourceDetailProps {
  resourceId: string;
  onPurchase?: (resource: Resource) => void;
  onDownload?: (resource: Resource) => void;
  onShare?: (resource: Resource) => void;
}
```

#### 布局结构
```
┌─────────────────┬───────────────────────┐
│                 │  Title                │
│   Media         │  Author • Category    │
│  Gallery        │  ⭐⭐⭐⭐⭐ 4.8 (123)  │
│                 │  ─────────────────    │
│   [Preview]     │  ￥29.99 ￥39.99     │
│                 │  [立即购买] [加购物车]   │
├─────────────────┼───────────────────────┤
│           Description                   │
├─────────────────────────────────────────┤
│           Technical Specs               │
├─────────────────────────────────────────┤
│           Reviews & Comments            │
├─────────────────────────────────────────┤
│           Related Resources             │
└─────────────────────────────────────────┘
```

#### 功能特性
- 图片/视频预览轮播
- 粘性购买区域
- 评论和评分系统
- 相关资源推荐
- 社交分享功能

## 表单组件

### SearchBar 搜索栏

#### 设计规格
```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  showSuggestions?: boolean;
  loading?: boolean;
  filters?: SearchFilter[];
  onFilterChange?: (filters: SearchFilter[]) => void;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'keyword' | 'category' | 'author';
  count?: number;
}

interface SearchFilter {
  key: string;
  label: string;
  value: any;
  type: 'select' | 'range' | 'checkbox' | 'radio';
  options?: FilterOption[];
}
```

#### 视觉设计
- 圆角输入框
- 搜索图标
- 清除按钮
- 自动完成下拉
- 高级筛选弹出层

---

### PaymentForm 支付表单

#### 设计规格
```typescript
interface PaymentFormProps {
  order: Order;
  paymentMethods: PaymentMethod[];
  onSubmit: (paymentData: PaymentData) => Promise<void>;
  onCancel?: () => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: 'alipay' | 'wechat' | 'credit_card' | 'paypal';
  available: boolean;
}

interface PaymentData {
  methodId: string;
  amount: number;
  currency: string;
  billingAddress?: Address;
  cardInfo?: CardInfo;
}
```

#### 表单步骤
1. **订单确认** - 显示商品清单和总价
2. **支付方式** - 选择支付方法
3. **支付信息** - 填写支付详情
4. **确认支付** - 最终确认和提交

## 功能组件

### DownloadManager 下载管理器

#### 设计规格
```typescript
interface DownloadManagerProps {
  downloads: DownloadItem[];
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
  onClear: (id: string) => void;
}

interface DownloadItem {
  id: string;
  resourceId: string;
  filename: string;
  url: string;
  size: number;
  downloaded: number;
  status: DownloadStatus;
  speed?: number;
  remainingTime?: number;
  error?: string;
  createdAt: string;
}

type DownloadStatus = 'pending' | 'downloading' | 'paused' | 'completed' | 'failed' | 'cancelled';
```

#### 界面布局
```
┌─────────────────────────────────────────────────────┐
│ filename.zip                                   [⋯]  │
│ 45.2 MB / 67.8 MB • 2.3 MB/s • 00:10剩余           │
│ ████████████████████░░░░░░░░ 67%                    │
├─────────────────────────────────────────────────────┤
│ document.pdf                              [✓] 完成  │
│ 12.5 MB • 下载于 2分钟前                             │
└─────────────────────────────────────────────────────┘
```

---

### CommentSection 评论区

#### 设计规格
```typescript
interface CommentSectionProps {
  resourceId: string;
  comments: Comment[];
  currentUser?: User;
  onSubmit: (comment: NewComment) => Promise<void>;
  onReply: (commentId: string, reply: NewComment) => Promise<void>;
  onLike: (commentId: string) => Promise<void>;
  onReport: (commentId: string, reason: string) => Promise<void>;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    level?: number;
    verified?: boolean;
  };
  createdAt: string;
  updatedAt?: string;
  likes: number;
  liked?: boolean;
  replies?: Comment[];
  replyCount: number;
}

interface NewComment {
  content: string;
  images?: File[];
}
```

#### 功能特性
- 富文本编辑器
- 图片上传支持
- 嵌套回复
- 点赞和举报
- 分页加载
- 实时更新

---

### RatingSystem 评分系统

#### 设计规格
```typescript
interface RatingSystemProps {
  resourceId: string;
  currentRating?: number;
  averageRating: number;
  totalRatings: number;
  distribution: RatingDistribution;
  onRate: (rating: number) => Promise<void>;
  readonly?: boolean;
}

interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}
```

#### 视觉设计
```
┌─────────────────────────────────────┐
│ 总体评分                             │
│                                     │
│    4.8 ⭐⭐⭐⭐⭐                    │
│    基于 1,234 条评价                │
│                                     │
│ 5星 ████████████████████░ 856      │
│ 4星 ██████░░░░░░░░░░░░░░░ 234       │
│ 3星 ███░░░░░░░░░░░░░░░░░░  89       │
│ 2星 ██░░░░░░░░░░░░░░░░░░░  34       │
│ 1星 █░░░░░░░░░░░░░░░░░░░░  21       │
│                                     │
│ 为这个资源评分:                      │
│ ☆☆☆☆☆                             │
└─────────────────────────────────────┘
```

这个组件规格文档详细定义了每个组件的接口、行为和视觉设计，为开发团队提供了明确的实现指导。每个组件都遵循统一的设计系统和交互模式，确保整个应用的一致性和可用性。
