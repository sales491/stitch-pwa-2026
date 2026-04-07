const BASE = 'https://marinduquemarket.com';

/**
 * Returns the standard hreflang alternates for any page on this site.
 * Includes en, tl (Tagalog/Filipino), and x-default — all pointing to the
 * same URL (self-referencing pattern, since we serve one URL per page).
 *
 * Usage in static metadata:
 *   alternates: hreflangAlternates('/gems')
 *
 * Usage in generateMetadata (dynamic routes):
 *   alternates: hreflangAlternates(`/gems/${id}`)
 *
 * @param path - The path segment, e.g. '/gems' or '/just-landed'
 */
export function hreflangAlternates(path: string) {
    const url = `${BASE}${path}`;
    return {
        canonical: url,
        languages: {
            'en': url,
            'tl': url,
            'x-default': url,
        },
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tagalog keyword sets — import and spread into any page's keywords[] array.
//
// RULE: Always append Tagalog terms alongside English, never replace them.
// RULE: Tourist-facing pages (ferry-schedule, moriones-festival, things-to-do)
//       add keywords only — keep descriptions English.
// RULE: Community/local pages may use Taglish in descriptions.
// ─────────────────────────────────────────────────────────────────────────────

/** Community boards, barangay, social feed pages */
export const TAGALOG_KEYWORDS_COMMUNITY = [
    'komunidad Marinduque', 'barangay board Marinduque', 'balita Marinduque',
    'usap-usapan lokal', 'grupo Marinduque', 'mga Marinduqueno', 'kapwa Marinduqueno',
] as const;

/** Marketplace / buy & sell pages */
export const TAGALOG_KEYWORDS_MARKETPLACE = [
    'bilihan Marinduque', 'magbentahan Marinduque', 'pangalawang kamay',
    'murang gamit Marinduque', 'lokal na palengke online', 'second hand Pilipinas',
] as const;

/** Jobs / employment pages */
export const TAGALOG_KEYWORDS_JOBS = [
    'trabaho sa Marinduque', 'hanapbuhay Marinduque', 'bakanteng trabaho Marinduque',
    'lokal na trabaho Pilipinas', 'serbisyo Marinduque',
] as const;

/** Business directory pages */
export const TAGALOG_KEYWORDS_DIRECTORY = [
    'negosyo Marinduque', 'lokal na negosyo', 'tindahan Marinduque',
    'serbisyo lokal Marinduque', 'restaurant Marinduque', 'saan kumain Marinduque',
] as const;

/** Events / festivals pages */
export const TAGALOG_KEYWORDS_EVENTS = [
    'kaganapan sa Marinduque', 'pagdiriwang Marinduque', 'fiesta Marinduque',
    'pista opisyal Marinduque', 'aktibidad lokal',
] as const;

/** Gems / local attractions pages */
export const TAGALOG_KEYWORDS_GEMS = [
    'magandang lugar sa Marinduque', 'likas na yaman Marinduque',
    'pasyalan Marinduque', 'hidden gems Pilipinas', 'turistang lugar Marinduque',
] as const;

/** Travel / getting to Marinduque pages */
export const TAGALOG_KEYWORDS_TRAVEL = [
    'paano pumunta sa Marinduque', 'byahe sa Marinduque', 'turismo Marinduque',
    'pasyalan Pilipinas', 'isla ng Marinduque', 'sakay papuntang Marinduque',
] as const;

/** Island life / utility pages (tides, gas, outages, palengke) */
export const TAGALOG_KEYWORDS_ISLAND_LIFE = [
    'pamumuhay sa Marinduque', 'buhay isla Marinduque', 'lokal na serbisyo',
    'presyo Marinduque', 'tulong komunidad',
] as const;

/** OFW / remittance pages */
export const TAGALOG_KEYWORDS_OFW = [
    'OFW Marinduque', 'padala pera Marinduque', 'remittance center Marinduque',
    'palitan dolyar Pilipinas', 'tulong OFW pamilya',
] as const;

/** Barangay-specific community pages (board, calamity, lost & found) */
export const TAGALOG_KEYWORDS_BARANGAY = [
    'barangay Marinduque', 'komunidad lokal', 'kapwa Marinduqueno',
    'lokal na balita barangay', 'tulong barangay Philippines',
] as const;

/** Live selling / online streaming pages */
export const TAGALOG_KEYWORDS_LIVE_SELLING = [
    'live selling Marinduque', 'nagbebenta live Marinduque', 'TikTok live Marinduque',
    'Shopee live Marinduque', 'online seller Marinduque', 'bili online Marinduque',
    'live stream benta Pilipinas', 'lokal na seller Marinduque',
] as const;

