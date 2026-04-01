import type { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

const BASE = 'https://marinduquemarket.com';

// Static routes with priorities & change frequencies
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: `${BASE}/marketplace`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
  { url: `${BASE}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: `${BASE}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: `${BASE}/gems`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  { url: `${BASE}/directory`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },

  { url: `${BASE}/community`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
  { url: `${BASE}/island-hopping`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE}/commute`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE}/ports`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE}/island-life`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE}/island-life/palengke`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE}/island-life/tides`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
  { url: `${BASE}/island-life/outages`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.7 },
  { url: `${BASE}/island-life/skills`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE}/my-barangay`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE}/my-barangay/board`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
  { url: `${BASE}/my-barangay/lost-found`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
  { url: `${BASE}/my-barangay/calamity`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.7 },
  { url: `${BASE}/my-barangay/ofw`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },

  { url: `${BASE}/best-of-boac-monthly-spotlight`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },


  { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  { url: `${BASE}/policies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  { url: `${BASE}/privacy-policy-data-rights`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  { url: `${BASE}/help-community-guidelines`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
];

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  let listingRoutes: MetadataRoute.Sitemap = [];
  let jobRoutes: MetadataRoute.Sitemap = [];
  let eventRoutes: MetadataRoute.Sitemap = [];
  let gemRoutes: MetadataRoute.Sitemap = [];
  let businessRoutes: MetadataRoute.Sitemap = [];

  try {
    // Dynamic: marketplace listings
    const { data: listings } = await supabase
      .from('listings')
      .select('slug, updated_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(500);

    listingRoutes = (listings ?? [])
      .filter(l => l.slug)
      .map(l => ({
        url: `${BASE}/listing/${l.slug}`,
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
      .eq('is_verified', true)
      .order('updated_at', { ascending: false })
      .limit(300);

    businessRoutes = (businesses ?? []).map(b => ({
      url: `${BASE}/directory/${b.id}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
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
  ];
}
