'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import VesselTrackerEmbed from '@/components/VesselTrackerEmbed';

const STATUS_STYLES: Record<string, string> = {
    delayed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    boarding: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    long_lines: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    departed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    arrived: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    normal: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    default: 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400',
};
const STATUS_EMOJI: Record<string, string> = {
    delayed: '⏳', boarding: '🟢', long_lines: '🚶', departed: '🚢',
    arrived: '⚓', cancelled: '❌', normal: '✅', info: 'ℹ️', default: '📍',
};
const STATUS_LABELS: Record<string, string> = {
    delayed: 'Delayed', boarding: 'Boarding Now', long_lines: 'Long Lines',
    departed: 'Departed', arrived: 'Arrived', cancelled: 'Cancelled',
    normal: 'All Good', info: 'Info', default: 'Update',
};

// Alert banner background — on a light card we use solid light tints
const ALERT_BG: Record<string, string> = {
    delayed: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    cancelled: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    boarding: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    arrived: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    default: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
};
const ALERT_BADGE: Record<string, string> = {
    delayed: 'bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-400',
    boarding: 'bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-400',
    arrived: 'bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-400',
    default: 'bg-blue-100 text-blue-700 dark:bg-blue-800/40 dark:text-blue-400',
};

const FERRY_LINES = [
    {
        name: 'Montenegro Lines',
        subtitle: 'Balanacan ↔ Lucena · Dalahican',
        icon: '⚓',
        color: 'bg-blue-700',
        followers: '266K followers',
        facebook: 'https://www.facebook.com/montenegroinc',
        phone: null,
    },
    {
        name: 'Starhorse Shipping',
        subtitle: 'Balanacan · Cawit ↔ Lucena',
        icon: '🐴',
        color: 'bg-amber-600',
        followers: '89K followers',
        facebook: 'https://www.facebook.com/starhorseshippinglines',
        phone: '+63 42 710-7403',
    },
];

const COMMUNITY_SOURCES = [
    {
        name: 'Marinduque → Lucena RORO Times',
        desc: 'Community group — live schedules & tips from passengers',
        icon: '👥',
        url: 'https://www.facebook.com/groups/805971225632491',
    },
    {
        name: 'Port of Balanacan Mogpog',
        desc: 'Local community page with port news & updates',
        icon: '🛳️',
        url: 'https://www.facebook.com/batangpierkami',
    },
];

function timeAgo(d: string) {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

type Update = {
    id: string;
    port_name: string;
    status: string;
    message: string;
    created_at: string;
    author_id: string;
    profiles?: { full_name?: string | null; avatar_url?: string | null } | null;
};
type Props = { updates: Update[]; latestAlert: Update | null };

export default function PortsClientShell({ updates: initialUpdates, latestAlert: initialAlert }: Props) {
    // Live state — seeded from server-fetched data
    const [updates, setUpdates] = useState<Update[]>(initialUpdates);
    const [latestAlert, setLatestAlert] = useState<Update | null>(initialAlert);

    // ── Supabase Realtime subscription ────────────────────────────────────
    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const channel = supabase
            .channel('port-updates-live')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'port_updates' },
                (payload) => {
                    const newUpdate = payload.new as Update;
                    // Prepend to feed & promote to latestAlert immediately
                    setUpdates(prev => [newUpdate, ...prev]);
                    setLatestAlert(newUpdate);
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const feed = updates.filter(u =>
        u.port_name?.toLowerCase().includes('balanacan')
    );

    const alertBg = ALERT_BG[latestAlert?.status ?? 'default'] ?? ALERT_BG.default;
    const alertBadge = ALERT_BADGE[latestAlert?.status ?? 'default'] ?? ALERT_BADGE.default;

    return (
        <div className="relative flex flex-col w-full bg-background-light dark:bg-background-dark min-h-screen pb-28">

            {/* ── Hero card — light gray ──────────────────────────────── */}
            <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 mx-4 mt-4 rounded-3xl p-6 shadow-sm relative overflow-hidden">

                <div className="relative z-10">
                    {/* Title row */}
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="relative flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            <div className="absolute w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-60" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                                🚢 Barko Watch
                            </h1>
                            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase mt-0.5">
                                Live tips from fellow commuters
                            </p>
                        </div>
                    </div>

                    {/* Latest alert banner — only if there's a recent post */}
                    {latestAlert && (
                        <div className={`mt-4 flex items-start gap-2.5 p-3 rounded-2xl border ${alertBg}`}>
                            <span className="text-lg shrink-0 mt-0.5">
                                {STATUS_EMOJI[latestAlert.status] ?? STATUS_EMOJI.default}
                            </span>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${alertBadge}`}>
                                        🔴 LIVE · {latestAlert.port_name}
                                    </span>
                                    <span className="text-[9px] text-slate-500 dark:text-slate-400">
                                        {timeAgo(latestAlert.created_at)}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-snug line-clamp-2">
                                    {latestAlert.message}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="mt-4 space-y-2">
                        <Link
                            href="/ports/create"
                            className="flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm shadow-blue-600/20 transition-all"
                        >
                            <span className="material-symbols-outlined text-[14px]">campaign</span>
                            📣 Share What You See at the Port
                        </Link>
                        <p className="text-center text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            Nasa port ka? Help fellow commuters — tell us what&apos;s happening. 🙏
                        </p>
                    </div>
                </div>
            </div>


            {/* Balanacan label — no tab selector needed */}
            <div className="px-4 mt-3">
                <p className="text-[10px] font-black text-text-muted dark:text-text-muted-dark uppercase tracking-widest">
                    ⚓ Balanacan Port · Mogpog
                </p>
            </div>

            {/* ── Content ────────────────────────────────────────────────── */}
            <div className="px-4 mt-6 flex flex-col gap-8">

                {/* Sea Conditions */}
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🌊</span>
                        <h2 className="text-sm font-black text-text-main dark:text-text-main-dark uppercase tracking-[0.15em]">
                            Sea Conditions
                        </h2>
                    </div>
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark">
                        <iframe
                            src="https://embed.windy.com/embed2.html?lat=13.476&lon=121.917&detailLat=13.476&detailLon=121.917&width=650&height=400&zoom=9&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
                            title="Sea & Wind Conditions"
                            className="w-full h-full border-0"
                            loading="lazy"
                            allowFullScreen
                        />
                        <div className="absolute bottom-2 left-2 pointer-events-none">
                            <span className="bg-black/60 backdrop-blur-md text-[8px] font-black text-white/70 px-2 py-1 rounded-lg uppercase tracking-widest">
                                Live wind & wave data
                            </span>
                        </div>
                    </div>
                </section>

                {/* Vessel Tracker */}
                <section>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">⛵</span>
                        <h2 className="text-sm font-black text-text-main dark:text-text-main-dark uppercase tracking-[0.15em]">
                            Vessel Tracker
                        </h2>
                    </div>
                    <p className="text-[10px] text-text-muted dark:text-text-muted-dark mb-2 leading-relaxed">
                        Live ship positions — Lucena to Balanacan/Mogpog crossing
                    </p>
                    <VesselTrackerEmbed />
                </section>

                {/* What Commuters Are Saying */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">💬</span>
                            <h2 className="text-sm font-black text-text-main dark:text-text-main-dark uppercase tracking-[0.15em]">
                                What Commuters Are Saying
                            </h2>
                        </div>
                    </div>

                    {/* Empty state */}
                    {feed.length === 0 && (
                        <div className="bg-surface-light dark:bg-surface-dark border-2 border-dashed border-border-light dark:border-border-dark rounded-3xl p-8 flex flex-col items-center text-center">
                            <div className="text-5xl mb-3">😶</div>
                            <h3 className="text-base font-black text-text-main dark:text-text-main-dark mb-1">
                                No updates yet for Balanacan
                            </h3>
                            <p className="text-xs text-text-muted dark:text-text-muted-dark leading-relaxed max-w-[220px] mb-5">
                                Are you there right now? Be the first to let everyone know what&apos;s happening!
                            </p>
                            <Link
                                href="/ports/create"
                                className="text-moriones-red font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1"
                            >
                                Share an update <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </Link>
                        </div>
                    )}

                    {/* Feed cards */}
                    <div className="space-y-3">
                        {feed.map(u => {
                            const style = STATUS_STYLES[u.status] ?? STATUS_STYLES.default;
                            const emoji = STATUS_EMOJI[u.status] ?? STATUS_EMOJI.default;
                            const label = STATUS_LABELS[u.status] ?? 'Update';
                            const initials = (u.profiles?.full_name ?? 'C')
                                .split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
                            return (
                                <div key={u.id} className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            {u.profiles?.avatar_url
                                                ? <img src={u.profiles.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover border border-border-light shrink-0" />
                                                : <div className="h-9 w-9 rounded-full bg-moriones-red flex items-center justify-center text-white font-black text-[11px] shrink-0">{initials}</div>
                                            }
                                            <div>
                                                <p className="text-xs font-black text-text-main dark:text-text-main-dark leading-none">
                                                    {u.profiles?.full_name ?? 'Fellow commuter'}
                                                </p>
                                                <p className="text-[9px] text-text-muted dark:text-text-muted-dark mt-0.5">
                                                    {u.port_name} · {timeAgo(u.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${style}`}>
                                            {emoji} {label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-main dark:text-text-main-dark leading-snug">{u.message}</p>
                                </div>
                            );
                        })}
                    </div>

                    {feed.length > 0 && (
                        <p className="text-[9px] text-text-muted dark:text-text-muted-dark text-center mt-3 leading-relaxed">
                            Tips from community members. Always confirm with the ferry lines directly.
                        </p>
                    )}
                </section>

                {/* Ferry Lines */}
                <section>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🏢</span>
                        <h2 className="text-sm font-black text-text-main dark:text-text-main-dark uppercase tracking-[0.15em]">
                            Ferry Lines
                        </h2>
                    </div>
                    <p className="text-[10px] text-text-muted dark:text-text-muted-dark mb-3 leading-relaxed">
                        For official schedules and announcements, follow them directly on Facebook:
                    </p>
                    <div className="flex flex-col gap-2.5">
                        {FERRY_LINES.map(line => (
                            <div key={line.name} className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 flex items-center gap-3">
                                <div className={`w-11 h-11 rounded-xl ${line.color} flex items-center justify-center text-2xl shrink-0 shadow-sm`}>
                                    {line.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-text-main dark:text-text-main-dark text-sm leading-none mb-0.5">{line.name}</p>
                                    <p className="text-[10px] text-text-muted dark:text-text-muted-dark leading-tight">{line.subtitle}</p>
                                    {line.phone && (
                                        <a href={`tel:${line.phone}`} className="text-[9px] font-bold text-moriones-red mt-0.5 block">{line.phone}</a>
                                    )}
                                    {'followers' in line && (
                                        <p className="text-[9px] text-text-muted dark:text-text-muted-dark opacity-60">{line.followers}</p>
                                    )}
                                </div>
                                {line.facebook && (
                                    <a
                                        href={line.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 bg-[#1877F2] text-white text-[9px] font-black px-3 py-2 rounded-xl uppercase tracking-wide shrink-0 active:scale-95 transition-all shadow-sm"
                                    >
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                        Follow
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Community Groups */}
                <section className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">👥</span>
                        <h2 className="text-sm font-black text-text-main dark:text-text-main-dark uppercase tracking-[0.15em]">
                            Community Groups
                        </h2>
                    </div>
                    <p className="text-[10px] text-text-muted dark:text-text-muted-dark mb-3 leading-relaxed">
                        Fellow commuters share real-time updates in these groups:
                    </p>
                    <div className="flex flex-col gap-2.5">
                        {COMMUNITY_SOURCES.map(src => (
                            <a
                                key={src.name}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-all hover:border-moriones-red/30 group"
                            >
                                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-2xl shrink-0">
                                    {src.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-text-main dark:text-text-main-dark text-sm leading-snug group-hover:text-moriones-red transition-colors">{src.name}</p>
                                    <p className="text-[10px] text-text-muted dark:text-text-muted-dark leading-tight">{src.desc}</p>
                                </div>
                                <span className="material-symbols-outlined text-text-muted dark:text-text-muted-dark text-[18px] shrink-0">open_in_new</span>
                            </a>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
