import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_BARANGAY } from '@/utils/seo';
import Link from 'next/link';
import { getMyGroups } from '@/app/actions/paluwagan';
import PaluwaganGroupCard from '@/components/PaluwaganGroupCard';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Paluwagan — Digital Savings Circles | Marinduque',
    description: 'Join or create a digital paluwagan (rotating savings group) with friends and family in Marinduque. Manage your group savings digitally — safe, transparent, and community-driven.',
    keywords: ['paluwagan Marinduque', 'digital savings Philippines', 'rotating savings group', 'community savings Marinduque', 'paluwagan online', ...TAGALOG_KEYWORDS_BARANGAY],
    openGraph: {
        title: 'Paluwagan — Marinduque Market Hub',
        description: 'Digital rotating savings groups for the Marinduque community. Create or join a paluwagan with friends and family.',
        url: 'https://marinduquemarket.com/my-barangay/paluwagan',
    },
    alternates: hreflangAlternates('/my-barangay/paluwagan'),
};

export const dynamic = 'force-dynamic';

export default async function PaluwaganPage() {
    const groups = await getMyGroups();

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            <PageHeader title="Paluwagan" subtitle="My Barangay" emoji="💰" />

            {/* Action buttons */}
            <div className="px-4 pt-4 grid grid-cols-2 gap-3">
                <Link
                    href="/my-barangay/paluwagan/new"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#C62828] text-white font-bold py-3 text-sm hover:bg-[#B71C1C] transition-colors"
                >
                    <span>+ New Group</span>
                </Link>
                <Link
                    href="/my-barangay/paluwagan/join"
                    className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] font-bold py-3 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                    <span>Join a Group</span>
                </Link>
            </div>

            {/* Groups list */}
            <div className="px-4 mt-4 space-y-3">
                {groups.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-400 dark:text-slate-500 text-sm">No paluwagan groups yet.</p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Create one to get started!</p>
                    </div>
                ) : (
                    groups.map((group: any) => (
                        <PaluwaganGroupCard key={group.id} group={group} />
                    ))
                )}
            </div>
        </main>
    );
}
