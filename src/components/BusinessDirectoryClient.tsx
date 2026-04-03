'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import BusinessCard from '@/components/BusinessCard';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

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
    delivery_available?: boolean;
};

const TOWNS = ['All Towns', 'Boac', 'Mogpog', 'Gasan', 'Sta. Cruz', 'Torrijos', 'Buenavista'];

// These MUST match the exact strings saved by the onboarding form's CATEGORIES array
const CATEGORIES = [
    'All Categories',
    'Food & Dining',
    'Retail & Shopping',
    'Home Services',
    'Professional Services',
    'Health & Wellness',
    'Accommodation',
    'Automotive',
    'Other',
];
const PAGE_SIZE = 10;

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

    const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
    const [loading, setLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(initialBusinesses.length === PAGE_SIZE);
    const [page, setPage] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);

    const isFetchingRef = useRef(false);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Get current user session once on mount for visibility filtering
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUserId(user?.id ?? null);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchBusinesses = useCallback(async (
        pageNum: number,
        query: string,
        town: string,
        category: string,
        reset = false
    ) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        if (reset) setLoading(true);
        else setIsLoadingMore(true);

        const from = pageNum * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let q = supabase
            .from('business_profiles')
            .select('id, business_name, business_type, location, is_verified, average_rating, review_count, gallery_image, categories, delivery_available')
            .order('is_verified', { ascending: false })
            .order('business_name', { ascending: true })
            .range(from, to);

        // Mirror the visibility logic from the server page:
        // Logged-in users can also see their own pending listings
        if (userId) {
            q = q.or(`is_verified.eq.true,owner_id.eq.${userId}`);
        } else {
            q = q.eq('is_verified', true);
        }

        // Search across name, type, location, and categories description
        if (query.trim()) {
            const safe = query.trim().replace(/'/g, "''");
            q = q.or(`business_name.ilike.%${safe}%,business_type.ilike.%${safe}%,location.ilike.%${safe}%,description.ilike.%${safe}%`);
        }

        if (town !== 'All Towns') q = q.eq('location', town);
        // Category filter: exact array-contains match on the canonical category string
        if (category !== 'All Categories') q = q.contains('categories', [category]);

        const { data, error } = await q;

        if (!error) {
            const newItems = (data as Business[]) || [];
            if (reset) setBusinesses(newItems);
            else setBusinesses((prev) => [...prev, ...newItems]);
            setHasMore(newItems.length === PAGE_SIZE);
        }

        setLoading(false);
        setIsLoadingMore(false);
        isFetchingRef.current = false;
    }, [supabase, userId]);

    // Debounce: re-fetch from page 0 whenever search/filters change
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(0);
            fetchBusinesses(0, searchQuery, selectedTown, selectedCategory, true);
        }, 350);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, selectedTown, selectedCategory]);

    // Infinite scroll via IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore && !loading) {
                    setPage((prev) => {
                        const nextPage = prev + 1;
                        fetchBusinesses(nextPage, searchQuery, selectedTown, selectedCategory);
                        return nextPage;
                    });
                }
            },
            { rootMargin: '200px' }
        );
        const sentinel = sentinelRef.current;
        if (sentinel) observer.observe(sentinel);
        return () => { if (sentinel) observer.unobserve(sentinel); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasMore, isLoadingMore, loading]);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-surface-light dark:bg-surface-dark shadow-2xl">
            <PageHeader title="Business Directory" subtitle="Verified Local Partners">
                <div className="px-4 pb-2 pt-1">
                    <div className="relative flex items-center w-full h-10 rounded-xl bg-background-light dark:bg-background-dark border border-transparent focus-within:border-moriones-red/50 focus-within:ring-2 focus-within:ring-moriones-red/20 transition-all">
                        <div className="grid place-items-center h-full w-10 text-text-muted dark:text-text-muted-dark shrink-0">
                            {loading
                                ? <span className="w-[18px] h-[18px] border-2 border-moriones-red/30 border-t-moriones-red rounded-full animate-spin" />
                                : <span className="material-symbols-outlined text-[20px]">search</span>
                            }
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
            </PageHeader>

            <main className="flex-1 bg-background-light/50 dark:bg-background-dark/50 px-4 py-4 space-y-4 pb-32">

                <div className="flex items-center justify-between px-2">
                    <h2 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                        {selectedTown === 'All Towns' ? 'ALL BUSINESSES' : `IN ${selectedTown.toUpperCase()}`}
                    </h2>
                    <div className="flex items-center gap-1 bg-moriones-red/10 text-moriones-red text-[10px] font-black px-2 py-0.5 rounded-lg uppercase italic">
                        <span className="material-symbols-outlined text-[12px] font-black">storefront</span>
                        {businesses.length}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-moriones-red/20 border-t-moriones-red rounded-full animate-spin" />
                        <p className="mt-4 text-[10px] font-black text-text-muted uppercase tracking-widest">
                            {searchQuery ? `Searching for "${searchQuery}"…` : 'Loading Directory...'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 pb-24">
                        {businesses.map((biz) => (
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
                                deliveryAvailable={biz.delivery_available}
                            />
                        ))}

                        {/* Infinite scroll sentinel */}
                        <div ref={sentinelRef} className="h-4" />

                        {/* Load more spinner */}
                        {isLoadingMore && (
                            <div className="flex justify-center py-6">
                                <div className="w-8 h-8 border-4 border-moriones-red/20 border-t-moriones-red rounded-full animate-spin" />
                            </div>
                        )}

                        {/* End of results */}
                        {!hasMore && businesses.length > 0 && (
                            <div className="flex flex-col items-center py-8 text-center">
                                <div className="w-12 h-px bg-slate-200 dark:bg-white/10 mb-4" />
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                                    {businesses.length} business{businesses.length !== 1 ? 'es' : ''} found • End of results
                                </p>
                            </div>
                        )}

                        {/* Empty state */}
                        {businesses.length === 0 && !loading && (
                            <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-3xl border border-border-light dark:border-zinc-800 shadow-xl flex flex-col items-center p-8">
                                <div className="size-20 bg-background-light dark:bg-background-dark rounded-full flex items-center justify-center mb-6 shadow-inner border border-border-light dark:border-zinc-800">
                                    <span className="material-symbols-outlined text-text-muted/30 text-5xl">search_off</span>
                                </div>
                                <h3 className="text-lg font-black text-text-main dark:text-text-main-dark mb-2">No Businesses Found</h3>
                                <p className="text-text-muted text-xs font-bold max-w-[240px] mb-8 leading-relaxed">
                                    {searchQuery ? `No results for "${searchQuery}"` : "We couldn't find any businesses matching your filters."}
                                </p>
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedTown('All Towns'); setSelectedCategory('All Categories'); }}
                                    className="px-8 py-3 bg-moriones-red text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-moriones-red/20 active:scale-95 transition-all"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* List Business FAB */}
            <div className="fixed bottom-28 left-0 right-0 z-50 max-w-md mx-auto px-6 pointer-events-none flex justify-end">
                <Link
                    href="/onboarding/business"
                    className="flex items-center gap-2 h-10 px-4 rounded-full bg-green-600 text-white shadow-lg shadow-green-600/40 transition-all hover:scale-105 active:scale-95 pointer-events-auto group"
                    title="Add Listing"
                >
                    <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">add_business</span>
                    <span className="font-black text-[9px] uppercase tracking-widest leading-none mt-0.5">Add Listing</span>
                </Link>
            </div>
        </div>
    );
}
