#!/bin/bash

# 宝塔面板完全卸载脚本
# 包含数据备份和安全卸载功能

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
log_backup() { echo -e "${CYAN}[BACKUP]${NC} $1"; }

# 配置变量
BACKUP_DIR="/root/bt-backup-$(date +%Y%m%d-%H%M%S)"
BT_PANEL_DIR="/www/server/panel"
BT_CONFIG_DIR="/etc/bt"
BT_WWW_DIR="/www/wwwroot"
BT_SERVER_DIR="/www/server"
SKIP_BACKUP=false
FORCE_UNINSTALL=false
AUTO_REBOOT=false

# 显示帮助信息
show_help() {
    echo "宝塔面板完全卸载脚本"
    echo
    echo "用法: $0 [选项]"
    echo
    echo "选项:"
    echo "  -h, --help           显示此帮助信息"
    echo "  --skip-backup        跳过数据备份（不推荐）"
    echo "  --force              强制卸载，跳过确认"
    echo "  --auto-reboot        卸载完成后自动重启"
    echo
    echo "警告:"
    echo "  此脚本将完全删除宝塔面板及其所有数据"
    echo "  请确保在执行前备份重要数据"
    echo
    echo "示例:"
    echo "  $0                   # 交互式卸载（推荐）"
    echo "  $0 --skip-backup     # 跳过备份直接卸载"
    echo "  $0 --force           # 强制卸载不询问"
}

# 解析命令行参数
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --force)
                FORCE_UNINSTALL=true
                shift
                ;;
            --auto-reboot)
                AUTO_REBOOT=true
                shift
                ;;
            *)
                log_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# 检查 root 权限
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "此脚本需要 root 权限运行"
        log_info "请使用: sudo $0"
        exit 1
    fi
}

# 检查宝塔面板是否安装
check_bt_installed() {
    log_step "1/8 检查宝塔面板安装状态"
    
    local bt_installed=false
    
    # 检查宝塔面板目录
    if [[ -d "$BT_PANEL_DIR" ]]; then
        log_info "发现宝塔面板目录: $BT_PANEL_DIR"
        bt_installed=true
    fi
    
    # 检查宝塔配置目录
    if [[ -d "$BT_CONFIG_DIR" ]]; then
        log_info "发现宝塔配置目录: $BT_CONFIG_DIR"
        bt_installed=true
    fi
    
    # 检查宝塔服务
    if systemctl list-units --full -all | grep -q "bt.service\|bt-panel.service"; then
        log_info "发现宝塔系统服务"
        bt_installed=true
    fi
    
    # 检查宝塔进程
    if pgrep -f "BT-Panel\|bt_panel" &>/dev/null; then
        log_info "发现宝塔面板进程"
        bt_installed=true
    fi
    
    if [[ "$bt_installed" == "false" ]]; then
        log_warning "未检测到宝塔面板安装"
        read -p "是否继续执行清理？(y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "操作已取消"
            exit 0
        fi
    else
        log_success "检测到宝塔面板安装"
    fi
}

# 显示警告和确认
show_warning() {
    if [[ "$FORCE_UNINSTALL" == "true" ]]; then
        log_info "强制模式，跳过确认"
        return
    fi
    
    echo
    log_warning "⚠️  重要警告 ⚠️"
    echo
    echo "此操作将完全删除宝塔面板，包括："
    echo "• 宝塔面板程序和配置"
    echo "• 所有网站数据（如果存在）"
    echo "• 数据库数据（如果存在）"
    echo "• SSL 证书（如果存在）"
    echo "• 定时任务和备份"
    echo
    log_warning "此操作不可逆！请确保已备份重要数据！"
    echo
    
    read -p "确认要卸载宝塔面板吗？(输入 'YES' 确认): " confirm
    if [[ "$confirm" != "YES" ]]; then
        log_info "操作已取消"
        exit 0
    fi
}

# 备份重要数据
backup_data() {
    log_step "2/8 备份重要数据"
    
    if [[ "$SKIP_BACKUP" == "true" ]]; then
        log_warning "跳过数据备份"
        return
    fi
    
    log_backup "创建备份目录: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    
    # 备份宝塔配置
    if [[ -d "$BT_CONFIG_DIR" ]]; then
        log_backup "备份宝塔配置..."
        cp -r "$BT_CONFIG_DIR" "$BACKUP_DIR/bt-config" 2>/dev/null || true
    fi
    
    # 备份面板数据
    if [[ -d "$BT_PANEL_DIR" ]]; then
        log_backup "备份面板数据..."
        # 只备份重要的配置文件，不备份整个面板
        mkdir -p "$BACKUP_DIR/panel-config"
        find "$BT_PANEL_DIR" -name "*.conf" -o -name "*.json" -o -name "*.db" | while read file; do
            cp "$file" "$BACKUP_DIR/panel-config/" 2>/dev/null || true
        done
    fi
    
    # 备份网站数据（询问用户）
    if [[ -d "$BT_WWW_DIR" ]]; then
        echo
        log_warning "发现网站数据目录: $BT_WWW_DIR"
        read -p "是否备份网站数据？(y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_backup "备份网站数据..."
            cp -r "$BT_WWW_DIR" "$BACKUP_DIR/wwwroot" 2>/dev/null || true
        fi
    fi
    
    # 备份数据库（如果存在）
    if command -v mysqldump &>/dev/null && systemctl is-active --quiet mysql; then
        echo
        read -p "是否备份 MySQL 数据库？(y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_backup "备份 MySQL 数据库..."
            mkdir -p "$BACKUP_DIR/mysql"
            mysqldump --all-databases > "$BACKUP_DIR/mysql/all-databases.sql" 2>/dev/null || true
        fi
    fi
    
    # 创建备份信息文件
    cat > "$BACKUP_DIR/backup-info.txt" << EOF
宝塔面板卸载备份
备份时间: $(date)
备份目录: $BACKUP_DIR
服务器信息: $(uname -a)
宝塔版本: $(cat /www/server/panel/class/common.py | grep "version = " | head -1 2>/dev/null || echo "未知")

备份内容:
- 宝塔配置文件
- 面板配置数据
$([ -d "$BACKUP_DIR/wwwroot" ] && echo "- 网站数据")
$([ -d "$BACKUP_DIR/mysql" ] && echo "- MySQL 数据库")

恢复说明:
1. 重新安装宝塔面板
2. 恢复配置文件到对应目录
3. 恢复网站数据和数据库
EOF
    
    # 压缩备份
    log_backup "压缩备份文件..."
    tar -czf "${BACKUP_DIR}.tar.gz" -C "$(dirname "$BACKUP_DIR")" "$(basename "$BACKUP_DIR")"
    
    if [[ $? -eq 0 ]]; then
        rm -rf "$BACKUP_DIR"
        log_success "备份完成: ${BACKUP_DIR}.tar.gz"
        
        # 显示备份大小
        local backup_size=$(du -h "${BACKUP_DIR}.tar.gz" | cut -f1)
        log_info "备份文件大小: $backup_size"
    else
        log_error "备份压缩失败"
        exit 1
    fi
}

# 停止宝塔服务
stop_bt_services() {
    log_step "3/8 停止宝塔服务"
    
    # 停止宝塔面板服务
    log_info "停止宝塔面板服务..."
    
    # 尝试多种停止方式
    /etc/init.d/bt stop 2>/dev/null || true
    systemctl stop bt 2>/dev/null || true
    systemctl stop bt-panel 2>/dev/null || true
    
    # 强制杀死宝塔进程
    log_info "终止宝塔进程..."
    pkill -f "BT-Panel" 2>/dev/null || true
    pkill -f "bt_panel" 2>/dev/null || true
    pkill -f "panel.py" 2>/dev/null || true
    
    # 等待进程完全停止
    sleep 3
    
    # 检查是否还有宝塔进程
    if pgrep -f "BT-Panel\|bt_panel" &>/dev/null; then
        log_warning "仍有宝塔进程运行，强制终止..."
        pkill -9 -f "BT-Panel\|bt_panel" 2>/dev/null || true
        sleep 2
    fi
    
    log_success "宝塔服务已停止"
}

# 禁用宝塔服务
disable_bt_services() {
    log_step "4/8 禁用宝塔服务"
    
    # 禁用系统服务
    log_info "禁用宝塔系统服务..."
    
    systemctl disable bt 2>/dev/null || true
    systemctl disable bt-panel 2>/dev/null || true
    
    # 删除服务文件
    rm -f /etc/systemd/system/bt.service 2>/dev/null || true
    rm -f /etc/systemd/system/bt-panel.service 2>/dev/null || true
    rm -f /lib/systemd/system/bt.service 2>/dev/null || true
    rm -f /lib/systemd/system/bt-panel.service 2>/dev/null || true
    
    # 重载 systemd
    systemctl daemon-reload 2>/dev/null || true
    
    log_success "宝塔服务已禁用"
}

# 删除宝塔文件和目录
remove_bt_files() {
    log_step "5/8 删除宝塔文件和目录"
    
    # 删除宝塔面板目录
    if [[ -d "$BT_PANEL_DIR" ]]; then
        log_info "删除宝塔面板目录: $BT_PANEL_DIR"
        rm -rf "$BT_PANEL_DIR"
    fi
    
    # 删除宝塔配置目录
    if [[ -d "$BT_CONFIG_DIR" ]]; then
        log_info "删除宝塔配置目录: $BT_CONFIG_DIR"
        rm -rf "$BT_CONFIG_DIR"
    fi
    
    # 删除其他宝塔相关目录
    local bt_dirs=(
        "/www/server/panel"
        "/www/server/bt-backup"
        "/www/backup"
        "/root/.bt"
        "/usr/local/bt"
    )
    
    for dir in "${bt_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            log_info "删除目录: $dir"
            rm -rf "$dir"
        fi
    done
    
    # 询问是否删除整个 /www 目录
    if [[ -d "/www" ]]; then
        echo
        log_warning "发现 /www 目录，可能包含网站数据"
        read -p "是否删除整个 /www 目录？(y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_warning "删除 /www 目录..."
            rm -rf /www
        else
            log_info "保留 /www 目录"
        fi
    fi
    
    log_success "宝塔文件和目录已删除"
}

# 清理宝塔相关配置
cleanup_bt_config() {
    log_step "6/8 清理宝塔相关配置"
    
    # 删除宝塔相关的 cron 任务
    log_info "清理定时任务..."
    crontab -l 2>/dev/null | grep -v "bt\|panel" | crontab - 2>/dev/null || true
    
    # 删除宝塔相关的环境变量
    log_info "清理环境变量..."
    sed -i '/bt\|panel/d' /etc/environment 2>/dev/null || true
    sed -i '/bt\|panel/d' /root/.bashrc 2>/dev/null || true
    sed -i '/bt\|panel/d' /root/.profile 2>/dev/null || true
    
    # 删除宝塔相关的 init 脚本
    log_info "清理启动脚本..."
    rm -f /etc/init.d/bt* 2>/dev/null || true
    
    # 删除宝塔相关的日志文件
    log_info "清理日志文件..."
    rm -rf /var/log/bt* 2>/dev/null || true
    rm -rf /tmp/bt* 2>/dev/null || true
    
    # 删除宝塔相关的软链接
    log_info "清理软链接..."
    find /usr/bin /usr/local/bin -name "*bt*" -type l -delete 2>/dev/null || true
    
    log_success "宝塔相关配置已清理"
}

# 清理防火墙规则
cleanup_firewall() {
    log_step "7/8 清理防火墙规则"
    
    # 清理宝塔面板端口（通常是 8888）
    log_info "清理宝塔面板端口规则..."
    
    # UFW 防火墙
    if command -v ufw &>/dev/null; then
        ufw delete allow 8888 2>/dev/null || true
        ufw delete allow 888 2>/dev/null || true
        ufw delete allow 21 2>/dev/null || true  # FTP
        ufw delete allow 39000:40000/tcp 2>/dev/null || true  # FTP 被动模式
    fi
    
    # firewalld 防火墙
    if command -v firewall-cmd &>/dev/null; then
        firewall-cmd --permanent --remove-port=8888/tcp 2>/dev/null || true
        firewall-cmd --permanent --remove-port=888/tcp 2>/dev/null || true
        firewall-cmd --permanent --remove-port=21/tcp 2>/dev/null || true
        firewall-cmd --permanent --remove-port=39000-40000/tcp 2>/dev/null || true
        firewall-cmd --reload 2>/dev/null || true
    fi
    
    # iptables 规则（谨慎处理）
    log_info "检查 iptables 规则..."
    if iptables -L | grep -q "8888\|bt"; then
        log_warning "发现可能的宝塔 iptables 规则，请手动检查和清理"
    fi
    
    log_success "防火墙规则已清理"
}

# 验证卸载结果
verify_uninstall() {
    log_step "8/8 验证卸载结果"
    
    local issues_found=false
    
    # 检查目录是否还存在
    local check_dirs=("$BT_PANEL_DIR" "$BT_CONFIG_DIR" "/www/server/panel")
    for dir in "${check_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            log_warning "目录仍然存在: $dir"
            issues_found=true
        fi
    done
    
    # 检查进程是否还在运行
    if pgrep -f "BT-Panel\|bt_panel" &>/dev/null; then
        log_warning "宝塔进程仍在运行"
        issues_found=true
    fi
    
    # 检查服务是否还存在
    if systemctl list-units --full -all | grep -q "bt.service\|bt-panel.service"; then
        log_warning "宝塔服务仍然存在"
        issues_found=true
    fi
    
    # 检查端口是否还在监听
    if netstat -tlnp 2>/dev/null | grep -q ":8888\|:888"; then
        log_warning "宝塔端口仍在监听"
        issues_found=true
    fi
    
    if [[ "$issues_found" == "false" ]]; then
        log_success "宝塔面板已完全卸载"
    else
        log_warning "卸载可能不完整，请检查上述问题"
    fi
    
    # 显示卸载总结
    echo
    echo "=== 卸载总结 ==="
    echo "• 宝塔服务: 已停止并禁用"
    echo "• 宝塔文件: 已删除"
    echo "• 配置文件: 已清理"
    echo "• 防火墙规则: 已清理"
    if [[ "$SKIP_BACKUP" == "false" ]]; then
        echo "• 数据备份: ${BACKUP_DIR}.tar.gz"
    fi
    echo
}

# 重启系统
reboot_system() {
    echo
    if [[ "$AUTO_REBOOT" == "true" ]]; then
        log_info "自动重启模式，10 秒后重启系统..."
        sleep 10
        reboot
    else
        read -p "是否立即重启系统以完成卸载？(y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log_info "正在重启系统..."
            reboot
        else
            log_info "请稍后手动重启系统以完成卸载"
        fi
    fi
}

# 主函数
main() {
    echo "=========================================="
    echo "         宝塔面板完全卸载脚本"
    echo "=========================================="
    echo
    
    # 解析参数
    parse_args "$@"
    
    # 检查权限
    check_root
    
    # 检查宝塔安装状态
    check_bt_installed
    
    # 显示警告和确认
    show_warning
    
    echo
    log_info "开始卸载宝塔面板..."
    echo
    
    # 执行卸载流程
    backup_data
    stop_bt_services
    disable_bt_services
    remove_bt_files
    cleanup_bt_config
    cleanup_firewall
    verify_uninstall
    
    echo
    log_success "🎉 宝塔面板卸载完成！"
    
    # 重启系统
    reboot_system
}

# 错误处理
trap 'log_error "卸载过程中发生错误，请检查日志"; exit 1' ERR

# 执行主函数
main "$@"
