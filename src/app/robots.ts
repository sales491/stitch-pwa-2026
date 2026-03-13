import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = 'https://marinduquemarket.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/',
          '/auth/',
          '/moderator-approval-queue',
          '/onboarding',
          '/marinduque-connect-admin-dashboard',
          '/create-new-listing',
          '/create-event-post-screen',
          '/create-new-job-post-screen',
          '/share-alocal-gem-screen',
          '/post-commute-or-delivery-listing',
          '/google-sign-in-welcome-screen',
          '/create-business-profile-step1',
          '/create-business-profile-step2',
          '/create-business-profile-step3',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
