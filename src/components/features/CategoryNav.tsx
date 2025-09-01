'use client';

import Link from 'next/link';
import { Card } from '@/components/ui';

const categories = [
  {
    id: 'frontend',
    name: '前端开发',
    categoryName: '前端开发',
    description: '现代化前端开发技术，React、Vue、Angular等主流框架',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    count: '3,200+',
    color: 'bg-blue-500',
  },
  {
    id: 'backend',
    name: '后端开发',
    categoryName: '后端开发',
    description: '服务端开发技术栈，Node.js、Python、Java、Go等',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    count: '2,800+',
    color: 'bg-green-500',
  },
  {
    id: 'mobile',
    name: '移动开发',
    categoryName: '移动开发',
    description: 'iOS、Android原生开发以及跨平台开发技术',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
      </svg>
    ),
    count: '1,500+',
    color: 'bg-purple-500',
  },
  {
    id: 'design',
    name: '图像处理',
    categoryName: '图像处理',
    description: 'Photoshop、AI设计工具使用教程和创意设计资源',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v7a2 2 0 002 2h4a2 2 0 002-2V5z" />
      </svg>
    ),
    count: '2,100+',
    color: 'bg-pink-500',
  },
  {
    id: 'office',
    name: '办公软件',
    categoryName: '办公软件',
    description: 'Office办公套件、效率工具和企业级软件使用指南',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    count: '1,800+',
    color: 'bg-orange-500',
  },
  {
    id: 'programming',
    name: '编程教程',
    categoryName: '编程教程',
    description: '编程语言基础到进阶的完整学习路径和实战项目',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    count: '4,200+',
    color: 'bg-indigo-500',
  },
  {
    id: 'career',
    name: '职业发展',
    categoryName: '职业发展',
    description: '技术职业规划、面试技巧、软技能提升等职场发展资源',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    count: '900+',
    color: 'bg-teal-500',
  },
  {
    id: 'ai',
    name: '人工智能',
    categoryName: '人工智能',
    description: '机器学习、深度学习、AI工具使用和相关技术资源',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    count: '1,200+',
    color: 'bg-red-500',
  },
];

export function CategoryNav() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            资源分类导航
          </h2>
          <p className="text-lg text-gray-600">
            精心分类整理，快速找到您需要的资源
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${encodeURIComponent(category.categoryName)}`}
              className="group"
            >
              <Card className="h-full p-6 hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white`}>
                    {category.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="text-xs text-blue-600 font-medium">
                      {category.count} 个资源
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200"
          >
            查看全部分类
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
