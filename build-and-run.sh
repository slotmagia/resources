#!/bin/bash

# Docker 项目构建和运行脚本
# 用于构建 ziyuanba 项目镜像并运行容器

set -e

# 配置变量
IMAGE_NAME="ziyuanba"
IMAGE_TAG="latest"
CONTAINER_NAME="ziyuanba-app"
HOST_PORT=80
CONTAINER_PORT=80

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

# 检查 Docker 是否运行
check_docker() {
    if ! docker info &> /dev/null; then
        log_error "Docker 未运行或无法访问"
        log_info "请先启动 Docker 服务: systemctl start docker"
        exit 1
    fi
    log_success "Docker 服务运行正常"
}

# 停止并删除现有容器
stop_existing_container() {
    if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        log_info "发现现有容器 ${CONTAINER_NAME}，正在停止并删除..."
        docker stop ${CONTAINER_NAME} 2>/dev/null || true
        docker rm ${CONTAINER_NAME} 2>/dev/null || true
        log_success "现有容器已清理"
    fi
}

# 删除现有镜像
remove_existing_image() {
    if docker images --format "table {{.Repository}}:{{.Tag}}" | grep -q "^${IMAGE_NAME}:${IMAGE_TAG}$"; then
        log_info "发现现有镜像 ${IMAGE_NAME}:${IMAGE_TAG}，正在删除..."
        docker rmi ${IMAGE_NAME}:${IMAGE_TAG} 2>/dev/null || true
        log_success "现有镜像已清理"
    fi
}

# 构建 Docker 镜像
build_image() {
    log_info "开始构建 Docker 镜像..."
    
    # 检查 Dockerfile 是否存在
    if [[ ! -f "Dockerfile" ]]; then
        log_error "Dockerfile 不存在"
        exit 1
    fi
    
    # 构建镜像
    docker build \
        --build-arg NODE_IMAGE=dockerproxy.com/library/node:20-alpine \
        --build-arg RUNTIME_IMAGE=dockerproxy.com/library/node:20-alpine \
        -t ${IMAGE_NAME}:${IMAGE_TAG} .
    
    if [[ $? -eq 0 ]]; then
        log_success "Docker 镜像构建成功: ${IMAGE_NAME}:${IMAGE_TAG}"
    else
        log_error "Docker 镜像构建失败"
        exit 1
    fi
}

# 运行容器
run_container() {
    log_info "启动容器 ${CONTAINER_NAME}..."
    
    # 运行容器
    docker run -d \
        --name ${CONTAINER_NAME} \
        --restart unless-stopped \
        -p ${HOST_PORT}:${CONTAINER_PORT} \
        -e NODE_ENV=production \
        ${IMAGE_NAME}:${IMAGE_TAG}
    
    if [[ $? -eq 0 ]]; then
        log_success "容器启动成功"
    else
        log_error "容器启动失败"
        exit 1
    fi
}

# 检查容器状态
check_container_status() {
    log_info "检查容器状态..."
    sleep 3
    
    if docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -q "${CONTAINER_NAME}"; then
        log_success "容器运行正常"
        echo
        echo "=== 容器信息 ==="
        docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" | grep "${CONTAINER_NAME}"
        echo
        echo "=== 访问地址 ==="
        echo "• 本地访问: http://localhost:${HOST_PORT}"
        echo "• 网络访问: http://$(hostname -I | awk '{print $1}'):${HOST_PORT}"
        echo
        echo "=== 常用命令 ==="
        echo "• 查看日志: docker logs ${CONTAINER_NAME}"
        echo "• 进入容器: docker exec -it ${CONTAINER_NAME} sh"
        echo "• 停止容器: docker stop ${CONTAINER_NAME}"
        echo "• 重启容器: docker restart ${CONTAINER_NAME}"
        echo "• 删除容器: docker rm -f ${CONTAINER_NAME}"
    else
        log_error "容器未正常运行"
        log_info "查看容器日志: docker logs ${CONTAINER_NAME}"
        exit 1
    fi
}

# 显示构建信息
show_build_info() {
    echo
    echo "=========================================="
    echo "           Docker 构建信息"
    echo "=========================================="
    echo "• 镜像名称: ${IMAGE_NAME}:${IMAGE_TAG}"
    echo "• 容器名称: ${CONTAINER_NAME}"
    echo "• 端口映射: ${HOST_PORT}:${CONTAINER_PORT}"
    echo "• 构建时间: $(date)"
    echo "=========================================="
    echo
}

# 主函数
main() {
    echo "=========================================="
    echo "       Docker 项目构建和运行脚本"
    echo "=========================================="
    echo
    
    show_build_info
    
    # 检查 Docker 服务
    check_docker
    
    # 清理现有资源
    stop_existing_container
    remove_existing_image
    
    # 构建镜像
    build_image
    
    # 运行容器
    run_container
    
    # 检查状态
    check_container_status
    
    log_success "项目部署完成！"
}

# 错误处理
trap 'log_error "脚本执行过程中发生错误"; exit 1' ERR

# 执行主函数
main "$@"
