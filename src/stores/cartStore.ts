'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { CartItem } from '@/types';
import { apiClient } from '@/lib/api-client';

interface CartStore {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCart: () => Promise<void>;
  addItem: (resource: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncWithServer: () => Promise<void>;
  
  // Local helpers
  getItemCount: () => number;
  getItemById: (resourceId: string) => CartItem | undefined;
  isInCart: (resourceId: string) => boolean;
  clearError: () => void;
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        total: 0,
        itemCount: 0,
        loading: false,
        error: null,

        fetchCart: async () => {
          set({ loading: true, error: null });
          
          try {
            const response = await apiClient.cart.get();
            
            if (response.success && response.data) {
              set({
                items: response.data.items,
                total: response.data.total,
                itemCount: response.data.itemCount,
                loading: false,
              });
            } else {
              throw new Error(response.error?.message || '获取购物车失败');
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : '获取购物车失败', 
              loading: false 
            });
          }
        },
        
        addItem: async (resource) => {
          set({ loading: true, error: null });
          
          try {
            const response = await apiClient.cart.addItem({
              resourceId: resource.resourceId,
              quantity: 1,
            });
            
            if (response.success) {
              // 重新获取购物车数据
              await get().fetchCart();
            } else {
              throw new Error(response.error?.message || '添加到购物车失败');
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : '添加到购物车失败', 
              loading: false 
            });
            
            // 如果API调用失败，回退到本地操作
            const items = get().items;
            const existingItem = items.find(item => item.resourceId === resource.resourceId);
            
            if (existingItem) {
              get().updateQuantity(existingItem.resourceId, existingItem.quantity + 1);
            } else {
              const newItems = [...items, { ...resource, quantity: 1 }];
              const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
              const newItemCount = newItems.reduce((count, item) => count + item.quantity, 0);
              
              set({ 
                items: newItems,
                total: newTotal,
                itemCount: newItemCount,
                loading: false,
              });
            }
          }
        },
        
        removeItem: async (itemId) => {
          set({ loading: true, error: null });
          
          try {
            const response = await apiClient.cart.removeItem(itemId);
            
            if (response.success) {
              await get().fetchCart();
            } else {
              throw new Error(response.error?.message || '删除商品失败');
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : '删除商品失败', 
              loading: false 
            });
            
            // 如果API调用失败，回退到本地操作
            const newItems = get().items.filter(item => item.resourceId !== itemId);
            const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const newItemCount = newItems.reduce((count, item) => count + item.quantity, 0);
            
            set({ 
              items: newItems,
              total: newTotal,
              itemCount: newItemCount,
              loading: false,
            });
          }
        },
        
        updateQuantity: async (itemId, quantity) => {
          if (quantity <= 0) {
            await get().removeItem(itemId);
            return;
          }

          set({ loading: true, error: null });
          
          try {
            const response = await apiClient.cart.updateItem(itemId, { quantity });
            
            if (response.success) {
              await get().fetchCart();
            } else {
              throw new Error(response.error?.message || '更新数量失败');
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : '更新数量失败', 
              loading: false 
            });
            
            // 如果API调用失败，回退到本地操作
            const newItems = get().items.map(item =>
              item.resourceId === itemId ? { ...item, quantity } : item
            );
            const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const newItemCount = newItems.reduce((count, item) => count + item.quantity, 0);
            
            set({ 
              items: newItems,
              total: newTotal,
              itemCount: newItemCount,
              loading: false,
            });
          }
        },
        
        clearCart: async () => {
          set({ loading: true, error: null });
          
          try {
            const response = await apiClient.cart.clear();
            
            if (response.success) {
              set({ 
                items: [], 
                total: 0, 
                itemCount: 0,
                loading: false,
              });
            } else {
              throw new Error(response.error?.message || '清空购物车失败');
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : '清空购物车失败', 
              loading: false 
            });
            
            // 如果API调用失败，回退到本地操作
            set({ 
              items: [], 
              total: 0, 
              itemCount: 0,
              loading: false,
            });
          }
        },

        syncWithServer: async () => {
          // 同步本地购物车到服务器
          await get().fetchCart();
        },
        
        getItemCount: () => {
          return get().items.reduce((count, item) => count + item.quantity, 0);
        },
        
        getItemById: (resourceId) => {
          return get().items.find(item => item.resourceId === resourceId);
        },
        
        isInCart: (resourceId) => {
          return get().items.some(item => item.resourceId === resourceId);
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: 'cart-store',
        partialize: (state) => ({
          items: state.items,
          total: state.total,
          itemCount: state.itemCount,
        }),
      }
    ),
    {
      name: 'cart-store'
    }
  )
);