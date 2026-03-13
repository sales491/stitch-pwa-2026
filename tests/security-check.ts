/**
 * Cross-User RLS Security Test
 * Tests that User B cannot delete or update User A's listings.
 * 
 * Run with: npx ts-node --project tsconfig.json tests/security-check.ts
 * Or:       npx tsx tests/security-check.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing env vars. Copy .env.local values into your shell first.');
    process.exit(1);
}

// Admin client (service role) — can bypass RLS for test setup/teardown
const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// ── Test credentials (must be real users in auth.users) ─────────────
// Provide two real test user email/password accounts. 
// Best practice: create dedicated test accounts that are NOT real accounts.
const USER_A_EMAIL    = process.env.TEST_USER_A_EMAIL    ?? 'tester-a@marinduqueconnect.com';
const USER_A_PASSWORD = process.env.TEST_USER_A_PASSWORD ?? '';
const USER_B_EMAIL    = process.env.TEST_USER_B_EMAIL    ?? 'tester-b@marinduqueconnect.com';
const USER_B_PASSWORD = process.env.TEST_USER_B_PASSWORD ?? '';

async function runTests() {
    console.log('\n🔐 ===== Cross-User RLS Security Test =====\n');

    let testListingId: string | null = null;
    let passed = 0;
    let failed = 0;

    // ── Sign in as User A ─────────────────────────────────────────────
    console.log('1️⃣  Signing in as User A...');
    const clientA = createClient(SUPABASE_URL, ANON_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
    const { data: signInA, error: signInAErr } = await clientA.auth.signInWithPassword({
        email: USER_A_EMAIL,
        password: USER_A_PASSWORD,
    });
    if (signInAErr || !signInA.user) {
        console.error(`   ❌ Could not sign in as User A: ${signInAErr?.message}`);
        console.error('   → Create test accounts first (see README). Test aborted.\n');
        process.exit(1);
    }
    console.log(`   ✅ User A signed in: ${signInA.user.id}\n`);

    // ── User A creates a test listing ─────────────────────────────────
    console.log('2️⃣  User A creates a test listing...');
    const { data: listing, error: createErr } = await clientA
        .from('listings')
        .insert({
            title: '[SECURITY TEST] Do Not Approve — Auto-Delete',
            price: '₱1',
            price_value: 1,
            category: 'General',
            town: 'Boac',
            description: 'Automated security test listing. Safe to delete.',
            condition: 'Good',
            user_id: signInA.user.id,
            seller_id: signInA.user.id,
            status: 'draft', // draft so it never appears in marketplace
            slug: `security-test-${Date.now()}`,
        })
        .select('id')
        .single();

    if (createErr || !listing) {
        console.error(`   ❌ User A could not insert: ${createErr?.message}\n`);
        failed++;
    } else {
        testListingId = listing.id;
        console.log(`   ✅ Created listing: ${testListingId}\n`);
        passed++;
    }

    if (!testListingId) {
        console.error('Cannot continue without a test listing. Aborting.\n');
        process.exit(1);
    }

    // ── Sign in as User B ─────────────────────────────────────────────
    console.log('3️⃣  Signing in as User B...');
    const clientB = createClient(SUPABASE_URL, ANON_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
    const { data: signInB, error: signInBErr } = await clientB.auth.signInWithPassword({
        email: USER_B_EMAIL,
        password: USER_B_PASSWORD,
    });
    if (signInBErr || !signInB.user) {
        console.error(`   ❌ Could not sign in as User B: ${signInBErr?.message}`);
        console.error('   → Create test accounts first (see README). Cleaning up...\n');
        await cleanUp(testListingId);
        process.exit(1);
    }
    console.log(`   ✅ User B signed in: ${signInB.user.id}\n`);

    // ── TEST 1: User B attempts DELETE on User A's listing ────────────
    console.log('4️⃣  [TEST 1] User B attempts DELETE on User A\'s listing...');
    const { data: deleteData, error: deleteErr } = await clientB
        .from('listings')
        .delete()
        .eq('id', testListingId)
        .select('id'); // returns deleted rows — should be empty

    const deletedRows = deleteData?.length ?? 0;
    if (deletedRows > 0) {
        console.error(`   🚨 FAIL — RLS DELETE policy broken! User B deleted ${deletedRows} row(s)!`);
        console.error(`      Listing ID: ${testListingId}`);
        console.error('      File to check: supabase/migrations/ — DELETE policy on listings table\n');
        failed++;
        testListingId = null; // already deleted, skip cleanup
    } else {
        console.log('   ✅ PASS — DELETE rejected. Rows affected: 0\n');
        passed++;
    }

    // ── TEST 2: User B attempts UPDATE on User A's listing ────────────
    console.log('5️⃣  [TEST 2] User B attempts UPDATE on User A\'s listing...');
    if (testListingId) {
        const { data: updateData, error: updateErr } = await clientB
            .from('listings')
            .update({ title: 'HACKED BY USER B' })
            .eq('id', testListingId)
            .select('id');

        const updatedRows = updateData?.length ?? 0;
        if (updatedRows > 0) {
            console.error(`   🚨 FAIL — RLS UPDATE policy broken! User B updated ${updatedRows} row(s)!`);
            console.error('      File to check: supabase/migrations/ — UPDATE policy on listings table\n');
            failed++;
        } else {
            console.log('   ✅ PASS — UPDATE rejected. Rows affected: 0\n');
            passed++;
        }
    } else {
        console.log('   ⚠️  SKIPPED — listing was already deleted in TEST 1\n');
    }

    // ── TEST 3: Unauthenticated DELETE attempt ────────────────────────
    console.log('6️⃣  [TEST 3] Unauthenticated client attempts DELETE...');
    const anonClient = createClient(SUPABASE_URL, ANON_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
    });
    const { data: anonDel } = await anonClient.from('listings').delete().eq('id', testListingId ?? 'nonexistent').select('id');
    const anonDelRows = anonDel?.length ?? 0;
    if (anonDelRows > 0) {
        console.error('   🚨 FAIL — Anonymous DELETE succeeded! RLS is disabled on listings table!');
        failed++;
    } else {
        console.log('   ✅ PASS — Anonymous DELETE rejected. Rows affected: 0\n');
        passed++;
    }

    // ── Cleanup ───────────────────────────────────────────────────────
    if (testListingId) await cleanUp(testListingId);

    // ── Summary ───────────────────────────────────────────────────────
    console.log('='.repeat(45));
    console.log(`\n🏁 Results: ${passed} passed, ${failed} failed\n`);
    if (failed > 0) {
        console.error('🚨 SECURITY ISSUES FOUND — review RLS policies above.\n');
        process.exit(1);
    } else {
        console.log('✅ All security checks passed. RLS is correctly enforced.\n');
        process.exit(0);
    }
}

async function cleanUp(id: string) {
    console.log(`🧹 Cleaning up test listing ${id}...`);
    const { error } = await adminClient.from('listings').delete().eq('id', id);
    if (error) console.warn(`   ⚠️  Cleanup warning: ${error.message}`);
    else console.log('   ✅ Cleaned up.\n');
}

runTests().catch((err) => {
    console.error('💥 Unexpected error:', err);
    process.exit(1);
});
