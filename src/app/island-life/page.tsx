import Link from 'next/link';
import BackButton from '@/components/BackButton';

const FEATURES = [
    {
        emoji: '🐟',
        label: 'Palengke',
        sub: 'Today\'s fish, produce & meat prices from local markets',
        href: '/island-life/palengke',
        color: 'from-orange-500 to-amber-500',
        bg: 'bg-orange-50 dark:bg-orange-950/30',
        border: 'border-orange-100 dark:border-orange-900/40',
        badge: 'Live',
    },
    {
        emoji: '⛽',
        label: 'Gas Prices',
        sub: 'Community-sourced fuel prices by town',
        href: '/island-life/gas-prices',
        color: 'from-red-500 to-orange-500',
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-100 dark:border-red-900/40',
        badge: 'Live',
    },
    {
        emoji: '🌊',
        label: 'Tides & Fishing',
        sub: 'Tide times, moon phases & fishing conditions',
        href: '/island-life/tides',
        color: 'from-blue-500 to-cyan-500',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-100 dark:border-blue-900/40',
        badge: 'Live',
    },
    {

        emoji: '⚡',
        label: 'Outage Reports',
        sub: 'Community-reported power & water outages',
        href: '/island-life/outages',
        color: 'from-yellow-500 to-orange-500',
        bg: 'bg-yellow-50 dark:bg-yellow-950/30',
        border: 'border-yellow-100 dark:border-yellow-900/40',
        badge: 'Live',
    },
    {
        emoji: '🛠️',
        label: 'Skills Exchange',
        sub: 'Find local skills — teaching, repairs, crafts & more',
        href: '/island-life/skills',
        color: 'from-purple-500 to-violet-500',
        bg: 'bg-purple-50 dark:bg-purple-950/30',
        border: 'border-purple-100 dark:border-purple-900/40',
        badge: 'Live',
    },
    {
        emoji: '🏪',
        label: 'Business Directory',
        sub: 'Browse local Marinduque businesses',
        href: '/directory',
        color: 'from-slate-500 to-zinc-500',
        bg: 'bg-slate-50 dark:bg-zinc-900/50',
        border: 'border-slate-100 dark:border-zinc-800',
        badge: 'Live',
    },
];

export const metadata = {
    title: 'Island Life — Marinduque Market Hub',
    description: 'Daily tools for island living: market prices, tides, outage reports, skills exchange and more.',
};

export default function IslandLifePage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03] px-4 pt-3 pb-3">
                <BackButton />
                <div>
                    <p className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1">🌿 Island Life</p>
                    <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] pl-1">Daily tools for Marinduque locals</p>
                </div>
            </header>
            {/* Gradient hero */}
            <div className="bg-gradient-to-br from-emerald-700 via-green-700 to-teal-800 px-4 pt-5 pb-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">🌿</span>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">Island Life</h1>
                        <p className="text-emerald-200 text-xs font-medium">Daily tools for Marinduque locals</p>
                    </div>
                </div>
            </div>

            {/* Feature Grid */}
            <div className="px-4 pt-5 space-y-3">
                {FEATURES.map((f) => (
                    <Link
                        key={f.href}
                        href={f.href}
                        className={`flex items-center gap-4 ${f.bg} border ${f.border} rounded-2xl px-4 py-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all`}
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl shadow-sm flex-shrink-0`}>
                            {f.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="font-black text-slate-900 dark:text-white text-[14px]">{f.label}</p>
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ${f.badge === 'Live' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-slate-500'}`}>
                                    {f.badge}
                                </span>
                            </div>
                            <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">{f.sub}</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 dark:text-zinc-600 text-[20px] flex-shrink-0">chevron_right</span>
                    </Link>
                ))}
            </div>
        </main>
    );
}
