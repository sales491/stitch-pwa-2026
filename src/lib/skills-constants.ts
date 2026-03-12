// Skills Exchange constants and types — not a server file

export const MUNICIPALITIES = ['Boac', 'Gasan', 'Mogpog', 'Sta. Cruz', 'Torrijos', 'Buenavista'] as const;
export type Municipality = typeof MUNICIPALITIES[number];

export type SkillCategory = 'teaching' | 'repairs' | 'crafts' | 'food' | 'tech' | 'health' | 'beauty' | 'other';

export const SKILL_CATEGORIES: Record<SkillCategory, { label: string; emoji: string; color: string; bg: string; border: string }> = {
    teaching: { label: 'Teaching & Tutoring', emoji: '📚', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/20', border: 'border-violet-100 dark:border-violet-900/30' },
    repairs:  { label: 'Repairs & Maintenance', emoji: '🔧', color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-950/20',   border: 'border-blue-100 dark:border-blue-900/30' },
    crafts:   { label: 'Crafts & Arts',         emoji: '🎨', color: 'text-pink-600 dark:text-pink-400',   bg: 'bg-pink-50 dark:bg-pink-950/20',   border: 'border-pink-100 dark:border-pink-900/30' },
    food:     { label: 'Food & Catering',        emoji: '🍱', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/20', border: 'border-orange-100 dark:border-orange-900/30' },
    tech:     { label: 'Tech & Digital',         emoji: '💻', color: 'text-sky-600 dark:text-sky-400',     bg: 'bg-sky-50 dark:bg-sky-950/20',     border: 'border-sky-100 dark:border-sky-900/30' },
    health:   { label: 'Health & Wellness',      emoji: '🏥', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-100 dark:border-emerald-900/30' },
    beauty:   { label: 'Beauty & Grooming',      emoji: '💇', color: 'text-rose-600 dark:text-rose-400',   bg: 'bg-rose-50 dark:bg-rose-950/20',   border: 'border-rose-100 dark:border-rose-900/30' },
    other:    { label: 'Other Skills',           emoji: '⭐', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-100 dark:border-amber-900/30' },
};

export type SkillListing = {
    id: string;
    created_at: string;
    expires_at: string;
    posted_by: string;
    poster_name: string | null;
    skill_name: string;
    category: SkillCategory;
    municipality: string;
    description: string;
    rate: string | null;
    availability: string | null;
    contact: {
        phone?: string;
        fbUsername?: string;
    };
};
