/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 정적 파일로 제공되는 스토리북 경로 설정
  async rewrites() {
    return [
      {
        source: '/storybook',
        destination: '/storybook/index.html',
      },
      {
        source: '/sb-manager/:path*',
        destination: '/storybook/sb-manager/:path*',
      },
      {
        source: '/sb-addons/:path*',
        destination: '/storybook/sb-addons/:path*',
      },
      {
        source: '/storybook/:path*',
        destination: '/storybook/:path*',
      }
    ]
  }
}

module.exports = nextConfig 