import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rhrkxuoybkdfdrknckjd.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/marinduque-classifieds-marketplace',
        destination: '/marketplace',
        permanent: true,
      },
      {
        source: '/marinduque-jobs-listing-feed',
        destination: '/jobs',
        permanent: true,
      },
      {
        source: '/marinduque-business-directory',
        destination: '/directory',
        permanent: true,
      },
      {
        source: '/business/:id',
        destination: '/directory/:id',
        permanent: true,
      },
      {
        source: '/local-business-profile-page',
        destination: '/directory',
        permanent: true,
      },
      {
        source: '/gems-of-marinduque-feed',
        destination: '/gems',
        permanent: true,
      },
      {
        source: '/marinduque-connect-home-feed',
        destination: '/',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
