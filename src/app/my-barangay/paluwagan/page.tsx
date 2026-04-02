'use client';

import Link from 'next/link';
import { getMyGroups } from '@/app/actions/paluwagan';
import PaluwaganGroupCard from '@/components/PaluwaganGroupCard';
import BackButton from '@/components/BackButton';

export const metadata = {
    title: 'Paluwagan — Marinduque Market Hub',
    description: 'Manage your rotating savings group digitally. Create or join a paluwagan with friends and family.',
};

export const dynamic = 'force-dynamic';

export default async function PaluwaganPage() {
    const groups = await getMyGroups();

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03] px-4 pt-3 pb-3">
                <BackButton />
                <div>
                    <p className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1">💰 Paluwagan</p>
                    <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] pl-1">My Barangay</p>
                </div>
            </header>
            {/* Header */}
            <div className="bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 px-4 pt-5 pb-6 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">💰</span>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">Paluwagan</h1>
                        <p className="text-yellow-100 text-xs font-medium">Rotating savings group tracker</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                    {[
                        { emoji: '🔒', label: 'Private' },
                        { emoji: '🔄', label: 'Rotating' },
                        { emoji: '📊', label: 'Tracked' },
                    ].map(({ emoji, label }) => (
                        <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl px-2 py-2 text-center">
                            <p className="text-lg">{emoji}</p>
                            <p className="text-[10px] font-black text-white/80 mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

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
