'use client';

import type { Metadata } from 'next';
import { getWeekTides } from '@/app/actions/tides';
import TidesDisplay from '@/components/TidesDisplay';
import BackButton from '@/components/BackButton';

export const metadata: Metadata = {
    title: 'Tides & Fishing Conditions — Marinduque',
    description: 'Daily tide times, moon phase, sunrise and sunset, and peak fishing windows for Marinduque Island waters. Plan your fishing trip with accurate solunar data.',
    keywords: ['tide times Marinduque', 'fishing conditions Philippines', 'solunar fishing Marinduque', 'moon phase fishing', 'high tide Boac'],
    openGraph: {
        title: 'Tides & Fishing Conditions — Marinduque',
        description: 'Daily tide predictions and peak fishing windows for Marinduque island.',
        url: 'https://marinduquemarket.com/island-life/tides',
    },
    alternates: { canonical: 'https://marinduquemarket.com/island-life/tides' },
};

export const dynamic = 'force-dynamic';

export default async function TidesPage() {
    const weekData = await getWeekTides();

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03] px-4 pt-3 pb-3">
                <BackButton />
                <div>
                    <p className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1">🌊 Tides & Fishing</p>
                    <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] pl-1">Island Life</p>
                </div>
            </header>
            {/* Gradient hero */}
            <div className="bg-gradient-to-br from-blue-700 via-cyan-700 to-teal-700 px-4 pt-5 pb-6 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, white 1px, transparent 1px)', backgroundSize: '18px 18px' }}
                />
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-4xl">🌊</span>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">Tides &amp; Fishing</h1>
                        <p className="text-cyan-200 text-xs font-medium">Tide times · Moon · Sunrise · Peak fishing windows</p>
                    </div>
                </div>
                <p className="text-white text-[11px] mt-2 leading-relaxed max-w-sm">
                    Daily tide predictions, solunar fishing activity, and astronomical data for Marinduque&apos;s waters.
                </p>
            </div>

            <TidesDisplay weekData={weekData} />
        </main>
    );
}
