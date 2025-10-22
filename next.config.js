/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  
  // Optimized image configuration
  images: {
    domains: ['103.146.234.88', 'cdn.ssactivewear.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: process.env.NODE_ENV === 'development'
  },

  // Performance optimizations
  compress: true,
  
  // Bundle analyzer (uncomment to analyze bundle)
  // webpack: (config, { dev, isServer }) => {
  //   if (!dev && !isServer) {
  //     const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  //     config.plugins.push(
  //       new BundleAnalyzerPlugin({
  //         analyzerMode: 'static',
  //         openAnalyzer: false,
  //         reportFilename: './bundle-analyzer.html',
  //       })
  //     );
  //   }
  //   return config;
  // },

  // Add this for external API calls - Better approach
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://103.146.234.88:3001/api/:path*'
        }
      ]
    }
    // For production, you might want different handling
    return []
  },

  // Experimental features for performance
  experimental: {
    optimizePackageImports: ['react-icons', 'fabric'],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Disable static generation for problematic pages
  // generateStaticParams: false, // Not a valid Next.js config option

  // Headers for better caching
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/image/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig