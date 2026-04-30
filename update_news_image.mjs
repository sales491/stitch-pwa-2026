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
  const { error } = await supabase
    .from('news')
    .update({ image_url: '/marinduque_tourism_loop.png' })
    .eq('slug', 'marinduque-tourism-push-2026');

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Updated image URL successfully!");
  }
}

run();
