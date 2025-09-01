'use client';

import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { Card, Badge } from '@/components/ui';

// 分类信息配置
const categories = [
  {
    id: 'frontend',
    name: '前端开发',
    description: '现代化前端开发技术，包含React、Vue、Angular等主流框架的学习资源',
    icon: '🚀',
    tags: ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'CSS'],
    color: 'bg-blue-500',
    count: '3,200+'
  },
  {
    id: 'backend',
    name: '后端开发',
    description: '服务端开发技术栈，涵盖Node.js、Python、Java、Go等后端语言和框架',
    icon: '⚙️',
    tags: ['Node.js', 'Python', 'Java', 'Go', 'API', 'Database'],
    color: 'bg-green-500',
    count: '2,800+'
  },
  {
    id: 'mobile',
    name: '移动开发',
    description: 'iOS、Android原生开发以及React Native、Flutter跨平台开发技术',
    icon: '📱',
    tags: ['React Native', 'Flutter', 'iOS', 'Android', 'Hybrid'],
    color: 'bg-purple-500',
    count: '1,500+'
  },
  {
    id: 'design',
    name: '图像处理',
    description: 'Photoshop、AI设计工具使用教程和创意设计资源',
    icon: '🎨',
    tags: ['Photoshop', 'Illustrator', 'Sketch', 'Figma', 'Design'],
    color: 'bg-pink-500',
    count: '2,100+'
  },
  {
    id: 'office',
    name: '办公软件',
    description: 'Office办公套件、效率工具和企业级软件使用指南',
    icon: '💼',
    tags: ['Office', 'Excel', 'Word', 'PowerPoint', 'Productivity'],
    color: 'bg-orange-500',
    count: '1,800+'
  },
  {
    id: 'programming',
    name: '编程教程',
    description: '编程语言基础到进阶的完整学习路径和实战项目',
    icon: '💻',
    tags: ['Programming', 'Algorithms', 'Data Structures', 'Projects'],
    color: 'bg-indigo-500',
    count: '4,200+'
  },
  {
    id: 'career',
    name: '职业发展',
    description: '技术职业规划、面试技巧、软技能提升等职场发展资源',
    icon: '📈',
    tags: ['Career', 'Interview', 'Soft Skills', 'Leadership'],
    color: 'bg-teal-500',
    count: '900+'
  },
  {
    id: 'ai',
    name: '人工智能',
    description: '机器学习、深度学习、AI工具使用和相关技术资源',
    icon: '🤖',
    tags: ['Machine Learning', 'Deep Learning', 'AI Tools', 'ChatGPT'],
    color: 'bg-red-500',
    count: '1,200+'
  }
];

export default function CategoriesPage() {
  // 映射分类ID到中文名称
  const categoryNameMap: { [key: string]: string } = {
    'frontend': '前端开发',
    'backend': '后端开发',
    'mobile': '移动开发',
    'design': '图像处理',
    'office': '办公软件',
    'programming': '编程教程',
    'career': '职业发展',
    'ai': '人工智能'
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 页面头部 */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-12">
            {/* 面包屑导航 */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-gray-700">首页</Link>
              <span>/</span>
              <span className="text-gray-900">分类导航</span>
            </nav>

            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                资源分类导航
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                精心分类整理，涵盖技术开发各个领域，快速找到您需要的学习资源
              </p>
            </div>
          </div>
        </div>

        {/* 分类网格 */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${encodeURIComponent(categoryNameMap[category.id])}`}
                className="group"
              >
                <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:border-blue-300">
                  {/* 图标和标题 */}
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <div className="text-sm font-medium text-blue-600">
                      {category.count} 个资源
                    </div>
                  </div>

                  {/* 描述 */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {category.description}
                  </p>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {category.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {category.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{category.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* 查看更多按钮 */}
                  <div className="flex items-center justify-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
                    <span>查看资源</span>
                    <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* 底部信息 */}
          <div className="mt-16 bg-white rounded-xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">18,800+</div>
                <div className="text-gray-600">总资源数量</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">8</div>
                <div className="text-gray-600">主要分类</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
                <div className="text-gray-600">细分标签</div>
              </div>
            </div>
          </div>

          {/* 推荐操作 */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">找不到合适的分类？</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                我们支持全站搜索功能，您可以通过关键词快速找到需要的资源
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Link
                  href="/resources"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  浏览全部资源
                </Link>
                <Link
                  href="/search"
                  className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
                >
                  高级搜索
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
