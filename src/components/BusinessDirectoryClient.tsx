'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
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
    categories?: string[];
};

const TOWNS = ['All Towns', 'Boac', 'Mogpog', 'Gasan', 'Sta. Cruz', 'Torrijos', 'Buenavista'];
const CATEGORIES = [
    'All Categories', 'Food & Beverage', 'Retail', 'Handicrafts', 'Accommodation',
    'Transport', 'Services', 'Tours & Travel', 'Others'
];

function FilterChip({
    icon, label, options, value, onChange,
}: {
    icon: string; label: string; options: string[]; value: string;
    onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isFiltered = value !== options[0];

    useEffect(() => {
        function outside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', outside);
        return () => document.removeEventListener('mousedown', outside);
    }, []);

    return (
        <div className="relative flex-1" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center justify-between gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors ${isFiltered
                    ? 'bg-moriones-red/10 border-moriones-red text-moriones-red'
                    : 'bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-text-main dark:text-text-main-dark hover:border-moriones-red/50'
                    }`}
            >
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-[16px] shrink-0">{icon}</span>
                    <span className="truncate">{isFiltered ? value : label}</span>
                </div>
                <span className={`material-symbols-outlined text-[16px] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>expand_more</span>
            </button>

            {open && (
                <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white dark:bg-zinc-900 border border-border-light dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden">
                    <div className="max-h-56 overflow-y-auto w-full">
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => { onChange(opt); setOpen(false); }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === opt
                                    ? 'bg-moriones-red/10 text-moriones-red font-semibold'
                                    : 'text-text-main dark:text-text-main-dark hover:bg-slate-50 dark:hover:bg-zinc-800'
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function BusinessDirectoryClient({ initialBusinesses }: { initialBusinesses: Business[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTown, setSelectedTown] = useState('All Towns');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');

    const filteredBusinesses = useMemo(() => {
        return initialBusinesses.filter((biz) => {
            const matchesSearch =
                biz.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                biz.business_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                biz.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (biz.categories && biz.categories.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));

            const matchesTown = selectedTown === 'All Towns' || biz.location.includes(selectedTown);
            const matchesCategory = selectedCategory === 'All Categories' || (biz.categories && biz.categories.includes(selectedCategory));

            return matchesSearch && matchesTown && matchesCategory;
        });
    }, [initialBusinesses, searchQuery, selectedTown, selectedCategory]);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-surface-light dark:bg-surface-dark shadow-2xl">
            <header className="sticky top-0 z-30 flex flex-col bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark">
                <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="text-text-main dark:text-text-main-dark p-1 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold leading-tight tracking-tight text-moriones-red dark:text-moriones-red pl-1">Business Directory</h1>
                            <p className="text-[10px] text-text-muted dark:text-text-muted-dark font-black uppercase tracking-[0.15em] pl-1">Verified Local Partners</p>
                        </div>
                    </div>
                </div>

                <div className="px-4 pb-2 pt-1">
                    <div className="relative flex items-center w-full h-10 rounded-xl bg-background-light dark:bg-background-dark border border-transparent focus-within:border-moriones-red/50 focus-within:ring-2 focus-within:ring-moriones-red/20 transition-all">
                        <div className="grid place-items-center h-full w-10 text-text-muted dark:text-text-muted-dark">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search businesses, services..."
                            className="peer h-full w-full outline-none bg-transparent text-sm text-text-main dark:text-text-main-dark placeholder:text-text-muted dark:placeholder:text-text-muted-dark"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="mr-1 p-1.5 rounded-lg text-text-muted dark:text-text-muted-dark hover:text-moriones-red transition-colors">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="px-4 pb-3 flex gap-2">
                    <FilterChip icon="category" label="Category" options={CATEGORIES} value={selectedCategory} onChange={setSelectedCategory} />
                    <FilterChip icon="location_on" label="Town" options={TOWNS} value={selectedTown} onChange={setSelectedTown} />
                </div>
            </header>

            <main className="flex-1 bg-background-light/50 dark:bg-background-dark/50 px-4 py-4 space-y-4 pb-32">


                <div className="flex items-center justify-between px-2">
                    <h2 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                        {selectedTown === 'All Towns' ? 'ALL BUSINESSES' : `IN ${selectedTown.toUpperCase()}`}
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
                            <p className="text-text-muted text-xs font-bold max-w-[240px] mb-8 leading-relaxed">We couldn't find any businesses matching your search.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedTown('All Towns'); setSelectedCategory('All Categories'); }}
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
                    href="/onboarding/business"
                    className="flex items-center gap-2 h-10 px-4 rounded-full bg-moriones-red text-white shadow-lg shadow-moriones-red/40 transition-all hover:scale-105 active:scale-95 pointer-events-auto group"
                    title="Add Listing"
                >
                    <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">add_business</span>
                    <span className="font-black text-[9px] uppercase tracking-widest leading-none mt-0.5">Add Listing</span>
                </Link>
            </div>
        </div >
    );
}
