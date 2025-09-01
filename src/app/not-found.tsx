'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const suggestions = [
    {
      title: '浏览首页',
      description: '返回首页查看精选资源和最新内容',
      href: '/',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: '资源中心',
      description: '查看全部资源，使用筛选功能找到需要的内容',
      href: '/resources',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: '分类导航',
      description: '按分类浏览资源，快速找到感兴趣的内容',
      href: '/categories',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: '帮助中心',
      description: '查看常见问题和使用帮助',
      href: '/help',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 插图 */}
          <div className="mb-8">
            <div className="relative">
              {/* 大数字 404 */}
              <div className="text-[10rem] md:text-[12rem] font-bold text-gray-200 select-none">
                404
              </div>
              
              {/* 浮动元素 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* 中心图标 */}
                  <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white mb-4 animate-bounce">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.469-.734-6.23-1.981M19 4c-7-7-13 3-13 3s6 10 13 3z" />
                    </svg>
                  </div>
                  
                  {/* 装饰性浮动元素 */}
                  <div className="absolute -top-4 -right-4 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute -bottom-2 -left-6 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute top-8 -left-8 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 错误信息 */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              页面未找到
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              抱歉，您访问的页面不存在或已被移除
            </p>
            <p className="text-gray-500">
              可能是链接错误、页面已删除或您没有访问权限
            </p>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={handleGoBack}
              size="lg"
              className="px-8"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回上页
            </Button>
            
            <Link href="/">
              <Button variant="outline" size="lg" className="px-8">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                回到首页
              </Button>
            </Link>
          </div>

          {/* 建议链接 */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              您可能想要访问
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  href={suggestion.href}
                  className="group p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="text-blue-500 mb-3 group-hover:text-blue-600 transition-colors">
                    {suggestion.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {suggestion.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {suggestion.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* 搜索建议 */}
          <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-xl font-semibold mb-4">
              还是没找到想要的内容？
            </h3>
            <p className="text-blue-100 mb-6">
              试试使用搜索功能，我们有超过 18,000+ 优质资源等您发现
            </p>
            
            {/* 搜索框 */}
            <div className="max-w-md mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const query = formData.get('search') as string;
                  if (query.trim()) {
                    router.push(`/resources?q=${encodeURIComponent(query.trim())}`);
                  }
                }}
                className="flex"
              >
                <input
                  type="text"
                  name="search"
                  placeholder="搜索资源..."
                  className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-blue-600 rounded-r-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  搜索
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
