/**
 * 数据标准化工具
 * 用于转换后端snake_case字段为前端camelCase字段
 */

import { User } from '@/types';

/**
 * 标准化用户数据
 * 将后端的snake_case字段转换为前端的camelCase字段
 */
export const normalizeUser = (backendUser: any): User => {
  if (!backendUser) return backendUser;

  return {
    ...backendUser,
    // 保持原有字段
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    avatar: backendUser.avatar,
    bio: backendUser.bio,
    website: backendUser.website,
    company: backendUser.company,
    location: backendUser.location,
    verified: backendUser.verified ?? false,
    status: backendUser.status || 'active',
    
    // 转换snake_case为camelCase
    emailVerified: backendUser.email_verified ?? backendUser.emailVerified ?? false,
    emailVerifiedAt: backendUser.email_verified_at ?? backendUser.emailVerifiedAt,
    vipLevel: backendUser.vip_level ?? backendUser.vipLevel ?? 'none',
    vipExpiry: backendUser.vip_expiry ?? backendUser.vipExpiry,
    lastLoginAt: backendUser.last_login_at ?? backendUser.lastLoginAt,
    lastLoginIp: backendUser.last_login_ip ?? backendUser.lastLoginIp,
    loginCount: backendUser.login_count ?? backendUser.loginCount ?? 0,
    createdAt: backendUser.created_at ?? backendUser.createdAt,
    updatedAt: backendUser.updated_at ?? backendUser.updatedAt,
    
    // 保持snake_case字段以兼容后端
    email_verified: backendUser.email_verified,
    email_verified_at: backendUser.email_verified_at,
    vip_level: backendUser.vip_level,
    vip_expiry: backendUser.vip_expiry,
    last_login_at: backendUser.last_login_at,
    last_login_ip: backendUser.last_login_ip,
    login_count: backendUser.login_count,
    created_at: backendUser.created_at,
    updated_at: backendUser.updated_at,
  };
};

/**
 * 标准化资源数据
 */
export const normalizeResource = (backendResource: any) => {
  if (!backendResource) return backendResource;

  return {
    ...backendResource,
    // 转换常见的snake_case字段
    createdAt: backendResource.created_at ?? backendResource.createdAt,
    updatedAt: backendResource.updated_at ?? backendResource.updatedAt,
    downloadCount: backendResource.download_count ?? backendResource.downloadCount ?? 0,
    viewCount: backendResource.view_count ?? backendResource.viewCount ?? 0,
    likeCount: backendResource.like_count ?? backendResource.likeCount ?? 0,
    commentCount: backendResource.comment_count ?? backendResource.commentCount ?? 0,
    fileSize: backendResource.file_size ?? backendResource.fileSize,
    fileName: backendResource.file_name ?? backendResource.fileName,
    fileType: backendResource.file_type ?? backendResource.fileType,
    
    // 保持原有字段
    created_at: backendResource.created_at,
    updated_at: backendResource.updated_at,
    download_count: backendResource.download_count,
    view_count: backendResource.view_count,
    like_count: backendResource.like_count,
    comment_count: backendResource.comment_count,
    file_size: backendResource.file_size,
    file_name: backendResource.file_name,
    file_type: backendResource.file_type,
  };
};

/**
 * 标准化订单数据
 */
export const normalizeOrder = (backendOrder: any) => {
  if (!backendOrder) return backendOrder;

  return {
    ...backendOrder,
    createdAt: backendOrder.created_at ?? backendOrder.createdAt,
    updatedAt: backendOrder.updated_at ?? backendOrder.updatedAt,
    totalAmount: backendOrder.total_amount ?? backendOrder.totalAmount,
    paidAmount: backendOrder.paid_amount ?? backendOrder.paidAmount,
    paymentMethod: backendOrder.payment_method ?? backendOrder.paymentMethod,
    paymentStatus: backendOrder.payment_status ?? backendOrder.paymentStatus,
    orderStatus: backendOrder.order_status ?? backendOrder.orderStatus,
    
    // 保持原有字段
    created_at: backendOrder.created_at,
    updated_at: backendOrder.updated_at,
    total_amount: backendOrder.total_amount,
    paid_amount: backendOrder.paid_amount,
    payment_method: backendOrder.payment_method,
    payment_status: backendOrder.payment_status,
    order_status: backendOrder.order_status,
  };
};

/**
 * 标准化分页数据
 */
export const normalizePagination = (backendPagination: any) => {
  if (!backendPagination) return backendPagination;

  return {
    ...backendPagination,
    pageSize: backendPagination.page_size ?? backendPagination.pageSize ?? backendPagination.per_page,
    totalPages: backendPagination.total_pages ?? backendPagination.totalPages ?? backendPagination.last_page,
    currentPage: backendPagination.current_page ?? backendPagination.currentPage ?? backendPagination.page,
    
    // 保持原有字段
    page_size: backendPagination.page_size,
    total_pages: backendPagination.total_pages,
    current_page: backendPagination.current_page,
    per_page: backendPagination.per_page,
    last_page: backendPagination.last_page,
  };
};

/**
 * 通用字段名转换函数
 * 将snake_case转换为camelCase
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

/**
 * 通用对象字段名转换
 * 递归转换对象中的所有snake_case字段为camelCase
 */
export const normalizeObjectKeys = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(normalizeObjectKeys);
  }
  
  if (typeof obj === 'object') {
    const normalized: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = snakeToCamel(key);
      normalized[camelKey] = normalizeObjectKeys(value);
      
      // 同时保留原始的snake_case字段以兼容
      if (key !== camelKey) {
        normalized[key] = normalizeObjectKeys(value);
      }
    }
    
    return normalized;
  }
  
  return obj;
};

/**
 * 标准化API响应数据
 */
export const normalizeApiResponse = (response: any) => {
  if (!response || !response.data) return response;

  return {
    ...response,
    data: normalizeObjectKeys(response.data),
  };
};
