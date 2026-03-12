/**
 * global-setup.ts
 *
 * Gets a valid Supabase session for the test user by calling the Admin REST API
 * with the service-role key. This bypasses the Email auth provider requirement —
 * works even when Email provider is disabled in Supabase.
 *
 * Flow:
 *   1. Generate a magic link for the test user via admin.auth.admin.generateLink()
 *   2. Follow the magic link URL in a headless browser page — Supabase exchanges
 *      the hashed_token for a real session and redirects back to localhost
 *   3. Save the resulting cookies/localStorage as Playwright storage state
 *      so all test specs can reuse it without re-authenticating
 */
import { test as setup } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { STORAGE_STATE } from './playwright.config';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '.env.test') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const testEmail = process.env.TEST_USER_EMAIL!;

setup('authenticate test user', async ({ page }) => {
  if (!supabaseUrl || !serviceKey || !testEmail) {
    throw new Error('Missing required env vars in e2e/.env.test');
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Generate a magic link via the Supabase admin SDK.
  // This works WITHOUT enabling Email/Password provider in the Supabase dashboard.
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: testEmail,
  });

  if (linkErr || !linkData?.properties?.hashed_token) {
    throw new Error(
      `Failed to generate magic link: ${linkErr?.message ?? JSON.stringify(linkData)}`
    );
  }

  // Build the verify URL — Supabase exchanges the one-time token for a real session
  // and redirects back to localhost:3000, setting auth cookies automatically.
  const magicUrl =
    `${supabaseUrl}/auth/v1/verify` +
    `?token=${linkData.properties.hashed_token}` +
    `&type=magiclink` +
    `&redirect_to=http://localhost:3000/`;

  await page.goto(magicUrl);

  // Wait for Supabase to redirect back to the app after verifying the token
  await page.waitForURL('http://localhost:3000/**', { timeout: 15_000 });

  console.log(`✅ Magic link exchanged — now at: ${page.url()}`);

  // Save cookies + localStorage so all test specs reuse this session
  fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });
  await page.context().storageState({ path: STORAGE_STATE });

  console.log(`✅ Session saved to ${STORAGE_STATE}`);
});
