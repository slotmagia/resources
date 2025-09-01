'use client';

import { useRef, useCallback } from 'react';
import { useResourceStore } from '@/stores';
import type { ResourceFilters } from '@/types';

// 创建稳定的store方法引用
export function useStableResourceStore() {
  const store = useResourceStore();
  
  // 使用ref来存储稳定的方法引用
  const stableMethodsRef = useRef({
    fetchResources: () => store.fetchResources(),
    searchResources: (query: string) => store.searchResources(query),
    setFilters: (filters: Partial<ResourceFilters>) => store.setFilters(filters),
    resetPagination: () => store.resetPagination(),
    loadMore: () => store.loadMore(),
    clearResources: () => store.clearResources(),
  });

  // 每次渲染时更新方法引用，但保持函数对象稳定
  stableMethodsRef.current.fetchResources = store.fetchResources;
  stableMethodsRef.current.searchResources = store.searchResources;
  stableMethodsRef.current.setFilters = store.setFilters;
  stableMethodsRef.current.resetPagination = store.resetPagination;
  stableMethodsRef.current.loadMore = store.loadMore;
  stableMethodsRef.current.clearResources = store.clearResources;

  return {
    // 状态保持原样
    resources: store.resources,
    loading: store.loading,
    error: store.error,
    searchQuery: store.searchQuery,
    filters: store.filters,
    pagination: store.pagination,
    
    // 方法使用稳定引用
    fetchResources: useCallback(() => stableMethodsRef.current.fetchResources(), []),
    searchResources: useCallback((query: string) => stableMethodsRef.current.searchResources(query), []),
    setFilters: useCallback((filters: Partial<ResourceFilters>) => stableMethodsRef.current.setFilters(filters), []),
    resetPagination: useCallback(() => stableMethodsRef.current.resetPagination(), []),
    loadMore: useCallback(() => stableMethodsRef.current.loadMore(), []),
    clearResources: useCallback(() => stableMethodsRef.current.clearResources(), []),
  };
}
