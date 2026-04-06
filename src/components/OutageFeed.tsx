'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { getOutageReports, OutageReport, OutageFilters } from '@/app/actions/outages';
import OutageCard from './OutageCard';
import { useAuth } from './AuthProvider';

const MUNICIPALITIES = ['All', 'Boac', 'Gasan', 'Mogpog', 'Sta. Cruz', 'Torrijos', 'Buenavista'];

type Props = { initialReports: OutageReport[]; userId?: string | null };

export default function OutageFeed({ initialReports, userId }: Props) {
    const { profile } = useAuth() as any;
    const [reports, setReports] = useState<OutageReport[]>(initialReports);
    const [typeFilter, setTypeFilter] = useState<'all' | 'power' | 'water'>('all');
    const [municipality, setMunicipality] = useState('All');
    const [showResolved, setShowResolved] = useState(false);
    const [hasMore, setHasMore] = useState(initialReports.length >= 20);
    const [page, setPage] = useState(0);
    const [isPending, startTransition] = useTransition();

    const canManage = (reportedBy: string | null) =>
        userId === reportedBy || profile?.role === 'admin' || profile?.role === 'moderator';

    const applyFilters = (overrides: Partial<{ type: string; muni: string; resolved: boolean }> = {}) => {
        const t = overrides.type ?? typeFilter;
        const m = overrides.muni ?? municipality;
        const r = overrides.resolved ?? showResolved;
        const filters: OutageFilters = {
            type: t === 'all' ? undefined : t as any,
            municipality: m === 'All' ? undefined : m,
            status: r ? 'all' : 'active',
            page: 0,
        };
        startTransition(async () => {
            const fresh = await getOutageReports(filters);
            setReports(fresh); setPage(0); setHasMore(fresh.length >= 20);
        });
    };

    const loadMore = () => {
        const next = page + 1;
        startTransition(async () => {
            const more = await getOutageReports({
                type: typeFilter === 'all' ? undefined : typeFilter as any,
                municipality: municipality === 'All' ? undefined : municipality,
                status: showResolved ? 'all' : 'active',
                page: next,
            });
            setReports(p => [...p, ...more]); setPage(next); setHasMore(more.length >= 20);
        });
    };

    return (
        <div>
            {/* Filters */}
            <div className="px-4 pt-4 pb-2 space-y-2">
                <div className="flex gap-2">
                    {(['all', 'power', 'water'] as const).map(t => (
                        <button key={t} onClick={() => { setTypeFilter(t); applyFilters({ type: t }); }}
                            className={`flex-1 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                                typeFilter === t
                                    ? t === 'power' ? 'bg-yellow-400 text-yellow-900 shadow'
                                        : t === 'water' ? 'bg-blue-500 text-white shadow'
                                        : 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow'
                                    : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-slate-400'
                            }`}>
                            {t === 'all' ? 'All' : t === 'power' ? '⚡ Power' : '💧 Water'}
                        </button>
                    ))}
                </div>
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
            <div id="outage-reports-feed" className="px-4 pb-4 mt-1 space-y-3">
                {isPending && <p className="text-center py-8 text-slate-400 animate-pulse text-sm">Loading…</p>}
                {!isPending && reports.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-4xl mb-3">✅</p>
                        <p className="font-black text-slate-700 dark:text-white text-sm">No active outages reported</p>
                        <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-1">Marinduque is running smoothly right now.</p>
                    </div>
                )}
                {!isPending && reports.map(r => (
                    <OutageCard key={r.id} report={r} canManage={canManage(r.reported_by)} />
                ))}
                {!isPending && hasMore && (
                    <button onClick={loadMore} className="w-full py-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-[12px] font-black text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all">
                        Load more
                    </button>
                )}
            </div>

            {/* FAB */}
            {userId && (
                <Link href="/island-life/outages/new"
                    className="fixed bottom-24 right-4 z-40 flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-yellow-900 px-4 py-3 rounded-2xl shadow-lg shadow-yellow-400/30 font-black text-[13px] transition-all">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Report
                </Link>
            )}
        </div>
    );
}
