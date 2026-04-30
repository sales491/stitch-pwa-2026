import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_BARANGAY } from '@/utils/seo';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'My Barangay — Hyperlocal Community Hub | Marinduque',
    description: 'Ang hyperlocal hub para sa inyong barangay sa Marinduque — bulletin board, lost & found, emergency alerts, OFW corner, at paluwagan. Kumonekta sa inyong komunidad.',
    keywords: ['barangay Marinduque', 'hyperlocal community Philippines', 'barangay board Boac', 'barangay alerts Marinduque', 'local community Marinduque', ...TAGALOG_KEYWORDS_BARANGAY],
    openGraph: {
        title: 'My Barangay — Marinduque',
        description: 'Hyperlocal community tools for your barangay in Marinduque — board, lost & found, alerts, OFW, and paluwagan.',
        url: 'https://marinduquemarket.com/my-barangay',
    },
    alternates: hreflangAlternates('/my-barangay'),
};

const FEATURES = [
    {
        emoji: '🏘️',
        label: 'Barangay Board',
        sub: 'Posts visible only to your barangay community',
        href: '/my-barangay/board',
        color: 'from-indigo-500 to-blue-500',
        bg: 'bg-indigo-50 dark:bg-indigo-950/30',
        border: 'border-indigo-100 dark:border-indigo-900/40',
        badge: 'Live',
    },
    {
        emoji: '🔍',
        label: 'Lost & Found',
        sub: 'Report lost items, animals & documents across the island',
        href: '/my-barangay/lost-found',
        color: 'from-rose-500 to-pink-500',
        bg: 'bg-rose-50 dark:bg-rose-950/30',
        border: 'border-rose-100 dark:border-rose-900/40',
        badge: 'Live',
    },
    {
        emoji: '🚨',
        label: 'Mga Abiso',
        sub: 'Community alerts — typhoons, floods, road conditions',
        href: '/my-barangay/calamity',
        color: 'from-red-500 to-orange-500',
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-100 dark:border-red-900/40',
        badge: 'Live',
    },
    {
        emoji: '✈️',
        label: 'OFW Corner',
        sub: 'Exchange rates, remittance centers & OFW community',
        href: '/my-barangay/ofw',
        color: 'from-sky-500 to-cyan-500',
        bg: 'bg-sky-50 dark:bg-sky-950/30',
        border: 'border-sky-100 dark:border-sky-900/40',
        badge: 'Live',
    },
    {
        emoji: '💰',
        label: 'Paluwagan',
        sub: 'Digital rotating savings groups with friends & family',
        href: '/my-barangay/paluwagan',
        color: 'from-emerald-500 to-teal-500',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        border: 'border-emerald-100 dark:border-emerald-900/40',
        badge: 'Live',
    },
];

export default function MyBarangayHub() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            <PageHeader title="My Barangay" subtitle="Hyperlocal Community Hub" emoji="🏘️" />

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
        </main>
    );
}
