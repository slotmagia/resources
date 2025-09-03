# 资源管理 API

## 概述

资源管理模块提供资源浏览、搜索、详情查看、评价等功能。

## 接口列表

### 1. 获取资源列表

**GET** `/resources`

获取资源列表，支持分页、筛选和排序。

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | integer | 1 | 页码 |
| limit | integer | 20 | 每页数量，最大100 |
| category | string | - | 分类筛选 |
| type | string | - | 类型筛选：video/software/document/article/file |
| tags | string | - | 标签筛选，多个用逗号分隔 |
| priceMin | number | - | 最低价格 |
| priceMax | number | - | 最高价格 |
| rating | number | - | 最低评分（1-5） |
| sortBy | string | latest | 排序方式：latest/popular/price/rating |
| sortOrder | string | desc | 排序顺序：asc/desc |
| featured | boolean | - | 是否只显示精选资源 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "res_123456",
        "title": "React 完整教程视频",
        "description": "从零开始学习React，包含Hooks、Context、Redux等高级特性",
        "type": "video",
        "category": "前端开发",
        "thumbnail": "https://cdn.example.com/thumbnails/res_123456.jpg",
        "price": 99.00,
        "originalPrice": 199.00,
        "author": {
          "id": "author_789",
          "name": "张老师",
          "avatar": "https://cdn.example.com/avatars/author_789.jpg",
          "verified": true
        },
        "stats": {
          "downloads": 1234,
          "views": 5678,
          "rating": 4.8,
          "reviewCount": 156
        },
        "tags": ["React", "JavaScript", "前端", "教程"],
        "createdAt": "2024-01-15T08:00:00Z",
        "updatedAt": "2024-01-20T10:30:00Z",
        "featured": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasMore": true
    },
    "filters": {
      "categories": [
        {
          "name": "前端开发",
          "count": 45
        },
        {
          "name": "后端开发",
          "count": 32
        }
      ],
      "types": [
        {
          "type": "video",
          "name": "视频教程",
          "count": 67
        },
        {
          "type": "software",
          "name": "软件工具",
          "count": 23
        }
      ],
      "priceRange": {
        "min": 0,
        "max": 999
      }
    }
  }
}
```

### 2. 获取资源详情

**GET** `/resources/{resourceId}`

获取指定资源的详细信息。

#### 路径参数

- `resourceId`: 资源ID

#### 响应示例

```json
{
  "success": true,
  "data": {
    "id": "res_123456",
    "title": "React 完整教程视频",
    "description": "从零开始学习React，包含Hooks、Context、Redux等高级特性",
    "content": "详细的课程介绍内容...",
    "type": "video",
    "category": "前端开发",
    "thumbnail": "https://cdn.example.com/thumbnails/res_123456.jpg",
    "gallery": [
      "https://cdn.example.com/gallery/res_123456_1.jpg",
      "https://cdn.example.com/gallery/res_123456_2.jpg"
    ],
    "price": 99.00,
    "originalPrice": 199.00,
    "fileSize": 3355443200,
    "downloadUrl": "https://download.example.com/res_123456",
    "previewUrl": "https://preview.example.com/res_123456",
    "author": {
      "id": "author_789",
      "name": "张老师",
      "avatar": "https://cdn.example.com/avatars/author_789.jpg",
      "bio": "资深前端开发工程师",
      "verified": true,
      "resourceCount": 15,
      "followerCount": 2340
    },
    "stats": {
      "downloads": 1234,
      "views": 5678,
      "rating": 4.8,
      "reviewCount": 156,
      "favoriteCount": 89
    },
    "tags": ["React", "JavaScript", "前端", "教程"],
    "specifications": {
      "duration": "12小时",
      "format": "MP4",
      "resolution": "1920x1080",
      "language": "中文"
    },
    "requirements": [
      "基础的HTML/CSS知识",
      "JavaScript基础语法",
      "Node.js环境"
    ],
    "createdAt": "2024-01-15T08:00:00Z",
    "updatedAt": "2024-01-20T10:30:00Z",
    "featured": true,
    "userInteraction": {
      "purchased": false,
      "favorited": false,
      "rated": null,
      "downloaded": false
    }
  }
}
```

### 3. 搜索资源

**GET** `/resources/search`

搜索资源，支持全文搜索和高级筛选。

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| q | string | - | 搜索关键词 |
| page | integer | 1 | 页码 |
| limit | integer | 20 | 每页数量 |
| category | string | - | 分类筛选 |
| type | string | - | 类型筛选 |
| priceMin | number | - | 最低价格 |
| priceMax | number | - | 最高价格 |
| rating | number | - | 最低评分 |
| sortBy | string | relevance | 排序方式：relevance/latest/popular/price/rating |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "query": "React教程",
    "items": [
      {
        "id": "res_123456",
        "title": "React 完整教程视频",
        "description": "从零开始学习React...",
        "type": "video",
        "category": "前端开发",
        "thumbnail": "https://cdn.example.com/thumbnails/res_123456.jpg",
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
        },
        "tags": ["React", "JavaScript", "前端", "教程"],
        "relevanceScore": 0.95,
        "highlightedTitle": "<em>React</em> 完整<em>教程</em>视频",
        "highlightedDescription": "从零开始学习<em>React</em>..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasMore": true
    },
    "suggestions": [
      "React Hooks教程",
      "React Native开发",
      "Vue.js教程"
    ],
    "searchTime": 0.023
  }
}
```

### 4. 获取热门资源

**GET** `/resources/trending`

获取热门/趋势资源列表。

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| period | string | week | 时间范围：day/week/month/year |
| limit | integer | 10 | 数量限制，最大50 |
| category | string | - | 分类筛选 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "period": "week",
    "items": [
      {
        "id": "res_123456",
        "title": "React 完整教程视频",
        "thumbnail": "https://cdn.example.com/thumbnails/res_123456.jpg",
        "price": 99.00,
        "author": {
          "name": "张老师",
          "verified": true
        },
        "stats": {
          "downloads": 1234,
          "rating": 4.8,
          "trendingScore": 98.5
        },
        "rank": 1,
        "rankChange": 2
      }
    ]
  }
}
```

### 5. 获取推荐资源

**GET** `/resources/recommendations`

获取个性化推荐资源（需要登录）。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| limit | integer | 10 | 推荐数量 |
| type | string | - | 推荐类型：similar/collaborative/trending |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "type": "similar",
        "title": "基于您的浏览历史",
        "items": [
          {
            "id": "res_234567",
            "title": "Vue.js 进阶教程",
            "thumbnail": "https://cdn.example.com/thumbnails/res_234567.jpg",
            "price": 89.00,
            "reason": "与您浏览的React教程相似",
            "similarity": 0.87
          }
        ]
      },
      {
        "type": "collaborative",
        "title": "购买了相似资源的用户还喜欢",
        "items": [
          {
            "id": "res_345678",
            "title": "JavaScript高级编程",
            "thumbnail": "https://cdn.example.com/thumbnails/res_345678.jpg",
            "price": 129.00,
            "reason": "87%的用户同时购买了这个资源"
          }
        ]
      }
    ]
  }
}
```

### 6. 获取资源评论

**GET** `/resources/{resourceId}/comments`

获取资源的评论列表。

#### 路径参数

- `resourceId`: 资源ID

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | integer | 1 | 页码 |
| limit | integer | 20 | 每页数量 |
| sortBy | string | latest | 排序方式：latest/oldest/rating/helpful |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "comment_123456",
        "content": "非常好的教程，讲解清晰，实例丰富！",
        "rating": 5,
        "author": {
          "id": "user_789012",
          "name": "李四",
          "avatar": "https://cdn.example.com/avatars/user_789012.jpg",
          "level": 3,
          "verified": false
        },
        "createdAt": "2024-01-24T16:30:00Z",
        "updatedAt": "2024-01-24T16:30:00Z",
        "likes": 12,
        "liked": false,
        "replies": [
          {
            "id": "reply_234567",
            "content": "同感，作者讲得很详细",
            "author": {
              "id": "user_345678",
              "name": "王五",
              "avatar": "https://cdn.example.com/avatars/user_345678.jpg"
            },
            "createdAt": "2024-01-24T17:15:00Z",
            "likes": 3
          }
        ],
        "replyCount": 3
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8,
      "hasMore": true
    },
    "summary": {
      "averageRating": 4.8,
      "totalComments": 156,
      "ratingDistribution": {
        "5": 89,
        "4": 45,
        "3": 15,
        "2": 5,
        "1": 2
      }
    }
  }
}
```

### 7. 添加资源评论

**POST** `/resources/{resourceId}/comments`

为资源添加评论（需要登录且已购买）。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `resourceId`: 资源ID

#### 请求参数

```json
{
  "content": "string",     // 评论内容，1-1000字符
  "rating": 5              // 评分，1-5星
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "id": "comment_789012",
    "content": "非常好的教程，讲解清晰，实例丰富！",
    "rating": 5,
    "author": {
      "id": "user_123456",
      "name": "张三",
      "avatar": "https://cdn.example.com/avatars/user_123456.jpg",
      "level": 2,
      "verified": true
    },
    "createdAt": "2024-01-25T11:30:00Z",
    "likes": 0,
    "replyCount": 0
  },
  "message": "评论发布成功"
}
```

### 8. 收藏/取消收藏资源

**POST** `/resources/{resourceId}/favorite`

收藏或取消收藏资源。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `resourceId`: 资源ID

#### 请求参数

```json
{
  "action": "add"  // 操作类型：add/remove
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "favorited": true,
    "favoriteCount": 90
  },
  "message": "收藏成功"
}
```

### 9. 获取资源下载链接

**GET** `/resources/{resourceId}/download`

获取资源的下载链接（需要登录且已购买）。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `resourceId`: 资源ID

#### 响应示例

```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://secure-download.example.com/res_123456?token=abc123",
    "expiresAt": "2024-01-25T13:30:00Z",
    "fileSize": 3355443200,
    "fileName": "React完整教程视频.zip",
    "downloadCount": 3,
    "remainingDownloads": 7
  }
}
```

### 10. 举报资源

**POST** `/resources/{resourceId}/report`

举报不当资源内容。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `resourceId`: 资源ID

#### 请求参数

```json
{
  "reason": "string",      // 举报原因：copyright/inappropriate/spam/other
  "description": "string"  // 详细描述（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "举报已提交，我们会在24小时内处理"
}
```

## 错误代码

| 错误代码 | 说明 |
|----------|------|
| RESOURCE_NOT_FOUND | 资源不存在 |
| RESOURCE_NOT_PURCHASED | 资源未购买 |
| DOWNLOAD_LIMIT_EXCEEDED | 下载次数超限 |
| INVALID_RATING | 评分无效 |
| COMMENT_TOO_LONG | 评论内容过长 |
| ALREADY_COMMENTED | 已经评论过 |
| ALREADY_FAVORITED | 已经收藏 |
| REPORT_DUPLICATE | 重复举报 |

## 数据模型

### Resource 对象

```typescript
interface Resource {
  id: string;
  title: string;
  description: string;
  content?: string;
  type: 'video' | 'software' | 'document' | 'article' | 'file';
  category: string;
  thumbnail: string;
  gallery?: string[];
  price: number;
  originalPrice?: number;
  fileSize?: number;
  downloadUrl?: string;
  previewUrl?: string;
  author: Author;
  stats: ResourceStats;
  tags: string[];
  specifications?: Record<string, string>;
  requirements?: string[];
  createdAt: string;
  updatedAt: string;
  featured: boolean;
}
```

### Author 对象

```typescript
interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  verified: boolean;
  resourceCount?: number;
  followerCount?: number;
}
```

### ResourceStats 对象

```typescript
interface ResourceStats {
  downloads: number;
  views: number;
  rating: number;
  reviewCount: number;
  favoriteCount?: number;
}
```
