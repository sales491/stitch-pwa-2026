'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import ListingCard from '@/components/ListingCard';
import Link from 'next/link';

const TOWNS = ['All', 'Boac', 'Mogpog', 'Gasan', 'Sta. Cruz', 'Torrijos', 'Buenavista'];

export default function MarketplaceFeed() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTown, setSelectedTown] = useState('All');
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            const { data, error: fetchError } = await supabase
                .from('listings')
                .select('id, title, price_value, town, images, seller_id, user_id')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (fetchError) {
                const detail = (fetchError as any).details || fetchError.message;
                console.error('Marketplace fetch error details:', detail);
                setError(detail);
            } else {
                setListings(data || []);
            }
            setLoading(false);
        };

        fetchListings();
    }, [supabase]);

    const filteredListings = useMemo(() => {
        return listings.filter((listing) => {
            const matchesSearch = !searchQuery ||
                listing.title?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTown = selectedTown === 'All' ||
                listing.town === selectedTown;

            return matchesSearch && matchesTown;
        });
    }, [listings, searchQuery, selectedTown]);

    if (error) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] text-center">
                <span className="material-symbols-outlined text-moriones-red text-5xl mb-4">error</span>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">Failed to load marketplace</h2>
                <p className="text-slate-500 mt-2 max-w-xs text-sm font-bold">Something went wrong while fetching the latest listings. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header Area */}
            <div className="p-6 pb-2">
                <div className="flex justify-between items-end mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">Marketplace</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Marinduque Classifieds</p>
                    </div>
                    <Link
                        href="/marketplace/create"
                        className="bg-moriones-red text-white px-5 py-2.5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-moriones-red/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        Sell Item
                    </Link>
                </div>

                {/* Search Bar & Town Filter Row */}
                <div className="flex gap-2 mb-6">
                    {/* Shrunken Search Box */}
                    <div className="flex-[1.5] relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-moriones-red/60">
                            <span className="material-symbols-outlined text-lg">search</span>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full bg-slate-50 dark:bg-zinc-800 border-2 border-transparent rounded-[1.25rem] py-3 pl-11 pr-4 text-sm font-bold text-slate-800 dark:text-white focus:bg-white dark:focus:bg-zinc-700/50 focus:border-moriones-red/20 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>

                    {/* Town Filter Dropdown */}
                    <div className="flex-1 relative group">
                        <select
                            value={selectedTown}
                            onChange={(e) => setSelectedTown(e.target.value)}
                            className="w-full h-full appearance-none bg-slate-50 dark:bg-zinc-800 border-2 border-transparent rounded-[1.25rem] py-3 px-4 pl-10 text-xs font-black uppercase tracking-widest text-moriones-red focus:bg-white dark:focus:bg-zinc-700/50 focus:border-moriones-red/20 outline-none transition-all cursor-pointer"
                        >
                            {TOWNS.map((town) => (
                                <option key={town} value={town}>{town === 'All' ? 'ALL TOWNS' : town.toUpperCase()}</option>
                            ))}
                        </select>
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-moriones-red/60 text-lg pointer-events-none">location_on</span>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg pointer-events-none group-active:rotate-180 transition-transform">expand_more</span>
                    </div>
                </div>
            </div>

            {/* Grid Feed */}
            <div className="px-6 pb-24">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-moriones-red/20 border-t-moriones-red rounded-full animate-spin"></div>
                        <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Loading Marketplace...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {filteredListings.map((listing) => (
                            <ListingCard
                                key={listing.id}
                                id={listing.id}
                                title={listing.title}
                                price={listing.price_value || 0}
                                town={listing.town}
                                imageUrl={listing.images?.[0] || ''}
                                sellerId={listing.seller_id || listing.user_id}
                            />
                        ))}

                        {filteredListings.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 dark:bg-zinc-800/50 rounded-[2.5rem] mt-4 border border-slate-100 dark:border-white/[0.03]">
                                <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-zinc-700">
                                    <span className="material-symbols-outlined text-slate-300 dark:text-zinc-600 text-4xl">inventory_2</span>
                                </div>
                                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">No listings found</h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 px-10 leading-relaxed">Try changing your search or selecting a different town</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedTown('All'); }}
                                    className="mt-6 text-moriones-red font-black text-[11px] uppercase tracking-widest hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
