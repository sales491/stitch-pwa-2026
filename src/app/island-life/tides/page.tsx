import Link from 'next/link';
import { getWeekTides } from '@/app/actions/tides';
import TidesDisplay from '@/components/TidesDisplay';

export const metadata = {
    title: 'Tides & Fishing — Marinduque Market Hub',
    description: 'Daily tide times, moon phase, sunrise/sunset, and peak fishing windows for Marinduque Island.',
};

export const dynamic = 'force-dynamic';

export default async function TidesPage() {
    const weekData = await getWeekTides();

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-700 via-cyan-700 to-teal-700 px-4 pt-10 pb-6 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, white 1px, transparent 1px)', backgroundSize: '18px 18px' }}
                />
                <Link href="/island-life" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-xs font-bold mb-4 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Island Life
                </Link>
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-4xl">🌊</span>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">Tides &amp; Fishing</h1>
                        <p className="text-cyan-200 text-xs font-medium">Tide times · Moon · Sunrise · Peak fishing windows</p>
                    </div>
                </div>
                <p className="text-white/60 text-[11px] mt-2 leading-relaxed max-w-sm">
                    Daily tide predictions, solunar fishing activity, and astronomical data for Marinduque&apos;s waters.
                </p>
            </div>

            <TidesDisplay weekData={weekData} />
        </main>
    );
}
