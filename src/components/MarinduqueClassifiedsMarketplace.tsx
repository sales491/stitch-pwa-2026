'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LISTINGS } from '@/data/listings';
import AdminActions from './AdminActions';

const categories = [
  'All Categories', 'Barter', 'Health & Beauty', 'Bikes & Parts', 'Boats & Parts',
  'Business', 'Cars, Trucks & Parts', 'Clothes & Accessories',
  'Construction & Materials', 'Crafts', 'Education', 'Electronics',
  'Farm & Garden', 'Foods', 'General', 'Heavy Equipment',
  'Home & Appliances', 'Motorcycles & Parts', 'Services', 'Tools',
  'Toys & Games', 'Wanted',
];

const towns = ['All Towns', 'Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'Sta. Cruz'];

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
          <div className="max-h-56 overflow-y-auto">
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

export default function MarinduqueClassifiedsMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedTown, setSelectedTown] = useState('All Towns');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = LISTINGS.filter((item) => {
    const matchCat = selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchTown = selectedTown === 'All Towns' || item.town === selectedTown;
    const matchSearch = searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchTown && matchSearch;
  });

  return (
    <>
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-surface-light dark:bg-surface-dark shadow-2xl">
        {/* Header */}
        <header className="sticky top-0 z-10 flex flex-col bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <Link href="/marinduque-connect-home-feed" className="text-text-main dark:text-text-main-dark p-1 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">arrow_back</span>
              </Link>
              <h1 className="text-lg font-bold leading-tight tracking-tight text-moriones-red dark:text-moriones-red pl-1">Marinduque Classifieds</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative flex items-center justify-center text-text-main dark:text-text-main-dark p-1 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                <span className="material-symbols-outlined text-[24px]">notifications</span>
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-moriones-red ring-2 ring-surface-light dark:ring-surface-dark" />
              </button>
              <div className="h-8 w-8 rounded-full overflow-hidden border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                <img alt="User Profile" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjCr6FTvFLmea3sLo0LGq7yqSeTx1_tRG4KiUxaAIsiozS_zoUcbb9hscRaL-8I0tkMiFrSr2hkOP4wqdy0mw1caZ9YT_iy2jpGYeJBl1GVHwiwBm_TMWoIJWIfSIaDKBmPtBlFbUaJF2L0nbzYPlOQxC7oNvqISEqOQgwqNHqCb4_igJX14ErTMrKZfFuRniTdGg9kDUTCNik3P-deYFhZBFwBQ09z19R9-MgT--h9c-LJA8UrmjsdE20uX1X4L_bqraFm6dXzW8" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-3 pt-1">
            <div className="relative flex items-center w-full h-12 rounded-xl bg-background-light dark:bg-background-dark border border-transparent focus-within:border-moriones-red/50 focus-within:ring-2 focus-within:ring-moriones-red/20 transition-all">
              <div className="grid place-items-center h-full w-12 text-text-muted dark:text-text-muted-dark">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="peer h-full w-full outline-none bg-transparent text-sm text-text-main dark:text-text-main-dark placeholder:text-text-muted dark:placeholder:text-text-muted-dark"
                id="classifieds-search"
                placeholder="Search bikes, furniture, electronics..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="mr-1 p-2 rounded-lg text-text-muted dark:text-text-muted-dark hover:text-moriones-red transition-colors">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Chips */}
          <div className="px-4 pb-3 flex gap-2">
            <FilterChip icon="category" label="Category" options={categories} value={selectedCategory} onChange={setSelectedCategory} />
            <FilterChip icon="location_on" label="Town" options={towns} value={selectedTown} onChange={setSelectedTown} />
          </div>
        </header>

        {/* Listings Grid */}
        <main className="flex-1 overflow-y-auto bg-background-light/50 dark:bg-background-dark/50 px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-text-main dark:text-text-main-dark">
              {filtered.length} listing{filtered.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All Categories' || selectedTown !== 'All Towns' ? ' found' : ' in Marinduque'}
            </h2>
            {(selectedCategory !== 'All Categories' || selectedTown !== 'All Towns' || searchQuery) && (
              <button
                onClick={() => { setSelectedCategory('All Categories'); setSelectedTown('All Towns'); setSearchQuery(''); }}
                className="text-xs font-medium text-moriones-red hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-[64px] text-slate-300 dark:text-slate-600 mb-4">search_off</span>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No listings found</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try a different category or town</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-20">
              {filtered.map((item) => (
                <Link
                  key={item.id}
                  href={`/listing/${item.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                    <img alt={item.alt} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" src={item.img} />
                    <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 backdrop-blur-sm">
                      <p className="text-xs font-bold text-white">{item.price}</p>
                    </div>
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="absolute top-2 right-2 rounded-full bg-surface-light/80 p-1.5 text-text-muted hover:text-red-500 backdrop-blur-sm transition-colors dark:bg-surface-dark/80 dark:text-text-muted-dark"
                    >
                      <span className="material-symbols-outlined text-[18px]">favorite_border</span>
                    </button>
                    <div className="absolute top-2 left-2 z-10 pointer-events-auto">
                      <AdminActions contentType="listing" contentId={item.id.toString()} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 p-3">
                    <h3 className="line-clamp-2 text-sm font-semibold text-text-main dark:text-text-main-dark leading-snug">{item.title}</h3>
                    <span className="text-[10px] text-moriones-red font-medium">{item.category}</span>
                    <div className="flex items-center gap-1 text-xs text-text-muted dark:text-text-muted-dark mt-auto">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      <span>{item.town}</span>
                    </div>
                    <p className="text-[10px] text-text-muted/70 dark:text-text-muted-dark/70">Posted {item.postedAgo}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Post a listing CTA */}
          <div className="pb-4">
            <Link
              href="/create-new-listing"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-moriones-red/40 text-moriones-red font-semibold text-sm hover:bg-moriones-red/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              Post a Free Listing
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
