'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { getCalamityAlerts, CalamityAlert, CalamityFilters, CalamityType } from '@/app/actions/calamity';
import CalamityCard from './CalamityCard';
import { useAuth } from './AuthProvider';

const MUNICIPALITIES = ['All', 'Boac', 'Gasan', 'Mogpog', 'Sta. Cruz', 'Torrijos', 'Buenavista'];

const TYPE_FILTERS: { value: CalamityType | 'all'; icon: string; label: string }[] = [
    { value: 'all',        icon: '🚨', label: 'All' },
    { value: 'typhoon',    icon: '🌀', label: 'Typhoon' },
    { value: 'flood',      icon: '🌊', label: 'Flood' },
    { value: 'earthquake', icon: '🫨', label: 'Quake' },
    { value: 'fire',       icon: '🔥', label: 'Fire' },
    { value: 'road',       icon: '🚧', label: 'Road' },
    { value: 'other',      icon: '⚠️', label: 'Other' },
];

type Props = { initialAlerts: CalamityAlert[]; userId?: string | null };

export default function CalamityFeed({ initialAlerts, userId }: Props) {
    const { profile } = useAuth() as any;
    const [alerts, setAlerts] = useState<CalamityAlert[]>(initialAlerts);
    const [typeFilter, setTypeFilter] = useState<CalamityType | 'all'>('all');
    const [municipality, setMunicipality] = useState('All');
    const [showResolved, setShowResolved] = useState(false);
    const [hasMore, setHasMore] = useState(initialAlerts.length >= 20);
    const [page, setPage] = useState(0);
    const [isPending, startTransition] = useTransition();

    const canManage = (reportedBy: string | null) =>
        userId === reportedBy || profile?.role === 'admin' || profile?.role === 'moderator';

    const applyFilters = (overrides: Partial<{ type: CalamityType | 'all'; muni: string; resolved: boolean }> = {}) => {
        const t = overrides.type ?? typeFilter;
        const m = overrides.muni ?? municipality;
        const r = overrides.resolved ?? showResolved;
        const filters: CalamityFilters = {
            type: t === 'all' ? undefined : t,
            municipality: m === 'All' ? undefined : m,
            status: r ? 'all' : 'active',
            page: 0,
        };
        startTransition(async () => {
            const fresh = await getCalamityAlerts(filters);
            setAlerts(fresh); setPage(0); setHasMore(fresh.length >= 20);
        });
    };

    const loadMore = () => {
        const next = page + 1;
        startTransition(async () => {
            const more = await getCalamityAlerts({
                type: typeFilter === 'all' ? undefined : typeFilter,
                municipality: municipality === 'All' ? undefined : municipality,
                status: showResolved ? 'all' : 'active',
                page: next,
            });
            setAlerts(p => [...p, ...more]); setPage(next); setHasMore(more.length >= 20);
        });
    };

    return (
        <div>
            {/* Filters */}
            <div className="px-4 pt-4 pb-2 space-y-2">
                {/* Type filter scroll row */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {TYPE_FILTERS.map(t => (
                        <button key={t.value} onClick={() => { setTypeFilter(t.value); applyFilters({ type: t.value }); }}
                            className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                                typeFilter === t.value
                                    ? 'bg-red-500 text-white shadow'
                                    : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-slate-400'
                            }`}>
                            <span>{t.icon}</span> {t.label}
                        </button>
                    ))}
                </div>

                {/* Municipality + resolved toggle */}
                <div className="flex gap-2 items-center">
                    <select value={municipality} onChange={e => { setMunicipality(e.target.value); applyFilters({ muni: e.target.value }); }}
                        className="flex-1 text-[11px] font-semibold bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 appearance-none">
                        {MUNICIPALITIES.map(m => <option key={m}>{m}</option>)}
                    </select>
                    <button onClick={() => { setShowResolved(!showResolved); applyFilters({ resolved: !showResolved }); }}
                        className={`text-[10px] font-black px-3 py-2 rounded-xl transition-all whitespace-nowrap ${showResolved ? 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-slate-200' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-400'}`}>
                        {showResolved ? '✓ +Resolved' : 'Show resolved'}
                    </button>
                </div>
            </div>

            {/* Cards */}
            <div className="px-4 pb-4 mt-1 space-y-3">
                {isPending && <p className="text-center py-8 text-slate-400 animate-pulse text-sm">Loading…</p>}
                {!isPending && alerts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-4xl mb-3">✅</p>
                        <p className="font-black text-slate-700 dark:text-white text-sm">No active alerts</p>
                        <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-1">Stay safe, Marinduque is all clear.</p>
                    </div>
                )}
                {!isPending && alerts.map(a => (
                    <CalamityCard key={a.id} alert={a} canManage={canManage(a.reported_by)} />
                ))}
                {!isPending && hasMore && (
                    <button onClick={loadMore} className="w-full py-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-[12px] font-black text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all">
                        Load more
                    </button>
                )}
            </div>

            {/* FAB */}
            {userId && (
                <Link href="/my-barangay/calamity/new"
                    className="fixed bottom-24 right-4 z-40 flex items-center gap-2 bg-red-500 hover:bg-red-600 active:scale-95 text-white px-4 py-3 rounded-2xl shadow-lg shadow-red-500/30 font-black text-[13px] transition-all">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Report
                </Link>
            )}
        </div>
    );
}
