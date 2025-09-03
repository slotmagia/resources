# 用户认证 API

## 概述

用户认证模块提供用户注册、登录、登出、密码重置等功能。

## 接口列表

### 1. 用户注册

**POST** `/auth/register`

注册新用户账户。

#### 请求参数

```json
{
  "name": "string",        // 用户名，2-50字符
  "email": "string",       // 邮箱地址
  "password": "string",    // 密码，6-128字符
  "confirmPassword": "string", // 确认密码
  "agreeTerms": true       // 是否同意服务条款
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123456",
      "name": "张三",
      "email": "zhangsan@example.com",
      "avatar": null,
      "vipLevel": "none",
      "verified": false,
      "createdAt": "2024-01-25T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600
  },
  "message": "注册成功"
}
```

#### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "邮箱已被注册",
    "details": {
      "field": "email",
      "value": "zhangsan@example.com"
    }
  }
}
```

### 2. 用户登录

**POST** `/auth/login`

用户登录获取访问令牌。

#### 请求参数

```json
{
  "email": "string",       // 邮箱地址
  "password": "string",    // 密码
  "rememberMe": false      // 是否记住登录状态（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123456",
      "name": "张三",
      "email": "zhangsan@example.com",
      "avatar": "https://cdn.example.com/avatars/user_123456.jpg",
      "vipLevel": "basic",
      "vipExpiry": "2024-12-31T23:59:59Z",
      "verified": true,
      "createdAt": "2024-01-15T08:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600
  },
  "message": "登录成功"
}
```

### 3. 刷新令牌

**POST** `/auth/refresh`

使用刷新令牌获取新的访问令牌。

#### 请求参数

```json
{
  "refreshToken": "string"  // 刷新令牌
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "token": "new_access_token_here",
    "refreshToken": "new_refresh_token_here",
    "expiresIn": 3600
  }
}
```

### 4. 用户登出

**POST** `/auth/logout`

用户登出，使令牌失效。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "refreshToken": "string"  // 刷新令牌（可选）
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "登出成功"
}
```

### 5. 忘记密码

**POST** `/auth/forgot-password`

发送密码重置邮件。

#### 请求参数

```json
{
  "email": "string"  // 注册邮箱
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "密码重置邮件已发送，请查收邮箱"
}
```

### 6. 重置密码

**POST** `/auth/reset-password`

使用重置令牌重置密码。

#### 请求参数

```json
{
  "token": "string",       // 重置令牌（从邮件获取）
  "password": "string",    // 新密码
  "confirmPassword": "string"  // 确认新密码
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "密码重置成功，请使用新密码登录"
}
```

### 7. 修改密码

**PUT** `/auth/change-password`

修改当前用户密码。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 请求参数

```json
{
  "currentPassword": "string",  // 当前密码
  "newPassword": "string",      // 新密码
  "confirmPassword": "string"   // 确认新密码
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "密码修改成功"
}
```

### 8. 验证邮箱

**POST** `/auth/verify-email`

验证用户邮箱地址。

#### 请求参数

```json
{
  "token": "string"  // 验证令牌（从邮件获取）
}
```

#### 响应示例

```json
{
  "success": true,
  "message": "邮箱验证成功"
}
```

### 9. 重发验证邮件

**POST** `/auth/resend-verification`

重新发送邮箱验证邮件。

#### 请求头

```http
Authorization: Bearer <access_token>
```

#### 响应示例

```json
{
  "success": true,
  "message": "验证邮件已重新发送"
}
```

### 10. 第三方登录

**POST** `/auth/oauth/{provider}`

第三方平台登录（Google、GitHub等）。

#### 路径参数

- `provider`: 第三方平台标识（google、github、wechat等）

#### 请求参数

```json
{
  "code": "string",        // 授权码
  "state": "string",       // 状态参数（可选）
  "redirectUri": "string"  // 回调地址
}
```

#### 响应示例

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123456",
      "name": "张三",
      "email": "zhangsan@example.com",
      "avatar": "https://avatars.githubusercontent.com/u/123456",
      "vipLevel": "none",
      "verified": true,
      "createdAt": "2024-01-25T10:30:00Z",
      "oauthProviders": ["github"]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600,
    "isNewUser": false
  },
  "message": "登录成功"
}
```

## 错误代码

| 错误代码 | 说明 |
|----------|------|
| INVALID_CREDENTIALS | 邮箱或密码错误 |
| EMAIL_ALREADY_EXISTS | 邮箱已被注册 |
| INVALID_TOKEN | 令牌无效或已过期 |
| PASSWORD_TOO_WEAK | 密码强度不够 |
| EMAIL_NOT_VERIFIED | 邮箱未验证 |
| ACCOUNT_LOCKED | 账户被锁定 |
| TOO_MANY_ATTEMPTS | 尝试次数过多 |
| OAUTH_ERROR | 第三方登录错误 |

## 数据模型

### User 对象

```typescript
interface User {
  id: string;              // 用户ID
  name: string;            // 用户名
  email: string;           // 邮箱
  avatar?: string;         // 头像URL
  vipLevel: 'none' | 'basic' | 'premium';  // VIP等级
  vipExpiry?: string;      // VIP到期时间
  verified: boolean;       // 邮箱是否已验证
  createdAt: string;       // 创建时间
  updatedAt: string;       // 更新时间
  lastLoginAt?: string;    // 最后登录时间
  oauthProviders?: string[]; // 关联的第三方平台
}
```

## 安全说明

1. **密码要求**: 至少6位字符，建议包含大小写字母、数字和特殊字符
2. **令牌有效期**: 访问令牌1小时，刷新令牌30天
3. **登录限制**: 连续5次失败后锁定账户15分钟
4. **邮箱验证**: 新注册用户需要验证邮箱才能使用完整功能
5. **HTTPS**: 所有认证接口必须使用HTTPS协议
