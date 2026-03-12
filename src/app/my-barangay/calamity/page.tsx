import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getCalamityAlerts } from '@/app/actions/calamity';
import CalamityFeed from '@/components/CalamityFeed';

export const metadata = {
    title: 'Calamity Board — Marinduque Market Hub',
    description: 'Community calamity alerts: typhoons, floods, earthquakes, fires, and road closures across Marinduque Island.',
};

export const dynamic = 'force-dynamic';

export default async function CalamityPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const initialAlerts = await getCalamityAlerts({ status: 'active', page: 0 });

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Header */}
            <div className="bg-gradient-to-br from-red-600 via-rose-600 to-orange-600 px-4 pt-10 pb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <Link href="/my-barangay" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-xs font-bold mb-4 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    My Barangay
                </Link>
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-4xl">🚨</span>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">Calamity Board</h1>
                        <p className="text-rose-200 text-xs font-medium">Community alerts · Stay safe</p>
                    </div>
                </div>
                <p className="text-white/60 text-[11px] mt-2 leading-relaxed max-w-sm">
                    Report and track typhoons, floods, earthquakes, fires, and road closures across Marinduque. Community-sourced — mark resolved when the situation clears.
                </p>

                {/* Disclaimer banner */}
                <div className="mt-3 bg-black/20 rounded-xl px-3 py-2 text-[10px] text-white/80 font-medium">
                    ⚠️ Community-sourced reports. Always follow official NDRRMC/PAGASA advisories. For emergencies call <strong>911</strong>.
                </div>
            </div>

            <CalamityFeed initialAlerts={initialAlerts} userId={user?.id ?? null} />
        </main>
    );
}
