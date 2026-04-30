/**
 * Centralized Route Definitions
 * 
 * This file acts as the single source of truth for dynamic URL paths across the app.
 * Using these functions prevents broken links and 404 errors when namespace folders are refactored.
 */

export const ROUTES = {
    // ── Directory ────────────────────────────────────────────────────────
    DIRECTORY_HOME: '/directory',
    
    // Generates the hub page for a specific municipality: /directory/Boac
    DIRECTORY_TOWN: (townName: string) => `/directory/${encodeURIComponent(townName)}`,
    
    // Generates the specific business profile page: /directory/b/123-abc
    BUSINESS_PROFILE: (businessId: string) => `/directory/b/${businessId}`,

    // Generates the category-specific town page: /directory/Boac/restaurant
    DIRECTORY_CATEGORY: (townName: string, categorySlug: string) => 
        `/directory/${encodeURIComponent(townName)}/${encodeURIComponent(categorySlug)}`,

    // ── Other Entities (Stubs for future expansion) ──────────────────────
    MARKETPLACE_ITEM: (itemId: string) => `/marketplace/${itemId}`,
    JOB_POST: (jobSlug: string) => `/jobs/${jobSlug}`,
    EVENT_POST: (eventId: string) => `/events/${eventId}`,
    GEM_POST: (gemId: string) => `/gems/${gemId}`,
    NEWS_ARTICLE: (newsSlug: string) => `/news/${newsSlug}`,
};
