'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { useStableResourceStore } from '@/hooks';
import { SearchBar } from '@/components/features/SearchBar';
import { ResourceGrid } from '@/components/features/ResourceGrid';
import { Button, ViewToggle, Badge } from '@/components/ui';
import Link from 'next/link';
import type { ResourceFilters } from '@/types';

type ViewMode = 'grid' | 'list';

// 热门搜索词
const hotKeywords = [
  'React', 'Vue', 'JavaScript', 'Python', 'Node.js', 'TypeScript',
  'Flutter', 'Android', 'iOS', 'Photoshop', 'Excel', 'PPT',
  '面试', '算法', '数据结构', '前端', '后端', '人工智能'
];

// 搜索历史（实际项目中应该从localStorage获取）
const getSearchHistory = () => {
  if (typeof window !== 'undefined') {
    const history = localStorage.getItem('search_history');
    return history ? JSON.parse(history) : [];
  }
  return [];
};

const addToSearchHistory = (query: string) => {
  if (typeof window !== 'undefined' && query.trim()) {
    const history = getSearchHistory();
    const newHistory = [query, ...history.filter((item: string) => item !== query)].slice(0, 10);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  }
};

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const type = searchParams.get('type') || '';
  const sort = searchParams.get('sort') || 'latest';

  const { 
    resources, 
    loading, 
    pagination,
    searchResources,
    setFilters,
    loadMore,
    resetPagination
  } = useStableResourceStore();

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  const performSearch = useCallback(async () => {
    setSearchQuery(query);
    
    if (query.trim()) {
      // 重置状态
      resetPagination();
      
      // 设置筛选条件
      const filters: Partial<ResourceFilters> = {
        sortBy: sort as 'latest' | 'popular' | 'price' | 'rating'
      };
      
      if (category) filters.category = category;
      if (type) filters.type = [type as 'video' | 'software' | 'document' | 'article' | 'file'];
      
      setFilters(filters);
      
      // 执行搜索
      await searchResources(query.trim());
      
      // 添加到搜索历史
      addToSearchHistory(query.trim());
    }
  }, [query, category, type, sort, resetPagination, setFilters, searchResources]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const handleSearch = useCallback((newQuery: string) => {
    if (newQuery.trim()) {
      const url = new URL(window.location.href);
      url.searchParams.set('q', newQuery.trim());
      window.history.pushState({}, '', url.toString());
      
      setSearchQuery(newQuery);
      searchResources(newQuery.trim());
      addToSearchHistory(newQuery.trim());
      setSearchHistory(getSearchHistory());
    }
  }, [searchResources]);

  const handleFilterChange = (filterType: string, value: string) => {
    const url = new URL(window.location.href);
    
    if (value) {
      url.searchParams.set(filterType, value);
    } else {
      url.searchParams.delete(filterType);
    }
    
    window.history.pushState({}, '', url.toString());
    
    // 重新执行搜索
    if (query.trim()) {
      const filters: Partial<ResourceFilters> = {
        sortBy: (filterType === 'sort' ? value : sort) as 'latest' | 'popular' | 'price' | 'rating'
      };
      
      const newCategory = filterType === 'category' ? value : category;
      const newType = filterType === 'type' ? value : type;
      
      if (newCategory) filters.category = newCategory;
      if (newType) filters.type = [newType as 'video' | 'software' | 'document' | 'article' | 'file'];
      
      setFilters(filters);
      searchResources(query.trim());
    }
  };

  const handleLoadMore = () => {
    loadMore();
  };

  const clearHistory = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('search_history');
      setSearchHistory([]);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 搜索头部 */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            {/* 面包屑导航 */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-gray-700">首页</Link>
              <span>/</span>
              <span className="text-gray-900">搜索结果</span>
            </nav>

            {/* 搜索栏 */}
            <div className="max-w-3xl">
              <SearchBar 
                value={searchQuery}
                onSearch={handleSearch}
                placeholder="搜索您需要的资源..."
              />
            </div>

            {/* 搜索信息 */}
            {query && (
              <div className="mt-4">
                <div className="text-lg">
                  搜索 &quot;<span className="font-semibold text-blue-600">{query}</span>&quot; 的结果
                </div>
                {!loading && (
                  <div className="text-sm text-gray-500 mt-1">
                    找到 {pagination.total} 个相关资源
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {query ? (
            // 有搜索查询时显示结果
            <>
              {/* 筛选工具栏 */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  {/* 分类筛选 */}
                  <select 
                    value={category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">全部分类</option>
                    <option value="前端开发">前端开发</option>
                    <option value="后端开发">后端开发</option>
                    <option value="移动开发">移动开发</option>
                    <option value="图像处理">图像处理</option>
                    <option value="办公软件">办公软件</option>
                    <option value="编程教程">编程教程</option>
                    <option value="职业发展">职业发展</option>
                  </select>

                  {/* 资源类型筛选 */}
                  <select 
                    value={type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">全部类型</option>
                    <option value="video">视频教程</option>
                    <option value="software">软件工具</option>
                    <option value="document">技术文档</option>
                    <option value="article">精选文章</option>
                    <option value="file">文件资源</option>
                  </select>

                  {/* 排序筛选 */}
                  <select 
                    value={sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="latest">最新发布</option>
                    <option value="popular">最受欢迎</option>
                    <option value="rating">评分最高</option>
                    <option value="price">价格从低到高</option>
                  </select>

                  {/* 清除筛选 */}
                  {(category || type || sort !== 'latest') && (
                    <button
                      onClick={() => {
                        const url = new URL(window.location.href);
                        url.searchParams.delete('category');
                        url.searchParams.delete('type');
                        url.searchParams.set('sort', 'latest');
                        window.history.pushState({}, '', url.toString());
                        handleFilterChange('sort', 'latest');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      清除筛选
                    </button>
                  )}
                </div>
                
                {/* 视图切换 */}
                <ViewToggle value={viewMode} onChange={setViewMode} />
              </div>

              {/* 当前筛选条件 */}
              {(category || type) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {category && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      分类: {category}
                      <button
                        onClick={() => handleFilterChange('category', '')}
                        className="ml-1 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {type && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      类型: {type === 'video' ? '视频教程' : 
                             type === 'software' ? '软件工具' :
                             type === 'document' ? '技术文档' :
                             type === 'article' ? '精选文章' : '文件资源'}
                      <button
                        onClick={() => handleFilterChange('type', '')}
                        className="ml-1 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              )}
              
              {/* 搜索结果 */}
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
              
              {/* 无结果状态 */}
              {!loading && resources.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关资源</h3>
                  <p className="text-gray-500 mb-6">
                    没有找到与 &quot;{query}&quot; 相关的资源，试试其他关键词或调整筛选条件
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => handleSearch('')}
                    >
                      清除搜索
                    </Button>
                    <Link href="/categories">
                      <Button>浏览分类</Button>
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            // 无搜索查询时显示搜索建议
            <div className="max-w-4xl mx-auto">
              {/* 热门搜索 */}
              <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">热门搜索</h2>
                <div className="flex flex-wrap gap-3">
                  {hotKeywords.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => handleSearch(keyword)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors text-sm"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
              </div>

              {/* 搜索历史 */}
              {searchHistory.length > 0 && (
                <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">搜索历史</h2>
                    <button
                      onClick={clearHistory}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      清除历史
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {searchHistory.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(item)}
                        className="flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 搜索提示 */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center">
                <h2 className="text-2xl font-semibold mb-4">开始您的搜索之旅</h2>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  我们拥有超过 18,000+ 优质资源，涵盖技术开发各个领域。使用上方搜索框开始探索吧！
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/categories">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                      浏览分类
                    </Button>
                  </Link>
                  <Link href="/resources">
                    <Button className="bg-white text-blue-600 hover:bg-gray-100">
                      查看全部资源
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </MainLayout>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
