'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import ListingCard from '@/components/ListingCard';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const TOWNS = ['All', 'Boac', 'Mogpog', 'Gasan', 'Sta. Cruz', 'Torrijos', 'Buenavista'];
const PAGE_SIZE = 10;

interface Listing {
    id: string;
    title: string;
    price_value: number | null;
    town: string;
    category: string;
    images: string[] | null;
    seller_id: string | null;
    user_id: string | null;
}

interface ClientFeedProps {
    initialListings: Listing[];
}

export default function ClientFeed({ initialListings }: ClientFeedProps) {
    const searchParams = useSearchParams();
    const justPosted = searchParams.get('posted') === '1';

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTown, setSelectedTown] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    // Hydrate from server-rendered initial data — no spinner on first load
    const [listings, setListings] = useState<Listing[]>(initialListings);
    const [loading, setLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(initialListings.length === PAGE_SIZE);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [showSuccessToast, setShowSuccessToast] = useState(justPosted);

    const isFetchingRef = useRef(false);
    const supabase = createClient();

    // Auto-hide success toast
    useEffect(() => {
        if (showSuccessToast) {
            const timer = setTimeout(() => setShowSuccessToast(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessToast]);

    const fetchListings = useCallback(async (pageNum: number, reset = false) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        if (reset) {
            setLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        const from = pageNum * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, error: fetchError } = await supabase
            .from('listings')
            .select('id, title, price_value, town, category, images, seller_id, user_id')
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .range(from, to);

        if (fetchError) {
            const detail = (fetchError as any).details || fetchError.message;
            console.error('Marketplace fetch error details:', detail);
            setError(detail);
        } else {
            const newItems = data || [];
            if (reset) {
                setListings(newItems);
            } else {
                setListings((prev) => [...prev, ...newItems]);
            }
            setHasMore(newItems.length === PAGE_SIZE);
        }

        setLoading(false);
        setIsLoadingMore(false);
        isFetchingRef.current = false;
    }, [supabase]);

    // Infinite scroll via IntersectionObserver — starts at page 1 since page 0 is server-rendered
    const sentinelRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore && !loading) {
                    setPage((prev) => {
                        const nextPage = prev + 1;
                        fetchListings(nextPage);
                        return nextPage;
                    });
                }
            },
            { rootMargin: '200px' }
        );

        const sentinel = sentinelRef.current;
        if (sentinel) observer.observe(sentinel);
        return () => { if (sentinel) observer.unobserve(sentinel); };
    }, [hasMore, isLoadingMore, loading, fetchListings]);

    // Client-side filter on already-fetched items
    const filteredListings = useMemo(() => {
        return listings.filter((listing) => {
            const matchesSearch = !searchQuery ||
                listing.title?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTown = selectedTown === 'All' || listing.town === selectedTown;
            const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
            return matchesSearch && matchesTown && matchesCategory;
        });
    }, [listings, searchQuery, selectedTown, selectedCategory]);

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
            {/* Success Toast */}
            {showSuccessToast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-top-2 fade-in">
                    <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/90 border border-amber-200 dark:border-amber-700 rounded-2xl px-4 py-3 shadow-xl shadow-amber-200/40">
                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-xl shrink-0 mt-0.5">pending</span>
                        <div>
                            <p className="text-sm font-black text-amber-800 dark:text-amber-200">Listing submitted!</p>
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Your item is pending review and will appear here once approved.</p>
                        </div>
                        <button
                            onClick={() => setShowSuccessToast(false)}
                            className="ml-auto shrink-0 text-amber-400 hover:text-amber-600"
                            aria-label="Close"
                        >
                            <span className="material-symbols-outlined text-base">close</span>
                        </button>
                    </div>
                </div>
            )}

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
                <div className="flex flex-col sm:flex-row gap-2 mb-6">
                    {/* Search Box */}
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
                    
                    <div className="flex gap-2 flex-1">
                        {/* Category Filter Dropdown */}
                        <div className="flex-1 relative group min-w-0">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full h-full appearance-none bg-slate-50 dark:bg-zinc-800 border-2 border-transparent rounded-[1.25rem] py-3 px-4 pl-10 text-[10px] sm:text-xs font-black uppercase tracking-widest text-moriones-red focus:bg-white dark:focus:bg-zinc-700/50 focus:border-moriones-red/20 outline-none transition-all cursor-pointer truncate"
                            >
                                <option value="All">ALL CATEGORIES</option>
                                {[
                                    'Baby Items', 'Barter', 'Bikes & Parts', 'Boats & Parts', 'Business', 'Cars, Trucks & Parts', 'Clothes & Accessories',
                                    'Construction & Materials', 'Crafts', 'Education', 'Electronics', 'Farm & Garden', 'Foods',
                                    'General', 'Health & Beauty', 'Heavy Equipment', 'Home & Appliances', 'Motorcycles & Parts',
                                    'Services', 'Tools', 'Toys & Games', 'Wanted'
                                ].map((cat) => (
                                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                                ))}
                            </select>
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-moriones-red/60 text-[16px] pointer-events-none">category</span>
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg pointer-events-none group-active:rotate-180 transition-transform">expand_more</span>
                        </div>

                        {/* Town Filter Dropdown */}
                        <div className="flex-[0.8] relative group min-w-[110px]">
                            <select
                                value={selectedTown}
                                onChange={(e) => setSelectedTown(e.target.value)}
                                className="w-full h-full appearance-none bg-slate-50 dark:bg-zinc-800 border-2 border-transparent rounded-[1.25rem] py-3 px-4 pl-9 text-[10px] sm:text-xs font-black uppercase tracking-widest text-moriones-red focus:bg-white dark:focus:bg-zinc-700/50 focus:border-moriones-red/20 outline-none transition-all cursor-pointer truncate"
                            >
                                {TOWNS.map((town) => (
                                    <option key={town} value={town}>{town === 'All' ? 'ALL TOWNS' : town.toUpperCase()}</option>
                                ))}
                            </select>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-moriones-red/60 text-[16px] pointer-events-none">location_on</span>
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg pointer-events-none group-active:rotate-180 transition-transform">expand_more</span>
                        </div>
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
                                id={String(listing.id)}
                                title={listing.title}
                                price={listing.price_value || 0}
                                town={listing.town}
                                imageUrl={listing.images?.[0] || ''}
                                sellerId={listing.seller_id || listing.user_id || ''}
                            />
                        ))}

                        {/* Infinite scroll sentinel */}
                        <div ref={sentinelRef} className="h-4" />

                        {/* Load More Spinner */}
                        {isLoadingMore && (
                            <div className="flex justify-center py-6">
                                <div className="w-8 h-8 border-4 border-moriones-red/20 border-t-moriones-red rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* End of feed indicator */}
                        {!hasMore && listings.length > 0 && (
                            <div className="flex flex-col items-center py-8 text-center">
                                <div className="w-12 h-px bg-slate-200 dark:bg-white/10 mb-4" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {listings.length} listings shown • You&apos;re all caught up
                                </p>
                            </div>
                        )}

                        {filteredListings.length === 0 && !loading && (
                            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 dark:bg-zinc-800/50 rounded-[2.5rem] mt-4 border border-slate-100 dark:border-white/[0.03]">
                                <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-zinc-700">
                                    <span className="material-symbols-outlined text-slate-300 dark:text-zinc-600 text-4xl">inventory_2</span>
                                </div>
                                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">No listings found</h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 px-10 leading-relaxed">Try changing your search or selecting a different town</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedTown('All'); setSelectedCategory('All'); }}
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
