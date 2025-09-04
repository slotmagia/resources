'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * 认证提供者组件
 * 负责在应用启动时初始化认证状态
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { initialize, checkAuth } = useAuthStore();

  useEffect(() => {
    // 初始化认证状态
    initialize();
    
    // 检查认证状态
    checkAuth();
  }, [initialize, checkAuth]);

  return <>{children}</>;
};
