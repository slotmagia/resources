# 下载管理 API

## 概述

下载管理模块提供文件下载、下载历史、下载统计、断点续传等功能。

## 接口列表

### 1. 创建下载任务

**POST** `/downloads`

创建新的下载任务。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "resourceId": "res_123456",    // 资源ID
  "quality": "high"             // 下载质量：low/medium/high（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "download": {
      "id": "dl_789012",
      "resourceId": "res_123456",
      "resourceTitle": "React 完整教程视频",
      "fileName": "React完整教程视频.zip",
      "fileSize": 3355443200,
      "downloadUrl": "https://secure-download.example.com/dl_789012?token=abc123",
      "status": "pending",
      "quality": "high",
      "expiresAt": "2024-01-25T23:30:00Z",
      "createdAt": "2024-01-25T11:30:00Z",
      "downloadCount": 1,
      "remainingDownloads": 9
    }
  },
  "message": "下载任务创建成功"
}
```

### 2. 获取下载列表

**GET** `/downloads`

获取用户的下载历史列表。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | integer | 1 | 页码 |
| limit | integer | 20 | 每页数量 |
| status | string | all | 状态筛选：all/pending/downloading/completed/failed/cancelled |
| resourceType | string | - | 资源类型筛选 |
| startDate | string | - | 开始日期（YYYY-MM-DD） |
| endDate | string | - | 结束日期（YYYY-MM-DD） |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "dl_789012",
        "resourceId": "res_123456",
        "resourceTitle": "React 完整教程视频",
        "resourceType": "video",
        "resourceThumbnail": "https://cdn.example.com/thumbnails/res_123456.jpg",
        "fileName": "React完整教程视频.zip",
        "fileSize": 3355443200,
        "downloaded": 3355443200,
        "status": "completed",
        "progress": 100,
        "speed": 0,
        "remainingTime": 0,
        "downloadUrl": "https://secure-download.example.com/dl_789012?token=abc123",
        "expiresAt": "2024-01-25T23:30:00Z",
        "createdAt": "2024-01-25T11:30:00Z",
        "startedAt": "2024-01-25T11:32:00Z",
        "completedAt": "2024-01-25T11:45:00Z",
        "downloadCount": 1,
        "remainingDownloads": 9
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8,
      "hasMore": true
    },
    "statistics": {
      "totalDownloads": 156,
      "totalSize": 52428800000,
      "completedDownloads": 145,
      "failedDownloads": 3,
      "activeDownloads": 2
    }
  }
}
```

### 3. 获取下载详情

**GET** `/downloads/{downloadId}`

获取指定下载任务的详细信息。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `downloadId`: 下载任务ID

#### 响应示例

```json
{
  "success": true,
  "data": {
    "download": {
      "id": "dl_789012",
      "resourceId": "res_123456",
      "resourceTitle": "React 完整教程视频",
      "resourceType": "video",
      "fileName": "React完整教程视频.zip",
      "fileSize": 3355443200,
      "downloaded": 1677721600,
      "status": "downloading",
      "progress": 50.0,
      "speed": 2097152,
      "remainingTime": 800,
      "quality": "high",
      "downloadUrl": "https://secure-download.example.com/dl_789012?token=abc123",
      "expiresAt": "2024-01-25T23:30:00Z",
      "createdAt": "2024-01-25T11:30:00Z",
      "startedAt": "2024-01-25T11:32:00Z",
      "downloadCount": 1,
      "remainingDownloads": 9,
      "chunks": [
        {
          "index": 0,
          "start": 0,
          "end": 1048576,
          "status": "completed"
        },
        {
          "index": 1,
          "start": 1048576,
          "end": 2097152,
          "status": "downloading"
        }
      ],
      "error": null
    }
  }
}
```

### 4. 开始下载

**POST** `/downloads/{downloadId}/start`

开始或恢复下载任务。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `downloadId`: 下载任务ID

#### 请求参数

```json
{
  "resumeFrom": 1677721600  // 断点续传位置（可选，字节数）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "download": {
      "id": "dl_789012",
      "status": "downloading",
      "startedAt": "2024-01-25T12:00:00Z",
      "resumeFrom": 1677721600
    }
  },
  "message": "下载已开始"
}
```

### 5. 暂停下载

**POST** `/downloads/{downloadId}/pause`

暂停下载任务。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `downloadId`: 下载任务ID

#### 响应示例

```json
{
  "success": true,
  "data": {
    "download": {
      "id": "dl_789012",
      "status": "paused",
      "pausedAt": "2024-01-25T12:15:00Z",
      "downloaded": 2097152000
    }
  },
  "message": "下载已暂停"
}
```

### 6. 取消下载

**POST** `/downloads/{downloadId}/cancel`

取消下载任务。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `downloadId`: 下载任务ID

#### 响应示例

```json
{
  "success": true,
  "message": "下载已取消"
}
```

### 7. 重新下载

**POST** `/downloads/{downloadId}/retry`

重新开始失败的下载任务。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `downloadId`: 下载任务ID

#### 响应示例

```json
{
  "success": true,
  "data": {
    "download": {
      "id": "dl_789012",
      "status": "pending",
      "error": null,
      "retryCount": 1,
      "createdAt": "2024-01-25T12:30:00Z"
    }
  },
  "message": "下载任务已重新创建"
}
```

### 8. 获取下载进度

**GET** `/downloads/{downloadId}/progress`

获取下载任务的实时进度。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `downloadId`: 下载任务ID

#### 响应示例

```json
{
  "success": true,
  "data": {
    "progress": {
      "downloadId": "dl_789012",
      "status": "downloading",
      "progress": 65.5,
      "downloaded": 2199023255552,
      "fileSize": 3355443200,
      "speed": 2097152,
      "remainingTime": 550,
      "eta": "2024-01-25T12:25:00Z",
      "updatedAt": "2024-01-25T12:15:30Z"
    }
  }
}
```

### 9. 批量下载

**POST** `/downloads/batch`

创建批量下载任务。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "resourceIds": [           // 资源ID列表
    "res_123456",
    "res_234567",
    "res_345678"
  ],
  "quality": "high",         // 统一下载质量（可选）
  "createArchive": true      // 是否创建压缩包（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "batchId": "batch_456789",
    "downloads": [
      {
        "resourceId": "res_123456",
        "downloadId": "dl_789012",
        "status": "created"
      },
      {
        "resourceId": "res_234567",
        "downloadId": "dl_890123",
        "status": "created"
      },
      {
        "resourceId": "res_345678",
        "downloadId": null,
        "status": "failed",
        "error": "资源不存在"
      }
    ],
    "summary": {
      "total": 3,
      "successful": 2,
      "failed": 1,
      "totalSize": 6710886400
    }
  },
  "message": "批量下载任务创建完成"
}
```

### 10. 获取下载统计

**GET** `/downloads/stats`

获取用户的下载统计信息。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| period | string | month | 统计周期：day/week/month/year |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalDownloads": 156,
      "totalSize": 52428800000,
      "completedDownloads": 145,
      "failedDownloads": 3,
      "averageSpeed": 2097152,
      "totalTime": 125400
    },
    "recentActivity": [
      {
        "date": "2024-01-25",
        "downloads": 5,
        "size": 16777216000
      },
      {
        "date": "2024-01-24",
        "downloads": 3,
        "size": 10737418240
      }
    ],
    "typeBreakdown": [
      {
        "type": "video",
        "name": "视频教程",
        "count": 89,
        "size": 41943040000,
        "percentage": 80.0
      },
      {
        "type": "software",
        "name": "软件工具",
        "count": 23,
        "size": 7340032000,
        "percentage": 14.0
      }
    ],
    "categoryBreakdown": [
      {
        "category": "前端开发",
        "count": 67,
        "size": 29360128000
      }
    ],
    "speedHistory": [
      {
        "timestamp": "2024-01-25T12:00:00Z",
        "speed": 2097152
      }
    ]
  }
}
```

### 11. 清理下载历史

**DELETE** `/downloads/cleanup`

清理过期或已完成的下载记录。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "olderThan": 30,          // 清理多少天前的记录
  "status": ["completed", "failed", "cancelled"]  // 要清理的状态
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "cleanedCount": 45,
    "freedSpace": 15728640000
  },
  "message": "下载历史清理完成"
}
```

## 错误代码

| 错误代码 | 说明 |
|----------|------|
| DOWNLOAD_NOT_FOUND | 下载任务不存在 |
| DOWNLOAD_EXPIRED | 下载链接已过期 |
| DOWNLOAD_LIMIT_EXCEEDED | 下载次数超限 |
| RESOURCE_NOT_PURCHASED | 资源未购买 |
| FILE_NOT_AVAILABLE | 文件不可用 |
| DOWNLOAD_IN_PROGRESS | 下载正在进行中 |
| DOWNLOAD_ALREADY_COMPLETED | 下载已完成 |
| INSUFFICIENT_STORAGE | 存储空间不足 |
| NETWORK_ERROR | 网络错误 |
| SERVER_ERROR | 服务器错误 |

## 数据模型

### Download 对象

```typescript
interface Download {
  id: string;
  resourceId: string;
  resourceTitle: string;
  resourceType: string;
  resourceThumbnail?: string;
  fileName: string;
  fileSize: number;
  downloaded: number;
  status: 'pending' | 'downloading' | 'paused' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  speed?: number;
  remainingTime?: number;
  quality: 'low' | 'medium' | 'high';
  downloadUrl: string;
  expiresAt: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  pausedAt?: string;
  downloadCount: number;
  remainingDownloads: number;
  error?: string;
  retryCount?: number;
}
```

### DownloadChunk 对象

```typescript
interface DownloadChunk {
  index: number;
  start: number;
  end: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
}
```

### DownloadStats 对象

```typescript
interface DownloadStats {
  totalDownloads: number;
  totalSize: number;
  completedDownloads: number;
  failedDownloads: number;
  averageSpeed: number;
  totalTime: number;
}
```
