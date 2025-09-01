#!/bin/bash

# SSL 证书配置脚本
# 支持 Let's Encrypt 免费证书和 Nginx 反向代理配置

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 配置变量
DOMAIN=""
EMAIL=""
NGINX_CONF_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"
CONTAINER_NAME="ziyuanba-app"
CONTAINER_PORT=80

# 显示帮助信息
show_help() {
    echo "SSL 证书配置脚本"
    echo
    echo "用法: $0 -d <域名> -e <邮箱> [选项]"
    echo
    echo "必需参数:"
    echo "  -d, --domain    域名 (例如: example.com)"
    echo "  -e, --email     邮箱地址 (用于 Let's Encrypt 注册)"
    echo
    echo "可选参数:"
    echo "  -h, --help      显示此帮助信息"
    echo "  --dry-run       测试模式，不实际申请证书"
    echo
    echo "示例:"
    echo "  $0 -d example.com -e admin@example.com"
    echo "  $0 -d www.example.com -e admin@example.com --dry-run"
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
    if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
        log_error "域名和邮箱是必需参数"
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

# 检查域名解析
check_domain_resolution() {
    log_info "检查域名解析..."
    
    # 获取服务器公网 IP
    SERVER_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || curl -s icanhazip.com)
    
    if [[ -z "$SERVER_IP" ]]; then
        log_warning "无法获取服务器公网 IP，跳过域名解析检查"
        return
    fi
    
    # 检查域名解析
    DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)
    
    if [[ "$DOMAIN_IP" == "$SERVER_IP" ]]; then
        log_success "域名解析正确: $DOMAIN -> $SERVER_IP"
    else
        log_warning "域名解析可能不正确:"
        log_warning "域名 $DOMAIN 解析到: $DOMAIN_IP"
        log_warning "服务器 IP: $SERVER_IP"
        log_warning "请确保域名 A 记录指向服务器 IP"
        
        read -p "是否继续？(y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# 安装 Nginx
install_nginx() {
    log_info "检查并安装 Nginx..."
    
    if command -v nginx &> /dev/null; then
        log_info "Nginx 已安装"
        return
    fi
    
    # 检测系统类型并安装
    if [[ -f /etc/debian_version ]]; then
        apt-get update
        apt-get install -y nginx
    elif [[ -f /etc/redhat-release ]]; then
        yum install -y nginx || dnf install -y nginx
    else
        log_error "不支持的系统类型"
        exit 1
    fi
    
    # 启动并启用 Nginx
    systemctl start nginx
    systemctl enable nginx
    
    log_success "Nginx 安装完成"
}

# 安装 Certbot
install_certbot() {
    log_info "检查并安装 Certbot..."
    
    if command -v certbot &> /dev/null; then
        log_info "Certbot 已安装"
        return
    fi
    
    # 检测系统类型并安装
    if [[ -f /etc/debian_version ]]; then
        apt-get update
        apt-get install -y certbot python3-certbot-nginx
    elif [[ -f /etc/redhat-release ]]; then
        yum install -y certbot python3-certbot-nginx || dnf install -y certbot python3-certbot-nginx
    else
        log_error "不支持的系统类型"
        exit 1
    fi
    
    log_success "Certbot 安装完成"
}

# 创建 Nginx 配置
create_nginx_config() {
    log_info "创建 Nginx 配置..."
    
    # 创建配置文件
    cat > ${NGINX_CONF_DIR}/${DOMAIN} << EOF
# HTTP 配置 - 重定向到 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    
    # Let's Encrypt 验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # 其他请求重定向到 HTTPS
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
    
    # SSL 证书配置 (Certbot 会自动添加)
    # ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    
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
    
    # 反向代理到 Docker 容器
    location / {
        proxy_pass http://127.0.0.1:${CONTAINER_PORT};
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
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|txt)$ {
        proxy_pass http://127.0.0.1:${CONTAINER_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
EOF
    
    # 启用站点
    ln -sf ${NGINX_CONF_DIR}/${DOMAIN} ${NGINX_ENABLED_DIR}/
    
    # 测试配置
    nginx -t
    
    if [[ $? -eq 0 ]]; then
        log_success "Nginx 配置创建成功"
    else
        log_error "Nginx 配置有误"
        exit 1
    fi
}

# 申请 SSL 证书
obtain_ssl_certificate() {
    log_info "申请 SSL 证书..."
    
    # 重载 Nginx 配置
    systemctl reload nginx
    
    # 构建 Certbot 命令
    CERTBOT_CMD="certbot --nginx"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        CERTBOT_CMD="$CERTBOT_CMD --dry-run"
        log_info "运行测试模式..."
    fi
    
    # 申请证书
    $CERTBOT_CMD \
        --non-interactive \
        --agree-tos \
        --email $EMAIL \
        --domains $DOMAIN,www.$DOMAIN \
        --redirect
    
    if [[ $? -eq 0 ]]; then
        if [[ "$DRY_RUN" == "true" ]]; then
            log_success "SSL 证书测试成功"
        else
            log_success "SSL 证书申请成功"
        fi
    else
        log_error "SSL 证书申请失败"
        exit 1
    fi
}

# 配置自动续期
setup_auto_renewal() {
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "测试模式，跳过自动续期配置"
        return
    fi
    
    log_info "配置证书自动续期..."
    
    # 创建续期脚本
    cat > /etc/cron.d/certbot-renewal << EOF
# 每天检查证书续期
0 2 * * * root certbot renew --quiet --post-hook "systemctl reload nginx"
EOF
    
    # 测试续期
    certbot renew --dry-run
    
    if [[ $? -eq 0 ]]; then
        log_success "自动续期配置成功"
    else
        log_warning "自动续期配置可能有问题"
    fi
}

# 配置防火墙
configure_firewall() {
    log_info "配置防火墙..."
    
    # 检查并配置 UFW
    if command -v ufw &> /dev/null; then
        ufw allow 'Nginx Full'
        ufw --force enable
        log_success "UFW 防火墙配置完成"
    # 检查并配置 firewalld
    elif command -v firewall-cmd &> /dev/null; then
        firewall-cmd --permanent --add-service=http
        firewall-cmd --permanent --add-service=https
        firewall-cmd --reload
        log_success "Firewalld 防火墙配置完成"
    else
        log_warning "未检测到防火墙，请手动开放 80 和 443 端口"
    fi
}

# 验证配置
verify_setup() {
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "测试模式完成"
        return
    fi
    
    log_info "验证配置..."
    
    # 检查 Nginx 状态
    if systemctl is-active --quiet nginx; then
        log_success "Nginx 服务运行正常"
    else
        log_error "Nginx 服务未运行"
    fi
    
    # 检查证书
    if [[ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]]; then
        log_success "SSL 证书文件存在"
        
        # 显示证书信息
        CERT_EXPIRY=$(openssl x509 -enddate -noout -in /etc/letsencrypt/live/${DOMAIN}/fullchain.pem | cut -d= -f2)
        log_info "证书到期时间: $CERT_EXPIRY"
    else
        log_error "SSL 证书文件不存在"
    fi
    
    echo
    log_success "SSL 配置完成！"
    echo
    echo "=== 访问地址 ==="
    echo "• HTTPS: https://${DOMAIN}"
    echo "• HTTPS: https://www.${DOMAIN}"
    echo
    echo "=== 管理命令 ==="
    echo "• 重载 Nginx: systemctl reload nginx"
    echo "• 续期证书: certbot renew"
    echo "• 查看证书: certbot certificates"
    echo "• 删除证书: certbot delete --cert-name ${DOMAIN}"
    echo
}

# 主函数
main() {
    echo "=========================================="
    echo "           SSL 证书配置脚本"
    echo "=========================================="
    echo
    
    # 解析参数
    parse_args "$@"
    
    # 检查权限
    check_root
    
    # 检查域名解析
    check_domain_resolution
    
    # 安装必要软件
    install_nginx
    install_certbot
    
    # 创建配置
    create_nginx_config
    
    # 申请证书
    obtain_ssl_certificate
    
    # 配置自动续期
    setup_auto_renewal
    
    # 配置防火墙
    configure_firewall
    
    # 验证配置
    verify_setup
}

# 错误处理
trap 'log_error "脚本执行过程中发生错误"; exit 1' ERR

# 执行主函数
main "$@"
