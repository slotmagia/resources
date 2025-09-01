#!/bin/bash

# 宝塔面板快速卸载脚本
# 基于官方卸载步骤的简化版本

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
if [[ $EUID -ne 0 ]]; then
    log_error "此脚本需要 root 权限运行"
    log_info "请使用: sudo $0"
    exit 1
fi

echo "=========================================="
echo "         宝塔面板快速卸载脚本"
echo "=========================================="
echo

# 显示警告
log_warning "⚠️  警告：此操作将完全删除宝塔面板及其数据！"
echo
read -p "确认要卸载宝塔面板吗？(输入 'YES' 确认): " confirm
if [[ "$confirm" != "YES" ]]; then
    log_info "操作已取消"
    exit 0
fi

echo
log_info "开始卸载宝塔面板..."

# 1. 停止宝塔面板服务
log_info "1/6 停止宝塔面板服务..."
/etc/init.d/bt stop 2>/dev/null || true
systemctl stop bt 2>/dev/null || true
systemctl stop bt-panel 2>/dev/null || true
pkill -f "BT-Panel\|bt_panel" 2>/dev/null || true
log_success "宝塔服务已停止"

# 2. 删除宝塔面板目录
log_info "2/6 删除宝塔面板目录..."
if [[ -d "/www/server/panel" ]]; then
    rm -rf /www/server/panel
    log_success "宝塔面板目录已删除"
else
    log_info "宝塔面板目录不存在"
fi

# 3. 删除宝塔配置文件
log_info "3/6 删除宝塔配置文件..."
if [[ -d "/etc/bt" ]]; then
    rm -rf /etc/bt
    log_success "宝塔配置文件已删除"
else
    log_info "宝塔配置目录不存在"
fi

# 4. 禁用宝塔服务
log_info "4/6 禁用宝塔服务..."
systemctl disable bt 2>/dev/null || true
systemctl disable bt-panel 2>/dev/null || true
rm -f /etc/systemd/system/bt.service 2>/dev/null || true
rm -f /etc/systemd/system/bt-panel.service 2>/dev/null || true
systemctl daemon-reload 2>/dev/null || true
log_success "宝塔服务已禁用"

# 5. 清理其他宝塔文件
log_info "5/6 清理其他宝塔文件..."
rm -rf /www/server/bt-backup 2>/dev/null || true
rm -rf /www/backup 2>/dev/null || true
rm -rf /root/.bt 2>/dev/null || true
rm -f /etc/init.d/bt* 2>/dev/null || true
crontab -l 2>/dev/null | grep -v "bt\|panel" | crontab - 2>/dev/null || true
log_success "其他宝塔文件已清理"

# 6. 验证卸载
log_info "6/6 验证卸载结果..."
if [[ ! -d "/www/server/panel" && ! -d "/etc/bt" ]]; then
    log_success "宝塔面板已成功卸载"
else
    log_warning "卸载可能不完整，请检查剩余文件"
fi

echo
log_success "🎉 宝塔面板卸载完成！"
echo

# 询问是否重启
read -p "是否立即重启服务器以完成卸载？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "正在重启服务器..."
    sleep 3
    reboot
else
    log_info "请稍后手动重启服务器以完成卸载"
    log_info "重启命令: reboot"
fi
