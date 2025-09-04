'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, checkAuth } = useAuthStore();

  useEffect(() => {
    // 应用启动时初始化认证状态
    initialize();
    checkAuth();
  }, [initialize, checkAuth]);

  return <>{children}</>;
}
