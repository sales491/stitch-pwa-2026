// Palengke constants and types — NOT a server file, safe to import anywhere

export type Municipality = 'Boac' | 'Gasan' | 'Mogpog' | 'Sta. Cruz' | 'Torrijos' | 'Buenavista';

export const MUNICIPALITIES: Municipality[] = [
    'Boac',
    'Gasan',
    'Mogpog',
    'Sta. Cruz',
    'Torrijos',
    'Buenavista',
];

export type PalengkePrice = {
    id: string;
    municipality: string;
    category: 'fish' | 'produce' | 'meat' | 'other';
    item_name: string;
    price: number;
    unit: string;
    note: string | null;
    stall_location: string | null;
    availability_tag: 'available' | 'just_arrived' | 'limited' | 'fresh_today' | 'preorder' | null;
    posted_by: string | null;
    created_at: string;
    poster_name?: string | null;
    fb_username?: string | null;
    vendor_name?: string | null;
};

export type PricesByCategory = {
    fish: PalengkePrice[];
    produce: PalengkePrice[];
    meat: PalengkePrice[];
    other: PalengkePrice[];
};

export const AVAILABILITY_TAGS = {
    available:   { label: 'Available',    emoji: '✅', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    just_arrived:{ label: 'Just Arrived', emoji: '🚨', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/30' },
    limited:     { label: 'Limited Stock',emoji: '⚠️', color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-950/30' },
    fresh_today: { label: 'Fresh Today',  emoji: '🌊', color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-950/30' },
    preorder:    { label: 'Pre-order',    emoji: '📋', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/30' },
} as const;

// Market schedule context — static, shown inline on the page
export const MARKET_SCHEDULE: Record<Municipality, { schedule: string; tip: string }> = {
    'Boac':       { schedule: 'Open daily',         tip: 'Busiest Wed & Sat' },
    'Gasan':      { schedule: 'Open daily',         tip: 'Fresh fish arrives Fri–Sun early morning' },
    'Mogpog':     { schedule: 'Open daily',         tip: 'Best produce Tue, Thu, Sat' },
    'Sta. Cruz':  { schedule: 'Open daily',         tip: 'Sunday market is especially busy' },
    'Torrijos':   { schedule: 'Mon, Wed, Fri, Sat', tip: 'Best selection Sat; Poctoy beach fish' },
    'Buenavista': { schedule: 'Mon, Thu, Sat',      tip: 'Local kakanin on weekends' },
};
