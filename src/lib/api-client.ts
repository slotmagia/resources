/**
 * API客户端 - 与Golang后端通信
 * 基础URL: http://localhost:8000
 * URL前缀: /api
 */

// 后端响应格式
interface BackendResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp?: number;
  traceID?: string;
}

// 前端统一响应格式
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页响应
interface PaginationResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
  }

  // 设置认证token
  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  // 获取token
  getToken(): string | null {
    if (this.token) return this.token;
    
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  // 通用请求方法
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const backendData: BackendResponse<T> = await response.json();

      // 转换后端响应格式为前端格式
      if (backendData.code === 0) {
        return {
          success: true,
          data: backendData.data,
          message: backendData.message,
        };
      } else {
        return {
          success: false,
          error: backendData.message || '请求失败',
        };
      }
    } catch (error) {
      console.error('API请求错误:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '网络错误',
      };
    }
  }

  // GET请求
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
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

  // ==================== 认证相关 API ====================

  // 用户登录
  async login(credentials: { email: string; password: string }) {
    return this.post('/auth/login', credentials);
  }

  // 用户注册
  async register(userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    return this.post('/auth/register', userData);
  }

  // 刷新token
  async refreshToken(refreshToken: string) {
    return this.post('/auth/refresh', { refresh_token: refreshToken });
  }

  // 用户登出
  async logout() {
    return this.post('/auth/logout');
  }

  // 发送验证邮件
  async sendVerificationEmail() {
    return this.post('/auth/send-verification');
  }

  // 验证邮箱
  async verifyEmail(token: string) {
    return this.post('/auth/verify-email', { token });
  }

  // 发送重置密码邮件
  async sendPasswordResetEmail(email: string) {
    return this.post('/auth/forgot-password', { email });
  }

  // 重置密码
  async resetPassword(token: string, password: string) {
    return this.post('/auth/reset-password', { token, password });
  }

  // ==================== 用户相关 API ====================

  // 获取用户资料
  async getProfile() {
    return this.get('/users/me');
  }

  // 更新用户资料
  async updateProfile(data: any) {
    return this.put('/users/me', data);
  }

  // 上传头像
  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}/users/me/avatar`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const backendData: BackendResponse = await response.json();

      if (backendData.code === 0) {
        return {
          success: true,
          data: backendData.data,
          message: backendData.message,
        };
      } else {
        return {
          success: false,
          error: backendData.message || '上传失败',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '上传失败',
      };
    }
  }

  // 获取用户统计
  async getStats() {
    return this.get('/users/me/stats');
  }

  // 修改密码
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    return this.put('/users/me/password', data);
  }

  // ==================== 资源相关 API ====================

  // 获取资源列表
  async getResources(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    search?: string;
    sort?: string;
    tags?: string[];
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });
    }
    
    const queryString = queryParams.toString();
    return this.get(`/resources${queryString ? `?${queryString}` : ''}`);
  }

  // 获取资源详情
  async getResource(id: string) {
    return this.get(`/resources/${id}`);
  }

  // 搜索资源
  async searchResources(params: {
    q: string;
    page?: number;
    pageSize?: number;
    category?: string;
    sort?: string;
    filters?: Record<string, any>;
  }) {
    return this.post('/search/resources', params);
  }

  // 获取热门资源
  async getTrendingResources(params?: { limit?: number; period?: string }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    return this.get(`/resources/trending${queryString ? `?${queryString}` : ''}`);
  }

  // 获取推荐资源
  async getRecommendedResources(params?: { limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    return this.get(`/resources/recommended${queryString ? `?${queryString}` : ''}`);
  }

  // ==================== 分类相关 API ====================

  // 获取分类列表
  async getCategories() {
    return this.get('/categories');
  }

  // 获取分类详情
  async getCategory(id: string) {
    return this.get(`/categories/${id}`);
  }

  // ==================== 购物车相关 API ====================

  // 获取购物车
  async getCart() {
    return this.get('/cart');
  }

  // 添加到购物车
  async addToCart(resourceId: string, quantity: number = 1) {
    return this.post('/cart/items', { resource_id: resourceId, quantity });
  }

  // 更新购物车项目
  async updateCartItem(itemId: string, quantity: number) {
    return this.put(`/cart/items/${itemId}`, { quantity });
  }

  // 删除购物车项目
  async removeCartItem(itemId: string) {
    return this.delete(`/cart/items/${itemId}`);
  }

  // 清空购物车
  async clearCart() {
    return this.delete('/cart');
  }

  // ==================== 订单相关 API ====================

  // 创建订单
  async createOrder(data: {
    items: Array<{ resource_id: string; quantity: number }>;
    payment_method: string;
  }) {
    return this.post('/orders', data);
  }

  // 获取订单列表
  async getOrders(params?: { page?: number; pageSize?: number; status?: string }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    return this.get(`/orders${queryString ? `?${queryString}` : ''}`);
  }

  // 获取订单详情
  async getOrder(id: string) {
    return this.get(`/orders/${id}`);
  }

  // ==================== 收藏相关 API ====================

  // 获取收藏夹列表
  async getFavoriteFolders() {
    return this.get('/favorites/folders');
  }

  // 创建收藏夹
  async createFavoriteFolder(data: { name: string; description?: string }) {
    return this.post('/favorites/folders', data);
  }

  // 获取收藏夹内容
  async getFavorites(folderId: string, params?: { page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    return this.get(`/favorites/folders/${folderId}/items${queryString ? `?${queryString}` : ''}`);
  }

  // 添加收藏
  async addFavorite(data: { resource_id: string; folder_id: string }) {
    return this.post('/favorites', data);
  }

  // 删除收藏
  async removeFavorite(id: string) {
    return this.delete(`/favorites/${id}`);
  }

  // ==================== 下载相关 API ====================

  // 获取下载历史
  async getDownloadHistory(params?: { page?: number; pageSize?: number }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    return this.get(`/downloads/history${queryString ? `?${queryString}` : ''}`);
  }

  // 下载资源
  async downloadResource(resourceId: string) {
    return this.post(`/downloads/${resourceId}`);
  }

  // ==================== 通知相关 API ====================

  // 获取通知列表
  async getNotifications(params?: { page?: number; pageSize?: number; unread?: boolean }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    return this.get(`/notifications${queryString ? `?${queryString}` : ''}`);
  }

  // 标记通知为已读
  async markNotificationAsRead(id: string) {
    return this.put(`/notifications/${id}/read`);
  }

  // 标记所有通知为已读
  async markAllNotificationsAsRead() {
    return this.put('/notifications/read-all');
  }

  // 删除通知
  async deleteNotification(id: string) {
    return this.delete(`/notifications/${id}`);
  }
}

// 创建全局API客户端实例
export const apiClient = new ApiClient();

// 导出类型
export type { ApiResponse, PaginationResponse, BackendResponse };
