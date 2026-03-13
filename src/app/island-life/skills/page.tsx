import { createClient } from '@/utils/supabase/server';
import { getSkillListings } from '@/app/actions/skills';
import SkillsDisplay from '@/components/SkillsDisplay';
import Link from 'next/link';

export const metadata = {
    title: 'Skills Exchange — Island Life | Marinduque Market Hub',
    description: 'Find locals offering skills and services in Marinduque — teaching, repairs, crafts, food, tech, health and more.',
};

export const revalidate = 300;

export default async function SkillsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const initialListings = await getSkillListings('Boac');

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03] px-4 pt-3 pb-3">
                <Link href="/island-life" className="text-slate-600 dark:text-white/60 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">arrow_back</span>
                </Link>
                <div>
                    <p className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1">🛠️ Skills Exchange</p>
                    <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] pl-1">Island Life</p>
                </div>
            </header>
            {/* Purple gradient header */}
            <div className="bg-gradient-to-br from-purple-700 via-violet-700 to-purple-800 px-4 pt-5 pb-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">🛠️</span>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">Skills Exchange</h1>
                        <p className="text-purple-200 text-xs font-medium">Locals offering skills · 60-day listings</p>
                    </div>
                </div>
                <p className="text-white text-[11px] mt-2 leading-relaxed max-w-sm">
                    Find someone who can teach, fix, cook, or create. Post your own skills and let the community find you.
                </p>
            </div>

            <SkillsDisplay
                initialListings={initialListings}
                currentUserId={user?.id}
                isLoggedIn={!!user}
            />
        </main>
    );
}
