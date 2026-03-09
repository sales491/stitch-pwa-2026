'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { toggleGemLike } from '@/app/actions/gems';

type Gem = {
    id: string;
    title: string;
    town: string;
    description?: string | null;
    images?: string[] | null;
    author_id: string;
    likeCount: number;
    isLikedByMe: boolean;
    profiles?: { full_name?: string | null; avatar_url?: string | null } | null;
};

type Props = { gems: Gem[]; isLoggedIn: boolean };

// ── Per-card vouch button ─────────────────────────────────────────────────
function VouchButton({ gemId, initialLiked, initialCount, isLoggedIn }: {
    gemId: string; initialLiked: boolean; initialCount: number; isLoggedIn: boolean;
}) {
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [pending, startTransition] = useTransition();

    const handle = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (!isLoggedIn) { alert('Sign in to vouch for this gem!'); return; }
        const was = liked;
        setLiked(!was);
        setCount(c => Math.max(0, c + (was ? -1 : 1)));
        startTransition(async () => {
            try { const r = await toggleGemLike(gemId); setLiked(r.liked); }
            catch { setLiked(was); setCount(c => Math.max(0, c + (was ? 1 : -1))); }
        });
    };

    return (
        <button
            onClick={handle}
            disabled={pending}
            className={`absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black
                shadow-lg border transition-all active:scale-95
                ${liked
                    ? 'bg-moriones-red text-white border-moriones-red shadow-moriones-red/30'
                    : 'bg-surface-light/90 dark:bg-zinc-900/90 backdrop-blur-sm text-moriones-red border-moriones-red/30'
                }`}
        >
            <span className="material-symbols-outlined" style={{ fontSize: 13, fontVariationSettings: liked ? '"FILL" 1' : '"FILL" 0' }}>favorite</span>
            {count > 0 && count}
        </button>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────
export default function GemMasonryFeed({ gems, isLoggedIn }: Props) {
    const [search, setSearch] = useState('');

    const filtered = gems.filter(g => {
        const q = search.toLowerCase();
        return !q || g.title.toLowerCase().includes(q) || g.town.toLowerCase().includes(q);
    });

    return (
        <div className="relative flex flex-col w-full bg-background-light dark:bg-background-dark min-h-screen pb-28">

            {/* ── Hero header card — matches live site ─────────────── */}
            <div className="bg-slate-900 dark:bg-zinc-900 mx-4 mt-4 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

                {/* Page label */}
                <div className="flex items-center gap-2 mb-1 relative z-10">
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
                    </Link>
                    <div>
                        <p className="text-[10px] font-black text-moriones-red uppercase tracking-[0.2em]">Local Gems</p>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Intelligence Feed</p>
                    </div>
                </div>

                {/* Hero title */}
                <div className="mt-4 relative z-10">
                    <h1 className="text-2xl font-black text-white leading-tight">
                        Marinduque&apos;s
                    </h1>
                    <h1 className="text-2xl font-black text-moriones-red leading-tight">
                        hidden sanctuaries
                    </h1>
                    <p className="text-slate-400 text-xs mt-2 font-medium leading-relaxed">
                        Discover historical vistas and secret sanctuaries recorded by the community.
                    </p>
                </div>

                {/* Search bar */}
                <div className="mt-4 relative z-10">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400" style={{ fontSize: 17 }}>search</span>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white placeholder:text-slate-500 focus:ring-2 focus:ring-moriones-red/40 focus:border-moriones-red/40 outline-none transition-all"
                            placeholder="Search gems or town..."
                        />
                    </div>
                </div>
            </div>

            {/* ── Empty state — matches live "Geographic Data Empty" ── */}
            {filtered.length === 0 && (
                <div className="mx-4 mt-4">
                    <div className="border-2 border-dashed border-border-light dark:border-border-dark rounded-3xl bg-surface-light dark:bg-surface-dark p-10 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-moriones-red/10 flex items-center justify-center mb-5">
                            <span className="material-symbols-outlined text-moriones-red text-4xl">landscape</span>
                        </div>
                        <h2 className="text-xl font-black text-text-main dark:text-text-main-dark mb-2">
                            {search ? `No results for "${search}"` : 'Geographic Data Empty'}
                        </h2>
                        <p className="text-xs text-text-muted dark:text-text-muted-dark max-w-[220px] leading-relaxed mb-6">
                            {search ? 'Try a different search term.' : "The island's hidden treasures await registration. Be the first explorer to record a sanctuary."}
                        </p>
                        <Link
                            href="/share-alocal-gem-screen"
                            className="bg-moriones-red text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-moriones-red/30 active:scale-95 transition-all"
                        >
                            Initialize Discovery
                        </Link>
                    </div>
                </div>
            )}

            {/* ── Masonry gem grid ──────────────────────────────────── */}
            {filtered.length > 0 && (
                <div className="px-4 mt-4" style={{ columnCount: 2, columnGap: '0.625rem' }}>
                    {filtered.map(gem => (
                        <div
                            key={gem.id}
                            style={{ breakInside: 'avoid', marginBottom: '0.625rem' }}
                            className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <Link href={`/gems-of-marinduque-feed/${gem.id}`}>
                                <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
                                    {gem.images?.[0] ? (
                                        <img
                                            src={gem.images[0]}
                                            alt={gem.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-background-light dark:bg-background-dark flex items-center justify-center">
                                            <span className="material-symbols-outlined text-text-muted/30 text-4xl">landscape</span>
                                        </div>
                                    )}
                                    <VouchButton gemId={gem.id} initialLiked={gem.isLikedByMe} initialCount={gem.likeCount} isLoggedIn={isLoggedIn} />
                                    <div className="absolute bottom-2 left-2 flex items-center gap-0.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full">
                                        <span className="material-symbols-outlined text-moriones-red" style={{ fontSize: 10 }}>location_on</span>
                                        <span className="text-[8px] font-black text-white uppercase tracking-wide">{gem.town}</span>
                                    </div>
                                </div>
                            </Link>
                            <Link href={`/gems-of-marinduque-feed/${gem.id}`} className="block px-3 py-2.5">
                                <h3 className="font-black text-text-main dark:text-text-main-dark text-sm leading-snug mb-1 line-clamp-2">{gem.title}</h3>
                                {gem.description && (
                                    <p className="text-[10px] text-text-muted dark:text-text-muted-dark line-clamp-2 mb-2">{gem.description}</p>
                                )}
                                <div className="flex items-center gap-1.5">
                                    {gem.profiles?.avatar_url
                                        ? <img src={gem.profiles.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover border border-border-light" />
                                        : <div className="w-5 h-5 rounded-full bg-moriones-red flex items-center justify-center text-white text-[8px] font-black">{(gem.profiles?.full_name ?? '?')[0].toUpperCase()}</div>
                                    }
                                    <span className="text-[10px] font-bold text-text-muted dark:text-text-muted-dark truncate">{gem.profiles?.full_name?.split(' ')[0] ?? 'Local'}</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* ── FAB — red location pin, matches live site ────────── */}
            <Link
                href="/share-alocal-gem-screen"
                className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-moriones-red text-white shadow-2xl shadow-moriones-red/40 active:scale-95 transition-all"
            >
                <span className="material-symbols-outlined text-[28px]">add_location_alt</span>
            </Link>
        </div>
    );
}
