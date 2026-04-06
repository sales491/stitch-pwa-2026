import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_MARKETPLACE } from '@/utils/seo';
import { createClient } from '@/utils/supabase/server';
import ClientFeed from './ClientFeed';
import SeoTextBlock from '@/components/SeoTextBlock';

export const metadata: Metadata = {
    title: 'Marinduque Classifieds Marketplace',
    description: 'Mag-bilihan at mag-bentahan sa Marinduque — furniture, electronics, damit, sasakyan, at iba pa. Browse active listings from sellers across all six municipalities.',
    keywords: ['buy and sell Marinduque', 'classifieds Philippines', 'Marinduque market', 'secondhand items Marinduque', 'local marketplace Boac', ...TAGALOG_KEYWORDS_MARKETPLACE],
    openGraph: {
        title: 'Marinduque Classifieds Marketplace',
        description: 'Browse local buy-and-sell listings across all 6 municipalities of Marinduque.',
        url: 'https://marinduquemarket.com/marketplace',
    },
    alternates: hreflangAlternates('/marketplace'),
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

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: metadata.openGraph?.title || 'Marinduque Classifieds Marketplace',
                    description: metadata.openGraph?.description || 'Browse local buy-and-sell listings across all 6 municipalities of Marinduque.',
                    url: 'https://marinduquemarket.com/marketplace'
                }) }}
            />
            <ClientFeed initialListings={initialListings ?? []} />
            <SeoTextBlock heading="About the Marinduque Marketplace">
                <p>The Marinduque Marketplace is the island's largest online buy-and-sell platform. Residents from all six municipalities — Boac, Mogpog, Gasan, Santa Cruz, Torrijos, and Buenavista — post items for sale ranging from secondhand electronics and furniture to vehicles, agricultural products, and daily commodities.</p>
                <p>Unlike Facebook groups, listings here are organized, searchable by category and town, and include seller contact information and community vouch ratings. Prices are in Philippine Pesos (PHP) and most transactions are conducted face-to-face within Marinduque, with payments via cash or GCash.</p>
            </SeoTextBlock>
        </>
    );
}
