/**
 * Marketplace Content Moderation – Filter & Rate Limiter
 *
 * contentFilter.ts exposes two functions:
 *   1. checkContent()  – scans title + description for blocked keywords
 *   2. checkRateLimit() – enforces max 5 active listings per user per 24h
 */

import { ENGLISH_BLOCKLIST, TAGALOG_BLOCKLIST } from './blocklist';
import type { SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RATE_LIMIT_MAX = 5;           // max listings per window
const RATE_LIMIT_WINDOW_HOURS = 24; // rolling window in hours

// Pre-compile all blocklist patterns once at module load time for performance
const BLOCKLIST_PATTERNS: { pattern: RegExp; term: string }[] = [
    ...ENGLISH_BLOCKLIST,
    ...TAGALOG_BLOCKLIST,
].map((term) => ({
    term,
    // Use word-boundary for short single words; substring match for phrases
    pattern: term.includes(' ')
        ? new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
        : new RegExp(`(?<![a-zA-Z])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-zA-Z])`, 'i'),
}));

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContentCheckResult {
    blocked: boolean;
    reason?: string;
}

export interface RateLimitResult {
    limited: boolean;
    count: number;
    maxAllowed: number;
}

// ---------------------------------------------------------------------------
// checkContent
// ---------------------------------------------------------------------------

/**
 * Scans the provided text against the bilingual blocklist.
 * Returns { blocked: false } if clean, or { blocked: true, reason } if flagged.
 *
 * @param text - Combined listing text (title + description, etc.)
 */
export function checkContent(text: string): ContentCheckResult {
    if (!text || text.trim().length === 0) {
        return { blocked: false };
    }

    for (const { pattern, term } of BLOCKLIST_PATTERNS) {
        if (pattern.test(text)) {
            return {
                blocked: true,
                reason: `Your listing contains prohibited content ("${term}"). Please edit and resubmit.`,
            };
        }
    }

    return { blocked: false };
}

// ---------------------------------------------------------------------------
// checkRateLimit
// ---------------------------------------------------------------------------

/**
 * Checks how many active listings the user has created in the last 24 hours.
 * Returns { limited: true } if they have hit or exceeded RATE_LIMIT_MAX.
 *
 * @param userId  - Authenticated user's UUID
 * @param supabase - Supabase client (user-scoped, not admin)
 */
export async function checkRateLimit(
    userId: string,
    supabase: SupabaseClient,
): Promise<RateLimitResult> {
    const windowStart = new Date(
        Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000,
    ).toISOString();

    const { count, error } = await supabase
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('created_at', windowStart);

    if (error) {
        // Fail open — don't block the user if we can't query (log server-side)
        console.error('[RateLimit] Failed to query listing count:', error.message);
        return { limited: false, count: 0, maxAllowed: RATE_LIMIT_MAX };
    }

    const currentCount = count ?? 0;
    return {
        limited: currentCount >= RATE_LIMIT_MAX,
        count: currentCount,
        maxAllowed: RATE_LIMIT_MAX,
    };
}
