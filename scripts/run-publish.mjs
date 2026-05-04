import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const payload = JSON.parse(readFileSync(path.join(__dirname, 'news_payload.json'), 'utf-8'));

// Delete the old draft first (same slug) then re-insert clean
const slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
await supabase.from('news').delete().eq('slug', slug);

const { error } = await supabase.from('news').insert([{
  title:         payload.title,
  slug:          slug,
  summary:       payload.summary,
  content:       payload.content,
  image_url:     payload.image_url,
  source_url:    payload.url,
  status:        'published',
  key_takeaways: payload.key_takeaways,
  faq_json:      payload.faq,
  published_at:  new Date().toISOString(),
}]);

if (error) {
  console.error('Failed:', error);
} else {
  console.log(`Published: /news/${slug}`);
}
