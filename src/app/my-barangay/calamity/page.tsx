import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { getCalamityAlerts } from '@/app/actions/calamity';
import CalamityFeed from '@/components/CalamityFeed';

export const metadata: Metadata = {
    title: 'Calamity Board — Emergency Alerts Marinduque',
    description: 'Community calamity and emergency alerts for Marinduque island. Reports on typhoons, floods, earthquakes, fires, and road closures. Always follow official NDRRMC/PAGASA advisories.',
    keywords: ['typhoon Marinduque', 'flood alert Philippines', 'calamity board Marinduque', 'emergency alerts Philippines', 'NDRRMC Marinduque'],
    openGraph: {
        title: 'Calamity Board — Marinduque Emergency Alerts',
        description: 'Community calamity alerts: typhoons, floods, and emergencies in Marinduque.',
    },
    alternates: { canonical: 'https://marinduquemarket.com/my-barangay/calamity' },
};

export const dynamic = 'force-dynamic';

export default async function CalamityPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const initialAlerts = await getCalamityAlerts({ status: 'active', page: 0 });

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03] px-4 pt-3 pb-3">
                <Link href="/my-barangay" className="text-slate-600 dark:text-white/60 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">arrow_back</span>
                </Link>
                <div>
                    <p className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1">🚨 Calamity Board</p>
                    <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] pl-1">My Barangay</p>
                </div>
            </header>
            {/* Header */}
            <div className="bg-gradient-to-br from-red-600 via-rose-600 to-orange-600 px-4 pt-5 pb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-4xl">🚨</span>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">Calamity Board</h1>
                        <p className="text-rose-200 text-xs font-medium">Community alerts · Stay safe</p>
                    </div>
                </div>
                <p className="text-white text-[11px] mt-2 leading-relaxed max-w-sm">
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
