/**
 * E2E Test Suite: Help Center / FAQ Page
 *
 * Covers:
 *  1. Default tab (general) loads correctly
 *  2. Deep-link tabs (?tab=business, ?tab=operator, ?tab=palengke) activate correctly
 *  3. Search bar filters questions within the active tab
 *  4. FAQPage JSON-LD schema is present in <head>
 *  5. Accordion expand/collapse interaction works
 */

import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env.test') });

test.describe('FAQ / Help Center', () => {

  // ── 1. Default tab ─────────────────────────────────────────────────────────
  test('loads /faq with General Users tab active by default', async ({ page }) => {
    await page.goto('/faq');

    // Page title in <head>
    await expect(page).toHaveTitle(/Help Center|FAQ/i);

    // H1 heading
    await expect(page.getByRole('heading', { name: /Help Center/i })).toBeVisible({ timeout: 10_000 });

    // Search bar is present
    await expect(page.getByPlaceholder('Search for answers...')).toBeVisible();

    // "General Users" tab button should be styled as active (bg-blue-600)
    const generalTab = page.getByRole('button', { name: 'General Users' });
    await expect(generalTab).toBeVisible();
    await expect(generalTab).toHaveClass(/bg-blue-600/);

    // At least one general FAQ accordion should be visible
    await expect(page.getByText('How do I create an account?').first()).toBeVisible();
  });

  // ── 2. Deep-link: ?tab=business ───────────────────────────────────────────
  test('deep-link ?tab=business activates the Business tab', async ({ page }) => {
    await page.goto('/faq?tab=business');

    const businessTab = page.getByRole('button', { name: 'Local Business' });
    await expect(businessTab).toBeVisible({ timeout: 10_000 });
    await expect(businessTab).toHaveClass(/bg-blue-600/);

    // A business-specific FAQ should be visible
    await expect(page.getByText('How do I claim my business directory profile?').first()).toBeVisible();

    // General FAQs should NOT be visible (tab is filtered)
    await expect(page.getByText('How do I create an account?').first()).not.toBeVisible();
  });

  // ── 3. Deep-link: ?tab=operator ───────────────────────────────────────────
  test('deep-link ?tab=operator activates the Operator tab', async ({ page }) => {
    await page.goto('/faq?tab=operator');

    const operatorTab = page.getByRole('button', { name: 'Transport & Ops' });
    await expect(operatorTab).toBeVisible({ timeout: 10_000 });
    await expect(operatorTab).toHaveClass(/bg-blue-600/);

    // An operator-specific FAQ should be visible
    await expect(page.getByText('How do I list my tricycle or boat for transport?').first()).toBeVisible();
  });

  // ── 4. Deep-link: ?tab=palengke ───────────────────────────────────────────
  test('deep-link ?tab=palengke activates the Palengke Sellers tab', async ({ page }) => {
    await page.goto('/faq?tab=palengke');

    const palengkeTab = page.getByRole('button', { name: 'Palengke Sellers' });
    await expect(palengkeTab).toBeVisible({ timeout: 10_000 });
    await expect(palengkeTab).toHaveClass(/bg-blue-600/);

    // A palengke-specific FAQ should be visible
    await expect(page.getByText('How do I list my daily market goods?').first()).toBeVisible();
  });

  // ── 5. Tab switching works client-side ────────────────────────────────────
  test('clicking tabs switches content without full page reload', async ({ page }) => {
    await page.goto('/faq');

    // Start on general — click Business tab
    await page.getByRole('button', { name: 'Local Business' }).click();

    // URL should update
    await expect(page).toHaveURL(/\?tab=business/);

    // Business content now visible
    await expect(page.getByText('How do I claim my business directory profile?').first()).toBeVisible();

    // Click Palengke tab
    await page.getByRole('button', { name: 'Palengke Sellers' }).click();
    await expect(page).toHaveURL(/\?tab=palengke/);
    await expect(page.getByText('How do I list my daily market goods?').first()).toBeVisible();
  });

  // ── 6. Search bar filters results ─────────────────────────────────────────
  test('search bar filters FAQs within the active tab', async ({ page }) => {
    await page.goto('/faq');

    const searchBar = page.getByPlaceholder('Search for answers...');
    await searchBar.fill('marketplace');

    // Should show the marketplace-related question
    await expect(page.getByText('Is the marketplace free to use?').first()).toBeVisible({ timeout: 5_000 });

    // Other unrelated general questions should be hidden
    await expect(page.getByText('How do I create an account?').first()).not.toBeVisible();

    // Clear search — all questions return
    await searchBar.clear();
    await expect(page.getByText('How do I create an account?').first()).toBeVisible();
  });

  // ── 7. Accordion opens and closes ─────────────────────────────────────────
  test('accordion expands to show answer and collapses on second click', async ({ page }) => {
    await page.goto('/faq');

    // Find the first <details> element (first FAQ accordion)
    const accordion = page.locator('details').first();
    await expect(accordion).toBeVisible({ timeout: 10_000 });

    // Click the <summary> inside it to open
    const summary = accordion.locator('summary');

    // Initially closed
    await expect(accordion).not.toHaveAttribute('open');

    // Click to open
    await summary.click();
    await expect(accordion).toHaveAttribute('open');

    // The div containing the answer should now be visible
    const answerDiv = accordion.locator('div').last();
    await expect(answerDiv).toBeVisible();

    // Click again to close
    await summary.click();
    await expect(accordion).not.toHaveAttribute('open');
  });

  // ── 8a. JSON-LD: present in raw server-rendered HTML (SSR validation) ──────
  //
  // This is the definitive SEO test. It intercepts the HTTP response the moment
  // headers arrive — before Next.js hydration or any client JS runs — and checks
  // the raw HTML string directly. This is exactly what Google's crawler sees.
  // If this test passes, we are guaranteed the schema is server-rendered.
  //
  test('FAQPage JSON-LD is present in the SERVER-rendered HTML (pre-hydration)', async ({ page }) => {
    // 'commit' = response headers received + body starts arriving; no JS executed yet
    const response = await page.goto('/faq', { waitUntil: 'commit' });

    expect(response, 'Page response should not be null').not.toBeNull();
    expect(response!.status()).toBe(200);

    const rawHtml = await response!.text();

    // The schema must be in the raw HTML string — not injected by client JS
    expect(rawHtml).toContain('"@type":"FAQPage"');
    expect(rawHtml).toContain('"@context":"https://schema.org"');
    expect(rawHtml).toContain('"@type":"Question"');
    expect(rawHtml).toContain('"acceptedAnswer"');

    // Sanity check: the script tag itself should be in the raw HTML
    expect(rawHtml).toContain('application/ld+json');
  });

  // ── 8b. JSON-LD: schema structure is valid after hydration ────────────────
  //
  // Once JS runs, validate the parsed JSON is structurally correct per
  // schema.org/FAQPage spec — correct types, required fields, and real content.
  //
  test('FAQPage JSON-LD schema structure is valid (post-hydration)', async ({ page }) => {
    await page.goto('/faq');

    const schemaContent = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      for (const s of scripts) {
        try {
          const parsed = JSON.parse(s.textContent || '');
          if (parsed['@type'] === 'FAQPage') return parsed;
        } catch { /* skip */ }
      }
      return null;
    });

    expect(schemaContent, 'FAQPage schema should parse correctly').not.toBeNull();
    expect(schemaContent['@context']).toBe('https://schema.org');
    expect(schemaContent['@type']).toBe('FAQPage');

    // Must have actual FAQ entries (not an empty array)
    expect(Array.isArray(schemaContent.mainEntity)).toBe(true);
    expect(schemaContent.mainEntity.length).toBeGreaterThan(0);

    // Every entity must conform to schema.org/Question spec
    for (const entity of schemaContent.mainEntity) {
      expect(entity['@type']).toBe('Question');
      expect(typeof entity.name).toBe('string');
      expect(entity.name.length).toBeGreaterThan(0);
      expect(entity.acceptedAnswer?.['@type']).toBe('Answer');
      expect(typeof entity.acceptedAnswer?.text).toBe('string');
      expect(entity.acceptedAnswer.text.length).toBeGreaterThan(0);
    }
  });

  // ── 9. No results state ───────────────────────────────────────────────────
  test('shows empty state when search has no matches', async ({ page }) => {
    await page.goto('/faq');

    await page.getByPlaceholder('Search for answers...')
      .fill('xyzzy-no-match-12345');

    await expect(page.getByText(/No FAQs found for your search/i)).toBeVisible({ timeout: 5_000 });
  });

});
