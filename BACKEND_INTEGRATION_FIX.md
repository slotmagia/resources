# 后端集成修复说明

## 问题描述

用户报告登录失败，经分析发现后端返回的数据格式与前端期望的格式不匹配：

### 后端实际返回格式
```json
{
    "code": 0,
    "message": "操作成功",
    "data": {
        "user": { ... },
        "token": "...",
        "refresh_token": "...",
        "expires_in": 86400
    },
    "timestamp": 1756981712,
    "traceID": "..."
}
```

### 前端期望格式
```json
{
    "success": true,
    "data": { ... },
    "message": "...",
    "error": { ... }
}
```

## 解决方案

### 1. 更新API响应格式转换

在 `src/lib/api-client.ts` 中：

- 新增 `BackendResponse<T>` 接口定义后端实际响应格式
- 保持 `ApiResponse<T>` 接口作为前端统一格式
- 在 `request` 方法中添加格式转换逻辑：
  - `code === 0` 表示成功，转换为 `success: true`
  - `code !== 0` 表示业务错误，转换为 `success: false`
  - HTTP错误单独处理

### 2. 更新用户数据字段映射

后端返回的用户数据使用snake_case命名：
- `vip_level` → `vipLevel`
- `vip_expiry` → `vipExpiry`  
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`
- `last_login_at` → `lastLoginAt`

### 3. 创建数据标准化工具

新建 `src/lib/data-normalizer.ts`：
- `normalizeUser()` - 标准化用户数据
- `normalizeResource()` - 标准化资源数据
- `normalizePagination()` - 标准化分页数据
- `normalizeTimestamp()` - 标准化时间戳

### 4. 更新状态管理

在 `src/stores/authStore.ts` 中：
- 导入并使用 `normalizeUser()` 函数
- 在登录、注册、检查认证等方法中应用数据标准化

### 5. 创建测试页面

新建 `src/app/test-login/page.tsx` 用于测试登录功能：
- 显示当前认证状态
- 测试直接API调用
- 测试Store登录
- 显示详细的响应数据和错误信息

## 主要文件变更

### 新增文件
- `src/lib/data-normalizer.ts` - 数据标准化工具
- `src/app/test-login/page.tsx` - 登录测试页面
- `BACKEND_INTEGRATION_FIX.md` - 本说明文档

### 修改文件
- `src/lib/api-client.ts` - 添加响应格式转换
- `src/types/index.ts` - 更新User接口支持后端字段
- `src/stores/authStore.ts` - 使用数据标准化工具

## 测试方法

1. 访问 `/test-login` 页面
2. 点击"测试直接API调用"查看原始API响应
3. 点击"测试Store登录"测试完整登录流程
4. 检查用户数据是否正确显示

## 后端要求

确保后端登录接口 `/api/auth/login` 返回以下格式：

```json
{
    "code": 0,
    "message": "操作成功", 
    "data": {
        "user": {
            "id": "user_001",
            "name": "张三",
            "email": "zhangsan@example.com",
            "vip_level": "premium",
            "verified": true,
            "created_at": "2024-01-01 08:00:00",
            // ... 其他用户字段
        },
        "token": "JWT_TOKEN",
        "refresh_token": "REFRESH_TOKEN",
        "expires_in": 86400
    },
    "timestamp": 1756981712
}
```

## 兼容性说明

- 前端同时支持snake_case和camelCase字段名
- 旧的前端代码无需修改，会自动获得标准化后的数据
- 新的API客户端向后兼容，支持不同的后端响应格式

## 下一步

1. 测试所有API接口的响应格式
2. 根据实际后端响应调整其他数据模型
3. 完善错误处理和用户体验
4. 添加更多的数据标准化函数
