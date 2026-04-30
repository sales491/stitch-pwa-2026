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
  // Update TODA subsidy news
  await supabase
    .from('news')
    .update({ image_url: '/toda-subsidy.png' })
    .eq('id', '5df3760e-f99d-4df6-88be-dbb5daeb16fe');

  // Update Moriones Festival news (if we have a suitable image, otherwise unplash)
  await supabase
    .from('news')
    .update({ image_url: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=80' })
    .eq('id', 'a80743a9-c5be-4777-af01-78a262dcf84c');

  console.log('Successfully updated image URLs to remove base64 strings that cause 404s.');
}

run();
