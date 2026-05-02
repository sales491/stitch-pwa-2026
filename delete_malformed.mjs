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

const ids = [
  '7efb123c-6e20-4d42-9400-2bb1743fe6e5',
  '103ec1e9-7425-4c11-8940-c04983654020',
  '83a2ec5e-fadc-452a-a1b8-70aaace8d48d',
  '479efce5-8106-4214-b3f4-902f0faac3ee',
  'b849b95b-dfca-414a-b5ac-dabc3597dd37'
];

async function run() {
  const { error } = await supabase
    .from('business_profiles')
    .delete()
    .in('id', ids);
    
  if (error) console.error(error);
  else console.log('Deleted malformed Mogpog entries');
}
run();
