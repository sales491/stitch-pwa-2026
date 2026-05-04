#!/usr/bin/env node
/**
 * Marinduque Market Hub — Full Site Audit Script
 * ================================================
 * Part 1: HTTP crawler — checks every page for status codes, broken links, error markers
 * Part 2: Code pattern scanner — detects React anti-patterns that cause flickering/loops
 * 
 * Run: node scripts/full-site-audit.mjs
 * Output: scripts/audit-report.txt
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORT_PATH = path.join(__dirname, 'audit-report.txt');
const BASE = 'https://marinduquemarket.com';
const SRC = path.join(__dirname, '..', 'src');

// All static routes from the sitemap
const STATIC_PAGES = [
  '/', '/news', '/marketplace', '/jobs', '/events', '/gems',
  '/directory', '/directory/Boac', '/directory/Buenavista', '/directory/Gasan',
  '/directory/Mogpog', '/directory/Santa%20Cruz', '/directory/Torrijos',
  '/towns', '/towns/boac', '/towns/buenavista', '/towns/gasan',
  '/towns/mogpog', '/towns/santa-cruz', '/towns/torrijos',
  '/map', '/community', '/island-hopping', '/commute', '/ports',
  '/ferry-schedule', '/just-landed', '/things-to-do',
  '/moriones-festival', '/moriones-festival/artisans',
  '/island-life', '/island-life/palengke', '/island-life/tides',
  '/island-life/outages', '/island-life/skills', '/island-life/gas-prices',
  '/my-barangay', '/my-barangay/board', '/my-barangay/lost-found',
  '/my-barangay/calamity', '/my-barangay/ofw', '/my-barangay/paluwagan',
  '/live-market', '/live-selling',
  '/best-of-boac-monthly-spotlight', '/advanced-search-filters',
  '/post', '/guides/manila-to-marinduque',
  '/faq', '/about', '/profile', '/login',
  '/policies', '/privacy-policy-data-rights', '/help-community-guidelines',
  '/island-hopping/list', '/live-selling/new',
  '/profile/edit', '/admin',
];

const log = [];
function report(msg) {
  console.log(msg);
  log.push(msg);
}

function hr() {
  report('─'.repeat(80));
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART 1: HTTP CRAWLER
// ═══════════════════════════════════════════════════════════════════════════════

async function fetchPage(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'MarinduqueMarket-Audit/1.0' },
        redirect: 'follow',
      });
      clearTimeout(timeout);
      const html = await res.text();
      return { status: res.status, html, redirected: res.redirected, finalUrl: res.url, error: null };
    } catch (err) {
      if (i === retries) return { status: 0, html: '', redirected: false, finalUrl: url, error: err.message };
    }
  }
}

function checkHtmlForErrors(html) {
  const issues = [];

  // React error boundaries
  if (html.includes('Application error') || html.includes('client-side exception')) {
    issues.push('🔴 React error boundary triggered');
  }
  if (html.includes('Internal Server Error') || html.includes('500')) {
    // Only flag if it looks like an error page, not content mentioning "500"
    if (html.includes('<h1') && html.includes('500')) {
      issues.push('🔴 500 error page detected');
    }
  }
  if (html.includes('This page could not be found') && html.includes('404')) {
    issues.push('🟡 404 page rendered');
  }
  if (html.includes('NEXT_NOT_FOUND')) {
    issues.push('🟡 Next.js notFound() was called');
  }
  // Hydration errors
  if (html.includes('Hydration failed') || html.includes('hydration mismatch')) {
    issues.push('🔴 Hydration error detected');
  }

  return issues;
}

function extractInternalLinks(html, pageUrl) {
  const links = new Set();
  // Match href="..." patterns
  const hrefRegex = /href="(\/[^"]*?)"/g;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];
    // Skip static assets, anchors, and API routes
    if (href.startsWith('/_next') || href.startsWith('/api/') || href.includes('#') || 
        href.endsWith('.png') || href.endsWith('.jpg') || href.endsWith('.svg') ||
        href.endsWith('.ico') || href.endsWith('.webp') || href.endsWith('.json') ||
        href.endsWith('.js') || href.endsWith('.css') || href.endsWith('.xml') ||
        href.endsWith('.txt') || href.endsWith('.woff2')) {
      continue;
    }
    links.add(href);
  }
  return [...links];
}

async function crawlAllPages() {
  report('\n╔══════════════════════════════════════════════════════════════════════════════╗');
  report('║            PART 1: HTTP CRAWLER — Page Status & Broken Links              ║');
  report('╚══════════════════════════════════════════════════════════════════════════════╝\n');

  const results = { ok: 0, redirected: 0, errors: 0, warnings: 0 };
  const allDiscoveredLinks = new Set();
  const brokenLinks = [];
  const pageIssues = [];

  // Phase 1: Check all known static pages
  report(`Crawling ${STATIC_PAGES.length} static pages...\n`);

  for (const route of STATIC_PAGES) {
    const url = `${BASE}${route}`;
    const { status, html, redirected, finalUrl, error } = await fetchPage(url);

    const label = route.padEnd(50);

    if (error) {
      report(`  ❌ ${label} TIMEOUT/ERROR: ${error}`);
      results.errors++;
      pageIssues.push({ route, issue: `Fetch error: ${error}` });
      continue;
    }

    if (status >= 500) {
      report(`  🔴 ${label} ${status} SERVER ERROR`);
      results.errors++;
      pageIssues.push({ route, issue: `HTTP ${status}` });
    } else if (status === 404) {
      report(`  🟡 ${label} ${status} NOT FOUND`);
      results.warnings++;
      pageIssues.push({ route, issue: 'HTTP 404' });
    } else if (redirected) {
      report(`  🔀 ${label} ${status} → ${finalUrl.replace(BASE, '')}`);
      results.redirected++;
    } else if (status === 200) {
      // Check HTML for error markers
      const htmlIssues = checkHtmlForErrors(html);
      if (htmlIssues.length > 0) {
        report(`  ⚠️  ${label} ${status} OK but: ${htmlIssues.join(', ')}`);
        results.warnings++;
        pageIssues.push({ route, issue: htmlIssues.join('; ') });
      } else {
        report(`  ✅ ${label} ${status} OK`);
        results.ok++;
      }

      // Collect internal links for Phase 2
      const links = extractInternalLinks(html, url);
      links.forEach(l => allDiscoveredLinks.add(l));
    } else {
      report(`  ❓ ${label} ${status}`);
      results.warnings++;
    }

    // Rate limiting — don't hammer Vercel
    await new Promise(r => setTimeout(r, 300));
  }

  // Phase 2: Verify all discovered internal links
  hr();
  const newLinks = [...allDiscoveredLinks].filter(l => !STATIC_PAGES.includes(l) && !l.includes('['));
  report(`\nPhase 2: Verifying ${newLinks.length} discovered internal links...\n`);

  let linkChecks = 0;
  for (const link of newLinks.slice(0, 100)) { // Cap at 100 to avoid excessive requests
    const url = `${BASE}${link}`;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: { 'User-Agent': 'MarinduqueMarket-Audit/1.0' },
        redirect: 'follow',
      });
      clearTimeout(timeout);

      if (res.status >= 400) {
        report(`  🔗 BROKEN: ${link} → ${res.status}`);
        brokenLinks.push({ link, status: res.status });
      }
      linkChecks++;
    } catch (err) {
      report(`  🔗 UNREACHABLE: ${link} → ${err.message}`);
      brokenLinks.push({ link, status: 'timeout' });
    }
    await new Promise(r => setTimeout(r, 200));
  }

  // Summary
  hr();
  report('\n📊 CRAWLER SUMMARY:');
  report(`  Pages OK:        ${results.ok}`);
  report(`  Redirected:      ${results.redirected}`);
  report(`  Warnings:        ${results.warnings}`);
  report(`  Errors:          ${results.errors}`);
  report(`  Links checked:   ${linkChecks}`);
  report(`  Broken links:    ${brokenLinks.length}`);

  if (pageIssues.length > 0) {
    report('\n🚨 PAGES WITH ISSUES:');
    pageIssues.forEach(p => report(`  • ${p.route}: ${p.issue}`));
  }
  if (brokenLinks.length > 0) {
    report('\n🔗 BROKEN LINKS:');
    brokenLinks.forEach(b => report(`  • ${b.link} → ${b.status}`));
  }

  return { pageIssues, brokenLinks };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART 2: CODE PATTERN SCANNER (React Anti-Pattern Detection)
// ═══════════════════════════════════════════════════════════════════════════════

function getAllTsxFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllTsxFiles(full));
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

function scanFileForAntiPatterns(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];
  const relPath = path.relative(SRC, filePath).replace(/\\/g, '/');

  // Skip non-client components (server components don't have hooks)
  if (!content.includes("'use client'") && !content.includes('"use client"')) {
    return [];
  }

  // 1. createClient() without useMemo — causes new reference every render
  if (content.includes('createClient()') || content.includes('createBrowserClient(')) {
    const hasUseMemo = content.includes('useMemo');
    // Check if createClient is inside a useMemo
    const createClientInMemo = /useMemo\s*\(\s*\(\)\s*=>\s*create(Client|BrowserClient)\(/.test(content);
    // Check if createClient is at module level (outside component — that's OK)
    const lines = content.split('\n');
    let insideComponent = false;
    let braceDepth = 0;
    
    for (const line of lines) {
      if (/^export\s+(default\s+)?function\s+/.test(line) || /^function\s+\w+/.test(line)) {
        insideComponent = true;
      }
      if (insideComponent) {
        braceDepth += (line.match(/{/g) || []).length;
        braceDepth -= (line.match(/}/g) || []).length;
        
        if ((line.includes('createClient()') || line.includes('createBrowserClient(')) 
            && !line.includes('useMemo') && !line.trim().startsWith('//')) {
          // Check if this line is inside a useMemo callback
          if (!createClientInMemo) {
            issues.push({
              file: relPath,
              type: '⚡ FLICKER RISK',
              detail: 'createClient() called inside component without useMemo — creates new reference every render, can trigger useEffect loops',
              line: line.trim(),
            });
          }
        }
        
        if (braceDepth <= 0) insideComponent = false;
      }
    }
  }

  // 2. useEffect that sets state listed in its own dependency array
  const effectRegex = /useEffect\(\s*\(\)\s*=>\s*\{([\s\S]*?)\}\s*,\s*\[([\s\S]*?)\]\s*\)/g;
  let effectMatch;
  while ((effectMatch = effectRegex.exec(content)) !== null) {
    const effectBody = effectMatch[1];
    const deps = effectMatch[2];
    
    // Find setState calls in the effect body
    const setStateMatches = effectBody.match(/set([A-Z]\w+)\s*\(/g) || [];
    for (const setter of setStateMatches) {
      // Extract the state variable name from the setter (e.g., setUser -> user, setIsMenuOpen -> isMenuOpen)
      const stateVar = setter.replace(/^set/, '').replace(/\s*\($/, '');
      const camelCase = stateVar.charAt(0).toLowerCase() + stateVar.slice(1);
      
      // Check if this state variable is in the dependency array
      if (deps.includes(camelCase)) {
        issues.push({
          file: relPath,
          type: '🔴 INFINITE LOOP',
          detail: `useEffect sets '${camelCase}' which is in its own dependency array [${deps.trim()}] — causes infinite re-render`,
          line: `set${stateVar}(...)`,
        });
      }
    }
  }

  // 3. setTimeout with 0ms delay in useEffect (often a hack that causes flicker)
  if (/setTimeout\s*\(.*?,\s*0\s*\)/.test(content)) {
    // Check if it's inside a useEffect
    const effectBlocks = content.match(/useEffect\(\s*\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[[\s\S]*?\]\s*\)/g) || [];
    for (const block of effectBlocks) {
      if (/setTimeout\s*\(.*?,\s*0\s*\)/.test(block)) {
        issues.push({
          file: relPath,
          type: '🟡 FLICKER RISK',
          detail: 'setTimeout(fn, 0) inside useEffect — often causes visible flicker',
          line: 'setTimeout(..., 0)',
        });
      }
    }
  }

  // 4. Missing cleanup for realtime subscriptions
  if (content.includes('.subscribe()') && !content.includes('removeChannel')) {
    issues.push({
      file: relPath,
      type: '🟡 MEMORY LEAK',
      detail: 'Supabase .subscribe() without removeChannel() cleanup — can cause stale state and flicker on remount',
    });
  }

  // 5. Links to non-existent admin routes
  const deadAdminRoutes = ['/admin/news-approval', '/admin/news', '/admin/approve'];
  for (const route of deadAdminRoutes) {
    if (content.includes(`"${route}"`) || content.includes(`'${route}'`)) {
      issues.push({
        file: relPath,
        type: '🔗 DEAD LINK',
        detail: `References non-existent route: ${route}`,
      });
    }
  }

  return issues;
}

async function runCodePatternScan() {
  report('\n\n╔══════════════════════════════════════════════════════════════════════════════╗');
  report('║          PART 2: CODE PATTERN SCANNER — React Anti-Pattern Detection       ║');
  report('╚══════════════════════════════════════════════════════════════════════════════╝\n');

  const allFiles = getAllTsxFiles(SRC);
  report(`Scanning ${allFiles.length} source files for anti-patterns...\n`);

  const allIssues = [];
  for (const file of allFiles) {
    const issues = scanFileForAntiPatterns(file);
    allIssues.push(...issues);
  }

  if (allIssues.length === 0) {
    report('  ✅ No anti-patterns detected!\n');
  } else {
    // Group by type
    const grouped = {};
    for (const issue of allIssues) {
      if (!grouped[issue.type]) grouped[issue.type] = [];
      grouped[issue.type].push(issue);
    }

    for (const [type, issues] of Object.entries(grouped)) {
      report(`\n${type} (${issues.length} found):`);
      for (const issue of issues) {
        report(`  📄 ${issue.file}`);
        report(`     ${issue.detail}`);
        if (issue.line) report(`     Line: ${issue.line}`);
      }
    }
  }

  report(`\n📊 PATTERN SCAN SUMMARY:`);
  report(`  Files scanned:     ${allFiles.length}`);
  report(`  Issues found:      ${allIssues.length}`);
  report(`  Critical (🔴):     ${allIssues.filter(i => i.type.includes('🔴')).length}`);
  report(`  Flicker risks (⚡): ${allIssues.filter(i => i.type.includes('⚡')).length}`);
  report(`  Warnings (🟡):     ${allIssues.filter(i => i.type.includes('🟡')).length}`);

  return allIssues;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  const startTime = Date.now();
  
  report('╔══════════════════════════════════════════════════════════════════════════════╗');
  report('║         MARINDUQUE MARKET HUB — FULL SITE AUDIT                            ║');
  report(`║         Started: ${new Date().toLocaleString()}                             ║`);
  report('╚══════════════════════════════════════════════════════════════════════════════╝');

  // Run both parts
  const { pageIssues, brokenLinks } = await crawlAllPages();
  const codeIssues = await runCodePatternScan();

  // Final summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  report('\n');
  hr();
  report('🏁 AUDIT COMPLETE');
  report(`   Total time: ${elapsed}s`);
  report(`   HTTP issues: ${pageIssues.length}`);
  report(`   Broken links: ${brokenLinks.length}`);
  report(`   Code anti-patterns: ${codeIssues.length}`);
  hr();

  // Write report to file
  fs.writeFileSync(REPORT_PATH, log.join('\n'), 'utf-8');
  console.log(`\n📄 Full report saved to: ${REPORT_PATH}`);
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
