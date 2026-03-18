import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import ClientFeed from './ClientFeed';

export const metadata: Metadata = {
    title: 'Marinduque Classifieds Marketplace',
    description: 'Buy and sell items locally in Marinduque — furniture, electronics, clothes, vehicles, and more. Browse active listings from sellers in Boac, Gasan, Mogpog, Santa Cruz, Torrijos, and Buenavista.',
    keywords: ['buy and sell Marinduque', 'classifieds Philippines', 'Marinduque market', 'secondhand items Marinduque', 'local marketplace Boac'],
    openGraph: {
        title: 'Marinduque Classifieds Marketplace',
        description: 'Browse local buy-and-sell listings across all 6 municipalities of Marinduque.',
        url: 'https://marinduquemarket.com/marketplace',
    },
    alternates: { canonical: 'https://marinduquemarket.com/marketplace' },
};

export const revalidate = 0; // Always dynamic — listings change frequently

export default async function MarketplacePage() {
    const supabase = await createClient();

    // Server-render page 0 — users see listings instantly without a loading spinner
    const { data: initialListings } = await supabase
        .from('listings')
        .select('id, slug, title, price_value, town, category, images, seller_id, user_id')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(0, 9);

    return <ClientFeed initialListings={initialListings ?? []} />;
}
