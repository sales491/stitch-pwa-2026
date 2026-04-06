'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { getGasPrices, deleteGasPrice, type GasPrice } from '@/app/actions/gas-prices';
import PageHeader from '@/components/PageHeader';

const MUNICIPALITIES = ['Boac', 'Gasan', 'Mogpog', 'Sta. Cruz', 'Torrijos', 'Buenavista'];

const FUEL_META = [
    { key: 'regular_price' as const, emoji: '⛽', label: 'Regular',  pill: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
    { key: 'premium_price' as const, emoji: '💎', label: 'Premium',  pill: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
    { key: 'diesel_price'  as const, emoji: '🚛', label: 'Diesel',   pill: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
];

function formatTimestamp(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diffS = Math.floor((now.getTime() - d.getTime()) / 1000);
    const timeStr = d.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit', hour12: true });
    if (diffS < 86400 && d.getDate() === now.getDate()) return `Today at ${timeStr}`;
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    if (d.getDate() === yesterday.getDate()) return `Yesterday at ${timeStr}`;
    return d.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' }) + ` at ${timeStr}`;
}

function PriceCard({
    entry,
    canDelete,
    onDelete,
}: {
    entry: GasPrice;
    canDelete: boolean;
    onDelete: (id: string) => void;
}) {
    const fuelPrices = FUEL_META.filter(f => entry[f.key] !== null);
    const isPhotoOnly = fuelPrices.length === 0 && !!entry.photo_url;
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Remove this price update?')) return;
        setDeleting(true);
        const res = await deleteGasPrice(entry.id);
        if (res.error) { alert(res.error); setDeleting(false); return; }
        onDelete(entry.id);
    };

    return (
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden shadow-sm">
            {/* Photo — fixed aspect ratio */}
            {entry.photo_url && (
                <div className="relative w-full aspect-[4/3] bg-slate-100 dark:bg-zinc-800">
                    <img
                        src={entry.photo_url}
                        alt="Price board"
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                    />
                    {isPhotoOnly && (
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-black px-2 py-1 rounded-lg backdrop-blur-sm">
                            📸 Price board photo
                        </div>
                    )}
                </div>
            )}

            <div className="p-3.5">
                {/* Fuel price pills */}
                {fuelPrices.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2.5">
                        {fuelPrices.map(f => (
                            <div key={f.key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-black ${f.pill}`}>
                                <span className="text-sm">{f.emoji}</span>
                                <span className="text-[10px] font-bold">{f.label}</span>
                                <span className="text-[13px]">₱{Number(entry[f.key]).toFixed(2)}<span className="font-normal text-[9px] ml-0.5">/L</span></span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Meta row */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        {entry.avatar_url
                            ? <img src={entry.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover border border-border-light shrink-0 mt-0.5" />
                            : <div className="w-7 h-7 rounded-full bg-moriones-red flex items-center justify-center text-white font-black text-[10px] shrink-0 mt-0.5">{entry.poster_name?.[0] ?? 'M'}</div>
                        }
                        <div className="flex-1 min-w-0">
                            {entry.station_name && (
                                <p className="text-[12px] font-bold text-text-main dark:text-text-main-dark leading-tight">{entry.station_name}</p>
                            )}
                            {entry.note && (
                                <p className="text-[11px] text-text-muted dark:text-text-muted-dark leading-snug mt-0.5">{entry.note}</p>
                            )}
                            <p className="text-[10px] text-text-muted dark:text-text-muted-dark mt-0.5">
                                by {entry.poster_name ?? 'Community Member'}
                            </p>
                            <p className="text-[10px] text-text-muted dark:text-text-muted-dark flex items-center gap-1 mt-0.5">
                                <span className="material-symbols-outlined text-[11px]">schedule</span>
                                {formatTimestamp(entry.created_at)}
                            </p>
                        </div>
                    </div>

                    {/* Delete button */}
                    {canDelete && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 transition-colors disabled:opacity-40 mt-0.5"
                            aria-label="Delete update"
                        >
                            <span className="material-symbols-outlined text-[15px]">{deleting ? 'hourglass_empty' : 'delete'}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

interface Props {
    initialPrices: GasPrice[];
    initialMunicipality: string;
}

export default function GasPricesClientShell({ initialPrices, initialMunicipality }: Props) {
    const { profile } = useAuth();
    const [municipality, setMunicipality] = useState(initialMunicipality);
    const [entries, setEntries] = useState<GasPrice[]>(initialPrices);
    const [isPending, startTransition] = useTransition();

    // Determine if the current user has elevated permissions (role from DB profile)
    const userIsAdmin = !!(profile && (
        ['admin', 'moderator', 'super_admin'].includes(profile.role as string)
    ));

    // Re-fetch on mount to avoid stale server-render cache
    useEffect(() => {
        startTransition(async () => {
            const fresh = await getGasPrices(municipality);
            setEntries(fresh);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMunicipality = (m: string) => {
        setMunicipality(m);
        startTransition(async () => {
            const fresh = await getGasPrices(m);
            setEntries(fresh);
        });
    };

    const handleDelete = (id: string) => {
        setEntries(prev => prev.filter(e => e.id !== id));
    };

    const hasAny = entries.length > 0;

    return (
        <div className="flex flex-col w-full bg-background-light dark:bg-background-dark min-h-screen pb-28">

            <PageHeader title="Gas Prices" subtitle="Fuel Watch" rightAction={
                <Link
                    href="/island-life/gas-prices/create"
                    className="flex items-center gap-1.5 bg-moriones-red text-white text-[11px] font-black px-3 py-2 rounded-xl shadow-sm shadow-moriones-red/20 hover:bg-red-700 active:scale-95 transition-all"
                >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    Share Price
                </Link>
            } />

            {/* Hero banner — count only, no price data */}
            <div className="bg-gradient-to-br from-red-600 via-orange-600 to-amber-600 px-4 pt-4 pb-5 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 40%, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
                <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">Today&apos;s Prices</p>
                <p className="text-white text-2xl font-black leading-tight">
                    {hasAny
                        ? `${entries.length} update${entries.length !== 1 ? 's' : ''} in ${municipality}`
                        : `No reports yet in ${municipality}`}
                </p>
                <p className="text-white/60 text-[10px] mt-1">Community-sourced · last 3 days</p>
            </div>

            {/* Municipality — 3×2 grid, no scroll */}
            <div className="px-3 py-3 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                <div className="grid grid-cols-3 gap-1.5">
                    {MUNICIPALITIES.map(m => (
                        <button
                            key={m}
                            onClick={() => handleMunicipality(m)}
                            className={`py-2 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all active:scale-95 ${
                                municipality === m
                                    ? 'bg-moriones-red text-white shadow-md shadow-moriones-red/25'
                                    : 'bg-background-light dark:bg-background-dark text-text-muted dark:text-text-muted-dark border border-border-light dark:border-border-dark hover:border-moriones-red/50 hover:text-moriones-red'
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div id="gas-prices-feed" className={`px-4 py-5 space-y-3 transition-opacity duration-200 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                {isPending && (
                    <div className="flex items-center justify-center py-6 gap-2">
                        <div className="w-5 h-5 border-2 border-moriones-red/30 border-t-moriones-red rounded-full animate-spin" />
                        <p className="text-[11px] font-black text-text-muted uppercase tracking-widest">Loading…</p>
                    </div>
                )}

                {!isPending && !hasAny && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                        <span className="text-5xl">⛽</span>
                        <p className="font-black text-text-main dark:text-text-main-dark text-base">No prices yet for {municipality}</p>
                        <p className="text-text-muted dark:text-text-muted-dark text-[12px] max-w-[240px] leading-relaxed">
                            Be the first to report a local gas price. It helps everyone in town!
                        </p>
                        <Link
                            href="/island-life/gas-prices/create"
                            className="mt-2 bg-moriones-red text-white font-black text-sm px-6 py-3 rounded-2xl shadow-lg shadow-moriones-red/20 hover:bg-red-700 active:scale-95 transition-all"
                        >
                            Share a Price
                        </Link>
                    </div>
                )}

                {!isPending && entries.map(entry => (
                    <PriceCard
                        key={entry.id}
                        entry={entry}
                        canDelete={!!(profile && (userIsAdmin || profile.id === entry.author_id))}
                        onDelete={handleDelete}
                    />
                ))}

                {!isPending && hasAny && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3 text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed text-center">
                        ⚠️ Prices are community-sourced. Always verify at your local station before making a trip.
                    </div>
                )}
            </div>

            {/* FAB */}
            <Link
                href="/island-life/gas-prices/create"
                className="fixed bottom-24 right-4 w-14 h-14 bg-moriones-red text-white rounded-full flex items-center justify-center shadow-xl shadow-moriones-red/30 hover:bg-red-700 active:scale-95 transition-all z-30"
                aria-label="Share a gas price"
            >
                <span className="material-symbols-outlined text-[26px]">add</span>
            </Link>
        </div>
    );
}
