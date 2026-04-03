import type { Metadata } from 'next';
import { getExchangeRates, getRemittanceCenters } from '@/app/actions/ofw';
import OFWDisplay from '@/components/OFWDisplay';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'OFW Corner — Remittance & Exchange Rates',
    description: 'Live Philippine peso exchange rates for USD, SAR, AED, SGD, and more. Find remittance centers across Marinduque. Essential tools for OFWs and their families.',
    keywords: ['OFW Marinduque', 'peso exchange rate Philippines', 'remittance Marinduque', 'Western Union Boac', 'dollar rate today Philippines'],
    openGraph: {
        title: 'OFW Corner — Marinduque',
        description: 'Live exchange rates and remittance centers for Marinduque OFWs and families.',
    },
    alternates: { canonical: 'https://marinduquemarket.com/my-barangay/ofw' },
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
