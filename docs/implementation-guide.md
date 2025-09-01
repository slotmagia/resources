# 实现指南和代码示例

## 目录
1. [项目初始化](#项目初始化)
2. [基础组件实现](#基础组件实现)
3. [状态管理实现](#状态管理实现)
4. [页面组件实现](#页面组件实现)
5. [功能特性实现](#功能特性实现)
6. [工具函数和Hooks](#工具函数和Hooks)
7. [样式和主题实现](#样式和主题实现)

## 项目初始化

### 1. 安装依赖包
```bash
# 核心依赖
npm install zustand react-hook-form @hookform/resolvers zod
npm install @headlessui/react @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react framer-motion class-variance-authority clsx tailwind-merge
npm install @tanstack/react-query react-player react-pdf

# 开发依赖
npm install -D @types/react-pdf
```

### 2. 配置Tailwind CSS
```javascript
// tailwind.config.js
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#6b7280',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### 3. 工具函数设置
```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
```

## 基础组件实现

### 1. Button组件
```typescript
// components/ui/Button/Button.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
        ghost: 'hover:bg-gray-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading, 
    icon, 
    iconPosition = 'left',
    fullWidth,
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {icon && iconPosition === 'left' && !loading && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && !loading && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### 2. Card组件
```typescript
// components/ui/Card/Card.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hoverable, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-white text-gray-950 shadow-sm',
          {
            'border-gray-200': variant === 'default',
            'border-gray-300': variant === 'outlined',
            'shadow-md': variant === 'elevated',
            'p-0': padding === 'none',
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
            'transition-shadow hover:shadow-md': hoverable,
          },
          className
        )}
        {...props}
      />
    );
  }
);

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
);

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-500', className)}
      {...props}
    />
  )
);

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
```

### 3. Modal组件
```typescript
// components/ui/Modal/Modal.tsx
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-7xl',
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  size = 'md',
  closeOnClickOutside = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
}: ModalProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={closeOnClickOutside ? onOpenChange : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel 
                className={cn(
                  'w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all',
                  sizeClasses[size]
                )}
              >
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {title && (
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          {title}
                        </Dialog.Title>
                      )}
                      {description && (
                        <Dialog.Description className="mt-1 text-sm text-gray-500">
                          {description}
                        </Dialog.Description>
                      )}
                    </div>
                    {showCloseButton && (
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onClick={() => onOpenChange(false)}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
```

## 状态管理实现

### 1. 认证Store
```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  vipLevel: 'none' | 'basic' | 'premium';
  vipExpiry?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        
        login: async (credentials) => {
          set({ loading: true, error: null });
          try {
            // 模拟API调用
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(credentials),
            });
            
            if (!response.ok) {
              throw new Error('登录失败');
            }
            
            const { user, token } = await response.json();
            localStorage.setItem('token', token);
            set({ user, isAuthenticated: true, loading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : '登录失败', 
              loading: false 
            });
          }
        },
        
        register: async (data) => {
          set({ loading: true, error: null });
          try {
            const response = await fetch('/api/auth/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            
            if (!response.ok) {
              throw new Error('注册失败');
            }
            
            const { user, token } = await response.json();
            localStorage.setItem('token', token);
            set({ user, isAuthenticated: true, loading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : '注册失败', 
              loading: false 
            });
          }
        },
        
        logout: () => {
          localStorage.removeItem('token');
          set({ user: null, isAuthenticated: false, error: null });
          // 清理其他stores
          get().clearError();
        },
        
        refreshToken: async () => {
          const token = localStorage.getItem('token');
          if (!token) return;
          
          try {
            const response = await fetch('/api/auth/refresh', {
              headers: { 'Authorization': `Bearer ${token}` },
            });
            
            if (response.ok) {
              const { user, token: newToken } = await response.json();
              localStorage.setItem('token', newToken);
              set({ user, isAuthenticated: true });
            } else {
              get().logout();
            }
          } catch (error) {
            get().logout();
          }
        },
        
        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({ 
          user: state.user, 
          isAuthenticated: state.isAuthenticated 
        }),
      }
    )
  )
);
```

### 2. 资源Store
```typescript
// stores/resourceStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'software' | 'document' | 'article' | 'file';
  category: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  downloadUrl: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  stats: {
    downloads: number;
    views: number;
    rating: number;
    reviewCount: number;
  };
  tags: string[];
  createdAt: string;
}

interface ResourceFilters {
  category?: string;
  type?: string[];
  priceRange?: [number, number];
  rating?: number;
  sortBy?: 'latest' | 'popular' | 'price' | 'rating';
}

interface ResourceStore {
  resources: Resource[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: ResourceFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  
  // Actions
  fetchResources: () => Promise<void>;
  searchResources: (query: string) => Promise<void>;
  setFilters: (filters: Partial<ResourceFilters>) => void;
  loadMore: () => Promise<void>;
  clearResources: () => void;
}

export const useResourceStore = create<ResourceStore>()(
  devtools((set, get) => ({
    resources: [],
    loading: false,
    error: null,
    searchQuery: '',
    filters: {},
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      hasMore: true,
    },
    
    fetchResources: async () => {
      const { pagination, filters } = get();
      set({ loading: true, error: null });
      
      try {
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          ...Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value != null)
          ),
        });
        
        const response = await fetch(`/api/resources?${params}`);
        if (!response.ok) throw new Error('获取资源失败');
        
        const data = await response.json();
        
        set({
          resources: pagination.page === 1 ? data.resources : [...get().resources, ...data.resources],
          pagination: {
            ...pagination,
            total: data.total,
            hasMore: data.hasMore,
          },
          loading: false,
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : '获取资源失败', 
          loading: false 
        });
      }
    },
    
    searchResources: async (query) => {
      set({ 
        searchQuery: query, 
        pagination: { ...get().pagination, page: 1 } 
      });
      await get().fetchResources();
    },
    
    setFilters: (newFilters) => {
      set({ 
        filters: { ...get().filters, ...newFilters },
        pagination: { ...get().pagination, page: 1 }
      });
      get().fetchResources();
    },
    
    loadMore: async () => {
      const { pagination } = get();
      if (!pagination.hasMore || get().loading) return;
      
      set({ 
        pagination: { ...pagination, page: pagination.page + 1 } 
      });
      await get().fetchResources();
    },
    
    clearResources: () => {
      set({ 
        resources: [], 
        pagination: { page: 1, limit: 20, total: 0, hasMore: true } 
      });
    },
  }))
);
```

### 3. 购物车Store
```typescript
// stores/cartStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CartItem {
  resourceId: string;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  total: number;
  
  // Actions
  addItem: (resource: Omit<CartItem, 'quantity'>) => void;
  removeItem: (resourceId: string) => void;
  updateQuantity: (resourceId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        total: 0,
        
        addItem: (resource) => {
          const items = get().items;
          const existingItem = items.find(item => item.resourceId === resource.resourceId);
          
          if (existingItem) {
            get().updateQuantity(resource.resourceId, existingItem.quantity + 1);
          } else {
            const newItems = [...items, { ...resource, quantity: 1 }];
            set({ 
              items: newItems,
              total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
            });
          }
        },
        
        removeItem: (resourceId) => {
          const newItems = get().items.filter(item => item.resourceId !== resourceId);
          set({ 
            items: newItems,
            total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          });
        },
        
        updateQuantity: (resourceId, quantity) => {
          if (quantity <= 0) {
            get().removeItem(resourceId);
            return;
          }
          
          const newItems = get().items.map(item =>
            item.resourceId === resourceId ? { ...item, quantity } : item
          );
          set({ 
            items: newItems,
            total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          });
        },
        
        clearCart: () => {
          set({ items: [], total: 0 });
        },
        
        getItemCount: () => {
          return get().items.reduce((count, item) => count + item.quantity, 0);
        },
      }),
      {
        name: 'cart-store',
      }
    )
  )
);
```

## 页面组件实现

### 1. 首页组件
```typescript
// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useResourceStore } from '@/stores/resourceStore';
import { Hero } from '@/components/sections/Hero';
import { FeaturedResources } from '@/components/sections/FeaturedResources';
import { CategoryNav } from '@/components/sections/CategoryNav';
import { PopularResources } from '@/components/sections/PopularResources';
import { Stats } from '@/components/sections/Stats';

export default function HomePage() {
  const { resources, loading, fetchResources } = useResourceStore();

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return (
    <div className="min-h-screen">
      <Hero />
      <Stats />
      <CategoryNav />
      <FeaturedResources resources={resources.slice(0, 8)} loading={loading} />
      <PopularResources resources={resources.slice(8, 16)} loading={loading} />
    </div>
  );
}
```

### 2. 资源列表页
```typescript
// app/resources/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useResourceStore } from '@/stores/resourceStore';
import { SearchBar } from '@/components/features/SearchBar';
import { FilterSidebar } from '@/components/features/FilterSidebar';
import { ResourceGrid } from '@/components/features/ResourceGrid';
import { Pagination } from '@/components/ui/Pagination';
import { ViewToggle } from '@/components/ui/ViewToggle';

type ViewMode = 'grid' | 'list';

export default function ResourcesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { 
    resources, 
    loading, 
    searchQuery, 
    filters, 
    pagination,
    fetchResources, 
    searchResources, 
    setFilters,
    loadMore 
  } = useResourceStore();

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleSearch = (query: string) => {
    searchResources(query);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar 
          value={searchQuery}
          onSearch={handleSearch}
          placeholder="搜索资源..."
        />
      </div>
      
      <div className="flex gap-8">
        <aside className="w-64 flex-shrink-0">
          <FilterSidebar 
            filters={filters}
            onChange={handleFilterChange}
          />
        </aside>
        
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              找到 {pagination.total} 个资源
            </div>
            <ViewToggle value={viewMode} onChange={setViewMode} />
          </div>
          
          <ResourceGrid 
            resources={resources}
            viewMode={viewMode}
            loading={loading}
          />
          
          {pagination.hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? '加载中...' : '加载更多'}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
```

### 3. 资源详情页
```typescript
// app/resources/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MediaGallery } from '@/components/features/MediaGallery';
import { ResourceInfo } from '@/components/features/ResourceInfo';
import { PurchaseBox } from '@/components/features/PurchaseBox';
import { TabSection } from '@/components/ui/TabSection';
import { CommentSection } from '@/components/features/CommentSection';
import { RelatedResources } from '@/components/features/RelatedResources';

interface ResourceDetail extends Resource {
  content: string;
  specifications: Record<string, string>;
  gallery: string[];
}

export default function ResourceDetailPage() {
  const params = useParams();
  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await fetch(`/api/resources/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setResource(data);
        }
      } catch (error) {
        console.error('获取资源详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [params.id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">加载中...</div>;
  }

  if (!resource) {
    return <div className="container mx-auto px-4 py-8">资源不存在</div>;
  }

  const tabs = [
    {
      id: 'description',
      label: '详细描述',
      content: (
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: resource.content }}
        />
      ),
    },
    {
      id: 'specifications',
      label: '技术规格',
      content: (
        <div className="space-y-4">
          {Object.entries(resource.specifications).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b">
              <span className="font-medium">{key}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'reviews',
      label: '用户评价',
      content: <CommentSection resourceId={resource.id} />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <MediaGallery images={resource.gallery} />
        </div>
        <div className="space-y-6">
          <ResourceInfo resource={resource} />
          <PurchaseBox resource={resource} />
        </div>
      </div>
      
      <TabSection tabs={tabs} />
      
      <div className="mt-12">
        <RelatedResources 
          category={resource.category} 
          excludeId={resource.id} 
        />
      </div>
    </div>
  );
}
```

## 功能特性实现

### 1. 搜索组件
```typescript
// components/features/SearchBar/SearchBar.tsx
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn, debounce } from '@/lib/utils';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'keyword' | 'category' | 'author';
}

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  className?: string;
}

export function SearchBar({ 
  value, 
  onSearch, 
  placeholder = '搜索...', 
  suggestions = [],
  className 
}: SearchBarProps) {
  const [query, setQuery] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = debounce((searchQuery: string) => {
    onSearch(searchQuery);
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [query, suggestions]);

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    onSearch(suggestion.text);
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
            >
              <Search className="h-3 w-3 text-gray-400" />
              <span>{suggestion.text}</span>
              <span className="text-xs text-gray-400 capitalize">
                {suggestion.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 2. 资源卡片组件
```typescript
// components/features/ResourceCard/ResourceCard.tsx
import { Star, Download, Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import type { Resource } from '@/types';

interface ResourceCardProps {
  resource: Resource;
  variant?: 'grid' | 'list';
  onView?: (resource: Resource) => void;
  onDownload?: (resource: Resource) => void;
  onAddToCart?: (resource: Resource) => void;
  onFavorite?: (resource: Resource) => void;
}

export function ResourceCard({
  resource,
  variant = 'grid',
  onView,
  onDownload,
  onAddToCart,
  onFavorite,
}: ResourceCardProps) {
  if (variant === 'list') {
    return (
      <Card className="flex items-center p-4 hover:shadow-md transition-shadow">
        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
          <img 
            src={resource.thumbnail} 
            alt={resource.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 ml-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {resource.author.name} • {resource.category}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  {resource.stats.rating} ({resource.stats.reviewCount})
                </span>
                <span className="flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  {resource.stats.downloads.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-lg text-primary-600">
                {formatCurrency(resource.price)}
              </div>
              {resource.originalPrice && resource.originalPrice > resource.price && (
                <div className="text-sm text-gray-400 line-through">
                  {formatCurrency(resource.originalPrice)}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex flex-col space-y-2">
          <Button size="sm" onClick={() => onView?.(resource)}>
            查看详情
          </Button>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onFavorite?.(resource)}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onAddToCart?.(resource)}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={resource.thumbnail} 
          alt={resource.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary">{resource.type}</Badge>
        </div>
        {resource.originalPrice && resource.originalPrice > resource.price && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive">
              -{Math.round((1 - resource.price / resource.originalPrice) * 100)}%
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {resource.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {resource.author.name} • {resource.category}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            {resource.stats.rating} ({resource.stats.reviewCount})
          </span>
          <span className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            {resource.stats.downloads.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-lg text-primary-600">
              {formatCurrency(resource.price)}
            </div>
            {resource.originalPrice && resource.originalPrice > resource.price && (
              <div className="text-sm text-gray-400 line-through">
                {formatCurrency(resource.originalPrice)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex space-x-2">
        <Button 
          size="sm" 
          className="flex-1"
          onClick={() => onView?.(resource)}
        >
          立即下载
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onFavorite?.(resource)}
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onAddToCart?.(resource)}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
```

这个实现指南提供了完整的代码示例，涵盖了从基础组件到复杂功能的实现。每个示例都遵循了现代React和TypeScript的最佳实践，确保代码的可维护性和可扩展性。
