'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { useAuthStore } from '@/stores';
import { apiClient } from '@/lib/api-client';
import { debugAuthState, generateDebugReport, clearAuthState } from '@/lib/auth-debug';
import { Button, Input, Card } from '@/components/ui';

export default function TestLoginPage() {
  const { 
    user, 
    isAuthenticated, 
    loading, 
    error, 
    login, 
    logout, 
    checkAuth,
    initialize 
  } = useAuthStore();

  const [email, setEmail] = useState('zhangsan@example.com');
  const [password, setPassword] = useState('123456');
  const [directApiResult, setDirectApiResult] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    // 初始化认证状态
    initialize();
    checkAuth();
    
    // 生成调试信息
    generateDebugReport().then(setDebugInfo);
  }, [initialize, checkAuth]);

  // 直接调用API测试
  const handleDirectApiLogin = async () => {
    try {
      const response = await apiClient.login({ email, password });
      setDirectApiResult(response);
      
      if (response.success && response.data?.token) {
        apiClient.setToken(response.data.token);
        console.log('✅ 直接API登录成功，token已设置');
      }
    } catch (error) {
      console.error('❌ 直接API登录失败:', error);
      setDirectApiResult({ success: false, error: String(error) });
    }
  };

  // 通过Store登录测试
  const handleStoreLogin = async () => {
    await login({ email, password });
  };

  // 调试认证状态
  const handleDebugAuth = () => {
    const result = debugAuthState();
    setDebugInfo(result);
  };

  // 清理状态
  const handleClearAuth = () => {
    clearAuthState();
    logout();
    setDirectApiResult(null);
    setDebugInfo(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">登录测试页面</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 登录测试 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">登录测试</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="请输入邮箱"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    密码
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={handleDirectApiLogin}
                    variant="outline"
                    disabled={loading}
                  >
                    直接API登录
                  </Button>
                  
                  <Button
                    onClick={handleStoreLogin}
                    disabled={loading}
                  >
                    Store登录
                  </Button>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={logout}
                    variant="outline"
                    disabled={loading}
                  >
                    登出
                  </Button>
                  
                  <Button
                    onClick={handleDebugAuth}
                    variant="outline"
                  >
                    调试状态
                  </Button>
                  
                  <Button
                    onClick={handleClearAuth}
                    variant="outline"
                    className="text-red-600"
                  >
                    清理状态
                  </Button>
                </div>
              </div>
            </Card>

            {/* 当前状态 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">当前状态</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">认证状态:</span>
                  <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                    {isAuthenticated ? '已认证' : '未认证'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">加载状态:</span>
                  <span className={loading ? 'text-yellow-600' : 'text-gray-900'}>
                    {loading ? '加载中' : '空闲'}
                  </span>
                </div>
                
                {error && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">错误:</span>
                    <span className="text-red-600">{error}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">用户ID:</span>
                  <span className="text-gray-900">{user?.id || '无'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">用户名:</span>
                  <span className="text-gray-900">{user?.name || '无'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">邮箱:</span>
                  <span className="text-gray-900">{user?.email || '无'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">VIP等级:</span>
                  <span className="text-gray-900">{user?.vipLevel || '无'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Store Token:</span>
                  <span className="text-gray-900 font-mono text-xs">
                    {useAuthStore.getState().token ? 
                      `${useAuthStore.getState().token?.substring(0, 20)}...` : 
                      '无'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">API Client Token:</span>
                  <span className="text-gray-900 font-mono text-xs">
                    {apiClient.getToken() ? 
                      `${apiClient.getToken()?.substring(0, 20)}...` : 
                      '无'
                    }
                  </span>
                </div>
              </div>
            </Card>

            {/* 直接API结果 */}
            {directApiResult && (
              <Card className="p-6 lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">直接API调用结果</h2>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(directApiResult, null, 2)}
                </pre>
              </Card>
            )}

            {/* 调试信息 */}
            {debugInfo && (
              <Card className="p-6 lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">调试信息</h2>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
