import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getOutageReports } from '@/app/actions/outages';
import OutageFeed from '@/components/OutageFeed';

export const metadata = {
    title: 'Outage Reports — Marinduque Market Hub',
    description: 'Community-reported power and water outages across Marinduque Island.',
};

export const dynamic = 'force-dynamic';

export default async function OutagesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const initialReports = await getOutageReports({ status: 'active', page: 0 });

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03] px-4 pt-3 pb-3">
                <Link href="/island-life" className="text-slate-600 dark:text-white/60 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">arrow_back</span>
                </Link>
                <div>
                    <p className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1">⚡ Outage Reports</p>
                    <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] pl-1">Island Life</p>
                </div>
            </header>
            {/* Gradient hero */}
            <div className="bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 px-4 pt-5 pb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-4xl">⚡</span>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">Outage Reports</h1>
                        <p className="text-yellow-100 text-xs font-medium">Community-reported power &amp; water outages</p>
                    </div>
                </div>
                <p className="text-white text-[11px] mt-2 leading-relaxed max-w-sm">
                    Report and track power &amp; water outages across Marinduque. Reports are community-sourced — mark resolved when service returns.
                </p>
            </div>

            <OutageFeed initialReports={initialReports} userId={user?.id ?? null} />
        </main>
    );
}
