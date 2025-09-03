# 分类管理 API

## 概述

分类管理模块提供资源分类查询、分类统计、热门分类等功能。

## 接口列表

### 1. 获取分类列表

**GET** `/categories`

获取所有资源分类的层级结构。

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| includeCount | boolean | false | 是否包含资源数量统计 |
| level | integer | - | 分类层级：1/2/3 |
| parentId | string | - | 父分类ID |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_frontend",
        "name": "前端开发",
        "slug": "frontend-development",
        "description": "前端开发相关技术和工具",
        "icon": "https://cdn.example.com/icons/frontend.svg",
        "color": "#3B82F6",
        "level": 1,
        "parentId": null,
        "resourceCount": 156,
        "children": [
          {
            "id": "cat_react",
            "name": "React",
            "slug": "react",
            "description": "React框架相关资源",
            "level": 2,
            "parentId": "cat_frontend",
            "resourceCount": 45,
            "children": [
              {
                "id": "cat_react_hooks",
                "name": "React Hooks",
                "slug": "react-hooks",
                "level": 3,
                "parentId": "cat_react",
                "resourceCount": 12
              }
            ]
          },
          {
            "id": "cat_vue",
            "name": "Vue.js",
            "slug": "vuejs",
            "description": "Vue.js框架相关资源",
            "level": 2,
            "parentId": "cat_frontend",
            "resourceCount": 38
          }
        ]
      },
      {
        "id": "cat_backend",
        "name": "后端开发",
        "slug": "backend-development",
        "description": "后端开发技术和框架",
        "icon": "https://cdn.example.com/icons/backend.svg",
        "color": "#10B981",
        "level": 1,
        "parentId": null,
        "resourceCount": 124,
        "children": [
          {
            "id": "cat_nodejs",
            "name": "Node.js",
            "slug": "nodejs",
            "level": 2,
            "parentId": "cat_backend",
            "resourceCount": 32
          }
        ]
      }
    ]
  }
}
```

### 2. 获取分类详情

**GET** `/categories/{categoryId}`

获取指定分类的详细信息。

#### 路径参数

- `categoryId`: 分类ID或slug

#### 响应示例

```json
{
  "success": true,
  "data": {
    "category": {
      "id": "cat_frontend",
      "name": "前端开发",
      "slug": "frontend-development",
      "description": "前端开发是创建网站和Web应用程序用户界面的技术领域，包括HTML、CSS、JavaScript等核心技术。",
      "icon": "https://cdn.example.com/icons/frontend.svg",
      "banner": "https://cdn.example.com/banners/frontend.jpg",
      "color": "#3B82F6",
      "level": 1,
      "parentId": null,
      "path": ["前端开发"],
      "resourceCount": 156,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-20T10:30:00Z",
      "seo": {
        "title": "前端开发资源 - 学习HTML、CSS、JavaScript",
        "description": "提供最新的前端开发教程、工具和资源",
        "keywords": ["前端开发", "HTML", "CSS", "JavaScript", "React", "Vue"]
      }
    },
    "statistics": {
      "totalResources": 156,
      "freeResources": 45,
      "paidResources": 111,
      "averagePrice": 89.50,
      "averageRating": 4.6,
      "totalDownloads": 12345,
      "typeDistribution": [
        {
          "type": "video",
          "name": "视频教程",
          "count": 89,
          "percentage": 57.1
        },
        {
          "type": "document",
          "name": "技术文档",
          "count": 34,
          "percentage": 21.8
        }
      ]
    },
    "subcategories": [
      {
        "id": "cat_react",
        "name": "React",
        "resourceCount": 45
      },
      {
        "id": "cat_vue",
        "name": "Vue.js",
        "resourceCount": 38
      }
    ]
  }
}
```

### 3. 获取分类资源

**GET** `/categories/{categoryId}/resources`

获取指定分类下的资源列表。

#### 路径参数

- `categoryId`: 分类ID或slug

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | integer | 1 | 页码 |
| limit | integer | 20 | 每页数量 |
| type | string | - | 资源类型筛选 |
| sortBy | string | latest | 排序方式：latest/popular/price/rating |
| priceMin | number | - | 最低价格 |
| priceMax | number | - | 最高价格 |
| rating | number | - | 最低评分 |
| includeSubcategories | boolean | true | 是否包含子分类资源 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "category": {
      "id": "cat_frontend",
      "name": "前端开发",
      "path": ["前端开发"]
    },
    "resources": [
      {
        "id": "res_123456",
        "title": "React 完整教程视频",
        "description": "从零开始学习React...",
        "type": "video",
        "thumbnail": "https://cdn.example.com/thumbnails/res_123456.jpg",
        "price": 99.00,
        "author": {
          "name": "张老师",
          "verified": true
        },
        "stats": {
          "downloads": 1234,
          "rating": 4.8,
          "reviewCount": 156
        },
        "tags": ["React", "JavaScript", "前端"],
        "createdAt": "2024-01-15T08:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8,
      "hasMore": true
    },
    "filters": {
      "types": [
        {
          "type": "video",
          "name": "视频教程",
          "count": 89
        }
      ],
      "priceRange": {
        "min": 0,
        "max": 299
      },
      "authors": [
        {
          "id": "author_123",
          "name": "张老师",
          "count": 8
        }
      ]
    }
  }
}
```

### 4. 获取热门分类

**GET** `/categories/trending`

获取热门分类列表。

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| period | string | week | 时间范围：day/week/month/year |
| limit | integer | 10 | 数量限制 |
| level | integer | - | 分类层级筛选 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "period": "week",
    "categories": [
      {
        "id": "cat_frontend",
        "name": "前端开发",
        "icon": "https://cdn.example.com/icons/frontend.svg",
        "resourceCount": 156,
        "viewCount": 5678,
        "downloadCount": 1234,
        "rank": 1,
        "rankChange": 2,
        "trendingScore": 98.5
      },
      {
        "id": "cat_ai",
        "name": "人工智能",
        "icon": "https://cdn.example.com/icons/ai.svg",
        "resourceCount": 89,
        "viewCount": 4321,
        "downloadCount": 987,
        "rank": 2,
        "rankChange": -1,
        "trendingScore": 95.2
      }
    ],
    "updatedAt": "2024-01-25T12:00:00Z"
  }
}
```

### 5. 搜索分类

**GET** `/categories/search`

搜索分类。

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| q | string | - | 搜索关键词 |
| limit | integer | 20 | 结果数量 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "query": "前端",
    "categories": [
      {
        "id": "cat_frontend",
        "name": "前端开发",
        "description": "前端开发相关技术和工具",
        "resourceCount": 156,
        "relevanceScore": 0.95,
        "highlightedName": "<em>前端</em>开发"
      },
      {
        "id": "cat_frontend_tools",
        "name": "前端工具",
        "description": "前端开发工具和插件",
        "resourceCount": 45,
        "relevanceScore": 0.87,
        "highlightedName": "<em>前端</em>工具"
      }
    ]
  }
}
```

### 6. 获取分类统计

**GET** `/categories/stats`

获取分类统计信息。

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| period | string | month | 统计周期：day/week/month/year |
| categoryId | string | - | 特定分类ID |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalCategories": 45,
      "totalResources": 2340,
      "totalDownloads": 123456,
      "averageResourcesPerCategory": 52.0
    },
    "topCategories": [
      {
        "id": "cat_frontend",
        "name": "前端开发",
        "resourceCount": 156,
        "downloadCount": 12345,
        "revenue": 15678.90
      }
    ],
    "categoryGrowth": [
      {
        "categoryId": "cat_ai",
        "name": "人工智能",
        "growthRate": 45.2,
        "newResources": 23
      }
    ],
    "typeDistribution": [
      {
        "type": "video",
        "name": "视频教程",
        "count": 1234,
        "percentage": 52.7
      }
    ]
  }
}
```

### 7. 获取分类路径

**GET** `/categories/{categoryId}/path`

获取分类的完整路径（面包屑导航）。

#### 路径参数

- `categoryId`: 分类ID

#### 响应示例

```json
{
  "success": true,
  "data": {
    "path": [
      {
        "id": "cat_development",
        "name": "开发技术",
        "slug": "development",
        "level": 1
      },
      {
        "id": "cat_frontend",
        "name": "前端开发",
        "slug": "frontend-development",
        "level": 2
      },
      {
        "id": "cat_react",
        "name": "React",
        "slug": "react",
        "level": 3
      }
    ]
  }
}
```

### 8. 获取相关分类

**GET** `/categories/{categoryId}/related`

获取相关分类推荐。

#### 路径参数

- `categoryId`: 分类ID

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| limit | integer | 5 | 推荐数量 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "category": {
      "id": "cat_react",
      "name": "React"
    },
    "related": [
      {
        "id": "cat_vue",
        "name": "Vue.js",
        "resourceCount": 38,
        "similarity": 0.85,
        "reason": "同为前端框架"
      },
      {
        "id": "cat_javascript",
        "name": "JavaScript",
        "resourceCount": 67,
        "similarity": 0.78,
        "reason": "技术栈相关"
      }
    ]
  }
}
```

## 错误代码

| 错误代码 | 说明 |
|----------|------|
| CATEGORY_NOT_FOUND | 分类不存在 |
| INVALID_CATEGORY_LEVEL | 无效的分类层级 |
| CATEGORY_SLUG_EXISTS | 分类标识已存在 |
| PARENT_CATEGORY_NOT_FOUND | 父分类不存在 |
| CIRCULAR_REFERENCE | 循环引用 |
| MAX_DEPTH_EXCEEDED | 超过最大层级深度 |

## 数据模型

### Category 对象

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  banner?: string;
  color?: string;
  level: number;
  parentId?: string;
  path: string[];
  resourceCount: number;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
}
```

### CategoryStats 对象

```typescript
interface CategoryStats {
  totalResources: number;
  freeResources: number;
  paidResources: number;
  averagePrice: number;
  averageRating: number;
  totalDownloads: number;
  typeDistribution: {
    type: string;
    name: string;
    count: number;
    percentage: number;
  }[];
}
```
