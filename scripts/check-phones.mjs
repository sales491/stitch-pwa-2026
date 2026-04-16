import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('business_profiles').select('id, business_name, contact_info');
  if (error) return console.error(error);
  
  const weird = data.filter(r => r.contact_info?.address && String(r.contact_info.address).match(/\d{6,}/));
  console.log(`Found ${weird.length} businesses with potential phone numbers in address!`);
  weird.slice(0, 10).forEach(w => console.log(w.business_name, "->", w.contact_info.address));
}
check();
