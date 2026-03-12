import { Suspense } from 'react';
import MarinduqueConnectHomeFeed from '@/components/MarinduqueConnectHomeFeed';
import HomeAlertBanner from '@/components/HomeAlertBanner';
import { getLiveHubItems } from '@/lib/hub-data';

export const dynamic = 'force-dynamic';

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
