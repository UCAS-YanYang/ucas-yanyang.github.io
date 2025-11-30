import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. 静态导出 (GitHub Pages 必须)
  output: "export",

  // 2. 你的 GitHub 仓库名 (注意前面有个斜杠)
  // ⚠️⚠️⚠️ 请务必把下面这行改成你的真实仓库名！比如 '/academic-website'
  // 如果你的仓库名是 "你的用户名.github.io"，请删掉下面这一行
  basePath: "/homepage",

  // 3. 关闭图片优化
  images: {
    unoptimized: true,
  },

  // 4. 🔥 忽略 TypeScript 报错 (关键！)
  typescript: {
    ignoreBuildErrors: true,
  },

  // 5. 🔥 忽略 ESLint 报错 (关键！)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;