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
            {/* Header */}
            <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700 px-4 pt-10 pb-6 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />
                <Link href="/my-barangay" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-xs font-bold mb-4 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    My Barangay
                </Link>
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
