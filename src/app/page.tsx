import MarinduqueConnectHomeFeed from '@/components/MarinduqueConnectHomeFeed';
import { getLiveHubItems } from '@/lib/hub-data';

export default async function Home() {
  const liveItems = await getLiveHubItems();
  return <MarinduqueConnectHomeFeed initialItems={liveItems} />;
}
