'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HubItem } from '@/data/hub-items';

// ─── Static Category Grid ────────────────────────────────────────────────────
// All static links — no data fetching, nothing can break
const CATEGORY_GRID = [
    { emoji: '🛒️', label: 'Market',      href: '/marketplace'                    },
    { emoji: '💼️', label: 'Jobs',        href: '/jobs'                           },
    { emoji: '📅️', label: 'Events',      href: '/events'                         },
    { emoji: '🏝️', label: 'Hopping',     href: '/island-hopping'                 },
    { emoji: '🚢️', label: 'RoRo',        href: '/ports'                          },
    { emoji: '💎️', label: 'Gems',        href: '/gems'                           },
    { emoji: '🏆️', label: 'Boac',        href: '/best-of-boac-monthly-spotlight' },
    { emoji: '🛵️', label: `Commute &\nDelivery`, href: '/commute'               },
    { emoji: '🌿️', label: `Island\nLife`,  href: '/island-life'                  },
    { emoji: '🏘️', label: `My\nBarangay`, href: '/my-barangay'                   },
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
                <div className="mx-4 mt-4 mb-5 rounded-2xl overflow-hidden shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #E53935 0%, #C62828 35%, #7B1010 70%, #2d2d2d 100%)' }}>
                    <div className="px-5 py-0 flex items-center justify-between overflow-hidden">
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
                        {/* Marinduque island — real silhouette image, defines banner height */}
                        <div className="ml-2 flex-shrink-0 flex items-center">
                            <Image
                                src="/images/marinduque-island-silhouette.png"
                                alt="Marinduque Island"
                                width={130}
                                height={130}
                                style={{ mixBlendMode: 'screen', opacity: 0.45 }}
                                className="object-contain"
                                priority
                            />
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
                    <div className="grid grid-cols-4 gap-3">
                        {CATEGORY_GRID.map(cat => (
                            <Link
                                key={cat.href}
                                href={cat.href}
                                className="active:scale-95 transition-transform"
                            >
                                <div className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-0.5 py-2 px-1 bg-white dark:bg-zinc-800 shadow-md border border-slate-100 dark:border-zinc-700 overflow-hidden">
                                    <span style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif', fontSize: '24px', lineHeight: 1 }}>
                                        {cat.emoji}
                                    </span>
                                    <span className="text-[8px] font-black text-center leading-tight text-slate-700 dark:text-slate-200 w-full text-center mt-0.5 whitespace-pre-line">
                                        {cat.label}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

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
