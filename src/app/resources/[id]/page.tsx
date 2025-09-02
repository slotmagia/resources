'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { MainLayout } from '@/components/layout';
import { Button, Card, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/stores';
import type { ResourceDetail, Comment } from '@/types';

// 模拟资源详情数据
const mockResourceDetail: ResourceDetail = {
  id: '1',
  title: 'React 完整教程视频',
  description: '从零开始学习React，包含Hooks、Context、Redux等高级特性',
  type: 'video',
  category: '前端开发',
  thumbnail: 'https://picsum.photos/600/400?random=1',
  price: 99.00,
  originalPrice: 199.00,
  downloadUrl: '/downloads/react-tutorial.zip',
  author: {
    id: 'author1',
    name: '张老师',
    avatar: 'https://picsum.photos/60/60?random=10',
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
  content: `
    <h2>课程介绍</h2>
    <p>这是一套完整的React教程，从基础概念到高级特性，循序渐进地带你掌握React开发。</p>
    
    <h3>课程大纲</h3>
    <ul>
      <li>React基础概念</li>
      <li>组件和JSX</li>
      <li>状态管理</li>
      <li>生命周期</li>
      <li>Hooks详解</li>
      <li>Context API</li>
      <li>Redux状态管理</li>
      <li>路由系统</li>
      <li>性能优化</li>
      <li>实战项目</li>
    </ul>
    
    <h3>适合人群</h3>
    <p>适合有JavaScript基础的开发者学习，无论你是前端新手还是有经验的开发者都能从中受益。</p>
  `,
  specifications: {
    '视频时长': '12小时',
    '视频格式': 'MP4',
    '分辨率': '1920x1080',
    '文件大小': '3.2GB',
    '语言': '中文',
    '字幕': '中英文字幕',
    '更新时间': '2024年1月',
    '兼容性': '所有设备',
  },
  gallery: [
    'https://picsum.photos/600/400?random=1',
    'https://picsum.photos/600/400?random=2',
    'https://picsum.photos/600/400?random=3',
    'https://picsum.photos/600/400?random=4',
  ],
  fileSize: 3355443200, // 3.2GB in bytes
  downloadCount: 1234,
  requirements: [
    'JavaScript基础知识',
    'HTML/CSS基础',
    '了解ES6语法',
  ],
};

// 模拟评论数据
const mockComments: Comment[] = [
  {
    id: '1',
    content: '非常好的教程，老师讲得很详细，从基础到高级都覆盖了。推荐给所有想学React的朋友！',
    author: {
      id: 'user1',
      name: '前端小白',
      avatar: 'https://picsum.photos/40/40?random=20',
      level: 3,
    },
    createdAt: '2024-01-25T10:30:00Z',
    likes: 15,
    liked: false,
    replies: [],
    replyCount: 2,
  },
  {
    id: '2',
    content: '课程内容很丰富，项目实战部分特别有用。但是希望能够增加一些最新的React特性介绍。',
    author: {
      id: 'user2',
      name: '资深前端',
      avatar: 'https://picsum.photos/40/40?random=21',
      level: 8,
      verified: true,
    },
    createdAt: '2024-01-24T15:20:00Z',
    likes: 8,
    liked: true,
    replies: [],
    replyCount: 0,
  },
];

export default function ResourceDetailPage() {
  const params = useParams();
  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const { addItem, isInCart } = useCartStore();

  useEffect(() => {
    // 模拟API调用
    const fetchResource = async () => {
      setLoading(true);
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setResource(mockResourceDetail);
      setComments(mockComments);
      setLoading(false);
    };

    fetchResource();
  }, [params.id]);

  const handleAddToCart = () => {
    if (resource && !isInCart(resource.id)) {
      addItem({
        resourceId: resource.id,
        title: resource.title,
        price: resource.price,
        thumbnail: resource.thumbnail,
      });
    }
  };

  const handleDownload = () => {
    // 处理下载逻辑
    console.log('下载资源:', resource?.id);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <div className="aspect-video bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!resource) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">资源不存在</h1>
          <p className="text-gray-600">抱歉，您访问的资源不存在或已被删除。</p>
        </div>
      </MainLayout>
    );
  }

  const tabs = [
    { id: 'description', label: '详细描述' },
    { id: 'specifications', label: '技术规格' },
    { id: 'reviews', label: `用户评价 (${resource.stats.reviewCount})` },
  ];

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* 资源主要信息 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* 左侧：图片画廊 */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                {/* 主图 */}
                <div className="aspect-video bg-gray-100">
                  <Image
                    src={resource.gallery[selectedImageIndex]}
                    alt={resource.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* 缩略图 */}
                {resource.gallery.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="flex space-x-2 overflow-x-auto">
                      {resource.gallery.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            selectedImageIndex === index
                              ? 'border-blue-500'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${resource.title} ${index + 1}`}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
            
            {/* 右侧：资源信息和购买 */}
            <div className="space-y-6">
              <Card className="p-6">
                {/* 基本信息 */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary">
                      {resource.type === 'video' ? '视频教程' : resource.type}
                    </Badge>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{resource.category}</span>
                  </div>
                  
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {resource.title}
                  </h1>
                  
                  <p className="text-gray-600 mb-4">
                    {resource.description}
                  </p>
                  
                  {/* 作者信息 */}
                  <div className="flex items-center space-x-3 mb-4">
                    <Image
                      src={resource.author.avatar || 'https://via.placeholder.com/40'}
                      alt={resource.author.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-gray-900">
                          {resource.author.name}
                        </span>
                        {resource.author.verified && (
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">资源作者</span>
                    </div>
                  </div>
                  
                  {/* 评分和统计 */}
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(resource.stats.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1">{resource.stats.rating}</span>
                      <span>({resource.stats.reviewCount} 评价)</span>
                    </div>
                    <span>•</span>
                    <span>{resource.stats.downloads.toLocaleString()} 下载</span>
                    <span>•</span>
                    <span>{resource.stats.views.toLocaleString()} 浏览</span>
                  </div>
                </div>
                
                {/* 价格和购买 */}
                <div className="border-t pt-6">
                  <div className="mb-6">
                    {resource.price === 0 ? (
                      <div className="text-3xl font-bold text-green-600">免费</div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl font-bold text-blue-600">
                          {formatCurrency(resource.price)}
                        </div>
                        {resource.originalPrice && resource.originalPrice > resource.price && (
                          <div className="flex flex-col">
                            <div className="text-lg text-gray-400 line-through">
                              {formatCurrency(resource.originalPrice)}
                            </div>
                            <div className="text-sm text-red-600 font-medium">
                              省 {formatCurrency(resource.originalPrice - resource.price)}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {resource.price === 0 ? (
                      <Button fullWidth size="lg" onClick={handleDownload}>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        立即下载
                      </Button>
                    ) : (
                      <>
                        <Button fullWidth size="lg" onClick={handleAddToCart} disabled={isInCart(resource.id)}>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8L3 21h18M9 19a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
                          </svg>
                          {isInCart(resource.id) ? '已在购物车' : '加入购物车'}
                        </Button>
                        <Button fullWidth variant="outline" size="lg">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          收藏
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {/* 标签 */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* 快速信息 */}
              <Card className="p-4">
                <h3 className="font-medium text-gray-900 mb-3">快速信息</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">文件大小:</span>
                    <span className="text-gray-900">3.2 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">更新时间:</span>
                    <span className="text-gray-900">2024年1月</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">下载次数:</span>
                    <span className="text-gray-900">{resource.downloadCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">格式:</span>
                    <span className="text-gray-900">MP4</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          {/* 详细信息标签页 */}
          <Card>
            {/* 标签导航 */}
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* 标签内容 */}
            <div className="p-6">
              {activeTab === 'description' && (
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: resource.content }} />
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(resource.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                      <span className="font-medium text-gray-900">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-start space-x-4">
                        <Image
                          src={comment.author.avatar || 'https://via.placeholder.com/40'}
                          alt={comment.author.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {comment.author.name}
                            </span>
                            {comment.author.verified && (
                              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                            {comment.author.level && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                Lv.{comment.author.level}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{comment.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                            <button className="flex items-center space-x-1 hover:text-blue-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span>{comment.likes}</span>
                            </button>
                            <button className="hover:text-blue-600">回复</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
