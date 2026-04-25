'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { HubItem } from '@/data/hub-items';
import NewArrivalsCarousel, { NewArrival } from '@/components/NewArrivalsCarousel';
import { CATEGORY_LIST, QUICK_CARDS } from '@/data/home-config';

type Props = {
    initialItems: HubItem[];
    alertBanner?: React.ReactNode;
    newArrivals?: NewArrival[];
    popularSection?: React.ReactNode;
    liveSellersActive?: boolean;
};

export default function MarinduqueConnectHomeFeed({ initialItems, alertBanner, newArrivals, popularSection, liveSellersActive }: Props) {
    const [selectedTown, setSelectedTown] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [categorizedItems, setCategorizedItems] = useState<{ [key: string]: HubItem[] }>({});

    useEffect(() => {
        const normalizeTown = (name: string) => name.toLowerCase().replace('sta.', 'santa');

        const filteredItems = initialItems.filter(item => {
            const matchesTown =
                selectedTown === 'All' ||
                normalizeTown(item.subtitle).includes(normalizeTown(selectedTown));

            const searchTarget = `${item.title} ${item.subtitle} ${item.categoryLabel}`.toLowerCase();
            const matchesSearch =
                searchQuery.trim() === '' ||
                searchTarget.includes(searchQuery.toLowerCase());

            return matchesTown && matchesSearch;
        });

        const groups: { [key: string]: HubItem[] } = {};
        const types = Array.from(new Set(filteredItems.map(item => item.type)));
        types.forEach(type => {
            groups[type] = filteredItems.filter(item => item.type === type);
        });

        setCategorizedItems(groups);
    }, [selectedTown, searchQuery, initialItems]);

    return (
        <div className="relative flex w-full flex-col max-w-md mx-auto bg-surface-light dark:bg-surface-dark shadow-2xl">
            <div className="flex-1 pb-6 bg-background-light/30 dark:bg-background-dark/30">

                {/* ── 1. Gradient Banner ─────────────────────────────────── */}
                <div className="mx-4 mt-1 mb-3 rounded-2xl overflow-hidden shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #E53935 0%, #C62828 35%, #7B1010 70%, #2d2d2d 100%)' }}>
                    <div className="px-5 py-3 flex items-center justify-between overflow-hidden">
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/70 flex items-center gap-1 mb-1">
                                <span>📍</span> Marinduque Island, PH
                            </p>
                            <h1 className="text-[22px] font-black text-white leading-tight tracking-tight">
                                Your Island<br />Community Hub
                            </h1>
                            <p className="text-[8px] text-white/50 font-medium mt-1 tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                                Boac · Gasan · Mogpog · Sta. Cruz · Torrijos · Buenavista
                            </p>
                        </div>
                        {/* Marinduque island — decorative CSS background (not LCP candidate) */}
                        <div
                            className="ml-2 flex-shrink-0"
                            style={{
                                width: 90,
                                height: 90,
                                backgroundImage: 'url(/_next/image?url=%2Fimages%2Fmarinduque-island-silhouette.png&w=256&q=75)',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'center',
                                mixBlendMode: 'screen',
                                opacity: 0.45,
                            }}
                            aria-hidden="true"
                        />
                    </div>
                </div>

                {/* ── 2. Gas Prices Quick Link ────────────────────────────── */}
                <Link
                    href="/island-life/gas-prices"
                    className="mx-4 mb-2 flex items-center gap-2.5 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200/70 dark:border-orange-800/40 rounded-xl px-2.5 py-1 active:scale-[0.98] transition-transform shadow-sm"
                >
                    <span className="text-lg shrink-0" aria-hidden="true">⛽</span>
                    <p className="flex-1 min-w-0 text-[11px] font-black uppercase tracking-widest text-orange-700 dark:text-orange-400 truncate">
                        Gas Price Updates <span className="font-medium normal-case tracking-normal text-orange-500/80 dark:text-orange-500/60">· Community-sourced</span>
                    </p>
                    <span className="material-symbols-outlined text-[16px] text-orange-400 dark:text-orange-600 shrink-0">chevron_right</span>
                </Link>

                {/* ── 3. Alert Banner (active calamity/outage alerts) ────── */}
                {alertBanner}

                {/* ── 3a. Live Selling Radar (Flashing CTA if active) ─────── */}
                <Link
                    href="/live-selling"
                    className={`mx-4 mb-3 flex items-center gap-2.5 rounded-xl px-3 py-2 shadow-sm active:scale-[0.98] transition-transform border ${
                        liveSellersActive 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 border-transparent' 
                          : 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-200/50 dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-blue-800/30'
                    }`}
                >
                    <div className="relative flex h-2.5 w-2.5 shrink-0">
                        {liveSellersActive && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${liveSellersActive ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-red-500/70 dark:bg-red-600/70'}`}></span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-[12px] font-black uppercase tracking-wider leading-tight truncate ${liveSellersActive ? 'text-white drop-shadow-md' : 'text-blue-900 dark:text-blue-100'}`}>
                            Live Selling Radar
                        </p>
                        <p className={`text-[10px] font-medium tracking-wide truncate ${liveSellersActive ? 'text-blue-50' : 'text-blue-700/80 dark:text-blue-300'}`}>
                            {liveSellersActive ? '🔴 Locals are streaming right now!' : 'Find locals selling live on TikTok, Shopee, YT & FB'}
                        </p>
                    </div>
                    <span className={`material-symbols-outlined text-[20px] shrink-0 drop-shadow-sm ${liveSellersActive ? 'text-red-400 drop-shadow-md' : 'text-red-500/80 dark:text-red-500/80'}`}>
                        sensors
                    </span>
                </Link>

                {/* ── 3.5. SEO Fast-Track Carousel (Static SSR injection) ─── */}
                {newArrivals && newArrivals.length > 0 && <NewArrivalsCarousel arrivals={newArrivals} />}

                {/* ── 3. Quick-Action Cards (static, horizontal scroll, centred on Marketplace) ───── */}
                <div
                    ref={(el) => {
                        if (el) {
                            // Scroll so Marketplace (card index 1) is centred on mount
                            const card = el.children[1] as HTMLElement;
                            if (card) {
                                el.scrollLeft = card.offsetLeft - (el.clientWidth / 2) + (card.offsetWidth / 2);
                            }
                        }
                    }}
                    className="flex gap-3 overflow-x-auto px-4 mb-5 no-scrollbar pb-1 snap-x snap-mandatory scroll-smooth"
                >
                    {QUICK_CARDS.map((card, i) => (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="relative flex-shrink-0 w-44 h-24 rounded-2xl overflow-hidden shadow-sm active:scale-[0.97] transition-transform snap-center"
                        >
                            <img
                                src={card.image}
                                alt={card.label}
                                className="absolute inset-0 w-full h-full object-cover"
                                fetchPriority={i === 0 ? 'high' : 'low'}
                                loading={i === 0 ? 'eager' : 'lazy'}
                                decoding={i === 0 ? 'sync' : 'async'}
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <p className="text-white text-[13px] font-black leading-tight">{card.label}</p>
                                <p className="text-white/60 text-[10px] font-semibold">{card.sub}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* ── 3. Category List (Carousell-style cards) ── */}
                <div className="px-4 mb-6">
                    <div className="flex flex-col gap-0 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                        {CATEGORY_LIST.map((cat, i) => (
                            <Link
                                key={cat.href}
                                href={cat.href}
                                className={`flex items-center gap-3.5 px-4 py-3.5 active:bg-slate-50 dark:active:bg-zinc-800 transition-colors group ${i < CATEGORY_LIST.length - 1 ? 'border-b border-slate-100 dark:border-zinc-800' : ''}`}
                            >
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.bg} shadow-sm`}>
                                    <span style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif', fontSize: '22px', lineHeight: 1 }}>
                                        {cat.emoji}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-black text-slate-900 dark:text-white leading-tight group-hover:text-moriones-red transition-colors">
                                        {cat.label}
                                    </p>
                                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 font-medium truncate">
                                        {cat.desc}
                                    </p>
                                </div>
                                <span className="material-symbols-outlined text-[18px] text-slate-300 dark:text-zinc-600 group-hover:text-moriones-red transition-colors flex-shrink-0">
                                    chevron_right
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── 3b. Popular on MarketHub (server-rendered internal links) ── */}
                {popularSection}

                {/* ── 4. Grouped Feed ─────────────────────────── */}
                <div className="space-y-8 px-4">
                    {/* Section header matching mockup */}
                    {Object.keys(categorizedItems).length > 0 && (
                        <p className="text-[13px] font-black uppercase tracking-[0.15em] text-slate-800 dark:text-white mb-4">
                            Recent Activity
                        </p>
                    )}
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
                                classifieds: '/marketplace',
                                jobs: '/jobs',
                                transport: '/commute',
                                businesses: '/directory',
                                gems: '/gems',
                            };

                            return (
                                <div key={type} className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between pl-1">
                                        <h2 className="text-base font-black text-text-main tracking-tight">
                                            {items[0]?.categoryLabel || type}
                                        </h2>
                                        <Link
                                            className="text-[11px] font-black text-moriones-red hover:underline uppercase tracking-wider"
                                            href={viewAllLinkMap[type] || '#'}
                                        >
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
                                                <div className="relative aspect-square w-full overflow-hidden bg-white dark:bg-zinc-900">
                                                    <Image
                                                        alt={item.title}
                                                        className="object-contain"
                                                        src={item.image}
                                                        fill
                                                        sizes="(max-width: 768px) 50vw, 33vw"
                                                    />
                                                    {item.type === 'businesses' && item.image.includes('store_manager.webp') && (
                                                        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-2 text-center group-hover:bg-black/40 transition-colors">
                                                            <span className="material-symbols-outlined text-white/90 text-2xl mb-1 drop-shadow-lg">domain_verification</span>
                                                            <span className="text-white font-black text-[10px] uppercase tracking-widest drop-shadow-lg leading-tight">Verify Your<br/>Business</span>
                                                        </div>
                                                    )}
                                                    {item.extraInfo && (
                                                        <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-sm shadow-lg border border-white/10 z-10">
                                                            <p className="text-[10px] font-black text-white">{item.extraInfo}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1 p-3">
                                                    <h3 className="line-clamp-1 text-xs font-bold text-text-main leading-snug group-hover:text-moriones-red transition-colors">
                                                        {item.title}
                                                    </h3>
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

                    {/* RoRo + Events special block */}
                    {(categorizedItems['roro'] || categorizedItems['event']) && (
                        <div className="grid grid-cols-2 gap-4 pb-12">
                            {['roro', 'event'].map(type => {
                                const item = categorizedItems[type]?.[0];
                                if (!item) return null;
                                const viewAllLink = type === 'roro' ? '/ports' : '/events';

                                return (
                                    <div key={type} className="flex flex-col gap-3">
                                        <div className="flex items-center justify-between pl-1">
                                            <h2 className="text-[13px] font-black text-text-main tracking-tight truncate pr-2">
                                                {item.categoryLabel}
                                            </h2>
                                            <Link
                                                className="text-[10px] font-black text-moriones-red hover:underline flex-shrink-0 uppercase tracking-wider"
                                                href={viewAllLink}
                                            >
                                                View All
                                            </Link>
                                        </div>
                                        <Link
                                            href={item.link}
                                            className="group relative flex flex-col overflow-hidden rounded-2xl bg-background-main border border-border-main shadow-sm hover:shadow-md transition-all h-full"
                                        >
                                            <div className="relative aspect-square w-full overflow-hidden bg-white dark:bg-zinc-900">
                                                <Image
                                                    alt={item.title}
                                                    className="object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                                                    src={item.image}
                                                    fill
                                                    sizes="(max-width: 768px) 50vw, 33vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
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
            </div>
        </div>
    );
}
