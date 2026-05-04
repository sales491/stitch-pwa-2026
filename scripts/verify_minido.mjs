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
  console.log('Searching for Minido Preschool in the database...');
  
  // Find current state
  const { data: minidoBefore, error: fetchError } = await supabase
    .from('business_profiles')
    .select('id, business_name, is_verified, verification_status')
    .ilike('business_name', '%Minido%');

  if (fetchError) {
    console.error('Error fetching business:', fetchError);
    return;
  }

  if (!minidoBefore || minidoBefore.length === 0) {
    console.log('Could not find Minido Preschool in the database.');
    return;
  }

  console.log('Current status:', minidoBefore);

  const minidoId = minidoBefore[0].id;

  // Update to verified
  console.log(`\nVerifying ${minidoBefore[0].business_name}...`);
  const { data: minidoAfter, error: updateError } = await supabase
    .from('business_profiles')
    .update({ 
      is_verified: true,
      verification_status: 'verified'
    })
    .eq('id', minidoId)
    .select('id, business_name, is_verified, verification_status');

  if (updateError) {
    console.error('Error updating business:', updateError);
  } else {
    console.log('Successfully updated! New status:', minidoAfter);
  }
}

main();
