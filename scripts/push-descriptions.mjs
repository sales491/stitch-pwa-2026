import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const inputPath = path.join(__dirname, 'approved-descriptions.json');
  
  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`);
    console.error("Please ensure Antigravity AI has generated and saved 'approved-descriptions.json' first.");
    process.exit(1);
  }

  const fileData = fs.readFileSync(inputPath, 'utf-8');
  let updates = [];
  try {
    updates = JSON.parse(fileData);
  } catch (e) {
    console.error("Invalid JSON format in approved-descriptions.json", e);
    process.exit(1);
  }

  if (!Array.isArray(updates) || updates.length === 0) {
    console.log("No updates found in JSON file.");
    process.exit(0);
  }

  console.log(`Pushing ${updates.length} new descriptions to Supabase...`);

  let successCount = 0;
  let failCount = 0;

  for (const item of updates) {
    if (!item.id || !item.new_description) {
      console.warn(`Skipping invalid item: ${JSON.stringify(item)}`);
      continue;
    }

    const { error } = await supabase
      .from('listings')
      .update({ description: item.new_description })
      .eq('id', item.id);

    if (error) {
      console.error(`Failed to update ${item.id}:`, error.message);
      failCount++;
    } else {
      process.stdout.write('.');
      successCount++;
    }
  }

  console.log(`\n\nComplete! Successfully updated: ${successCount}. Failed: ${failCount}`);
}

run();
