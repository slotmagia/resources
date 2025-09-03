# 资源吧 API 文档

## 概述

本文档描述了资源吧平台的 RESTful API 接口规范。API 基于 HTTP 协议，使用 JSON 格式进行数据交换。

## 基础信息

- **Base URL**: `https://api.ziyuanba.com/v1`
- **协议**: HTTPS
- **数据格式**: JSON
- **字符编码**: UTF-8

## 认证方式

API 使用 Bearer Token 进行身份认证：

```http
Authorization: Bearer <your_access_token>
```

## 通用响应格式

### 成功响应

```json
{
  "success": true,
  "data": {
    // 具体数据内容
  },
  "message": "操作成功",
  "timestamp": "2024-01-25T10:30:00Z"
}
```

### 错误响应

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

## HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 429 | 请求频率限制 |
| 500 | 服务器内部错误 |

## 分页参数

对于返回列表数据的接口，支持以下分页参数：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | integer | 1 | 页码，从1开始 |
| limit | integer | 20 | 每页数量，最大100 |

### 分页响应格式

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasMore": true
    }
  }
}
```

## API 模块

- [用户认证](./auth/README.md) - 用户注册、登录、权限管理
- [用户管理](./users/README.md) - 用户信息、个人资料管理
- [资源管理](./resources/README.md) - 资源浏览、搜索、详情
- [分类管理](./categories/README.md) - 资源分类相关接口
- [购物车](./cart/README.md) - 购物车操作
- [订单支付](./orders/README.md) - 订单创建、支付处理
- [下载管理](./downloads/README.md) - 文件下载相关
- [收藏夹](./favorites/README.md) - 用户收藏管理
- [评论系统](./comments/README.md) - 评论和评分
- [搜索服务](./search/README.md) - 搜索和建议
- [通知系统](./notifications/README.md) - 消息通知
- [文件上传](./upload/README.md) - 文件上传服务
- [统计分析](./analytics/README.md) - 数据统计

## 错误代码

| 错误代码 | 说明 |
|----------|------|
| INVALID_REQUEST | 请求参数无效 |
| UNAUTHORIZED | 未授权访问 |
| FORBIDDEN | 禁止访问 |
| NOT_FOUND | 资源不存在 |
| RATE_LIMIT_EXCEEDED | 请求频率超限 |
| INTERNAL_ERROR | 服务器内部错误 |
| VALIDATION_ERROR | 数据验证失败 |
| DUPLICATE_RESOURCE | 资源重复 |
| INSUFFICIENT_PERMISSIONS | 权限不足 |
| PAYMENT_REQUIRED | 需要付费 |

## 版本控制

API 版本通过 URL 路径进行控制：
- v1: `/v1/...` (当前版本)

## 限制说明

- 请求频率限制：每分钟最多 60 次请求
- 文件上传大小限制：单文件最大 100MB
- 批量操作限制：单次最多处理 100 条记录

## 联系方式

如有问题，请联系：
- 邮箱: api@ziyuanba.com
- 技术支持: support@ziyuanba.com
