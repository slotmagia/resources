# 搜索服务 API

## 概述

搜索服务模块提供全文搜索、智能建议、搜索历史、热门搜索等功能。

## 接口列表

### 1. 全文搜索

**GET** `/search`

执行全文搜索，支持多种筛选和排序选项。

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| q | string | - | 搜索关键词 |
| page | integer | 1 | 页码 |
| limit | integer | 20 | 每页数量，最大100 |
| category | string | - | 分类筛选 |
| type | string | - | 类型筛选：video/software/document/article/file |
| priceMin | number | - | 最低价格 |
| priceMax | number | - | 最高价格 |
| rating | number | - | 最低评分（1-5） |
| sortBy | string | relevance | 排序方式：relevance/latest/popular/price/rating |
| sortOrder | string | desc | 排序顺序：asc/desc |
| author | string | - | 作者筛选 |
| tags | string | - | 标签筛选，多个用逗号分隔 |
| dateRange | string | - | 时间范围：today/week/month/year |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "query": "React教程",
    "results": [
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
          "verified": true
        },
        "stats": {
          "downloads": 1234,
          "rating": 4.8,
          "reviewCount": 156
        },
        "tags": ["React", "JavaScript", "前端", "教程"],
        "createdAt": "2024-01-15T08:00:00Z",
        "relevanceScore": 0.95,
        "highlightedTitle": "<em>React</em> 完整<em>教程</em>视频",
        "highlightedDescription": "从零开始学习<em>React</em>，包含Hooks、Context、Redux等高级特性"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasMore": true
    },
    "facets": {
      "categories": [
        {
          "name": "前端开发",
          "count": 28,
          "selected": false
        },
        {
          "name": "后端开发",
          "count": 12,
          "selected": false
        }
      ],
      "types": [
        {
          "type": "video",
          "name": "视频教程",
          "count": 32,
          "selected": false
        },
        {
          "type": "document",
          "name": "技术文档",
          "count": 8,
          "selected": false
        }
      ],
      "priceRanges": [
        {
          "range": "0-50",
          "name": "0-50元",
          "count": 15
        },
        {
          "range": "50-100",
          "name": "50-100元",
          "count": 20
        }
      ],
      "authors": [
        {
          "id": "author_789",
          "name": "张老师",
          "count": 8
        }
      ]
    },
    "searchTime": 0.023,
    "suggestions": [
      "React Hooks教程",
      "React Native开发",
      "Vue.js教程"
    ]
  }
}
```

### 2. 搜索建议

**GET** `/search/suggestions`

获取搜索关键词建议。

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| q | string | - | 输入的关键词前缀 |
| limit | integer | 10 | 建议数量，最大20 |
| type | string | all | 建议类型：all/keyword/category/author/tag |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "query": "React",
    "suggestions": [
      {
        "text": "React教程",
        "type": "keyword",
        "count": 45,
        "highlighted": "<em>React</em>教程"
      },
      {
        "text": "React Hooks",
        "type": "keyword",
        "count": 32,
        "highlighted": "<em>React</em> Hooks"
      },
      {
        "text": "React Native",
        "type": "keyword",
        "count": 28,
        "highlighted": "<em>React</em> Native"
      },
      {
        "text": "前端开发",
        "type": "category",
        "count": 156,
        "highlighted": "前端开发"
      },
      {
        "text": "张老师",
        "type": "author",
        "count": 15,
        "highlighted": "张老师"
      }
    ],
    "responseTime": 0.005
  }
}
```

### 3. 热门搜索

**GET** `/search/trending`

获取热门搜索关键词。

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| period | string | week | 时间范围：day/week/month/year |
| limit | integer | 20 | 数量限制，最大50 |
| category | string | - | 分类筛选 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "period": "week",
    "keywords": [
      {
        "keyword": "React教程",
        "searchCount": 1234,
        "rank": 1,
        "rankChange": 2,
        "category": "前端开发"
      },
      {
        "keyword": "Python爬虫",
        "searchCount": 987,
        "rank": 2,
        "rankChange": -1,
        "category": "后端开发"
      },
      {
        "keyword": "Vue.js",
        "searchCount": 856,
        "rank": 3,
        "rankChange": 0,
        "category": "前端开发"
      }
    ],
    "updatedAt": "2024-01-25T12:00:00Z"
  }
}
```

### 4. 搜索历史

**GET** `/search/history`

获取用户的搜索历史（需要登录）。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| limit | integer | 20 | 历史记录数量，最大100 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "history": [
      {
        "keyword": "React教程",
        "searchedAt": "2024-01-25T11:30:00Z",
        "resultCount": 45
      },
      {
        "keyword": "Vue.js组件",
        "searchedAt": "2024-01-25T10:15:00Z",
        "resultCount": 23
      },
      {
        "keyword": "JavaScript高级",
        "searchedAt": "2024-01-24T16:45:00Z",
        "resultCount": 67
      }
    ]
  }
}
```

### 5. 保存搜索

**POST** `/search/history`

保存搜索记录到用户历史（需要登录）。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "keyword": "React教程",  // 搜索关键词
  "resultCount": 45       // 搜索结果数量（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "搜索记录已保存"
}
```

### 6. 清除搜索历史

**DELETE** `/search/history`

清除用户的搜索历史（需要登录）。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "keyword": "React教程"  // 要删除的特定关键词（可选，不提供则清除全部）
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "搜索历史已清除"
}
```

### 7. 相关搜索

**GET** `/search/related`

获取相关搜索建议。

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| q | string | - | 当前搜索关键词 |
| limit | integer | 10 | 相关搜索数量 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "query": "React教程",
    "related": [
      {
        "keyword": "React Hooks教程",
        "similarity": 0.89,
        "resultCount": 32
      },
      {
        "keyword": "React Native开发",
        "similarity": 0.76,
        "resultCount": 28
      },
      {
        "keyword": "Vue.js教程",
        "similarity": 0.65,
        "resultCount": 41
      }
    ]
  }
}
```

### 8. 搜索统计

**GET** `/search/stats`

获取搜索统计信息（管理员接口）。

#### 请求头

```http
Authorization: Bearer <admin_access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| period | string | week | 统计周期：day/week/month/year |
| startDate | string | - | 开始日期（YYYY-MM-DD） |
| endDate | string | - | 结束日期（YYYY-MM-DD） |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "period": "week",
    "totalSearches": 12345,
    "uniqueQueries": 3456,
    "averageResultsPerQuery": 23.5,
    "noResultQueries": 234,
    "topQueries": [
      {
        "keyword": "React教程",
        "count": 1234,
        "percentage": 10.0
      }
    ],
    "categoryDistribution": [
      {
        "category": "前端开发",
        "count": 4567,
        "percentage": 37.0
      }
    ],
    "searchTrends": [
      {
        "date": "2024-01-19",
        "searches": 1567
      },
      {
        "date": "2024-01-20",
        "searches": 1789
      }
    ]
  }
}
```

### 9. 智能搜索

**POST** `/search/intelligent`

使用AI进行智能搜索和内容理解。

#### 请求参数

```json
{
  "query": "我想学习前端开发，有什么好的视频教程推荐？",  // 自然语言查询
  "context": {                                        // 上下文信息（可选）
    "userLevel": "beginner",
    "preferredType": "video",
    "budget": 200
  }
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "interpretation": {
      "intent": "learning_recommendation",
      "extractedKeywords": ["前端开发", "视频教程"],
      "filters": {
        "type": "video",
        "category": "前端开发",
        "priceMax": 200
      },
      "userLevel": "beginner"
    },
    "recommendations": [
      {
        "id": "res_123456",
        "title": "零基础前端开发完整教程",
        "reason": "适合初学者，内容全面系统",
        "matchScore": 0.95
      }
    ],
    "suggestedQueries": [
      "HTML CSS基础教程",
      "JavaScript入门视频",
      "前端开发路线图"
    ]
  }
}
```

### 10. 搜索过滤器

**GET** `/search/filters`

获取可用的搜索过滤器选项。

#### 响应示例

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "frontend",
        "name": "前端开发",
        "count": 156,
        "subcategories": [
          {
            "id": "react",
            "name": "React",
            "count": 45
          }
        ]
      }
    ],
    "types": [
      {
        "id": "video",
        "name": "视频教程",
        "icon": "video",
        "count": 234
      }
    ],
    "priceRanges": [
      {
        "id": "free",
        "name": "免费",
        "min": 0,
        "max": 0,
        "count": 89
      },
      {
        "id": "budget",
        "name": "50元以下",
        "min": 0,
        "max": 50,
        "count": 123
      }
    ],
    "ratings": [
      {
        "value": 4,
        "name": "4星以上",
        "count": 167
      }
    ],
    "authors": [
      {
        "id": "author_123",
        "name": "张老师",
        "verified": true,
        "resourceCount": 15
      }
    ],
    "tags": [
      {
        "name": "React",
        "count": 45
      },
      {
        "name": "JavaScript",
        "count": 89
      }
    ]
  }
}
```

## 错误代码

| 错误代码 | 说明 |
|----------|------|
| INVALID_QUERY | 搜索查询无效 |
| QUERY_TOO_SHORT | 查询关键词太短 |
| QUERY_TOO_LONG | 查询关键词太长 |
| SEARCH_TIMEOUT | 搜索超时 |
| SEARCH_SERVICE_UNAVAILABLE | 搜索服务不可用 |
| INVALID_FILTER | 无效的筛选条件 |
| HISTORY_LIMIT_EXCEEDED | 搜索历史数量超限 |

## 数据模型

### SearchResult 对象

```typescript
interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  author: Author;
  stats: ResourceStats;
  tags: string[];
  createdAt: string;
  relevanceScore: number;
  highlightedTitle?: string;
  highlightedDescription?: string;
}
```

### SearchSuggestion 对象

```typescript
interface SearchSuggestion {
  text: string;
  type: 'keyword' | 'category' | 'author' | 'tag';
  count: number;
  highlighted?: string;
}
```

### SearchFacet 对象

```typescript
interface SearchFacet {
  name: string;
  count: number;
  selected: boolean;
}
```
