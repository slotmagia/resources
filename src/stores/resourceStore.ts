'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Resource, ResourceDetail, ResourceFilters, PaginationInfo, SearchResult, TrendingResource, RecommendationGroup, Category } from '@/types';
import { apiClient } from '@/lib/api-client';

interface ResourceStore {
  resources: Resource[];
  searchResults: SearchResult[];
  trendingResources: TrendingResource[];
  recommendations: RecommendationGroup[];
  categories: Category[];
  currentResource: ResourceDetail | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: ResourceFilters;
  pagination: PaginationInfo;
  
  // Actions
  fetchResources: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    tags?: string;
    priceMin?: number;
    priceMax?: number;
    rating?: number;
    sortBy?: string;
    sortOrder?: string;
    featured?: boolean;
  }) => Promise<void>;
  fetchResourceDetail: (resourceId: string) => Promise<void>;
  searchResources: (query: string, params?: any) => Promise<void>;
  fetchTrending: (params?: { period?: string; limit?: number; category?: string }) => Promise<void>;
  fetchRecommendations: (params?: { limit?: number; type?: string }) => Promise<void>;
  fetchCategories: () => Promise<void>;
  setFilters: (filters: Partial<ResourceFilters>) => void;
  loadMore: () => Promise<void>;
  clearResources: () => void;
  resetPagination: () => void;
  clearError: () => void;
}

export const useResourceStore = create<ResourceStore>()(
  devtools((set, get) => ({
    resources: [],
    searchResults: [],
    trendingResources: [],
    recommendations: [],
    categories: [],
    currentResource: null,
    loading: false,
    error: null,
    searchQuery: '',
    filters: {},
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      hasMore: true,
    },
    
    fetchResources: async (params) => {
      const { pagination, filters } = get();
      set({ loading: true, error: null });
      
      try {
        const response = await apiClient.resources.getList({
          page: params?.page || pagination.page,
          limit: params?.limit || pagination.limit,
          ...params,
          ...filters,
        });
        
        if (response.success && response.data) {
          const { items, pagination: paginationData } = response.data;
          
          set({
            resources: params?.page === 1 || pagination.page === 1 
              ? items 
              : [...get().resources, ...items],
            pagination: {
              page: paginationData.page,
              limit: paginationData.limit,
              total: paginationData.total,
              hasMore: paginationData.hasMore,
            },
            loading: false,
          });
        } else {
          throw new Error(response.error?.message || '获取资源失败');
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : '获取资源失败', 
          loading: false 
        });
      }
    },

    fetchResourceDetail: async (resourceId: string) => {
      set({ loading: true, error: null });
      
      try {
        const response = await apiClient.resources.getDetail(resourceId);
        
        if (response.success && response.data) {
          set({
            currentResource: response.data,
            loading: false,
          });
        } else {
          throw new Error(response.error?.message || '获取资源详情失败');
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : '获取资源详情失败', 
          loading: false 
        });
      }
    },
    
    searchResources: async (query, params) => {
      set({ 
        searchQuery: query, 
        loading: true, 
        error: null,
        pagination: { ...get().pagination, page: 1 }
      });
      
      try {
        const response = await apiClient.resources.search({
          q: query,
          page: 1,
          limit: get().pagination.limit,
          ...params,
        });
        
        if (response.success && response.data) {
          const { items, pagination } = response.data;
          
          set({
            searchResults: items,
            pagination: {
              page: pagination.page,
              limit: pagination.limit,
              total: pagination.total,
              hasMore: pagination.hasMore,
            },
            loading: false,
          });
        } else {
          throw new Error(response.error?.message || '搜索失败');
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : '搜索失败', 
          loading: false 
        });
      }
    },

    fetchTrending: async (params) => {
      set({ loading: true, error: null });
      
      try {
        const response = await apiClient.resources.getTrending(params);
        
        if (response.success && response.data) {
          set({
            trendingResources: response.data.items,
            loading: false,
          });
        } else {
          throw new Error(response.error?.message || '获取热门资源失败');
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : '获取热门资源失败', 
          loading: false 
        });
      }
    },

    fetchRecommendations: async (params) => {
      set({ loading: true, error: null });
      
      try {
        const response = await apiClient.resources.getRecommendations(params);
        
        if (response.success && response.data) {
          set({
            recommendations: response.data.recommendations,
            loading: false,
          });
        } else {
          throw new Error(response.error?.message || '获取推荐资源失败');
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : '获取推荐资源失败', 
          loading: false 
        });
      }
    },

    fetchCategories: async () => {
      set({ loading: true, error: null });
      
      try {
        const response = await apiClient.categories.getList();
        
        if (response.success && response.data) {
          set({
            categories: response.data,
            loading: false,
          });
        } else {
          throw new Error(response.error?.message || '获取分类失败');
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : '获取分类失败', 
          loading: false 
        });
      }
    },
    
    setFilters: (newFilters) => {
      set({ 
        filters: { ...get().filters, ...newFilters },
        pagination: { ...get().pagination, page: 1 },
        resources: [] // 清空当前资源
      });
    },
    
    loadMore: async () => {
      const { pagination } = get();
      if (!pagination.hasMore || get().loading) return;
      
      set({ 
        pagination: { ...pagination, page: pagination.page + 1 } 
      });
      await get().fetchResources({ page: pagination.page + 1 });
    },
    
    clearResources: () => {
      set({ 
        resources: [], 
        searchResults: [],
        searchQuery: '',
        filters: {},
        pagination: { page: 1, limit: 20, total: 0, hasMore: true } 
      });
    },
    
    resetPagination: () => {
      set({
        pagination: { page: 1, limit: 20, total: 0, hasMore: true },
        resources: []
      });
    },

    clearError: () => set({ error: null }),
  }))
);