'use client';

import { MainLayout } from '@/components/layout';

interface TeamMember {
  name: string;
  position: string;
  avatar: string;
  description: string;
  social?: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Value {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function AboutPage() {
  const teamMembers: TeamMember[] = [
    {
      name: '张伟',
      position: '创始人 & CEO',
      avatar: '/api/placeholder/150/150',
      description: '10年互联网产品经验，致力于为用户提供优质的数字资源服务。',
      social: {
        email: 'zhangwei@resources.com',
        linkedin: '#'
      }
    },
    {
      name: '李娜',
      position: '技术总监',
      avatar: '/api/placeholder/150/150',
      description: '资深全栈工程师，负责平台技术架构和产品开发。',
      social: {
        email: 'lina@resources.com',
        github: '#'
      }
    },
    {
      name: '王强',
      position: '运营总监',
      avatar: '/api/placeholder/150/150',
      description: '专注用户体验和内容运营，确保平台资源质量。',
      social: {
        email: 'wangqiang@resources.com',
        linkedin: '#'
      }
    },
    {
      name: '刘芳',
      position: '设计总监',
      avatar: '/api/placeholder/150/150',
      description: 'UI/UX设计专家，打造简洁美观的用户界面。',
      social: {
        email: 'liufang@resources.com',
        linkedin: '#'
      }
    }
  ];

  const milestones: Milestone[] = [
    {
      year: '2020',
      title: '公司成立',
      description: '资源吧正式成立，开始为用户提供数字资源下载服务',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      year: '2021',
      title: '用户突破10万',
      description: '注册用户数突破10万，日活跃用户超过5000人',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      year: '2022',
      title: 'VIP服务上线',
      description: '推出VIP会员服务，提供更多优质资源和专属功能',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      year: '2023',
      title: '资源库扩展',
      description: '资源库扩展至50万+优质资源，覆盖更多专业领域',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      year: '2024',
      title: '全新升级',
      description: '平台全面升级，引入AI推荐系统，提升用户体验',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  const values: Value[] = [
    {
      title: '用户至上',
      description: '始终以用户需求为中心，提供最优质的服务体验',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: '品质保证',
      description: '严格筛选每一个资源，确保内容的质量和实用性',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: '持续创新',
      description: '不断探索新技术，优化产品功能和用户体验',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: '开放共享',
      description: '促进知识共享，让优质资源惠及更多用户',
      icon: (
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      )
    }
  ];

  const stats = [
    { label: '注册用户', value: '50万+', icon: '👥' },
    { label: '优质资源', value: '100万+', icon: '📚' },
    { label: '日均下载', value: '10万+', icon: '⬇️' },
    { label: '服务天数', value: '1500+', icon: '📅' }
  ];

  return (
    <MainLayout>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">关于资源吧</h1>
              <p className="text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
                致力于打造最专业的数字资源分享平台，为用户提供优质、安全、便捷的资源下载服务
              </p>
            </div>
          </div>
        </div>

        {/* 公司介绍 */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">我们的故事</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  资源吧成立于2020年，源于创始团队对优质数字资源获取难题的深刻理解。我们发现，在信息爆炸的时代，用户往往难以找到真正有价值、高质量的学习和工作资源。
                </p>
                <p>
                  基于这一洞察，我们决定打造一个专业的资源分享平台，通过严格的内容审核机制、智能的分类系统和便捷的下载体验，让每一位用户都能轻松获得所需的优质资源。
                </p>
                <p>
                  经过四年的发展，我们已经服务了超过50万用户，积累了100万+优质资源，涵盖软件工具、视频教程、技术文档、设计素材等多个领域。
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className="text-2xl font-bold text-emerald-600 mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 核心价值观 */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">核心价值观</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                我们的价值观指导着我们的每一个决策和行动
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                    <div className="text-emerald-600">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 发展历程 */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">发展历程</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              从初创到成长，我们一直在为用户创造更大价值
            </p>
          </div>
          <div className="relative">
            {/* 时间线 */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-emerald-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  {/* 时间点 */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-lg"></div>
                  
                  {/* 内容卡片 */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mr-3">
                          {milestone.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-emerald-600">{milestone.year}</div>
                          <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                        </div>
                      </div>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 团队介绍 */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">核心团队</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                我们拥有一支经验丰富、充满激情的专业团队
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 text-center group hover:shadow-lg transition-shadow">
                  <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-600 text-2xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-emerald-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.description}</p>
                  
                  {member.social && (
                    <div className="flex justify-center space-x-3">
                      {member.social.email && (
                        <a href={`mailto:${member.social.email}`} className="text-gray-400 hover:text-emerald-600 transition-colors">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a href={member.social.linkedin} className="text-gray-400 hover:text-emerald-600 transition-colors">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                      {member.social.github && (
                        <a href={member.social.github} className="text-gray-400 hover:text-emerald-600 transition-colors">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 联系我们 */}
        <div className="bg-emerald-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">加入我们</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              如果您对我们的使命充满热情，欢迎加入我们的团队，一起创造更美好的未来
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                联系我们
              </a>
              <a 
                href="/careers" 
                className="inline-flex items-center justify-center px-6 py-3 border border-emerald-600 text-base font-medium rounded-md text-emerald-600 bg-white hover:bg-emerald-50 transition-colors"
              >
                查看职位
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
