/**
 * 认证调试工具
 * 用于调试用户认证状态和API客户端状态
 */

import { apiClient } from './api-client';

/**
 * 调试认证状态
 */
export const debugAuthState = () => {
  console.group('🔍 认证状态调试');
  
  // 检查localStorage中的token
  const localToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  console.log('📱 localStorage token:', localToken ? `${localToken.substring(0, 20)}...` : 'null');
  
  // 检查API客户端的token
  const clientToken = apiClient.getToken();
  console.log('🌐 API客户端 token:', clientToken ? `${clientToken.substring(0, 20)}...` : 'null');
  
  // 检查token是否一致
  const tokensMatch = localToken === clientToken;
  console.log('✅ Token同步状态:', tokensMatch ? '一致' : '不一致');
  
  if (!tokensMatch) {
    console.warn('⚠️ 警告: localStorage和API客户端的token不一致!');
    console.log('   localStorage:', localToken);
    console.log('   API客户端:', clientToken);
  }
  
  console.groupEnd();
  
  return {
    localToken,
    clientToken,
    tokensMatch,
  };
};

/**
 * 测试API连接
 */
export const testApiConnection = async () => {
  console.group('🔗 API连接测试');
  
  try {
    // 测试基础连接
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'}/health`, {
      method: 'GET',
    });
    
    if (response.ok) {
      console.log('✅ API服务器连接正常');
      const data = await response.json();
      console.log('📊 服务器响应:', data);
    } else {
      console.error('❌ API服务器连接失败:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ API连接错误:', error);
  }
  
  console.groupEnd();
};

/**
 * 测试认证API
 */
export const testAuthApi = async () => {
  console.group('🔐 认证API测试');
  
  try {
    const response = await apiClient.getProfile();
    
    if (response.success) {
      console.log('✅ 认证API调用成功');
      console.log('👤 用户信息:', response.data);
    } else {
      console.error('❌ 认证API调用失败:', response.error);
    }
  } catch (error) {
    console.error('❌ 认证API错误:', error);
  }
  
  console.groupEnd();
};

/**
 * 清理认证状态
 */
export const clearAuthState = () => {
  console.log('🧹 清理认证状态...');
  
  // 清理localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  }
  
  // 清理API客户端token
  apiClient.setToken(null);
  
  console.log('✅ 认证状态已清理');
};

/**
 * 完整的调试报告
 */
export const generateDebugReport = async () => {
  console.group('📋 完整调试报告');
  
  // 基础信息
  console.log('🌍 环境信息:');
  console.log('  - NODE_ENV:', process.env.NODE_ENV);
  console.log('  - API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
  console.log('  - 浏览器:', typeof window !== 'undefined' ? 'Client' : 'Server');
  
  // 认证状态
  const authState = debugAuthState();
  
  // API连接测试
  await testApiConnection();
  
  // 认证API测试
  if (authState.clientToken) {
    await testAuthApi();
  } else {
    console.log('⏭️ 跳过认证API测试 (无token)');
  }
  
  console.groupEnd();
  
  return authState;
};

/**
 * 监控认证状态变化
 */
export const watchAuthState = () => {
  if (typeof window === 'undefined') return;
  
  let lastToken = apiClient.getToken();
  
  const checkAuthState = () => {
    const currentToken = apiClient.getToken();
    
    if (currentToken !== lastToken) {
      console.log('🔄 认证状态变化检测到:');
      console.log('  - 之前:', lastToken ? `${lastToken.substring(0, 20)}...` : 'null');
      console.log('  - 现在:', currentToken ? `${currentToken.substring(0, 20)}...` : 'null');
      
      lastToken = currentToken;
      
      // 触发调试报告
      debugAuthState();
    }
  };
  
  // 每5秒检查一次
  const interval = setInterval(checkAuthState, 5000);
  
  console.log('👀 开始监控认证状态变化...');
  
  return () => {
    clearInterval(interval);
    console.log('🛑 停止监控认证状态变化');
  };
};

// 在开发环境下暴露调试函数到全局
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).debugAuth = {
    debugAuthState,
    testApiConnection,
    testAuthApi,
    clearAuthState,
    generateDebugReport,
    watchAuthState,
  };
  
  console.log('🛠️ 认证调试工具已加载，使用 window.debugAuth 访问');
}
