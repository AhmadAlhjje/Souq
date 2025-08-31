const nextConfig = {
  images: {
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/',
      },
    ],
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig