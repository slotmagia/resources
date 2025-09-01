'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { useResourceStore } from '@/stores';
import { SearchBar } from '@/components/features/SearchBar';
import { FilterSidebar } from '@/components/features/FilterSidebar';
import { ResourceGrid } from '@/components/features/ResourceGrid';
import { Button, ViewToggle } from '@/components/ui';
import type { ResourceFilters } from '@/types';

type ViewMode = 'grid' | 'list';

function ResourcesContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const initializedRef = useRef(false);
  
  const { 
    resources, 
    loading, 
    searchQuery, 
    filters, 
    pagination,
    fetchResources, 
    searchResources, 
    setFilters,
    loadMore,
    resetPagination
  } = useResourceStore();

  // 从URL参数初始化筛选器
  useEffect(() => {
    if (initializedRef.current) return;
    
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    
    if (type || category) {
      setFilters({
        type: type ? [type as 'video' | 'software' | 'document' | 'article' | 'file'] : undefined,
        category: category || undefined,
      });
      fetchResources();
    } else {
      fetchResources();
    }
    
    initializedRef.current = true;
  }, [searchParams, setFilters, fetchResources]);

  const handleSearch = useCallback((query: string) => {
    searchResources(query);
  }, [searchResources]);

  const handleFilterChange = useCallback((newFilters: Partial<ResourceFilters>) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleFilterReset = useCallback(() => {
    resetPagination();
  }, [resetPagination]);

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 页面头部 */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                资源中心
              </h1>
              <p className="text-gray-600">
                发现和下载您需要的优质资源
              </p>
            </div>
            
            {/* 搜索栏 */}
            <div className="max-w-2xl">
              <SearchBar 
                value={searchQuery}
                onSearch={handleSearch}
                placeholder="搜索您需要的资源..."
              />
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* 筛选侧边栏 */}
            <aside className="w-64 flex-shrink-0">
              <FilterSidebar 
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleFilterReset}
              />
            </aside>
            
            {/* 资源列表 */}
            <main className="flex-1">
              {/* 工具栏 */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    {loading ? (
                      '搜索中...'
                    ) : (
                      <>
                        找到 <span className="font-medium text-gray-900">{pagination.total}</span> 个资源
                        {searchQuery && (
                          <>
                            ，关键词 &quot;<span className="font-medium text-gray-900">{searchQuery}</span>&quot;
                          </>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* 活跃筛选条件标签 */}
                  <div className="flex items-center space-x-2">
                    {filters.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {filters.category}
                        <button
                          onClick={() => handleFilterChange({ category: undefined })}
                          className="ml-1 hover:text-blue-600"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.type && filters.type.length > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {filters.type.length} 种类型
                        <button
                          onClick={() => handleFilterChange({ type: undefined })}
                          className="ml-1 hover:text-green-600"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.rating && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {filters.rating}星+
                        <button
                          onClick={() => handleFilterChange({ rating: undefined })}
                          className="ml-1 hover:text-yellow-600"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </div>
                
                {/* 视图切换 */}
                <ViewToggle value={viewMode} onChange={setViewMode} />
              </div>
              
              {/* 资源网格/列表 */}
              <ResourceGrid 
                resources={resources}
                viewMode={viewMode}
                loading={loading}
              />
              
              {/* 加载更多 */}
              {pagination.hasMore && !loading && resources.length > 0 && (
                <div className="mt-8 text-center">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    size="lg"
                  >
                    加载更多资源
                  </Button>
                </div>
              )}
              
              {/* 没有更多内容提示 */}
              {!pagination.hasMore && resources.length > 0 && !loading && (
                <div className="mt-8 text-center py-8">
                  <div className="text-gray-500 text-sm">
                    已显示全部 {pagination.total} 个资源
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                  <div className="h-96 bg-gray-200 rounded"></div>
                </div>
                <div className="lg:col-span-3">
                  <div className="space-y-4">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-64 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    }>
      <ResourcesContent />
    </Suspense>
  );
}
