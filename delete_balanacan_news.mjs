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
  const slug = 'balanacan-port-passenger-terminal-overhaul-2026';
  console.log(`Deleting news article with slug: ${slug}...`);
  
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('slug', slug);

  if (error) {
    console.error("Error deleting news:", error);
  } else {
    console.log("Successfully removed the article from the database.");
  }
}

run();
