/**
 * 认证调试工具
 */

import { apiClient } from './api-client';

export function debugAuthState() {
  if (typeof window === 'undefined') return;

  console.group('🔍 认证状态调试');
  
  // 检查localStorage中的认证数据
  const authStorage = localStorage.getItem('auth-store');
  console.log('📦 localStorage auth-store:', authStorage ? JSON.parse(authStorage) : null);
  
  // 检查API客户端token
  console.log('🔑 API客户端token:', (apiClient as any).token);
  
  // 检查localStorage中的token
  const localToken = localStorage.getItem('token');
  console.log('💾 localStorage token:', localToken);
  
  console.groupEnd();
}

// 在浏览器控制台中可以调用
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuthState;
}
