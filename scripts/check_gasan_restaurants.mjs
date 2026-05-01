import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const env = readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...vParts] = line.split('=');
  if (k && vParts.length > 0) {
    acc[k.trim()] = vParts.join('=').trim().replace(/^["']|["']$/g, '');
  }
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase
    .from('business_profiles')
    .select('business_name, categories')
    .eq('location', 'Gasan');

  if (error) {
    console.error("Error querying DB:", error);
    return;
  }
  
  if (data && data.length > 0) {
    console.log(`✅ Found ${data.length} Gasan businesses:`);
    data.forEach(d => console.log(`- ${d.business_name} (${d.categories.join(', ')})`));
  } else {
    console.log("❌ No Gasan businesses found.");
  }
}

run();
