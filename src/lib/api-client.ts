/**
 * API客户端 - 对接Golang后端服务
 * 后端地址: http://localhost:8000
 * URL前缀: /api
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const API_PREFIX = '/api';

// 后端实际返回的响应格式
export interface BackendResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  timestamp?: number;
  traceID?: string;
}

// 前端统一的响应格式
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp?: string;
}

export interface PaginationResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = `${API_BASE_URL}${API_PREFIX}`;
    
    // 从localStorage获取token
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const backendData: BackendResponse<T> = await response.json();

      // 转换后端响应格式为前端统一格式
      if (!response.ok) {
        return {
          success: false,
          error: {
            code: backendData.code?.toString() || 'HTTP_ERROR',
            message: backendData.message || `HTTP ${response.status}: ${response.statusText}`,
          },
          timestamp: backendData.timestamp?.toString(),
        };
      }

      // 后端code为0表示成功
      if (backendData.code === 0) {
        return {
          success: true,
          data: backendData.data,
          message: backendData.message,
          timestamp: backendData.timestamp?.toString(),
        };
      } else {
        // 后端code不为0表示业务错误
        return {
          success: false,
          error: {
            code: backendData.code?.toString() || 'BUSINESS_ERROR',
            message: backendData.message || '业务处理失败',
          },
          timestamp: backendData.timestamp?.toString(),
        };
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : '网络请求失败',
        },
      };
    }
  }

  // GET请求
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.request<T>(url, { method: 'GET' });
  }

  // POST请求
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT请求
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE请求
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // 认证相关API
  auth = {
    // 用户登录
    login: async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
      const response = await this.post<{
        user: any;
        token: string;
        refreshToken: string;
        expiresIn: number;
      }>('/auth/login', credentials);
      
      if (response.success && response.data?.token) {
        this.setToken(response.data.token);
      }
      
      return response;
    },

    // 用户注册
    register: async (data: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
      agreeTerms: boolean;
    }) => {
      const response = await this.post<{
        user: any;
        token: string;
        refreshToken: string;
        expiresIn: number;
      }>('/auth/register', data);
      
      if (response.success && response.data?.token) {
        this.setToken(response.data.token);
      }
      
      return response;
    },

    // 用户登出
    logout: async (refreshToken?: string) => {
      const response = await this.post('/auth/logout', { refreshToken });
      if (response.success) {
        this.setToken(null);
      }
      return response;
    },

    // 刷新token
    refresh: async (refreshToken: string) => {
      const response = await this.post<{
        token: string;
        refreshToken: string;
        expiresIn: number;
      }>('/auth/refresh', { refreshToken });
      
      if (response.success && response.data?.token) {
        this.setToken(response.data.token);
      }
      
      return response;
    },

    // 修改密码
    changePassword: async (data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      return this.put('/auth/change-password', data);
    },

    // 忘记密码
    forgotPassword: async (email: string) => {
      return this.post('/auth/forgot-password', { email });
    },

    // 重置密码
    resetPassword: async (data: {
      token: string;
      password: string;
      confirmPassword: string;
    }) => {
      return this.post('/auth/reset-password', data);
    },
  };

  // 资源相关API
  resources = {
    // 获取资源列表
    getList: async (params?: {
      page?: number;
      limit?: number;
      category?: string;
      type?: string;
      tags?: string;
      priceMin?: number;
      priceMax?: number;
      rating?: number;
      sortBy?: string;
      sortOrder?: string;
      featured?: boolean;
    }) => {
      return this.get<PaginationResponse<any> & { filters?: any }>('/resources', params);
    },

    // 获取资源详情
    getDetail: async (resourceId: string) => {
      return this.get<any>(`/resources/${resourceId}`);
    },

    // 搜索资源
    search: async (params: {
      q: string;
      page?: number;
      limit?: number;
      category?: string;
      type?: string;
      priceMin?: number;
      priceMax?: number;
      rating?: number;
      sortBy?: string;
    }) => {
      return this.get<PaginationResponse<any> & {
        query: string;
        suggestions: string[];
        searchTime: number;
      }>('/resources/search', params);
    },

    // 获取热门资源
    getTrending: async (params?: {
      period?: string;
      limit?: number;
      category?: string;
    }) => {
      return this.get<{ period: string; items: any[] }>('/resources/trending', params);
    },

    // 获取推荐资源
    getRecommendations: async (params?: {
      limit?: number;
      type?: string;
    }) => {
      return this.get<{ recommendations: any[] }>('/resources/recommendations', params);
    },

    // 获取资源评论
    getComments: async (resourceId: string, params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
    }) => {
      return this.get<PaginationResponse<any> & { summary: any }>(
        `/resources/${resourceId}/comments`,
        params
      );
    },

    // 添加评论
    addComment: async (resourceId: string, data: {
      content: string;
      rating: number;
    }) => {
      return this.post<any>(`/resources/${resourceId}/comments`, data);
    },

    // 收藏/取消收藏
    toggleFavorite: async (resourceId: string, action: 'add' | 'remove') => {
      return this.post<{
        favorited: boolean;
        favoriteCount: number;
      }>(`/resources/${resourceId}/favorite`, { action });
    },

    // 获取下载链接
    getDownloadUrl: async (resourceId: string) => {
      return this.get<{
        downloadUrl: string;
        expiresAt: string;
        fileSize: number;
        fileName: string;
        downloadCount: number;
        remainingDownloads: number;
      }>(`/resources/${resourceId}/download`);
    },

    // 举报资源
    report: async (resourceId: string, data: {
      reason: string;
      description?: string;
    }) => {
      return this.post(`/resources/${resourceId}/report`, data);
    },
  };

  // 分类相关API
  categories = {
    // 获取分类列表
    getList: async () => {
      return this.get<any[]>('/categories');
    },

    // 获取分类详情
    getDetail: async (categoryId: string) => {
      return this.get<any>(`/categories/${categoryId}`);
    },

    // 获取分类下的资源
    getResources: async (categoryId: string, params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: string;
    }) => {
      return this.get<PaginationResponse<any>>(`/categories/${categoryId}/resources`, params);
    },
  };

  // 购物车相关API
  cart = {
    // 获取购物车
    get: async () => {
      return this.get<{
        items: any[];
        total: number;
        itemCount: number;
      }>('/cart');
    },

    // 添加商品到购物车
    addItem: async (data: {
      resourceId: string;
      quantity?: number;
    }) => {
      return this.post<any>('/cart/items', data);
    },

    // 更新购物车商品
    updateItem: async (itemId: string, data: {
      quantity: number;
    }) => {
      return this.put<any>(`/cart/items/${itemId}`, data);
    },

    // 删除购物车商品
    removeItem: async (itemId: string) => {
      return this.delete(`/cart/items/${itemId}`);
    },

    // 清空购物车
    clear: async () => {
      return this.delete('/cart');
    },
  };

  // 订单相关API
  orders = {
    // 获取订单列表
    getList: async (params?: {
      page?: number;
      limit?: number;
      status?: string;
    }) => {
      return this.get<PaginationResponse<any>>('/orders', params);
    },

    // 获取订单详情
    getDetail: async (orderId: string) => {
      return this.get<any>(`/orders/${orderId}`);
    },

    // 创建订单
    create: async (data: {
      items: Array<{
        resourceId: string;
        quantity: number;
      }>;
      paymentMethod: string;
      couponCode?: string;
    }) => {
      return this.post<{
        orderId: string;
        orderNumber: string;
        total: number;
        paymentUrl?: string;
      }>('/orders', data);
    },

    // 支付订单
    pay: async (orderId: string, data: {
      paymentMethod: string;
      returnUrl?: string;
    }) => {
      return this.post<{
        paymentUrl?: string;
        paymentId: string;
      }>(`/orders/${orderId}/pay`, data);
    },

    // 取消订单
    cancel: async (orderId: string, reason?: string) => {
      return this.post(`/orders/${orderId}/cancel`, { reason });
    },
  };

  // 收藏相关API
  favorites = {
    // 获取收藏列表
    getList: async (params?: {
      page?: number;
      limit?: number;
      folderId?: string;
    }) => {
      return this.get<PaginationResponse<any>>('/favorites', params);
    },

    // 获取收藏夹列表
    getFolders: async () => {
      return this.get<any[]>('/favorites/folders');
    },

    // 创建收藏夹
    createFolder: async (data: {
      name: string;
      description?: string;
      color?: string;
    }) => {
      return this.post<any>('/favorites/folders', data);
    },

    // 删除收藏
    remove: async (favoriteId: string) => {
      return this.delete(`/favorites/${favoriteId}`);
    },
  };

  // 用户相关API
  users = {
    // 获取用户信息
    getProfile: async () => {
      return this.get<any>('/users/me');
    },

    // 更新用户信息
    updateProfile: async (data: {
      name?: string;
      bio?: string;
      website?: string;
      company?: string;
      location?: string;
    }) => {
      return this.put<any>('/users/me', data);
    },

    // 上传头像
    uploadAvatar: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const url = `${this.baseURL}/users/me/avatar`;
      const headers: Record<string, string> = {};
      
      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }
      // 不设置Content-Type，让浏览器自动设置multipart/form-data
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
          headers,
        });

        const backendData: BackendResponse<{ avatarUrl: string }> = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: {
              code: backendData.code?.toString() || 'HTTP_ERROR',
              message: backendData.message || `HTTP ${response.status}: ${response.statusText}`,
            },
          };
        }

        if (backendData.code === 0) {
          return {
            success: true,
            data: backendData.data,
            message: backendData.message,
          };
        } else {
          return {
            success: false,
            error: {
              code: backendData.code?.toString() || 'BUSINESS_ERROR',
              message: backendData.message || '上传失败',
            },
          };
        }
      } catch (error) {
        return {
          success: false,
          error: {
            code: 'NETWORK_ERROR',
            message: error instanceof Error ? error.message : '网络请求失败',
          },
        };
      }
    },

    // 获取用户统计
    getStats: async () => {
      return this.get<{
        purchasedResources: number;
        downloadCount: number;
        favoriteCount: number;
        totalSpent: number;
      }>('/users/me/stats');
    },
  };

  // 通知相关API
  notifications = {
    // 获取通知列表
    getList: async (params?: {
      page?: number;
      limit?: number;
      unreadOnly?: boolean;
    }) => {
      return this.get<PaginationResponse<any>>('/notifications', params);
    },

    // 标记通知为已读
    markAsRead: async (notificationId: string) => {
      return this.put(`/notifications/${notificationId}/read`);
    },

    // 标记所有通知为已读
    markAllAsRead: async () => {
      return this.put('/notifications/read-all');
    },

    // 获取未读通知数量
    getUnreadCount: async () => {
      return this.get<{ count: number }>('/notifications/unread-count');
    },
  };

  // 下载相关API
  downloads = {
    // 获取下载历史
    getHistory: async (params?: {
      page?: number;
      limit?: number;
    }) => {
      return this.get<PaginationResponse<any>>('/downloads/history', params);
    },

    // 创建下载任务
    create: async (data: {
      resourceId: string;
      quality?: string;
    }) => {
      return this.post<{
        downloadId: string;
        downloadUrl: string;
        expiresAt: string;
      }>('/downloads', data);
    },

    // 获取下载状态
    getStatus: async (downloadId: string) => {
      return this.get<{
        status: string;
        progress: number;
        downloadUrl?: string;
      }>(`/downloads/${downloadId}`);
    },
  };
}

// 创建全局API客户端实例
export const apiClient = new ApiClient();

// 导出类型
export type { ApiClient };
