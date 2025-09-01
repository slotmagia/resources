'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { cn } from '@/lib/utils';

interface TermsSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState<string>('overview');

  const termsSections: TermsSection[] = [
    {
      id: 'overview',
      title: '服务概述',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            欢迎使用资源吧（以下简称&ldquo;本平台&rdquo;）！本服务协议（以下简称&ldquo;本协议&rdquo;）是您与资源吧之间关于使用本平台服务的法律协议。
          </p>
          <p className="text-gray-700 leading-relaxed">
            本平台致力于为用户提供优质的数字资源下载服务，包括但不限于软件、视频教程、文档资料、技术文章等内容。
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-blue-800">
              <strong>重要提示：</strong>请您仔细阅读本协议的全部条款。您使用本平台服务即表示您已阅读、理解并同意接受本协议的全部条款。
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'account',
      title: '账户管理',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">账户注册</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>您需要提供真实、准确、完整的注册信息</li>
            <li>您有责任维护账户信息的准确性和及时性</li>
            <li>您应妥善保管账户密码，对账户下的所有活动承担责任</li>
            <li>禁止创建多个账户恶意获取免费资源或优惠</li>
          </ul>
          
          <h4 className="font-semibold text-gray-900 mt-6">账户安全</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>如发现账户被盗用，请立即联系客服</li>
            <li>不得将账户借给他人使用或进行商业转让</li>
            <li>我们有权在发现违规行为时暂停或终止账户</li>
          </ul>
        </div>
      )
    },
    {
      id: 'payment',
      title: '付费服务',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">VIP会员服务</h4>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-medium text-yellow-800 mb-2">会员权益包括：</h5>
            <ul className="list-disc list-inside space-y-1 text-yellow-700">
              <li>无限制下载高级资源</li>
              <li>优先获取最新资源更新</li>
              <li>专属客服支持</li>
              <li>去除下载速度限制</li>
              <li>批量下载功能</li>
            </ul>
          </div>
          
          <h4 className="font-semibold text-gray-900 mt-6">付费下载规则</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>单次付费：</strong>针对特定高价值资源，一次性付费永久下载</li>
            <li><strong>积分制度：</strong>通过充值积分或完成任务获得下载权限</li>
            <li><strong>会员制度：</strong>按月/年订阅，享受会员期间的所有权益</li>
            <li><strong>免费资源：</strong>部分基础资源对所有用户免费开放</li>
          </ul>

          <h4 className="font-semibold text-gray-900 mt-6">价格与支付</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <ul className="space-y-2 text-gray-700">
              <li>• 所有价格均以人民币（CNY）计价</li>
              <li>• 支持微信支付、支付宝、银行卡等多种支付方式</li>
              <li>• 价格可能根据市场情况进行调整，调整前会提前通知</li>
              <li>• 付费后即可立即获得相应服务或资源的访问权限</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'download',
      title: '下载条款',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">下载权限</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>付费资源仅限付费用户下载，禁止未经授权的分享</li>
            <li>每个资源的下载次数可能有限制，具体以资源页面说明为准</li>
            <li>VIP会员在会员期内可无限次下载会员资源</li>
            <li>下载的资源仅供个人学习和研究使用</li>
          </ul>

          <h4 className="font-semibold text-gray-900 mt-6">使用限制</h4>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h5 className="font-medium text-red-800 mb-2">严格禁止以下行为：</h5>
            <ul className="list-disc list-inside space-y-1 text-red-700">
              <li>将下载的资源用于商业用途</li>
              <li>二次分发、转售或共享付费资源</li>
              <li>破解、逆向工程或修改资源内容</li>
              <li>批量下载后在其他平台分享</li>
              <li>使用技术手段绕过付费机制</li>
            </ul>
          </div>

          <h4 className="font-semibold text-gray-900 mt-6">下载保障</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>我们保证资源的完整性和可用性</li>
            <li>如遇下载失败，可联系客服重新获取下载链接</li>
            <li>付费资源在一定期限内支持重新下载</li>
          </ul>
        </div>
      )
    },
    {
      id: 'refund',
      title: '退款政策',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">退款条件</h4>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 className="font-medium text-green-800 mb-2">以下情况可申请退款：</h5>
            <ul className="list-disc list-inside space-y-1 text-green-700">
              <li>资源文件损坏或无法正常使用</li>
              <li>资源描述与实际内容严重不符</li>
              <li>重复购买同一资源（7天内）</li>
              <li>技术故障导致无法下载（48小时内未解决）</li>
            </ul>
          </div>

          <h4 className="font-semibold text-gray-900 mt-6">退款流程</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>在符合退款条件的情况下，联系客服申请退款</li>
            <li>提供订单号、付款凭证和退款原因</li>
            <li>客服团队将在3个工作日内审核申请</li>
            <li>审核通过后，退款将在5-10个工作日内到账</li>
          </ol>

          <h4 className="font-semibold text-gray-900 mt-6">退款限制</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>已下载的资源一般不支持退款（除质量问题外）</li>
            <li>VIP会员费用按剩余天数比例退款</li>
            <li>虚拟商品特性，请谨慎购买</li>
          </ul>
        </div>
      )
    },
    {
      id: 'intellectual',
      title: '知识产权',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">版权声明</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>本平台上的所有资源均受知识产权法保护</li>
            <li>我们尊重原创作者的知识产权，严格审核上传内容</li>
            <li>如发现侵权内容，请及时举报，我们将立即处理</li>
            <li>用户下载资源仅获得使用权，不获得所有权</li>
          </ul>

          <h4 className="font-semibold text-gray-900 mt-6">用户责任</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <ul className="space-y-2 text-blue-800">
              <li>• 不得上传侵犯他人知识产权的内容</li>
              <li>• 不得恶意传播病毒或恶意软件</li>
              <li>• 尊重原创，合理使用下载的资源</li>
              <li>• 发现侵权内容应及时举报</li>
            </ul>
          </div>

          <h4 className="font-semibold text-gray-900 mt-6">侵权处理</h4>
          <p className="text-gray-700">
            如果您认为平台上的某些内容侵犯了您的知识产权，请通过以下方式联系我们：
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>邮箱：copyright@resources.com</li>
            <li>提供详细的侵权说明和权利证明</li>
            <li>我们将在收到通知后24小时内处理</li>
          </ul>
        </div>
      )
    },
    {
      id: 'liability',
      title: '免责声明',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">服务免责</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>本平台仅提供信息存储和下载服务，不对资源内容的准确性负责</li>
            <li>用户使用下载资源产生的任何后果由用户自行承担</li>
            <li>我们不保证服务的不间断性和绝对安全性</li>
            <li>因不可抗力导致的服务中断，我们不承担责任</li>
          </ul>

          <h4 className="font-semibold text-gray-900 mt-6">责任限制</h4>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              在任何情况下，我们的赔偿责任不会超过用户为相关服务支付的费用总额。
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'changes',
      title: '协议变更',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">协议更新</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>我们有权根据法律法规和业务发展需要修改本协议</li>
            <li>协议变更将通过网站公告、邮件等方式通知用户</li>
            <li>如您不同意变更内容，可选择停止使用服务</li>
            <li>继续使用服务视为接受新的协议条款</li>
          </ul>

          <h4 className="font-semibold text-gray-900 mt-6">生效时间</h4>
          <p className="text-gray-700">
            本协议自2024年1月1日起生效，最后更新时间：2024年1月1日
          </p>
        </div>
      )
    }
  ];

  return (
    <MainLayout>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">服务协议</h1>
              <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                资源吧付费下载服务协议 - 保障您的权益，规范服务使用
              </p>
              <div className="mt-6 text-sm text-indigo-200">
                最后更新：2024年1月1日 | 生效日期：2024年1月1日
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 侧边导航 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">协议目录</h3>
                <nav className="space-y-2">
                  {termsSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        'w-full text-left flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors',
                        activeSection === section.id
                          ? 'bg-indigo-100 text-indigo-700 font-medium'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      )}
                    >
                      <span className={cn(
                        activeSection === section.id ? 'text-indigo-600' : 'text-gray-400'
                      )}>
                        {section.icon}
                      </span>
                      <span>{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* 主要内容 */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {termsSections.map((section) => (
                  <div
                    key={section.id}
                    className={cn(
                      'p-8',
                      activeSection === section.id ? 'block' : 'hidden'
                    )}
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                        {section.icon}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                    </div>
                    {section.content}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 重要提示 */}
          <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">重要提示</h3>
                <div className="text-gray-700 space-y-2">
                  <p>
                    • 本协议是您使用资源吧服务的重要法律文件，请务必仔细阅读并充分理解各条款内容。
                  </p>
                  <p>
                    • 如您对协议内容有任何疑问，请在使用服务前联系我们的客服团队。
                  </p>
                  <p>
                    • 您点击&ldquo;同意&rdquo;或使用我们的服务即表示您已阅读并同意本协议的全部条款。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 联系信息 */}
          <div className="mt-8 bg-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-indigo-900 mb-4">联系我们</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-indigo-800">
              <div>
                <strong>客服邮箱：</strong><br />
                service@resources.com
              </div>
              <div>
                <strong>法务邮箱：</strong><br />
                legal@resources.com
              </div>
              <div>
                <strong>客服电话：</strong><br />
                400-123-4567
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
