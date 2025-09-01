#!/bin/bash

# Nginx 配置修复脚本
# 修复 HTTP2 指令过时和 upstream 主机问题

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

# 检查 root 权限
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "此脚本需要 root 权限运行"
        log_info "请使用: sudo $0"
        exit 1
    fi
}

# 修复 Nginx 配置文件
fix_nginx_configs() {
    log_info "修复 Nginx 配置文件..."
    
    # 查找所有 Nginx 配置文件
    local config_files=(
        "/etc/nginx/sites-available/*"
        "/etc/nginx/conf.d/*.conf"
        "nginx/conf.d/*.conf"
    )
    
    for pattern in "${config_files[@]}"; do
        for config_file in $pattern; do
            if [[ -f "$config_file" ]]; then
                log_info "处理配置文件: $config_file"
                
                # 备份原文件
                cp "$config_file" "$config_file.backup.$(date +%Y%m%d-%H%M%S)"
                
                # 修复 HTTP2 指令
                if grep -q "listen.*ssl http2" "$config_file"; then
                    log_info "修复 HTTP2 指令: $config_file"
                    
                    # 替换 listen 443 ssl http2; 为 listen 443 ssl;
                    sed -i 's/listen \([^;]*\) ssl http2;/listen \1 ssl;/g' "$config_file"
                    
                    # 在 server_name 行后添加 http2 on;（如果不存在）
                    if ! grep -q "http2 on;" "$config_file"; then
                        sed -i '/server_name.*{/a\    http2 on;' "$config_file"
                    fi
                fi
                
                # 修复 upstream 主机名问题
                if grep -q "proxy_pass.*http://app:" "$config_file"; then
                    log_info "修复 upstream 主机名: $config_file"
                    sed -i 's|proxy_pass http://app:80|proxy_pass http://ziyuanba-app:3000|g' "$config_file"
                    sed -i 's|proxy_pass http://app:3000|proxy_pass http://ziyuanba-app:3000|g' "$config_file"
                fi
                
                log_success "配置文件已修复: $config_file"
            fi
        done
    done
}

# 修复 Docker 容器中的配置
fix_docker_nginx_config() {
    log_info "修复 Docker 容器中的 Nginx 配置..."
    
    # 检查 Nginx 容器是否运行
    if docker ps --format "{{.Names}}" | grep -q "ziyuanba-nginx"; then
        log_info "发现运行中的 Nginx 容器"
        
        # 重新生成配置文件
        if [[ -f "one-click-deploy.sh" ]]; then
            log_info "重新生成 Nginx 配置..."
            
            # 从现有配置中提取域名
            local domain=$(docker exec ziyuanba-nginx ls /etc/nginx/conf.d/ | grep -v default | head -1 | sed 's/.conf$//')
            
            if [[ -n "$domain" ]]; then
                log_info "检测到域名: $domain"
                
                # 重新创建配置目录
                mkdir -p nginx/conf.d
                
                # 生成修复后的配置
                cat > nginx/conf.d/${domain}.conf << EOF
# HTTP 配置
server {
    listen 80;
    server_name ${domain} www.${domain};
    
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
    server_name ${domain} www.${domain};
    
    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/${domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${domain}/privkey.pem;
    
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
        proxy_pass http://ziyuanba-app:3000;
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
        proxy_pass http://ziyuanba-app:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
                
                log_success "配置文件已重新生成"
            fi
        fi
        
        # 重启 Nginx 容器
        log_info "重启 Nginx 容器..."
        docker restart ziyuanba-nginx
        
        # 等待容器启动
        sleep 5
        
        # 检查容器状态
        if docker ps --format "{{.Names}}" | grep -q "ziyuanba-nginx"; then
            log_success "Nginx 容器重启成功"
        else
            log_error "Nginx 容器重启失败"
            log_info "查看错误日志:"
            docker logs ziyuanba-nginx --tail 20
            exit 1
        fi
    else
        log_warning "未找到运行中的 Nginx 容器"
    fi
}

# 验证修复结果
verify_fix() {
    log_info "验证修复结果..."
    
    # 检查 Nginx 配置语法
    if docker exec ziyuanba-nginx nginx -t &>/dev/null; then
        log_success "Nginx 配置语法正确"
    else
        log_error "Nginx 配置语法错误"
        docker exec ziyuanba-nginx nginx -t
        return 1
    fi
    
    # 检查服务响应
    if curl -f -s http://localhost/health &>/dev/null; then
        log_success "HTTP 服务响应正常"
    else
        log_warning "HTTP 服务可能有问题"
    fi
    
    # 检查 HTTPS 服务（如果配置了 SSL）
    if curl -f -s -k https://localhost/health &>/dev/null; then
        log_success "HTTPS 服务响应正常"
    else
        log_info "HTTPS 服务未配置或有问题（这可能是正常的）"
    fi
    
    # 显示容器状态
    echo
    echo "=== 容器状态 ==="
    docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" | grep ziyuanba
    
    echo
    log_success "修复完成！"
}

# 显示帮助信息
show_help() {
    echo "Nginx 配置修复脚本"
    echo
    echo "用法: $0 [选项]"
    echo
    echo "选项:"
    echo "  -h, --help     显示此帮助信息"
    echo "  --config-only  仅修复配置文件，不重启容器"
    echo
    echo "此脚本会修复以下问题:"
    echo "  1. HTTP2 指令过时警告"
    echo "  2. upstream 主机名错误"
    echo "  3. 重启 Nginx 容器应用修复"
}

# 主函数
main() {
    local config_only=false
    
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            --config-only)
                config_only=true
                shift
                ;;
            *)
                log_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    echo "=========================================="
    echo "         Nginx 配置修复脚本"
    echo "=========================================="
    echo
    
    # 检查权限
    check_root
    
    # 修复配置文件
    fix_nginx_configs
    
    # 修复 Docker 容器配置
    if [[ "$config_only" == "false" ]]; then
        fix_docker_nginx_config
        verify_fix
    else
        log_info "仅修复配置文件，跳过容器重启"
    fi
    
    echo
    log_success "🎉 修复完成！"
}

# 执行主函数
main "$@"
