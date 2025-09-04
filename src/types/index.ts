export interface User {
  id: string;
  name: string;
  email: string;
  email_verified?: boolean;
  email_verified_at?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  company?: string;
  location?: string;
  vip_level: 'none' | 'basic' | 'premium';
  vip_expiry?: string;
  verified: boolean;
  status: 'active' | 'inactive' | 'banned';
  last_login_at?: string;
  last_login_ip?: string;
  login_count?: number;
  created_at: string;
  updated_at: string;
  // 兼容前端使用的字段名
  vipLevel?: 'none' | 'basic' | 'premium';
  vipExpiry?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  oauthProviders?: string[];
}

export type ResourceType = 'video' | 'software' | 'document' | 'article' | 'file';

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  verified: boolean;
  resourceCount?: number;
  followerCount?: number;
}

export interface ResourceStats {
  downloads: number;
  views: number;
  rating: number;
  reviewCount: number;
  favoriteCount?: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  downloadUrl?: string;
  previewUrl?: string;
  author: Author;
  stats: ResourceStats;
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceDetail extends Resource {
  content: string;
  specifications?: Record<string, string>;
  gallery?: string[];
  fileSize?: number;
  requirements?: string[];
  userInteraction?: {
    purchased: boolean;
    favorited: boolean;
    rated: number | null;
    downloaded: boolean;
  };
}

export interface Comment {
  id: string;
  content: string;
  rating?: number;
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

export interface CartItem {
  resourceId: string;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface DownloadItem {
  id: string;
  resourceId: string;
  filename: string;
  url: string;
  size: number;
  downloaded: number;
  status: 'pending' | 'downloading' | 'paused' | 'completed' | 'failed' | 'cancelled';
  speed?: number;
  remainingTime?: number;
  error?: string;
  createdAt: string;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'keyword' | 'category' | 'author';
  count?: number;
}

export interface ResourceFilters {
  category?: string;
  type?: ResourceType[];
  priceRange?: [number, number];
  rating?: number;
  sortBy?: 'latest' | 'popular' | 'price' | 'rating';
  tags?: string[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: 'alipay' | 'wechat' | 'credit_card' | 'paypal';
  available: boolean;
}

export interface PaymentData {
  methodId: string;
  amount: number;
  currency: string;
  billingAddress?: Address;
  cardInfo?: CardInfo;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CardInfo {
  number: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  name: string;
}

// 新增类型定义
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  banner?: string;
  color?: string;
  level: number;
  parent_id?: string;
  path: string;
  sort_order: number;
  resource_count: number;
  is_featured: boolean;
  status: 'active' | 'inactive';
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  content: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export interface FavoriteFolder {
  id: string;
  name: string;
  description?: string;
  color?: string;
  resourceCount: number;
  createdAt: string;
}

export interface Favorite {
  id: string;
  resourceId: string;
  folderId?: string;
  resource: Resource;
  createdAt: string;
}

export interface DownloadHistory {
  id: string;
  resourceId: string;
  resource: Resource;
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  downloadedAt: string;
  expiresAt?: string;
}

export interface UserStats {
  purchasedResources: number;
  downloadCount: number;
  favoriteCount: number;
  totalSpent: number;
}

export interface SearchFilters {
  categories: Array<{
    name: string;
    count: number;
  }>;
  types: Array<{
    type: string;
    name: string;
    count: number;
  }>;
  priceRange: {
    min: number;
    max: number;
  };
}

export interface SearchResult extends Resource {
  relevanceScore: number;
  highlightedTitle?: string;
  highlightedDescription?: string;
}

export interface TrendingResource extends Resource {
  rank: number;
  rankChange: number;
  trendingScore: number;
}

export interface RecommendationGroup {
  type: 'similar' | 'collaborative' | 'trending';
  title: string;
  items: Array<Resource & {
    reason?: string;
    similarity?: number;
  }>;
}
