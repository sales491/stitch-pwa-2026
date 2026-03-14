import MarinduqueConnectHomeFeed from '@/components/MarinduqueConnectHomeFeed';
import HomeAlertBanner from '@/components/HomeAlertBanner';
import { getLiveHubItems } from '@/lib/hub-data';

// Run at Vercel's global edge — zero cold starts, instant TTFB from CDN cache
export const runtime = 'edge';

// ISR: rebuild cached HTML in the background every 60s
export const revalidate = 60;

export default async function Home() {
  const liveItems = await getLiveHubItems();
  return (
    <MarinduqueConnectHomeFeed
      initialItems={liveItems}
      alertBanner={<HomeAlertBanner />}
    />
  );
}
