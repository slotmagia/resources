'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  total: number;
  
  // Actions
  addItem: (resource: Omit<CartItem, 'quantity'>) => void;
  removeItem: (resourceId: string) => void;
  updateQuantity: (resourceId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getItemById: (resourceId: string) => CartItem | undefined;
  isInCart: (resourceId: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        total: 0,
        
        addItem: (resource) => {
          const items = get().items;
          const existingItem = items.find(item => item.resourceId === resource.resourceId);
          
          if (existingItem) {
            // 如果物品已存在，增加数量
            get().updateQuantity(resource.resourceId, existingItem.quantity + 1);
          } else {
            // 添加新物品
            const newItems = [...items, { ...resource, quantity: 1 }];
            const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            set({ 
              items: newItems,
              total: newTotal
            });
          }
        },
        
        removeItem: (resourceId) => {
          const newItems = get().items.filter(item => item.resourceId !== resourceId);
          const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          set({ 
            items: newItems,
            total: newTotal
          });
        },
        
        updateQuantity: (resourceId, quantity) => {
          if (quantity <= 0) {
            get().removeItem(resourceId);
            return;
          }
          
          const newItems = get().items.map(item =>
            item.resourceId === resourceId ? { ...item, quantity } : item
          );
          const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          set({ 
            items: newItems,
            total: newTotal
          });
        },
        
        clearCart: () => {
          set({ items: [], total: 0 });
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
      }),
      {
        name: 'cart-store',
      }
    ),
    {
      name: 'cart-store'
    }
  )
);
