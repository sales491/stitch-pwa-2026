import { createClient } from '@/utils/supabase/server';
import ClientFeed from './ClientFeed';

export const revalidate = 60; // Serve cached first page; revalidate in background every 60s

export default async function MarketplacePage() {
    const supabase = await createClient();

    // Server-render page 0 — users see listings instantly without a loading spinner
    const { data: initialListings } = await supabase
        .from('listings')
        .select('id, title, price_value, town, images, seller_id, user_id')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(0, 9);

    return <ClientFeed initialListings={initialListings ?? []} />;
}
