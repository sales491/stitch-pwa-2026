'use client';

import { usePathname } from 'next/navigation';

/**
 * BreadcrumbJsonLd — Renders Schema.org BreadcrumbList JSON-LD based on the current URL path.
 * 
 * Placed once in the root layout, it automatically generates breadcrumbs for every page.
 * Google displays these as "Home > Island Life > Gas Prices" in search results.
 * 
 * Mapping rules:
 * - Slugs are title-cased (e.g. "gas-prices" → "Gas Prices")
 * - Known slugs get human-friendly labels (e.g. "faq" → "Help & FAQ")
 * - Dynamic segments like [id] are excluded from the label but included in the path
 */

const LABEL_MAP: Record<string, string> = {
    '': 'Home',
    'marketplace': 'Marketplace',
    'jobs': 'Jobs',
    'directory': 'Business Directory',
    'events': 'Events',
    'community': 'Community',
    'gems': 'Gems of Marinduque',
    'island-hopping': 'Island Hopping',
    'commute': 'Commute & Delivery',
    'ports': 'Port Schedules',
    'ferry-schedule': 'Ferry Schedule',
    'things-to-do': 'Things to Do',
    'moriones-festival': 'Moriones Festival',
    'island-life': 'Island Life',
    'gas-prices': 'Gas Prices',
    'palengke': 'Palengke Prices',
    'tides': 'Tides & Fishing',
    'outages': 'Outage Reports',
    'skills': 'Skills & Trades',
    'my-barangay': 'My Barangay',
    'board': 'Bulletin Board',
    'lost-found': 'Lost & Found',
    'calamity': 'Mga Abiso',
    'ofw': 'OFW Hub',
    'paluwagan': 'Paluwagan',
    'live-market': 'Live Market',
    'best-of-boac-monthly-spotlight': 'Best of Boac',
    'calendar': 'Calendar',
    'faq': 'Help & FAQ',
    'about': 'About',
    'contact': 'Contact',
    'profile': 'Profile',
    'advanced-search-filters': 'Search',
    'policies': 'Policies',
    'privacy-policy-data-rights': 'Privacy Policy',
    'help-community-guidelines': 'Community Guidelines',
};

function toLabel(slug: string): string {
    if (LABEL_MAP[slug]) return LABEL_MAP[slug];
    // Title-case fallback: "gas-prices" → "Gas Prices"
    return slug
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

const BASE = 'https://marinduquemarket.com';

export default function BreadcrumbJsonLd() {
    const pathname = usePathname();

    // Don't render on home page (no breadcrumb needed)
    if (!pathname || pathname === '/') return null;

    const segments = pathname.split('/').filter(Boolean);

    // Build breadcrumb items: Home → Segment1 → Segment2 → ...
    const items = [
        { name: 'Home', url: BASE },
        ...segments.map((segment, i) => ({
            name: toLabel(segment),
            url: `${BASE}/${segments.slice(0, i + 1).join('/')}`,
        })),
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
