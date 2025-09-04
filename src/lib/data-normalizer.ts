/**
 * 数据格式化工具
 * 用于转换后端数据格式为前端兼容格式
 */

import type { User } from '@/types';

/**
 * 标准化用户数据
 * 将后端的snake_case字段转换为前端兼容的camelCase字段
 */
export function normalizeUser(backendUser: any): User {
  return {
    ...backendUser,
    // 保持原有字段
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    email_verified: backendUser.email_verified,
    email_verified_at: backendUser.email_verified_at,
    avatar: backendUser.avatar,
    bio: backendUser.bio,
    website: backendUser.website,
    company: backendUser.company,
    location: backendUser.location,
    vip_level: backendUser.vip_level,
    vip_expiry: backendUser.vip_expiry,
    verified: backendUser.verified,
    status: backendUser.status,
    last_login_at: backendUser.last_login_at,
    last_login_ip: backendUser.last_login_ip,
    login_count: backendUser.login_count,
    created_at: backendUser.created_at,
    updated_at: backendUser.updated_at,
    
    // 添加前端兼容字段
    vipLevel: backendUser.vip_level,
    vipExpiry: backendUser.vip_expiry,
    createdAt: backendUser.created_at,
    updatedAt: backendUser.updated_at,
    lastLoginAt: backendUser.last_login_at,
  };
}

/**
 * 标准化资源数据
 */
export function normalizeResource(backendResource: any) {
  return {
    ...backendResource,
    // 添加前端兼容字段
    createdAt: backendResource.created_at,
    updatedAt: backendResource.updated_at,
  };
}

/**
 * 标准化分页数据
 */
export function normalizePagination(backendPagination: any) {
  return {
    page: backendPagination.page || backendPagination.current_page,
    limit: backendPagination.limit || backendPagination.per_page,
    total: backendPagination.total,
    totalPages: backendPagination.total_pages || Math.ceil(backendPagination.total / (backendPagination.limit || backendPagination.per_page)),
    hasMore: backendPagination.has_more || (backendPagination.page < backendPagination.total_pages),
  };
}

/**
 * 标准化时间戳
 * 将后端的时间戳转换为ISO字符串
 */
export function normalizeTimestamp(timestamp: number | string): string {
  if (typeof timestamp === 'number') {
    return new Date(timestamp * 1000).toISOString();
  }
  return timestamp;
}
