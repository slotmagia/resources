# 单阶段构建（兼容不支持多阶段的旧版 Docker）
export DOCKER_CONTENT_TRUST=0
docker pull docker.m.daocloud.io/library/node:20-alpine
WORKDIR /app

# 安装依赖（利用缓存）
COPY package.json package-lock.json ./
RUN npm ci

# 拷贝源码并构建
COPY . .
RUN npm run build && npm prune --omit=dev

ENV NODE_ENV=production
ENV PORT=3000

# 可选：用于健康检查
RUN apk add --no-cache wget

EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# 直接运行 Next.js standalone 输出
CMD ["node", ".next/standalone/server.js"]



