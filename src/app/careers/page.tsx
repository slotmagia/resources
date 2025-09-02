'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  isHot?: boolean;
}

interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface CompanyValue {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);

  const departments = [
    { value: 'all', label: '全部职位' },
    { value: 'tech', label: '技术研发' },
    { value: 'product', label: '产品运营' },
    { value: 'design', label: '设计创意' },
    { value: 'business', label: '商务市场' }
  ];

  const jobPositions: JobPosition[] = [
    {
      id: '1',
      title: '高级前端工程师',
      department: 'tech',
      location: '北京',
      type: '全职',
      experience: '3-5年',
      salary: '20K-35K',
      description: '负责资源吧前端产品的开发和优化，提升用户体验。',
      requirements: [
        '本科及以上学历，计算机相关专业',
        '3年以上前端开发经验',
        '精通React、TypeScript、Next.js等技术栈',
        '熟悉现代前端工程化工具和流程',
        '具备良好的代码规范和团队协作能力',
        '对用户体验有深刻理解'
      ],
      responsibilities: [
        '负责Web前端产品的设计、开发和维护',
        '与产品经理、设计师协作，实现产品功能',
        '优化前端性能，提升用户体验',
        '参与技术方案设计和代码审查',
        '指导初级工程师，推动技术团队成长'
      ],
      benefits: [
        '具有竞争力的薪酬待遇',
        '完善的五险一金',
        '年终奖金',
        '技术培训和成长机会'
      ],
      isHot: true
    },
    {
      id: '2',
      title: '后端开发工程师',
      department: 'tech',
      location: '北京',
      type: '全职',
      experience: '2-4年',
      salary: '18K-30K',
      description: '负责后端服务架构设计和开发，保障系统稳定性和性能。',
      requirements: [
        '本科及以上学历，计算机相关专业',
        '2年以上后端开发经验',
        '精通Java/Python/Go等编程语言',
        '熟悉Spring Boot、微服务架构',
        '熟悉MySQL、Redis、消息队列等技术',
        '具备良好的系统设计能力'
      ],
      responsibilities: [
        '负责后端API接口设计和开发',
        '参与系统架构设计和优化',
        '数据库设计和性能优化',
        '解决系统性能瓶颈和稳定性问题',
        '编写技术文档和单元测试'
      ],
      benefits: [
        '具有竞争力的薪酬待遇',
        '完善的五险一金',
        '年终奖金',
        '技术培训和成长机会'
      ]
    },
    {
      id: '3',
      title: '产品经理',
      department: 'product',
      location: '北京',
      type: '全职',
      experience: '3-5年',
      salary: '22K-38K',
      description: '负责产品规划和需求分析，推动产品迭代和优化。',
      requirements: [
        '本科及以上学历，相关专业背景',
        '3年以上互联网产品经验',
        '具备优秀的需求分析和产品设计能力',
        '熟悉用户研究和数据分析方法',
        '具备良好的沟通协调能力',
        '对资源分享类产品有深入理解'
      ],
      responsibilities: [
        '负责产品需求调研和分析',
        '制定产品规划和功能设计',
        '协调技术、设计团队推进产品开发',
        '跟踪产品数据，优化产品体验',
        '竞品分析和市场调研'
      ],
      benefits: [
        '具有竞争力的薪酬待遇',
        '完善的五险一金',
        '年终奖金',
        '产品培训和成长机会'
      ],
      isHot: true
    },
    {
      id: '4',
      title: 'UI/UX设计师',
      department: 'design',
      location: '北京',
      type: '全职',
      experience: '2-4年',
      salary: '15K-25K',
      description: '负责产品界面设计和用户体验优化，打造优秀的视觉效果。',
      requirements: [
        '本科及以上学历，设计相关专业',
        '2年以上UI/UX设计经验',
        '精通Figma、Sketch、Adobe系列等设计工具',
        '具备良好的视觉设计和交互设计能力',
        '对用户体验有深刻理解',
        '具备前端基础知识者优先'
      ],
      responsibilities: [
        '负责产品界面设计和交互设计',
        '制定设计规范和组件库',
        '用户体验研究和优化',
        '与产品、开发团队协作推进设计落地',
        '参与产品原型设计和用户测试'
      ],
      benefits: [
        '具有竞争力的薪酬待遇',
        '完善的五险一金',
        '年终奖金',
        '设计培训和成长机会'
      ]
    },
    {
      id: '5',
      title: '运营专员',
      department: 'product',
      location: '北京',
      type: '全职',
      experience: '1-3年',
      salary: '12K-20K',
      description: '负责平台内容运营和用户增长，提升用户活跃度。',
      requirements: [
        '本科及以上学历，市场营销或相关专业',
        '1年以上互联网运营经验',
        '具备优秀的文案策划能力',
        '熟悉社交媒体运营和推广',
        '数据敏感度高，具备分析能力',
        '对内容运营有浓厚兴趣'
      ],
      responsibilities: [
        '负责平台内容策划和运营',
        '用户增长策略制定和执行',
        '社交媒体运营和推广',
        '用户活动策划和组织',
        '运营数据分析和优化'
      ],
      benefits: [
        '具有竞争力的薪酬待遇',
        '完善的五险一金',
        '年终奖金',
        '运营培训和成长机会'
      ]
    },
    {
      id: '6',
      title: '商务拓展经理',
      department: 'business',
      location: '北京',
      type: '全职',
      experience: '3-5年',
      salary: '20K-35K',
      description: '负责商务合作和渠道拓展，推动业务增长。',
      requirements: [
        '本科及以上学历，商务或相关专业',
        '3年以上商务拓展经验',
        '具备优秀的商务谈判能力',
        '熟悉互联网行业商务模式',
        '具备良好的沟通协调能力',
        '有资源整合和渠道拓展经验'
      ],
      responsibilities: [
        '负责商务合作伙伴的开发和维护',
        '制定商务拓展策略和计划',
        '商务合同谈判和签署',
        '渠道合作和资源整合',
        '市场调研和竞品分析'
      ],
      benefits: [
        '具有竞争力的薪酬待遇',
        '完善的五险一金',
        '年终奖金 + 业绩提成',
        '商务培训和成长机会'
      ]
    }
  ];

  const benefits: Benefit[] = [
    {
      title: '竞争薪酬',
      description: '行业领先的薪酬水平，年终奖金，股权激励',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: '完善保障',
      description: '五险一金，补充医疗保险，年度体检',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: '弹性办公',
      description: '灵活工作时间，远程办公支持，带薪年假',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: '学习成长',
      description: '技术培训，会议学习，图书津贴，技能提升',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: '团队活动',
      description: '团建活动，生日会，节日福利，员工聚餐',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: '办公环境',
      description: '现代化办公空间，免费茶水咖啡，健身房',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  const companyValues: CompanyValue[] = [
    {
      title: '创新驱动',
      description: '鼓励创新思维，支持新技术探索，推动产品持续进步',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: '团队协作',
      description: '倡导开放沟通，重视团队合作，共同实现目标',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      title: '持续学习',
      description: '提供学习机会，支持个人成长，建设学习型组织',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: '结果导向',
      description: '注重工作成果，追求卓越品质，实现共同价值',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    }
  ];

  const filteredJobs = selectedDepartment === 'all' 
    ? jobPositions 
    : jobPositions.filter(job => job.department === selectedDepartment);

  return (
    <MainLayout>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">加入我们</h1>
              <p className="text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed mb-8">
                与优秀的人一起工作，在资源吧实现你的职业梦想
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                  查看职位
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                  了解文化
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 公司文化 */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">我们的文化</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              在资源吧，我们相信每个人都有无限的潜能，我们致力于创造一个让每个人都能发光发热的环境
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center group hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <div className="text-orange-600">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 员工福利 */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">员工福利</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                我们提供全面的福利保障，让你在工作中无后顾之忧
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 职位列表 */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">开放职位</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              我们正在寻找有才华、有激情的人才加入我们的团队
            </p>
          </div>

          {/* 部门筛选 */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {departments.map((dept) => (
              <button
                key={dept.value}
                onClick={() => setSelectedDepartment(dept.value)}
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-medium transition-colors',
                  selectedDepartment === dept.value
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                )}
              >
                {dept.label}
              </button>
            ))}
          </div>

          {/* 职位卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      {job.isHot && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                          热招
                        </span>
                      )}
                    </div>
                    <p className="text-orange-600 font-medium text-sm">{job.department === 'tech' ? '技术研发' : job.department === 'product' ? '产品运营' : job.department === 'design' ? '设计创意' : '商务市场'}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.type} · {job.experience}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.salary}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedJob(job)}
                >
                  查看详情
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* 招聘流程 */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">招聘流程</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                我们的招聘流程简单透明，让你更好地了解我们
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '1', title: '投递简历', desc: '在线投递简历或发送至邮箱' },
                { step: '2', title: '简历筛选', desc: 'HR初步筛选，3个工作日内回复' },
                { step: '3', title: '面试沟通', desc: '技术面试 + HR面试' },
                { step: '4', title: '入职报到', desc: '发放offer，办理入职手续' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-orange-600">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 联系我们 */}
        <div className="bg-orange-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">准备好加入我们了吗？</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              如果你对我们的职位感兴趣，或者想了解更多信息，欢迎联系我们
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:hr@resources.com" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                发送简历
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 border border-orange-600 text-base font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50 transition-colors"
              >
                联系HR
              </a>
            </div>
            <div className="mt-8 text-gray-600">
              <p>招聘邮箱：hr@resources.com</p>
              <p>联系电话：400-123-4567</p>
            </div>
          </div>
        </div>
      </div>

      {/* 职位详情弹窗 */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                    {selectedJob.isHot && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                        热招
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{selectedJob.location}</span>
                    <span>{selectedJob.type}</span>
                    <span>{selectedJob.experience}</span>
                    <span className="font-semibold text-orange-600">{selectedJob.salary}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">职位描述</h3>
                <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">岗位职责</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {selectedJob.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">任职要求</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {selectedJob.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">福利待遇</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {selectedJob.benefits.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button size="lg" className="flex-1">
                  立即申请
                </Button>
                <Button size="lg" variant="outline" onClick={() => setSelectedJob(null)}>
                  关闭
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

