/**
 * E2E Test: Marketplace — Create a New Listing
 *
 * Flow:
 *  1. Auth state injected by global-setup (magic link — no Google OAuth popup)
 *  2. Navigate to /marketplace/create
 *  3. Upload a dummy 1x1 PNG image via the hidden file input
 *  4. Fill title, price, category (1st select), condition (2nd select),
 *     town (3rd select), and description
 *  5. Fill contact section (phone number)
 *  6. Submit the form
 *  7. Assert SuccessToast appears ("Listing submitted for review!")
 *  8. Assert redirect to /marketplace
 *  9. Assert DB record exists in 'listings' with correct data (status = pending)
 * 10. Cleanup: delete the test listing + storage images
 */

import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

dotenv.config({ path: path.join(__dirname, '.env.test') });

// ── Test constants ───────────────────────────────────────────────────────────
const TEST_TITLE = `[E2E Test] Listing ${Date.now()}`;
const TEST_PRICE = '250';
const TEST_DESCRIPTION =
  'This is an automated E2E test listing. Please ignore. It will be deleted automatically.';

// Minimal 1×1 transparent PNG (67 bytes)
const DUMMY_PNG_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI6QAAAABJRU5ErkJggg==';

// ── Admin client for DB assertions + cleanup ─────────────────────────────────
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// ── Test ─────────────────────────────────────────────────────────────────────
test.describe('Marketplace — Create Listing', () => {
  let createdListingId: string | null = null;

  test.afterEach(async () => {
    if (!createdListingId) return;
    const admin = getAdminClient();

    // Fetch image paths for storage cleanup
    const { data: listing } = await admin
      .from('listings')
      .select('images')
      .eq('id', createdListingId)
      .maybeSingle();

    // Delete the DB row (regardless of whether images exist)
    await admin.from('listings').delete().eq('id', createdListingId);
    console.log(`🗑️  Deleted test listing: ${createdListingId}`);

    // Delete any uploaded images from Storage
    const images: string[] = listing?.images ?? [];
    const storagePaths = images
      .map((url: string) => {
        const match = url.match(/\/listings\/(.+)$/);
        return match ? match[1] : null;
      })
      .filter(Boolean) as string[];

    if (storagePaths.length > 0) {
      await admin.storage.from('listings').remove(storagePaths);
      console.log(`🗑️  Removed ${storagePaths.length} image(s) from Storage`);
    }
  });

  test('fills form, uploads image, submits, and verifies DB record', async ({ page }) => {
    // ── 1. Navigate to create page ────────────────────────────────────────────
    await page.goto('/marketplace/create');

    // Verify we're authenticated — if we land on /login the session wasn't restored
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8_000 });
    await expect(page.locator('form')).toBeVisible({ timeout: 10_000 });

    // Verify Supabase auth cookie is present so the server action won't 400
    const cookies = await page.context().cookies();
    const authCookie = cookies.find((c) => c.name.includes('-auth-token'));
    expect(authCookie, 'Auth cookie must exist for server action to see the session').toBeTruthy();
    console.log(`🍪 Auth cookie found: ${authCookie?.name}`);

    // ── 2. Upload a dummy image ──────────────────────────────────────────────
    const tmpImagePath = path.join(os.tmpdir(), `e2e-dummy-${Date.now()}.png`);
    fs.writeFileSync(tmpImagePath, Buffer.from(DUMMY_PNG_B64, 'base64'));

    // The file input is hidden — set files directly via the element ref
    const fileInput = page.locator('input[type="file"][accept="image/*"]').first();
    await fileInput.setInputFiles(tmpImagePath);
    fs.unlinkSync(tmpImagePath);

    // Wait for the thumbnail to appear (image is uploaded to Supabase Storage)
    await expect(page.locator('img[alt="Gallery item"]')).toBeVisible({ timeout: 30_000 });

    // ── 3. Fill title ─────────────────────────────────────────────────────────
    await page.getByPlaceholder('What are you selling?').fill(TEST_TITLE);

    // ── 4. Fill price ─────────────────────────────────────────────────────────
    await page.getByPlaceholder('0.00').fill(TEST_PRICE);

    // ── 5. Category — 1st <select> on the page ───────────────────────────────
    await page.locator('select').nth(0).selectOption({ value: 'General' });

    // ── 6. Condition — 2nd <select> ──────────────────────────────────────────
    await page.locator('select').nth(1).selectOption({ value: 'Good' });

    // ── 7. Town — 3rd <select> ───────────────────────────────────────────────
    await page.locator('select').nth(2).selectOption({ value: 'Boac' });

    // ── 8. Description ────────────────────────────────────────────────────────
    await page
      .getByPlaceholder(/Describe your item in detail/i)
      .fill(TEST_DESCRIPTION);

    // ── 9. Contact — fill the Facebook username field in ContactSection ──────
    // Placeholder is "yourusername" (sits next to "facebook.com/" prefix text)
    await page.getByPlaceholder('yourusername').fill('testuser.e2e.playwright');


    // ── 10. Submit ────────────────────────────────────────────────────────────
    const submitBtn = page.getByRole('button', { name: /Publish Listing/i });
    await expect(submitBtn).toBeEnabled({ timeout: 5_000 });
    await submitBtn.click();

    // ── 11. Assert SuccessToast ───────────────────────────────────────────────
    await expect(
      page.getByText(/submitted for review|listing submitted|successfully/i)
    ).toBeVisible({ timeout: 20_000 });

    // ── 12. Assert redirect to /marketplace ──────────────────────────────────
    await page.waitForURL('**/marketplace**', { timeout: 10_000 });
    expect(page.url()).toContain('/marketplace');

    // ── 13. DB verification ───────────────────────────────────────────────────
    const admin = getAdminClient();

    // Wait up to 5s for the DB write to complete (async server action)
    let listingRow: any = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data } = await admin
        .from('listings')
        .select('id, title, price_value, town, status')
        .eq('title', TEST_TITLE)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) { listingRow = data; break; }
      await new Promise((r) => setTimeout(r, 1000));
    }

    expect(listingRow, 'Listing record should exist in DB').not.toBeNull();
    expect(listingRow.title).toBe(TEST_TITLE);
    expect(Number(listingRow.price_value)).toBe(parseFloat(TEST_PRICE));
    expect(listingRow.town).toBe('Boac');
    expect(['pending', 'active']).toContain(listingRow.status); // pending until approved

    createdListingId = listingRow.id;
    console.log(`✅ Test listing verified in DB: ${createdListingId}`);
  });
});
