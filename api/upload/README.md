# 文件上传 API

## 概述

文件上传模块提供文件上传、进度跟踪、文件管理等功能。

## 接口列表

### 1. 获取上传配置

**GET** `/upload/config`

获取文件上传的配置信息。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "config": {
      "maxFileSize": 104857600,      // 最大文件大小（字节）
      "maxFiles": 10,                // 最大文件数量
      "allowedTypes": [              // 允许的文件类型
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "application/pdf",
        "application/zip"
      ],
      "allowedExtensions": [         // 允许的文件扩展名
        ".jpg", ".jpeg", ".png", ".gif",
        ".mp4", ".avi", ".mov",
        ".pdf", ".doc", ".docx",
        ".zip", ".rar"
      ],
      "chunkSize": 1048576,          // 分块大小（字节）
      "uploadUrl": "https://upload.example.com/v1/files",
      "cdnUrl": "https://cdn.example.com"
    }
  }
}
```

### 2. 初始化上传

**POST** `/upload/init`

初始化文件上传，获取上传令牌和分块信息。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "fileName": "react-tutorial.mp4",  // 文件名
  "fileSize": 3355443200,           // 文件大小（字节）
  "fileType": "video/mp4",          // 文件类型
  "fileMd5": "d41d8cd98f00b204e9800998ecf8427e",  // 文件MD5（可选）
  "purpose": "resource_content",     // 上传目的：avatar/resource_content/thumbnail/attachment
  "metadata": {                      // 元数据（可选）
    "title": "React教程视频",
    "description": "完整的React学习教程"
  }
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "upload": {
      "id": "upload_123456",
      "uploadToken": "ut_abc123def456",
      "fileName": "react-tutorial.mp4",
      "fileSize": 3355443200,
      "fileType": "video/mp4",
      "status": "initialized",
      "chunks": [
        {
          "index": 0,
          "start": 0,
          "end": 1048576,
          "size": 1048576,
          "uploadUrl": "https://upload.example.com/v1/chunks/upload_123456/0"
        },
        {
          "index": 1,
          "start": 1048576,
          "end": 2097152,
          "size": 1048576,
          "uploadUrl": "https://upload.example.com/v1/chunks/upload_123456/1"
        }
      ],
      "totalChunks": 3200,
      "expiresAt": "2024-01-25T23:30:00Z",
      "createdAt": "2024-01-25T11:30:00Z"
    }
  },
  "message": "上传初始化成功"
}
```

### 3. 上传文件分块

**POST** `/upload/chunk/{uploadId}/{chunkIndex}`

上传文件分块。

#### 请求头

```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

#### 路径参数

- `uploadId`: 上传任务ID
- `chunkIndex`: 分块索引

#### 请求参数

```
chunk: File          // 分块文件数据
chunkMd5: string     // 分块MD5校验值（可选）
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "uploadId": "upload_123456",
    "chunkIndex": 0,
    "chunkSize": 1048576,
    "uploaded": true,
    "progress": {
      "uploadedChunks": 1,
      "totalChunks": 3200,
      "uploadedSize": 1048576,
      "totalSize": 3355443200,
      "percentage": 0.03
    }
  }
}
```

### 4. 完成上传

**POST** `/upload/complete/{uploadId}`

完成文件上传，合并所有分块。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `uploadId`: 上传任务ID

#### 请求参数

```json
{
  "chunkMd5List": [              // 所有分块的MD5列表（可选，用于校验）
    "chunk0_md5_hash",
    "chunk1_md5_hash"
  ]
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "file": {
      "id": "file_789012",
      "uploadId": "upload_123456",
      "fileName": "react-tutorial.mp4",
      "originalName": "react-tutorial.mp4",
      "fileSize": 3355443200,
      "fileType": "video/mp4",
      "fileMd5": "d41d8cd98f00b204e9800998ecf8427e",
      "url": "https://cdn.example.com/files/file_789012.mp4",
      "thumbnailUrl": "https://cdn.example.com/thumbnails/file_789012.jpg",
      "status": "completed",
      "purpose": "resource_content",
      "metadata": {
        "title": "React教程视频",
        "description": "完整的React学习教程",
        "duration": 43200,
        "resolution": "1920x1080"
      },
      "createdAt": "2024-01-25T11:30:00Z",
      "completedAt": "2024-01-25T12:15:00Z"
    }
  },
  "message": "文件上传完成"
}
```

### 5. 获取上传进度

**GET** `/upload/progress/{uploadId}`

获取上传任务的进度信息。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `uploadId`: 上传任务ID

#### 响应示例

```json
{
  "success": true,
  "data": {
    "progress": {
      "uploadId": "upload_123456",
      "status": "uploading",
      "uploadedChunks": 1600,
      "totalChunks": 3200,
      "uploadedSize": 1677721600,
      "totalSize": 3355443200,
      "percentage": 50.0,
      "speed": 2097152,
      "remainingTime": 800,
      "startedAt": "2024-01-25T11:32:00Z",
      "lastChunkAt": "2024-01-25T12:00:00Z",
      "failedChunks": [],
      "retryCount": 0
    }
  }
}
```

### 6. 取消上传

**DELETE** `/upload/{uploadId}`

取消上传任务。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `uploadId`: 上传任务ID

#### 响应示例

```json
{
  "success": true,
  "message": "上传任务已取消"
}
```

### 7. 重试失败分块

**POST** `/upload/retry/{uploadId}`

重试上传失败的分块。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `uploadId`: 上传任务ID

#### 请求参数

```json
{
  "chunkIndexes": [1, 5, 10]  // 要重试的分块索引列表（可选，不提供则重试所有失败分块）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "retryChunks": [
      {
        "index": 1,
        "uploadUrl": "https://upload.example.com/v1/chunks/upload_123456/1"
      },
      {
        "index": 5,
        "uploadUrl": "https://upload.example.com/v1/chunks/upload_123456/5"
      }
    ],
    "retryCount": 1
  },
  "message": "重试分块已准备就绪"
}
```

### 8. 获取文件列表

**GET** `/upload/files`

获取用户上传的文件列表。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | integer | 1 | 页码 |
| limit | integer | 20 | 每页数量 |
| purpose | string | - | 用途筛选 |
| fileType | string | - | 文件类型筛选 |
| status | string | - | 状态筛选 |

#### 响应示例

```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": "file_789012",
        "fileName": "react-tutorial.mp4",
        "originalName": "react-tutorial.mp4",
        "fileSize": 3355443200,
        "fileType": "video/mp4",
        "url": "https://cdn.example.com/files/file_789012.mp4",
        "thumbnailUrl": "https://cdn.example.com/thumbnails/file_789012.jpg",
        "status": "completed",
        "purpose": "resource_content",
        "createdAt": "2024-01-25T11:30:00Z",
        "completedAt": "2024-01-25T12:15:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasMore": true
    },
    "statistics": {
      "totalFiles": 45,
      "totalSize": 52428800000,
      "completedFiles": 42,
      "failedFiles": 2,
      "processingFiles": 1
    }
  }
}
```

### 9. 删除文件

**DELETE** `/upload/files/{fileId}`

删除已上传的文件。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 路径参数

- `fileId`: 文件ID

#### 响应示例

```json
{
  "success": true,
  "message": "文件已删除"
}
```

### 10. 生成预签名URL

**POST** `/upload/presigned-url`

生成预签名上传URL（用于直接上传到云存储）。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "fileName": "avatar.jpg",
  "fileType": "image/jpeg",
  "fileSize": 1048576,
  "purpose": "avatar"
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://s3.amazonaws.com/bucket/path?AWSAccessKeyId=...",
    "fileUrl": "https://cdn.example.com/files/avatar_123456.jpg",
    "fields": {
      "key": "uploads/avatar_123456.jpg",
      "policy": "eyJleHBpcmF0aW9uIjoi...",
      "signature": "abc123def456"
    },
    "expiresAt": "2024-01-25T12:30:00Z"
  }
}
```

## 错误代码

| 错误代码 | 说明 |
|----------|------|
| UPLOAD_NOT_FOUND | 上传任务不存在 |
| UPLOAD_EXPIRED | 上传任务已过期 |
| FILE_TOO_LARGE | 文件过大 |
| FILE_TYPE_NOT_ALLOWED | 文件类型不允许 |
| CHUNK_OUT_OF_RANGE | 分块索引超出范围 |
| CHUNK_SIZE_MISMATCH | 分块大小不匹配 |
| MD5_VERIFICATION_FAILED | MD5校验失败 |
| UPLOAD_QUOTA_EXCEEDED | 上传配额超限 |
| STORAGE_SPACE_INSUFFICIENT | 存储空间不足 |
| UPLOAD_PROCESSING_FAILED | 上传处理失败 |

## 数据模型

### Upload 对象

```typescript
interface Upload {
  id: string;
  uploadToken: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileMd5?: string;
  status: 'initialized' | 'uploading' | 'completed' | 'failed' | 'cancelled';
  purpose: 'avatar' | 'resource_content' | 'thumbnail' | 'attachment';
  chunks: UploadChunk[];
  totalChunks: number;
  metadata?: Record<string, any>;
  expiresAt: string;
  createdAt: string;
  completedAt?: string;
}
```

### UploadChunk 对象

```typescript
interface UploadChunk {
  index: number;
  start: number;
  end: number;
  size: number;
  uploadUrl: string;
  status?: 'pending' | 'uploading' | 'completed' | 'failed';
  md5?: string;
}
```

### File 对象

```typescript
interface File {
  id: string;
  uploadId?: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  fileType: string;
  fileMd5: string;
  url: string;
  thumbnailUrl?: string;
  status: 'processing' | 'completed' | 'failed';
  purpose: string;
  metadata?: Record<string, any>;
  createdAt: string;
  completedAt?: string;
}
```
