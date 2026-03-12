import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getBarangayPosts, getUserBarangay } from '@/app/actions/barangay-board';
import BarangayFeed from '@/components/BarangayFeed';

export const metadata = {
    title: 'Barangay Board — Marinduque Market Hub',
    description: 'Hyperlocal community posts visible only to your barangay.',
};

export const dynamic = 'force-dynamic';

export default async function BarangayBoardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Must be logged in
    if (!user) redirect('/login?next=/my-barangay/board');

    const { barangay, municipality } = await getUserBarangay();

    // User hasn't set their barangay yet — show gate screen
    if (!barangay || !municipality) {
        return (
            <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
                <div className="bg-gradient-to-br from-indigo-700 via-blue-700 to-violet-800 px-4 pt-10 pb-8 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    <Link href="/my-barangay" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-xs font-bold mb-4 transition-colors">
                        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        My Barangay
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">🏘️</span>
                        <div>
                            <h1 className="text-2xl font-black text-white leading-tight">Barangay Board</h1>
                            <p className="text-indigo-200 text-xs font-medium">Posts for your barangay community</p>
                        </div>
                    </div>
                </div>

                {/* Gate — prompt to set barangay */}
                <div className="flex flex-col items-center text-center px-6 pt-16 pb-8">
                    <span className="text-6xl mb-5">📍</span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Set your barangay first</h2>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mb-6">
                        The Barangay Board shows posts only for your community. Add your barangay in your profile settings to unlock it.
                    </p>
                    <Link
                        href="/profile/edit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[14px] px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
                    >
                        Set My Barangay
                    </Link>
                </div>
            </main>
        );
    }

    const initialPosts = await getBarangayPosts(barangay, municipality, 0);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-700 via-blue-700 to-violet-800 px-4 pt-10 pb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <Link href="/my-barangay" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-xs font-bold mb-4 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    My Barangay
                </Link>
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-4xl">🏘️</span>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">Barangay Board</h1>
                        <p className="text-indigo-200 text-xs font-medium">
                            {barangay} · {municipality}
                        </p>
                    </div>
                </div>
                <p className="text-white/60 text-[11px] mt-2 leading-relaxed max-w-sm">
                    A local board just for your community. Posts are visible only to residents of {barangay}.
                </p>
            </div>

            <BarangayFeed
                initialPosts={initialPosts}
                barangay={barangay}
                municipality={municipality}
                currentUserId={user.id}
            />
        </main>
    );
}
