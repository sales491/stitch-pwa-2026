'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { updateWinnerWriteup, swapWinnerBusiness } from '@/app/actions/spotlight';

// ── Types ──────────────────────────────────────────────────────────────────────

export type WinnerBusiness = {
    id: string;
    business_name: string;
    business_type: string | null;
    description: string | null;
    location: string | null;
    operating_hours: string | null;
    average_rating: number | null;
    review_count: number | null;
    gallery_image: string | null;
    gallery_images: string[] | null;
    categories: string[] | null;
    contact_info?: Record<string, string> | null;
};

type PickerBusiness = {
    id: string;
    business_name: string;
    business_type: string | null;
    gallery_image: string | null;
};

type Props = {
    winner: WinnerBusiness;
    writeup1: string;
    writeup2: string;
    monthYear: string;
    isAdmin: boolean;
    allBusinesses: PickerBusiness[];
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function StarRow({ rating, count }: { rating: number | null; count: number | null }) {
    const num = Number(rating ?? 0);
    const r = Math.round(num);
    if (num === 0 && !count) return null;
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(s => (
                <span
                    key={s}
                    className="material-symbols-outlined text-moriones-red"
                    style={{ fontSize: 13, fontVariationSettings: s <= r ? '"FILL" 1' : '"FILL" 0' }}
                >
                    star
                </span>
            ))}
            {num > 0 && (
                <span className="text-[10px] font-black ml-0.5 text-text-main dark:text-text-main-dark">{num.toFixed(1)}</span>
            )}
            <span className="text-[10px] text-text-muted dark:text-text-muted-dark">({count ?? 0})</span>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 bg-background-light dark:bg-background-dark px-4 py-3 rounded-2xl border border-border-light dark:border-border-dark">
            <div className="w-9 h-9 rounded-xl bg-moriones-red flex items-center justify-center shrink-0 shadow-sm shadow-moriones-red/20">
                <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>{icon}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black uppercase tracking-widest text-text-muted dark:text-text-muted-dark mb-0.5">{label}</p>
                <p className="text-sm font-bold text-text-main dark:text-text-main-dark truncate">{value}</p>
            </div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function WinnerSection({
    winner,
    writeup1: initialWriteup1,
    writeup2: initialWriteup2,
    monthYear,
    isAdmin,
    allBusinesses,
}: Props) {
    const [swapping, setSwapping] = useState(false);
    const [editingSlot, setEditingSlot] = useState<1 | 2 | null>(null);
    const [writeups, setWriteups] = useState<[string, string]>([initialWriteup1, initialWriteup2]);
    const [search, setSearch] = useState('');
    const [savedMsg, setSavedMsg] = useState('');
    const [isPending, startTransition] = useTransition();

    const winnerImage = winner.gallery_image || winner.gallery_images?.[0] || null;

    const filtered = allBusinesses.filter(b =>
        b.business_name.toLowerCase().includes(search.toLowerCase()) ||
        (b.business_type ?? '').toLowerCase().includes(search.toLowerCase())
    );

    function flash(msg: string) {
        setSavedMsg(msg);
        setTimeout(() => setSavedMsg(''), 2500);
    }

    function toggleEdit(slot: 1 | 2) {
        setEditingSlot(prev => prev === slot ? null : slot);
    }

    function updateWriteup(slot: 1 | 2, val: string) {
        setWriteups(prev => slot === 1 ? [val, prev[1]] : [prev[0], val]);
    }

    function handleSaveWriteup(slot: 1 | 2) {
        startTransition(async () => {
            await updateWinnerWriteup(monthYear, slot, writeups[slot - 1]);
            setEditingSlot(null);
            flash(`Text block ${slot} saved ✓`);
        });
    }

    function handleSwap(businessId: string) {
        startTransition(async () => {
            await swapWinnerBusiness(monthYear, businessId);
            setSwapping(false);
            setSearch('');
            flash('Winner updated ✓');
        });
    }

    return (
        <div className="px-4 mt-6">

            {/* Section header */}
            <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-moriones-red flex items-center justify-center shadow-md shadow-moriones-red/30">
                        <span className="material-symbols-outlined text-white text-[22px]" style={{ fontVariationSettings: '"FILL" 1' }}>trophy</span>
                    </div>
                    <h2 className="text-lg font-black text-text-main dark:text-text-main-dark">Monthly Top Spot</h2>
                </div>
                {savedMsg && (
                    <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg animate-pulse">
                        {savedMsg}
                    </span>
                )}
            </div>

            {/* ── Winner card ── */}
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl overflow-hidden shadow-md">

                {/* Hero image */}
                <div className="relative h-48 bg-background-light dark:bg-background-dark">
                    {winnerImage ? (
                        <Image src={winnerImage} alt={winner.business_name} fill className="object-cover" sizes="(max-width: 672px) 100vw, 400px" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-moriones-red/5">
                            <span className="material-symbols-outlined text-moriones-red/30 text-5xl" style={{ fontVariationSettings: '"FILL" 1' }}>store</span>
                        </div>
                    )}

                    {/* Admin: Replace business button over hero image */}
                    {isAdmin && (
                        <button
                            onClick={() => { setSwapping(v => !v); setSearch(''); }}
                            className={`absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xl z-10 transition-all active:scale-95 ${swapping
                                    ? 'bg-moriones-red text-white'
                                    : 'bg-slate-900/80 backdrop-blur-md text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
                            {swapping ? 'Cancel' : 'Replace Winner'}
                        </button>
                    )}

                    {/* Verified badge */}
                    <div className="absolute -bottom-5 right-5 w-14 h-14 rounded-full bg-moriones-red flex items-center justify-center shadow-xl shadow-moriones-red/30 border-2 border-surface-light dark:border-surface-dark z-10">
                        <span className="material-symbols-outlined text-white text-[26px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                    </div>
                </div>

                {/* Business picker — slides in below image when "Replace Winner" is clicked */}
                {isAdmin && swapping && (
                    <div className="border-b border-moriones-red/30 bg-surface-light dark:bg-surface-dark p-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-moriones-red mb-2">Select New Monthly Top Spot</p>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name or type…"
                            autoFocus
                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark mb-3 outline-none focus:border-moriones-red transition-colors"
                        />
                        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                            {filtered.length === 0 && (
                                <p className="text-xs text-text-muted dark:text-text-muted-dark px-2 py-3 text-center">No businesses found</p>
                            )}
                            {filtered.slice(0, 15).map(b => (
                                <button
                                    key={b.id}
                                    onClick={() => handleSwap(b.id)}
                                    disabled={isPending}
                                    className="flex items-center gap-3 text-left px-3 py-2 rounded-xl hover:bg-moriones-red/5 active:bg-moriones-red/10 transition-colors disabled:opacity-50 group"
                                >
                                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-background-light dark:bg-background-dark shrink-0">
                                        {b.gallery_image ? (
                                            <Image src={b.gallery_image} alt={b.business_name} width={40} height={40} className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-moriones-red/30 text-base">store</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-text-main dark:text-text-main-dark truncate group-hover:text-moriones-red transition-colors">{b.business_name}</p>
                                        <p className="text-[10px] text-text-muted dark:text-text-muted-dark truncate">{b.business_type ?? 'Local Business'}</p>
                                    </div>
                                    <span className="material-symbols-outlined text-[16px] text-moriones-red/40 group-hover:text-moriones-red transition-colors">chevron_right</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Card details */}
                <div className="p-5 pt-8">
                    <p className="text-[9px] font-black text-moriones-red uppercase tracking-[0.25em] mb-1">Champion Spotlight</p>
                    <h3 className="text-2xl font-black text-text-main dark:text-text-main-dark leading-tight mb-3">{winner.business_name}</h3>

                    {Number(winner.average_rating ?? 0) > 0 && (
                        <div className="mb-4">
                            <StarRow rating={Number(winner.average_rating)} count={winner.review_count} />
                        </div>
                    )}

                    <div className="flex flex-col gap-2 mb-4">
                        {(winner.business_type || winner.categories?.[0]) && (
                            <InfoRow icon="storefront" label="Category" value={winner.business_type || winner.categories![0]} />
                        )}
                        {winner.operating_hours && (
                            <InfoRow icon="schedule" label="Hours" value={winner.operating_hours} />
                        )}
                        {winner.location && (
                            <InfoRow icon="location_on" label="Location" value={winner.location} />
                        )}
                    </div>

                    {winner.description && (
                        <p className="text-sm text-text-muted dark:text-text-muted-dark leading-relaxed line-clamp-3 mb-4">
                            {winner.description}
                        </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-4 border-t border-border-light dark:border-border-dark">
                        <Link
                            href={`/business/${winner.id}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-moriones-red text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm shadow-moriones-red/20 active:scale-[0.98] transition-all"
                        >
                            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: '"FILL" 1' }}>open_in_new</span>
                            View Profile
                        </Link>
                        <Link
                            href={`/business/${winner.id}`}
                            className="flex-1 flex items-center justify-center gap-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-main dark:text-text-main-dark py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-[0.98] transition-all"
                        >
                            <span className="material-symbols-outlined text-moriones-red text-[16px]">call</span>
                            Call Now
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Text blocks below winner card — each has its own inline edit ── */}
            {([1, 2] as const).map(slot => {
                const text = writeups[slot - 1];
                const isEditing = editingSlot === slot;
                const labels = ['Opening Text', 'Closing Text'] as const;

                return (
                    <div
                        key={slot}
                        className={`relative mt-3 rounded-2xl border overflow-hidden transition-all ${text
                                ? 'border-moriones-red/20 bg-surface-light dark:bg-surface-dark'
                                : isAdmin
                                    ? 'border-dashed border-moriones-red/30 bg-transparent'
                                    : 'border-transparent'
                            }`}
                    >
                        {/* Admin edit toggle */}
                        {isAdmin && (
                            <button
                                onClick={() => toggleEdit(slot)}
                                className={`absolute right-2 top-2 flex items-center gap-1 px-2 py-1 rounded-lg border z-10 shadow-sm text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${isEditing
                                        ? 'bg-moriones-red border-moriones-red text-white'
                                        : 'bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-moriones-red'
                                    }`}
                                title={isEditing ? 'Cancel' : `Edit ${labels[slot - 1]}`}
                            >
                                <span className="material-symbols-outlined text-[12px]">{isEditing ? 'close' : 'edit_note'}</span>
                                {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                        )}

                        {isAdmin && isEditing ? (
                            <div className="p-4 pt-10">
                                <p className="text-[9px] font-black uppercase tracking-widest text-moriones-red mb-2">{labels[slot - 1]}</p>
                                <textarea
                                    value={text}
                                    onChange={e => updateWriteup(slot, e.target.value)}
                                    rows={4}
                                    autoFocus
                                    placeholder="Write a paragraph about this month's top spot…"
                                    className="w-full text-sm px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark resize-none outline-none focus:border-moriones-red transition-colors leading-relaxed"
                                />
                                <button
                                    onClick={() => handleSaveWriteup(slot)}
                                    disabled={isPending}
                                    className="mt-2 w-full bg-moriones-red text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 active:scale-[0.98] transition-all shadow-sm shadow-moriones-red/20"
                                >
                                    {isPending ? 'Saving…' : 'Save Text Block'}
                                </button>
                            </div>
                        ) : text ? (
                            <div className="flex">
                                <div className="w-1 shrink-0 bg-moriones-red/40" />
                                <p className={`px-5 py-4 text-sm text-text-muted dark:text-text-muted-dark leading-relaxed ${isAdmin ? 'pr-20' : ''}`}>
                                    {text}
                                </p>
                            </div>
                        ) : isAdmin ? (
                            <div className="w-full min-h-[52px] flex items-center justify-center opacity-40 py-3">
                                <span className="text-[10px] uppercase font-black tracking-widest">+ Add {labels[slot - 1]}</span>
                            </div>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}
