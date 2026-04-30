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
    .from('listings')
    .select('id, images')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) console.error(error);
  else {
    let hasBase64 = false;
    data.forEach(n => {
      if (n.images && n.images.length > 0) {
        if (n.images[0].startsWith('data:')) {
          console.log(`Listing ${n.id} has base64 image!`);
          hasBase64 = true;
        }
      }
    });
    if (!hasBase64) console.log('No base64 images found in top 20 listings.');
  }
}

run();
