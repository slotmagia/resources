# SSL/HTTPS 证书配置指南

本指南提供了完整的 SSL/HTTPS 证书解决方案，包括免费 Let's Encrypt 证书的申请、配置和管理。

## 📋 文件说明

- `setup-ssl.sh` - SSL 证书自动配置脚本
- `cert-manager.sh` - 证书管理脚本
- `docker-compose.yml` - Docker Compose 配置
- `nginx/` - Nginx 配置文件目录

## 🚀 快速开始

### 前提条件

1. **域名准备**
   - 拥有一个域名（如 example.com）
   - 域名 A 记录已指向服务器 IP
   - 域名可以正常解析

2. **服务器要求**
   - Linux 系统（Ubuntu/Debian/CentOS）
   - Root 权限
   - 开放 80 和 443 端口

### 一键配置 SSL

```bash
# 给脚本添加执行权限
chmod +x setup-ssl.sh

# 配置 SSL 证书
sudo ./setup-ssl.sh -d yourdomain.com -e your@email.com

# 测试模式（推荐先测试）
sudo ./setup-ssl.sh -d yourdomain.com -e your@email.com --dry-run
```

## 🛠️ 详细配置步骤

### 1. 域名解析配置

确保域名正确解析到服务器：

```bash
# 检查域名解析
dig yourdomain.com
nslookup yourdomain.com

# 检查服务器 IP
curl ifconfig.me
```

### 2. 部署应用

```bash
# 先部署应用（确保在端口 80 运行）
./deploy.sh deploy

# 验证应用运行
curl http://localhost:80
```

### 3. 配置 SSL 证书

```bash
# 配置 SSL（替换为你的域名和邮箱）
sudo ./setup-ssl.sh -d yourdomain.com -e admin@yourdomain.com
```

脚本会自动：
- 安装 Nginx 和 Certbot
- 创建 Nginx 反向代理配置
- 申请 Let's Encrypt 证书
- 配置 HTTPS 重定向
- 设置自动续期

### 4. 验证配置

```bash
# 检查证书状态
sudo ./cert-manager.sh status yourdomain.com

# 测试 HTTPS 访问
curl -I https://yourdomain.com

# 检查 SSL 评级
# 访问: https://www.ssllabs.com/ssltest/
```

## 📊 证书管理

### 使用证书管理脚本

```bash
# 给脚本添加执行权限
chmod +x cert-manager.sh

# 查看所有证书
sudo ./cert-manager.sh list

# 检查证书状态
sudo ./cert-manager.sh status yourdomain.com

# 手动续期证书
sudo ./cert-manager.sh renew yourdomain.com

# 检查即将过期的证书
sudo ./cert-manager.sh check-expiry

# 测试续期
sudo ./cert-manager.sh test-renewal

# 备份证书
sudo ./cert-manager.sh backup

# 删除证书
sudo ./cert-manager.sh delete yourdomain.com
```

### 自动续期

证书会自动续期，但你可以手动检查：

```bash
# 查看续期任务
sudo crontab -l
sudo cat /etc/cron.d/certbot-renewal

# 测试自动续期
sudo certbot renew --dry-run

# 手动续期
sudo certbot renew
```

## 🔧 高级配置

### 多域名证书

```bash
# 为多个域名申请证书
sudo ./setup-ssl.sh -d "example.com,www.example.com,api.example.com" -e admin@example.com
```

### 通配符证书

```bash
# 申请通配符证书（需要 DNS 验证）
sudo certbot certonly \
  --manual \
  --preferred-challenges dns \
  --email admin@example.com \
  --agree-tos \
  -d "*.example.com" \
  -d "example.com"
```

### 自定义 Nginx 配置

编辑 `/etc/nginx/sites-available/yourdomain.com`：

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL 配置
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # 自定义配置
    client_max_body_size 100M;
    
    # 反向代理
    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

重载配置：
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 🐳 Docker Compose 部署

### 使用 Docker Compose

```bash
# 基础部署（仅应用）
docker-compose up -d

# 包含 Nginx 的部署
docker-compose --profile with-nginx up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 环境变量配置

创建 `.env` 文件：

```env
DOMAIN=yourdomain.com
EMAIL=admin@yourdomain.com
NODE_ENV=production
```

## 🔒 安全最佳实践

### 1. SSL 配置优化

```nginx
# 强制 HTTPS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# 防止点击劫持
add_header X-Frame-Options DENY always;

# 防止 MIME 类型嗅探
add_header X-Content-Type-Options nosniff always;

# XSS 保护
add_header X-XSS-Protection "1; mode=block" always;

# 推荐人策略
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### 2. 防火墙配置

```bash
# UFW 防火墙
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# 或者 firewalld
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 3. 定期安全检查

```bash
# SSL 实验室测试
# https://www.ssllabs.com/ssltest/

# 检查证书有效期
sudo ./cert-manager.sh check-expiry

# 更新系统
sudo apt update && sudo apt upgrade -y

# 检查 Nginx 安全配置
sudo nginx -T | grep -E "(ssl_|add_header)"
```

## 🚨 故障排除

### 常见问题

1. **域名解析问题**
   ```bash
   # 检查域名解析
   dig yourdomain.com
   
   # 检查服务器 IP
   curl ifconfig.me
   ```

2. **证书申请失败**
   ```bash
   # 检查 Nginx 配置
   sudo nginx -t
   
   # 检查端口占用
   sudo netstat -tlnp | grep :80
   
   # 查看详细错误
   sudo certbot --nginx -v
   ```

3. **证书过期**
   ```bash
   # 手动续期
   sudo certbot renew --force-renewal
   
   # 检查自动续期
   sudo certbot renew --dry-run
   ```

4. **Nginx 配置错误**
   ```bash
   # 测试配置
   sudo nginx -t
   
   # 查看错误日志
   sudo tail -f /var/log/nginx/error.log
   
   # 重载配置
   sudo systemctl reload nginx
   ```

### 日志查看

```bash
# Nginx 访问日志
sudo tail -f /var/log/nginx/access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# Certbot 日志
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# 系统日志
sudo journalctl -u nginx -f
```

## 📞 技术支持

### 有用的命令

```bash
# 检查证书详情
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/fullchain.pem -text -noout

# 检查证书链
openssl verify -CAfile /etc/letsencrypt/live/yourdomain.com/chain.pem /etc/letsencrypt/live/yourdomain.com/cert.pem

# 测试 SSL 连接
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# 检查证书过期时间
echo | openssl s_client -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

### 监控脚本

创建监控脚本 `/root/ssl-monitor.sh`：

```bash
#!/bin/bash
# SSL 证书监控脚本

DOMAIN="yourdomain.com"
EMAIL="admin@yourdomain.com"
DAYS_BEFORE_EXPIRY=7

# 检查证书过期时间
EXPIRY_DATE=$(echo | openssl s_client -connect $DOMAIN:443 -servername $DOMAIN 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)
EXPIRY_TIMESTAMP=$(date -d "$EXPIRY_DATE" +%s)
CURRENT_TIMESTAMP=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( (EXPIRY_TIMESTAMP - CURRENT_TIMESTAMP) / 86400 ))

if [[ $DAYS_UNTIL_EXPIRY -lt $DAYS_BEFORE_EXPIRY ]]; then
    echo "警告：SSL 证书将在 $DAYS_UNTIL_EXPIRY 天后过期！" | mail -s "SSL 证书过期警告" $EMAIL
fi
```

添加到 crontab：
```bash
# 每天检查一次
0 9 * * * /root/ssl-monitor.sh
```

---

**注意**: 
- Let's Encrypt 证书有效期为 90 天
- 建议在证书过期前 30 天续期
- 生产环境建议先在测试环境验证配置
