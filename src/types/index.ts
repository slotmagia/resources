export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  vipLevel: 'none' | 'basic' | 'premium';
  vipExpiry?: string;
  createdAt: string;
  verified?: boolean;
  // 个人资料补充字段（页面用到，标为可选）
  bio?: string;
  website?: string;
  company?: string;
  location?: string;
}

export type ResourceType = 'video' | 'software' | 'document' | 'article' | 'file';

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  verified?: boolean;
}

export interface ResourceStats {
  downloads: number;
  views: number;
  rating: number;
  reviewCount: number;
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
  downloadUrl: string;
  author: Author;
  stats: ResourceStats;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResourceDetail extends Resource {
  content: string;
  specifications: Record<string, string>;
  gallery: string[];
  fileSize: number;
  downloadCount: number;
  requirements?: string[];
}

export interface Comment {
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
