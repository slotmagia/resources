# 订单支付 API

## 概述

订单支付模块提供订单创建、支付处理、订单查询、退款等功能。

## 接口列表

### 1. 创建订单

**POST** `/orders`

从购物车创建订单。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "paymentMethod": "alipay",  // 支付方式：alipay/wechat/stripe
  "couponCode": "WELCOME10",  // 优惠券代码（可选）
  "billingAddress": {         // 账单地址（可选）
    "name": "张三",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "country": "CN",
    "state": "北京市",
    "city": "北京市",
    "address": "朝阳区某某街道123号",
    "postalCode": "100000"
  }
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_123456",
      "orderNumber": "ORD20240125001",
      "status": "pending",
      "items": [
        {
          "resourceId": "res_123456",
          "title": "React 完整教程视频",
          "price": 99.00,
          "quantity": 1
        }
      ],
      "summary": {
        "subtotal": 99.00,
        "discount": 9.90,
        "total": 89.10
      },
      "paymentMethod": "alipay",
      "createdAt": "2024-01-25T11:30:00Z",
      "expiresAt": "2024-01-25T12:00:00Z"
    },
    "payment": {
      "paymentIntentId": "pi_1234567890",
      "clientSecret": "pi_1234567890_secret_abc123",
      "paymentUrl": "https://pay.example.com/alipay?order=order_123456",
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    }
  },
  "message": "订单创建成功"
}
```

### 2. 获取订单详情

**GET** `/orders/{orderId}`

获取指定订单的详细信息。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `orderId`: 订单ID

#### 响应示例

```json
{
  "success": true,
  "data": {
    "id": "order_123456",
    "orderNumber": "ORD20240125001",
    "status": "paid",
    "items": [
      {
        "resourceId": "res_123456",
        "title": "React 完整教程视频",
        "thumbnail": "https://cdn.example.com/thumbnails/res_123456.jpg",
        "price": 99.00,
        "originalPrice": 199.00,
        "quantity": 1,
        "downloadUrl": "https://download.example.com/res_123456?token=abc123"
      }
    ],
    "summary": {
      "subtotal": 99.00,
      "discount": 9.90,
      "tax": 0.00,
      "total": 89.10
    },
    "payment": {
      "method": "alipay",
      "transactionId": "txn_987654321",
      "paidAt": "2024-01-25T11:45:00Z"
    },
    "coupon": {
      "code": "WELCOME10",
      "discount": 9.90
    },
    "billingAddress": {
      "name": "张三",
      "email": "zhangsan@example.com",
      "phone": "13800138000"
    },
    "createdAt": "2024-01-25T11:30:00Z",
    "updatedAt": "2024-01-25T11:45:00Z",
    "expiresAt": "2024-01-25T12:00:00Z"
  }
}
```

### 3. 获取订单列表

**GET** `/orders`

获取当前用户的订单列表。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | integer | 1 | 页码 |
| limit | integer | 20 | 每页数量 |
| status | string | all | 订单状态：all/pending/paid/failed/refunded |
| startDate | string | - | 开始日期（YYYY-MM-DD） |
| endDate | string | - | 结束日期（YYYY-MM-DD） |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "order_123456",
        "orderNumber": "ORD20240125001",
        "status": "paid",
        "itemCount": 1,
        "total": 89.10,
        "paymentMethod": "alipay",
        "createdAt": "2024-01-25T11:30:00Z",
        "paidAt": "2024-01-25T11:45:00Z",
        "items": [
          {
            "title": "React 完整教程视频",
            "thumbnail": "https://cdn.example.com/thumbnails/res_123456.jpg"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "totalPages": 1,
      "hasMore": false
    },
    "statistics": {
      "totalOrders": 15,
      "totalSpent": 1299.50,
      "statusCounts": {
        "paid": 12,
        "pending": 1,
        "failed": 1,
        "refunded": 1
      }
    }
  }
}
```

### 4. 确认支付

**POST** `/orders/{orderId}/confirm-payment`

确认订单支付状态（用于某些支付方式的回调）。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `orderId`: 订单ID

#### 请求参数

```json
{
  "paymentIntentId": "pi_1234567890",  // 支付意图ID
  "transactionId": "txn_987654321"     // 交易ID（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_123456",
      "status": "paid",
      "paidAt": "2024-01-25T11:45:00Z"
    },
    "downloadUrls": [
      {
        "resourceId": "res_123456",
        "title": "React 完整教程视频",
        "downloadUrl": "https://download.example.com/res_123456?token=abc123",
        "expiresAt": "2024-01-25T23:45:00Z"
      }
    ]
  },
  "message": "支付确认成功"
}
```

### 5. 取消订单

**POST** `/orders/{orderId}/cancel`

取消未支付的订单。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `orderId`: 订单ID

#### 请求参数

```json
{
  "reason": "用户主动取消"  // 取消原因（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "订单已取消"
}
```

### 6. 申请退款

**POST** `/orders/{orderId}/refund`

申请订单退款。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `orderId`: 订单ID

#### 请求参数

```json
{
  "reason": "质量问题",      // 退款原因
  "description": "资源内容与描述不符"  // 详细说明（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "refundRequest": {
      "id": "refund_789012",
      "orderId": "order_123456",
      "amount": 89.10,
      "reason": "质量问题",
      "status": "pending",
      "createdAt": "2024-01-25T14:30:00Z",
      "expectedProcessTime": "3-5个工作日"
    }
  },
  "message": "退款申请已提交"
}
```

### 7. 获取退款状态

**GET** `/orders/{orderId}/refund`

查询订单的退款状态。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `orderId`: 订单ID

#### 响应示例

```json
{
  "success": true,
  "data": {
    "refund": {
      "id": "refund_789012",
      "orderId": "order_123456",
      "amount": 89.10,
      "reason": "质量问题",
      "status": "approved",
      "createdAt": "2024-01-25T14:30:00Z",
      "processedAt": "2024-01-26T10:15:00Z",
      "refundMethod": "original",
      "estimatedArrival": "2024-01-28T00:00:00Z"
    }
  }
}
```

### 8. 重新支付

**POST** `/orders/{orderId}/retry-payment`

重新发起订单支付。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `orderId`: 订单ID

#### 请求参数

```json
{
  "paymentMethod": "wechat"  // 新的支付方式（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "payment": {
      "paymentIntentId": "pi_2345678901",
      "clientSecret": "pi_2345678901_secret_def456",
      "paymentUrl": "https://pay.example.com/wechat?order=order_123456",
      "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    },
    "expiresAt": "2024-01-25T16:00:00Z"
  },
  "message": "支付链接已更新"
}
```

### 9. 获取发票

**GET** `/orders/{orderId}/invoice`

获取订单发票信息。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `orderId`: 订单ID

#### 响应示例

```json
{
  "success": true,
  "data": {
    "invoice": {
      "id": "inv_345678",
      "invoiceNumber": "INV20240125001",
      "orderId": "order_123456",
      "amount": 89.10,
      "tax": 0.00,
      "currency": "CNY",
      "status": "issued",
      "issuedAt": "2024-01-25T11:45:00Z",
      "downloadUrl": "https://invoices.example.com/inv_345678.pdf",
      "billingAddress": {
        "name": "张三",
        "email": "zhangsan@example.com",
        "company": "某科技公司",
        "taxId": "91110000123456789X"
      }
    }
  }
}
```

### 10. 获取支付方式

**GET** `/orders/payment-methods`

获取可用的支付方式列表。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "paymentMethods": [
      {
        "id": "alipay",
        "name": "支付宝",
        "icon": "https://cdn.example.com/icons/alipay.png",
        "type": "redirect",
        "available": true,
        "fee": 0,
        "description": "使用支付宝安全支付"
      },
      {
        "id": "wechat",
        "name": "微信支付",
        "icon": "https://cdn.example.com/icons/wechat.png",
        "type": "qrcode",
        "available": true,
        "fee": 0,
        "description": "微信扫码支付"
      },
      {
        "id": "stripe",
        "name": "信用卡",
        "icon": "https://cdn.example.com/icons/stripe.png",
        "type": "card",
        "available": true,
        "fee": 0.029,
        "description": "支持Visa、MasterCard等"
      }
    ]
  }
}
```

## 错误代码

| 错误代码 | 说明 |
|----------|------|
| ORDER_NOT_FOUND | 订单不存在 |
| ORDER_ALREADY_PAID | 订单已支付 |
| ORDER_EXPIRED | 订单已过期 |
| ORDER_CANCELLED | 订单已取消 |
| PAYMENT_FAILED | 支付失败 |
| PAYMENT_METHOD_NOT_SUPPORTED | 不支持的支付方式 |
| INSUFFICIENT_FUNDS | 余额不足 |
| REFUND_NOT_ALLOWED | 不允许退款 |
| REFUND_ALREADY_PROCESSED | 退款已处理 |
| INVOICE_NOT_AVAILABLE | 发票不可用 |

## 数据模型

### Order 对象

```typescript
interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  items: OrderItem[];
  summary: OrderSummary;
  payment?: PaymentInfo;
  coupon?: CouponInfo;
  billingAddress?: BillingAddress;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  paidAt?: string;
}
```

### OrderItem 对象

```typescript
interface OrderItem {
  resourceId: string;
  title: string;
  thumbnail?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  downloadUrl?: string;
}
```

### OrderSummary 对象

```typescript
interface OrderSummary {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}
```

### PaymentInfo 对象

```typescript
interface PaymentInfo {
  method: string;
  transactionId?: string;
  paymentIntentId?: string;
  paidAt?: string;
  fee?: number;
}
```
