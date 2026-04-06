import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_ISLAND_LIFE } from '@/utils/seo';
import { getGasPrices } from '@/app/actions/gas-prices';
import GasPricesClientShell from './GasPricesClientShell';

export const metadata: Metadata = {
    title: 'Gas Prices — Marinduque',
    description: 'Community-sourced local fuel prices across Marinduque towns. Check real-time gas prices for Boac, Gasan, Mogpog, Santa Cruz, Torrijos, and Buenavista.',
    keywords: ['gas prices Marinduque', 'fuel prices Philippines', 'petrol Boac', 'diesel Marinduque', 'local gas price', ...TAGALOG_KEYWORDS_ISLAND_LIFE],
    openGraph: {
        title: 'Local Gas Prices — Marinduque',
        description: 'See today\'s crowd-sourced fuel prices by town across Marinduque.',
        url: 'https://marinduquemarket.com/island-life/gas-prices',
    },
    alternates: hreflangAlternates('/island-life/gas-prices'),
};

export const dynamic = 'force-dynamic';

export default async function GasPricesPage() {
    const initialPrices = await getGasPrices('Boac');
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebPage',
                    name: 'Local Gas Prices in Marinduque',
                    speakable: {
                        '@type': 'SpeakableSpecification',
                        cssSelector: ['#gas-prices-feed']
                    }
                })}}
            />
            <GasPricesClientShell initialPrices={initialPrices} initialMunicipality="Boac" />
        </>
    );
}
