import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // URLを簡潔に: サーバー側で即リダイレクト（React起動不要）
  async redirects() {
    return [
      { source: "/", destination: "/login", permanent: false },
      { source: "/admin", destination: "/admin/dashboard", permanent: false },
      { source: "/learner", destination: "/learner/workspace", permanent: false },
    ];
  },
};

export default nextConfig;
