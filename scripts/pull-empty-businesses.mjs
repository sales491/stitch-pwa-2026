import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching verified business profiles with thin/empty descriptions...");
  
  const { data, error } = await supabase
    .from('business_profiles')
    .select('id, business_name, business_type, categories, location, description, operating_hours')
    .eq('is_verified', true);

  if (error) {
    console.error("Error fetching business_profiles:", error);
    process.exit(1);
  }

  // Filter out those with good descriptions (e.g. > 50 chars)
  const emptyBusinesses = data.filter(b => !b.description || b.description.trim().length < 50);

  console.log(`Found ${emptyBusinesses.length} verified businesses needing SEO descriptions.`);

  const outputPath = path.join(__dirname, 'empty-businesses.json');
  fs.writeFileSync(outputPath, JSON.stringify(emptyBusinesses, null, 2));

  console.log(`Saved to ${outputPath}`);
  console.log("Antigravity AI can now read this file, generate rich AEO Taglish/English descriptions & operating_hours, and create approved-business-data.json");
}

run();
