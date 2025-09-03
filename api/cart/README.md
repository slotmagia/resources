# 购物车 API

## 概述

购物车模块提供购物车商品管理、价格计算、优惠券应用等功能。

## 接口列表

### 1. 获取购物车内容

**GET** `/cart`

获取当前用户的购物车内容。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cart_item_123",
        "resourceId": "res_123456",
        "title": "React 完整教程视频",
        "thumbnail": "https://cdn.example.com/thumbnails/res_123456.jpg",
        "price": 99.00,
        "originalPrice": 199.00,
        "quantity": 1,
        "author": {
          "name": "张老师",
          "verified": true
        },
        "addedAt": "2024-01-25T10:30:00Z"
      }
    ],
    "summary": {
      "itemCount": 3,
      "subtotal": 297.00,
      "discount": 29.70,
      "total": 267.30,
      "appliedCoupons": [
        {
          "code": "WELCOME10",
          "discount": 29.70,
          "type": "percentage",
          "value": 10
        }
      ]
    }
  }
}
```

### 2. 添加商品到购物车

**POST** `/cart/items`

将资源添加到购物车。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "resourceId": "string",  // 资源ID
  "quantity": 1            // 数量（可选，默认1）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "item": {
      "id": "cart_item_456",
      "resourceId": "res_234567",
      "title": "Vue.js 进阶教程",
      "thumbnail": "https://cdn.example.com/thumbnails/res_234567.jpg",
      "price": 89.00,
      "quantity": 1,
      "addedAt": "2024-01-25T11:00:00Z"
    },
    "summary": {
      "itemCount": 4,
      "subtotal": 386.00,
      "total": 356.30
    }
  },
  "message": "商品已添加到购物车"
}
```

### 3. 更新购物车商品

**PUT** `/cart/items/{itemId}`

更新购物车中商品的数量。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `itemId`: 购物车商品ID

#### 请求参数

```json
{
  "quantity": 2  // 新的数量
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "item": {
      "id": "cart_item_123",
      "quantity": 2,
      "subtotal": 198.00
    },
    "summary": {
      "itemCount": 5,
      "subtotal": 475.00,
      "total": 427.50
    }
  },
  "message": "购物车已更新"
}
```

### 4. 删除购物车商品

**DELETE** `/cart/items/{itemId}`

从购物车中删除指定商品。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `itemId`: 购物车商品ID

#### 响应示例

```json
{
  "success": true,
  "data": {
    "summary": {
      "itemCount": 2,
      "subtotal": 188.00,
      "total": 169.20
    }
  },
  "message": "商品已从购物车中删除"
}
```

### 5. 清空购物车

**DELETE** `/cart`

清空购物车中的所有商品。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 响应示例

```json
{
  "success": true,
  "message": "购物车已清空"
}
```

### 6. 应用优惠券

**POST** `/cart/coupons`

为购物车应用优惠券。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "code": "WELCOME10"  // 优惠券代码
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "coupon": {
      "code": "WELCOME10",
      "name": "新用户优惠券",
      "type": "percentage",
      "value": 10,
      "discount": 18.80,
      "minAmount": 50.00,
      "maxDiscount": 100.00,
      "expiresAt": "2024-12-31T23:59:59Z"
    },
    "summary": {
      "subtotal": 188.00,
      "discount": 18.80,
      "total": 169.20
    }
  },
  "message": "优惠券应用成功"
}
```

### 7. 移除优惠券

**DELETE** `/cart/coupons/{code}`

从购物车中移除优惠券。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `code`: 优惠券代码

#### 响应示例

```json
{
  "success": true,
  "data": {
    "summary": {
      "subtotal": 188.00,
      "discount": 0,
      "total": 188.00
    }
  },
  "message": "优惠券已移除"
}
```

### 8. 获取可用优惠券

**GET** `/cart/available-coupons`

获取当前用户可用的优惠券列表。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "coupons": [
      {
        "code": "WELCOME10",
        "name": "新用户优惠券",
        "description": "新用户首次购买享受10%折扣",
        "type": "percentage",
        "value": 10,
        "minAmount": 50.00,
        "maxDiscount": 100.00,
        "expiresAt": "2024-12-31T23:59:59Z",
        "applicable": true,
        "reason": null
      },
      {
        "code": "SAVE20",
        "name": "满减优惠券",
        "description": "满200减20",
        "type": "fixed",
        "value": 20.00,
        "minAmount": 200.00,
        "expiresAt": "2024-06-30T23:59:59Z",
        "applicable": false,
        "reason": "购物车金额不足200元"
      }
    ]
  }
}
```

### 9. 验证优惠券

**POST** `/cart/validate-coupon`

验证优惠券是否可用。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "code": "WELCOME10"  // 优惠券代码
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "valid": true,
    "coupon": {
      "code": "WELCOME10",
      "name": "新用户优惠券",
      "type": "percentage",
      "value": 10,
      "discount": 18.80,
      "minAmount": 50.00
    },
    "message": "优惠券有效"
  }
}
```

### 10. 获取购物车统计

**GET** `/cart/stats`

获取购物车的统计信息。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "itemCount": 3,
    "totalValue": 386.00,
    "savings": 97.00,
    "categoryBreakdown": [
      {
        "category": "前端开发",
        "count": 2,
        "value": 188.00
      },
      {
        "category": "后端开发",
        "count": 1,
        "value": 198.00
      }
    ],
    "typeBreakdown": [
      {
        "type": "video",
        "name": "视频教程",
        "count": 2,
        "value": 188.00
      },
      {
        "type": "document",
        "name": "技术文档",
        "count": 1,
        "value": 198.00
      }
    ]
  }
}
```

## 错误代码

| 错误代码 | 说明 |
|----------|------|
| CART_ITEM_NOT_FOUND | 购物车商品不存在 |
| RESOURCE_ALREADY_PURCHASED | 资源已购买 |
| RESOURCE_ALREADY_IN_CART | 资源已在购物车中 |
| INVALID_QUANTITY | 数量无效 |
| COUPON_NOT_FOUND | 优惠券不存在 |
| COUPON_EXPIRED | 优惠券已过期 |
| COUPON_NOT_APPLICABLE | 优惠券不适用 |
| COUPON_ALREADY_USED | 优惠券已使用 |
| MIN_AMOUNT_NOT_MET | 未达到最低金额要求 |
| CART_EMPTY | 购物车为空 |

## 数据模型

### CartItem 对象

```typescript
interface CartItem {
  id: string;
  resourceId: string;
  title: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  author: {
    name: string;
    verified: boolean;
  };
  addedAt: string;
}
```

### CartSummary 对象

```typescript
interface CartSummary {
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupons: Coupon[];
}
```

### Coupon 对象

```typescript
interface Coupon {
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  discount?: number;
  minAmount?: number;
  maxDiscount?: number;
  expiresAt: string;
  applicable?: boolean;
  reason?: string;
}
```
