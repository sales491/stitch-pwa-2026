import type { Metadata } from 'next';
import { getGasPrices } from '@/app/actions/gas-prices';
import GasPricesClientShell from './GasPricesClientShell';

export const metadata: Metadata = {
    title: 'Gas Prices — Marinduque',
    description: 'Community-sourced local fuel prices across Marinduque towns. Check real-time gas prices for Boac, Gasan, Mogpog, Santa Cruz, Torrijos, and Buenavista.',
    keywords: ['gas prices Marinduque', 'fuel prices Philippines', 'petrol Boac', 'diesel Marinduque', 'local gas price'],
    openGraph: {
        title: 'Local Gas Prices — Marinduque',
        description: 'See today\'s crowd-sourced fuel prices by town across Marinduque.',
        url: 'https://marinduquemarket.com/island-life/gas-prices',
    },
    alternates: { canonical: 'https://marinduquemarket.com/island-life/gas-prices' },
};

export const dynamic = 'force-dynamic';

export default async function GasPricesPage() {
    const initialPrices = await getGasPrices('Boac');
    return <GasPricesClientShell initialPrices={initialPrices} initialMunicipality="Boac" />;
}
