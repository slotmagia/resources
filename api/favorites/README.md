# 收藏夹 API

## 概述

收藏夹模块提供用户收藏资源管理、收藏夹分组、收藏统计等功能。

## 接口列表

### 1. 获取收藏列表

**GET** `/favorites`

获取当前用户的收藏资源列表。

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
| type | string | - | 资源类型筛选 |
| folderId | string | - | 收藏夹分组ID |
| sortBy | string | latest | 排序方式：latest/oldest/title/price |

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
          "description": "从零开始学习React，包含Hooks、Context、Redux等高级特性",
          "type": "video",
          "category": "前端开发",
          "thumbnail": "https://cdn.example.com/thumbnails/res_345678.jpg",
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
            "rating": 4.8,
            "reviewCount": 156
          },
          "tags": ["React", "JavaScript", "前端", "教程"]
        },
        "folderId": "folder_default",
        "folderName": "默认收藏夹",
        "favoritedAt": "2024-01-20T14:20:00Z",
        "notes": "很好的React教程，值得学习"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "totalPages": 1,
      "hasMore": false
    },
    "summary": {
      "totalFavorites": 12,
      "totalValue": 1188.00,
      "categoryBreakdown": [
        {
          "category": "前端开发",
          "count": 8,
          "value": 792.00
        },
        {
          "category": "后端开发",
          "count": 4,
          "value": 396.00
        }
      ]
    }
  }
}
```

### 2. 添加收藏

**POST** `/favorites`

将资源添加到收藏夹。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "resourceId": "res_345678",     // 资源ID
  "folderId": "folder_123",       // 收藏夹分组ID（可选，默认为默认分组）
  "notes": "很好的教程资源"        // 收藏备注（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "favorite": {
      "id": "fav_789012",
      "resourceId": "res_345678",
      "folderId": "folder_123",
      "folderName": "前端学习",
      "notes": "很好的教程资源",
      "favoritedAt": "2024-01-25T11:30:00Z"
    }
  },
  "message": "收藏成功"
}
```

### 3. 移除收藏

**DELETE** `/favorites/{favoriteId}`

从收藏夹中移除资源。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `favoriteId`: 收藏记录ID

#### 响应示例

```json
{
  "success": true,
  "message": "已取消收藏"
}
```

### 4. 批量操作收藏

**POST** `/favorites/batch`

批量添加或移除收藏。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "action": "add",                    // 操作类型：add/remove/move
  "resourceIds": [                    // 资源ID列表
    "res_123456",
    "res_234567"
  ],
  "folderId": "folder_123",          // 目标收藏夹ID（add/move操作时需要）
  "favoriteIds": [                   // 收藏记录ID列表（remove/move操作时需要）
    "fav_345678",
    "fav_456789"
  ]
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
        "resourceId": "res_123456",
        "status": "success",
        "favoriteId": "fav_890123"
      },
      {
        "resourceId": "res_234567",
        "status": "success",
        "favoriteId": "fav_901234"
      }
    ]
  },
  "message": "批量操作完成"
}
```

### 5. 更新收藏信息

**PUT** `/favorites/{favoriteId}`

更新收藏的备注或分组。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `favoriteId`: 收藏记录ID

#### 请求参数

```json
{
  "folderId": "folder_456",          // 新的收藏夹分组ID（可选）
  "notes": "更新后的备注信息"         // 新的备注（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "favorite": {
      "id": "fav_123456",
      "folderId": "folder_456",
      "folderName": "后端学习",
      "notes": "更新后的备注信息",
      "updatedAt": "2024-01-25T12:00:00Z"
    }
  },
  "message": "收藏信息已更新"
}
```

### 6. 获取收藏夹分组

**GET** `/favorites/folders`

获取用户的收藏夹分组列表。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "folders": [
      {
        "id": "folder_default",
        "name": "默认收藏夹",
        "description": "系统默认收藏夹",
        "color": "#6B7280",
        "isDefault": true,
        "resourceCount": 5,
        "createdAt": "2024-01-15T08:00:00Z",
        "updatedAt": "2024-01-25T11:30:00Z"
      },
      {
        "id": "folder_123",
        "name": "前端学习",
        "description": "前端开发相关资源",
        "color": "#3B82F6",
        "isDefault": false,
        "resourceCount": 8,
        "createdAt": "2024-01-18T10:15:00Z",
        "updatedAt": "2024-01-24T16:45:00Z"
      }
    ]
  }
}
```

### 7. 创建收藏夹分组

**POST** `/favorites/folders`

创建新的收藏夹分组。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "name": "移动开发",               // 分组名称
  "description": "移动端开发资源",   // 分组描述（可选）
  "color": "#10B981"              // 分组颜色（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "folder": {
      "id": "folder_456",
      "name": "移动开发",
      "description": "移动端开发资源",
      "color": "#10B981",
      "isDefault": false,
      "resourceCount": 0,
      "createdAt": "2024-01-25T12:30:00Z"
    }
  },
  "message": "收藏夹分组创建成功"
}
```

### 8. 更新收藏夹分组

**PUT** `/favorites/folders/{folderId}`

更新收藏夹分组信息。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `folderId`: 收藏夹分组ID

#### 请求参数

```json
{
  "name": "全栈开发",               // 新名称（可选）
  "description": "全栈开发资源集合", // 新描述（可选）
  "color": "#8B5CF6"              // 新颜色（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "folder": {
      "id": "folder_456",
      "name": "全栈开发",
      "description": "全栈开发资源集合",
      "color": "#8B5CF6",
      "updatedAt": "2024-01-25T13:00:00Z"
    }
  },
  "message": "收藏夹分组已更新"
}
```

### 9. 删除收藏夹分组

**DELETE** `/favorites/folders/{folderId}`

删除收藏夹分组（分组内的收藏会移动到默认分组）。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `folderId`: 收藏夹分组ID

#### 响应示例

```json
{
  "success": true,
  "data": {
    "movedCount": 3,
    "targetFolder": {
      "id": "folder_default",
      "name": "默认收藏夹"
    }
  },
  "message": "收藏夹分组已删除，3个收藏已移动到默认分组"
}
```

### 10. 检查收藏状态

**GET** `/favorites/check`

检查资源是否已被收藏。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 说明 |
|------|------|------|
| resourceIds | string | 资源ID列表，用逗号分隔 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "resourceId": "res_123456",
        "favorited": true,
        "favoriteId": "fav_789012",
        "folderId": "folder_123",
        "favoritedAt": "2024-01-20T14:20:00Z"
      },
      {
        "resourceId": "res_234567",
        "favorited": false
      }
    ]
  }
}
```

### 11. 获取收藏统计

**GET** `/favorites/stats`

获取用户收藏的统计信息。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalFavorites": 25,
      "totalFolders": 4,
      "totalValue": 2475.00,
      "averagePrice": 99.00
    },
    "categoryStats": [
      {
        "category": "前端开发",
        "count": 12,
        "value": 1188.00,
        "percentage": 48.0
      },
      {
        "category": "后端开发",
        "count": 8,
        "value": 792.00,
        "percentage": 32.0
      }
    ],
    "typeStats": [
      {
        "type": "video",
        "name": "视频教程",
        "count": 15,
        "percentage": 60.0
      },
      {
        "type": "document",
        "name": "技术文档",
        "count": 6,
        "percentage": 24.0
      }
    ],
    "recentActivity": [
      {
        "date": "2024-01-25",
        "count": 2
      },
      {
        "date": "2024-01-24",
        "count": 1
      }
    ]
  }
}
```

## 错误代码

| 错误代码 | 说明 |
|----------|------|
| FAVORITE_NOT_FOUND | 收藏记录不存在 |
| RESOURCE_ALREADY_FAVORITED | 资源已收藏 |
| FOLDER_NOT_FOUND | 收藏夹分组不存在 |
| FOLDER_NAME_EXISTS | 分组名称已存在 |
| DEFAULT_FOLDER_CANNOT_DELETE | 默认分组不能删除 |
| FOLDER_NOT_EMPTY | 分组不为空 |
| MAX_FOLDERS_EXCEEDED | 超过最大分组数量限制 |
| MAX_FAVORITES_EXCEEDED | 超过最大收藏数量限制 |

## 数据模型

### Favorite 对象

```typescript
interface Favorite {
  id: string;
  resourceId: string;
  resource: Resource;
  folderId: string;
  folderName: string;
  notes?: string;
  favoritedAt: string;
  updatedAt?: string;
}
```

### FavoriteFolder 对象

```typescript
interface FavoriteFolder {
  id: string;
  name: string;
  description?: string;
  color: string;
  isDefault: boolean;
  resourceCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### FavoriteStats 对象

```typescript
interface FavoriteStats {
  totalFavorites: number;
  totalFolders: number;
  totalValue: number;
  averagePrice: number;
  categoryStats: {
    category: string;
    count: number;
    value: number;
    percentage: number;
  }[];
  typeStats: {
    type: string;
    name: string;
    count: number;
    percentage: number;
  }[];
}
```
