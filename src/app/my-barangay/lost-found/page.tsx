import Link from 'next/link';
import { getLostFoundPosts } from '@/app/actions/lost-found';
import LostFoundFeed from '@/components/LostFoundFeed';

export const metadata = {
    title: 'Lost & Found — Marinduque Market Hub',
    description: 'Report and find lost items, animals, documents and more across Marinduque Island.',
};

export const dynamic = 'force-dynamic';

export default async function LostFoundPage() {
    const initialPosts = await getLostFoundPosts({ status: 'open', page: 0 });

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03] px-4 pt-3 pb-3">
                <Link href="/my-barangay" className="text-slate-600 dark:text-white/60 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">arrow_back</span>
                </Link>
                <div>
                    <p className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1">🔍 Lost & Found</p>
                    <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] pl-1">My Barangay</p>
                </div>
            </header>
            {/* Header */}
            <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700 px-4 pt-5 pb-6 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-4xl">🔍</span>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">Lost &amp; Found</h1>
                        <p className="text-rose-200 text-xs font-medium">Report lost items, animals &amp; documents</p>
                    </div>
                </div>
                <p className="text-white/60 text-[11px] mt-2 leading-relaxed max-w-sm">
                    Help reunite Marinduque communities with missing belongings. Post a report or browse to see if someone found what you&apos;re looking for.
                </p>
            </div>

            {/* Feed */}
            <LostFoundFeed initialPosts={initialPosts} />
        </main>
    );
}
