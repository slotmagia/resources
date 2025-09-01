# 完整部署指南

本指南提供了项目的完整部署解决方案，包括编译构建、Docker 容器化、Nginx 反向代理和 SSL 证书配置。

## 🎯 部署方案

### 方案一：一键部署脚本（推荐）

使用 `one-click-deploy.sh` 脚本完成所有部署步骤：

```bash
# 给脚本添加执行权限
chmod +x one-click-deploy.sh

# 完整部署（包含 SSL）
sudo ./one-click-deploy.sh -d yourdomain.com -e admin@yourdomain.com

# 仅 HTTP 部署（跳过 SSL）
sudo ./one-click-deploy.sh -d yourdomain.com --skip-ssl

# 测试模式
sudo ./one-click-deploy.sh -d yourdomain.com -e admin@yourdomain.com --dry-run
```

### 方案二：Docker Compose 部署

```bash
# 设置环境变量
export DOMAIN=yourdomain.com
export EMAIL=admin@yourdomain.com

# 基础部署
docker-compose up -d

# 申请 SSL 证书
docker-compose --profile ssl-setup run --rm certbot

# 续期证书
docker-compose --profile ssl-renew run --rm certbot-renew
```

### 方案三：分步手动部署

```bash
# 1. 安装 Docker
sudo ./install-docker.sh

# 2. 构建和运行应用
./deploy.sh deploy

# 3. 配置 SSL 证书
sudo ./setup-ssl.sh -d yourdomain.com -e admin@yourdomain.com
```

## 🏗️ 架构说明

### 服务架构

```
Internet
    ↓
Nginx (Port 80/443)
    ↓
Next.js App (Port 3000)
```

### 容器组成

- **ziyuanba-app**: Next.js 应用容器
- **ziyuanba-nginx**: Nginx 反向代理容器
- **ziyuanba-certbot**: SSL 证书管理容器

### 网络配置

- **外部访问**: 80 (HTTP) / 443 (HTTPS)
- **内部通信**: Docker 网络 `ziyuanba-network`
- **应用端口**: 3000 (容器内部)

## 📋 部署流程详解

### 1. 环境检查
- 检查 Docker 安装和运行状态
- 验证域名解析
- 检查端口占用情况
- 确认系统权限

### 2. 项目编译和镜像构建
- 调用 `deploy.sh build` 进行统一构建
- 多阶段构建优化镜像大小
- 包含健康检查配置
- 使用 Alpine Linux 基础镜像

### 3. 容器网络创建
- 创建独立的 Docker 网络
- 确保容器间通信安全

### 4. 应用容器部署
- 启动 Next.js 应用容器
- 配置环境变量
- 设置重启策略

### 5. Nginx 容器部署
- 启动 Nginx 反向代理
- 配置负载均衡
- 设置静态文件缓存

### 6. SSL 证书配置
- 使用 Let's Encrypt 免费证书
- 配置自动续期
- 强制 HTTPS 重定向

### 7. 服务验证
- 健康检查
- 性能测试
- 安全验证

## 🛠️ 配置文件说明

### one-click-deploy.sh
完整的一键部署脚本，支持：
- 环境检查和验证
- 自动化构建和部署
- SSL 证书配置
- 服务健康检查

### docker-compose.yml
Docker Compose 配置文件，包含：
- 应用服务定义
- Nginx 反向代理
- SSL 证书管理
- 健康检查配置

### Dockerfile
应用容器构建文件，特性：
- 多阶段构建
- 健康检查
- 安全优化
- 最小化镜像

### nginx/
Nginx 配置目录：
- `nginx.conf`: 主配置文件
- `conf.d/`: 站点配置目录

## 🔧 高级配置

### 环境变量

```bash
# 应用配置
NODE_ENV=production
PORT=3000

# 域名配置
DOMAIN=yourdomain.com
EMAIL=admin@yourdomain.com

# SSL 配置
SSL_ENABLED=true
AUTO_RENEW=true
```

### Nginx 优化

```nginx
# 性能优化
worker_processes auto;
worker_connections 1024;

# 缓存配置
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=app_cache:10m max_size=1g inactive=60m;

# 压缩配置
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json application/javascript;
```

### SSL 安全配置

```nginx
# 现代 SSL 配置
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;

# 安全头
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;
```

## 📊 监控和维护

### 健康检查

```bash
# 检查容器状态
docker ps

# 检查健康状态
docker inspect --format='{{.State.Health.Status}}' ziyuanba-app

# 查看健康检查日志
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' ziyuanba-app
```

### 日志管理

```bash
# 查看应用日志
docker logs -f ziyuanba-app

# 查看 Nginx 日志
docker logs -f ziyuanba-nginx

# 查看最近 100 行日志
docker logs --tail 100 ziyuanba-app
```

### 性能监控

```bash
# 资源使用情况
docker stats

# 容器详细信息
docker inspect ziyuanba-app

# 网络连接
docker network inspect ziyuanba-network
```

### 证书管理

```bash
# 查看证书状态
sudo ./cert-manager.sh status yourdomain.com

# 手动续期
sudo ./cert-manager.sh renew

# 检查即将过期的证书
sudo ./cert-manager.sh check-expiry

# 备份证书
sudo ./cert-manager.sh backup
```

## 🚨 故障排除

### 常见问题

1. **容器启动失败**
   ```bash
   # 查看容器日志
   docker logs ziyuanba-app
   
   # 检查容器状态
   docker ps -a
   
   # 重启容器
   docker restart ziyuanba-app
   ```

2. **SSL 证书问题**
   ```bash
   # 检查证书文件
   ls -la certbot/conf/live/yourdomain.com/
   
   # 测试证书申请
   docker run --rm -v "$(pwd)/certbot/conf:/etc/letsencrypt" -v "$(pwd)/certbot/www:/var/www/certbot" certbot/certbot certificates
   
   # 强制续期
   docker run --rm -v "$(pwd)/certbot/conf:/etc/letsencrypt" -v "$(pwd)/certbot/www:/var/www/certbot" certbot/certbot renew --force-renewal
   ```

3. **网络连接问题**
   ```bash
   # 检查端口占用
   netstat -tlnp | grep :80
   netstat -tlnp | grep :443
   
   # 检查防火墙
   ufw status
   
   # 测试内部连接
   docker exec ziyuanba-nginx curl http://ziyuanba-app:3000
   ```

4. **性能问题**
   ```bash
   # 检查资源使用
   docker stats
   
   # 检查磁盘空间
   df -h
   
   # 清理 Docker 资源
   docker system prune -a
   ```

### 调试命令

```bash
# 进入应用容器
docker exec -it ziyuanba-app sh

# 进入 Nginx 容器
docker exec -it ziyuanba-nginx sh

# 测试 Nginx 配置
docker exec ziyuanba-nginx nginx -t

# 重载 Nginx 配置
docker exec ziyuanba-nginx nginx -s reload

# 查看容器网络
docker network ls
docker network inspect ziyuanba-network
```

## 🔄 更新和回滚

### 应用更新

```bash
# 重新部署
sudo ./one-click-deploy.sh -d yourdomain.com -e admin@yourdomain.com --force-rebuild

# 或者使用 Docker Compose
docker-compose build --no-cache
docker-compose up -d
```

### 回滚操作

```bash
# 停止当前服务
docker stop ziyuanba-app ziyuanba-nginx

# 使用备份镜像
docker tag ziyuanba:backup ziyuanba:latest

# 重新启动
docker start ziyuanba-app ziyuanba-nginx
```

### 数据备份

```bash
# 备份证书
sudo ./cert-manager.sh backup

# 备份配置文件
tar -czf config-backup-$(date +%Y%m%d).tar.gz nginx/ certbot/

# 备份 Docker 镜像
docker save ziyuanba:latest | gzip > ziyuanba-image-backup.tar.gz
```

## 📞 技术支持

### 有用的资源

- [Docker 官方文档](https://docs.docker.com/)
- [Nginx 配置指南](https://nginx.org/en/docs/)
- [Let's Encrypt 文档](https://letsencrypt.org/docs/)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)

### 联系支持

如果遇到问题，请提供以下信息：
1. 错误日志：`docker logs ziyuanba-app`
2. 容器状态：`docker ps -a`
3. 系统信息：`uname -a`
4. Docker 版本：`docker --version`

---

**注意**: 
- 生产环境部署前请先在测试环境验证
- 定期备份重要数据和配置
- 监控证书过期时间
- 保持系统和 Docker 版本更新
