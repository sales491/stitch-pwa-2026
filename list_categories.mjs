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
    .select('categories');

  if (error) {
    console.error(error);
    return;
  }

  const allCategories = new Set();
  data.forEach(biz => {
    if (biz.categories) {
      biz.categories.forEach(cat => allCategories.add(cat));
    }
  });

  console.log("Distinct Categories:");
  console.log(Array.from(allCategories).sort());
}

run();
