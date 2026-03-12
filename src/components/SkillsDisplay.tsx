'use client';

import { useState, useTransition, useRef } from 'react';
import { MUNICIPALITIES, SKILL_CATEGORIES, SkillListing, SkillCategory, Municipality } from '@/lib/skills-constants';
import { postSkillListing, deleteSkillListing } from '@/app/actions/skills';

const ALL_CATS = [
    { key: 'all', label: 'All', emoji: '✨' },
    ...Object.entries(SKILL_CATEGORIES).map(([k, v]) => ({ key: k as SkillCategory, label: v.label.split(' ')[0], emoji: v.emoji })),
];

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', timeZone: 'Asia/Manila' });
}

function SkillCard({ listing, currentUserId, onDelete }: { listing: SkillListing; currentUserId?: string; onDelete: (id: string) => void }) {
    const isOwner = currentUserId && listing.posted_by === currentUserId;
    const meta = SKILL_CATEGORIES[listing.category];

    return (
        <div className={`bg-white dark:bg-zinc-900 border ${meta.border} rounded-2xl overflow-hidden`}>
            {/* Category header strip */}
            <div className={`${meta.bg} px-4 py-2 flex items-center gap-2`}>
                <span className="text-[15px]">{meta.emoji}</span>
                <span className={`text-[10px] font-black uppercase tracking-wider ${meta.color}`}>{meta.label}</span>
                <span className="ml-auto text-[10px] text-slate-400 dark:text-zinc-500">📍 {listing.municipality}</span>
            </div>

            <div className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-black text-slate-900 dark:text-white text-[15px] leading-snug">{listing.skill_name}</h3>
                        {listing.rate && (
                            <p className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{listing.rate}</p>
                        )}
                    </div>
                    {isOwner && (
                        <button
                            onClick={() => onDelete(listing.id)}
                            className="text-slate-300 dark:text-zinc-600 hover:text-rose-400 transition-colors flex-shrink-0"
                            aria-label="Remove listing"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>

                <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">{listing.description}</p>

                {listing.availability && (
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1.5 flex items-center gap-1">
                        <span>🕐</span> {listing.availability}
                    </p>
                )}

                {/* Contact + meta row */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        {listing.contact?.phone && (
                            <a
                                href={`tel:${listing.contact.phone}`}
                                className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-2.5 py-1.5 rounded-lg"
                            >
                                📱 Call
                            </a>
                        )}
                        {listing.contact?.fbUsername && (
                            <a
                                href={`https://m.me/${listing.contact.fbUsername}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-[11px] font-bold px-2.5 py-1.5 rounded-lg"
                            >
                                💬 Message
                            </a>
                        )}
                    </div>
                    <p className="text-[10px] text-slate-300 dark:text-zinc-600">{listing.poster_name ?? 'Local'} · {fmtDate(listing.created_at)}</p>
                </div>
            </div>
        </div>
    );
}

type Props = {
    initialListings: SkillListing[];
    currentUserId?: string;
    isLoggedIn: boolean;
};

export default function SkillsDisplay({ initialListings, currentUserId, isLoggedIn }: Props) {
    const [activeMuni, setActiveMuni] = useState<Municipality>('Boac');
    const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
    const [listingsByMuni, setListingsByMuni] = useState<Record<string, SkillListing[]>>({ Boac: initialListings });
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [showPosted, setShowPosted] = useState(false);
    const [, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    const allForMuni = listingsByMuni[activeMuni] ?? [];
    const filtered = activeCategory === 'all'
        ? allForMuni
        : allForMuni.filter(l => l.category === activeCategory);

    async function switchMuni(muni: Municipality) {
        setActiveMuni(muni);
        if (listingsByMuni[muni]) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/skills?municipality=${encodeURIComponent(muni)}`);
            const data = await res.json();
            setListingsByMuni(prev => ({ ...prev, [muni]: data }));
        } catch {
            setListingsByMuni(prev => ({ ...prev, [muni]: [] }));
        }
        setLoading(false);
    }

    async function switchCategory(cat: SkillCategory | 'all') {
        setActiveCategory(cat);
        // If we already have listings for this muni, filter client-side
        // If not loaded yet, fetch with category filter
        if (!listingsByMuni[activeMuni]) {
            setLoading(true);
            try {
                const params = new URLSearchParams({ municipality: activeMuni });
                if (cat !== 'all') params.set('category', cat);
                const res = await fetch(`/api/skills?${params}`);
                const data = await res.json();
                setListingsByMuni(prev => ({ ...prev, [activeMuni]: data }));
            } catch {
                setListingsByMuni(prev => ({ ...prev, [activeMuni]: [] }));
            }
            setLoading(false);
        }
    }

    function handleDelete(id: string) {
        startTransition(async () => {
            await deleteSkillListing(id);
            setListingsByMuni(prev => ({
                ...prev,
                [activeMuni]: (prev[activeMuni] ?? []).filter(l => l.id !== id),
            }));
        });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormError(null);
        const fd = new FormData(e.currentTarget);
        const result = await postSkillListing(fd);
        if (result.error) { setFormError(result.error); return; }

        // Reload for the selected municipality of the new listing
        const newMuni = fd.get('municipality') as Municipality;
        setLoading(true);
        try {
            const res = await fetch(`/api/skills?municipality=${encodeURIComponent(newMuni)}`);
            const data = await res.json();
            setListingsByMuni(prev => ({ ...prev, [newMuni]: data }));
            setActiveMuni(newMuni);
            setActiveCategory('all');
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
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-zinc-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-zinc-800'
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category filter pills */}
            <div className="overflow-x-auto px-4 pb-3">
                <div className="flex gap-2 min-w-max">
                    {ALL_CATS.map(c => (
                        <button
                            key={c.key}
                            onClick={() => switchCategory(c.key as any)}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                                activeCategory === c.key
                                    ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                                    : 'bg-white dark:bg-zinc-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-zinc-800'
                            }`}
                        >
                            <span>{c.emoji}</span> {c.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Listings */}
            <div className="px-4 space-y-3">
                {loading ? (
                    <div className="text-center py-10 text-slate-400 text-[12px]">Loading skills…</div>
                ) : filtered.length > 0 ? (
                    filtered.map(l => (
                        <SkillCard
                            key={l.id}
                            listing={l}
                            currentUserId={currentUserId}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-8 text-center">
                        <p className="text-3xl mb-2">🛠️</p>
                        <p className="font-black text-slate-900 dark:text-white text-[13px] mb-1">No skills listed here yet</p>
                        <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                            {isLoggedIn
                                ? 'Have a skill to share? Be the first to post in ' + activeMuni + '!'
                                : 'Log in to post your skills and reach the community.'}
                        </p>
                    </div>
                )}

                <p className="text-[10px] text-slate-300 dark:text-zinc-600 pt-1">
                    {filtered.length} listing{filtered.length !== 1 ? 's' : ''} · {activeMuni} · listings active for 60 days
                </p>
            </div>

            {/* Offer Skills FAB */}
            {isLoggedIn && !showForm && (
                <div className="fixed bottom-24 right-4 z-30 flex flex-col items-end gap-2">
                    {showPosted && (
                        <div className="flex items-center gap-2 bg-green-500 text-white text-[11px] font-black px-3 py-2 rounded-xl shadow-lg animate-fade-in">
                            <span>✓</span> Listing posted!
                        </div>
                    )}
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-[13px] px-4 py-3 rounded-2xl shadow-lg transition-all active:scale-95"
                    >
                        <span className="text-lg">＋</span> Offer My Skills
                    </button>
                </div>
            )}

            {/* Post skill form sheet */}
            {showForm && (
                <div className="fixed inset-0 z-[200] flex items-end" onClick={() => setShowForm(false)}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative w-full flex flex-col">
                        <div
                            className="w-full bg-white dark:bg-zinc-900 rounded-t-3xl px-4 pt-5 pb-4 shadow-2xl max-h-[calc(85vh-72px)] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-10 h-1 bg-slate-200 dark:bg-zinc-700 rounded-full mx-auto mb-4" />
                            <p className="font-black text-slate-900 dark:text-white text-[16px] mb-0.5">Offer My Skills</p>
                            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mb-4">Your listing will be active for 60 days</p>

                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Category *</label>
                                        <select name="category" required className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-[13px] text-slate-900 dark:text-white font-bold">
                                            {Object.entries(SKILL_CATEGORIES).map(([k, v]) => (
                                                <option key={k} value={k}>{v.emoji} {v.label.split(' ')[0]}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Municipality *</label>
                                        <select name="municipality" defaultValue={activeMuni} required className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-[13px] text-slate-900 dark:text-white font-bold">
                                            {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Skill / Service name *</label>
                                    <input name="skill_name" required placeholder="e.g. Guitar Lessons, Motorcycle Repair, Custom Kakanin" className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-[13px] text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-600" />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Description *</label>
                                    <textarea name="description" required rows={3} placeholder="Tell people what you offer, your experience, and anything else useful…" className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-[13px] text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-600 resize-none" />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Rate (optional)</label>
                                        <input name="rate" placeholder="e.g. ₱200/hr, Negotiable" className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-[13px] text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-600" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Availability (optional)</label>
                                        <input name="availability" placeholder="e.g. Weekends, Mornings" className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-[13px] text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-600" />
                                    </div>
                                </div>

                                {/* Contact — at least one required */}
                                <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-3 space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Contact (at least one) *</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 text-[13px] w-5">📱</span>
                                        <input name="phone" type="tel" placeholder="Phone number" className="flex-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-[13px] text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-600" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400 text-[13px] w-5">💬</span>
                                        <div className="flex-1 flex items-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg overflow-hidden">
                                            <span className="px-2 text-[11px] text-slate-400 border-r border-slate-200 dark:border-zinc-700 py-2 shrink-0">m.me/</span>
                                            <input name="fbUsername" placeholder="your.username" className="flex-1 bg-transparent px-2 py-2 text-[13px] text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-600 outline-none" />
                                        </div>
                                    </div>
                                </div>

                                {formError && <p className="text-[12px] text-rose-500 font-bold">{formError}</p>}

                                <div className="flex gap-3 pt-1">
                                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 font-black text-[13px] py-3 rounded-xl">Cancel</button>
                                    <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black text-[13px] py-3 rounded-xl transition-colors">Post Listing</button>
                                </div>
                            </form>
                        </div>
                        {/* Nav spacer */}
                        <div className="h-[72px] bg-white dark:bg-zinc-900 flex-shrink-0" onClick={e => e.stopPropagation()} />
                    </div>
                </div>
            )}

            {/* Login prompt */}
            {!isLoggedIn && (
                <div className="mx-4 mt-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 rounded-2xl px-4 py-3 flex items-center gap-3">
                    <span className="text-xl">🛠️</span>
                    <div>
                        <p className="text-[12px] font-black text-slate-900 dark:text-white">Have a skill to offer?</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400"><a href="/login" className="text-purple-600 font-bold">Log in</a> to post your skills and reach the community.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
