'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HubItem } from '@/data/hub-items';

// ─── Static Category Grid ────────────────────────────────────────────────────
// All static links — no data fetching, nothing can break
const CATEGORY_GRID = [
    { emoji: '🛒', label: 'MARKET',    href: '/marketplace',                     bg: 'bg-teal-100',    text: 'text-teal-800'    },
    { emoji: '💼', label: 'JOBS',      href: '/jobs',                             bg: 'bg-orange-100',  text: 'text-orange-800'  },
    { emoji: '🏝️', label: 'HOPPING',  href: '/island-hopping',                   bg: 'bg-cyan-100',    text: 'text-cyan-800'    },
    { emoji: '🚢', label: 'RORO',      href: '/ports',                            bg: 'bg-blue-100',    text: 'text-blue-800'    },
    { emoji: '📣', label: 'COMMUNITY', href: '/community',                        bg: 'bg-rose-100',    text: 'text-rose-800'    },
    { emoji: '🏆', label: 'BEST BOAC', href: '/best-of-boac-monthly-spotlight',  bg: 'bg-red-100',     text: 'text-red-800'     },
    { emoji: '💎', label: 'GEMS',      href: '/gems',                             bg: 'bg-emerald-100', text: 'text-emerald-800' },
    { emoji: '📅', label: 'EVENTS',    href: '/events',                           bg: 'bg-pink-100',    text: 'text-pink-800'    },
    { emoji: '🛵', label: 'COMMUTE',   href: '/commute',                          bg: 'bg-indigo-100',  text: 'text-indigo-800'  },
    { emoji: '🌏', label: 'FOREIGNER', href: '/blog',                             bg: 'bg-purple-100',  text: 'text-purple-800'  },
    { emoji: '🏪', label: 'BUSINESS',  href: '/directory',                        bg: 'bg-amber-100',   text: 'text-amber-800'   },
    { emoji: '⚖️', label: 'POLICIES',  href: '/policies',                         bg: 'bg-slate-100',   text: 'text-slate-700'   },
];

// ─── Static Quick-Action Cards ───────────────────────────────────────────────
// NO live counts — fully static to prevent any failure state
const QUICK_CARDS = [
    {
        label: 'Island Hopping',
        sub: 'Book a boat trip',
        href: '/island-hopping',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    },
    {
        label: 'Marketplace',
        sub: 'Buy & sell local',
        href: '/marketplace',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
    },
    {
        label: 'Jobs',
        sub: 'Find work here',
        href: '/jobs',
        image: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=600&q=80',
    },
];

type Props = {
    initialItems: HubItem[];
};

export default function MarinduqueConnectHomeFeed({ initialItems }: Props) {
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
                <div className="mx-4 mt-4 mb-5 rounded-2xl overflow-hidden shadow-md"
                    style={{ background: 'linear-gradient(135deg, #C62828 0%, #4a4a4a 60%, #2d2d2d 100%)' }}>
                    <div className="px-5 py-4 flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60 flex items-center gap-1 mb-1">
                                <span>📍</span> Marinduque Island, PH
                            </p>
                            <h1 className="text-[22px] font-black text-white leading-tight tracking-tight">
                                Your Island<br />Community Hub
                            </h1>
                            <p className="text-[9px] text-white/40 font-medium mt-1.5 tracking-wide">
                                Boac · Gasan · Mogpog · Sta. Cruz · Torrijos · Buenavista
                            </p>
                        </div>
                        {/* Decorative faint island silhouette */}
                        <div className="text-[64px] opacity-10 select-none ml-3 leading-none">
                            🏝️
                        </div>
                    </div>
                </div>

                {/* ── 2. Quick-Action Cards (static, horizontal scroll) ───── */}
                <div className="flex gap-3 overflow-x-auto px-4 mb-5 no-scrollbar pb-1">
                    {QUICK_CARDS.map(card => (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="relative flex-shrink-0 w-44 h-24 rounded-2xl overflow-hidden shadow-sm active:scale-[0.97] transition-transform"
                        >
                            <img
                                src={card.image}
                                alt={card.label}
                                className="absolute inset-0 w-full h-full object-cover"
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

                {/* ── 3. Category Icon Grid (4 cols × 3 rows, all static) ── */}
                <div className="px-4 mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 mb-3">
                        Browse Categories
                    </p>
                    <div className="grid grid-cols-4 gap-2.5">
                        {CATEGORY_GRID.map(cat => (
                            <Link
                                key={cat.href}
                                href={cat.href}
                                className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                            >
                                <div className={`w-full aspect-square rounded-2xl flex items-center justify-center text-[26px] ${cat.bg} shadow-sm`}>
                                    {cat.emoji}
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-tight text-center leading-none ${cat.text} dark:text-slate-300`}>
                                    {cat.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── 4. Grouped Feed (unchanged) ─────────────────────────── */}
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
                                classifieds: '/marketplace',
                                jobs: '/jobs',
                                transport: '/commute',
                                businesses: '/directory',
                                gems: '/gems',
                                blog: '/blog',
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
                                                <div className="relative aspect-[4/3] w-full overflow-hidden">
                                                    <img
                                                        alt={item.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        src={item.image}
                                                    />
                                                    {item.extraInfo && (
                                                        <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-sm shadow-lg border border-white/10">
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
                                                className="text-[10px] font-black text-moriones-red hover:underline flex-shrink-0"
                                                href={viewAllLink}
                                            >
                                                GO
                                            </Link>
                                        </div>
                                        <Link
                                            href={item.link}
                                            className="group relative flex flex-col overflow-hidden rounded-2xl bg-background-main border border-border-main shadow-sm hover:shadow-md transition-all h-full"
                                        >
                                            <div className="relative aspect-square overflow-hidden">
                                                <img
                                                    alt={item.title}
                                                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                                                    src={item.image}
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
