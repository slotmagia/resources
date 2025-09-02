'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, Badge, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/stores';
import type { Resource } from '@/types';

interface ResourceGridProps {
  resources: Resource[];
  viewMode?: 'grid' | 'list';
  loading?: boolean;
}

function ResourceCardSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <Card className="p-4">
        <div className="flex space-x-4">
          <div className="w-24 h-24 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
          <div className="w-24 text-right space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-gray-200 animate-pulse"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
      </div>
    </Card>
  );
}

function ResourceCard({ resource, viewMode }: { resource: Resource; viewMode: 'grid' | 'list' }) {
  const { addItem, isInCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // 防止链接跳转
    e.stopPropagation();
    
    if (!isInCart(resource.id)) {
      addItem({
        resourceId: resource.id,
        title: resource.title,
        price: resource.price,
        thumbnail: resource.thumbnail,
      });
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 处理下载逻辑
    console.log('下载资源:', resource.id);
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <div className="p-4">
          <div className="flex space-x-4">
            <Link href={`/resources/${resource.id}`} className="flex-shrink-0">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                <Image
                  src={resource.thumbnail}
                  alt={resource.title}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1">
                  <Badge variant="secondary" size="sm">
                    {getTypeLabel(resource.type)}
                  </Badge>
                </div>
              </div>
            </Link>
            
            <div className="flex-1 min-w-0">
              <Link href={`/resources/${resource.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                  {resource.title}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {resource.description}
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Image
                    src={resource.author.avatar || 'https://via.placeholder.com/20'}
                    alt={resource.author.name}
                    width={16}
                    height={16}
                    className="w-4 h-4 rounded-full mr-1"
                  />
                  <span>{resource.author.name}</span>
                  {resource.author.verified && (
                    <svg className="w-3 h-3 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span>•</span>
                <span>{resource.category}</span>
                <span>•</span>
                <div className="flex items-center">
                  <svg className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span>{resource.stats.rating}</span>
                  <span className="ml-1">({resource.stats.reviewCount})</span>
                </div>
                <span>•</span>
                <span>{resource.stats.downloads.toLocaleString()} 下载</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end justify-between w-32">
              <div className="text-right mb-2">
                {resource.price === 0 ? (
                  <div className="text-lg font-bold text-green-600">免费</div>
                ) : (
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(resource.price)}
                    </div>
                    {resource.originalPrice && resource.originalPrice > resource.price && (
                      <div className="text-sm text-gray-400 line-through">
                        {formatCurrency(resource.originalPrice)}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                {resource.price === 0 ? (
                  <Button size="sm" onClick={handleDownload}>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    下载
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant={isInCart(resource.id) ? "secondary" : "primary"}
                    onClick={handleAddToCart}
                    disabled={isInCart(resource.id)}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8L3 21h18M9 19a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    {isInCart(resource.id) ? '已加入' : '加购物车'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view (原有的卡片样式)
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-200">
      <Link href={`/resources/${resource.id}`}>
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={resource.thumbnail}
            alt={resource.title}
            width={400}
            height={225}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" size="sm">
              {getTypeLabel(resource.type)}
            </Badge>
          </div>
          {resource.originalPrice && resource.originalPrice > resource.price && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" size="sm">
                -{Math.round((1 - resource.price / resource.originalPrice) * 100)}%
              </Badge>
            </div>
          )}
          {resource.price === 0 && (
            <div className="absolute top-2 right-2">
              <Badge variant="success" size="sm">
                免费
              </Badge>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/resources/${resource.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {resource.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {resource.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>{resource.stats.rating}</span>
            <span>({resource.stats.reviewCount})</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{resource.stats.downloads.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            {resource.price === 0 ? (
              <div className="text-lg font-bold text-green-600">免费</div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(resource.price)}
                </div>
                {resource.originalPrice && resource.originalPrice > resource.price && (
                  <div className="text-sm text-gray-400 line-through">
                    {formatCurrency(resource.originalPrice)}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Image
              src={resource.author.avatar || 'https://via.placeholder.com/20'}
              alt={resource.author.name}
              width={20}
              height={20}
              className="w-5 h-5 rounded-full mr-2"
            />
            <span>{resource.author.name}</span>
            {resource.author.verified && (
              <svg className="w-4 h-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {resource.price === 0 ? (
            <Button fullWidth onClick={handleDownload}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              立即下载
            </Button>
          ) : (
            <Button
              fullWidth
              variant={isInCart(resource.id) ? "secondary" : "primary"}
              onClick={handleAddToCart}
              disabled={isInCart(resource.id)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8L3 21h18M9 19a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {isInCart(resource.id) ? '已在购物车' : '加入购物车'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function getTypeLabel(type: string): string {
  const labels = {
    video: '视频',
    software: '软件',
    document: '文档',
    article: '文章',
    file: '文件',
  };
  return labels[type as keyof typeof labels] || type;
}

export function ResourceGrid({ resources, viewMode = 'grid', loading }: ResourceGridProps) {
  if (loading) {
    return (
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
        : 'space-y-4'
      }>
        {Array.from({ length: 12 }).map((_, index) => (
          <ResourceCardSkeleton key={index} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">暂无资源</h3>
        <p className="mt-1 text-sm text-gray-500">
          没有找到符合条件的资源，请尝试调整筛选条件。
        </p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' 
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
      : 'space-y-4'
    }>
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} viewMode={viewMode} />
      ))}
    </div>
  );
}
