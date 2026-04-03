import type { Metadata } from 'next';
import { getWeekTides } from '@/app/actions/tides';
import TidesDisplay from '@/components/TidesDisplay';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Tides & Fishing Conditions — Marinduque',
    description: 'Daily tide times, moon phase, sunrise and sunset, and peak fishing windows for Marinduque Island waters. Plan your fishing trip with accurate solunar data.',
    keywords: ['tide times Marinduque', 'fishing conditions Philippines', 'solunar fishing Marinduque', 'moon phase fishing', 'high tide Boac'],
    openGraph: {
        title: 'Tides & Fishing Conditions — Marinduque',
        description: 'Daily tide predictions and peak fishing windows for Marinduque island.',
        url: 'https://marinduquemarket.com/island-life/tides',
    },
    alternates: { canonical: 'https://marinduquemarket.com/island-life/tides' },
};

export const dynamic = 'force-dynamic';

export default async function TidesPage() {
    const weekData = await getWeekTides();

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            <PageHeader title="Tides & Fishing" subtitle="Island Life" emoji="🌊" />

            <TidesDisplay weekData={weekData} />
        </main>
    );
}
