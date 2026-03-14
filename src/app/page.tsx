import { Suspense } from 'react';
import MarinduqueConnectHomeFeed from '@/components/MarinduqueConnectHomeFeed';
import HomeAlertBanner from '@/components/HomeAlertBanner';
import { getLiveHubItems } from '@/lib/hub-data';

// ISR: serve cached HTML from Vercel edge, rebuild in background every 60s
// Replaces force-dynamic which was causing ~2.3s TTFB on every request
export const revalidate = 60;

export default async function Home() {
  const liveItems = await getLiveHubItems();
  return (
    <MarinduqueConnectHomeFeed
      initialItems={liveItems}
      alertBanner={
        <Suspense fallback={null}>
          <HomeAlertBanner />
        </Suspense>
      }
    />
  );
}
