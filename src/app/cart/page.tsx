'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout';
import { Button, Card, Select } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { useCartStore, useAuthStore, useResourceStore } from '@/stores';

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    video: '视频',
    software: '软件',
    document: '文档',
    article: '文章',
    file: '文件',
  };
  return labels[type] || type;
}

export default function CartPage() {
  const router = useRouter();
  const { items, total, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('alipay');
  const [isPaying, setIsPaying] = useState(false);
  const { resources, fetchResources } = useResourceStore();

  useEffect(() => {
    if (resources.length === 0) {
      fetchResources();
    }
  }, [resources.length, fetchResources]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleApplyPromo = () => {
    // 模拟优惠码验证
    if (promoCode.toLowerCase() === 'welcome10') {
      setDiscount(total * 0.1); // 10% 折扣
      setPromoApplied(true);
    } else if (promoCode.toLowerCase() === 'save20') {
      setDiscount(total * 0.2); // 20% 折扣
      setPromoApplied(true);
    } else {
      alert('优惠码无效');
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/cart');
      return;
    }

    if (items.length === 0 || finalTotal <= 0) {
      alert('购物车为空或金额无效');
      return;
    }

    try {
      setIsPaying(true);
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: paymentMethod,
          amount: finalTotal,
          items: items.map(({ resourceId, title, price, quantity }) => ({ resourceId, title, price, quantity }))
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || '支付请求失败');
      }
      const data = await res.json();
      alert(`模拟支付创建成功：${data?.message || data?.status}`);
      // 这里可以根据需要清空购物车或跳转
      // clearCart();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '支付失败，请稍后重试';
      alert(message);
    } finally {
      setIsPaying(false);
    }
  };

  const finalTotal = total - discount;

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <svg className="mx-auto h-24 w-24 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 8L3 21h18M9 19a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">购物车为空</h1>
            <p className="text-lg text-gray-600 mb-8">
              还没有添加任何资源到购物车，去发现一些精彩的内容吧！
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/resources">
                <Button size="lg">
                  浏览资源
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline">
                  查看分类
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* 页面标题 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">购物车</h1>
              <p className="text-gray-600 mt-2">
                {items.length} 件商品
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 购物车商品列表 */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  const resource = resources.find(r => r.id === item.resourceId);
                  return (
                    <Card key={item.resourceId} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* 商品图片 */}
                        <Link href={`/resources/${item.resourceId}`} className="flex-shrink-0">
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            {resource?.type && (
                              <div className="absolute top-1 left-1">
                                <span className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700">
                                  {getTypeLabel(resource.type)}
                                </span>
                              </div>
                            )}
                          </div>
                        </Link>
                        
                        {/* 商品信息 */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/resources/${item.resourceId}`}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                          </Link>
                          {resource?.description && (
                            <p className="mt-1 text-gray-600 text-sm line-clamp-2">{resource.description}</p>
                          )}

                          <div className="mt-2 flex items-center text-xs text-gray-500 space-x-2">
                            {resource?.author && (
                              <span className="inline-flex items-center">
                                <img
                                  src={resource.author.avatar || 'https://via.placeholder.com/20'}
                                  alt={resource.author.name}
                                  className="w-4 h-4 rounded-full mr-1"
                                />
                                <span>{resource.author.name}</span>
                                {resource.author.verified && (
                                  <svg className="w-3 h-3 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </span>
                            )}
                            {resource?.category && <span>•</span>}
                            {resource?.category && <span>{resource.category}</span>}
                            {(resource?.stats?.rating || resource?.stats?.downloads) && <span>•</span>}
                            {resource?.stats?.rating && (
                              <span className="inline-flex items-center">
                                <svg className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span>{resource.stats.rating}</span>
                                <span className="ml-0.5">({resource.stats.reviewCount})</span>
                              </span>
                            )}
                            {resource?.stats?.downloads && (
                              <>
                                <span>•</span>
                                <span>{resource.stats.downloads.toLocaleString()} 下载</span>
                              </>
                            )}
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            {/* 数量控制 */}
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">数量:</span>
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                  onClick={() => handleQuantityChange(item.resourceId, item.quantity - 1)}
                                  className="px-3 py-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                                >
                                  −
                                </button>
                                <span className="px-3 py-1 border-x border-gray-300 text-gray-900 min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.resourceId, item.quantity + 1)}
                                  className="px-3 py-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            
                            {/* 价格与删除 */}
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="text-lg font-semibold text-blue-600">
                                  {formatCurrency(item.price * item.quantity)}
                                </div>
                                {resource?.originalPrice && resource.originalPrice > resource.price && (
                                  <div className="text-xs text-gray-400 line-through text-right">
                                    {formatCurrency(resource.originalPrice)}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => removeItem(item.resourceId)}
                                className="text-red-600 hover:text-red-700 transition-colors"
                                title="删除商品"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                
                {/* 清空购物车 */}
                <div className="text-center pt-4">
                  <Button variant="outline" onClick={clearCart}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    清空购物车
                  </Button>
                </div>
              </div>
              
              {/* 订单摘要 */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">订单摘要</h3>
                  
                  {/* 价格明细 */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>商品小计 ({items.length} 件)</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    
                    {promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>优惠折扣</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold text-gray-900">
                        <span>总计</span>
                        <span>{formatCurrency(finalTotal)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 优惠码 */}
                  {!promoApplied && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        优惠码
                      </label>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="输入优惠码"
                          className="w-full sm:flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Button
                          variant="outline"
                          onClick={handleApplyPromo}
                          className="w-full sm:w-auto whitespace-nowrap"
                        >
                          应用
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        试试 &quot;WELCOME10&quot; 或 &quot;SAVE20&quot;
                      </p>
                    </div>
                  )}
                  
                  {promoApplied && (
                    <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-green-800">
                          优惠码已应用
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* 支付方式 */}
                  <div className="mb-6">
                    <Select
                      label="支付方式"
                      value={paymentMethod}
                      onChange={setPaymentMethod}
                      options={[
                        { value: 'alipay', label: '支付宝' },
                        { value: 'wechat', label: '微信支付' },
                        { value: 'stripe', label: 'Stripe' },
                      ]}
                    />
                  </div>

                  {/* 结算按钮 */}
                  <Button
                    fullWidth
                    size="lg"
                    onClick={handleCheckout}
                    loading={isPaying}
                    disabled={isPaying}
                    className="mb-4"
                  >
                    {isAuthenticated ? '去结算' : '登录并结算'}
                  </Button>
                  
                  {/* 继续购物 */}
                  <Link href="/resources">
                    <Button
                      fullWidth
                      variant="outline"
                    >
                      继续购物
                    </Button>
                  </Link>
                  
                  {/* 安全提示 */}
                  <div className="mt-6 text-xs text-gray-500 space-y-1">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.414-2.414l-7.07 7.07a2 2 0 01-2.83 0l-7.07-7.07" />
                      </svg>
                      <span>SSL 安全加密</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.414-2.414l-7.07 7.07a2 2 0 01-2.83 0l-7.07-7.07" />
                      </svg>
                      <span>支付信息保护</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.414-2.414l-7.07 7.07a2 2 0 01-2.83 0l-7.07-7.07" />
                      </svg>
                      <span>7天无理由退款</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
