// scripts/fix_news_encoding_v2.mjs
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

function fixString(str) {
    if (!str) return str;
    // Replace various broken or non-standard "Nino" representations with safe "Nino"
    return str.replace(/Ni Niño|Niño|Ni\?\?o|Nio/g, 'Nino');
}

async function fixNews() {
    console.log("Fixing encoding for all news fields...");
    
    const { data: articles, error: fetchError } = await supabase
        .from('news')
        .select('*');

    if (fetchError) {
        console.error("Error fetching articles:", fetchError);
        return;
    }

    for (const article of articles) {
        let needsUpdate = false;
        const updateData = {};

        // Check and fix strings
        const fieldsToFix = ['title', 'slug', 'summary', 'content'];
        fieldsToFix.forEach(field => {
            const fixed = fixString(article[field]);
            if (fixed !== article[field]) {
                updateData[field] = fixed;
                needsUpdate = true;
            }
        });

        // Check and fix key_takeaways (array)
        if (article.key_takeaways && Array.isArray(article.key_takeaways)) {
            const fixedKT = article.key_takeaways.map(kt => fixString(kt));
            if (JSON.stringify(fixedKT) !== JSON.stringify(article.key_takeaways)) {
                updateData.key_takeaways = fixedKT;
                needsUpdate = true;
            }
        }

        // Check and fix faq_json (array of objects)
        if (article.faq_json && Array.isArray(article.faq_json)) {
            const fixedFAQ = article.faq_json.map(faq => ({
                question: fixString(faq.question),
                answer: fixString(faq.answer)
            }));
            if (JSON.stringify(fixedFAQ) !== JSON.stringify(article.faq_json)) {
                updateData.faq_json = fixedFAQ;
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            console.log(`Updating article ${article.id} (${article.title})...`);
            const { error: updateError } = await supabase
                .from('news')
                .update(updateData)
                .eq('id', article.id);

            if (updateError) {
                console.error(`Failed to update ${article.id}:`, updateError);
            } else {
                console.log(`✅ Fixed fields: ${Object.keys(updateData).join(', ')}`);
            }
        }
    }
    console.log("Done.");
}

fixNews();
