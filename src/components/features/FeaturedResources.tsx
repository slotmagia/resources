'use client';

import Link from 'next/link';
import { Button, Card, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { Resource } from '@/types';

interface FeaturedResourcesProps {
  resources: Resource[];
  loading: boolean;
}

function ResourceCardSkeleton() {
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

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={resource.thumbnail}
          alt={resource.title}
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
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {resource.title}
        </h3>
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
        
        <div className="flex items-center justify-between">
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
            <img
              src={resource.author.avatar || 'https://via.placeholder.com/20'}
              alt={resource.author.name}
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

export function FeaturedResources({ resources, loading }: FeaturedResourcesProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            精选资源推荐
          </h2>
          <p className="text-lg text-gray-600">
            编辑精心挑选的优质资源，助力您的学习和工作
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading ? (
            // 显示骨架屏
            Array.from({ length: 8 }).map((_, index) => (
              <ResourceCardSkeleton key={index} />
            ))
          ) : (
            // 显示实际资源
            resources.map((resource) => (
              <Link key={resource.id} href={`/resources/${resource.id}`}>
                <ResourceCard resource={resource} />
              </Link>
            ))
          )}
        </div>
        
        <div className="text-center">
          <Link href="/resources">
            <Button size="lg" variant="outline">
              查看更多资源
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
