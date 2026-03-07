'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminActions from './AdminActions';
import { BusinessProfile } from './LocalBusinessProfilePage';

interface DirectoryProps {
    initialBusinesses: BusinessProfile[];
}

const TOWNS = ['All', 'Boac', 'Mogpog', 'Gasan', 'Sta. Cruz', 'Torrijos', 'Buenavista'];

function BusinessCard({ business }: { business: BusinessProfile }) {
    const router = useRouter();

    return (
        <div
            className="block border border-slate-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm relative hover:shadow-md transition-shadow bg-white dark:bg-zinc-800 cursor-pointer"
            onClick={() => router.push(`/business/${business.id}`)}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && router.push(`/business/${business.id}`)}
        >
            {/* Verified badge – only shown when admin has verified the business */}
            {business.is_verified && (
                <div className="absolute top-3 left-3 bg-teal-700 text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 z-10">
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span> VERIFIED
                </div>
            )}

            {/* Admin Actions – stopPropagation prevents card navigation */}
            <div
                className="absolute top-3 right-3 flex flex-col items-end gap-2 z-30"
                onClick={(e) => { e.stopPropagation(); }}
            >
                <div className="bg-white text-slate-900 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <span className="text-amber-400 material-symbols-outlined text-[14px] font-variation-settings-fill">star</span> {(business.average_rating || 4.5).toFixed(1)}
                </div>
                <AdminActions contentType="business" contentId={business.id} authorId={business.user_id || undefined} />
            </div>

            {/* Image or placeholder */}
            <div className="h-40 bg-slate-100 dark:bg-zinc-800 relative">
                {business.gallery_image ? (
                    <img
                        src={business.gallery_image}
                        alt={business.business_name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                        <span className="material-symbols-outlined text-4xl text-teal-600/30 mb-2 animate-pulse">add_a_photo</span>
                        <p className="text-teal-700 dark:text-teal-400 font-bold text-sm">Update your business</p>
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-0.5">Add photos</p>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4 relative text-left">
                <div className="absolute -top-5 right-4 w-10 h-10 bg-white dark:bg-zinc-900 rounded-full shadow-md flex items-center justify-center text-teal-700 dark:text-teal-400">
                    <span className="material-symbols-outlined font-variation-settings-fill">favorite</span>
                </div>
                <h3 className="font-bold text-lg text-text-main mb-1">{business.business_name}</h3>
                <p className="text-text-muted text-sm flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-[16px]">location_on</span> {business.location}, Marinduque
                </p>
                <div className="flex flex-wrap gap-2">
                    <span className="bg-slate-100 dark:bg-zinc-700 text-text-muted text-xs px-2 py-1 rounded">
                        {business.business_type}
                    </span>
                    {business.categories?.slice(0, 2).map(cat => (
                        <span key={cat} className="bg-slate-100 dark:bg-zinc-700 text-text-muted text-xs px-2 py-1 rounded">
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Claim button – only shown for unverified businesses */}
                {!business.is_verified && (
                    <div
                        className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <a
                            href={`/claim-business/${business.id}`}
                            className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 text-xs font-semibold hover:underline"
                        >
                            <span className="material-symbols-outlined text-[14px]">storefront</span>
                            Claim This Business
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function MarinduqueBusinessDirectory({ initialBusinesses }: DirectoryProps) {
    const [businesses] = useState<BusinessProfile[]>(initialBusinesses);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTown, setSelectedTown] = useState('All');
    const [searchFocused, setSearchFocused] = useState(false);

    const filtered = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return businesses.filter(b => {
            const matchesTown = selectedTown === 'All' ||
                b.location?.toLowerCase().includes(selectedTown.toLowerCase());
            const matchesSearch = !q ||
                b.business_name?.toLowerCase().includes(q) ||
                b.business_type?.toLowerCase().includes(q) ||
                b.location?.toLowerCase().includes(q) ||
                b.categories?.some(c => c.toLowerCase().includes(q));
            return matchesTown && matchesSearch;
        });
    }, [businesses, searchQuery, selectedTown]);

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 font-display">
            {/* Sticky header + search + town filter */}
            <div className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 shadow-sm">
                {/* Top bar */}
                <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                    <Link href="/marinduque-connect-home-feed" className="text-teal-700 dark:text-teal-400 shrink-0">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    {/* Search bar */}
                    <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${searchFocused ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20' : 'border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800'}`}>
                        <span className={`material-symbols-outlined text-[18px] shrink-0 transition-colors ${searchFocused ? 'text-teal-600' : 'text-slate-400'}`}>search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            placeholder="Search businesses..."
                            className="flex-1 bg-transparent text-sm text-text-main placeholder:text-text-muted outline-none"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="shrink-0 text-slate-400 hover:text-slate-600">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Town filter chips — single row, equal width */}
                <div className="flex px-4 pb-3 gap-1">
                    {TOWNS.map(town => (
                        <button
                            key={town}
                            onClick={() => setSelectedTown(town)}
                            className={`flex-1 text-center py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap ${selectedTown === town
                                ? 'bg-teal-700 text-white shadow-sm'
                                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300'
                                }`}
                        >
                            {town}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-4 pb-24 pt-4">
                {/* Result count */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        {selectedTown === 'All' ? 'All Businesses' : `Businesses in ${selectedTown}`}
                    </h2>
                    <span className="text-teal-700 dark:text-teal-400 text-sm font-semibold">{filtered.length} Listed</span>
                </div>

                {/* Cards */}
                <div className="space-y-4">
                    {filtered.length === 0 ? (
                        <div className="py-20 text-center">
                            <span className="material-symbols-outlined text-4xl text-text-muted/30 mb-2">search_off</span>
                            <p className="text-text-main font-medium">No businesses found</p>
                            <p className="text-text-muted text-sm mt-1">Try a different search or town</p>
                        </div>
                    ) : (
                        filtered.map((business) => (
                            <BusinessCard key={business.id} business={business} />
                        ))
                    )}
                </div>
            </div>

            {/* Add Business FAB */}
            <Link href="/create-business-profile-step1" className="fixed right-4 bottom-24 z-40 bg-teal-700 hover:bg-teal-600 text-white rounded-full size-14 shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                <span className="material-symbols-outlined text-[28px]">add</span>
            </Link>
        </div>
    );
}
