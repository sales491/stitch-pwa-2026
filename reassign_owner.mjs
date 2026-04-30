import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
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
    .update({ owner_id: '7da9eb71-7757-4335-97c3-34eb40e4f34a' }) // Marko
    .eq('owner_id', 'ec92f4c5-269f-4369-bef6-8409f53674e4'); // Tamara
    
  if (error) console.error(error);
  else console.log(`Successfully reassigned owner for ${data ? data.length : 'all'} businesses.`);
}
run();
