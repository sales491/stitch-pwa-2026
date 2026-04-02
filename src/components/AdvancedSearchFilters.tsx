'use client';

import React from 'react';
import BackButton from '@/components/BackButton';

export default function AdvancedSearchFilters() {
  return (
    <>
      <div>
  {/* Header */}
  <div className="sticky top-0 z-50 bg-surface-light dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
    <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-primary-light dark:text-text-primary-dark">
      <span className="material-symbols-outlined">arrow_back</span>
    </button>
    <h1 className="text-lg font-bold text-center flex-1">Filters</h1>
    <button className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">Reset</button>
  </div>
  {/* Main Content */}
  <main className="flex-1 pb-24">
    {/* Search Input */}
    <div className="px-4 py-4 bg-surface-light dark:bg-surface-dark mb-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">search</span>
        </div>
        <input className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-background-light dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-800 transition-all text-base" placeholder="Search jobs, items, events..." type="text" />
      </div>
    </div>
    {/* Location Filter */}
    <div className="bg-surface-light dark:bg-surface-dark px-4 py-5 mb-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold">Town</h3>
        <span className="text-xs text-primary font-medium cursor-pointer">Select All</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <label className="cursor-pointer">
          <input defaultChecked className="peer sr-only" type="checkbox" />
          <div className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black transition-all">
            Boac
          </div>
        </label>
        <label className="cursor-pointer">
          <input className="peer sr-only" type="checkbox" />
          <div className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black transition-all">
            Gasan
          </div>
        </label>
        <label className="cursor-pointer">
          <input className="peer sr-only" type="checkbox" />
          <div className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black transition-all">
            Mogpog
          </div>
        </label>
        <label className="cursor-pointer">
          <input className="peer sr-only" type="checkbox" />
          <div className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black transition-all">
            Sta. Cruz
          </div>
        </label>
        <label className="cursor-pointer">
          <input className="peer sr-only" type="checkbox" />
          <div className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black transition-all">
            Torrijos
          </div>
        </label>
        <label className="cursor-pointer">
          <input className="peer sr-only" type="checkbox" />
          <div className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-black transition-all">
            Buenavista
          </div>
        </label>
      </div>
    </div>
    {/* Category Filter */}
    <div className="bg-surface-light dark:bg-surface-dark px-4 py-5 mb-2">
      <h3 className="text-base font-bold mb-3">Category</h3>
      <div className="grid grid-cols-2 gap-3">
        <label className="cursor-pointer group relative">
          <input defaultChecked className="peer sr-only" name="category" type="radio" />
          <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary transition-all">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">storefront</span>
            </div>
            <span className="text-sm font-semibold">Marketplace</span>
          </div>
        </label>
        <label className="cursor-pointer group relative">
          <input className="peer sr-only" name="category" type="radio" />
          <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary transition-all">
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">work</span>
            </div>
            <span className="text-sm font-semibold">Jobs</span>
          </div>
        </label>
        <label className="cursor-pointer group relative">
          <input className="peer sr-only" name="category" type="radio" />
          <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary transition-all">
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">event</span>
            </div>
            <span className="text-sm font-semibold">Events</span>
          </div>
        </label>
        <label className="cursor-pointer group relative">
          <input className="peer sr-only" name="category" type="radio" />
          <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary transition-all">
            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">home</span>
            </div>
            <span className="text-sm font-semibold">Rentals</span>
          </div>
        </label>
      </div>
    </div>
    {/* Price Range */}
    <div className="bg-surface-light dark:bg-surface-dark px-4 py-5 mb-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold">Price Range</h3>
        <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">₱0 - ₱10,000+</span>
      </div>
      <div className="px-2">
        <input className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" max={10000} min={0} type="range" />
        <div className="flex justify-between mt-2 text-xs text-text-secondary-light dark:text-text-secondary-dark font-medium">
          <span>₱0</span>
          <span>₱5k</span>
          <span>₱10k+</span>
        </div>
      </div>
    </div>
    {/* Sort By */}
    <div className="bg-surface-light dark:bg-surface-dark px-4 py-5 mb-2">
      <h3 className="text-base font-bold mb-3">Sort By</h3>
      <div className="flex flex-col gap-1">
        <label className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer">
          <span className="text-sm font-medium">Newest first</span>
          <input defaultChecked className="w-5 h-5 text-primary border-gray-300 focus:ring-primary dark:border-gray-600 dark:bg-gray-700" name="sort" type="radio" />
        </label>
        <label className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer">
          <span className="text-sm font-medium">Price: Low to High</span>
          <input className="w-5 h-5 text-primary border-gray-300 focus:ring-primary dark:border-gray-600 dark:bg-gray-700" name="sort" type="radio" />
        </label>
        <label className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer">
          <span className="text-sm font-medium">Price: High to Low</span>
          <input className="w-5 h-5 text-primary border-gray-300 focus:ring-primary dark:border-gray-600 dark:bg-gray-700" name="sort" type="radio" />
        </label>
        <label className="flex items-center justify-between py-3 cursor-pointer">
          <span className="text-sm font-medium">Distance: Nearest</span>
          <input className="w-5 h-5 text-primary border-gray-300 focus:ring-primary dark:border-gray-600 dark:bg-gray-700" name="sort" type="radio" />
        </label>
      </div>
    </div>
    {/* Recent Searches */}
    <div className="bg-surface-light dark:bg-surface-dark px-4 py-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wide">Recent Searches</h3>
        <button className="text-xs text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500">Clear</button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-400 text-[20px]">history</span>
            <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-primary transition-colors">Van for rent in Boac</span>
          </div>
          <span className="material-symbols-outlined text-gray-300 text-[18px] -rotate-45">arrow_forward</span>
        </div>
        <div className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-400 text-[20px]">history</span>
            <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-primary transition-colors">Part-time jobs Gasan</span>
          </div>
          <span className="material-symbols-outlined text-gray-300 text-[18px] -rotate-45">arrow_forward</span>
        </div>
        <div className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-400 text-[20px]">history</span>
            <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark group-hover:text-primary transition-colors">Second hand motorcycle</span>
          </div>
          <span className="material-symbols-outlined text-gray-300 text-[18px] -rotate-45">arrow_forward</span>
        </div>
      </div>
    </div>
  </main>
  {/* Floating Action Button Area */}
  <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark pointer-events-none flex justify-center z-40 max-w-md mx-auto">
    <button className="pointer-events-auto w-full max-w-md bg-primary hover:bg-primary-dark text-black font-bold text-base py-3.5 px-6 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]">
      <span className="material-symbols-outlined">search</span>
      Show 124 Results
    </button>
  </div>
  {/* Bottom Navigation */}
  {/* Safe area spacing for mobile */}
  <div className="h-6 w-full bg-surface-light dark:bg-surface-dark" />
</div>

    </>
  );
}
