import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Sizes tuned for mobile-first app (logo at 40px, avatars at 32-128px)
    deviceSizes: [40, 64, 128, 256, 384, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 40, 64, 96, 128, 256],
    // Cache optimized images for 1 year
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rhrkxuoybkdfdrknckjd.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
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
        destination: '/directory/b/:id',
        permanent: true,
      },
      // Safely catch old UUID-based business routes without intercepting /directory/Boac
      {
        source: '/directory/:id([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
        destination: '/directory/b/:id',
        permanent: true,
      },
      // Redirect old standalone town pages to the new directory hubs
      {
        source: '/towns/:town',
        destination: '/directory/:town',
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
