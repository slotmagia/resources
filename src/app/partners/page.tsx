'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

interface Partner {
  id: string;
  name: string;
  logo: string;
  category: string;
  description: string;
  website?: string;
  partnership: string;
  since: string;
  featured?: boolean;
}

interface PartnershipType {
  title: string;
  description: string;
  benefits: string[];
  icon: React.ReactNode;
  color: string;
}

interface ContactFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  partnershipType: string;
  message: string;
}

export default function PartnersPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [formData, setFormData] = useState<ContactFormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    partnershipType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const categories = [
    { value: 'all', label: '全部合作伙伴' },
    { value: 'tech', label: '技术服务商' },
    { value: 'content', label: '内容提供商' },
    { value: 'platform', label: '平台合作' },
    { value: 'education', label: '教育机构' },
    { value: 'enterprise', label: '企业客户' }
  ];

  const partners: Partner[] = [
    {
      id: '1',
      name: '阿里云',
      logo: '/api/placeholder/120/60',
      category: 'tech',
      description: '提供稳定可靠的云计算服务，支撑平台高并发访问需求',
      website: 'https://aliyun.com',
      partnership: '云服务合作',
      since: '2020',
      featured: true
    },
    {
      id: '2',
      name: '腾讯云',
      logo: '/api/placeholder/120/60',
      category: 'tech',
      description: 'CDN加速和存储服务提供商，优化用户下载体验',
      website: 'https://cloud.tencent.com',
      partnership: 'CDN服务合作',
      since: '2021'
    },
    {
      id: '3',
      name: '慕课网',
      logo: '/api/placeholder/120/60',
      category: 'content',
      description: '优质编程教育内容合作伙伴，提供专业技术课程',
      website: 'https://imooc.com',
      partnership: '内容授权合作',
      since: '2021',
      featured: true
    },
    {
      id: '4',
      name: '极客时间',
      logo: '/api/placeholder/120/60',
      category: 'content',
      description: '技术知识付费平台，共同推广优质技术内容',
      website: 'https://time.geekbang.org',
      partnership: '内容分发合作',
      since: '2022'
    },
    {
      id: '5',
      name: 'GitHub',
      logo: '/api/placeholder/120/60',
      category: 'platform',
      description: '全球最大的代码托管平台，开源项目资源合作',
      website: 'https://github.com',
      partnership: '开源项目合作',
      since: '2020',
      featured: true
    },
    {
      id: '6',
      name: 'Stack Overflow',
      logo: '/api/placeholder/120/60',
      category: 'platform',
      description: '程序员问答社区，技术文档和解决方案分享',
      website: 'https://stackoverflow.com',
      partnership: '技术社区合作',
      since: '2022'
    },
    {
      id: '7',
      name: '清华大学',
      logo: '/api/placeholder/120/60',
      category: 'education',
      description: '顶尖学府合作，提供高质量学术资源和研究成果',
      partnership: '学术资源合作',
      since: '2021',
      featured: true
    },
    {
      id: '8',
      name: '北京理工大学',
      logo: '/api/placeholder/120/60',
      category: 'education',
      description: '工科强校，在人工智能和计算机领域深度合作',
      partnership: '科研合作',
      since: '2022'
    },
    {
      id: '9',
      name: '字节跳动',
      logo: '/api/placeholder/120/60',
      category: 'enterprise',
      description: '互联网科技巨头，企业级资源和技术解决方案合作',
      partnership: '企业服务合作',
      since: '2021',
      featured: true
    },
    {
      id: '10',
      name: '美团',
      logo: '/api/placeholder/120/60',
      category: 'enterprise',
      description: '生活服务平台，在技术培训和人才发展方面合作',
      partnership: '人才培养合作',
      since: '2022'
    },
    {
      id: '11',
      name: '百度智能云',
      logo: '/api/placeholder/120/60',
      category: 'tech',
      description: 'AI技术服务提供商，智能推荐和内容审核合作',
      partnership: 'AI技术合作',
      since: '2023'
    },
    {
      id: '12',
      name: 'Coursera',
      logo: '/api/placeholder/120/60',
      category: 'content',
      description: '国际在线教育平台，全球优质课程资源引入',
      partnership: '国际课程合作',
      since: '2023'
    }
  ];

  const partnershipTypes: PartnershipType[] = [
    {
      title: '内容合作',
      description: '与内容创作者和教育机构合作，提供优质学习资源',
      benefits: [
        '内容授权和分发',
        '版权保护支持',
        '收益分成机制',
        '品牌联合推广'
      ],
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      title: '技术合作',
      description: '与技术服务商合作，提升平台技术能力和用户体验',
      benefits: [
        '技术服务支持',
        '优惠价格政策',
        '技术培训交流',
        '联合解决方案'
      ],
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'green'
    },
    {
      title: '渠道合作',
      description: '与平台和渠道商合作，扩大用户覆盖和市场影响力',
      benefits: [
        '流量互换支持',
        '用户资源共享',
        '营销活动联合',
        '数据分析合作'
      ],
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      ),
      color: 'purple'
    },
    {
      title: '企业合作',
      description: '与企业客户合作，提供定制化资源和培训服务',
      benefits: [
        '企业定制服务',
        '批量采购优惠',
        '专属客服支持',
        '培训解决方案'
      ],
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'orange'
    }
  ];

  const stats = [
    { label: '合作伙伴', value: '200+', icon: '🤝' },
    { label: '覆盖国家', value: '50+', icon: '🌍' },
    { label: '合作项目', value: '500+', icon: '📋' },
    { label: '服务用户', value: '100万+', icon: '👥' }
  ];

  const filteredPartners = selectedCategory === 'all' 
    ? partners 
    : partners.filter(partner => partner.category === selectedCategory);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('提交合作申请:', formData);
      
      setSubmitStatus('success');
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        partnershipType: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">合作伙伴</h1>
              <p className="text-2xl text-teal-100 max-w-3xl mx-auto leading-relaxed mb-8">
                携手共进，共创未来。与全球优秀企业和机构建立战略合作关系
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-teal-200 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 合作模式 */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">合作模式</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              我们提供多种合作模式，满足不同类型合作伙伴的需求
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partnershipTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className={cn(
                  'w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4',
                  type.color === 'blue' && 'bg-blue-100 text-blue-600',
                  type.color === 'green' && 'bg-green-100 text-green-600',
                  type.color === 'purple' && 'bg-purple-100 text-purple-600',
                  type.color === 'orange' && 'bg-orange-100 text-orange-600'
                )}>
                  {type.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{type.title}</h3>
                <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed">{type.description}</p>
                <ul className="space-y-2">
                  {type.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <svg className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 合作伙伴展示 */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">我们的合作伙伴</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                与行业领先企业建立深度合作关系，共同推动行业发展
              </p>
            </div>

            {/* 分类筛选 */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={cn(
                    'px-6 py-2 rounded-full text-sm font-medium transition-colors',
                    selectedCategory === category.value
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* 特色合作伙伴 */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">特色合作伙伴</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {partners.filter(p => p.featured).map((partner) => (
                  <div key={partner.id} className="bg-gray-50 rounded-lg p-6 border-2 border-teal-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                        LOGO
                      </div>
                      <span className="px-3 py-1 bg-teal-100 text-teal-600 text-xs font-medium rounded-full">
                        特色合作
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{partner.name}</h4>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">{partner.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{partner.partnership}</span>
                      <span>合作始于 {partner.since}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 所有合作伙伴 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPartners.filter(p => !p.featured).map((partner) => (
                <div key={partner.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="w-20 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs mb-4 mx-auto">
                    LOGO
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 text-center">{partner.name}</h4>
                  <p className="text-gray-600 text-sm mb-3 text-center leading-relaxed">{partner.description}</p>
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {partner.partnership}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 成功案例 */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">成功案例</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              通过深度合作，我们与合作伙伴共同创造了显著的价值
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">内容生态建设</h3>
              <p className="text-gray-600 text-sm mb-4">
                与慕课网、极客时间等优质内容平台合作，建立了覆盖前端、后端、移动开发等多个技术领域的完整内容生态。
              </p>
              <div className="text-sm text-gray-500">
                <div className="flex justify-between mb-1">
                  <span>合作课程数量</span>
                  <span className="font-semibold text-blue-600">5000+</span>
                </div>
                <div className="flex justify-between">
                  <span>用户学习时长</span>
                  <span className="font-semibold text-blue-600">100万小时</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">技术架构升级</h3>
              <p className="text-gray-600 text-sm mb-4">
                与阿里云、腾讯云等云服务商深度合作，完成了平台技术架构的全面升级，支撑了用户规模的快速增长。
              </p>
              <div className="text-sm text-gray-500">
                <div className="flex justify-between mb-1">
                  <span>系统稳定性</span>
                  <span className="font-semibold text-green-600">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span>响应速度提升</span>
                  <span className="font-semibold text-green-600">300%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">企业培训服务</h3>
              <p className="text-gray-600 text-sm mb-4">
                与字节跳动、美团等知名企业合作，为其员工提供定制化的技术培训服务，助力企业人才发展。
              </p>
              <div className="text-sm text-gray-500">
                <div className="flex justify-between mb-1">
                  <span>服务企业数量</span>
                  <span className="font-semibold text-purple-600">200+</span>
                </div>
                <div className="flex justify-between">
                  <span>培训员工数量</span>
                  <span className="font-semibold text-purple-600">5万+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 合作申请 */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">成为合作伙伴</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  期待与您建立合作关系，共同创造更大的价值
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* 合作优势 */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">合作优势</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 flex-shrink-0">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">庞大用户基础</h4>
                        <p className="text-gray-600 text-sm">50万+注册用户，覆盖全国各地的技术从业者</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 flex-shrink-0">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">专业技术团队</h4>
                        <p className="text-gray-600 text-sm">经验丰富的技术和运营团队，提供专业支持</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 flex-shrink-0">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">多元化合作模式</h4>
                        <p className="text-gray-600 text-sm">灵活的合作方式，满足不同合作伙伴的需求</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 flex-shrink-0">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">共赢收益模式</h4>
                        <p className="text-gray-600 text-sm">透明的收益分成机制，实现合作共赢</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 申请表单 */}
                <div className="bg-gray-50 rounded-lg p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">合作申请</h3>
                  
                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex">
                        <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="ml-3 text-sm text-green-700">
                          申请提交成功！我们会在3个工作日内与您联系。
                        </p>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex">
                        <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="ml-3 text-sm text-red-700">
                          提交失败，请稍后重试。
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="公司名称"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="请输入公司名称"
                        required
                      />
                      <Input
                        label="联系人"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        placeholder="请输入联系人姓名"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="邮箱地址"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="请输入邮箱地址"
                        required
                      />
                      <Input
                        label="联系电话"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="请输入联系电话"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        合作类型
                      </label>
                      <select
                        name="partnershipType"
                        value={formData.partnershipType}
                        onChange={handleInputChange}
                        required
                        className={cn(
                          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        )}
                      >
                        <option value="">请选择合作类型</option>
                        <option value="content">内容合作</option>
                        <option value="tech">技术合作</option>
                        <option value="channel">渠道合作</option>
                        <option value="enterprise">企业合作</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        合作需求
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="请详细描述您的合作需求和期望..."
                        required
                        className={cn(
                          'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none'
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      loading={isSubmitting}
                      size="lg"
                      className="w-full bg-teal-600 hover:bg-teal-700 focus:ring-teal-500"
                    >
                      {isSubmitting ? '提交中...' : '提交申请'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="bg-teal-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">联系我们</h3>
            <p className="text-gray-600 mb-6">
              如有任何合作相关问题，欢迎随时与我们联系
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div>
                <div className="text-teal-600 font-semibold">商务合作</div>
                <div className="text-gray-600">business@resources.com</div>
              </div>
              <div>
                <div className="text-teal-600 font-semibold">技术合作</div>
                <div className="text-gray-600">tech@resources.com</div>
              </div>
              <div>
                <div className="text-teal-600 font-semibold">联系电话</div>
                <div className="text-gray-600">400-123-4567</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
