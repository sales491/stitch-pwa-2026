import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Unverifying all businesses except Minido Preschool...');
  
  // Get all businesses except Minido Preschool
  const { data: businesses, error: fetchError } = await supabase
    .from('business_profiles')
    .select('id, business_name')
    .neq('business_name', 'Minido Preschool');

  if (fetchError) {
    console.error('Error fetching businesses:', fetchError);
    return;
  }

  console.log(`Found ${businesses.length} businesses to unverify.`);

  // Update them to is_verified = false
  const { data, error } = await supabase
    .from('business_profiles')
    .update({ is_verified: false })
    .neq('business_name', 'Minido Preschool');

  if (error) {
    console.error('Error updating businesses:', error);
  } else {
    console.log(`Successfully updated all businesses to unverified.`);
  }
}

main();
