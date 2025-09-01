import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { method, amount, items } = body || {};

    if (!method || !amount || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: '参数不完整' }, { status: 400 });
    }

    // 模拟后端处理时间
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 简单模拟：根据支付方式返回不同的message
    const methodLabelMap: Record<string, string> = {
      alipay: '支付宝',
      wechat: '微信支付',
      stripe: 'Stripe',
    };

    return NextResponse.json({
      status: 'success',
      message: `${methodLabelMap[method] || method} 订单已创建，金额：${amount}`,
      paymentIntentId: `pi_${Math.random().toString(36).slice(2, 10)}`,
      redirectUrl: null,
    });
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}


