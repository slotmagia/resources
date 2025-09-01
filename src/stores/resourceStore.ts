'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Resource, ResourceFilters, PaginationInfo } from '@/types';

interface ResourceStore {
  resources: Resource[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: ResourceFilters;
  pagination: PaginationInfo;
  
  // Actions
  fetchResources: () => Promise<void>;
  searchResources: (query: string) => Promise<void>;
  setFilters: (filters: Partial<ResourceFilters>) => void;
  loadMore: () => Promise<void>;
  clearResources: () => void;
  resetPagination: () => void;
}

// 模拟资源数据
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'React 完整教程视频',
    description: '从零开始学习React，包含Hooks、Context、Redux等高级特性',
    type: 'video',
    category: '前端开发',
    thumbnail: 'https://picsum.photos/400/300?random=1',
    price: 99.00,
    originalPrice: 199.00,
    downloadUrl: '/downloads/react-tutorial.zip',
    author: {
      id: 'author1',
      name: '张老师',
      avatar: 'https://picsum.photos/40/40?random=10',
      verified: true,
    },
    stats: {
      downloads: 1234,
      views: 5678,
      rating: 4.8,
      reviewCount: 156,
    },
    tags: ['React', 'JavaScript', '前端', '教程'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
  },
  {
    id: '2',
    title: 'Photoshop 2024 最新版',
    description: '专业图像处理软件，支持AI功能，包含完整破解教程',
    type: 'software',
    category: '图像处理',
    thumbnail: 'https://picsum.photos/400/300?random=2',
    price: 0,
    downloadUrl: '/downloads/photoshop-2024.exe',
    author: {
      id: 'author2',
      name: '软件分享者',
      avatar: 'https://picsum.photos/40/40?random=11',
    },
    stats: {
      downloads: 8901,
      views: 12345,
      rating: 4.6,
      reviewCount: 234,
    },
    tags: ['Photoshop', '图像处理', '设计', '软件'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
  },
  {
    id: '3',
    title: 'JavaScript高级编程指南',
    description: '深入理解JavaScript的核心概念，包含ES6+新特性详解',
    type: 'document',
    category: '编程教程',
    thumbnail: 'https://picsum.photos/400/300?random=3',
    price: 29.99,
    downloadUrl: '/downloads/js-advanced-guide.pdf',
    author: {
      id: 'author3',
      name: '技术作者',
      avatar: 'https://picsum.photos/40/40?random=12',
      verified: true,
    },
    stats: {
      downloads: 567,
      views: 2345,
      rating: 4.9,
      reviewCount: 89,
    },
    tags: ['JavaScript', 'ES6', '编程', '文档'],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-16',
  },
  {
    id: '4',
    title: '如何成为优秀的全栈开发者',
    description: '分享从前端到后端的完整学习路径和实战经验',
    type: 'article',
    category: '职业发展',
    thumbnail: 'https://picsum.photos/400/300?random=4',
    price: 0,
    downloadUrl: '/articles/fullstack-developer-guide',
    author: {
      id: 'author4',
      name: '资深开发者',
      avatar: 'https://picsum.photos/40/40?random=13',
      verified: true,
    },
    stats: {
      downloads: 2345,
      views: 8901,
      rating: 4.7,
      reviewCount: 123,
    },
    tags: ['全栈', '开发', '职业', '经验'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-14',
  },
];

// 模拟API
const mockApi = {
  getResources: async (params: {
    page: number;
    limit: number;
    query?: string;
    filters?: ResourceFilters;
  }): Promise<{
    resources: Resource[];
    total: number;
    hasMore: boolean;
  }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredResources = [...mockResources];
    
    // 应用搜索查询
    if (params.query) {
      filteredResources = filteredResources.filter(resource =>
        resource.title.toLowerCase().includes(params.query!.toLowerCase()) ||
        resource.description.toLowerCase().includes(params.query!.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(params.query!.toLowerCase()))
      );
    }
    
    // 应用筛选器
    if (params.filters) {
      const { category, type, priceRange, rating } = params.filters;
      
      if (category) {
        filteredResources = filteredResources.filter(r => r.category === category);
      }
      
      if (type && type.length > 0) {
        filteredResources = filteredResources.filter(r => type.includes(r.type));
      }
      
      if (priceRange) {
        filteredResources = filteredResources.filter(r => 
          r.price >= priceRange[0] && r.price <= priceRange[1]
        );
      }
      
      if (rating) {
        filteredResources = filteredResources.filter(r => r.stats.rating >= rating);
      }
    }
    
    // 应用排序
    if (params.filters?.sortBy) {
      switch (params.filters.sortBy) {
        case 'latest':
          filteredResources.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'popular':
          filteredResources.sort((a, b) => b.stats.downloads - a.stats.downloads);
          break;
        case 'price':
          filteredResources.sort((a, b) => a.price - b.price);
          break;
        case 'rating':
          filteredResources.sort((a, b) => b.stats.rating - a.stats.rating);
          break;
      }
    }
    
    const total = filteredResources.length;
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedResources = filteredResources.slice(startIndex, endIndex);
    
    return {
      resources: paginatedResources,
      total,
      hasMore: endIndex < total,
    };
  }
};

export const useResourceStore = create<ResourceStore>()(
  devtools((set, get) => ({
    resources: [],
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
    
    fetchResources: async () => {
      const { pagination, filters, searchQuery } = get();
      set({ loading: true, error: null });
      
      try {
        const data = await mockApi.getResources({
          page: pagination.page,
          limit: pagination.limit,
          query: searchQuery,
          filters,
        });
        
        set({
          resources: pagination.page === 1 ? data.resources : [...get().resources, ...data.resources],
          pagination: {
            ...pagination,
            total: data.total,
            hasMore: data.hasMore,
          },
          loading: false,
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : '获取资源失败', 
          loading: false 
        });
      }
    },
    
    searchResources: async (query) => {
      set({ 
        searchQuery: query, 
        pagination: { ...get().pagination, page: 1 },
        resources: [] // 清空当前资源
      });
      await get().fetchResources();
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
      await get().fetchResources();
    },
    
    clearResources: () => {
      set({ 
        resources: [], 
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
  }))
);
