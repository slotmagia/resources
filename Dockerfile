# 1) 构建阶段
# 需在任意 FROM 之前声明所有会用于 FROM 的 ARG，兼容较旧 Docker 版本
ARG NODE_IMAGE=node:20-alpine
ARG RUNTIME_IMAGE=node:20-alpine
FROM ${NODE_IMAGE} AS builder
WORKDIR /app

# 安装依赖（利用缓存）
COPY package.json package-lock.json ./
RUN npm ci

# 拷贝源码并构建
COPY . .
RUN npm run build

# 2) 运行阶段（尽量精简）
FROM ${RUNTIME_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production
# 设置端口为 3000
ENV PORT=3000

# 安装 wget 用于健康检查
RUN apk add --no-cache wget

# 仅复制运行所需文件
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# 使用 Next.js standalone 入口启动
CMD ["node", "server.js"]



