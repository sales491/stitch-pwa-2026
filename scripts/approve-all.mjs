import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function approveAll() {
  const { data, error, count } = await supabase
    .from('business_profiles')
    .update({ is_verified: true, verification_status: 'verified' })
    .eq('is_verified', false)
    .select();

  if (error) {
    console.error("Error updating profiles:", error);
  } else {
    console.log(`Successfully approved ${data.length} business profiles!`);
  }
}

approveAll().catch(console.error);
