import Link from 'next/link';

const FEATURES = [
    {
        emoji: '🏘️',
        label: 'Barangay Board',
        sub: 'Posts visible only to your barangay community',
        href: '/my-barangay/board',
        color: 'from-indigo-500 to-blue-500',
        bg: 'bg-indigo-50 dark:bg-indigo-950/30',
        border: 'border-indigo-100 dark:border-indigo-900/40',
        badge: 'Live',
    },
    {
        emoji: '🔍',
        label: 'Lost & Found',
        sub: 'Report lost items, animals & documents across the island',
        href: '/my-barangay/lost-found',
        color: 'from-rose-500 to-pink-500',
        bg: 'bg-rose-50 dark:bg-rose-950/30',
        border: 'border-rose-100 dark:border-rose-900/40',
        badge: 'Live',
    },
    {
        emoji: '🚨',
        label: 'Calamity Board',
        sub: 'Community alerts — typhoons, floods, road conditions',
        href: '/my-barangay/calamity',
        color: 'from-red-500 to-orange-500',
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-100 dark:border-red-900/40',
        badge: 'Live',
    },
    {
        emoji: '💰',
        label: 'Paluwagan',
        sub: 'Manage your rotating savings group digitally',
        href: '/my-barangay/paluwagan',
        color: 'from-yellow-500 to-amber-500',
        bg: 'bg-yellow-50 dark:bg-yellow-950/30',
        border: 'border-yellow-100 dark:border-yellow-900/40',
        badge: 'Live',
    },
    {
        emoji: '✈️',
        label: 'OFW Corner',
        sub: 'Exchange rates, remittance directory & family wishlist',
        href: '/my-barangay/ofw',
        color: 'from-sky-500 to-blue-500',
        bg: 'bg-sky-50 dark:bg-sky-950/30',
        border: 'border-sky-100 dark:border-sky-900/40',
        badge: 'Live',
    },
];

export const metadata = {
    title: 'My Barangay — Marinduque Market Hub',
    description: 'Hyperlocal community tools: barangay board, lost & found, calamity alerts, paluwagan tracker and OFW corner.',
};

export default function MyBarangayPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-700 via-blue-700 to-violet-800 px-4 pt-10 pb-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <Link href="/" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-xs font-bold mb-4 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Home
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">🏘️</span>
                    <div>
                        <h1 className="text-2xl font-black text-white leading-tight">My Barangay</h1>
                        <p className="text-indigo-200 text-xs font-medium">Community tools for Marinduque locals</p>
                    </div>
                </div>
                <p className="text-white/60 text-[11px] mt-3 leading-relaxed max-w-sm">
                    Set your barangay in your profile to unlock hyperlocal features visible only to your community.
                </p>
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

            {/* Profile CTA */}
            <div className="mx-4 mt-5 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl px-4 py-4 flex items-center gap-3">
                <span className="text-2xl">📍</span>
                <div className="flex-1">
                    <p className="text-[13px] font-black text-indigo-900 dark:text-indigo-200">Set your barangay</p>
                    <p className="text-[11px] text-indigo-500 dark:text-indigo-400">Go to your profile settings to enable hyperlocal features.</p>
                </div>
                <Link href="/profile/edit" className="text-[11px] font-black text-white bg-indigo-600 px-3 py-1.5 rounded-xl flex-shrink-0">
                    Set Now
                </Link>
            </div>
        </main>
    );
}
