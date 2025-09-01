# Docker 部署说明

本项目提供了完整的 Docker 部署解决方案，包括 Docker 安装、镜像构建和容器运行。

## 📋 文件说明

- `install-docker.sh` - Linux 系统 Docker 安装脚本
- `build-and-run.sh` - 完整的构建和运行脚本
- `deploy.sh` - 快速部署管理脚本
- `Dockerfile` - Docker 镜像构建文件
- `.dockerignore` - Docker 构建忽略文件

## 🚀 快速开始

### 1. 安装 Docker（如果未安装）

```bash
# 给脚本添加执行权限
chmod +x install-docker.sh

# 运行安装脚本
sudo ./install-docker.sh
```

### 2. 部署项目

```bash
# 给部署脚本添加执行权限
chmod +x deploy.sh

# 一键部署（推荐）
./deploy.sh deploy
```

## 🛠️ 详细使用说明

### 使用 deploy.sh 脚本（推荐）

```bash
# 查看帮助
./deploy.sh help

# 构建镜像
./deploy.sh build

# 运行容器
./deploy.sh run

# 完整部署（构建+运行）
./deploy.sh deploy

# 查看容器状态
./deploy.sh status

# 查看日志
./deploy.sh logs

# 重启容器
./deploy.sh restart

# 停止容器
./deploy.sh stop

# 进入容器
./deploy.sh shell

# 清理所有资源
./deploy.sh clean
```

### 使用 build-and-run.sh 脚本

```bash
# 给脚本添加执行权限
chmod +x build-and-run.sh

# 运行完整构建和部署流程
./build-and-run.sh
```

### 手动 Docker 命令

```bash
# 构建镜像
docker build \
  --build-arg NODE_IMAGE=dockerproxy.com/library/node:20-alpine \
  --build-arg RUNTIME_IMAGE=dockerproxy.com/library/node:20-alpine \
  -t ziyuanba:latest .

# 运行容器
docker run -d \
  --name ziyuanba-app \
  --restart unless-stopped \
  -p 80:80 \
  -e NODE_ENV=production \
  ziyuanba:latest

# 查看容器状态
docker ps

# 查看日志
docker logs ziyuanba-app

# 停止容器
docker stop ziyuanba-app

# 删除容器
docker rm ziyuanba-app

# 删除镜像
docker rmi ziyuanba:latest
```

## 🌐 访问地址

部署成功后，可以通过以下地址访问：

- **本地访问**: http://localhost:80
- **网络访问**: http://服务器IP:80

## ⚙️ 配置说明

### 端口配置

- 容器内部端口：80
- 主机端口：80
- 如需修改端口，编辑 `deploy.sh` 中的 `HOST_PORT` 变量

### 环境变量

- `NODE_ENV=production` - 生产环境
- `PORT=80` - 应用端口

### 镜像加速器

Docker 已配置以下镜像加速器：
- https://docker.m.daocloud.io
- https://dockerproxy.com
- https://hub-mirror.c.163.com

## 🔧 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查看端口占用
   netstat -tlnp | grep :80
   
   # 修改端口（编辑 deploy.sh 中的 HOST_PORT）
   ```

2. **容器启动失败**
   ```bash
   # 查看容器日志
   docker logs ziyuanba-app
   
   # 检查容器状态
   docker ps -a
   ```

3. **镜像构建失败**
   ```bash
   # 清理 Docker 缓存
   docker system prune -a
   
   # 重新构建
   ./deploy.sh build
   ```

### 日志查看

```bash
# 实时查看日志
docker logs -f ziyuanba-app

# 查看最近 100 行日志
docker logs --tail 100 ziyuanba-app

# 查看错误日志
docker logs ziyuanba-app 2>&1 | grep ERROR
```

## 📊 监控和维护

### 资源使用情况

```bash
# 查看容器资源使用
docker stats ziyuanba-app

# 查看镜像大小
docker images ziyuanba

# 查看磁盘使用
docker system df
```

### 定期维护

```bash
# 清理未使用的镜像和容器
docker system prune -a

# 更新镜像
docker pull ziyuanba:latest

# 重启服务
./deploy.sh restart
```

## 🔒 安全建议

1. **防火墙配置**
   ```bash
   # 只开放必要端口
   ufw allow 80/tcp
   ufw allow 22/tcp
   ufw enable
   ```

2. **定期更新**
   - 定期更新 Docker 版本
   - 定期更新基础镜像
   - 定期检查安全漏洞

3. **访问控制**
   - 限制 Docker 访问权限
   - 使用非 root 用户运行容器
   - 配置适当的资源限制

## 📞 技术支持

如果遇到问题，请：

1. 查看容器日志：`./deploy.sh logs`
2. 检查容器状态：`./deploy.sh status`
3. 查看系统资源使用情况
4. 检查网络连接和防火墙设置

---

**注意**: 首次部署可能需要较长时间下载基础镜像，请耐心等待。
