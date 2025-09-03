# 用户管理 API

## 概述

用户管理模块提供用户信息查询、个人资料管理、用户统计等功能。

## 接口列表

### 1. 获取当前用户信息

**GET** `/users/me`

获取当前登录用户的详细信息。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "id": "user_123456",
    "name": "张三",
    "email": "zhangsan@example.com",
    "avatar": "https://cdn.example.com/avatars/user_123456.jpg",
    "bio": "前端开发工程师，热爱技术分享",
    "website": "https://zhangsan.dev",
    "company": "某科技公司",
    "location": "北京",
    "vipLevel": "basic",
    "vipExpiry": "2024-12-31T23:59:59Z",
    "verified": true,
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-01-25T10:30:00Z",
    "lastLoginAt": "2024-01-25T09:15:00Z",
    "stats": {
      "purchasedResources": 23,
      "downloadCount": 156,
      "favoriteCount": 12,
      "totalSpent": 299.00
    }
  }
}
```

### 2. 更新用户信息

**PUT** `/users/me`

更新当前用户的个人信息。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "name": "string",        // 用户名（可选）
  "bio": "string",         // 个人简介（可选）
  "website": "string",     // 个人网站（可选）
  "company": "string",     // 公司（可选）
  "location": "string"     // 所在地（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "id": "user_123456",
    "name": "张三",
    "email": "zhangsan@example.com",
    "bio": "全栈开发工程师，专注于Web技术",
    "website": "https://zhangsan.dev",
    "company": "新科技公司",
    "location": "上海",
    "updatedAt": "2024-01-25T11:00:00Z"
  },
  "message": "个人信息更新成功"
}
```

### 3. 上传用户头像

**POST** `/users/me/avatar`

上传或更新用户头像。

#### 请求头

```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

#### 请求参数

```
avatar: File  // 头像文件，支持jpg、png、gif格式，最大5MB
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "avatar": "https://cdn.example.com/avatars/user_123456_new.jpg",
    "updatedAt": "2024-01-25T11:15:00Z"
  },
  "message": "头像上传成功"
}
```

### 4. 获取用户统计信息

**GET** `/users/me/stats`

获取当前用户的详细统计信息。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 说明 |
|------|------|------|
| period | string | 统计周期：day/week/month/year（可选，默认all） |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "overview": {
      "purchasedResources": 23,
      "downloadCount": 156,
      "favoriteCount": 12,
      "totalSpent": 299.00,
      "memberDays": 45
    },
    "recentActivity": {
      "lastPurchase": "2024-01-24T15:30:00Z",
      "lastDownload": "2024-01-25T09:45:00Z",
      "lastLogin": "2024-01-25T09:15:00Z"
    },
    "categoryStats": [
      {
        "category": "前端开发",
        "count": 8,
        "spent": 120.00
      },
      {
        "category": "后端开发",
        "count": 5,
        "spent": 89.00
      }
    ],
    "monthlyStats": [
      {
        "month": "2024-01",
        "purchases": 3,
        "downloads": 15,
        "spent": 99.00
      }
    ]
  }
}
```

### 5. 获取用户购买历史

**GET** `/users/me/purchases`

获取用户的购买历史记录。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | integer | 1 | 页码 |
| limit | integer | 20 | 每页数量 |
| status | string | all | 订单状态：all/paid/pending/failed |
| startDate | string | - | 开始日期（YYYY-MM-DD） |
| endDate | string | - | 结束日期（YYYY-MM-DD） |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "orderId": "order_789012",
        "resourceId": "res_345678",
        "resourceTitle": "React 完整教程视频",
        "resourceThumbnail": "https://cdn.example.com/thumbnails/res_345678.jpg",
        "price": 99.00,
        "status": "paid",
        "purchasedAt": "2024-01-24T15:30:00Z",
        "downloadUrl": "https://download.example.com/res_345678"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 23,
      "totalPages": 2,
      "hasMore": true
    }
  }
}
```

### 6. 获取用户下载历史

**GET** `/users/me/downloads`

获取用户的下载历史记录。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | integer | 1 | 页码 |
| limit | integer | 20 | 每页数量 |
| resourceType | string | all | 资源类型筛选 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "download_456789",
        "resourceId": "res_345678",
        "resourceTitle": "React 完整教程视频",
        "resourceType": "video",
        "fileSize": 3355443200,
        "downloadedAt": "2024-01-25T09:45:00Z",
        "downloadCount": 3,
        "lastDownloadAt": "2024-01-25T09:45:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8,
      "hasMore": true
    }
  }
}
```

### 7. 获取用户收藏列表

**GET** `/users/me/favorites`

获取用户收藏的资源列表。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | integer | 1 | 页码 |
| limit | integer | 20 | 每页数量 |
| category | string | - | 分类筛选 |
| type | string | - | 类型筛选 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "fav_123456",
        "resource": {
          "id": "res_345678",
          "title": "React 完整教程视频",
          "description": "从零开始学习React...",
          "type": "video",
          "category": "前端开发",
          "thumbnail": "https://cdn.example.com/thumbnails/res_345678.jpg",
          "price": 99.00,
          "author": {
            "id": "author_789",
            "name": "张老师",
            "verified": true
          },
          "stats": {
            "downloads": 1234,
            "rating": 4.8,
            "reviewCount": 156
          }
        },
        "favoritedAt": "2024-01-20T14:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "totalPages": 1,
      "hasMore": false
    }
  }
}
```

### 8. 删除用户账户

**DELETE** `/users/me`

删除当前用户账户（软删除）。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "password": "string",    // 当前密码确认
  "reason": "string"       // 删除原因（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "账户删除成功，您的数据将在30天后永久删除"
}
```

### 9. 获取用户公开信息

**GET** `/users/{userId}`

获取指定用户的公开信息。

#### 路径参数

- `userId`: 用户ID

#### 响应示例

```json
{
  "success": true,
  "data": {
    "id": "user_123456",
    "name": "张三",
    "avatar": "https://cdn.example.com/avatars/user_123456.jpg",
    "bio": "前端开发工程师，热爱技术分享",
    "website": "https://zhangsan.dev",
    "company": "某科技公司",
    "location": "北京",
    "verified": true,
    "joinedAt": "2024-01-15T08:00:00Z",
    "publicStats": {
      "resourcesShared": 5,
      "totalDownloads": 2340,
      "averageRating": 4.7
    }
  }
}
```

### 10. 更新邮箱地址

**PUT** `/users/me/email`

更新用户邮箱地址。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "newEmail": "string",    // 新邮箱地址
  "password": "string"     // 当前密码确认
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "邮箱更新请求已提交，请查收新邮箱的验证邮件"
}
```

## 错误代码

| 错误代码 | 说明 |
|----------|------|
| USER_NOT_FOUND | 用户不存在 |
| INVALID_PASSWORD | 密码错误 |
| EMAIL_ALREADY_EXISTS | 邮箱已被使用 |
| INVALID_FILE_FORMAT | 文件格式不支持 |
| FILE_TOO_LARGE | 文件过大 |
| INSUFFICIENT_PERMISSIONS | 权限不足 |
| ACCOUNT_DEACTIVATED | 账户已停用 |

## 数据模型

### UserProfile 对象

```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  website?: string;
  company?: string;
  location?: string;
  vipLevel: 'none' | 'basic' | 'premium';
  vipExpiry?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}
```

### UserStats 对象

```typescript
interface UserStats {
  purchasedResources: number;
  downloadCount: number;
  favoriteCount: number;
  totalSpent: number;
  memberDays: number;
}
```
