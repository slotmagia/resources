#!/bin/bash

# 快速部署脚本
# 用于快速构建、部署和管理 ziyuanba 项目

set -e

# 配置
IMAGE_NAME="ziyuanba"
CONTAINER_NAME="ziyuanba-app"
HOST_PORT=80

# 颜色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

show_help() {
    echo "用法: $0 [命令]"
    echo
    echo "命令:"
    echo "  build     构建 Docker 镜像"
    echo "  run       运行容器 (端口 80:80)"
    echo "  deploy    构建并运行 (推荐)"
    echo "  stop      停止容器"
    echo "  restart   重启容器"
    echo "  logs      查看容器日志"
    echo "  status    查看容器状态"
    echo "  shell     进入容器"
    echo "  clean     清理所有资源"
    echo "  help      显示此帮助信息"
    echo
    echo "示例:"
    echo "  $0 deploy    # 构建并运行项目"
    echo "  $0 logs      # 查看运行日志"
    echo "  $0 stop      # 停止项目"
}

build_image() {
    echo -e "${BLUE}[INFO]${NC} 构建 Docker 镜像..."
    docker build \
        -t ${IMAGE_NAME}:latest .
    echo -e "${GREEN}[SUCCESS]${NC} 镜像构建完成"
}

run_container() {
    echo -e "${BLUE}[INFO]${NC} 启动容器..."
    
    # 停止并删除现有容器
    docker stop ${CONTAINER_NAME} 2>/dev/null || true
    docker rm ${CONTAINER_NAME} 2>/dev/null || true
    
    # 运行新容器
    docker run -d \
        --name ${CONTAINER_NAME} \
        --restart unless-stopped \
        -p ${HOST_PORT}:80 \
        -e NODE_ENV=production \
        ${IMAGE_NAME}:latest
    
    echo -e "${GREEN}[SUCCESS]${NC} 容器启动成功"
    echo "访问地址: http://localhost:${HOST_PORT}"
}

deploy() {
    echo -e "${BLUE}[INFO]${NC} 开始部署..."
    build_image
    run_container
    echo -e "${GREEN}[SUCCESS]${NC} 部署完成！"
}

stop_container() {
    echo -e "${BLUE}[INFO]${NC} 停止容器..."
    docker stop ${CONTAINER_NAME}
    echo -e "${GREEN}[SUCCESS]${NC} 容器已停止"
}

restart_container() {
    echo -e "${BLUE}[INFO]${NC} 重启容器..."
    docker restart ${CONTAINER_NAME}
    echo -e "${GREEN}[SUCCESS]${NC} 容器已重启"
}

show_logs() {
    echo -e "${BLUE}[INFO]${NC} 显示容器日志..."
    docker logs -f ${CONTAINER_NAME}
}

show_status() {
    echo -e "${BLUE}[INFO]${NC} 容器状态:"
    docker ps -a --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
}

enter_shell() {
    echo -e "${BLUE}[INFO]${NC} 进入容器..."
    docker exec -it ${CONTAINER_NAME} sh
}

clean_all() {
    echo -e "${BLUE}[INFO]${NC} 清理所有资源..."
    
    # 停止并删除容器
    docker stop ${CONTAINER_NAME} 2>/dev/null || true
    docker rm ${CONTAINER_NAME} 2>/dev/null || true
    
    # 删除镜像
    docker rmi ${IMAGE_NAME}:latest 2>/dev/null || true
    
    # 清理未使用的资源
    docker system prune -f
    
    echo -e "${GREEN}[SUCCESS]${NC} 清理完成"
}

# 主逻辑
case "${1:-help}" in
    build)
        build_image
        ;;
    run)
        run_container
        ;;
    deploy)
        deploy
        ;;
    stop)
        stop_container
        ;;
    restart)
        restart_container
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    shell)
        enter_shell
        ;;
    clean)
        clean_all
        ;;
    help|*)
        show_help
        ;;
esac
