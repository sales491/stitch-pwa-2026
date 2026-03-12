'use client';

import { useState, useTransition, useRef } from 'react';
import { MUNICIPALITIES, MARKET_SCHEDULE, AVAILABILITY_TAGS, Municipality, PricesByCategory, PalengkePrice } from '@/lib/palengke-constants';
import { submitPrice, deletePrice } from '@/app/actions/palengke';

const CATEGORY_META = {
    fish:    { label: 'Fish & Seafood',      emoji: '🐟', color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-950/20',   border: 'border-blue-100 dark:border-blue-900/30' },
    produce: { label: 'Vegetables & Fruit',  emoji: '🥬', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-950/20', border: 'border-green-100 dark:border-green-900/30' },
    meat:    { label: 'Meat & Poultry',      emoji: '🥩', color: 'text-rose-600 dark:text-rose-400',   bg: 'bg-rose-50 dark:bg-rose-950/20',   border: 'border-rose-100 dark:border-rose-900/30' },
    other:   { label: 'Other Items',         emoji: '📦', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-100 dark:border-amber-900/30' },
} as const;

const UNITS = ['kg', 'pc', 'bundle', 'tray', 'dozen', 'liter', 'can'];

function fmtTime(iso: string) {
    return new Date(iso).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila' });
}

function AvailabilityBadge({ tag }: { tag: PalengkePrice['availability_tag'] }) {
    if (!tag || tag === 'available') return null;
    const meta = AVAILABILITY_TAGS[tag];
    return (
        <span className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
            {meta.emoji} {meta.label}
        </span>
    );
}

function PriceRow({ row, currentUserId, onDelete }: { row: PalengkePrice; currentUserId?: string; onDelete: (id: string) => void }) {
    const isOwner = currentUserId && row.posted_by === currentUserId;
    return (
        <div className="py-3 border-b border-slate-100 dark:border-zinc-800 last:border-0">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap mb-1">
                        <span className="font-black text-slate-900 dark:text-white text-[13px]">{row.item_name}</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-[14px]">₱{row.price}/{row.unit}</span>
                        <AvailabilityBadge tag={row.availability_tag} />
                    </div>
                    {row.stall_location && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-0.5">
                            <span>📍</span> {row.stall_location}
                        </p>
                    )}
                    {row.note && <p className="text-[11px] text-slate-400 dark:text-zinc-500 italic">{row.note}</p>}
                    <p className="text-[10px] text-slate-300 dark:text-zinc-600 mt-0.5">
                        {row.poster_name ?? 'Vendor'} · {fmtTime(row.created_at)}
                    </p>
                </div>
                {isOwner && (
                    <button
                        onClick={() => onDelete(row.id)}
                        className="text-slate-300 dark:text-zinc-600 hover:text-rose-400 transition-colors flex-shrink-0 mt-0.5"
                        aria-label="Delete"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

function CategorySection({ category, prices, currentUserId, onDelete }: {
    category: keyof typeof CATEGORY_META;
    prices: PalengkePrice[];
    currentUserId?: string;
    onDelete: (id: string) => void;
}) {
    const meta = CATEGORY_META[category];
    if (prices.length === 0) return null;
    return (
        <div className={`rounded-2xl border ${meta.border} overflow-hidden`}>
            <div className={`${meta.bg} px-4 py-2 flex items-center gap-2`}>
                <span>{meta.emoji}</span>
                <span className={`text-[10px] font-black uppercase tracking-wider ${meta.color}`}>{meta.label}</span>
                <span className="ml-auto text-[10px] text-slate-400 dark:text-zinc-500">{prices.length} listing{prices.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="bg-white dark:bg-zinc-900 px-4">
                {prices.map(p => <PriceRow key={p.id} row={p} currentUserId={currentUserId} onDelete={onDelete} />)}
            </div>
        </div>
    );
}

type Props = {
    initialMuni: Municipality;
    initialPrices: PricesByCategory;
    currentUserId?: string;
    isLoggedIn: boolean;
};

export default function PalengkeDisplay({ initialMuni, initialPrices, currentUserId, isLoggedIn }: Props) {
    const [activeMuni, setActiveMuni] = useState<Municipality>(initialMuni);
    const [pricesByMuni, setPricesByMuni] = useState<Record<string, PricesByCategory>>({ [initialMuni]: initialPrices });
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [showPosted, setShowPosted] = useState(false);
    const [, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    const prices = pricesByMuni[activeMuni];
    const schedule = MARKET_SCHEDULE[activeMuni];
    const hasAny = prices && Object.values(prices).some(arr => arr.length > 0);

    async function switchMuni(muni: Municipality) {
        setActiveMuni(muni);
        if (pricesByMuni[muni]) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/palengke-prices?municipality=${encodeURIComponent(muni)}`);
            const data = await res.json();
            setPricesByMuni(prev => ({ ...prev, [muni]: data }));
        } catch {
            setPricesByMuni(prev => ({ ...prev, [muni]: { fish: [], produce: [], meat: [], other: [] } }));
        }
        setLoading(false);
    }

    function handleDelete(id: string) {
        startTransition(async () => {
            await deletePrice(id);
            setPricesByMuni(prev => {
                const current = prev[activeMuni];
                if (!current) return prev;
                const remove = (arr: PalengkePrice[]) => arr.filter(p => p.id !== id);
                return { ...prev, [activeMuni]: { fish: remove(current.fish), produce: remove(current.produce), meat: remove(current.meat), other: remove(current.other) } };
            });
        });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormError(null);
        const fd = new FormData(e.currentTarget);
        fd.set('municipality', activeMuni);
        const result = await submitPrice(fd);
        if (result.error) { setFormError(result.error); return; }
        setLoading(true);
        try {
            const res = await fetch(`/api/palengke-prices?municipality=${encodeURIComponent(activeMuni)}`);
            const data = await res.json();
            setPricesByMuni(prev => ({ ...prev, [activeMuni]: data }));
        } catch {}
        setLoading(false);
        setShowForm(false);
        setShowPosted(true);
        setTimeout(() => setShowPosted(false), 2500);
        formRef.current?.reset();
    }

    return (
        <div className="pb-8">
            {/* Municipality tabs */}
            <div className="overflow-x-auto px-4 pt-4 pb-2">
                <div className="flex gap-2 min-w-max">
                    {MUNICIPALITIES.map(m => (
                        <button
                            key={m}
                            onClick={() => switchMuni(m)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-black whitespace-nowrap transition-all ${
                                activeMuni === m
                                    ? 'bg-orange-500 text-white shadow-sm'
                                    : 'bg-white dark:bg-zinc-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-zinc-800'
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Market schedule strip */}
            <div className="mx-4 mt-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <span className="text-xl">🕗</span>
                <div className="flex-1">
                    <span className="text-[11px] font-black text-slate-900 dark:text-white">{schedule.schedule}</span>
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500"> · {schedule.tip}</span>
                </div>
            </div>

            {/* Prices area */}
            <div className="px-4 mt-4 space-y-3">
                {loading ? (
                    <div className="text-center py-10 text-slate-400 text-[12px]">Loading listings…</div>
                ) : hasAny ? (
                    <>
                        {(Object.keys(CATEGORY_META) as Array<keyof typeof CATEGORY_META>).map(cat => (
                            <CategorySection
                                key={cat}
                                category={cat}
                                prices={prices[cat]}
                                currentUserId={currentUserId}
                                onDelete={handleDelete}
                            />
                        ))}
                    </>
                ) : (
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-8 text-center">
                        <p className="text-3xl mb-2">🐟</p>
                        <p className="font-black text-slate-900 dark:text-white text-[13px] mb-1">No vendor listings yet today</p>
                        <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                            {isLoggedIn ? 'Selling at the palengke today? Post your items!' : 'Log in to post your items for sale.'}
                        </p>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-300 dark:text-zinc-600">Vendor listings from the last 24 hours · {activeMuni}</p>
                </div>
            </div>

            {/* Post listing button */}
            {isLoggedIn && !showForm && (
                <div className="fixed bottom-24 right-4 z-30 flex flex-col items-end gap-2">
                    {showPosted && (
                        <div className="flex items-center gap-2 bg-green-500 text-white text-[11px] font-black px-3 py-2 rounded-xl shadow-lg animate-fade-in">
                            <span>✓</span> Price posted!
                        </div>
                    )}
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-[13px] px-4 py-3 rounded-2xl shadow-lg transition-all active:scale-95"
                    >
                        <span className="text-lg">＋</span> Post My Items
                    </button>
                </div>
            )}

            {/* Vendor post form sheet */}
            {showForm && (
                <div className="fixed inset-0 z-[200] flex items-end" onClick={() => setShowForm(false)}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative w-full flex flex-col">
                        <div
                            className="w-full bg-white dark:bg-zinc-900 rounded-t-3xl px-4 pt-5 pb-4 shadow-2xl max-h-[calc(85vh-72px)] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-10 h-1 bg-slate-200 dark:bg-zinc-700 rounded-full mx-auto mb-4" />
                            <p className="font-black text-slate-900 dark:text-white text-[16px] mb-0.5">Post Your Items</p>
                            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mb-4">{activeMuni} palengke · today</p>

                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Category</label>
                                    <select name="category" required className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-[13px] text-slate-900 dark:text-white font-bold">
                                        <option value="fish">🐟 Fish & Seafood</option>
                                        <option value="produce">🥬 Vegetables & Fruit</option>
                                        <option value="meat">🥩 Meat & Poultry</option>
                                        <option value="other">📦 Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Item name *</label>
                                    <input name="item_name" required placeholder="e.g. Yellowfin Tuna, Kangkong, Bangus" className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-[13px] text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-600" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Price (₱) *</label>
                                        <input name="price" type="number" required min="1" step="0.5" placeholder="e.g. 250" className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-[13px] text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-600" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Per</label>
                                        <select name="unit" className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-[13px] text-slate-900 dark:text-white font-bold">
                                            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Availability</label>
                                    <select name="availability_tag" className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-[13px] text-slate-900 dark:text-white font-bold">
                                        <option value="available">✅ Available</option>
                                        <option value="just_arrived">🚨 Just Arrived</option>
                                        <option value="fresh_today">🌊 Fresh Today</option>
                                        <option value="limited">⚠️ Limited Stock</option>
                                        <option value="preorder">📋 Pre-order</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Your stall / location</label>
                                    <input name="stall_location" placeholder="e.g. Stall 12, near the entrance, 2nd row" className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-[13px] text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-600" />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Note (optional)</label>
                                    <input name="note" placeholder="e.g. Caught this morning, very fresh" className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-[13px] text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-600" />
                                </div>

                                {formError && <p className="text-[12px] text-rose-500 font-bold">{formError}</p>}
                                <div className="flex gap-3 pt-1">
                                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 font-black text-[13px] py-3 rounded-xl">Cancel</button>
                                    <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-black text-[13px] py-3 rounded-xl transition-colors">Post Listing</button>
                                </div>
                            </form>
                        </div>
                        {/* Spacer fills nav bar area */}
                        <div className="h-[72px] bg-white dark:bg-zinc-900 flex-shrink-0" onClick={e => e.stopPropagation()} />
                    </div>
                </div>
            )}

            {/* Login prompt for unauthenticated */}
            {!isLoggedIn && (
                <div className="mx-4 mt-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl px-4 py-3 flex items-center gap-3">
                    <span className="text-xl">🛒</span>
                    <div>
                        <p className="text-[12px] font-black text-slate-900 dark:text-white">Selling at the palengke today?</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400"><a href="/login" className="text-orange-500 font-bold">Log in</a> to post your items and reach more buyers.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
