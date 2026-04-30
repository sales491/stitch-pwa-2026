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
    .select('id, title, image_url')
    .order('published_at', { ascending: false })
    .limit(5);

  if (error) console.error(error);
  else {
    data.forEach(n => {
      const img = n.image_url ? n.image_url.substring(0, 100) : 'null';
      console.log(`ID: ${n.id}\nIMG: ${img}\nTITLE: ${n.title}\n`);
    });
  }
}

run();
