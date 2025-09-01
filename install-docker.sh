#!/bin/bash

# Docker 安装脚本 - 简化版
# 支持 Ubuntu, Debian, CentOS, RHEL, Amazon Linux 等主流发行版

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

# 检测操作系统
detect_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        ID=$ID
    elif [[ -f /etc/redhat-release ]]; then
        OS=RedHat
        ID=centos
    else
        OS=$(uname -s)
        ID=unknown
    fi
    log_info "检测到操作系统: $OS"
}

# 安装依赖
install_dependencies() {
    log_info "安装依赖包..."
    case $ID in
        ubuntu|debian)
            apt-get update
            apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
            ;;
        centos|rhel|fedora|rocky|alma|amazon)
            yum install -y yum-utils device-mapper-persistent-data lvm2 curl
            ;;
        *)
            log_warning "未知发行版，尝试通用安装..."
            ;;
    esac
}

# 添加 Docker 仓库
add_docker_repo() {
    log_info "添加 Docker 仓库..."
    case $ID in
        ubuntu|debian)
            curl -fsSL https://download.docker.com/linux/$ID/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/$ID $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
            ;;
        centos|rhel|fedora|rocky|alma|amazon)
            sudo yum-config-manager \
    			--add-repo \
    			https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
            ;;
    esac
}

# 安装 Docker
install_docker() {
    log_info "安装 Docker..."
    case $ID in
        ubuntu|debian)
            apt-get update
            apt-get install -y docker-ce docker-ce-cli containerd.io
            ;;
        centos|rhel|fedora|rocky|alma|amazon)
            yum install -y docker-ce docker-ce-cli containerd.io
            ;;
    esac
}

# 配置 Docker
configure_docker() {
    log_info "配置 Docker..."
    mkdir -p /etc/docker
    cat > /etc/docker/daemon.json << EOF
{
    "registry-mirrors": [
        "https://docker.m.daocloud.io",
        "https://dockerproxy.com",
        "https://hub-mirror.c.163.com"
    ],
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "100m",
        "max-file": "3"
    }
}
EOF
}

# 启动服务
start_docker() {
    log_info "启动 Docker 服务..."
    systemctl start docker
    systemctl enable docker
    sleep 3
    
    if systemctl is-active --quiet docker; then
        log_success "Docker 服务启动成功"
    else
        log_error "Docker 服务启动失败"
        exit 1
    fi
}

# 设置用户组
setup_group() {
    log_info "设置 Docker 用户组..."
    groupadd docker 2>/dev/null || true
    
    if [[ $SUDO_USER ]]; then
        usermod -aG docker $SUDO_USER
        log_success "用户 $SUDO_USER 已添加到 docker 组"
        log_info "需要重新登录或重启系统才能生效"
    fi
}

# 安装 Docker Compose
install_compose() {
    log_info "安装 Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
}

# 验证安装
verify() {
    log_info "验证安装..."
    echo "Docker 版本: $(docker --version)"
    echo "Docker Compose 版本: $(docker-compose --version)"
    
    if docker run --rm hello-world &> /dev/null; then
        log_success "Docker 测试成功"
    else
        log_warning "Docker 测试失败"
    fi
}

# 主函数
main() {
    echo "=========================================="
    echo "           Docker 安装脚本"
    echo "=========================================="
    echo
    
    check_root
    detect_os
    install_dependencies
    add_docker_repo
    install_docker
    configure_docker
    start_docker
    setup_group
#    install_compose
    verify
    
    echo
    log_success "Docker 安装完成！"
    echo "常用命令:"
    echo "• 启动: systemctl start docker"
    echo "• 停止: systemctl stop docker"
    echo "• 状态: systemctl status docker"
    echo "• 日志: journalctl -u docker"
}

main "$@"
