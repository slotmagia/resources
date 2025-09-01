#!/bin/bash

# 一键部署脚本
# 集成：编译构建 -> Docker 镜像 -> 容器运行 -> SSL 证书配置

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_step() { echo -e "${PURPLE}[STEP]${NC} $1"; }
log_deploy() { echo -e "${CYAN}[DEPLOY]${NC} $1"; }

# 配置变量
PROJECT_NAME="ziyuanba"
APP_CONTAINER="${PROJECT_NAME}-app"
NGINX_CONTAINER="${PROJECT_NAME}-nginx"
NETWORK_NAME="${PROJECT_NAME}-network"
APP_PORT=3000
NGINX_HTTP_PORT=80
NGINX_HTTPS_PORT=443

# 用户输入变量
DOMAIN=""
EMAIL=""
SKIP_SSL=false
FORCE_REBUILD=false
DRY_RUN=false

# 显示帮助信息
show_help() {
    echo "一键部署脚本 - 完整的 Docker + SSL 部署解决方案"
    echo
    echo "用法: $0 [选项]"
    echo
    echo "必需参数:"
    echo "  -d, --domain <域名>     域名 (例如: example.com)"
    echo "  -e, --email <邮箱>      邮箱地址 (用于 SSL 证书)"
    echo
    echo "可选参数:"
    echo "  -h, --help              显示此帮助信息"
    echo "  --skip-ssl              跳过 SSL 证书配置"
    echo "  --force-rebuild         强制重新构建镜像"
    echo "  --dry-run               测试模式，不实际部署"
    echo
    echo "示例:"
    echo "  $0 -d example.com -e admin@example.com"
    echo "  $0 -d test.com -e admin@test.com --skip-ssl"
    echo "  $0 -d example.com -e admin@example.com --dry-run"
    echo
    echo "部署流程:"
    echo "  1. 环境检查"
    echo "  2. 项目编译和镜像构建"
    echo "  3. 容器网络创建"
    echo "  4. 应用容器部署"
    echo "  5. Nginx 容器部署"
    echo "  6. SSL 证书配置"
    echo "  7. 服务验证"
}

# 解析命令行参数
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -d|--domain)
                DOMAIN="$2"
                shift 2
                ;;
            -e|--email)
                EMAIL="$2"
                shift 2
                ;;
            --skip-ssl)
                SKIP_SSL=true
                shift
                ;;
            --force-rebuild)
                FORCE_REBUILD=true
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                log_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done

    # 验证必需参数
    if [[ -z "$DOMAIN" ]]; then
        log_error "域名是必需参数"
        show_help
        exit 1
    fi

    if [[ "$SKIP_SSL" == "false" && -z "$EMAIL" ]]; then
        log_error "配置 SSL 时邮箱是必需参数"
        show_help
        exit 1
    fi
}

# 检查 root 权限
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "此脚本需要 root 权限运行"
        log_info "请使用: sudo $0"
        exit 1
    fi
}

# 环境检查
check_environment() {
    log_step "1/8 环境检查"
    
    # 检查 Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装"
        log_info "请先运行 install-docker.sh 安装 Docker"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker 服务未运行"
        log_info "请启动 Docker 服务: systemctl start docker"
        exit 1
    fi
    
    log_success "Docker 环境正常"
    
    # 检查 Node.js (用于本地构建)
    if ! command -v node &> /dev/null; then
        log_warning "Node.js 未安装，将使用 Docker 构建"
    else
        local node_version=$(node --version)
        log_info "Node.js 版本: $node_version"
    fi
    
    # 检查端口占用
    if netstat -tlnp 2>/dev/null | grep -q ":${NGINX_HTTP_PORT} "; then
        log_warning "端口 ${NGINX_HTTP_PORT} 已被占用"
        read -p "是否继续？(y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # 检查域名解析
    if [[ "$SKIP_SSL" == "false" ]]; then
        log_info "检查域名解析..."
        local server_ip=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || echo "unknown")
        local domain_ip=$(dig +short $DOMAIN | tail -n1)
        
        if [[ "$domain_ip" != "$server_ip" ]]; then
            log_warning "域名解析可能不正确:"
            log_warning "域名 $DOMAIN 解析到: $domain_ip"
            log_warning "服务器 IP: $server_ip"
            
            read -p "是否继续？(y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        else
            log_success "域名解析正确"
        fi
    fi
}

# 项目编译和镜像构建
build_project() {
    log_step "2/7 项目编译和镜像构建"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "测试模式：跳过项目构建"
        return
    fi
    
    # 检查 deploy.sh 脚本是否存在
    if [[ ! -f "deploy.sh" ]]; then
        log_error "deploy.sh 脚本不存在，请确保在项目根目录运行此脚本"
        exit 1
    fi
    
    # 检查项目文件
    if [[ ! -f "package.json" ]]; then
        log_error "package.json 不存在，请在项目根目录运行此脚本"
        exit 1
    fi
    
    log_info "使用 deploy.sh 构建项目和 Docker 镜像..."
    
    # 检查是否需要强制重建
    if [[ "$FORCE_REBUILD" == "true" ]]; then
        log_info "强制重新构建镜像..."
        docker rmi ${PROJECT_NAME}:latest 2>/dev/null || true
    fi
    
    # 使用 deploy.sh 的 build 命令构建镜像
    chmod +x deploy.sh
    ./deploy.sh build
    
    if [[ $? -eq 0 ]]; then
        log_success "项目构建完成"
        
        # 显示镜像信息
        if docker images --format "table {{.Repository}}:{{.Tag}}" | grep -q "^${PROJECT_NAME}:latest$"; then
            local image_size=$(docker images ${PROJECT_NAME}:latest --format "table {{.Size}}" | tail -n1)
            log_info "镜像大小: $image_size"
        fi
    else
        log_error "项目构建失败"
        exit 1
    fi
}

# 创建 Docker 网络
create_network() {
    log_step "3/7 创建容器网络"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "测试模式：跳过网络创建"
        return
    fi
    
    # 检查网络是否存在
    if docker network ls --format "{{.Name}}" | grep -q "^${NETWORK_NAME}$"; then
        log_info "网络 ${NETWORK_NAME} 已存在"
    else
        log_info "创建 Docker 网络..."
        docker network create ${NETWORK_NAME}
        log_success "网络创建完成"
    fi
}

# 部署应用容器
deploy_app_container() {
    log_step "4/7 部署应用容器"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "测试模式：跳过应用容器部署"
        return
    fi
    
    # 停止并删除现有容器
    if docker ps -a --format "{{.Names}}" | grep -q "^${APP_CONTAINER}$"; then
        log_info "停止现有应用容器..."
        docker stop ${APP_CONTAINER} 2>/dev/null || true
        docker rm ${APP_CONTAINER} 2>/dev/null || true
    fi
    
    log_info "启动应用容器..."
    
    # 运行应用容器
    docker run -d \
        --name ${APP_CONTAINER} \
        --network ${NETWORK_NAME} \
        --restart unless-stopped \
        -p ${APP_PORT}:3000 \
        -e NODE_ENV=production \
        -e PORT=3000 \
        ${PROJECT_NAME}:latest
    
    # 等待容器启动
    sleep 5
    
    # 检查容器状态
    if docker ps --format "{{.Names}}" | grep -q "^${APP_CONTAINER}$"; then
        log_success "应用容器启动成功"
        
        # 测试应用响应
        if curl -f http://localhost:${APP_PORT} &>/dev/null; then
            log_success "应用服务响应正常"
        else
            log_warning "应用服务可能未完全启动，请稍后检查"
        fi
    else
        log_error "应用容器启动失败"
        docker logs ${APP_CONTAINER} 2>/dev/null || true
        exit 1
    fi
}

# 创建 Nginx HTTP-only 配置（用于证书申请前）
create_nginx_http_config() {
    log_info "创建 Nginx HTTP-only 配置..."
    
    # 创建配置目录
    mkdir -p nginx/conf.d
    
    # 创建 HTTP-only 配置
    cat > nginx/conf.d/${DOMAIN}.conf << EOF
# HTTP 配置（证书申请前）
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    
    # Let's Encrypt 验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files \$uri =404;
    }
    
    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # 反向代理到应用容器
    location / {
        proxy_pass http://${APP_CONTAINER}:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|txt|woff|woff2)$ {
        proxy_pass http://${APP_CONTAINER}:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    
    log_success "Nginx HTTP-only 配置创建完成"
}

# 创建 Nginx HTTPS 配置（用于证书申请后）
create_nginx_https_config() {
    log_info "创建 Nginx HTTPS 配置..."
    
    # 创建配置目录
    mkdir -p nginx/conf.d
    
    # 创建完整的 HTTP + HTTPS 配置
    cat > nginx/conf.d/${DOMAIN}.conf << EOF
# HTTP 配置 - 重定向到 HTTPS
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    
    # Let's Encrypt 验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files \$uri =404;
    }
    
    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # 重定向到 HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS 配置
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name ${DOMAIN} www.${DOMAIN};
    
    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    
    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # 反向代理到应用容器
    location / {
        proxy_pass http://${APP_CONTAINER}:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|txt|woff|woff2)$ {
        proxy_pass http://${APP_CONTAINER}:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    
    log_success "Nginx HTTPS 配置创建完成"
}

# 部署 Nginx 容器
deploy_nginx_container() {
    log_step "5/7 部署 Nginx 容器"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "测试模式：跳过 Nginx 容器部署"
        return
    fi
    
    # 创建 HTTP-only Nginx 配置（证书申请前）
    if [[ "$SKIP_SSL" == "false" ]]; then
        create_nginx_http_config
    else
        create_nginx_http_config  # 跳过 SSL 时也使用 HTTP-only 配置
    fi
    
    # 创建证书目录
    mkdir -p certbot/www
    mkdir -p certbot/conf
    
    # 停止并删除现有容器
    if docker ps -a --format "{{.Names}}" | grep -q "^${NGINX_CONTAINER}$"; then
        log_info "停止现有 Nginx 容器..."
        docker stop ${NGINX_CONTAINER} 2>/dev/null || true
        docker rm ${NGINX_CONTAINER} 2>/dev/null || true
    fi
    
    log_info "启动 Nginx 容器..."
    
    # 运行 Nginx 容器
    docker run -d \
        --name ${NGINX_CONTAINER} \
        --network ${NETWORK_NAME} \
        --restart unless-stopped \
        -p ${NGINX_HTTP_PORT}:80 \
        -p ${NGINX_HTTPS_PORT}:443 \
        -v "$(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf:ro" \
        -v "$(pwd)/nginx/conf.d:/etc/nginx/conf.d:ro" \
        -v "$(pwd)/certbot/conf:/etc/letsencrypt:ro" \
        -v "$(pwd)/certbot/www:/var/www/certbot:ro" \
        nginx:alpine
    
    # 等待容器启动
    sleep 3
    
    # 检查容器状态
    if docker ps --format "{{.Names}}" | grep -q "^${NGINX_CONTAINER}$"; then
        log_success "Nginx 容器启动成功"
        
        # 测试 Nginx 响应
        if curl -f http://localhost:${NGINX_HTTP_PORT}/health &>/dev/null; then
            log_success "Nginx 服务响应正常"
        else
            log_warning "Nginx 服务可能配置有误"
            docker logs ${NGINX_CONTAINER} 2>/dev/null || true
        fi
    else
        log_error "Nginx 容器启动失败"
        docker logs ${NGINX_CONTAINER} 2>/dev/null || true
        exit 1
    fi
}

# 配置 SSL 证书
configure_ssl() {
    log_step "6/7 配置 SSL 证书"
    
    if [[ "$SKIP_SSL" == "true" ]]; then
        log_info "跳过 SSL 证书配置"
        return
    fi
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "测试模式：跳过 SSL 证书配置"
        return
    fi
    
    log_info "申请 SSL 证书..."
    
    # 运行 Certbot 容器申请证书
    docker run --rm \
        --name certbot-temp \
        -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
        -v "$(pwd)/certbot/www:/var/www/certbot" \
        certbot/certbot \
        certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email ${EMAIL} \
        --agree-tos \
        --no-eff-email \
        --domains ${DOMAIN},www.${DOMAIN}
    
    if [[ $? -eq 0 ]]; then
        log_success "SSL 证书申请成功"
        
        # 切换到 HTTPS 配置
        create_nginx_https_config
        
        # 重载 Nginx 配置
        docker exec ${NGINX_CONTAINER} nginx -s reload
        
        log_success "SSL 配置完成"
        
        # 配置自动续期
        log_info "配置证书自动续期..."
        
        # 创建续期脚本
        cat > certbot-renew.sh << 'EOF'
#!/bin/bash
docker run --rm \
    -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
    -v "$(pwd)/certbot/www:/var/www/certbot" \
    certbot/certbot renew --quiet

# 重载 Nginx
docker exec ziyuanba-nginx nginx -s reload
EOF
        
        chmod +x certbot-renew.sh
        
        # 添加到 crontab
        (crontab -l 2>/dev/null; echo "0 2 * * * $(pwd)/certbot-renew.sh") | crontab -
        
        log_success "自动续期配置完成"
    else
        log_error "SSL 证书申请失败"
        log_warning "将继续使用 HTTP 模式"
        
        # 保持 HTTP-only 配置（已经是正确的配置）
        log_info "保持 HTTP-only 配置"
    fi
}

# 服务验证
verify_deployment() {
    log_step "7/7 服务验证"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "测试模式完成"
        return
    fi
    
    log_info "验证部署状态..."
    
    # 检查容器状态
    echo
    echo "=== 容器状态 ==="
    docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" | grep ${PROJECT_NAME}
    
    # 检查网络连接
    echo
    echo "=== 网络测试 ==="
    
    # HTTP 测试
    if curl -f -s http://localhost:${NGINX_HTTP_PORT}/health &>/dev/null; then
        log_success "HTTP 服务正常"
    else
        log_error "HTTP 服务异常"
    fi
    
    # HTTPS 测试
    if [[ "$SKIP_SSL" == "false" ]]; then
        if curl -f -s -k https://localhost:${NGINX_HTTPS_PORT}/health &>/dev/null; then
            log_success "HTTPS 服务正常"
        else
            log_warning "HTTPS 服务可能未完全配置"
        fi
    fi
    
    # 显示访问信息
    echo
    log_success "部署完成！"
    echo
    echo "=== 访问地址 ==="
    if [[ "$SKIP_SSL" == "false" ]]; then
        echo "• HTTPS: https://${DOMAIN}"
        echo "• HTTPS: https://www.${DOMAIN}"
        echo "• HTTP:  http://${DOMAIN} (自动重定向到 HTTPS)"
    else
        echo "• HTTP:  http://${DOMAIN}"
        echo "• HTTP:  http://www.${DOMAIN}"
    fi
    echo
    echo "=== 管理命令 ==="
    echo "• 查看日志: docker logs ${APP_CONTAINER}"
    echo "• 查看日志: docker logs ${NGINX_CONTAINER}"
    echo "• 重启应用: docker restart ${APP_CONTAINER}"
    echo "• 重启 Nginx: docker restart ${NGINX_CONTAINER}"
    echo "• 停止服务: docker stop ${APP_CONTAINER} ${NGINX_CONTAINER}"
    echo "• 续期证书: ./certbot-renew.sh"
    echo
    echo "=== 监控命令 ==="
    echo "• 容器状态: docker ps"
    echo "• 资源使用: docker stats"
    echo "• 网络状态: docker network ls"
    echo "• 镜像列表: docker images"
    echo
}

# 清理函数
cleanup() {
    if [[ "$DRY_RUN" == "true" ]]; then
        return
    fi
    
    log_info "清理临时文件..."
    # 这里可以添加清理逻辑
}

# 错误处理
error_handler() {
    log_error "部署过程中发生错误"
    log_info "查看容器日志:"
    echo "  docker logs ${APP_CONTAINER} 2>/dev/null || true"
    echo "  docker logs ${NGINX_CONTAINER} 2>/dev/null || true"
    cleanup
    exit 1
}

# 主函数
main() {
    echo "=========================================="
    echo "         一键部署脚本 v1.0"
    echo "=========================================="
    echo
    
    # 解析参数
    parse_args "$@"
    
    # 显示配置信息
    echo "=== 部署配置 ==="
    echo "• 项目名称: ${PROJECT_NAME}"
    echo "• 域名: ${DOMAIN}"
    echo "• 邮箱: ${EMAIL:-"未配置"}"
    echo "• SSL 证书: $([ "$SKIP_SSL" == "true" ] && echo "跳过" || echo "启用")"
    echo "• 强制重建: $([ "$FORCE_REBUILD" == "true" ] && echo "是" || echo "否")"
    echo "• 测试模式: $([ "$DRY_RUN" == "true" ] && echo "是" || echo "否")"
    echo
    
    if [[ "$DRY_RUN" == "false" ]]; then
        read -p "确认开始部署？(y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "部署已取消"
            exit 0
        fi
    fi
    
    # 检查权限
    check_root
    
    # 设置错误处理
    trap error_handler ERR
    
    # 执行部署流程
    check_environment
    build_project
    create_network
    deploy_app_container
    deploy_nginx_container
    configure_ssl
    verify_deployment
    
    # 清理
    cleanup
    
    log_deploy "🎉 部署成功完成！"
}

# 执行主函数
main "$@"
