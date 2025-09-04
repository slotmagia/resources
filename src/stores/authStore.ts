'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterData } from '@/types';
import { apiClient } from '@/lib/api-client';
import { normalizeUser } from '@/lib/data-normalizer';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
  
  // Actions
  login: (credentials: LoginCredentials & { rememberMe?: boolean }) => Promise<void>;
  register: (data: RegisterData & { confirmPassword: string; agreeTerms: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshToken: (refreshToken: string) => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        token: null,
        
        login: async (credentials) => {
          set({ loading: true, error: null });
          try {
            const response = await apiClient.auth.login(credentials);
            
            if (response.success && response.data) {
              const { user, token } = response.data;
              
              // 同步token到API客户端
              apiClient.setToken(token);
              
              set({ 
                user: normalizeUser(user), 
                token,
                isAuthenticated: true, 
                loading: false 
              });
            } else {
              throw new Error(response.error?.message || '登录失败');
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : '登录失败', 
              loading: false 
            });
            throw error;
          }
        },
        
        register: async (data) => {
          set({ loading: true, error: null });
          try {
            const response = await apiClient.auth.register(data);
            
            if (response.success && response.data) {
              const { user, token } = response.data;
              
              // 同步token到API客户端
              apiClient.setToken(token);
              
              set({ 
                user: normalizeUser(user), 
                token,
                isAuthenticated: true, 
                loading: false 
              });
            } else {
              throw new Error(response.error?.message || '注册失败');
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : '注册失败', 
              loading: false 
            });
            throw error;
          }
        },
        
        logout: async () => {
          const { token } = get();
          try {
            if (token) {
              await apiClient.auth.logout();
            }
          } catch (error) {
            console.error('Logout error:', error);
          } finally {
            // 清除API客户端的token
            apiClient.setToken(null);
            
            set({ 
              user: null, 
              token: null,
              isAuthenticated: false, 
              error: null 
            });
          }
        },
        
        clearError: () => set({ error: null }),
        
        updateUser: async (userData) => {
          const currentUser = get().user;
          if (!currentUser) return;

          set({ loading: true, error: null });
          try {
            const response = await apiClient.users.updateProfile(userData);
            
            if (response.success && response.data) {
              set({ 
                user: { ...currentUser, ...response.data },
                loading: false
              });
            } else {
              throw new Error(response.error?.message || '更新失败');
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : '更新失败', 
              loading: false 
            });
            throw error;
          }
        },

        checkAuth: async () => {
          const { token } = get();
          if (!token) {
            // 如果没有token，确保API客户端也清除token
            apiClient.setToken(null);
            return;
          }

          // 同步token到API客户端
          apiClient.setToken(token);

          set({ loading: true });
          try {
            const response = await apiClient.users.getProfile();

            if (response.success && response.data) {
              set({
                user: normalizeUser(response.data),
                isAuthenticated: true,
                loading: false,
              });
            } else {
              // 用户信息获取失败，清除认证状态
              apiClient.setToken(null);
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
              });
            }
          } catch (error) {
            console.error('Auth check error:', error);
            apiClient.setToken(null);
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              loading: false,
            });
          }
        },

        refreshToken: async (refreshToken: string) => {
          try {
            const response = await apiClient.auth.refresh(refreshToken);

            if (response.success && response.data) {
              const { token } = response.data;
              // 同步token到API客户端
              apiClient.setToken(token);
              set({ token });
            } else {
              // Token刷新失败，清除认证状态
              apiClient.setToken(null);
              set({
                user: null,
                token: null,
                isAuthenticated: false,
              });
            }
          } catch (error) {
            console.error('Token refresh error:', error);
            apiClient.setToken(null);
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
          }
        },

        // 初始化时同步token到API客户端
        initialize: () => {
          const { token } = get();
          if (token) {
            apiClient.setToken(token);
          }
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({ 
          user: state.user, 
          token: state.token,
          isAuthenticated: state.isAuthenticated 
        }),
      }
    ),
    {
      name: 'auth-store'
    }
  )
);