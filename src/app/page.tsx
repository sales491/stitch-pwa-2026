import ReactDOM from 'react-dom';
import MarinduqueConnectHomeFeed from '@/components/MarinduqueConnectHomeFeed';
import HomeAlertBanner from '@/components/HomeAlertBanner';
import PopularOnMarketHub from '@/components/PopularOnMarketHub';
import { getLiveHubItems } from '@/lib/hub-data';
import { getLiveSellingFeed } from '@/lib/live-selling';
import { createClient } from '@/utils/supabase/server';

// Run at Vercel's global edge — zero cold starts, instant TTFB from CDN cache
export const runtime = 'edge';

// ISR: rebuild cached HTML in the background every 60s
export const revalidate = 0; // Always dynamic — home feed content changes frequently

export default async function Home() {
  // Preload the LCP image from the server component so the browser gets
  // a <link rel="preload" fetchpriority="high"> in the <head> — the
  // priority prop on next/image inside a 'use client' component doesn't
  // emit this correctly when combined with edge runtime.
  ReactDOM.preload('/_next/image?url=%2Fimages%2Fmarinduque-island-silhouette.png&w=256&q=75', {
    as: 'image',
    fetchPriority: 'high',
  });

  const liveItems = await getLiveHubItems();
  const { liveNow } = await getLiveSellingFeed();

  // Fetch 5 newest arrivals for SEO indexing carousel
  const supabase = await createClient();
  const { data: newArrivalsData } = await supabase
    .from('listings')
    .select('id, title, price_value, town, images')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(5);

  const newArrivals = (newArrivalsData || []).map((l: any) => ({
    id: l.id,
    title: l.title,
    price_value: l.price_value,
    town: l.town,
    image: l.images?.[0] || null,
  }));

  return (
    <MarinduqueConnectHomeFeed
      initialItems={liveItems}
      alertBanner={<HomeAlertBanner />}
      newArrivals={newArrivals}
      popularSection={<PopularOnMarketHub />}
      liveSellersActive={liveNow.length > 0}
    />
  );
}
