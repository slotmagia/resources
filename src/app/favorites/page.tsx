'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { useAuthStore } from '@/stores';
import { Button, Card, Input, Badge } from '@/components/ui';

// 模拟收藏的资源数据
const mockFavorites = [
  {
    id: '1',
    title: 'React 完整教程视频',
    description: '从零开始学习React，包含Hooks、Context、Redux等高级特性',
    type: 'video',
    category: '前端开发',
    thumbnail: 'https://picsum.photos/300/200?random=1',
    price: 99.00,
    originalPrice: 199.00,
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
    favoriteDate: '2024-01-20',
    folder: 'frontend'
  },
  {
    id: '2',
    title: 'Python数据分析实战',
    description: '使用Python进行数据分析的完整课程，包含pandas、numpy等库的使用',
    type: 'video',
    category: '后端开发',
    thumbnail: 'https://picsum.photos/300/200?random=2',
    price: 129.00,
    originalPrice: 199.00,
    author: {
      id: 'author2',
      name: '李教授',
      avatar: 'https://picsum.photos/40/40?random=11',
      verified: true,
    },
    stats: {
      downloads: 890,
      views: 3421,
      rating: 4.9,
      reviewCount: 78,
    },
    tags: ['Python', '数据分析', 'pandas'],
    favoriteDate: '2024-01-18',
    folder: 'backend'
  },
  {
    id: '3',
    title: 'UI设计规范文档',
    description: '现代化UI设计规范和最佳实践指南',
    type: 'document',
    category: '图像处理',
    thumbnail: 'https://picsum.photos/300/200?random=3',
    price: 0,
    originalPrice: 0,
    author: {
      id: 'author3',
      name: '王设计师',
      avatar: 'https://picsum.photos/40/40?random=12',
      verified: true,
    },
    stats: {
      downloads: 2341,
      views: 8765,
      rating: 4.7,
      reviewCount: 234,
    },
    tags: ['UI设计', '设计规范', 'Figma'],
    favoriteDate: '2024-01-15',
    folder: 'design'
  },
  {
    id: '4',
    title: 'JavaScript高级编程',
    description: '深入理解JavaScript的高级特性和设计模式',
    type: 'article',
    category: '编程教程',
    thumbnail: 'https://picsum.photos/300/200?random=4',
    price: 59.00,
    originalPrice: 89.00,
    author: {
      id: 'author4',
      name: '赵工程师',
      avatar: 'https://picsum.photos/40/40?random=13',
      verified: true,
    },
    stats: {
      downloads: 567,
      views: 2134,
      rating: 4.6,
      reviewCount: 89,
    },
    tags: ['JavaScript', '编程', '设计模式'],
    favoriteDate: '2024-01-12',
    folder: 'programming'
  }
];

// 收藏夹分组
const favoriteFolders = [
  { id: 'all', name: '全部收藏', count: 4, color: 'bg-gray-500' },
  { id: 'frontend', name: '前端开发', count: 1, color: 'bg-blue-500' },
  { id: 'backend', name: '后端开发', count: 1, color: 'bg-green-500' },
  { id: 'design', name: '设计相关', count: 1, color: 'bg-pink-500' },
  { id: 'programming', name: '编程教程', count: 1, color: 'bg-purple-500' },
];

export default function FavoritesPage() {
  const { isAuthenticated } = useAuthStore();
  const [favorites, setFavorites] = useState(mockFavorites);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('date');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // 如果用户未登录，重定向到登录页
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
          <p className="text-gray-600 mb-8">您需要登录后才能查看收藏夹</p>
          <Link href="/login">
            <Button>前往登录</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  // 筛选和排序收藏
  const filteredFavorites = favorites
    .filter(item => {
      const matchesFolder = selectedFolder === 'all' || item.folder === selectedFolder;
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFolder && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.favoriteDate).getTime() - new Date(a.favoriteDate).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.stats.rating - a.stats.rating;
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredFavorites.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFavorites.map(item => item.id));
    }
  };

  const handleRemoveSelected = () => {
    setFavorites(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const handleRemoveItem = (itemId: string) => {
    setFavorites(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => prev.filter(id => id !== itemId));
  };

  const formatCurrency = (price: number) => {
    return price === 0 ? '免费' : `¥${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 页面头部 */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            {/* 面包屑导航 */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-gray-700">首页</Link>
              <span>/</span>
              <Link href="/dashboard" className="hover:text-gray-700">用户中心</Link>
              <span>/</span>
              <span className="text-gray-900">我的收藏</span>
            </nav>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">我的收藏</h1>
                <p className="text-gray-600">管理您收藏的资源</p>
              </div>
              
              {selectedItems.length > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    已选择 {selectedItems.length} 项
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRemoveSelected}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    删除选中
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏 */}
            <div className="lg:w-64 flex-shrink-0">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">收藏分组</h3>
                <div className="space-y-2">
                  {favoriteFolders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        selectedFolder === folder.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 ${folder.color} rounded-full`}></div>
                        <span className="font-medium">{folder.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{folder.count}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* 快速操作 */}
              <Card className="p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">快速操作</h3>
                <div className="space-y-3">
                  <Link href="/resources">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      浏览资源
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/categories'}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    分类浏览
                  </Button>
                </div>
              </Card>
            </div>

            {/* 主内容区 */}
            <div className="flex-1">
              {/* 工具栏 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* 搜索框 */}
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="搜索收藏的资源..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-80"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* 排序选择 */}
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="date">收藏时间</option>
                    <option value="title">标题</option>
                    <option value="rating">评分</option>
                    <option value="price">价格</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* 批量选择 */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedItems.length === filteredFavorites.length ? '取消全选' : '全选'}
                  </Button>

                  {/* 视图切换 */}
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* 收藏列表 */}
              {filteredFavorites.length > 0 ? (
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-4'
                }`}>
                  {filteredFavorites.map((item) => (
                    <Card 
                      key={item.id}
                      className={`group hover:shadow-md transition-all duration-200 ${
                        selectedItems.includes(item.id) ? 'border-blue-500 bg-blue-50' : ''
                      } ${viewMode === 'list' ? 'flex' : ''}`}
                    >
                      <div className={`${viewMode === 'list' ? 'flex w-full' : ''}`}>
                        {/* 图片区域 */}
                        <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className={`w-full object-cover ${
                              viewMode === 'list' ? 'h-32' : 'h-48'
                            } rounded-t-lg ${viewMode === 'list' ? 'rounded-l-lg rounded-tr-none' : ''}`}
                          />
                          
                          {/* 选择框 */}
                          <div className="absolute top-2 left-2">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => handleSelectItem(item.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>

                          {/* 收藏时间 */}
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-xs bg-black bg-opacity-60 text-white">
                              {formatDate(item.favoriteDate)}
                            </Badge>
                          </div>

                          {/* 类型标识 */}
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.type === 'video' ? '视频' : 
                               item.type === 'document' ? '文档' : 
                               item.type === 'article' ? '文章' : '文件'}
                            </Badge>
                          </div>
                        </div>

                        {/* 内容区域 */}
                        <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {item.description}
                            </p>
                            
                            {/* 作者信息 */}
                            <div className="flex items-center mb-3">
                              <img
                                src={item.author.avatar}
                                alt={item.author.name}
                                className="w-6 h-6 rounded-full mr-2"
                              />
                              <span className="text-sm text-gray-600">{item.author.name}</span>
                              {item.author.verified && (
                                <svg className="w-4 h-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>

                            {/* 标签 */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {item.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* 底部操作区 */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                {item.stats.rating}
                              </div>
                              <span className="font-semibold text-gray-900">
                                {formatCurrency(item.price)}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Link href={`/resources/${item.id}`}>
                                <Button size="sm" variant="outline">
                                  查看
                                </Button>
                              </Link>
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                移除
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchQuery ? '没有找到匹配的收藏' : '暂无收藏资源'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery ? '试试其他搜索词' : '快去收藏一些喜欢的资源吧'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {searchQuery && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchQuery('')}
                      >
                        清除搜索
                      </Button>
                    )}
                    <Link href="/resources">
                      <Button>浏览资源</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
