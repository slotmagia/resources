import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "资源吧 - 专业的资源下载平台",
  description: "提供优质的视频、软件、文档等资源下载服务，为用户提供便捷的下载体验",
  keywords: "资源下载,软件下载,视频教程,文档资料,免费资源",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
