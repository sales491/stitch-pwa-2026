/**
 * E2E Test Suite: FAQ Page — Responsive UI & Offline PWA Audit
 *
 * Part 1: Responsive breakpoint audit across mobile, tablet, desktop
 *  - Accordions have minimum 44×44px touch targets (Apple HIG / WCAG 2.5.5)
 *  - Tab buttons are horizontally scrollable on mobile without overflow
 *  - Search bar is full-width and usable at all sizes
 *  - Content is readable (no horizontal overflow causing text clipping)
 *
 * Part 2: Offline PWA test
 *  - IMPORTANT: The service worker is disabled in NODE_ENV=development.
 *  - This test MUST be run against a production build:
 *      npm run build
 *      npm run start   (then: npx playwright test faq-audit.spec.ts)
 *  - It will be automatically skipped in dev mode.
 */

import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env.test') });

// ── Viewport definitions ──────────────────────────────────────────────────────
const VIEWPORTS = [
  { name: 'Mobile S  (iPhone SE)',      width: 375,  height: 667  },
  { name: 'Mobile L  (iPhone 14 Pro)',  width: 430,  height: 932  },
  { name: 'Tablet    (iPad Air)',       width: 768,  height: 1024 },
  { name: 'Desktop   (1280×800)',       width: 1280, height: 800  },
  { name: 'Desktop L (1920×1080)',      width: 1920, height: 1080 },
];

// Minimum touch target size — 44px per Apple HIG, recommended by WCAG 2.5.5
const MIN_TOUCH_TARGET_PX = 44;

// ── Part 1: Responsive Breakpoint Audit ──────────────────────────────────────

for (const vp of VIEWPORTS) {
  test.describe(`Responsive audit @ ${vp.name} (${vp.width}×${vp.height})`, () => {

    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('page loads with correct heading and no horizontal scroll', async ({ page }) => {
      await page.goto('/faq');
      await expect(page.getByRole('heading', { name: /Help Center/i })).toBeVisible({ timeout: 10_000 });

      // No horizontal overflow — scrollWidth should equal clientWidth on <body>
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.body.scrollWidth > document.body.clientWidth;
      });
      expect(hasHorizontalScroll, `Horizontal scroll detected at ${vp.width}px — content is overflowing`).toBe(false);
    });

    test('search bar is full-width and focusable', async ({ page }) => {
      await page.goto('/faq');
      const searchBar = page.getByPlaceholder('Search for answers...');
      await expect(searchBar).toBeVisible();

      // Must be focusable (keyboard/touch accessible)
      await searchBar.focus();
      await expect(searchBar).toBeFocused();

      // Width should be at least 60% of viewport (genuinely full-width)
      const box = await searchBar.boundingBox();
      expect(box, 'Search bar should have a bounding box').not.toBeNull();
      expect(box!.width).toBeGreaterThan(vp.width * 0.6);
    });

    test('tab buttons meet minimum touch target height (44px)', async ({ page }) => {
      await page.goto('/faq');

      const tabs = page.getByRole('button', { name: /General Users|Local Business|Transport|Palengke/i });
      const count = await tabs.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const tab = tabs.nth(i);
        const box = await tab.boundingBox();
        expect(box, `Tab ${i} should have a bounding box`).not.toBeNull();
        expect(
          box!.height,
          `Tab "${await tab.textContent()}" height ${box!.height}px is below 44px touch target minimum`
        ).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
      }
    });

    test('accordion summary rows meet minimum touch target height (44px)', async ({ page }) => {
      await page.goto('/faq');
      await expect(page.locator('details').first()).toBeVisible({ timeout: 10_000 });

      const summaries = page.locator('details summary');
      const count = await summaries.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const box = await summaries.nth(i).boundingBox();
        expect(box, `Summary ${i} should have a bounding box`).not.toBeNull();
        expect(
          box!.height,
          `Accordion row ${i} height ${box!.height}px is below 44px touch target minimum`
        ).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
      }
    });

    test('accordion opens and closes via tap/click at this viewport', async ({ page }) => {
      await page.goto('/faq');
      const accordion = page.locator('details').first();
      await expect(accordion).toBeVisible({ timeout: 10_000 });

      const summary = accordion.locator('summary');
      await expect(accordion).not.toHaveAttribute('open');
      await summary.click();
      await expect(accordion).toHaveAttribute('open');
      await summary.click();
      await expect(accordion).not.toHaveAttribute('open');
    });

  });
}

// ── Part 2: Offline PWA Test ──────────────────────────────────────────────────

test.describe('Offline PWA — Service Worker cache fallback', () => {

  test('FAQ page loads from SW cache when network is unavailable', async ({ browser }) => {
    // Skip in development — SW is intentionally disabled in dev mode to prevent
    // stale cache issues. Run this test against: npm run build && npm run start
    const isDevServer = process.env.NODE_ENV !== 'production';
    if (isDevServer) {
      test.skip(true, 'SW is disabled in dev mode. Run against production build: npm run build && npm run start');
    }

    // Step 1: Visit /faq online so the SW caches it
    const context: BrowserContext = await browser.newContext();
    const page: Page = await context.newPage();

    await page.goto('/faq', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: /Help Center/i })).toBeVisible({ timeout: 15_000 });

    // Give SW time to cache the response in the background
    await page.waitForTimeout(2000);

    // Step 2: Go offline at the network level
    await context.setOffline(true);

    // Step 3: Reload — should serve from SW cache, not fail
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 15_000 });

    // Step 4: Key content should still be visible from cache
    await expect(
      page.getByRole('heading', { name: /Help Center/i }),
      'Help Center heading should be visible offline from SW cache'
    ).toBeVisible({ timeout: 10_000 });

    await expect(
      page.getByPlaceholder('Search for answers...'),
      'Search bar should be present offline'
    ).toBeVisible();

    // Step 5: Go back online and clean up
    await context.setOffline(false);
    await context.close();
  });

});
