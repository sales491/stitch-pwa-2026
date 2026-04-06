import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_OFW } from '@/utils/seo';
import { getExchangeRates, getRemittanceCenters } from '@/app/actions/ofw';
import OFWDisplay from '@/components/OFWDisplay';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'OFW Corner — Remittance & Exchange Rates',
    description: 'Para sa mga OFW at pamilya sa Marinduque — live exchange rates para sa USD, SAR, AED, SGD, at iba pa. Hanapin ang mga remittance centers sa Marinduque.',
    keywords: ['OFW Marinduque', 'peso exchange rate Philippines', 'remittance Marinduque', 'Western Union Boac', 'dollar rate today Philippines', ...TAGALOG_KEYWORDS_OFW],
    openGraph: {
        title: 'OFW Corner — Marinduque',
        description: 'Live exchange rates and remittance centers for Marinduque OFWs and families.',
    },
    alternates: hreflangAlternates('/my-barangay/ofw'),
};

export const dynamic = 'force-dynamic';

export default async function OFWCornerPage() {
    const [rates, centers] = await Promise.all([
        getExchangeRates(),
        getRemittanceCenters(),
    ]);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            <PageHeader title="OFW Corner" subtitle="My Barangay" emoji="✈️" />

            <OFWDisplay rates={rates} centers={centers} />
        </main>
    );
}
