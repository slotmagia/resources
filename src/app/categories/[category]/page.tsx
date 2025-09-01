'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { useStableResourceStore } from '@/hooks';
import { SearchBar } from '@/components/features/SearchBar';
import { ResourceGrid } from '@/components/features/ResourceGrid';
import { Button, ViewToggle, Badge } from '@/components/ui';
import Link from 'next/link';

type ViewMode = 'grid' | 'list';

// 分类信息配置
const categoryInfo = {
  '前端开发': {
    title: '前端开发',
    description: '现代化前端开发技术，包含React、Vue、Angular等主流框架的学习资源',
    icon: '🚀',
    tags: ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'CSS'],
    color: 'bg-blue-500'
  },
  '后端开发': {
    title: '后端开发',
    description: '服务端开发技术栈，涵盖Node.js、Python、Java、Go等后端语言和框架',
    icon: '⚙️',
    tags: ['Node.js', 'Python', 'Java', 'Go', 'API', 'Database'],
    color: 'bg-green-500'
  },
  '移动开发': {
    title: '移动开发',
    description: 'iOS、Android原生开发以及React Native、Flutter跨平台开发技术',
    icon: '📱',
    tags: ['React Native', 'Flutter', 'iOS', 'Android', 'Hybrid'],
    color: 'bg-purple-500'
  },
  '图像处理': {
    title: '图像处理',
    description: 'Photoshop、AI设计工具使用教程和创意设计资源',
    icon: '🎨',
    tags: ['Photoshop', 'Illustrator', 'Sketch', 'Figma', 'Design'],
    color: 'bg-pink-500'
  },
  '办公软件': {
    title: '办公软件',
    description: 'Office办公套件、效率工具和企业级软件使用指南',
    icon: '💼',
    tags: ['Office', 'Excel', 'Word', 'PowerPoint', 'Productivity'],
    color: 'bg-orange-500'
  },
  '编程教程': {
    title: '编程教程',
    description: '编程语言基础到进阶的完整学习路径和实战项目',
    icon: '💻',
    tags: ['Programming', 'Algorithms', 'Data Structures', 'Projects'],
    color: 'bg-indigo-500'
  },
  '职业发展': {
    title: '职业发展',
    description: '技术职业规划、面试技巧、软技能提升等职场发展资源',
    icon: '📈',
    tags: ['Career', 'Interview', 'Soft Skills', 'Leadership'],
    color: 'bg-teal-500'
  }
};

type CategoryKey = keyof typeof categoryInfo;

function CategoryPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const initializedRef = useRef(false);

  const category = decodeURIComponent(params.category as string);
  const sortBy = searchParams.get('sort') || 'latest';

  const { 
    resources, 
    loading, 
    pagination,
    fetchResources, 
    searchResources,
    setFilters,
    loadMore,
    resetPagination
  } = useStableResourceStore();

  const categoryData = categoryInfo[category as CategoryKey];

  const loadCategoryResources = useCallback(async () => {
    // 重置状态
    resetPagination();
    
    // 设置分类筛选
    setFilters({
      category: category,
      sortBy: sortBy as 'latest' | 'popular' | 'price' | 'rating'
    });
    
    // 获取资源
    await fetchResources();
  }, [category, sortBy, resetPagination, setFilters, fetchResources]);

  useEffect(() => {
    loadCategoryResources();
  }, [loadCategoryResources]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchResources(query);
    } else {
      setFilters({ category: category });
      await fetchResources();
    }
  }, [category, fetchResources, searchResources, setFilters]);

  const handleSortChange = async (newSort: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort', newSort);
    window.history.pushState({}, '', url.toString());
    
    setFilters({
      category: category,
      sortBy: newSort as 'latest' | 'popular' | 'price' | 'rating'
    });
    await fetchResources();
  };

  const handleLoadMore = () => {
    loadMore();
  };

  const relatedCategories = Object.entries(categoryInfo)
    .filter(([key]) => key !== category)
    .slice(0, 6);

  if (!categoryData) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">分类不存在</h1>
          <p className="text-gray-600 mb-8">您访问的分类不存在或已被移除</p>
          <Link href="/resources">
            <Button>返回资源列表</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 分类头部 */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            {/* 面包屑导航 */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-gray-700">首页</Link>
              <span>/</span>
              <Link href="/resources" className="hover:text-gray-700">资源中心</Link>
              <span>/</span>
              <span className="text-gray-900">{categoryData.title}</span>
            </nav>

            {/* 分类信息 */}
            <div className="flex items-start space-x-6">
              <div className={`w-16 h-16 ${categoryData.color} rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0`}>
                {categoryData.icon}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {categoryData.title}
                </h1>
                <p className="text-gray-600 mb-4 max-w-2xl">
                  {categoryData.description}
                </p>
                
                {/* 标签 */}
                <div className="flex flex-wrap gap-2">
                  {categoryData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* 搜索栏 */}
            <div className="mt-8 max-w-2xl">
              <SearchBar 
                value={searchQuery}
                onSearch={handleSearch}
                placeholder={`在${categoryData.title}中搜索...`}
              />
            </div>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="container mx-auto px-4 py-8">
          {/* 工具栏 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {loading ? (
                  '搜索中...'
                ) : (
                  <>
                    找到 <span className="font-medium text-gray-900">{pagination.total}</span> 个{categoryData.title}资源
                    {searchQuery && (
                      <>
                        ，关键词 &quot;<span className="font-medium text-gray-900">{searchQuery}</span>&quot;
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 排序选择 */}
              <select 
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="latest">最新发布</option>
                <option value="popular">最受欢迎</option>
                <option value="rating">评分最高</option>
                <option value="price">价格从低到高</option>
              </select>
              
              {/* 视图切换 */}
              <ViewToggle value={viewMode} onChange={setViewMode} />
            </div>
          </div>
          
          {/* 资源网格 */}
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

          {/* 空状态 */}
          {!loading && resources.length === 0 && (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.469-.734-6.23-1.981M19 4c-7-7-13 3-13 3s6 10 13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无资源</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? '没有找到匹配的资源，试试其他关键词' : `${categoryData.title}分类下暂无资源`}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => handleSearch('')}
                >
                  清除搜索条件
                </Button>
              )}
            </div>
          )}

          {/* 相关分类推荐 */}
          {!searchQuery && (
            <div className="mt-16 bg-white rounded-lg p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">探索其他分类</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {relatedCategories.map(([key, info]) => (
                  <Link key={key} href={`/categories/${encodeURIComponent(key)}`}>
                    <div className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-center">
                      <div className={`w-12 h-12 ${info.color} rounded-lg flex items-center justify-center text-white text-xl mx-auto mb-2 group-hover:scale-105 transition-transform`}>
                        {info.icon}
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm group-hover:text-blue-600">
                        {info.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </MainLayout>
    }>
      <CategoryPageContent />
    </Suspense>
  );
}
