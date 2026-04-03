import Link from 'next/link';
import { getMyGroups } from '@/app/actions/paluwagan';
import PaluwaganGroupCard from '@/components/PaluwaganGroupCard';
import PageHeader from '@/components/PageHeader';

export const metadata = {
    title: 'Paluwagan — Marinduque Market Hub',
    description: 'Manage your rotating savings group digitally. Create or join a paluwagan with friends and family.',
    alternates: {
        canonical: 'https://marinduquemarket.com/my-barangay/paluwagan',
        languages: {
            'en-PH': 'https://marinduquemarket.com/my-barangay/paluwagan',
            'tl-PH': 'https://marinduquemarket.com/my-barangay/paluwagan',
        }
    }
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
                    className="flex flex-col items-center gap-1.5 bg-amber-500 text-white rounded-2xl py-4 shadow-md hover:bg-amber-600 active:scale-[0.97] transition-all"
                >
                    <span className="material-symbols-outlined text-[28px]">add_circle</span>
                    <span className="text-[12px] font-black uppercase tracking-wider">Create Group</span>
                </Link>
                <Link
                    href="/my-barangay/paluwagan/join"
                    className="flex flex-col items-center gap-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 rounded-2xl py-4 shadow-sm hover:shadow-md active:scale-[0.97] transition-all"
                >
                    <span className="material-symbols-outlined text-[28px]">group_add</span>
                    <span className="text-[12px] font-black uppercase tracking-wider">Join with Code</span>
                </Link>
            </div>

            {/* Groups list */}
            <div className="px-4 pt-5 space-y-3">
                {groups.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-4xl mb-4">💰</p>
                        <p className="font-black text-slate-700 dark:text-white text-[15px] mb-1">No paluwagan yet</p>
                        <p className="text-[12px] text-slate-400 dark:text-zinc-500 max-w-xs mx-auto leading-relaxed">
                            Create a group and invite your barkada, or join one using an invite code.
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Your Groups</p>
                        {groups.map(g => (
                            <PaluwaganGroupCard key={g.id} group={g} />
                        ))}
                    </>
                )}
            </div>
        </main>
    );
}
