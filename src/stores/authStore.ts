'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterData } from '@/types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// 模拟API调用
const mockApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
    
    if (credentials.email === 'user@example.com' && credentials.password === 'password') {
      return {
        user: {
          id: '1',
          name: '用户名',
          email: credentials.email,
          avatar: 'https://via.placeholder.com/40',
          vipLevel: 'basic',
          vipExpiry: '2024-12-31',
          createdAt: '2024-01-01',
          verified: true,
        },
        token: 'mock-jwt-token'
      };
    }
    throw new Error('邮箱或密码错误');
  },
  
  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      user: {
        id: '2',
        name: data.name,
        email: data.email,
        vipLevel: 'none',
        createdAt: new Date().toISOString(),
        verified: false,
      },
      token: 'mock-jwt-token'
    };
  }
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        
        login: async (credentials) => {
          set({ loading: true, error: null });
          try {
            const { user, token } = await mockApi.login(credentials);
            
            // 存储token到localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('token', token);
            }
            
            set({ 
              user, 
              isAuthenticated: true, 
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : '登录失败', 
              loading: false 
            });
          }
        },
        
        register: async (data) => {
          set({ loading: true, error: null });
          try {
            const { user, token } = await mockApi.register(data);
            
            if (typeof window !== 'undefined') {
              localStorage.setItem('token', token);
            }
            
            set({ 
              user, 
              isAuthenticated: true, 
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : '注册失败', 
              loading: false 
            });
          }
        },
        
        logout: () => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
          }
          set({ 
            user: null, 
            isAuthenticated: false, 
            error: null 
          });
        },
        
        clearError: () => set({ error: null }),
        
        updateUser: (userData) => {
          const currentUser = get().user;
          if (currentUser) {
            set({ 
              user: { ...currentUser, ...userData } 
            });
          }
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({ 
          user: state.user, 
          isAuthenticated: state.isAuthenticated 
        }),
      }
    ),
    {
      name: 'auth-store'
    }
  )
);
