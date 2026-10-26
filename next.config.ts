import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  // 라우트 세그먼트를 kebab-case로 통일하면서 바뀐 URL은 영구 리다이렉트로 유지한다.
  async redirects() {
    return [{ source: '/aboutVan', destination: '/about-van', permanent: true }];
  },
}

export default nextConfig
