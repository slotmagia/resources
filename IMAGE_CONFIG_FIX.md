# Next.js 图片域名配置修复

## 问题描述

用户访问个人资料页面时遇到以下错误：

```
Runtime Error

Invalid src prop (https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan) on `next/image`, hostname "api.dicebear.com" is not configured under images in your `next.config.js`
```

## 问题原因

Next.js 的 `Image` 组件出于安全考虑，默认只允许加载本域名下的图片。当使用外部图片URL时，需要在 `next.config.js` 中明确配置允许的域名。

## 解决方案

### 1. 更新 next.config.ts

**文件**: `next.config.ts`

**添加的域名配置**:
```typescript
{
  protocol: 'https',
  hostname: 'api.dicebear.com',
  port: '',
  pathname: '/**',
},
{
  protocol: 'https',
  hostname: 'cdn.example.com',
  port: '',
  pathname: '/**',
}
```

### 2. 完整的图片域名配置

现在支持的外部图片域名：
- `picsum.photos` - 测试图片服务
- `via.placeholder.com` - 占位图片服务
- `api.dicebear.com` - 头像生成服务 ✅ 新增
- `cdn.example.com` - 示例CDN域名 ✅ 新增

## 使用场景

### 1. 用户头像生成

在以下组件中使用了 dicebear.com 头像服务：

**Header组件** (`src/components/layout/Header.tsx`):
```typescript
<img
  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
  alt={user.name}
  className="h-8 w-8 rounded-full"
/>
```

**个人资料页面** (`src/app/profile/page.tsx`):
```typescript
<Image
  src={formData.avatar}
  alt="头像"
  width={128}
  height={128}
  className="w-full h-full object-cover"
/>
```

### 2. 头像生成逻辑

当用户没有自定义头像时，系统会自动生成一个基于用户名的头像：
```
https://api.dicebear.com/7.x/avataaars/svg?seed={用户名}
```

## 重启要求

⚠️ **重要**: 修改 `next.config.ts` 后需要重启开发服务器才能生效。

### 重启步骤

1. 停止当前开发服务器 (Ctrl+C)
2. 重新启动开发服务器:
   ```bash
   npm run dev
   ```

## 其他图片域名

如果后续需要支持其他图片域名，可以在 `next.config.ts` 中继续添加：

```typescript
{
  protocol: 'https',
  hostname: '新的域名.com',
  port: '',
  pathname: '/**',
}
```

## 安全考虑

### 1. 域名白名单

只添加信任的图片域名，避免潜在的安全风险：
- ✅ `api.dicebear.com` - 知名的开源头像生成服务
- ✅ `cdn.example.com` - 示例CDN，实际使用时替换为真实CDN

### 2. 路径限制

使用 `pathname: '/**'` 允许该域名下的所有路径，也可以限制特定路径：
```typescript
pathname: '/avatars/**'  // 只允许 /avatars/ 路径下的图片
```

## 替代方案

如果不想使用外部图片服务，可以考虑：

### 1. 本地头像生成

```typescript
// 使用本地头像生成库
import { generateAvatar } from '@/lib/avatar-generator';

const avatarUrl = generateAvatar(user.name);
```

### 2. 上传到自己的CDN

```typescript
// 用户上传头像后存储到自己的CDN
const avatarUrl = `https://your-cdn.com/avatars/${user.id}.jpg`;
```

### 3. 使用 Base64 图片

```typescript
// 生成 Base64 格式的头像
const avatarDataUrl = generateBase64Avatar(user.name);
```

## 测试验证

修复后可以验证：

1. **个人资料页面**: 访问 `/profile` 页面，检查头像是否正常显示
2. **Header组件**: 登录后检查Header中的用户头像
3. **移动端菜单**: 检查移动端折叠菜单中的用户头像

## 总结

通过在 `next.config.ts` 中添加 `api.dicebear.com` 域名配置，解决了Next.js Image组件无法加载外部头像的问题。记得重启开发服务器使配置生效。
