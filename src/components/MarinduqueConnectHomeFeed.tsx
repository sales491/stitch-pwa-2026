'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HubItem } from '@/data/hub-items';
import ThemeToggle from './ThemeToggle';
import { useAuth } from './AuthProvider';
import { useNotifications } from './NotificationProvider';

type Props = {
  initialItems: HubItem[];
};

export default function MarinduqueConnectHomeFeed({ initialItems }: Props) {
  const [selectedTown, setSelectedTown] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [categorizedItems, setCategorizedItems] = useState<{ [key: string]: HubItem[] }>({});
  const { profile } = useAuth();
  const { unreadCount } = useNotifications();
  const avatarUrl = profile?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAjCr6FTvFLmea3sLo0LGq7yqSeTx1_tRG4KiUxaAIsiozS_zoUcbb9hscRaL-8I0tkMiFrSr2hkOP4wqdy0mw1caZ9YT_iy2jpGYeJBl1GVHwiwBm_TMWoIJWIfSIaDKBmPtBlFbUaJF2L0nbzYPlOQxC7oNvqISEqOQgwqNHqCb4_igJX14L_bqraFm6dXzW8";

  useEffect(() => {
    // Helper to normalize town names
    const normalizeTown = (name: string) => name.toLowerCase().replace('sta.', 'santa');

    // Filter based on selectedTown and searchQuery using passed items
    const filteredItems = initialItems.filter(item => {
      const matchesTown = selectedTown === 'All' ||
        normalizeTown(item.subtitle).includes(normalizeTown(selectedTown));

      const searchTarget = `${item.title} ${item.subtitle} ${item.categoryLabel}`.toLowerCase();
      const matchesSearch = searchQuery.trim() === '' ||
        searchTarget.includes(searchQuery.toLowerCase());

      return matchesTown && matchesSearch;
    });

    // Group by category and pick items from each
    const groups: { [key: string]: HubItem[] } = {};
    const types = Array.from(new Set(filteredItems.map(item => item.type)));

    types.forEach(type => {
      const itemsOfType = filteredItems.filter(item => item.type === type);
      groups[type] = itemsOfType;
    });

    setCategorizedItems(groups);
  }, [selectedTown, searchQuery, initialItems]);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-surface-light dark:bg-surface-dark shadow-2xl">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 bg-background-light/30 dark:bg-background-dark/30">




        {/* Grouped Feed */}
        <div className="space-y-8 px-4">
          {Object.keys(categorizedItems).length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-[64px] text-text-muted/20 mb-4">search_off</span>
              <p className="text-text-main font-bold">No results found</p>
              <p className="text-xs text-text-muted mt-1">Try changing filters</p>
            </div>
          )}

          {Object.entries(categorizedItems)
            .filter(([type]) => type !== 'event' && type !== 'roro')
            .map(([type, items]) => {
              const viewAllLinkMap: { [key: string]: string } = {
                classifieds: '/marinduque-classifieds-marketplace',
                jobs: '/marinduque-jobs-listing-feed',
                transport: '/commuter-delivery-hub',
                businesses: '/directory',
                gems: '/gems-of-marinduque-feed',
                blog: '/the-hidden-foreigner-blog-feed',
              };

              return (
                <div key={type} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between pl-1">
                    <h2 className="text-base font-black text-text-main tracking-tight">
                      {items[0]?.categoryLabel || type}
                    </h2>
                    <Link className="text-[11px] font-black text-moriones-red hover:underline uppercase tracking-wider" href={viewAllLinkMap[type] || '#'}>
                      View All
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {items.slice(0, 4).map((item) => (
                      <Link
                        key={item.id}
                        href={item.link}
                        className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                      >
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                          <img alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={item.image} />
                          {item.extraInfo && (
                            <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-sm shadow-lg border border-white/10">
                              <p className="text-[10px] font-black text-white">{item.extraInfo}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 p-3">
                          <h3 className="line-clamp-1 text-xs font-bold text-text-main leading-snug group-hover:text-moriones-red transition-colors">{item.title}</h3>
                          <div className="flex items-center gap-1 text-[10px] text-text-muted font-medium">
                            <span className="material-symbols-outlined text-[12px]">location_on</span>
                            <span className="truncate">{item.subtitle}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

          {/* Transportation / RoRo Special Block */}
          {(categorizedItems['roro'] || categorizedItems['event']) && (
            <div className="grid grid-cols-2 gap-4 pb-12">
              {['roro', 'event'].map(type => {
                const item = categorizedItems[type]?.[0];
                if (!item) return null;
                const viewAllLink = type === 'roro' ? '/roro-port-information-hub' : '/marinduque-events-calendar';

                return (
                  <div key={type} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between pl-1">
                      <h2 className="text-[13px] font-black text-text-main tracking-tight truncate pr-2">
                        {item.categoryLabel}
                      </h2>
                      <Link className="text-[10px] font-black text-moriones-red hover:underline flex-shrink-0" href={viewAllLink}>
                        GO
                      </Link>
                    </div>
                    <Link
                      href={item.link}
                      className="group relative flex flex-col overflow-hidden rounded-2xl bg-background-main border border-border-main shadow-sm hover:shadow-md transition-all h-full"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img alt={item.title} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500" src={item.image} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <p className="text-[10px] font-black uppercase tracking-widest">{item.subtitle}</p>
                          <h3 className="text-xs font-bold line-clamp-2 mt-0.5 leading-tight">{item.title}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}
