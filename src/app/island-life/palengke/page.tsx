import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_ISLAND_LIFE } from '@/utils/seo';
import { createClient } from '@/utils/supabase/server';
import { getPalengkePrices } from '@/app/actions/palengke';
import { MUNICIPALITIES, Municipality } from '@/lib/palengke-constants';
import PalengkeDisplay from '@/components/PalengkeDisplay';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Palengke Prices — Live Market Prices',
    description: "Today's fish, produce, and meat prices from palengke markets across all six Marinduque municipalities. Updated daily by local vendors.",
    keywords: ['palengke prices Marinduque', 'market prices Philippines', 'fish prices Boac', 'produce prices Marinduque', 'local market Marinduque', ...TAGALOG_KEYWORDS_ISLAND_LIFE],
    openGraph: {
        title: 'Palengke Prices — Marinduque Live Market',
        description: "Live fish, produce, and meat prices from Marinduque's local markets.",
        url: 'https://marinduquemarket.com/island-life/palengke',
    },
    alternates: hreflangAlternates('/island-life/palengke'),
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function PalengkePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const defaultMuni: Municipality = 'Boac';
    const initialPrices = await getPalengkePrices(defaultMuni);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Market',
                    name: metadata.openGraph?.title || 'Palengke Prices — Marinduque',
                    description: metadata.openGraph?.description || 'Live fish, produce, and meat prices from Marinduque.',
                    url: 'https://marinduquemarket.com/island-life/palengke',
                    address: {
                        '@type': 'AdministrativeArea',
                        name: 'Marinduque'
                    }
                }) }}
            />
            <PageHeader title="Palengke Vendors" subtitle="Island Life" emoji="🐟" />

            {/* Display */}
            <PalengkeDisplay
                initialMuni={defaultMuni}
                initialPrices={initialPrices}
                currentUserId={user?.id}
                isLoggedIn={!!user}
            />
        </main>
    );
}
