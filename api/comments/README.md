# 评论系统 API

## 概述

评论系统模块提供资源评论、回复、点赞、评分等功能。

## 接口列表

### 1. 获取评论列表

**GET** `/comments`

获取资源的评论列表。

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| resourceId | string | - | 资源ID（必需） |
| page | integer | 1 | 页码 |
| limit | integer | 20 | 每页数量 |
| sortBy | string | latest | 排序方式：latest/oldest/rating/helpful |
| parentId | string | - | 父评论ID（获取回复时使用） |
| rating | integer | - | 评分筛选（1-5） |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "resourceId": "res_123456",
    "comments": [
      {
        "id": "comment_789012",
        "content": "非常好的教程，讲解清晰，实例丰富！推荐给所有想学React的朋友。",
        "rating": 5,
        "author": {
          "id": "user_345678",
          "name": "李四",
          "avatar": "https://cdn.example.com/avatars/user_345678.jpg",
          "level": 3,
          "verified": false,
          "vipLevel": "basic"
        },
        "createdAt": "2024-01-24T16:30:00Z",
        "updatedAt": "2024-01-24T16:30:00Z",
        "likes": 12,
        "dislikes": 1,
        "liked": false,
        "disliked": false,
        "helpful": true,
        "parentId": null,
        "replies": [
          {
            "id": "reply_234567",
            "content": "同感，作者讲得很详细，特别是Hooks部分",
            "author": {
              "id": "user_456789",
              "name": "王五",
              "avatar": "https://cdn.example.com/avatars/user_456789.jpg",
              "level": 2,
              "verified": true
            },
            "createdAt": "2024-01-24T17:15:00Z",
            "likes": 3,
            "dislikes": 0,
            "liked": false,
            "parentId": "comment_789012"
          }
        ],
        "replyCount": 3,
        "canEdit": false,
        "canDelete": false,
        "reported": false
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
      "totalComments": 156,
      "averageRating": 4.8,
      "ratingDistribution": {
        "5": 89,
        "4": 45,
        "3": 15,
        "2": 5,
        "1": 2
      },
      "hasUserComment": true,
      "userRating": 5
    }
  }
}
```

### 2. 添加评论

**POST** `/comments`

为资源添加评论（需要登录且已购买）。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "resourceId": "res_123456",    // 资源ID
  "content": "非常好的教程！",    // 评论内容，1-1000字符
  "rating": 5,                   // 评分，1-5星
  "parentId": null               // 父评论ID（回复时使用，可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "comment": {
      "id": "comment_890123",
      "resourceId": "res_123456",
      "content": "非常好的教程！",
      "rating": 5,
      "author": {
        "id": "user_123456",
        "name": "张三",
        "avatar": "https://cdn.example.com/avatars/user_123456.jpg",
        "level": 2,
        "verified": true,
        "vipLevel": "premium"
      },
      "createdAt": "2024-01-25T11:30:00Z",
      "likes": 0,
      "dislikes": 0,
      "parentId": null,
      "replyCount": 0,
      "canEdit": true,
      "canDelete": true
    }
  },
  "message": "评论发布成功"
}
```

### 3. 更新评论

**PUT** `/comments/{commentId}`

更新自己的评论内容。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `commentId`: 评论ID

#### 请求参数

```json
{
  "content": "更新后的评论内容",  // 新的评论内容
  "rating": 4                  // 新的评分（可选，仅对主评论有效）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "comment": {
      "id": "comment_890123",
      "content": "更新后的评论内容",
      "rating": 4,
      "updatedAt": "2024-01-25T12:00:00Z",
      "edited": true
    }
  },
  "message": "评论更新成功"
}
```

### 4. 删除评论

**DELETE** `/comments/{commentId}`

删除自己的评论。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `commentId`: 评论ID

#### 响应示例

```json
{
  "success": true,
  "message": "评论已删除"
}
```

### 5. 点赞/取消点赞评论

**POST** `/comments/{commentId}/like`

为评论点赞或取消点赞。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `commentId`: 评论ID

#### 请求参数

```json
{
  "action": "like"  // 操作类型：like/unlike/dislike/undislike
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "commentId": "comment_789012",
    "action": "like",
    "likes": 13,
    "dislikes": 1,
    "liked": true,
    "disliked": false
  },
  "message": "点赞成功"
}
```

### 6. 获取评论回复

**GET** `/comments/{commentId}/replies`

获取指定评论的回复列表。

#### 路径参数

- `commentId`: 父评论ID

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | integer | 1 | 页码 |
| limit | integer | 10 | 每页数量 |
| sortBy | string | latest | 排序方式：latest/oldest/helpful |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "parentComment": {
      "id": "comment_789012",
      "content": "非常好的教程，讲解清晰，实例丰富！",
      "author": {
        "name": "李四"
      }
    },
    "replies": [
      {
        "id": "reply_345678",
        "content": "同感，特别是Hooks部分讲得很详细",
        "author": {
          "id": "user_456789",
          "name": "王五",
          "avatar": "https://cdn.example.com/avatars/user_456789.jpg",
          "level": 2,
          "verified": true
        },
        "createdAt": "2024-01-24T17:15:00Z",
        "likes": 3,
        "dislikes": 0,
        "liked": false,
        "parentId": "comment_789012",
        "canEdit": false,
        "canDelete": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1,
      "hasMore": false
    }
  }
}
```

### 7. 举报评论

**POST** `/comments/{commentId}/report`

举报不当评论内容。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `commentId`: 评论ID

#### 请求参数

```json
{
  "reason": "spam",                    // 举报原因：spam/inappropriate/harassment/copyright/other
  "description": "这是垃圾评论内容"    // 详细描述（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "举报已提交，我们会在24小时内处理"
}
```

### 8. 获取用户评论历史

**GET** `/comments/my-comments`

获取当前用户的评论历史。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | integer | 1 | 页码 |
| limit | integer | 20 | 每页数量 |
| resourceType | string | - | 资源类型筛选 |
| rating | integer | - | 评分筛选 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "comment_890123",
        "content": "非常好的教程！",
        "rating": 5,
        "resource": {
          "id": "res_123456",
          "title": "React 完整教程视频",
          "thumbnail": "https://cdn.example.com/thumbnails/res_123456.jpg",
          "type": "video"
        },
        "createdAt": "2024-01-25T11:30:00Z",
        "likes": 2,
        "replyCount": 1,
        "canEdit": true,
        "canDelete": true
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
      "totalComments": 15,
      "averageRating": 4.6,
      "totalLikes": 45,
      "totalReplies": 8
    }
  }
}
```

### 9. 标记评论为有用

**POST** `/comments/{commentId}/helpful`

标记评论为有用或取消标记。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `commentId`: 评论ID

#### 请求参数

```json
{
  "helpful": true  // true为标记有用，false为取消标记
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "commentId": "comment_789012",
    "helpful": true,
    "helpfulCount": 8
  },
  "message": "已标记为有用"
}
```

### 10. 获取评论统计

**GET** `/comments/stats`

获取资源的评论统计信息。

#### 查询参数

| 参数 | 类型 | 说明 |
|------|------|------|
| resourceId | string | 资源ID（必需） |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "resourceId": "res_123456",
    "overview": {
      "totalComments": 156,
      "totalReplies": 89,
      "averageRating": 4.8,
      "totalLikes": 234,
      "totalDislikes": 12,
      "helpfulComments": 67
    },
    "ratingDistribution": {
      "5": {
        "count": 89,
        "percentage": 57.1
      },
      "4": {
        "count": 45,
        "percentage": 28.8
      },
      "3": {
        "count": 15,
        "percentage": 9.6
      },
      "2": {
        "count": 5,
        "percentage": 3.2
      },
      "1": {
        "count": 2,
        "percentage": 1.3
      }
    },
    "recentActivity": [
      {
        "date": "2024-01-25",
        "comments": 5,
        "averageRating": 4.6
      },
      {
        "date": "2024-01-24",
        "comments": 8,
        "averageRating": 4.9
      }
    ],
    "topComments": [
      {
        "id": "comment_789012",
        "content": "非常好的教程，讲解清晰...",
        "author": "李四",
        "likes": 12,
        "helpful": true
      }
    ]
  }
}
```

### 11. 批量操作评论

**POST** `/comments/batch`

批量操作评论（管理员功能）。

#### 请求头

```http
Authorization: Bearer <admin_access_token>
```

#### 请求参数

```json
{
  "action": "delete",           // 操作类型：delete/hide/approve
  "commentIds": [               // 评论ID列表
    "comment_123456",
    "comment_234567"
  ],
  "reason": "违规内容"          // 操作原因（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "processed": 2,
    "successful": 2,
    "failed": 0,
    "results": [
      {
        "commentId": "comment_123456",
        "status": "success"
      },
      {
        "commentId": "comment_234567",
        "status": "success"
      }
    ]
  },
  "message": "批量操作完成"
}
```

## 错误代码

| 错误代码 | 说明 |
|----------|------|
| COMMENT_NOT_FOUND | 评论不存在 |
| RESOURCE_NOT_PURCHASED | 资源未购买，无法评论 |
| ALREADY_COMMENTED | 已经评论过该资源 |
| COMMENT_TOO_LONG | 评论内容过长 |
| COMMENT_TOO_SHORT | 评论内容过短 |
| INVALID_RATING | 评分无效 |
| CANNOT_EDIT_COMMENT | 无法编辑评论 |
| CANNOT_DELETE_COMMENT | 无法删除评论 |
| CANNOT_REPLY_TO_REPLY | 无法回复回复 |
| COMMENT_EDIT_EXPIRED | 评论编辑时间已过 |
| ALREADY_LIKED | 已经点赞 |
| ALREADY_REPORTED | 已经举报过 |
| SELF_LIKE_NOT_ALLOWED | 不能给自己点赞 |

## 数据模型

### Comment 对象

```typescript
interface Comment {
  id: string;
  resourceId: string;
  content: string;
  rating?: number;
  author: CommentAuthor;
  createdAt: string;
  updatedAt?: string;
  edited?: boolean;
  likes: number;
  dislikes: number;
  liked: boolean;
  disliked: boolean;
  helpful: boolean;
  helpfulCount?: number;
  parentId?: string;
  replies?: Comment[];
  replyCount: number;
  canEdit: boolean;
  canDelete: boolean;
  reported: boolean;
  status?: 'active' | 'hidden' | 'deleted';
}
```

### CommentAuthor 对象

```typescript
interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  verified: boolean;
  vipLevel: 'none' | 'basic' | 'premium';
}
```

### CommentStats 对象

```typescript
interface CommentStats {
  totalComments: number;
  totalReplies: number;
  averageRating: number;
  totalLikes: number;
  totalDislikes: number;
  helpfulComments: number;
  ratingDistribution: {
    [key: string]: {
      count: number;
      percentage: number;
    };
  };
}
```
