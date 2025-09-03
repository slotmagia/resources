# 资源吧 API 索引

## 快速导航

### 核心模块

| 模块 | 描述 | 文档链接 |
|------|------|----------|
| 用户认证 | 注册、登录、权限管理 | [auth/README.md](./auth/README.md) |
| 用户管理 | 用户信息、个人资料 | [users/README.md](./users/README.md) |
| 资源管理 | 资源浏览、搜索、详情 | [resources/README.md](./resources/README.md) |
| 分类管理 | 资源分类相关接口 | [categories/README.md](./categories/README.md) |

### 交易模块

| 模块 | 描述 | 文档链接 |
|------|------|----------|
| 购物车 | 购物车操作 | [cart/README.md](./cart/README.md) |
| 订单支付 | 订单创建、支付处理 | [orders/README.md](./orders/README.md) |
| 下载管理 | 文件下载相关 | [downloads/README.md](./downloads/README.md) |

### 互动模块

| 模块 | 描述 | 文档链接 |
|------|------|----------|
| 收藏夹 | 用户收藏管理 | [favorites/README.md](./favorites/README.md) |
| 评论系统 | 评论和评分 | [comments/README.md](./comments/README.md) |
| 搜索服务 | 搜索和建议 | [search/README.md](./search/README.md) |

### 系统模块

| 模块 | 描述 | 文档链接 |
|------|------|----------|
| 通知系统 | 消息通知 | [notifications/README.md](./notifications/README.md) |
| 文件上传 | 文件上传服务 | [upload/README.md](./upload/README.md) |
| 统计分析 | 数据统计 | [analytics/README.md](./analytics/README.md) |

## 接口概览

### 认证相关 (10个接口)
- POST `/auth/register` - 用户注册
- POST `/auth/login` - 用户登录
- POST `/auth/refresh` - 刷新令牌
- POST `/auth/logout` - 用户登出
- POST `/auth/forgot-password` - 忘记密码
- POST `/auth/reset-password` - 重置密码
- PUT `/auth/change-password` - 修改密码
- POST `/auth/verify-email` - 验证邮箱
- POST `/auth/resend-verification` - 重发验证邮件
- POST `/auth/oauth/{provider}` - 第三方登录

### 用户管理 (10个接口)
- GET `/users/me` - 获取当前用户信息
- PUT `/users/me` - 更新用户信息
- POST `/users/me/avatar` - 上传用户头像
- GET `/users/me/stats` - 获取用户统计信息
- GET `/users/me/purchases` - 获取用户购买历史
- GET `/users/me/downloads` - 获取用户下载历史
- GET `/users/me/favorites` - 获取用户收藏列表
- DELETE `/users/me` - 删除用户账户
- GET `/users/{userId}` - 获取用户公开信息
- PUT `/users/me/email` - 更新邮箱地址

### 资源管理 (10个接口)
- GET `/resources` - 获取资源列表
- GET `/resources/{resourceId}` - 获取资源详情
- GET `/resources/search` - 搜索资源
- GET `/resources/trending` - 获取热门资源
- GET `/resources/recommendations` - 获取推荐资源
- GET `/resources/{resourceId}/comments` - 获取资源评论
- POST `/resources/{resourceId}/comments` - 添加资源评论
- POST `/resources/{resourceId}/favorite` - 收藏/取消收藏资源
- GET `/resources/{resourceId}/download` - 获取资源下载链接
- POST `/resources/{resourceId}/report` - 举报资源

### 购物车 (11个接口)
- GET `/cart` - 获取购物车内容
- POST `/cart/items` - 添加商品到购物车
- PUT `/cart/items/{itemId}` - 更新购物车商品
- DELETE `/cart/items/{itemId}` - 删除购物车商品
- DELETE `/cart` - 清空购物车
- POST `/cart/coupons` - 应用优惠券
- DELETE `/cart/coupons/{code}` - 移除优惠券
- GET `/cart/available-coupons` - 获取可用优惠券
- POST `/cart/validate-coupon` - 验证优惠券
- GET `/cart/stats` - 获取购物车统计

### 订单支付 (10个接口)
- POST `/orders` - 创建订单
- GET `/orders/{orderId}` - 获取订单详情
- GET `/orders` - 获取订单列表
- POST `/orders/{orderId}/confirm-payment` - 确认支付
- POST `/orders/{orderId}/cancel` - 取消订单
- POST `/orders/{orderId}/refund` - 申请退款
- GET `/orders/{orderId}/refund` - 获取退款状态
- POST `/orders/{orderId}/retry-payment` - 重新支付
- GET `/orders/{orderId}/invoice` - 获取发票
- GET `/orders/payment-methods` - 获取支付方式

## 状态码说明

| 状态码 | 说明 | 使用场景 |
|--------|------|----------|
| 200 | 成功 | 请求成功处理 |
| 201 | 创建成功 | 资源创建成功 |
| 400 | 请求错误 | 参数验证失败 |
| 401 | 未授权 | 需要登录 |
| 403 | 禁止访问 | 权限不足 |
| 404 | 不存在 | 资源不存在 |
| 409 | 冲突 | 资源冲突 |
| 429 | 频率限制 | 请求过于频繁 |
| 500 | 服务器错误 | 内部错误 |

## 认证方式

所有需要认证的接口都使用 Bearer Token：

```http
Authorization: Bearer <your_access_token>
```

## 分页格式

统一的分页参数：
- `page`: 页码（从1开始）
- `limit`: 每页数量（默认20，最大100）

统一的分页响应：
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasMore": true
  }
}
```

## 错误处理

统一的错误响应格式：
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": "详细错误信息"
  },
  "timestamp": "2024-01-25T10:30:00Z"
}
```

## 常用错误代码

| 错误代码 | 说明 |
|----------|------|
| INVALID_REQUEST | 请求参数无效 |
| UNAUTHORIZED | 未授权访问 |
| FORBIDDEN | 禁止访问 |
| NOT_FOUND | 资源不存在 |
| RATE_LIMIT_EXCEEDED | 请求频率超限 |
| INTERNAL_ERROR | 服务器内部错误 |
| VALIDATION_ERROR | 数据验证失败 |

## 开发工具

### Postman Collection
- [下载 Postman Collection](./postman/ziyuanba-api.json)

### OpenAPI 规范
- [查看 OpenAPI 文档](./openapi/swagger.yaml)

### SDK 支持
- JavaScript/TypeScript SDK
- Python SDK
- PHP SDK
- Java SDK

## 版本历史

| 版本 | 发布日期 | 主要变更 |
|------|----------|----------|
| v1.0.0 | 2024-01-25 | 初始版本发布 |

## 联系方式

- **API 文档**: https://docs.api.ziyuanba.com
- **技术支持**: api@ziyuanba.com
- **问题反馈**: https://github.com/ziyuanba/api-docs/issues
