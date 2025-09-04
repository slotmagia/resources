'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores';
import { apiClient } from '@/lib/api-client';
import { debugAuthState } from '@/lib/auth-debug';

export default function TestLoginPage() {
  const { user, isAuthenticated, loading, error, login, logout, token, initialize } = useAuthStore();
  const [testResult, setTestResult] = useState<string>('');

  // 页面加载时初始化
  useEffect(() => {
    initialize();
    debugAuthState();
  }, [initialize]);

  const testDirectLogin = async () => {
    setTestResult('开始测试直接API调用...');
    
    try {
      const response = await apiClient.auth.login({
        email: 'zhangsan@example.com',
        password: 'password123',
      });
      
      setTestResult(`API响应: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setTestResult(`API错误: ${error}`);
    }
  };

  const testStoreLogin = async () => {
    setTestResult('开始测试Store登录...');
    
    try {
      await login({
        email: 'zhangsan@example.com',
        password: 'password123',
      });
      
      setTestResult('Store登录成功!');
    } catch (error) {
      setTestResult(`Store登录错误: ${error}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setTestResult('登出成功');
    } catch (error) {
      setTestResult(`登出错误: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">登录测试页面</h1>
        
        {/* 当前状态 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">当前认证状态</h2>
          <div className="space-y-2">
            <p><strong>已认证:</strong> {isAuthenticated ? '是' : '否'}</p>
            <p><strong>加载中:</strong> {loading ? '是' : '否'}</p>
            <p><strong>错误:</strong> {error || '无'}</p>
            <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : '无'}</p>
            <p><strong>API客户端Token:</strong> {(apiClient as any).token ? `${(apiClient as any).token.substring(0, 20)}...` : '无'}</p>
            {user && (
              <div>
                <p><strong>用户信息:</strong></p>
                <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* 测试按钮 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">测试操作</h2>
          <div className="space-x-4">
            <button
              onClick={testDirectLogin}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              测试直接API调用
            </button>
            
            <button
              onClick={testStoreLogin}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              测试Store登录
            </button>
            
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                登出
              </button>
            )}
            
            <button
              onClick={debugAuthState}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              调试认证状态
            </button>
          </div>
        </div>

        {/* 测试结果 */}
        {testResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">测试结果</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto whitespace-pre-wrap">
              {testResult}
            </pre>
          </div>
        )}

        {/* API配置信息 */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">API配置</h2>
          <div className="space-y-2 text-sm">
            <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}</p>
            <p><strong>完整登录URL:</strong> {(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000') + '/api/auth/login'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
