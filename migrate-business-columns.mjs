import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const env = {};
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const eq = line.indexOf('=');
  if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
}

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const { data, error } = await sb.from('business_profiles')
  .select('id, delivery_available, menu_images')
  .limit(1);

if (error) {
  console.log('COLUMNS_MISSING:', error.message);
  process.exit(1);
} else {
  console.log('COLUMNS_EXIST');
  console.log('Sample:', JSON.stringify({ 
    delivery_available: data?.[0]?.delivery_available ?? 'null', 
    menu_images: data?.[0]?.menu_images ?? 'null' 
  }));
  process.exit(0);
}
