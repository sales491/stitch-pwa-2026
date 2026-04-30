import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_ISLAND_LIFE } from '@/utils/seo';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SeoTextBlock from '@/components/SeoTextBlock';

export const metadata: Metadata = {
    title: 'Island Life — Marinduque Living Hub',
    description: 'Your daily guide to island living in Marinduque — palengke prices, gas prices, tides & fishing, power outage alerts, and local skills exchange. Updated daily by the community.',
    keywords: ['island life Marinduque', 'Marinduque daily living', 'palengke prices', 'gas prices Marinduque', 'tides Marinduque', 'power outage Marinduque', 'skills exchange Marinduque', ...TAGALOG_KEYWORDS_ISLAND_LIFE],
    openGraph: {
        title: 'Island Life — Marinduque',
        description: 'Daily island living hub — palengke prices, gas prices, tides, outages, and skills exchange for Marinduque.',
        url: 'https://marinduquemarket.com/island-life',
    },
    alternates: hreflangAlternates('/island-life'),
};

const FEATURES = [
    {
        emoji: '🐟',
        label: 'Palengke',
        sub: 'Today\'s fish, produce & meat prices from local markets',
        href: '/island-life/palengke',
        color: 'from-orange-500 to-amber-500',
        bg: 'bg-orange-50 dark:bg-orange-950/30',
        border: 'border-orange-100 dark:border-orange-900/40',
        badge: 'Live',
    },
    {
        emoji: '⛽',
        label: 'Gas Prices',
        sub: 'Community-sourced fuel prices by town',
        href: '/island-life/gas-prices',
        color: 'from-red-500 to-orange-500',
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-100 dark:border-red-900/40',
        badge: 'Live',
    },
    {
        emoji: '🌊',
        label: 'Tides & Fishing',
        sub: 'Tide times, moon phases & fishing conditions',
        href: '/island-life/tides',
        color: 'from-cyan-500 to-blue-500',
        bg: 'bg-cyan-50 dark:bg-cyan-950/30',
        border: 'border-cyan-100 dark:border-cyan-900/40',
        badge: 'Live',
    },
    {
        emoji: '⚡',
        label: 'Outages',
        sub: 'Power & water outage reports across the island',
        href: '/island-life/outages',
        color: 'from-yellow-500 to-amber-500',
        bg: 'bg-yellow-50 dark:bg-yellow-950/30',
        border: 'border-yellow-100 dark:border-yellow-900/40',
        badge: 'Live',
    },
    {
        emoji: '🛠️',
        label: 'Skills Exchange',
        sub: 'Find locals offering teaching, repairs, crafts & services',
        href: '/island-life/skills',
        color: 'from-purple-500 to-violet-500',
        bg: 'bg-purple-50 dark:bg-purple-950/30',
        border: 'border-purple-100 dark:border-purple-900/40',
        badge: 'Live',
    },
];

export default function IslandLifeHub() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            <PageHeader title="Island Life" subtitle="Daily Living Hub" emoji="🌴" />

            <div className="px-4 space-y-3">
                {FEATURES.map((f) => (
                    <Link key={f.href} href={f.href}>
                        <div className={`rounded-2xl border ${f.border} ${f.bg} p-4 hover:shadow-md transition-shadow`}>
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">{f.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">{f.label}</h3>
                                        {f.badge && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full">
                                                {f.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">{f.sub}</p>
                                </div>
                                <svg className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <SeoTextBlock heading="About Island Life">
                <p>Island Life is your daily living hub for Marinduque. Check live palengke (wet market) prices for fish, produce, and meat across all six municipalities. Track community-sourced gas prices by town. Plan your fishing trips with accurate tide times, moon phases, and solunar data. Report and track power and water outages in real time. Find local skilled workers offering teaching, repairs, crafts, and services through the Skills Exchange. All data is community-powered and updated daily by Marinduque residents.</p>
            </SeoTextBlock>
        </main>
    );
}
