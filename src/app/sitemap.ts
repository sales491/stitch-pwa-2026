import type { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';
import { ROUTES } from '@/utils/routes';

const BASE = 'https://marinduquemarket.com';

// Static routes with priorities & change frequencies
// We use a fixed date rather than 'new Date()' to ensure crawlers cache the sitemap efficiently
const STATIC_DATE = new Date('2026-04-10T00:00:00Z');

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 1.0 },
  { url: `${BASE}/news`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.9 },
  { url: `${BASE}/marketplace`, lastModified: STATIC_DATE, changeFrequency: 'hourly', priority: 0.9 },
  { url: `${BASE}/jobs`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.9 },
  { url: `${BASE}/events`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.8 },
  { url: `${BASE}/gems`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.8 },
  { url: `${BASE}${ROUTES.DIRECTORY_TOWN('Boac')}`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}${ROUTES.DIRECTORY_TOWN('Buenavista')}`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}${ROUTES.DIRECTORY_TOWN('Gasan')}`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}${ROUTES.DIRECTORY_TOWN('Mogpog')}`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}${ROUTES.DIRECTORY_TOWN('Santa Cruz')}`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}${ROUTES.DIRECTORY_TOWN('Torrijos')}`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}${ROUTES.DIRECTORY_HOME}`, lastModified: STATIC_DATE, changeFrequency: 'weekly', priority: 0.8 },

  { url: `${BASE}/community`, lastModified: STATIC_DATE, changeFrequency: 'hourly', priority: 0.8 },
  { url: `${BASE}/island-hopping`, lastModified: STATIC_DATE, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE}/commute`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE}/ports`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE}/ferry-schedule`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.9 },
  { url: `${BASE}/just-landed`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/things-to-do`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.9 },
  { url: `${BASE}/moriones-festival`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.9 },
  { url: `${BASE}/island-life`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE}/island-life/palengke`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE}/island-life/tides`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.6 },
  { url: `${BASE}/island-life/outages`, lastModified: STATIC_DATE, changeFrequency: 'hourly', priority: 0.7 },
  { url: `${BASE}/island-life/skills`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE}/my-barangay`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE}/my-barangay/board`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.6 },
  { url: `${BASE}/my-barangay/lost-found`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.6 },
  { url: `${BASE}/my-barangay/calamity`, lastModified: STATIC_DATE, changeFrequency: 'hourly', priority: 0.7 },
  { url: `${BASE}/my-barangay/ofw`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.6 },
  { url: `${BASE}/my-barangay/paluwagan`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.6 },

  { url: `${BASE}/island-life/gas-prices`, lastModified: STATIC_DATE, changeFrequency: 'hourly', priority: 0.7 },
  { url: `${BASE}/live-market`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE}/live-selling`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE}/best-of-boac-monthly-spotlight`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/advanced-search-filters`, lastModified: STATIC_DATE, changeFrequency: 'weekly', priority: 0.5 },
  { url: `${BASE}/post`, lastModified: STATIC_DATE, changeFrequency: 'daily', priority: 0.5 },

  { url: `${BASE}/faq`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/about`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/contact`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.4 },
  { url: `${BASE}/profile`, lastModified: STATIC_DATE, changeFrequency: 'weekly', priority: 0.4 },
  { url: `${BASE}/policies`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.3 },
  { url: `${BASE}/privacy-policy-data-rights`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.3 },
  { url: `${BASE}/help-community-guidelines`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.4 },
  { url: `${BASE}/island-hopping/list`, lastModified: STATIC_DATE, changeFrequency: 'weekly', priority: 0.5 },
];

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  let listingRoutes: MetadataRoute.Sitemap = [];
  let jobRoutes: MetadataRoute.Sitemap = [];
  let eventRoutes: MetadataRoute.Sitemap = [];
  let gemRoutes: MetadataRoute.Sitemap = [];
  let businessRoutes: MetadataRoute.Sitemap = [];
  let newsRoutes: MetadataRoute.Sitemap = [];

  try {
    // Dynamic: marketplace listings
    const { data: listings } = await supabase
      .from('listings')
      .select('id, updated_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(500);

    listingRoutes = (listings ?? [])
      .filter(l => l.id)
      .map(l => ({
        url: `${BASE}/marketplace/${l.id}`,
        lastModified: l.updated_at ? new Date(l.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

    // Dynamic: job postings
    const { data: jobs } = await supabase
      .from('jobs')
      .select('slug, updated_at')
      .gt('expires_at', new Date().toISOString())
      .order('updated_at', { ascending: false })
      .limit(300);

    jobRoutes = (jobs ?? [])
      .filter(j => j.slug)
      .map(j => ({
        url: `${BASE}/jobs/${j.slug}`,
        lastModified: j.updated_at ? new Date(j.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));

    // Dynamic: events
    const { data: events } = await supabase
      .from('events')
      .select('id, updated_at')
      .order('updated_at', { ascending: false })
      .limit(200);

    eventRoutes = (events ?? []).map(e => ({
      url: `${BASE}/events/${e.id}`,
      lastModified: e.updated_at ? new Date(e.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Dynamic: gems
    const { data: gems } = await supabase
      .from('gems')
      .select('id, updated_at')
      .order('updated_at', { ascending: false })
      .limit(200);

    gemRoutes = (gems ?? []).map(g => ({
      url: `${BASE}/gems/${g.id}`,
      lastModified: g.updated_at ? new Date(g.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Dynamic: business directory
    const { data: businesses } = await supabase
      .from('business_profiles')
      .select('id, updated_at')
      .order('updated_at', { ascending: false })
      .limit(300);

    businessRoutes = (businesses ?? []).map(b => ({
      url: `${BASE}${ROUTES.BUSINESS_PROFILE(b.id)}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Dynamic: news pages
    const { data: news } = await supabase
      .from('news')
      .select('slug, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(200);

    newsRoutes = (news ?? []).filter(n => n.slug).map(n => ({
      url: `${BASE}/news/${n.slug}`,
      lastModified: n.published_at ? new Date(n.published_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));  } catch (error) {
    console.error('Error fetching dynamic sitemap routes:', error);
    // If dynamic fetch fails, we still return at least the STATIC_ROUTES
  }

  return [
    ...STATIC_ROUTES,
    ...listingRoutes,
    ...jobRoutes,
    ...eventRoutes,
    ...gemRoutes,
    ...businessRoutes,
    ...newsRoutes,
  ];
}
