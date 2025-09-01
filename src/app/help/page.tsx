'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { Card, Input, Button } from '@/components/ui';

// 帮助分类
const helpCategories = [
  {
    id: 'account',
    title: '账户相关',
    icon: '👤',
    description: '注册、登录、个人资料等账户问题',
    count: 12
  },
  {
    id: 'download',
    title: '下载问题',
    icon: '⬇️',
    description: '资源下载、速度、格式等相关问题',
    count: 18
  },
  {
    id: 'payment',
    title: '支付购买',
    icon: '💳',
    description: '支付方式、订单、退款等购买问题',
    count: 15
  },
  {
    id: 'vip',
    title: 'VIP会员',
    icon: '👑',
    description: 'VIP权益、开通、续费等会员问题',
    count: 10
  },
  {
    id: 'technical',
    title: '技术支持',
    icon: '🔧',
    description: '网站使用、功能操作等技术问题',
    count: 8
  },
  {
    id: 'other',
    title: '其他问题',
    icon: '❓',
    description: '其他未分类的常见问题',
    count: 6
  }
];

// 常见问题
const faqs = [
  {
    id: 1,
    category: 'account',
    question: '如何注册账户？',
    answer: '点击右上角"注册"按钮，填写邮箱和密码即可完成注册。我们也支持第三方账号快速注册。',
    views: 1250
  },
  {
    id: 2,
    category: 'account',
    question: '忘记密码怎么办？',
    answer: '在登录页面点击"忘记密码"，输入注册邮箱，我们会发送重置密码的链接到您的邮箱。',
    views: 980
  },
  {
    id: 3,
    category: 'download',
    question: '下载速度很慢怎么办？',
    answer: '下载速度受网络环境影响。建议：1）检查网络连接；2）尝试更换下载时间；3）考虑开通VIP享受高速下载。',
    views: 2150
  },
  {
    id: 4,
    category: 'download',
    question: '支持哪些文件格式？',
    answer: '我们支持常见的所有格式：图片(JPG/PNG/GIF)、文档(PDF/DOC/PPT)、视频(MP4/AVI/MOV)、压缩包(ZIP/RAR)等。',
    views: 1680
  },
  {
    id: 5,
    category: 'payment',
    question: '支持哪些支付方式？',
    answer: '支持支付宝、微信支付、银行卡、PayPal等多种支付方式，安全便捷。',
    views: 1420
  },
  {
    id: 6,
    category: 'payment',
    question: '可以申请退款吗？',
    answer: '我们提供7天无理由退款服务。如果您对购买的资源不满意，可在7天内申请全额退款。',
    views: 890
  },
  {
    id: 7,
    category: 'vip',
    question: 'VIP会员有什么特权？',
    answer: 'VIP会员享有：无限下载、高速通道、资源预览、专属客服、去广告、云存储等多项特权。',
    views: 3200
  },
  {
    id: 8,
    category: 'vip',
    question: 'VIP到期后会自动续费吗？',
    answer: '默认不会自动续费。您可以在个人设置中开启自动续费功能，避免忘记续费导致服务中断。',
    views: 1560
  },
  {
    id: 9,
    category: 'technical',
    question: '网站打不开怎么办？',
    answer: '请尝试：1）刷新页面；2）清除浏览器缓存；3）更换浏览器；4）检查网络连接。如仍无法解决请联系客服。',
    views: 750
  },
  {
    id: 10,
    category: 'technical',
    question: '如何联系客服？',
    answer: '您可以通过以下方式联系客服：1）在线客服（工作日9:00-18:00）；2）发送邮件至support@ziyuanba.com；3）VIP会员专属客服电话。',
    views: 2850
  }
];

// 快速操作
const quickActions = [
  {
    title: '提交工单',
    description: '遇到问题？向我们的技术团队提交工单',
    icon: '🎫',
    action: 'ticket'
  },
  {
    title: '联系客服',
    description: '在线客服为您提供实时帮助',
    icon: '💬',
    action: 'chat'
  },
  {
    title: '视频教程',
    description: '观看详细的功能使用教程',
    icon: '📹',
    action: 'tutorial'
  },
  {
    title: '社区论坛',
    description: '与其他用户交流经验和心得',
    icon: '🏛️',
    action: 'forum'
  }
];

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // 筛选FAQ
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (faqId: number) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'ticket':
        alert('工单系统正在开发中，请通过其他方式联系我们');
        break;
      case 'chat':
        alert('在线客服功能正在开发中');
        break;
      case 'tutorial':
        alert('视频教程即将上线');
        break;
      case 'forum':
        alert('社区论坛功能开发中');
        break;
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50">
        {/* 页面头部 */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-12">
            {/* 面包屑导航 */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-gray-700">首页</Link>
              <span>/</span>
              <span className="text-gray-900">帮助中心</span>
            </nav>

            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                帮助中心
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                为您提供详细的使用指南和问题解答
              </p>

              {/* 搜索框 */}
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="搜索问题或关键词..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* 快速操作 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">快速获取帮助</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Card 
                  key={index}
                  className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleQuickAction(action.action)}
                >
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* 帮助分类 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">问题分类</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category) => (
                <Card 
                  key={category.id}
                  className={`p-6 cursor-pointer transition-all ${
                    selectedCategory === category.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                      <span className="text-xs text-blue-600">{category.count} 个问题</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* 显示全部分类按钮 */}
            {selectedCategory !== 'all' && (
              <div className="text-center mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategory('all')}
                >
                  显示全部分类
                </Button>
              </div>
            )}
          </div>

          {/* 常见问题 */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === 'all' ? '常见问题' : 
                 helpCategories.find(c => c.id === selectedCategory)?.title || '常见问题'}
              </h2>
              <span className="text-sm text-gray-500">
                共 {filteredFaqs.length} 个问题
              </span>
            </div>

            {filteredFaqs.length > 0 ? (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <Card key={faq.id} className="overflow-hidden">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {faq.views} 次查看
                          </div>
                        </div>
                        <div className="ml-4">
                          <svg 
                            className={`w-5 h-5 text-gray-400 transform transition-transform ${
                              expandedFaq === faq.id ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    
                    {expandedFaq === faq.id && (
                      <div className="px-6 pb-6 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed pt-4">{faq.answer}</p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="text-sm text-gray-500">
                            这个答案有帮助吗？
                          </div>
                          <div className="flex space-x-2">
                            <button className="flex items-center text-sm text-gray-500 hover:text-green-600">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              </svg>
                              有用
                            </button>
                            <button className="flex items-center text-sm text-gray-500 hover:text-red-600">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                              </svg>
                              无用
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关问题</h3>
                <p className="text-gray-500 mb-6">
                  没有找到与 &quot;{searchQuery}&quot; 相关的问题，试试其他关键词
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                >
                  清除搜索
                </Button>
              </div>
            )}
          </div>

          {/* 联系我们 */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white text-center mt-16">
            <h2 className="text-2xl font-bold mb-4">没有找到您需要的答案？</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              我们的客服团队随时为您提供帮助，您可以通过多种方式联系我们
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleQuickAction('chat')}
              >
                在线客服
              </Button>
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => window.location.href = 'mailto:support@ziyuanba.com'}
              >
                发送邮件
              </Button>
            </div>
            <div className="mt-6 text-sm text-blue-200">
              客服时间：工作日 9:00 - 18:00 | 邮箱：support@ziyuanba.com
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
