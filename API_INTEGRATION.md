# API 集成说明

## 概述

前端已成功对接Golang后端API服务。后端服务地址：`http://localhost:8000`，API前缀：`/api`。

## 主要变更

### 1. 删除的文件
- `src/lib/database.ts` - MySQL数据库连接（改为对接后端API）
- `src/app/api/` 目录下的所有Next.js API路由

### 2. 新增的文件
- `src/lib/api-client.ts` - API客户端，封装所有后端接口调用
- `src/lib/test-api.ts` - API测试工具
- `API_INTEGRATION.md` - 本说明文件

### 3. 更新的文件
- `src/types/index.ts` - 根据API文档更新类型定义
- `src/stores/authStore.ts` - 使用真实API进行认证
- `src/stores/resourceStore.ts` - 使用真实API获取资源数据
- `src/stores/cartStore.ts` - 使用真实API管理购物车
- `package.json` - 移除mysql2依赖

## API客户端功能

### 认证模块 (`apiClient.auth`)
- `login(credentials)` - 用户登录
- `register(data)` - 用户注册
- `logout()` - 用户登出
- `refresh(refreshToken)` - 刷新令牌
- `changePassword(data)` - 修改密码
- `forgotPassword(email)` - 忘记密码
- `resetPassword(data)` - 重置密码

### 资源模块 (`apiClient.resources`)
- `getList(params)` - 获取资源列表
- `getDetail(resourceId)` - 获取资源详情
- `search(params)` - 搜索资源
- `getTrending(params)` - 获取热门资源
- `getRecommendations(params)` - 获取推荐资源
- `getComments(resourceId, params)` - 获取资源评论
- `addComment(resourceId, data)` - 添加评论
- `toggleFavorite(resourceId, action)` - 收藏/取消收藏
- `getDownloadUrl(resourceId)` - 获取下载链接
- `report(resourceId, data)` - 举报资源

### 分类模块 (`apiClient.categories`)
- `getList()` - 获取分类列表
- `getDetail(categoryId)` - 获取分类详情
- `getResources(categoryId, params)` - 获取分类下的资源

### 购物车模块 (`apiClient.cart`)
- `get()` - 获取购物车
- `addItem(data)` - 添加商品
- `updateItem(itemId, data)` - 更新商品
- `removeItem(itemId)` - 删除商品
- `clear()` - 清空购物车

### 订单模块 (`apiClient.orders`)
- `getList(params)` - 获取订单列表
- `getDetail(orderId)` - 获取订单详情
- `create(data)` - 创建订单
- `pay(orderId, data)` - 支付订单
- `cancel(orderId, reason)` - 取消订单

### 收藏模块 (`apiClient.favorites`)
- `getList(params)` - 获取收藏列表
- `getFolders()` - 获取收藏夹列表
- `createFolder(data)` - 创建收藏夹
- `remove(favoriteId)` - 删除收藏

### 用户模块 (`apiClient.users`)
- `getProfile()` - 获取用户信息
- `updateProfile(data)` - 更新用户信息
- `uploadAvatar(file)` - 上传头像
- `getStats()` - 获取用户统计

### 通知模块 (`apiClient.notifications`)
- `getList(params)` - 获取通知列表
- `markAsRead(notificationId)` - 标记已读
- `markAllAsRead()` - 标记所有已读
- `getUnreadCount()` - 获取未读数量

### 下载模块 (`apiClient.downloads`)
- `getHistory(params)` - 获取下载历史
- `create(data)` - 创建下载任务
- `getStatus(downloadId)` - 获取下载状态

## 环境配置

创建 `.env.local` 文件：

```bash
# API配置
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# 其他配置
NEXT_PUBLIC_APP_NAME=资源吧
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 使用方法

### 1. 启动后端服务
确保Golang后端服务运行在 `http://localhost:8000`

### 2. 启动前端服务
```bash
npm install
npm run dev
```

### 3. 测试API连接
在浏览器控制台中运行：
```javascript
// 测试API连接
await window.testApi.connection();

// 测试认证流程
await window.testApi.auth();
```

## 状态管理更新

### AuthStore
- 支持token持久化存储
- 自动token刷新
- 用户信息同步

### ResourceStore
- 支持分页加载
- 搜索功能
- 分类筛选
- 热门推荐

### CartStore
- 服务器同步
- 离线支持
- 错误回退

## 错误处理

API客户端包含完整的错误处理：
- 网络错误
- 认证错误
- 业务逻辑错误
- 超时处理

## 类型安全

所有API接口都有完整的TypeScript类型定义，确保类型安全。

## 下一步

1. 启动Golang后端服务
2. 测试各个API接口
3. 根据实际后端响应调整类型定义
4. 完善错误处理和用户体验
