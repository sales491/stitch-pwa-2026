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
  console.log("Fetching active listings with thin/empty descriptions...");
  
  const { data, error } = await supabase
    .from('listings')
    .select('id, title, category, town, description')
    .eq('status', 'active');

  if (error) {
    console.error("Error fetching listings:", error);
    process.exit(1);
  }

  // Filter out those with good descriptions (e.g. > 40 chars)
  const emptyListings = data.filter(l => !l.description || l.description.trim().length < 40);

  console.log(`Found ${emptyListings.length} listings needing SEO descriptions.`);

  const outputPath = path.join(__dirname, 'empty-listings.json');
  fs.writeFileSync(outputPath, JSON.stringify(emptyListings, null, 2));

  console.log(`Saved to ${outputPath}`);
  console.log("Antigravity AI can now read this file, generate 2-3 sentence Taglish/English descriptions, and create approved-descriptions.json");
}

run();
