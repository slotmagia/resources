'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import Link from 'next/link';

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            发现优质资源
            <span className="block text-blue-600">下载精彩内容</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            汇聚全网优质资源，包含视频教程、专业软件、技术文档、精选文章等
            <br />
            为您的学习和工作提供强有力的支持
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/resources">
              <Button size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                探索资源
              </Button>
            </Link>
            <Link href="/categories">
              <Button size="lg" variant="outline">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                浏览分类
              </Button>
            </Link>
          </div>

          {/* 搜索栏 */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜索您需要的资源..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <Button type="submit" size="md" className="rounded-full">
                  搜索
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* 装饰性元素 */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-30"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-40"></div>
    </section>
  );
}
