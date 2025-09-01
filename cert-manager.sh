#!/bin/bash

# 证书管理脚本
# 用于管理 SSL 证书的申请、续期和监控

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

# 显示帮助信息
show_help() {
    echo "证书管理脚本"
    echo
    echo "用法: $0 <命令> [参数]"
    echo
    echo "命令:"
    echo "  list                列出所有证书"
    echo "  status <域名>       查看证书状态"
    echo "  renew [域名]        续期证书 (不指定域名则续期所有)"
    echo "  revoke <域名>       撤销证书"
    echo "  delete <域名>       删除证书"
    echo "  test-renewal        测试续期"
    echo "  check-expiry        检查即将过期的证书"
    echo "  backup              备份证书"
    echo "  restore <备份文件>  恢复证书"
    echo
    echo "示例:"
    echo "  $0 list"
    echo "  $0 status example.com"
    echo "  $0 renew example.com"
    echo "  $0 check-expiry"
}

# 检查 root 权限
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "此脚本需要 root 权限运行"
        log_info "请使用: sudo $0"
        exit 1
    fi
}

# 检查 certbot 是否安装
check_certbot() {
    if ! command -v certbot &> /dev/null; then
        log_error "Certbot 未安装"
        log_info "请先运行 setup-ssl.sh 安装 Certbot"
        exit 1
    fi
}

# 列出所有证书
list_certificates() {
    log_info "列出所有证书..."
    certbot certificates
}

# 查看证书状态
check_certificate_status() {
    local domain=$1
    if [[ -z "$domain" ]]; then
        log_error "请指定域名"
        exit 1
    fi
    
    log_info "检查证书状态: $domain"
    
    if [[ -f "/etc/letsencrypt/live/$domain/fullchain.pem" ]]; then
        log_success "证书文件存在"
        
        # 显示证书详细信息
        echo
        echo "=== 证书信息 ==="
        openssl x509 -in /etc/letsencrypt/live/$domain/fullchain.pem -text -noout | grep -E "(Subject:|Issuer:|Not Before:|Not After:|DNS:)"
        
        # 检查过期时间
        local expiry_date=$(openssl x509 -enddate -noout -in /etc/letsencrypt/live/$domain/fullchain.pem | cut -d= -f2)
        local expiry_timestamp=$(date -d "$expiry_date" +%s)
        local current_timestamp=$(date +%s)
        local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
        
        echo
        echo "=== 过期信息 ==="
        echo "过期时间: $expiry_date"
        echo "剩余天数: $days_until_expiry 天"
        
        if [[ $days_until_expiry -lt 30 ]]; then
            log_warning "证书将在 30 天内过期，建议续期"
        elif [[ $days_until_expiry -lt 7 ]]; then
            log_error "证书将在 7 天内过期，请立即续期"
        else
            log_success "证书有效期充足"
        fi
    else
        log_error "证书文件不存在: $domain"
    fi
}

# 续期证书
renew_certificate() {
    local domain=$1
    
    if [[ -n "$domain" ]]; then
        log_info "续期证书: $domain"
        certbot renew --cert-name $domain --post-hook "systemctl reload nginx"
    else
        log_info "续期所有证书..."
        certbot renew --post-hook "systemctl reload nginx"
    fi
    
    if [[ $? -eq 0 ]]; then
        log_success "证书续期成功"
    else
        log_error "证书续期失败"
        exit 1
    fi
}

# 撤销证书
revoke_certificate() {
    local domain=$1
    if [[ -z "$domain" ]]; then
        log_error "请指定域名"
        exit 1
    fi
    
    log_warning "即将撤销证书: $domain"
    read -p "确认撤销？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "操作已取消"
        exit 0
    fi
    
    certbot revoke --cert-path /etc/letsencrypt/live/$domain/fullchain.pem
    
    if [[ $? -eq 0 ]]; then
        log_success "证书撤销成功"
    else
        log_error "证书撤销失败"
        exit 1
    fi
}

# 删除证书
delete_certificate() {
    local domain=$1
    if [[ -z "$domain" ]]; then
        log_error "请指定域名"
        exit 1
    fi
    
    log_warning "即将删除证书: $domain"
    read -p "确认删除？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "操作已取消"
        exit 0
    fi
    
    certbot delete --cert-name $domain
    
    if [[ $? -eq 0 ]]; then
        log_success "证书删除成功"
    else
        log_error "证书删除失败"
        exit 1
    fi
}

# 测试续期
test_renewal() {
    log_info "测试证书续期..."
    certbot renew --dry-run
    
    if [[ $? -eq 0 ]]; then
        log_success "续期测试成功"
    else
        log_error "续期测试失败"
        exit 1
    fi
}

# 检查即将过期的证书
check_expiring_certificates() {
    log_info "检查即将过期的证书..."
    
    local found_expiring=false
    
    for cert_dir in /etc/letsencrypt/live/*/; do
        if [[ -d "$cert_dir" ]]; then
            local domain=$(basename "$cert_dir")
            local cert_file="$cert_dir/fullchain.pem"
            
            if [[ -f "$cert_file" ]]; then
                local expiry_date=$(openssl x509 -enddate -noout -in "$cert_file" | cut -d= -f2)
                local expiry_timestamp=$(date -d "$expiry_date" +%s)
                local current_timestamp=$(date +%s)
                local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
                
                if [[ $days_until_expiry -lt 30 ]]; then
                    found_expiring=true
                    if [[ $days_until_expiry -lt 7 ]]; then
                        log_error "证书即将过期: $domain (剩余 $days_until_expiry 天)"
                    else
                        log_warning "证书即将过期: $domain (剩余 $days_until_expiry 天)"
                    fi
                fi
            fi
        fi
    done
    
    if [[ "$found_expiring" == "false" ]]; then
        log_success "所有证书有效期充足"
    fi
}

# 备份证书
backup_certificates() {
    log_info "备份证书..."
    
    local backup_dir="/root/ssl-backup"
    local backup_file="$backup_dir/letsencrypt-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    mkdir -p "$backup_dir"
    
    tar -czf "$backup_file" -C /etc letsencrypt/
    
    if [[ $? -eq 0 ]]; then
        log_success "证书备份完成: $backup_file"
        
        # 显示备份文件大小
        local backup_size=$(du -h "$backup_file" | cut -f1)
        log_info "备份文件大小: $backup_size"
    else
        log_error "证书备份失败"
        exit 1
    fi
}

# 恢复证书
restore_certificates() {
    local backup_file=$1
    if [[ -z "$backup_file" ]]; then
        log_error "请指定备份文件"
        exit 1
    fi
    
    if [[ ! -f "$backup_file" ]]; then
        log_error "备份文件不存在: $backup_file"
        exit 1
    fi
    
    log_warning "即将恢复证书，这将覆盖现有证书"
    read -p "确认恢复？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "操作已取消"
        exit 0
    fi
    
    # 备份当前证书
    local current_backup="/root/ssl-backup/current-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    mkdir -p /root/ssl-backup
    tar -czf "$current_backup" -C /etc letsencrypt/ . 2>/dev/null || true
    log_info "当前证书已备份到: $current_backup"
    
    # 恢复证书
    tar -xzf "$backup_file" -C /etc/
    
    if [[ $? -eq 0 ]]; then
        log_success "证书恢复成功"
        
        # 重载 Nginx
        if systemctl is-active --quiet nginx; then
            systemctl reload nginx
            log_info "Nginx 配置已重载"
        fi
    else
        log_error "证书恢复失败"
        exit 1
    fi
}

# 主函数
main() {
    case "${1:-help}" in
        list)
            check_root
            check_certbot
            list_certificates
            ;;
        status)
            check_root
            check_certbot
            check_certificate_status "$2"
            ;;
        renew)
            check_root
            check_certbot
            renew_certificate "$2"
            ;;
        revoke)
            check_root
            check_certbot
            revoke_certificate "$2"
            ;;
        delete)
            check_root
            check_certbot
            delete_certificate "$2"
            ;;
        test-renewal)
            check_root
            check_certbot
            test_renewal
            ;;
        check-expiry)
            check_root
            check_certbot
            check_expiring_certificates
            ;;
        backup)
            check_root
            backup_certificates
            ;;
        restore)
            check_root
            restore_certificates "$2"
            ;;
        help|*)
            show_help
            ;;
    esac
}

# 执行主函数
main "$@"
