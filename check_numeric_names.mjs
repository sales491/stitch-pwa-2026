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
    .select('id, business_name, location')
    .eq('location', 'Mogpog');
  
  if (error) {
      console.error(error);
      return;
  }

  const numeric = data.filter(b => /^\d+$/.test(b.business_name));
  console.log('Numeric Names Found:', numeric);
}
run();
