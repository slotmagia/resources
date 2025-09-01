'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout';

interface SiteSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  links: {
    name: string;
    href: string;
    description?: string;
  }[];
}

export default function SitemapPage() {
  const siteSections: SiteSection[] = [
    {
      title: '主要页面',
      description: '网站核心功能页面',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2H3V7z" />
        </svg>
      ),
      links: [
        { name: '首页', href: '/', description: '网站主页，展示平台特色和热门资源' },
        { name: '资源中心', href: '/resources', description: '浏览和搜索所有可用资源' },
        { name: '搜索结果', href: '/search', description: '资源搜索和筛选页面' },
        { name: '购物车', href: '/cart', description: '管理选中的付费资源' },
        { name: '个人中心', href: '/dashboard', description: '用户个人信息和数据统计' }
      ]
    },
    {
      title: '资源分类',
      description: '按类型浏览资源',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      links: [
        { name: '所有分类', href: '/categories', description: '查看所有资源分类' },
        { name: '视频教程', href: '/resources?type=video', description: '编程、设计、办公等视频教程' },
        { name: '软件工具', href: '/resources?type=software', description: '开发工具、设计软件、办公软件' },
        { name: '技术文档', href: '/resources?type=document', description: '技术手册、API文档、规范指南' },
        { name: '技术文章', href: '/resources?type=article', description: '技术博客、经验分享、最佳实践' }
      ]
    },
    {
      title: '用户功能',
      description: '用户账户相关功能',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      links: [
        { name: '用户登录', href: '/login', description: '登录您的账户' },
        { name: '用户注册', href: '/register', description: '创建新的用户账户' },
        { name: '个人资料', href: '/profile', description: '管理个人信息和偏好设置' },
        { name: '我的收藏', href: '/favorites', description: '查看收藏的资源' },
        { name: '消息通知', href: '/notifications', description: '查看系统通知和消息' },
        { name: 'VIP会员', href: '/vip', description: '了解和购买VIP会员服务' }
      ]
    },
    {
      title: '客户支持',
      description: '帮助和支持服务',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      links: [
        { name: '帮助中心', href: '/help', description: '常见问题和使用指南' },
        { name: '联系我们', href: '/contact', description: '联系客服团队' },
        { name: '意见反馈', href: '/feedback', description: '提交意见和建议' },
        { name: '服务协议', href: '/terms', description: '用户服务协议和条款' },
        { name: '隐私政策', href: '/privacy', description: '隐私保护政策' }
      ]
    },
    {
      title: '公司信息',
      description: '了解我们的公司',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      links: [
        { name: '关于我们', href: '/about', description: '公司介绍和发展历程' },
        { name: '加入我们', href: '/careers', description: '招聘信息和职位申请' },
        { name: '合作伙伴', href: '/partners', description: '合作伙伴展示和合作申请' },
        { name: '新闻动态', href: '/news', description: '公司新闻和行业动态' },
        { name: '投资者关系', href: '/investors', description: '投资者信息和财务报告' }
      ]
    },
    {
      title: '开发者',
      description: '开发者相关资源',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      links: [
        { name: 'API 文档', href: '/api-docs', description: '开发者API接口文档' },
        { name: 'SDK 下载', href: '/sdk', description: '各平台SDK和开发工具' },
        { name: '开发者社区', href: '/community', description: '开发者交流和讨论' },
        { name: '技术博客', href: '/blog', description: '技术文章和开发经验' },
        { name: '开源项目', href: '/opensource', description: '开源项目和代码仓库' }
      ]
    }
  ];

  const quickStats = [
    { label: '总页面数', value: '50+', icon: '📄' },
    { label: '资源分类', value: '20+', icon: '📂' },
    { label: '功能模块', value: '15+', icon: '⚙️' },
    { label: '帮助文档', value: '100+', icon: '📚' }
  ];

  const recentUpdates = [
    { date: '2024-01-15', page: 'VIP会员页面', description: '新增会员权益说明和购买流程' },
    { date: '2024-01-10', page: '资源搜索功能', description: '优化搜索算法，提升搜索准确性' },
    { date: '2024-01-05', page: '用户个人中心', description: '新增数据统计和下载历史功能' },
    { date: '2024-01-01', page: '移动端适配', description: '全站移动端界面优化完成' }
  ];

  return (
    <MainLayout>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-600 to-slate-800 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">网站地图</h1>
              <p className="text-xl text-slate-200 max-w-2xl mx-auto mb-8">
                快速找到您需要的页面和功能，全面了解资源吧的网站结构
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                {quickStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-slate-300 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 搜索功能 */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">快速查找页面</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="输入页面名称或功能关键词..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                例如：登录、VIP、帮助、资源等
              </p>
            </div>
          </div>
        </div>

        {/* 网站结构 */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {siteSections.map((section, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mr-3">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="border-l-2 border-gray-100 pl-4 hover:border-slate-300 transition-colors">
                      <Link 
                        href={link.href}
                        className="block group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 group-hover:text-slate-600 transition-colors">
                            {link.name}
                          </span>
                          <svg className="h-4 w-4 text-gray-400 group-hover:text-slate-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        {link.description && (
                          <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">
                            {link.description}
                          </p>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近更新 */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">最近更新</h2>
                <p className="text-xl text-gray-600">
                  查看网站最新的功能更新和页面改进
                </p>
              </div>
              <div className="space-y-6">
                {recentUpdates.map((update, index) => (
                  <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="text-sm font-medium text-slate-600">{update.date}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{update.page}</h4>
                      <p className="text-gray-600 text-sm">{update.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        已更新
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 网站导航树 */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">网站结构图</h2>
              <p className="text-xl text-gray-600">
                完整的网站层级结构，帮助您更好地理解网站架构
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg font-semibold">
                  资源吧 (/)
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* 主要功能 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-center pb-2 border-b border-gray-200">
                    主要功能
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="pl-4 border-l-2 border-blue-200">
                      <Link href="/resources" className="text-blue-600 hover:text-blue-800">资源中心</Link>
                      <div className="pl-4 mt-1 space-y-1 text-gray-600">
                        <div>├── 视频教程</div>
                        <div>├── 软件工具</div>
                        <div>├── 技术文档</div>
                        <div>└── 技术文章</div>
                      </div>
                    </div>
                    <div className="pl-4 border-l-2 border-green-200">
                      <Link href="/search" className="text-green-600 hover:text-green-800">搜索功能</Link>
                    </div>
                    <div className="pl-4 border-l-2 border-purple-200">
                      <Link href="/cart" className="text-purple-600 hover:text-purple-800">购物车</Link>
                    </div>
                  </div>
                </div>

                {/* 用户中心 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-center pb-2 border-b border-gray-200">
                    用户中心
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="pl-4 border-l-2 border-orange-200">
                      <Link href="/login" className="text-orange-600 hover:text-orange-800">登录注册</Link>
                      <div className="pl-4 mt-1 space-y-1 text-gray-600">
                        <div>├── 用户登录</div>
                        <div>└── 用户注册</div>
                      </div>
                    </div>
                    <div className="pl-4 border-l-2 border-teal-200">
                      <Link href="/dashboard" className="text-teal-600 hover:text-teal-800">个人中心</Link>
                      <div className="pl-4 mt-1 space-y-1 text-gray-600">
                        <div>├── 个人资料</div>
                        <div>├── 我的收藏</div>
                        <div>├── 消息通知</div>
                        <div>└── VIP会员</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 支持服务 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-center pb-2 border-b border-gray-200">
                    支持服务
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="pl-4 border-l-2 border-red-200">
                      <Link href="/help" className="text-red-600 hover:text-red-800">帮助支持</Link>
                      <div className="pl-4 mt-1 space-y-1 text-gray-600">
                        <div>├── 帮助中心</div>
                        <div>├── 联系我们</div>
                        <div>└── 意见反馈</div>
                      </div>
                    </div>
                    <div className="pl-4 border-l-2 border-indigo-200">
                      <Link href="/about" className="text-indigo-600 hover:text-indigo-800">公司信息</Link>
                      <div className="pl-4 mt-1 space-y-1 text-gray-600">
                        <div>├── 关于我们</div>
                        <div>├── 加入我们</div>
                        <div>├── 合作伙伴</div>
                        <div>├── 服务协议</div>
                        <div>└── 隐私政策</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 快速链接 */}
        <div className="bg-slate-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">快速链接</h2>
              <p className="text-xl text-gray-600">
                常用页面和功能的快速访问入口
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
              {[
                { name: '首页', href: '/', icon: '🏠' },
                { name: '资源', href: '/resources', icon: '📚' },
                { name: '登录', href: '/login', icon: '🔑' },
                { name: 'VIP', href: '/vip', icon: '👑' },
                { name: '帮助', href: '/help', icon: '❓' },
                { name: '联系', href: '/contact', icon: '📞' },
                { name: '关于', href: '/about', icon: 'ℹ️' },
                { name: '招聘', href: '/careers', icon: '💼' },
                { name: '合作', href: '/partners', icon: '🤝' },
                { name: '反馈', href: '/feedback', icon: '💬' },
                { name: '协议', href: '/terms', icon: '📋' },
                { name: '隐私', href: '/privacy', icon: '🔒' }
              ].map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-slate-300 transition-all group"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {link.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-slate-600 transition-colors">
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">找不到您需要的页面？</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              如果您在网站地图中没有找到需要的页面或功能，请联系我们的客服团队，我们将为您提供帮助。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 transition-colors"
              >
                联系客服
              </Link>
              <Link 
                href="/feedback" 
                className="inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-base font-medium rounded-md text-slate-600 bg-white hover:bg-slate-50 transition-colors"
              >
                意见反馈
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
