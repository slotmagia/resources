# 通知系统 API

## 概述

通知系统模块提供消息通知、推送设置、通知历史等功能。

## 接口列表

### 1. 获取通知列表

**GET** `/notifications`

获取用户的通知列表。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | integer | 1 | 页码 |
| limit | integer | 20 | 每页数量 |
| type | string | - | 通知类型筛选 |
| read | boolean | - | 是否已读筛选 |
| priority | string | - | 优先级筛选：low/medium/high |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_123456",
        "type": "order_completed",
        "title": "订单支付成功",
        "message": "您的订单 ORD20240125001 已支付成功，可以开始下载资源了。",
        "data": {
          "orderId": "order_123456",
          "orderNumber": "ORD20240125001",
          "amount": 99.00
        },
        "priority": "high",
        "read": false,
        "readAt": null,
        "createdAt": "2024-01-25T11:45:00Z",
        "expiresAt": "2024-02-25T11:45:00Z",
        "actions": [
          {
            "type": "link",
            "label": "查看订单",
            "url": "/orders/order_123456"
          },
          {
            "type": "link",
            "label": "开始下载",
            "url": "/downloads?order=order_123456"
          }
        ]
      },
      {
        "id": "notif_234567",
        "type": "resource_updated",
        "title": "收藏的资源有更新",
        "message": "您收藏的《React 完整教程视频》已更新到最新版本。",
        "data": {
          "resourceId": "res_123456",
          "resourceTitle": "React 完整教程视频",
          "updateType": "content"
        },
        "priority": "medium",
        "read": true,
        "readAt": "2024-01-25T12:00:00Z",
        "createdAt": "2024-01-25T10:30:00Z",
        "actions": [
          {
            "type": "link",
            "label": "查看更新",
            "url": "/resources/res_123456"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasMore": true
    },
    "summary": {
      "totalNotifications": 45,
      "unreadCount": 12,
      "highPriorityCount": 3
    }
  }
}
```

### 2. 标记通知为已读

**PUT** `/notifications/{notificationId}/read`

标记指定通知为已读。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `notificationId`: 通知ID

#### 响应示例

```json
{
  "success": true,
  "data": {
    "notificationId": "notif_123456",
    "read": true,
    "readAt": "2024-01-25T12:30:00Z"
  },
  "message": "通知已标记为已读"
}
```

### 3. 批量标记已读

**PUT** `/notifications/mark-read`

批量标记通知为已读。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "notificationIds": [           // 通知ID列表（可选，不提供则标记全部）
    "notif_123456",
    "notif_234567"
  ],
  "type": "order_completed"      // 按类型标记（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "markedCount": 12,
    "unreadCount": 3
  },
  "message": "已标记 12 条通知为已读"
}
```

### 4. 删除通知

**DELETE** `/notifications/{notificationId}`

删除指定通知。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `notificationId`: 通知ID

#### 响应示例

```json
{
  "success": true,
  "message": "通知已删除"
}
```

### 5. 获取通知设置

**GET** `/notifications/settings`

获取用户的通知设置。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "settings": {
      "email": {
        "enabled": true,
        "types": {
          "order_completed": true,
          "resource_updated": true,
          "comment_reply": false,
          "system_announcement": true,
          "promotion": false
        },
        "frequency": "immediate"  // immediate/daily/weekly
      },
      "push": {
        "enabled": true,
        "types": {
          "order_completed": true,
          "resource_updated": false,
          "comment_reply": true,
          "system_announcement": true,
          "promotion": false
        }
      },
      "sms": {
        "enabled": false,
        "types": {
          "order_completed": true,
          "security_alert": true
        }
      },
      "inApp": {
        "enabled": true,
        "types": {
          "order_completed": true,
          "resource_updated": true,
          "comment_reply": true,
          "system_announcement": true,
          "promotion": true
        }
      }
    }
  }
}
```

### 6. 更新通知设置

**PUT** `/notifications/settings`

更新用户的通知设置。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "email": {
    "enabled": true,
    "types": {
      "order_completed": true,
      "resource_updated": false,
      "promotion": false
    },
    "frequency": "daily"
  },
  "push": {
    "enabled": false
  }
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "通知设置已更新"
}
```

### 7. 获取未读通知数量

**GET** `/notifications/unread-count`

获取未读通知数量。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "unreadCount": 12,
    "byType": {
      "order_completed": 2,
      "resource_updated": 5,
      "comment_reply": 3,
      "system_announcement": 2
    },
    "byPriority": {
      "high": 3,
      "medium": 6,
      "low": 3
    }
  }
}
```

### 8. 发送测试通知

**POST** `/notifications/test`

发送测试通知（用于测试通知设置）。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "type": "email",              // 通知类型：email/push/sms
  "message": "这是一条测试通知"  // 测试消息（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "测试通知已发送"
}
```

### 9. 订阅推送通知

**POST** `/notifications/subscribe`

订阅浏览器推送通知。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "keys": {
      "p256dh": "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM=",
      "auth": "tBHItJI5svbpez7KI4CCXg=="
    }
  }
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "推送通知订阅成功"
}
```

### 10. 取消推送订阅

**DELETE** `/notifications/subscribe`

取消浏览器推送通知订阅。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 响应示例

```json
{
  "success": true,
  "message": "推送通知订阅已取消"
}
```

## 通知类型

| 类型 | 说明 | 优先级 |
|------|------|--------|
| order_completed | 订单完成 | high |
| order_failed | 订单失败 | high |
| resource_updated | 资源更新 | medium |
| comment_reply | 评论回复 | medium |
| system_announcement | 系统公告 | high |
| promotion | 促销活动 | low |
| security_alert | 安全提醒 | high |
| vip_expiry | VIP到期提醒 | medium |
| download_completed | 下载完成 | low |
| favorite_resource_discount | 收藏资源降价 | medium |

## 错误代码

| 错误代码 | 说明 |
|----------|------|
| NOTIFICATION_NOT_FOUND | 通知不存在 |
| NOTIFICATION_EXPIRED | 通知已过期 |
| INVALID_NOTIFICATION_TYPE | 无效的通知类型 |
| NOTIFICATION_SETTINGS_ERROR | 通知设置错误 |
| PUSH_SUBSCRIPTION_FAILED | 推送订阅失败 |
| EMAIL_SEND_FAILED | 邮件发送失败 |
| SMS_SEND_FAILED | 短信发送失败 |

## 数据模型

### Notification 对象

```typescript
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  readAt?: string;
  createdAt: string;
  expiresAt?: string;
  actions?: NotificationAction[];
}
```

### NotificationAction 对象

```typescript
interface NotificationAction {
  type: 'link' | 'button' | 'dismiss';
  label: string;
  url?: string;
  action?: string;
}
```

### NotificationSettings 对象

```typescript
interface NotificationSettings {
  email: {
    enabled: boolean;
    types: Record<string, boolean>;
    frequency: 'immediate' | 'daily' | 'weekly';
  };
  push: {
    enabled: boolean;
    types: Record<string, boolean>;
  };
  sms: {
    enabled: boolean;
    types: Record<string, boolean>;
  };
  inApp: {
    enabled: boolean;
    types: Record<string, boolean>;
  };
}
```
