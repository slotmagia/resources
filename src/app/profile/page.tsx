'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { useAuthStore } from '@/stores';
import { Button, Input, Card } from '@/components/ui';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    website: user?.website || '',
    company: user?.company || '',
    location: user?.location || '',
    avatar: user?.avatar || '',
  });

  // 如果用户未登录，重定向到登录页
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">请先登录</h1>
          <p className="text-gray-600 mb-8">您需要登录后才能查看和编辑个人资料</p>
          <Link href="/login">
            <Button>前往登录</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // 模拟保存延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新用户信息
      updateUser(formData);
      setIsEditing(false);
      
      // 这里应该调用真实的API
      console.log('保存用户信息:', formData);
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      website: user?.website || '',
      company: user?.company || '',
      location: user?.location || '',
      avatar: user?.avatar || '',
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 在实际项目中，这里应该上传文件到服务器
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('avatar', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* 页面头部 */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* 面包屑导航 */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-gray-700">首页</Link>
              <span>/</span>
              <Link href="/dashboard" className="hover:text-gray-700">用户中心</Link>
              <span>/</span>
              <span className="text-gray-900">个人资料</span>
            </nav>

            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">个人资料</h1>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  编辑资料
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 头像和基本信息 */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="text-center">
                    {/* 头像 */}
                    <div className="relative mb-6">
                      <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full overflow-hidden">
                        {formData.avatar ? (
                          <Image
                            src={formData.avatar}
                            alt="头像"
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {isEditing && (
                        <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
                          <label className="block w-8 h-8 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                            />
                            <svg className="w-full h-full p-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* 基本信息 */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {formData.name || '未设置'}
                    </h2>
                    <p className="text-gray-600 mb-4">{formData.email}</p>
                    
                    {/* 用户统计 */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">23</div>
                        <div className="text-xs text-gray-500">已购买</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">156</div>
                        <div className="text-xs text-gray-500">下载次数</div>
                      </div>
                    </div>
                  </div>
                </Card>

              {/* 账户信息 */}
              <Card className="p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">账户信息</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">用户ID:</span>
                    <span className="text-gray-900">{user?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">会员等级:</span>
                    <span className="text-blue-600 font-medium">{user?.vipLevel || '普通用户'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">注册时间:</span>
                    <span className="text-gray-900">2024-01-15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">最后登录:</span>
                    <span className="text-gray-900">刚刚</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* 详细信息表单 */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">详细信息</h3>
                  {isEditing && (
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        取消
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                      >
                        {loading ? '保存中...' : '保存'}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 姓名 */}
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        姓名
                      </label>
                      {isEditing ? (
                        <Input
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="请输入您的姓名"
                        />
                      ) : (
                        <div className="text-gray-900 py-2">{formData.name || '未设置'}</div>
                      )}
                    </div>

                    {/* 邮箱 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        邮箱地址
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="请输入邮箱地址"
                        />
                      ) : (
                        <div className="text-gray-900 py-2">{formData.email}</div>
                      )}
                    </div>

                    {/* 公司 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        公司/组织
                      </label>
                      {isEditing ? (
                        <Input
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="请输入公司或组织名称"
                        />
                      ) : (
                        <div className="text-gray-900 py-2">{formData.company || '未设置'}</div>
                      )}
                    </div>

                    {/* 所在地 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        所在地
                      </label>
                      {isEditing ? (
                        <Input
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="请输入所在城市"
                        />
                      ) : (
                        <div className="text-gray-900 py-2">{formData.location || '未设置'}</div>
                      )}
                    </div>

                    {/* 个人网站 */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        个人网站
                      </label>
                      {isEditing ? (
                        <Input
                          type="url"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          placeholder="https://example.com"
                        />
                      ) : (
                        <div className="text-gray-900 py-2">
                          {formData.website ? (
                            <a
                              href={formData.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              {formData.website}
                            </a>
                          ) : (
                            '未设置'
                          )}
                        </div>
                      )}
                    </div>

                    {/* 个人简介 */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        个人简介
                      </label>
                      {isEditing ? (
                        <textarea
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          placeholder="请简单介绍一下自己..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                      ) : (
                        <div className="text-gray-900 py-2 min-h-[100px] bg-gray-50 rounded-lg p-3">
                          {formData.bio || '暂无个人简介'}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

              {/* 安全设置 */}
              <Card className="p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">安全设置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">修改密码</h4>
                      <p className="text-sm text-gray-600">定期更换密码以保护账户安全</p>
                    </div>
                    <Button variant="outline" size="sm">
                      修改密码
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">两步验证</h4>
                      <p className="text-sm text-gray-600">为您的账户添加额外的安全保护</p>
                    </div>
                    <Button variant="outline" size="sm">
                      启用
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">账户注销</h4>
                      <p className="text-sm text-gray-600">永久删除您的账户和所有数据</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                      注销账户
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
        </div>
    </MainLayout>
  );
}
