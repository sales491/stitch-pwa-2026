import type { MetadataRoute } from 'next';

const DISALLOW_PATHS = [
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
  '/marketplace/create',
  '/events/create',
  '/jobs/create',
  '/gems/create',
  '/community/create',
  '/ports/create',
  '/commute/create',
  '/commute/register',
  '/island-life/gas-prices/create',
  '/island-life/outages/new',
  '/my-barangay/lost-found/new',
  '/my-barangay/calamity/new',
  '/my-barangay/paluwagan/new',
  '/my-barangay/paluwagan/join',
  '/profile/edit',
  '/login',
  '/claim-business',
  '/live-market/seller',
  '/live-market/claim',
];

export default function robots(): MetadataRoute.Robots {
  const base = 'https://marinduquemarket.com';
  return {
    rules: [
      // ── General crawlers ───────────────────────────────────────────────────
      {
        userAgent: '*',
        allow: [
          '/',
          '/marketplace/',
          '/jobs/',
          '/directory/',
          '/events/',
          '/gems/'
        ],
        disallow: DISALLOW_PATHS,
      },

      // ── Google (feeds Gemini AI Overviews) ────────────────────────────────
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },

      // ── OpenAI / ChatGPT ──────────────────────────────────────────────────
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },

      // ── Anthropic / Claude ────────────────────────────────────────────────
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },

      // ── Perplexity AI ─────────────────────────────────────────────────────
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },

      // ── Meta AI (Llama) ───────────────────────────────────────────────────
      {
        userAgent: 'FacebookBot',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },

      // ── Apple / Applebot ──────────────────────────────────────────────────
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },

      // ── Microsoft / Bing (feeds Copilot) ──────────────────────────────────
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
