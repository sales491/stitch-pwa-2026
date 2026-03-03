'use client';
import React, { useState } from 'react';

import { HUB_ITEMS, HubItem } from '@/data/hub-items';

export default function MarinduqueConnectHomeFeed() {
  const [selectedTown, setSelectedTown] = useState('All');
  const [categorizedItems, setCategorizedItems] = useState<{ [key: string]: HubItem[] }>({});

  React.useEffect(() => {
    // Group by category and pick 2 random items from each
    const groups: { [key: string]: HubItem[] } = {};
    const types = Array.from(new Set(HUB_ITEMS.map(item => item.type)));

    types.forEach(type => {
      const itemsOfType = HUB_ITEMS.filter(item => item.type === type);
      const shuffled = [...itemsOfType].sort(() => 0.5 - Math.random());
      groups[type] = shuffled.slice(0, 2);
    });

    setCategorizedItems(groups);
  }, []);

  return (
    <>
      <div>
        {/* Header Section */}
        <header className="bg-white dark:bg-slate-900 sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 32 }}>grid_view</span>
              <h1 className="text-xl font-bold tracking-tight text-moriones-red dark:text-moriones-red">Marinduque Market Hub</h1>
            </div>
            <button className="relative p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
            </button>
          </div>
          {/* Search Bar */}
          <div className="px-4 pb-3">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
              </div>
              <input className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all sm:text-sm" placeholder="Search items, jobs, or services..." type="text" />
            </div>
          </div>
        </header>
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto pb-24">
          {/* Town Filter - 2 rows: 4 + 3 */}
          <div className="pt-3 pb-1 px-4 space-y-1.5">
            <div className="grid grid-cols-4 gap-1.5">
              {['All', 'Boac', 'Mogpog', 'Gasan'].map((town) => (
                <button
                  key={town}
                  onClick={() => setSelectedTown(town)}
                  className={`w-full py-1 rounded-full text-[11px] font-medium border transition-colors text-center ${selectedTown === town
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
                    }`}
                >
                  {town}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {['Buenavista', 'Torrijos', 'Sta. Cruz'].map((town) => (
                <button
                  key={town}
                  onClick={() => setSelectedTown(town)}
                  className={`w-full py-1 rounded-full text-[11px] font-medium border transition-colors text-center ${selectedTown === town
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary'
                    }`}
                >
                  {town}
                </button>
              ))}
            </div>
          </div>
          {/* Categories Grid */}
          <div className="px-4 py-4">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Browse Categories</h2>
            <div className="grid grid-cols-4 gap-2 text-center">
              <a className="flex flex-col items-center gap-2 group" href="/marinduque-classifieds-marketplace">
                <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/10 flex items-center justify-center text-moriones-red dark:text-red-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  <span className="material-symbols-outlined">storefront</span>
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Classifieds</span>
              </a>
              <a className="flex flex-col items-center gap-2 group" href="/marinduque-jobs-listing-feed">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  <span className="material-symbols-outlined">work</span>
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Jobs</span>
              </a>
              <a className="flex flex-col items-center gap-2 group" href="/commuter-delivery-hub">
                <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  <span className="material-symbols-outlined">directions_bus</span>
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Transport</span>
              </a>
              <a className="flex flex-col items-center gap-2 group" href="/marinduque-business-directory">
                <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  <span className="material-symbols-outlined">store</span>
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Businesses</span>
              </a>
            </div>
          </div>

          <div className="space-y-8 pb-12">
            {Object.entries(categorizedItems)
              .filter(([type]) => type !== 'event' && type !== 'roro')
              .map(([type, items]) => {
                const viewAllLinkMap: { [key: string]: string } = {
                  classifieds: '/marinduque-classifieds-marketplace',
                  jobs: '/marinduque-jobs-listing-feed',
                  transport: '/commuter-delivery-hub',
                  businesses: '/marinduque-business-directory',
                  gems: '/gems-of-marinduque-feed',
                };

                return (
                  <div key={type} className="px-4">
                    <div className="flex items-center justify-between mb-3 border-l-4 border-primary pl-3">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                        {items[0]?.categoryLabel.toLowerCase() || type}
                      </h2>
                      <a className="text-sm font-medium !text-moriones-red hover:!text-primary transition-colors" href={viewAllLinkMap[type] || '#'}>
                        View All
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {items.map((item) => (
                        <a key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow group flex flex-col" href={item.link}>
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <img alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.image} />
                            {item.extraInfo && (
                              <div className="absolute top-2 right-2 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[9px] font-bold text-slate-900 shadow-sm border border-slate-100">
                                {item.extraInfo}
                              </div>
                            )}
                          </div>
                          <div className="p-3 flex-1 flex flex-col">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{item.title}</h3>
                            <div className="flex items-center gap-1 mt-1 text-slate-500 dark:text-slate-400 line-clamp-1">
                              <span className="material-symbols-outlined text-[14px]">location_on</span>
                              <span className="text-[10px] font-medium">{item.subtitle}</span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}

            {/* Special Bottom Row: Events & RoRo Side-by-Side */}
            <div className="px-4 grid grid-cols-2 gap-4">
              {['event', 'roro'].map(type => {
                const item = categorizedItems[type]?.[0];
                if (!item) return null;
                const viewAllLinkMap: { [key: string]: string } = {
                  event: '/marinduque-events-calendar',
                  roro: '/roro-port-information-hub',
                };

                return (
                  <div key={type} className="flex flex-col">
                    <div className="flex items-center justify-between mb-3 border-l-4 border-primary pl-2">
                      <h2 className="text-[13px] font-bold text-slate-900 dark:text-white capitalize truncate pr-1">
                        {item.categoryLabel.toLowerCase()}
                      </h2>
                      <a className="text-[10px] font-bold !text-moriones-red hover:!text-primary transition-colors flex-shrink-0" href={viewAllLinkMap[type] || '#'}>
                        ALL
                      </a>
                    </div>
                    <a className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow group flex flex-col h-full" href={item.link}>
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.image} />
                        {item.extraInfo && (
                          <div className="absolute top-2 right-2 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[8px] font-bold text-slate-900 shadow-sm border border-slate-100">
                            {item.extraInfo}
                          </div>
                        )}
                      </div>
                      <div className="p-3 flex-1 flex flex-col">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{item.title}</h3>
                        <div className="flex items-center gap-1 mt-1 text-slate-500 dark:text-slate-400 line-clamp-1">
                          <span className="material-symbols-outlined text-[12px]">location_on</span>
                          <span className="text-[9px] font-medium">{item.subtitle}</span>
                        </div>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Ad Banner */}
          <div className="px-4 py-6">
            <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20 flex flex-col items-center gap-3">
              <div className="flex items-center gap-4 w-full">
                <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-white/50">
                  <img alt="White transport van" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK6cGLQroflv-XbpRE_ZAzmWB662TfBFwLZOB5n3AJqf558C3FNrS6av06aOhrjQh-lFiw3-PimEdiDu9AH8fOakqA3fb0OYKr5VKCajxgw0rdEoZv0nLXp1lndHxbUrplKj73pqoDcYpwVY_m9245KLcORBaEWNQMe8Qrh7eAmUnfq0pRt-sLyjBv43LOg5MW3uOS0eKQMeXwmOAUNGLNW1kDhBJkcj4XhtdUaD3llUnwUbVvOW3myAnvnGLzwYpVK06rDEvYzeY" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-primary">Need something delivered?</h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">Fast transport & couriers across Marinduque.</p>
                </div>
                <a href="/commuter-delivery-hub" className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all">Explore</a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
