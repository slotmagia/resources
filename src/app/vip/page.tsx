'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { useAuthStore, useCartStore } from '@/stores';
import { Button, Card, Badge } from '@/components/ui';

// VIP套餐配置
const vipPlans = [
  {
    id: 'monthly',
    name: '月度会员',
    price: 29,
    originalPrice: 39,
    duration: '1个月',
    period: 'month',
    popular: false,
    savings: '节省 ¥10',
    features: [
      '无限制下载资源',
      '高速下载通道',
      '专属客服支持',
      '资源预览功能',
      '去除广告',
      '优先获取新资源'
    ]
  },
  {
    id: 'quarterly',
    name: '季度会员',
    price: 79,
    originalPrice: 117,
    duration: '3个月',
    period: 'quarter',
    popular: true,
    savings: '节省 ¥38',
    features: [
      '包含月度会员所有特权',
      '专属会员标识',
      '每月10GB云存储',
      '专属资源包',
      '会员专区访问',
      '技术交流群'
    ]
  },
  {
    id: 'yearly',
    name: '年度会员',
    price: 299,
    originalPrice: 468,
    duration: '12个月',
    period: 'year',
    popular: false,
    savings: '节省 ¥169',
    features: [
      '包含季度会员所有特权',
      '免费技术咨询',
      '50GB云存储空间',
      '定制化资源推荐',
      '线下活动邀请',
      '年度专属礼品'
    ]
  }
];

// VIP特权详细说明
const vipFeatures = [
  {
    icon: '⚡',
    title: '高速下载',
    description: '专用下载服务器，下载速度提升10倍',
    detail: '告别缓慢下载，VIP专线为您提供极速下载体验'
  },
  {
    icon: '🔓',
    title: '无限下载',
    description: '不限次数，不限文件大小',
    detail: '任意资源随心下载，没有任何限制'
  },
  {
    icon: '👀',
    title: '资源预览',
    description: '下载前预览资源内容',
    detail: '支持图片、视频、文档在线预览，确保资源质量'
  },
  {
    icon: '🎯',
    title: '专属资源',
    description: '会员专享优质资源',
    detail: '独家精选资源，仅向VIP会员开放'
  },
  {
    icon: '☁️',
    title: '云端存储',
    description: '个人云盘空间',
    detail: '安全可靠的云端存储，随时随地访问您的文件'
  },
  {
    icon: '🔔',
    title: '优先通知',
    description: '新资源第一时间推送',
    detail: '最新最热门资源抢先获取，不错过任何精彩内容'
  }
];

// 常见问题
const faqs = [
  {
    question: 'VIP会员有哪些特权？',
    answer: 'VIP会员享有无限下载、高速通道、资源预览、专属客服、去广告、云存储等多项特权，让您的使用体验更加便捷高效。'
  },
  {
    question: '如何开通VIP会员？',
    answer: '选择适合的套餐后，点击立即开通，支持支付宝、微信支付、银行卡等多种支付方式，支付成功后即可享受VIP特权。'
  },
  {
    question: 'VIP会员可以退款吗？',
    answer: '我们提供7天无理由退款服务。如果您在开通后7天内不满意，可以申请全额退款。'
  },
  {
    question: '会员到期后会自动续费吗？',
    answer: '默认不会自动续费。您可以在会员到期前手动续费，或在个人设置中开启自动续费功能。'
  }
];

export default function VipPage() {
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const [selectedPlan, setSelectedPlan] = useState('quarterly');

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handlePurchase = (plan: typeof vipPlans[0]) => {
    if (!isAuthenticated) {
      // 跳转到登录页面
      window.location.href = '/login?redirect=/vip';
      return;
    }

    // 添加到购物车
    addItem({
      resourceId: `vip-${plan.id}`,
      title: `VIP会员 - ${plan.name}`,
      price: plan.price,
      thumbnail: 'https://via.placeholder.com/80x80?text=VIP'
    });

    // 直接跳转到购物车
    window.location.href = '/cart';
  };

  return (
    <MainLayout>
      <div className="bg-gray-50">
        {/* Hero区域 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                升级为VIP会员
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                解锁全部功能，享受极致体验
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center text-blue-100">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  18,000+ 优质资源
                </div>
                <div className="flex items-center text-blue-100">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  无限制下载
                </div>
                <div className="flex items-center text-blue-100">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  极速下载体验
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 价格方案 */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">选择适合您的套餐</h2>
            <p className="text-lg text-gray-600">所有套餐都享受相同的VIP特权，只是使用时长不同</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {vipPlans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative p-8 text-center transition-all duration-300 cursor-pointer ${
                  plan.popular 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : selectedPlan === plan.id 
                      ? 'border-blue-300 shadow-md' 
                      : 'hover:shadow-md hover:scale-102'
                }`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      最受欢迎
                    </Badge>
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-4xl font-bold text-gray-900">¥{plan.price}</span>
                    <span className="text-gray-500 ml-2">/{plan.duration}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm text-gray-400 line-through">¥{plan.originalPrice}</span>
                    <Badge variant="secondary" className="text-green-600">
                      {plan.savings}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handlePurchase(plan)}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : ''
                  }`}
                  variant={plan.popular ? 'primary' : 'outline'}
                >
                  {isAuthenticated ? '立即开通' : '登录后开通'}
                </Button>
              </Card>
            ))}
          </div>

          {/* 支付方式 */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">支持多种支付方式，安全便捷</p>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center text-gray-500">
                <div className="w-8 h-8 bg-blue-500 rounded mr-2 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">支</span>
                </div>
                支付宝
              </div>
              <div className="flex items-center text-gray-500">
                <div className="w-8 h-8 bg-green-500 rounded mr-2 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">微</span>
                </div>
                微信支付
              </div>
              <div className="flex items-center text-gray-500">
                <div className="w-8 h-8 bg-gray-600 rounded mr-2 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">卡</span>
                </div>
                银行卡
              </div>
            </div>
          </div>
        </div>

        {/* VIP特权详情 */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">VIP特权详情</h2>
              <p className="text-lg text-gray-600">全方位提升您的使用体验</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vipFeatures.map((feature, index) => (
                <div key={index} className="text-center p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-3">{feature.description}</p>
                  <p className="text-sm text-gray-500">{feature.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 用户评价 */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">用户真实评价</h2>
              <p className="text-lg text-gray-600">看看其他用户怎么说</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: '张开发',
                  role: '前端工程师',
                  avatar: '',
                  rating: 5,
                  comment: '下载速度真的很快，资源质量也很高。开通VIP后工作效率提升了很多！'
                },
                {
                  name: '李设计',
                  role: 'UI设计师',
                  avatar: '',
                  rating: 5,
                  comment: '专属资源很棒，都是精心筛选的高质量内容。云存储功能也很实用。'
                },
                {
                  name: '王产品',
                  role: '产品经理',
                  avatar: '',
                  rating: 5,
                  comment: '客服响应很及时，技术交流群里的讨论也很有价值。物超所值！'
                }
              ].map((review, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      <span className="text-gray-600 font-medium">{review.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{review.name}</div>
                      <div className="text-sm text-gray-500">{review.role}</div>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* 常见问题 */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">常见问题</h2>
              <p className="text-lg text-gray-600">为您解答VIP会员相关疑问</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA区域 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">现在就开始您的VIP之旅</h2>
            <p className="text-xl text-blue-100 mb-8">加入数万名满意用户，享受极致体验</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handlePurchase(vipPlans.find(p => p.id === selectedPlan)!)}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                立即开通VIP
              </Button>
              <Link href="/resources">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  先浏览资源
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
