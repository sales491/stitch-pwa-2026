'use client';

import React, { useState, useMemo } from 'react';
import BusinessCard from '@/components/BusinessCard';
import Link from 'next/link';

type Business = {
    id: string;
    business_name: string;
    business_type: string;
    location: string;
    is_verified: boolean;
    average_rating: number;
    review_count: number;
    gallery_image?: string;
};

const TOWNS = ['All', 'Boac', 'Mogpog', 'Gasan', 'Sta. Cruz', 'Torrijos', 'Buenavista'];

export default function BusinessDirectoryClient({ initialBusinesses }: { initialBusinesses: Business[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTown, setSelectedTown] = useState('All');
    const [isTownMenuOpen, setIsTownMenuOpen] = useState(false);

    const filteredBusinesses = useMemo(() => {
        return initialBusinesses.filter((biz) => {
            const matchesSearch =
                biz.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                biz.business_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                biz.location.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTown = selectedTown === 'All' || biz.location === selectedTown;

            return matchesSearch && matchesTown;
        });
    }, [initialBusinesses, searchQuery, selectedTown]);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-white dark:bg-[#0F0F10] shadow-2xl">
            <header className="sticky top-0 z-30 flex flex-col bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03]">
                <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <div className="flex items-center gap-3">
                        <Link href="/marinduque-connect-home-feed" className="text-slate-600 dark:text-white/60 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-[26px]">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1">Business Directory</h1>
                            <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] pl-1">Verified Local Partners & Local Businesses</p>
                        </div>
                    </div>
                </div>
                <div className="px-4 pb-3 flex items-center gap-2">
                    {/* Search Box */}
                    <div className="w-[42%] relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05] rounded-2xl p-2.5 pl-11 text-sm font-bold text-slate-800 dark:text-white/90 shadow-sm focus:border-moriones-red/30 focus:bg-white dark:focus:bg-white/5 outline-none transition-all placeholder:text-slate-400"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-moriones-red/60 text-[18px] group-focus-within:scale-110 transition-transform">search</span>
                    </div>

                    {/* Categories / Towns Dropdown */}
                    <div className="flex-1 relative">
                        <button
                            onClick={() => setIsTownMenuOpen(!isTownMenuOpen)}
                            className="w-full flex items-center justify-between bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.1] rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-800 dark:text-white/90 shadow-sm hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-2 truncate">
                                <span className="material-symbols-outlined text-moriones-red/60 text-[20px] flex-shrink-0">location_on</span>
                                <span className="text-moriones-red uppercase tracking-tight text-[11px] font-black truncate">{selectedTown === 'All' ? 'EVERYWHERE' : selectedTown.toUpperCase()}</span>
                            </div>
                            <span className={`material-symbols-outlined text-slate-400 text-lg flex-shrink-0 transition-transform duration-300 ${isTownMenuOpen ? 'rotate-180' : ''}`}>
                                expand_more
                            </span>
                        </button>

                        {/* Dropdown Menu */}
                        {isTownMenuOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40 bg-black/5 backdrop-blur-sm"
                                    onClick={() => setIsTownMenuOpen(false)}
                                />
                                <div className="absolute top-full right-0 mt-3 z-50 bg-white dark:bg-[#1A1A1C] border border-slate-100 dark:border-white/[0.1] rounded-3xl shadow-2xl p-3 grid grid-cols-2 gap-2 min-w-[200px] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                                    {TOWNS.map((town) => (
                                        <button
                                            key={town}
                                            onClick={() => {
                                                setSelectedTown(town);
                                                setIsTownMenuOpen(false);
                                            }}
                                            className={`flex items-center justify-center text-center px-2 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedTown === town
                                                ? 'bg-moriones-red text-white border-moriones-red shadow-lg shadow-moriones-red/20 scale-[1.02]'
                                                : 'bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-white/30 border-slate-100 dark:border-white/10 hover:border-moriones-red/30'
                                                }`}
                                        >
                                            {town}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 bg-background-light/50 dark:bg-background-dark/50 px-4 py-4 space-y-4 pb-32">


                <div className="flex items-center justify-between px-2">
                    <h2 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                        {selectedTown === 'All' ? 'ALL BUSINESSES' : `IN ${selectedTown.toUpperCase()}`}
                    </h2>
                    <div className="flex items-center gap-1 bg-moriones-red/10 text-moriones-red text-[10px] font-black px-2 py-0.5 rounded-lg uppercase italic">
                        <span className="material-symbols-outlined text-[12px] font-black">storefront</span>
                        {filteredBusinesses.length}
                    </div>
                </div>

                {/* Directory Content */}
                <div className="grid grid-cols-1 gap-4 pb-24">
                    {filteredBusinesses.map((biz) => (
                        <BusinessCard
                            key={biz.id}
                            id={biz.id}
                            name={biz.business_name}
                            type={biz.business_type || 'Local Business'}
                            location={biz.location || 'Marinduque'}
                            isVerified={biz.is_verified}
                            rating={biz.average_rating || 0}
                            reviewCount={biz.review_count || 0}
                            imageUrl={biz.gallery_image}
                        />
                    ))}

                    {filteredBusinesses.length === 0 && (
                        <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-3xl border border-border-light dark:border-zinc-800 shadow-xl flex flex-col items-center p-8">
                            <div className="size-20 bg-background-light dark:bg-background-dark rounded-full flex items-center justify-center mb-6 shadow-inner border border-border-light dark:border-zinc-800">
                                <span className="material-symbols-outlined text-text-muted/30 text-5xl">search_off</span>
                            </div>
                            <h3 className="text-lg font-black text-text-main dark:text-text-main-dark mb-2">No Businesses Found</h3>
                            <p className="text-text-muted text-xs font-bold max-w-[240px] mb-8 leading-relaxed">We couldn't find any businesses in {selectedTown} matching your search.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedTown('All'); }}
                                className="px-8 py-3 bg-moriones-red text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-moriones-red/20 active:scale-95 transition-all"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* List Business FAB */}
            <div className="fixed bottom-28 left-0 right-0 z-50 max-w-md mx-auto px-6 pointer-events-none flex justify-end">
                <Link
                    href="/directory/create"
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-moriones-red text-white shadow-lg shadow-moriones-red/40 transition-all hover:scale-110 active:scale-95 group pointer-events-auto"
                    title="List Business"
                >
                    <span className="material-symbols-outlined text-[32px]">add</span>
                    <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none shadow-xl">
                        List Business
                    </span>
                </Link>
            </div>
        </div >
    );
}
