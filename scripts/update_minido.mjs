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

async function updateArticle() {
    console.log("Updating Minido article FAQ link...");
    
    // Fetch the article
    const { data: article, error: fetchError } = await supabase
        .from('news')
        .select('*')
        .eq('slug', 'minido-preschool-opens-enrollment-for-sy-2026-2027')
        .single();

    if (fetchError || !article) {
        console.error("Error fetching article:", fetchError);
        return;
    }

    // Update FAQ to include clickable Facebook link
    const newFaq = [...article.faq_json];
    const lastIdx = newFaq.length - 1;

    newFaq[lastIdx].answer = 'You can call or text 0917-850-4544 or message the <a href="https://www.facebook.com/share/p/1H56b3UX9L/" target="_blank" rel="noopener noreferrer">Minido Preschool official Facebook</a>.';

    const updateData = {
        faq_json: newFaq
    };

    console.log("Updating with:", updateData);

    const { error: updateError } = await supabase
        .from('news')
        .update(updateData)
        .eq('id', article.id);

    if (updateError) {
        console.error("Failed to update:", updateError);
    } else {
        console.log("✅ Successfully updated FAQ link to HTML!");
    }
}

updateArticle();
