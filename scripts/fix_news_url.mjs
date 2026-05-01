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
    .from('news')
    .update({ image_url: '/images/gasan_rescue_boat_v2.png' })
    .eq('slug', 'coast-guard-launches-search-for-missing-swimmer-in-gasan');
  
  if (error) console.error(error);
  else console.log('Fixed DB image_url');
}

run();
