import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 生成可独立运行的构建产物，适合 Docker 运行时只拷贝必要文件
  output: 'standalone',
};

export default nextConfig;
