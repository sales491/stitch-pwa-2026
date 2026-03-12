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
            {/* Header */}
            <div className="bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 px-4 pt-10 pb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <Link href="/island-life" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-xs font-bold mb-4 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Island Life
                </Link>
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-4xl">⚡</span>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">Outage Reports</h1>
                        <p className="text-yellow-100 text-xs font-medium">Community-reported power &amp; water outages</p>
                    </div>
                </div>
                <p className="text-white/60 text-[11px] mt-2 leading-relaxed max-w-sm">
                    Report and track power &amp; water outages across Marinduque. Reports are community-sourced — mark resolved when service returns.
                </p>
            </div>

            <OutageFeed initialReports={initialReports} userId={user?.id ?? null} />
        </main>
    );
}
