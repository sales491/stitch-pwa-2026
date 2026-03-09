'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { updateWinnerWriteup, swapWinnerBusiness } from '@/app/actions/spotlight';

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

export default function WinnerAdminControls({
    monthYear,
    writeup1: initialWriteup1,
    writeup2: initialWriteup2,
    allBusinesses,
}: Props) {
    const [writeups, setWriteups] = useState<[string, string]>([initialWriteup1, initialWriteup2]);
    const [editingSlot, setEditingSlot] = useState<1 | 2 | null>(null);
    const [swapping, setSwapping] = useState(false);
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
            await updateWinnerWriteup(monthYear, slot, writeups[slot - 1]);
            setEditingSlot(null);
            flash(`Text ${slot} saved ✓`);
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

    function updateWriteup(slot: 1 | 2, val: string) {
        setWriteups(prev => slot === 1 ? [val, prev[1]] : [prev[0], val]);
    }

    return (
        <div className="mt-3 space-y-3">
            {/* Admin badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 rounded-xl">
                <span className="material-symbols-outlined text-white text-[14px]">admin_panel_settings</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/70">
                    Winner Controls · {monthYear}
                </span>
                {savedMsg && (
                    <span className="ml-auto text-[9px] font-black text-emerald-400">{savedMsg}</span>
                )}
            </div>

            {/* Swap winner button */}
            <button
                onClick={() => { setSwapping(v => !v); setSearch(''); }}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
          ${swapping
                        ? 'bg-moriones-red text-white shadow-sm shadow-moriones-red/30'
                        : 'bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-muted dark:text-text-muted-dark'
                    }`}
            >
                <span className="material-symbols-outlined text-[15px]">swap_horiz</span>
                {swapping ? 'Cancel Swap' : 'Swap Featured Winner'}
            </button>

            {/* Business picker */}
            {swapping && (
                <div className="bg-surface-light dark:bg-surface-dark border border-moriones-red/30 rounded-2xl p-4 shadow-lg">
                    <p className="text-[9px] font-black uppercase tracking-widest text-moriones-red mb-2">
                        Select New Monthly Top Spot
                    </p>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or type..."
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark mb-3 outline-none focus:border-moriones-red transition-colors"
                        autoFocus
                    />
                    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                        {filtered.length === 0 && (
                            <p className="text-xs text-text-muted dark:text-text-muted-dark px-2 py-3 text-center">
                                No businesses found
                            </p>
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
                                    <p className="text-xs font-black text-text-main dark:text-text-main-dark truncate group-hover:text-moriones-red transition-colors">
                                        {b.business_name}
                                    </p>
                                    <p className="text-[10px] text-text-muted dark:text-text-muted-dark truncate">
                                        {b.business_type ?? 'Local Business'}
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-[16px] text-moriones-red/40 group-hover:text-moriones-red transition-colors">
                                    chevron_right
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Two stacked write-up editors */}
            {([1, 2] as const).map(slot => {
                const isEditing = editingSlot === slot;
                const text = writeups[slot - 1];
                const label = slot === 1 ? 'First Text Block' : 'Second Text Block';

                return (
                    <div
                        key={slot}
                        className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-moriones-red text-[15px]">article</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-moriones-red">
                                    {label}
                                </span>
                            </div>
                            <button
                                onClick={() => setEditingSlot(isEditing ? null : slot)}
                                className={`flex items-center gap-0.5 text-[9px] font-black uppercase tracking-widest transition-colors
                  ${isEditing ? 'text-moriones-red' : 'text-text-muted dark:text-text-muted-dark hover:text-moriones-red'}`}
                            >
                                <span className="material-symbols-outlined text-[12px]">{isEditing ? 'close' : 'edit'}</span>
                                {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        {isEditing ? (
                            <>
                                <textarea
                                    value={text}
                                    onChange={e => updateWriteup(slot, e.target.value)}
                                    rows={4}
                                    placeholder={`Write a paragraph about this month's top spot…`}
                                    className="w-full text-sm px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark resize-none outline-none focus:border-moriones-red transition-colors leading-relaxed"
                                />
                                <button
                                    onClick={() => handleSaveWriteup(slot)}
                                    disabled={isPending}
                                    className="mt-2 w-full bg-moriones-red text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 active:scale-[0.98] transition-all shadow-sm shadow-moriones-red/20"
                                >
                                    {isPending ? 'Saving…' : 'Save Text Block'}
                                </button>
                            </>
                        ) : (
                            <p className={`text-sm leading-relaxed ${text
                                    ? 'text-text-muted dark:text-text-muted-dark'
                                    : 'text-text-muted/40 dark:text-text-muted-dark/40 italic'
                                }`}>
                                {text || 'No text yet. Click Edit to add some.'}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
