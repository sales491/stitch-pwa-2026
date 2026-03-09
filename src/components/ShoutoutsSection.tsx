'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { updateSpotlightWriteup, swapSpotlightBusiness } from '@/app/actions/spotlight';

// ── Types ──────────────────────────────────────────────────────────────────────

export type ShoutoutItem = {
    id: string;
    name: string;
    type: string;
    image: string;
    rating: number;
    reviewCount: number;
    href: string;
    isMock: boolean;
};

type PickerBusiness = {
    id: string;
    business_name: string;
    business_type: string | null;
    gallery_image: string | null;
};

type Props = {
    shoutouts: ShoutoutItem[];
    writeup1: string;
    writeup2: string;
    monthYear: string;
    isAdmin: boolean;
    allBusinesses: PickerBusiness[];
};

// ── StarRow helper ─────────────────────────────────────────────────────────────

function StarRow({ rating, count }: { rating: number; count: number }) {
    const r = Math.round(rating);
    if (rating === 0 && !count) return null;
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
            {rating > 0 && (
                <span className="text-[10px] font-black ml-0.5 text-text-main dark:text-text-main-dark">
                    {rating.toFixed(1)}
                </span>
            )}
            <span className="text-[10px] text-text-muted dark:text-text-muted-dark">({count})</span>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ShoutoutsSection({
    shoutouts,
    writeup1: initialWriteup1,
    writeup2: initialWriteup2,
    monthYear,
    isAdmin,
    allBusinesses,
}: Props) {
    // Which slot's business picker is open (null = none)
    const [swappingSlot, setSwappingSlot] = useState<1 | 2 | null>(null);
    // Which slot's writeup editor is open (null = none)
    const [editingSlot, setEditingSlot] = useState<1 | 2 | null>(null);

    const [writeups, setWriteups] = useState<[string, string]>([initialWriteup1, initialWriteup2]);
    const [search, setSearch] = useState('');
    const [savedMsg, setSavedMsg] = useState('');
    const [isPending, startTransition] = useTransition();

    const filtered = allBusinesses.filter(b =>
        b.business_name.toLowerCase().includes(search.toLowerCase()) ||
        (b.business_type ?? '').toLowerCase().includes(search.toLowerCase())
    );

    function flash(msg: string) {
        setSavedMsg(msg);
        setTimeout(() => setSavedMsg(''), 2500);
    }

    function toggleSwap(slot: 1 | 2) {
        setSwappingSlot(prev => prev === slot ? null : slot);
        setEditingSlot(null);
        setSearch('');
    }

    function toggleEdit(slot: 1 | 2) {
        setEditingSlot(prev => prev === slot ? null : slot);
        setSwappingSlot(null);
    }

    function updateWriteup(slot: 1 | 2, val: string) {
        setWriteups(prev => slot === 1 ? [val, prev[1]] : [prev[0], val]);
    }

    function handleSaveWriteup(slot: 1 | 2) {
        startTransition(async () => {
            await updateSpotlightWriteup(monthYear, slot, writeups[slot - 1]);
            setEditingSlot(null);
            flash(`Slot ${slot} saved ✓`);
        });
    }

    function handleSwap(slot: 1 | 2, businessId: string) {
        startTransition(async () => {
            await swapSpotlightBusiness(monthYear, slot, businessId);
            setSwappingSlot(null);
            setSearch('');
            flash(`Slot ${slot} updated ✓`);
        });
    }

    if (shoutouts.length === 0) return null;

    const cols = shoutouts.length === 1 ? 'grid-cols-1' : 'grid-cols-2';

    return (
        <div className="mt-10 px-4">

            {/* ── Section header ── */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-moriones-red flex items-center justify-center shadow-md shadow-moriones-red/30">
                        <span className="material-symbols-outlined text-white text-[22px]" style={{ fontVariationSettings: '"FILL" 1' }}>grade</span>
                    </div>
                    <h2 className="text-lg font-black text-text-main dark:text-text-main-dark">Shoutouts</h2>
                </div>
                <div className="flex items-center gap-2">
                    {savedMsg && (
                        <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg animate-pulse">
                            {savedMsg}
                        </span>
                    )}
                    <Link href="/directory" className="text-[10px] font-black text-moriones-red uppercase tracking-[0.2em] hover:underline">
                        View All
                    </Link>
                </div>
            </div>

            {/* ── 2-column grid: each column = card + writeup ── */}
            <div className={`grid gap-3 ${cols}`}>
                {shoutouts.map((biz, i) => {
                    const slot = (i + 1) as 1 | 2;
                    const writeupText = i === 0 ? writeups[0] : writeups[1];
                    const isSwapping = swappingSlot === slot;
                    const isEditing = editingSlot === slot;

                    return (
                        <div key={biz.id} className="flex flex-col gap-2">

                            {/* ── Business card ── */}
                            <div className="relative flex flex-col bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group/shoutout">

                                {/* Image area */}
                                <div className="relative h-28 bg-background-light dark:bg-background-dark">
                                    {biz.image ? (
                                        <Image src={biz.image} alt={biz.name} fill className="object-cover" sizes="50vw" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-moriones-red/5">
                                            <span className="material-symbols-outlined text-moriones-red/30 text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>store</span>
                                        </div>
                                    )}

                                    {!biz.isMock && (
                                        <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-moriones-red flex items-center justify-center shadow-md border border-surface-light dark:border-surface-dark">
                                            <span className="material-symbols-outlined text-white text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                                        </div>
                                    )}

                                    {/* Admin Replace overlay — clicking opens business picker for this slot */}
                                    {isAdmin && (
                                        <button
                                            onClick={() => toggleSwap(slot)}
                                            className={`absolute top-2 left-2 text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl flex items-center gap-1 z-10 shadow-xl transition-all active:scale-95 ${isSwapping
                                                    ? 'bg-moriones-red text-white'
                                                    : 'bg-slate-900/80 backdrop-blur-md text-white'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
                                            {isSwapping ? 'Cancel' : 'Replace'}
                                        </button>
                                    )}
                                </div>

                                {/* Card text — tap to navigate */}
                                <Link href={biz.href} className="p-3 flex flex-col flex-1 hover:bg-moriones-red/5 transition-colors">
                                    <p className="text-[9px] text-moriones-red font-black uppercase tracking-tight mb-0.5">{biz.type}</p>
                                    <h4 className="font-black text-text-main dark:text-text-main-dark text-xs leading-snug mb-auto">{biz.name}</h4>
                                    <div className="mt-2">
                                        <StarRow rating={biz.rating} count={biz.reviewCount} />
                                    </div>
                                </Link>
                            </div>

                            {/* ── Business picker (opens inline below card) ── */}
                            {isAdmin && isSwapping && (
                                <div className="bg-surface-light dark:bg-surface-dark border border-moriones-red/40 rounded-2xl p-4 shadow-lg">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-moriones-red mb-2">
                                        Select Business for Slot {slot}
                                    </p>
                                    <input
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Search name or type…"
                                        autoFocus
                                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark mb-3 outline-none focus:border-moriones-red transition-colors"
                                    />
                                    <div className="flex flex-col gap-1 max-h-44 overflow-y-auto">
                                        {filtered.length === 0 && (
                                            <p className="text-xs text-text-muted dark:text-text-muted-dark px-2 py-3 text-center">No matches</p>
                                        )}
                                        {filtered.slice(0, 15).map(b => (
                                            <button
                                                key={b.id}
                                                onClick={() => handleSwap(slot, b.id)}
                                                disabled={isPending}
                                                className="flex items-center gap-3 text-left px-3 py-2 rounded-xl hover:bg-moriones-red/5 active:bg-moriones-red/10 transition-colors disabled:opacity-50 group"
                                            >
                                                <div className="w-9 h-9 rounded-lg overflow-hidden bg-background-light dark:bg-background-dark shrink-0">
                                                    {b.gallery_image ? (
                                                        <Image src={b.gallery_image} alt={b.business_name} width={36} height={36} className="object-cover w-full h-full" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-moriones-red/30 text-sm">store</span>
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

                            {/* ── Writeup block — clicking the edit icon opens editor inline ── */}
                            <div
                                className={`relative rounded-2xl border overflow-hidden flex flex-col transition-all ${writeupText
                                        ? 'border-moriones-red/20 bg-surface-light dark:bg-surface-dark'
                                        : 'border-dashed border-border-light dark:border-border-dark bg-transparent'
                                    }`}
                            >
                                {/* Admin edit icon — always visible for admin */}
                                {isAdmin && (
                                    <button
                                        onClick={() => toggleEdit(slot)}
                                        className={`absolute right-2 top-2 p-1.5 rounded-lg border z-10 shadow-sm transition-all active:scale-95 ${isEditing
                                                ? 'bg-moriones-red border-moriones-red text-white'
                                                : 'bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-moriones-red'
                                            }`}
                                        title={isEditing ? 'Cancel editing' : 'Edit writeup'}
                                    >
                                        <span className="material-symbols-outlined text-[13px]">{isEditing ? 'close' : 'edit_note'}</span>
                                    </button>
                                )}

                                {/* Editor mode */}
                                {isAdmin && isEditing ? (
                                    <div className="p-3 pt-10">
                                        <textarea
                                            value={writeupText}
                                            onChange={e => updateWriteup(slot, e.target.value)}
                                            rows={4}
                                            autoFocus
                                            placeholder="Write a few sentences about this business…"
                                            className="w-full text-xs px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark resize-none outline-none focus:border-moriones-red transition-colors leading-relaxed"
                                        />
                                        <button
                                            onClick={() => handleSaveWriteup(slot)}
                                            disabled={isPending}
                                            className="mt-2 w-full bg-moriones-red text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-widest disabled:opacity-50 active:scale-[0.98] transition-all shadow-sm shadow-moriones-red/20"
                                        >
                                            {isPending ? 'Saving…' : 'Save Writeup'}
                                        </button>
                                    </div>
                                ) : writeupText ? (
                                    <div className="flex">
                                        <div className="w-1 shrink-0 bg-moriones-red/40" />
                                        <p className={`px-4 py-3 text-xs text-text-muted dark:text-text-muted-dark leading-relaxed ${isAdmin ? 'pr-10' : ''}`}>
                                            {writeupText}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="w-full min-h-[48px] flex items-center justify-center opacity-40 py-3">
                                        {isAdmin && <span className="text-[10px] uppercase font-black tracking-widest">+ Add Writeup</span>}
                                    </div>
                                )}
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}
