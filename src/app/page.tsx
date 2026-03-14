import ReactDOM from 'react-dom';
import MarinduqueConnectHomeFeed from '@/components/MarinduqueConnectHomeFeed';
import HomeAlertBanner from '@/components/HomeAlertBanner';
import { getLiveHubItems } from '@/lib/hub-data';

// Run at Vercel's global edge — zero cold starts, instant TTFB from CDN cache
export const runtime = 'edge';

// ISR: rebuild cached HTML in the background every 60s
export const revalidate = 60;

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
  return (
    <MarinduqueConnectHomeFeed
      initialItems={liveItems}
      alertBanner={<HomeAlertBanner />}
    />
  );
}
