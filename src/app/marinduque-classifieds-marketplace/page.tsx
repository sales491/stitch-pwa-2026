import MarinduqueClassifiedsMarketplace from '@/components/MarinduqueClassifiedsMarketplace';
import { createClient } from '@/utils/supabase/server';
import type { Listing } from '@/data/listings';

export default async function Page() {
  const supabase = await createClient();
  const { data: rawListings } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  // Normalize Supabase rows to local Listing shape for type safety
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listings: Listing[] = (rawListings ?? []).map((row: any) => ({
    id: row.id ?? 0,
    slug: row.slug ?? '',
    title: row.title ?? '',
    price: row.price ?? '',
    priceValue: row.price_value ?? 0,
    category: row.category ?? '',
    town: row.town ?? '',
    postedAgo: row.posted_ago ?? '',
    postedDate: row.posted_date ?? '',
    img: row.img ?? '',
    images: row.images ?? [],
    alt: row.title ?? '',
    description: row.description ?? '',
    condition: row.condition ?? 'Good',
    seller: row.seller ?? { name: '', avatar: '', memberSince: '', responseRate: '', phone: '' },
    seo: row.seo ?? { title: '', description: '', keywords: [] },
  }));

  return <MarinduqueClassifiedsMarketplace initialListings={listings} />;
}
