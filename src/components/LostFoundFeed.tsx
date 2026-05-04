'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { getLostFoundPosts, LostFoundPost, LostFoundFilters } from '@/app/actions/lost-found';
import LostFoundCard from './LostFoundCard';
import { useAuth } from './AuthProvider';

const MUNICIPALITIES = ['All', 'Boac', 'Gasan', 'Mogpog', 'Sta. Cruz', 'Torrijos', 'Buenavista'];
const CATEGORIES = [
    { value: 'all', label: 'All Types' },
    { value: 'animal', label: '🐾 Animal' },
    { value: 'item', label: '📦 Item' },
    { value: 'document', label: '📄 Document' },
    { value: 'person', label: '👤 Person' },
];

type TypeFilter = 'all' | 'lost' | 'found';
type StatusFilter = 'open' | 'all';

type Props = {
    initialPosts: LostFoundPost[];
};

export default function LostFoundFeed({ initialPosts }: Props) {
    const { user } = useAuth();
    const [posts, setPosts] = useState<LostFoundPost[]>(initialPosts);
    const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
    const [category, setCategory] = useState('all');
    const [municipality, setMunicipality] = useState('All');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('open');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(initialPosts.length >= 15);
    const [isPending, startTransition] = useTransition();

    const applyFilters = (overrides: Partial<{
        type: TypeFilter; cat: string; muni: string; status: StatusFilter;
    }> = {}) => {
        const t = overrides.type ?? typeFilter;
        const c = overrides.cat ?? category;
        const m = overrides.muni ?? municipality;
        const s = overrides.status ?? statusFilter;

        const filters: LostFoundFilters = {
            type: t === 'all' ? undefined : t,
            category: c === 'all' ? undefined : c,
            municipality: m === 'All' ? undefined : m,
            status: s,
            page: 0,
        };

        startTransition(async () => {
            const fresh = await getLostFoundPosts(filters);
            setPosts(fresh);
            setPage(0);
            setHasMore(fresh.length >= 15);
        });
    };

    const loadMore = () => {
        const nextPage = page + 1;
        const filters: LostFoundFilters = {
            type: typeFilter === 'all' ? undefined : typeFilter,
            category: category === 'all' ? undefined : category,
            municipality: municipality === 'All' ? undefined : municipality,
            status: statusFilter,
            page: nextPage,
        };
        startTransition(async () => {
            const more = await getLostFoundPosts(filters);
            setPosts(prev => [...prev, ...more]);
            setPage(nextPage);
            setHasMore(more.length >= 15);
        });
    };

    const changeType = (v: TypeFilter) => { setTypeFilter(v); applyFilters({ type: v }); };
    const changeCat = (v: string) => { setCategory(v); applyFilters({ cat: v }); };
    const changeMuni = (v: string) => { setMunicipality(v); applyFilters({ muni: v }); };
    const changeStatus = (v: StatusFilter) => { setStatusFilter(v); applyFilters({ status: v }); };

    return (
        <div>
            {/* Filter bar */}
            <div className="px-4 pt-4 pb-2 space-y-2">
                {/* Type toggle */}
                <div className="flex gap-2">
                    {(['all', 'lost', 'found'] as TypeFilter[]).map(t => (
                        <button
                            key={t}
                            onClick={() => changeType(t)}
                            className={`flex-1 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                                typeFilter === t
                                    ? t === 'lost'
                                        ? 'bg-rose-500 text-white shadow'
                                        : t === 'found'
                                        ? 'bg-emerald-500 text-white shadow'
                                        : 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 shadow'
                                    : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            {t === 'all' ? 'All' : t === 'lost' ? '🔴 Lost' : '🟢 Found'}
                        </button>
                    ))}
                </div>

                {/* Row 2: category + municipality */}
                <div className="flex gap-2">
                    <select
                        value={category}
                        onChange={e => changeCat(e.target.value)}
                        className="flex-1 text-[11px] font-semibold bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 appearance-none"
                    >
                        {CATEGORIES.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                    <select
                        value={municipality}
                        onChange={e => changeMuni(e.target.value)}
                        className="flex-1 text-[11px] font-semibold bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 appearance-none"
                    >
                        {MUNICIPALITIES.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                {/* Resolved toggle */}
                <button
                    onClick={() => changeStatus(statusFilter === 'open' ? 'all' : 'open')}
                    className={`text-[10px] font-black px-3 py-1.5 rounded-full transition-all ${
                        statusFilter === 'all'
                            ? 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-slate-200'
                            : 'bg-transparent border border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500'
                    }`}
                >
                    {statusFilter === 'all' ? '✓ Showing resolved too' : 'Show resolved'}
                </button>
            </div>

            {/* Post feed */}
            <div className="px-4 pb-4 space-y-3 mt-1">
                {isPending && (
                    <div className="text-center py-8 text-slate-400 dark:text-zinc-500 text-sm animate-pulse">
                        Loading…
                    </div>
                )}
                {!isPending && posts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-4xl mb-3">🔍</p>
                        <p className="font-black text-slate-700 dark:text-white text-sm">No posts yet</p>
                        <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-1">
                            Be the first to report a lost or found item in Marinduque.
                        </p>
                    </div>
                )}
                {!isPending && posts.map(post => (
                    <LostFoundCard key={post.id} post={post} />
                ))}

                {!isPending && hasMore && (
                    <button
                        onClick={loadMore}
                        className="w-full py-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-[12px] font-black text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all"
                    >
                        Load more
                    </button>
                )}
            </div>

            {/* FAB */}
            {user && (
                <Link
                    href="/my-barangay/lost-found/new"
                    className="fixed bottom-24 right-4 z-40 flex items-center gap-2 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white px-4 py-3 rounded-2xl shadow-lg shadow-rose-500/30 font-black text-[13px] transition-all"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Report
                </Link>
            )}
        </div>
    );
}
