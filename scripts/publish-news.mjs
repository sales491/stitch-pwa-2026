// scripts/publish-news.mjs
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config(); // fallback
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handleAccept(aiData) {
  try {
    console.log("Pushing draft to Admin News Approval Queue...");
    
    // Purge old articles (older than 14 days)
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const { error: deleteError } = await supabase
      .from('news')
      .delete()
      .lt('published_at', fourteenDaysAgo);
    
    if (deleteError) {
      console.error("Warning: Failed to purge old articles:", deleteError);
    } else {
      console.log("✅ Purged articles older than 14 days.");
    }

    const slug = aiData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const { error } = await supabase.from('news').insert([{
      title: aiData.title,
      slug: slug,
      summary: aiData.summary,
      content: aiData.content,
      image_url: aiData.image_url || null,
      source_url: aiData.url || null,
      status: 'published',
      key_takeaways: aiData.key_takeaways || [],
      faq_json: aiData.faq || [],
      published_at: new Date().toISOString()
    }]);

    if (error) {
      console.error("❌ Failed to push to Supabase:", error);
    } else {
      console.log(`✅ Draft '${aiData.title}' sent to Admin Dashboard for approval.`);
    }
  } catch (err) {
    console.error("Exception during publication:", err);
  }
}

// Execute if run directly by Antigravity's on_accept
if (process.argv[1] && process.argv[1].endsWith('publish-news.mjs')) {
    let inputData = '';
    
    process.stdin.setEncoding('utf-8');
    
    process.stdin.on('data', function (chunk) {
        inputData += chunk;
    });

    process.stdin.on('end', function () {
        try {
            if (!inputData.trim()) {
                console.log("No data received for publishing.");
                process.exit(0);
            }
            const aiData = JSON.parse(inputData);
            handleAccept(aiData);
        } catch (e) {
            console.error("Error parsing input data:", e);
        }
    });
}
