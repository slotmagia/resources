'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout';
import { useAuthStore } from '@/stores';
import { Button, Card, Badge } from '@/components/ui';

// 通知类型定义
interface Notification {
  id: string;
  type: 'system' | 'order' | 'resource' | 'promotion' | 'security';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  important: boolean;
  actionText?: string;
  actionLink?: string;
  icon?: string;
}

// 模拟通知数据
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: '订单支付成功',
    message: '您购买的"React 完整教程视频"已支付成功，现在可以开始下载了。',
    timestamp: '2024-01-20T10:30:00Z',
    read: false,
    important: true,
    actionText: '立即下载',
    actionLink: '/resources/1',
    icon: '✅'
  },
  {
    id: '2',
    type: 'resource',
    title: '新资源推荐',
    message: '根据您的兴趣，我们为您推荐了3个前端开发相关的新资源。',
    timestamp: '2024-01-20T09:15:00Z',
    read: false,
    important: false,
    actionText: '查看推荐',
    actionLink: '/resources?category=前端开发',
    icon: '🎯'
  },
  {
    id: '3',
    type: 'promotion',
    title: 'VIP会员优惠活动',
    message: '新年特惠！VIP年度会员限时8折，优质资源无限下载。',
    timestamp: '2024-01-19T16:20:00Z',
    read: true,
    important: true,
    actionText: '立即开通',
    actionLink: '/vip',
    icon: '👑'
  },
  {
    id: '4',
    type: 'system',
    title: '系统维护通知',
    message: '系统将于今晚22:00-24:00进行维护升级，期间可能影响正常使用。',
    timestamp: '2024-01-19T14:00:00Z',
    read: true,
    important: false,
    icon: '🔧'
  },
  {
    id: '5',
    type: 'security',
    title: '账户安全提醒',
    message: '检测到您的账户在新设备登录，如非本人操作请及时修改密码。',
    timestamp: '2024-01-18T20:45:00Z',
    read: true,
    important: true,
    actionText: '修改密码',
    actionLink: '/profile',
    icon: '🔒'
  },
  {
    id: '6',
    type: 'resource',
    title: '收藏资源更新',
    message: '您收藏的"JavaScript高级编程"资源已更新到最新版本。',
    timestamp: '2024-01-18T11:30:00Z',
    read: true,
    important: false,
    actionText: '查看更新',
    actionLink: '/resources/4',
    icon: '🔄'
  }
];

// 通知分类
const notificationTypes = [
  { id: 'all', name: '全部通知', count: 6, color: 'bg-gray-500' },
  { id: 'system', name: '系统通知', count: 1, color: 'bg-blue-500' },
  { id: 'order', name: '订单消息', count: 1, color: 'bg-green-500' },
  { id: 'resource', name: '资源相关', count: 2, color: 'bg-purple-500' },
  { id: 'promotion', name: '活动推广', count: 1, color: 'bg-orange-500' },
  { id: 'security', name: '安全提醒', count: 1, color: 'bg-red-500' },
];

export default function NotificationsPage() {
  const { isAuthenticated, user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedType, setSelectedType] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // 如果用户未登录，重定向到登录页
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
          <p className="text-gray-600 mb-8">您需要登录后才能查看通知</p>
          <Link href="/login">
            <Button>前往登录</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  // 筛选通知
  const filteredNotifications = notifications.filter(notification => {
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    const matchesReadStatus = !showUnreadOnly || !notification.read;
    return matchesType && matchesReadStatus;
  });

  // 未读通知数量
  const unreadCount = notifications.filter(n => !n.read).length;

  // 标记为已读
  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // 标记全部为已读
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // 删除通知
  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '刚刚';
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else if (diffInHours < 48) {
      return '昨天';
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };

  // 获取通知类型显示名称
  const getTypeDisplayName = (type: string) => {
    const typeInfo = notificationTypes.find(t => t.id === type);
    return typeInfo ? typeInfo.name : type;
  };

  // 获取通知类型颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'bg-blue-100 text-blue-800';
      case 'order': return 'bg-green-100 text-green-800';
      case 'resource': return 'bg-purple-100 text-purple-800';
      case 'promotion': return 'bg-orange-100 text-orange-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 页面头部 */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            {/* 面包屑导航 */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-gray-700">首页</Link>
              <span>/</span>
              <Link href="/dashboard" className="hover:text-gray-700">用户中心</Link>
              <span>/</span>
              <span className="text-gray-900">通知消息</span>
            </nav>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  通知消息
                  {unreadCount > 0 && (
                    <Badge className="ml-3 bg-red-500 text-white">
                      {unreadCount}
                    </Badge>
                  )}
                </h1>
                <p className="text-gray-600">查看您的最新通知和消息</p>
              </div>
              
              {unreadCount > 0 && (
                <Button 
                  variant="outline"
                  onClick={markAllAsRead}
                >
                  全部标为已读
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏 */}
            <div className="lg:w-64 flex-shrink-0">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">通知分类</h3>
                <div className="space-y-2">
                  {notificationTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        selectedType === type.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 ${type.color} rounded-full`}></div>
                        <span className="font-medium">{type.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{type.count}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* 筛选选项 */}
              <Card className="p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">筛选选项</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showUnreadOnly}
                      onChange={(e) => setShowUnreadOnly(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">只显示未读</span>
                  </label>
                </div>
              </Card>

              {/* 快速操作 */}
              <Card className="p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">快速操作</h3>
                <div className="space-y-3">
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      通知设置
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      帮助中心
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* 主内容区 */}
            <div className="flex-1">
              {/* 通知列表 */}
              {filteredNotifications.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <Card 
                      key={notification.id}
                      className={`p-6 transition-all duration-200 hover:shadow-md ${
                        !notification.read ? 'border-l-4 border-blue-500 bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* 图标 */}
                          <div className="flex-shrink-0">
                            {notification.icon ? (
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                                {notification.icon}
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5h5v5z" />
                                  <circle cx="12" cy="8" r="3" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* 内容 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </h3>
                              {notification.important && (
                                <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                                  重要
                                </Badge>
                              )}
                              <Badge variant="secondary" className={`text-xs ${getTypeColor(notification.type)}`}>
                                {getTypeDisplayName(notification.type)}
                              </Badge>
                            </div>
                            
                            <p className={`mb-3 leading-relaxed ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">
                                {formatTime(notification.timestamp)}
                              </span>
                              
                              <div className="flex items-center space-x-3">
                                {notification.actionText && notification.actionLink && (
                                  <Link href={notification.actionLink}>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => markAsRead(notification.id)}
                                    >
                                      {notification.actionText}
                                    </Button>
                                  </Link>
                                )}
                                
                                {!notification.read && (
                                  <Button 
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    标为已读
                                  </Button>
                                )}
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  删除
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 未读标识 */}
                        {!notification.read && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 ml-4"></div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5h5v5z" />
                      <circle cx="12" cy="8" r="3" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {showUnreadOnly ? '暂无未读通知' : '暂无通知'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {showUnreadOnly 
                      ? '所有通知都已阅读完毕' 
                      : `${selectedType === 'all' ? '暂时' : '该分类下暂时'}没有通知消息`
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {showUnreadOnly && (
                      <Button
                        variant="outline"
                        onClick={() => setShowUnreadOnly(false)}
                      >
                        显示全部通知
                      </Button>
                    )}
                    <Link href="/resources">
                      <Button>浏览资源</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
