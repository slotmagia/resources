/**
 * API测试脚本
 * 用于测试前后端集成
 */

import { apiClient } from './api-client';

export async function testApiConnection() {
  console.log('🔄 开始测试API连接...');
  
  try {
    // 测试分类接口
    console.log('📂 测试分类接口...');
    const categoriesResponse = await apiClient.categories.getList();
    console.log('分类接口响应:', categoriesResponse);
    
    // 测试资源列表接口
    console.log('📋 测试资源列表接口...');
    const resourcesResponse = await apiClient.resources.getList({
      page: 1,
      limit: 5,
    });
    console.log('资源列表接口响应:', resourcesResponse);
    
    // 测试搜索接口
    console.log('🔍 测试搜索接口...');
    const searchResponse = await apiClient.resources.search({
      q: 'React',
      page: 1,
      limit: 5,
    });
    console.log('搜索接口响应:', searchResponse);
    
    // 测试热门资源接口
    console.log('🔥 测试热门资源接口...');
    const trendingResponse = await apiClient.resources.getTrending({
      period: 'week',
      limit: 5,
    });
    console.log('热门资源接口响应:', trendingResponse);
    
    console.log('✅ API连接测试完成');
    return true;
  } catch (error) {
    console.error('❌ API连接测试失败:', error);
    return false;
  }
}

export async function testAuthFlow() {
  console.log('🔄 开始测试认证流程...');
  
  try {
    // 测试登录接口
    console.log('🔐 测试登录接口...');
    const loginResponse = await apiClient.auth.login({
      email: 'test@example.com',
      password: 'password123',
    });
    console.log('登录接口响应:', loginResponse);
    
    if (loginResponse.success) {
      // 测试获取用户信息
      console.log('👤 测试用户信息接口...');
      const profileResponse = await apiClient.users.getProfile();
      console.log('用户信息接口响应:', profileResponse);
      
      // 测试登出
      console.log('🚪 测试登出接口...');
      const logoutResponse = await apiClient.auth.logout();
      console.log('登出接口响应:', logoutResponse);
    }
    
    console.log('✅ 认证流程测试完成');
    return true;
  } catch (error) {
    console.error('❌ 认证流程测试失败:', error);
    return false;
  }
}

// 在浏览器控制台中可以调用的测试函数
if (typeof window !== 'undefined') {
  (window as any).testApi = {
    connection: testApiConnection,
    auth: testAuthFlow,
  };
}
