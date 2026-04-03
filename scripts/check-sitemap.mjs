#!/usr/bin/env node
/**
 * check-sitemap.mjs
 * 
 * Scans src/app for all page.tsx routes and compares them against
 * STATIC_ROUTES in src/app/sitemap.ts. Prints warnings for any
 * public-facing routes that are missing from the sitemap.
 * 
 * Runs automatically as a prebuild hook — prints warnings but
 * does NOT fail the build so deploys are never blocked.
 * 
 * Usage:  node scripts/check-sitemap.mjs
 *   or:   npm run check:sitemap
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, sep } from 'path';

const APP_DIR = join(process.cwd(), 'src', 'app');
const SITEMAP_FILE = join(APP_DIR, 'sitemap.ts');

// Routes that should NEVER be in the sitemap (auth-gated, admin, forms, dynamic)
const EXCLUDE_PATTERNS = [
  /^\/admin/,
  /^\/login/,
  /^\/onboarding/,
  /^\/claim-business/,
  /^\/profile\/edit/,
  /\/create$/,
  /\/new$/,
  /\/edit$/,
  /\/join$/,
  /\/register$/,
  /\/\[/,                          // dynamic routes like /[id], /[slug]
  /^\/create-/,                    // legacy create screens
  /^\/post-/,                      // legacy post screens
  /^\/google-sign-in/,
  /^\/moderator-/,
  /^\/marinduque-connect-admin/,
  /^\/classifieds-/,
  /^\/listing-details/,
  /^\/job-vacancy-details/,
  /^\/marinduque-monthly/,
  /^\/gems-of-marinduque/,
  /^\/share-a-?local/,
  /^\/live-market\/seller/,        // seller dashboard (auth-gated)
  /^\/live-market\/claim/,         // claim pages (dynamic)
  /^\/live-market\/\[/,            // dynamic live market routes
];

// Recursively find all page.tsx files
function findPages(dir, base = '') {
  const routes = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      routes.push(...findPages(full, `${base}/${entry}`));
    } else if (entry === 'page.tsx') {
      routes.push(base || '/');
    }
  }
  return routes;
}

// Extract URLs from STATIC_ROUTES in sitemap.ts
function extractSitemapRoutes() {
  const content = readFileSync(SITEMAP_FILE, 'utf-8');
  const urls = [];
  const regex = /\$\{BASE\}(\/[^`'"]*)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    urls.push(match[1]);
  }
  // Also check for bare BASE (home page)
  if (content.includes('url: BASE,') || content.includes('url: BASE }')) {
    urls.push('/');
  }
  return new Set(urls);
}

// ── Main ──────────────────────────────────────────────────────────────────────

const allRoutes = findPages(APP_DIR)
  .map(r => r.replace(/\\/g, '/'))  // normalize Windows paths
  .sort();

const sitemapRoutes = extractSitemapRoutes();

const publicRoutes = allRoutes.filter(route => {
  return !EXCLUDE_PATTERNS.some(pattern => pattern.test(route));
});

const missing = publicRoutes.filter(route => !sitemapRoutes.has(route));

console.log('');
console.log('┌─────────────────────────────────────────────────┐');
console.log('│          🗺️  Sitemap Route Audit                │');
console.log('└─────────────────────────────────────────────────┘');
console.log(`  Total page.tsx routes found:  ${allRoutes.length}`);
console.log(`  Public (non-excluded) routes: ${publicRoutes.length}`);
console.log(`  In sitemap STATIC_ROUTES:     ${sitemapRoutes.size}`);
console.log('');

if (missing.length === 0) {
  console.log('  ✅ All public routes are in the sitemap!');
} else {
  console.log(`  ⚠️  ${missing.length} public route(s) MISSING from sitemap.ts:`);
  console.log('');
  for (const route of missing) {
    console.log(`     • ${route}`);
  }
  console.log('');
  console.log('  → Add these to STATIC_ROUTES in src/app/sitemap.ts');
  console.log('    or add a pattern to EXCLUDE_PATTERNS in this script');
  console.log('    if they should be excluded.');
}

console.log('');
