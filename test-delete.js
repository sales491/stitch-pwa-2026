import { createAdminClient } from './src/utils/supabase/admin.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testDelete() {
    console.log("Starting deletion test...");
    const adminSupabase = createAdminClient();

    // Attempt deleting a real ID from listings
    const { data, error } = await adminSupabase.from('listings').delete().eq('id', '912f9fbb-3cd7-44fc-807b-9c4afc1590fd').select();

    console.log("Result:", data);
    console.log("Error:", error);
}

testDelete();
