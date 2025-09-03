# 统计分析 API

## 概述

统计分析模块提供数据统计、用户行为分析、业务指标监控等功能。

## 接口列表

### 1. 获取概览统计

**GET** `/analytics/overview`

获取平台概览统计数据。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| period | string | month | 统计周期：day/week/month/quarter/year |
| startDate | string | - | 开始日期（YYYY-MM-DD） |
| endDate | string | - | 结束日期（YYYY-MM-DD） |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "period": "month",
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    },
    "overview": {
      "totalUsers": 12345,
      "newUsers": 1234,
      "activeUsers": 5678,
      "totalResources": 2340,
      "newResources": 89,
      "totalOrders": 3456,
      "totalRevenue": 234567.89,
      "totalDownloads": 45678
    },
    "growth": {
      "users": {
        "current": 12345,
        "previous": 11111,
        "change": 1234,
        "changePercent": 11.1
      },
      "revenue": {
        "current": 234567.89,
        "previous": 198765.43,
        "change": 35802.46,
        "changePercent": 18.0
      },
      "orders": {
        "current": 3456,
        "previous": 2987,
        "change": 469,
        "changePercent": 15.7
      }
    },
    "trends": [
      {
        "date": "2024-01-01",
        "users": 400,
        "orders": 45,
        "revenue": 3456.78
      },
      {
        "date": "2024-01-02",
        "users": 420,
        "orders": 52,
        "revenue": 4123.45
      }
    ]
  }
}
```

### 2. 获取用户统计

**GET** `/analytics/users`

获取用户相关统计数据。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| period | string | month | 统计周期 |
| metric | string | - | 指标筛选：registration/activity/retention |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "userStats": {
      "totalUsers": 12345,
      "newUsers": 1234,
      "activeUsers": 5678,
      "retentionRate": 68.5,
      "averageSessionDuration": 1800,
      "bounceRate": 32.1
    },
    "demographics": {
      "ageGroups": [
        {
          "range": "18-25",
          "count": 3456,
          "percentage": 28.0
        },
        {
          "range": "26-35",
          "count": 4567,
          "percentage": 37.0
        }
      ],
      "locations": [
        {
          "country": "中国",
          "count": 8901,
          "percentage": 72.1
        },
        {
          "country": "美国",
          "count": 1234,
          "percentage": 10.0
        }
      ],
      "devices": [
        {
          "type": "desktop",
          "count": 7890,
          "percentage": 63.9
        },
        {
          "type": "mobile",
          "count": 3456,
          "percentage": 28.0
        }
      ]
    },
    "registrationTrend": [
      {
        "date": "2024-01-01",
        "registrations": 45
      },
      {
        "date": "2024-01-02",
        "registrations": 52
      }
    ],
    "activityTrend": [
      {
        "date": "2024-01-01",
        "activeUsers": 1234,
        "sessions": 2345,
        "pageViews": 12345
      }
    ]
  }
}
```

### 3. 获取资源统计

**GET** `/analytics/resources`

获取资源相关统计数据。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| period | string | month | 统计周期 |
| category | string | - | 分类筛选 |
| type | string | - | 类型筛选 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "resourceStats": {
      "totalResources": 2340,
      "newResources": 89,
      "totalViews": 123456,
      "totalDownloads": 45678,
      "averageRating": 4.6,
      "conversionRate": 12.5
    },
    "topResources": [
      {
        "id": "res_123456",
        "title": "React 完整教程视频",
        "category": "前端开发",
        "views": 5678,
        "downloads": 1234,
        "revenue": 12345.67,
        "rating": 4.8
      }
    ],
    "categoryStats": [
      {
        "category": "前端开发",
        "resourceCount": 456,
        "views": 34567,
        "downloads": 12345,
        "revenue": 67890.12
      }
    ],
    "typeStats": [
      {
        "type": "video",
        "name": "视频教程",
        "count": 1234,
        "views": 67890,
        "downloads": 23456
      }
    ],
    "uploadTrend": [
      {
        "date": "2024-01-01",
        "uploads": 12,
        "approvals": 10
      }
    ]
  }
}
```

### 4. 获取销售统计

**GET** `/analytics/sales`

获取销售相关统计数据。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| period | string | month | 统计周期 |
| currency | string | CNY | 货币单位 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "salesStats": {
      "totalOrders": 3456,
      "completedOrders": 3234,
      "totalRevenue": 234567.89,
      "averageOrderValue": 72.56,
      "conversionRate": 8.9,
      "refundRate": 2.1
    },
    "paymentMethods": [
      {
        "method": "alipay",
        "name": "支付宝",
        "count": 1890,
        "amount": 137890.12,
        "percentage": 58.8
      },
      {
        "method": "wechat",
        "name": "微信支付",
        "count": 1234,
        "amount": 89012.34,
        "percentage": 38.0
      }
    ],
    "revenueTrend": [
      {
        "date": "2024-01-01",
        "orders": 45,
        "revenue": 3456.78,
        "refunds": 123.45
      }
    ],
    "topProducts": [
      {
        "resourceId": "res_123456",
        "title": "React 完整教程视频",
        "orders": 234,
        "revenue": 23456.78,
        "refunds": 2
      }
    ]
  }
}
```

### 5. 获取用户行为分析

**GET** `/analytics/behavior`

获取用户行为分析数据。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| period | string | month | 统计周期 |
| event | string | - | 事件类型筛选 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "pageViews": {
      "total": 123456,
      "unique": 45678,
      "averageTime": 180,
      "bounceRate": 32.1
    },
    "topPages": [
      {
        "path": "/",
        "title": "首页",
        "views": 23456,
        "uniqueViews": 12345,
        "averageTime": 120,
        "bounceRate": 25.6
      },
      {
        "path": "/resources",
        "title": "资源中心",
        "views": 18901,
        "uniqueViews": 9876,
        "averageTime": 240,
        "bounceRate": 28.9
      }
    ],
    "userFlow": [
      {
        "from": "/",
        "to": "/resources",
        "count": 5678,
        "percentage": 45.6
      },
      {
        "from": "/resources",
        "to": "/resources/res_123456",
        "count": 2345,
        "percentage": 12.4
      }
    ],
    "searchBehavior": {
      "totalSearches": 12345,
      "uniqueQueries": 3456,
      "noResultRate": 8.9,
      "clickThroughRate": 67.8,
      "topQueries": [
        {
          "query": "React教程",
          "count": 1234,
          "clickRate": 78.9
        }
      ]
    },
    "conversionFunnel": [
      {
        "step": "访问首页",
        "users": 10000,
        "conversionRate": 100.0
      },
      {
        "step": "浏览资源",
        "users": 6789,
        "conversionRate": 67.9
      },
      {
        "step": "添加购物车",
        "users": 1234,
        "conversionRate": 18.2
      },
      {
        "step": "完成支付",
        "users": 890,
        "conversionRate": 72.1
      }
    ]
  }
}
```

### 6. 获取实时统计

**GET** `/analytics/realtime`

获取实时统计数据。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "realtime": {
      "activeUsers": 234,
      "pageViews": 1234,
      "orders": 12,
      "revenue": 1234.56,
      "timestamp": "2024-01-25T12:30:00Z"
    },
    "recentActivity": [
      {
        "type": "order",
        "message": "用户购买了《React教程》",
        "amount": 99.00,
        "timestamp": "2024-01-25T12:29:45Z"
      },
      {
        "type": "registration",
        "message": "新用户注册",
        "timestamp": "2024-01-25T12:28:30Z"
      }
    ],
    "topPages": [
      {
        "path": "/",
        "activeUsers": 89,
        "percentage": 38.0
      },
      {
        "path": "/resources",
        "activeUsers": 67,
        "percentage": 28.6
      }
    ],
    "trafficSources": [
      {
        "source": "direct",
        "name": "直接访问",
        "users": 123,
        "percentage": 52.6
      },
      {
        "source": "search",
        "name": "搜索引擎",
        "users": 78,
        "percentage": 33.3
      }
    ]
  }
}
```

### 7. 获取自定义报表

**POST** `/analytics/custom-report`

生成自定义统计报表。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "name": "月度销售报表",
  "metrics": [                    // 指标列表
    "revenue",
    "orders",
    "users"
  ],
  "dimensions": [                 // 维度列表
    "date",
    "category",
    "paymentMethod"
  ],
  "filters": {                    // 筛选条件
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    },
    "category": "前端开发",
    "userType": "vip"
  },
  "groupBy": "date",             // 分组字段
  "orderBy": "revenue",          // 排序字段
  "limit": 100                   // 结果数量限制
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "report": {
      "id": "report_123456",
      "name": "月度销售报表",
      "generatedAt": "2024-01-25T12:30:00Z",
      "data": [
        {
          "date": "2024-01-01",
          "category": "前端开发",
          "paymentMethod": "alipay",
          "revenue": 3456.78,
          "orders": 45,
          "users": 234
        }
      ],
      "summary": {
        "totalRevenue": 234567.89,
        "totalOrders": 3456,
        "totalUsers": 12345
      },
      "downloadUrl": "https://reports.example.com/report_123456.xlsx"
    }
  },
  "message": "报表生成成功"
}
```

### 8. 记录用户事件

**POST** `/analytics/events`

记录用户行为事件。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "events": [
    {
      "type": "page_view",
      "properties": {
        "page": "/resources/res_123456",
        "title": "React教程详情页",
        "referrer": "/resources",
        "userAgent": "Mozilla/5.0...",
        "timestamp": "2024-01-25T12:30:00Z"
      }
    },
    {
      "type": "resource_download",
      "properties": {
        "resourceId": "res_123456",
        "resourceTitle": "React教程",
        "downloadType": "direct",
        "timestamp": "2024-01-25T12:31:00Z"
      }
    }
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
    "failed": 0
  },
  "message": "事件记录成功"
}
```

## 事件类型

| 事件类型 | 说明 | 属性 |
|----------|------|------|
| page_view | 页面浏览 | page, title, referrer |
| resource_view | 资源查看 | resourceId, category, type |
| resource_download | 资源下载 | resourceId, downloadType |
| search | 搜索行为 | query, resultCount, filters |
| add_to_cart | 添加购物车 | resourceId, price |
| purchase | 购买行为 | orderId, amount, items |
| user_registration | 用户注册 | source, method |
| user_login | 用户登录 | method |

## 错误代码

| 错误代码 | 说明 |
|----------|------|
| INVALID_DATE_RANGE | 无效的日期范围 |
| METRIC_NOT_SUPPORTED | 不支持的指标 |
| DIMENSION_NOT_SUPPORTED | 不支持的维度 |
| REPORT_GENERATION_FAILED | 报表生成失败 |
| EVENT_VALIDATION_FAILED | 事件验证失败 |
| ANALYTICS_SERVICE_UNAVAILABLE | 分析服务不可用 |

## 数据模型

### AnalyticsOverview 对象

```typescript
interface AnalyticsOverview {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  totalResources: number;
  newResources: number;
  totalOrders: number;
  totalRevenue: number;
  totalDownloads: number;
}
```

### TrendData 对象

```typescript
interface TrendData {
  date: string;
  [key: string]: number | string;
}
```

### CustomReport 对象

```typescript
interface CustomReport {
  id: string;
  name: string;
  metrics: string[];
  dimensions: string[];
  filters: Record<string, any>;
  data: Record<string, any>[];
  summary: Record<string, number>;
  generatedAt: string;
  downloadUrl?: string;
}
```
