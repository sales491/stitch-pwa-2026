'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { updateSpotlightWriteup, swapSpotlightBusiness } from '@/app/actions/spotlight';

type PickerBusiness = {
    id: string;
    business_name: string;
    business_type: string | null;
    gallery_image: string | null;
};

type Props = {
    monthYear: string;
    writeup1: string;
    writeup2: string;
    allBusinesses: PickerBusiness[];
};

export default function ShoutoutAdminControls({
    monthYear,
    writeup1: initialWriteup1,
    writeup2: initialWriteup2,
    allBusinesses,
}: Props) {
    const [writeups, setWriteups] = useState<[string, string]>([initialWriteup1, initialWriteup2]);
    const [editingSlot, setEditingSlot] = useState<1 | 2 | null>(null);
    const [swappingSlot, setSwappingSlot] = useState<1 | 2 | null>(null);
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

    function handleSaveWriteup(slot: 1 | 2) {
        startTransition(async () => {
            await updateSpotlightWriteup(monthYear, slot, writeups[slot - 1]);
            setEditingSlot(null);
            flash(`Slot ${slot} write-up saved ✓`);
        });
    }

    function handleSwap(slot: 1 | 2, businessId: string) {
        startTransition(async () => {
            await swapSpotlightBusiness(monthYear, slot, businessId);
            setSwappingSlot(null);
            setSearch('');
            flash(`Slot ${slot} business updated ✓`);
        });
    }

    function updateWriteup(slot: 1 | 2, val: string) {
        setWriteups(prev => slot === 1 ? [val, prev[1]] : [prev[0], val]);
    }

    return (
        <div className="mt-3 space-y-3">
            {/* Admin badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 rounded-xl">
                <span className="material-symbols-outlined text-white text-[14px]">admin_panel_settings</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/70">
                    Admin Controls · {monthYear}
                </span>
                {savedMsg && (
                    <span className="ml-auto text-[9px] font-black text-emerald-400">{savedMsg}</span>
                )}
            </div>

            {/* Swap buttons — 2-column to match card grid */}
            <div className="grid grid-cols-2 gap-3">
                {([1, 2] as const).map(slot => (
                    <button
                        key={slot}
                        onClick={() => {
                            setSwappingSlot(prev => (prev === slot ? null : slot));
                            setSearch('');
                        }}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
              ${swappingSlot === slot
                                ? 'bg-moriones-red text-white shadow-sm shadow-moriones-red/30'
                                : 'bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-muted dark:text-text-muted-dark'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[13px]">swap_horiz</span>
                        Swap Slot {slot}
                    </button>
                ))}
            </div>

            {/* Business picker — full-width below both swap buttons */}
            {swappingSlot !== null && (
                <div className="bg-surface-light dark:bg-surface-dark border border-moriones-red/30 rounded-2xl p-4 shadow-lg">
                    <p className="text-[9px] font-black uppercase tracking-widest text-moriones-red mb-2">
                        Select Business for Slot {swappingSlot}
                    </p>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or type..."
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark mb-3 outline-none focus:border-moriones-red transition-colors"
                        autoFocus
                    />
                    <div className="flex flex-col gap-1 max-h-44 overflow-y-auto">
                        {filtered.length === 0 && (
                            <p className="text-xs text-text-muted dark:text-text-muted-dark px-2 py-3 text-center">No businesses found</p>
                        )}
                        {filtered.slice(0, 15).map(b => (
                            <button
                                key={b.id}
                                onClick={() => handleSwap(swappingSlot!, b.id)}
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
                                    <p className="text-xs font-black text-text-main dark:text-text-main-dark truncate group-hover:text-moriones-red transition-colors">
                                        {b.business_name}
                                    </p>
                                    <p className="text-[10px] text-text-muted dark:text-text-muted-dark truncate">
                                        {b.business_type ?? 'Local Business'}
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-[16px] text-moriones-red/40 group-hover:text-moriones-red transition-colors">chevron_right</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Per-slot write-up editors — 2-column matching card layout */}
            <div className="grid grid-cols-2 gap-3">
                {([1, 2] as const).map(slot => {
                    const isEditing = editingSlot === slot;
                    const text = writeups[slot - 1];
                    return (
                        <div
                            key={slot}
                            className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-3"
                        >
                            {/* Editor header */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-moriones-red">
                                    Write-up {slot}
                                </span>
                                <button
                                    onClick={() => setEditingSlot(isEditing ? null : slot)}
                                    className="text-[8px] font-black uppercase tracking-widest text-text-muted dark:text-text-muted-dark hover:text-moriones-red transition-colors flex items-center gap-0.5"
                                >
                                    <span className="material-symbols-outlined text-[11px]">{isEditing ? 'close' : 'edit'}</span>
                                    {isEditing ? 'Cancel' : 'Edit'}
                                </button>
                            </div>

                            {isEditing ? (
                                <>
                                    <textarea
                                        value={text}
                                        onChange={e => updateWriteup(slot, e.target.value)}
                                        rows={4}
                                        placeholder={`Write a few sentences about this business…`}
                                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark resize-none outline-none focus:border-moriones-red transition-colors leading-relaxed"
                                    />
                                    <button
                                        onClick={() => handleSaveWriteup(slot)}
                                        disabled={isPending}
                                        className="mt-2 w-full bg-moriones-red text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-widest disabled:opacity-50 active:scale-[0.98] transition-all"
                                    >
                                        {isPending ? 'Saving…' : 'Save'}
                                    </button>
                                </>
                            ) : (
                                <p className={`text-[10px] leading-relaxed ${text ? 'text-text-muted dark:text-text-muted-dark' : 'text-text-muted/40 dark:text-text-muted-dark/40 italic'}`}>
                                    {text || 'No write-up yet.'}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
