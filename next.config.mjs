// next.config.mjs
import path from 'path';



const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'strapi-bucket-kamaluso.s3.sa-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '904ccf23c3.clvaw-cdnwnd.com',
      },
    ],
  },
  webpack(config) {
    config.resolve.alias['@'] = path.resolve('./');
    return config;
  },
};

export default nextConfig;