'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { Card } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null; // 或者显示加载状态
  }

  const stats = [
    {
      title: '已购资源',
      value: '12',
      change: '+2',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: '下载次数',
      value: '38',
      change: '+12',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: '收藏资源',
      value: '6',
      change: '+1',
      changeType: 'positive' as const,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: '消费金额',
      value: formatCurrency(299),
      change: `+${formatCurrency(99)}`,
      changeType: 'positive' as const,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
    },
  ];

  const recentDownloads = [
    {
      id: '1',
      title: 'React 完整教程视频',
      thumbnail: 'https://picsum.photos/60/60?random=1',
      downloadedAt: '2024-01-25',
      type: 'video',
      size: '3.2 GB',
    },
    {
      id: '2',
      title: 'JavaScript高级编程指南',
      thumbnail: 'https://picsum.photos/60/60?random=2',
      downloadedAt: '2024-01-24',
      type: 'document',
      size: '25 MB',
    },
    {
      id: '3',
      title: 'Photoshop 2024 最新版',
      thumbnail: 'https://picsum.photos/60/60?random=3',
      downloadedAt: '2024-01-23',
      type: 'software',
      size: '1.8 GB',
    },
  ];

  const quickActions = [
    {
      title: '浏览资源',
      description: '发现更多精彩内容',
      href: '/resources',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      title: '升级VIP',
      description: '享受更多特权',
      href: '/vip',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      color: 'bg-yellow-500',
    },
    {
      title: '我的收藏',
      description: '查看收藏的资源',
      href: '/dashboard/favorites',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'bg-red-500',
    },
    {
      title: '账户设置',
      description: '管理个人信息',
      href: '/dashboard/settings',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-gray-500',
    },
  ];

  const getTypeLabel = (type: string) => {
    const labels = {
      video: '视频',
      software: '软件',
      document: '文档',
      article: '文章',
      file: '文件',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* 欢迎区域 */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={user.avatar || 'https://via.placeholder.com/60'}
                alt={user.name}
                className="w-15 h-15 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  欢迎回来，{user.name}！
                  {user.verified && (
                    <svg className="inline w-6 h-6 text-blue-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </h1>
                <p className="text-gray-600">
                  VIP等级：
                  <span className={`ml-1 font-medium ${
                    user.vipLevel === 'premium' ? 'text-yellow-600' :
                    user.vipLevel === 'basic' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {user.vipLevel === 'premium' ? '超级VIP' :
                     user.vipLevel === 'basic' ? '普通VIP' : '普通用户'}
                  </span>
                  {user.vipExpiry && (
                    <span className="text-sm text-gray-500 ml-2">
                      到期时间：{user.vipExpiry}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm flex items-center mt-1 ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'positive' ? (
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 7v10M17 7H7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17l-9.2-9.2M7 17V7m0 10h10" />
                        </svg>
                      )}
                      {stat.change} 本月
                    </p>
                  </div>
                  <div className="text-blue-600">
                    {stat.icon}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 最近下载 */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">最近下载</h3>
                  <a
                    href="/dashboard/downloads"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    查看全部
                  </a>
                </div>
                
                <div className="space-y-4">
                  {recentDownloads.map((download) => (
                    <div key={download.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <img
                        src={download.thumbnail}
                        alt={download.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {download.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{getTypeLabel(download.type)}</span>
                          <span>•</span>
                          <span>{download.size}</span>
                          <span>•</span>
                          <span>{download.downloadedAt}</span>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* 快捷操作 */}
            <div>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">快捷操作</h3>
                
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <a
                      key={index}
                      href={action.href}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white group-hover:scale-105 transition-transform`}>
                        {action.icon}
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          {action.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {action.description}
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 ml-auto group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  ))}
                </div>
              </Card>

              {/* VIP状态卡片 */}
              {user.vipLevel !== 'none' && (
                <Card className="p-6 mt-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                  <div className="flex items-center mb-3">
                    <svg className="w-6 h-6 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-yellow-800">VIP特权</h3>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• 无限制下载</li>
                    <li>• 高速下载通道</li>
                    <li>• 专属客服支持</li>
                    <li>• 优先获取新资源</li>
                  </ul>
                  <div className="mt-4">
                    <a
                      href="/vip"
                      className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      管理会员 →
                    </a>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
