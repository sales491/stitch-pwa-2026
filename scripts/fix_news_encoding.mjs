// scripts/fix_news_encoding.mjs
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixNews() {
    console.log("Fixing encoding for El Niño article...");
    
    // Find the article with the broken title
    const { data: articles, error: fetchError } = await supabase
        .from('news')
        .select('id, title, slug, content')
        .ilike('title', '%Ni%o%');

    if (fetchError) {
        console.error("Error fetching articles:", fetchError);
        return;
    }

    for (const article of articles) {
        const newTitle = article.title.replace(/Nio|Ni\?\?o|Niño/g, 'Niño'); // Try to catch various broken encodings
        // Actually, let's just use "Nino" to be safe and avoid future encoding issues in the slug/URLs
        const safeTitle = article.title.replace(/Nio|Ni\?\?o|Niño/g, 'Nino');
        const safeSlug = article.slug.replace(/ni-o/g, 'nino');
        const safeContent = article.content.replace(/Nio|Ni\?\?o|Niño/g, 'Nino');

        console.log(`Updating article ${article.id}...`);
        const { error: updateError } = await supabase
            .from('news')
            .update({ 
                title: safeTitle, 
                slug: safeSlug, 
                content: safeContent 
            })
            .eq('id', article.id);

        if (updateError) {
            console.error(`Failed to update ${article.id}:`, updateError);
        } else {
            console.log(`✅ Fixed: ${safeTitle}`);
        }
    }
}

fixNews();
