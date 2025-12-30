/** @type {import('next').NextConfig} */
const nextConfig = {
  // For production, we should fix TypeScript errors instead of ignoring them
  // Keep this for now but aim to remove it
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image configuration for Supabase storage and external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Set to false for better performance with optimized images
    unoptimized: false,
    // Format optimization for better compression (AVIF is smaller than WebP)
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Image sizes for different use cases
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 1 year (improves repeat load performance)
    minimumCacheTTL: 31536000,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
    ]
  },
}

export default nextConfig
