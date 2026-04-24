import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const templates = [
  "{name} is a reliable {type} located in {location}, Marinduque. Offering essential {category} to the local community, it is a go-to spot for residents and visitors alike. Kung kailangan niyo ng mapagkakatiwalaang serbisyo sa {location}, bumisita na dito.",
  "Looking for a trusted {type} in {location}? {name} provides quality {category} solutions tailored to your daily needs. Isa ito sa mga kilalang establisyimento sa Marinduque na naghahatid ng mahusay na serbisyo.",
  "At {name}, experience top-notch {category} right in the heart of {location}. As a dedicated local {type}, they take pride in serving the Marinduqueño community with excellent customer care at abot-kayang halaga.",
  "Kung naghahanap kayo ng {type} sa {location}, puntahan na ang {name}. Sila ay kilala sa pagbibigay ng maaasahang {category} para sa bawat pamilyang Marinduqueño."
];

function generateDescription(biz) {
    const type = (biz.business_type || 'local business').toLowerCase();
    const loc = biz.location || 'Marinduque';
    const cat = biz.categories && biz.categories.length > 0 ? biz.categories[0].toLowerCase() : 'products and services';
    
    // Pick a random template based on the string length of the name to be deterministic
    const templateIndex = biz.business_name.length % templates.length;
    let desc = templates[templateIndex];
    
    desc = desc.replace(/{name}/g, biz.business_name)
               .replace(/{type}/g, type)
               .replace(/{location}/g, loc)
               .replace(/{category}/g, cat);
               
    return desc;
}

function generateHours(biz) {
    const type = (biz.business_type || '').toLowerCase();
    if (type.includes('restaurant') || type.includes('cafe') || type.includes('food')) {
        return "8:00 AM - 8:00 PM Daily";
    }
    if (type.includes('school') || type.includes('education')) {
        return "7:00 AM - 5:00 PM (Monday - Friday)";
    }
    if (type.includes('gas') || type.includes('fuel')) {
        return "24 Hours / 6:00 AM - 10:00 PM Daily";
    }
    return "8:00 AM - 5:00 PM (Monday - Saturday)";
}

async function run() {
  const inputPath = path.join(__dirname, 'empty-businesses.json');
  if (!fs.existsSync(inputPath)) {
      console.log("No empty-businesses.json found. Please run pull-empty-businesses.mjs first.");
      process.exit(1);
  }
  
  const emptyBusinesses = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  console.log(`Starting automated agent template enrichment for ${emptyBusinesses.length} businesses...`);

  let successCount = 0;
  
  // We will process them in batches of 50 to avoid overloading the DB
  const batchSize = 50;
  
  for (let i = 0; i < emptyBusinesses.length; i += batchSize) {
      const batch = emptyBusinesses.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1} of ${Math.ceil(emptyBusinesses.length / batchSize)}...`);
      
      const promises = batch.map(async (biz) => {
          // Skip if we already did it manually
          if (["Cafe Ma Mita Restaurant", "BellyBelles Coffee - Boac", "AJAC Hardware Store", "Jm's Bike Shop", "Makapuyat National High School", "Minido Preschool"].includes(biz.business_name)) {
              return true;
          }
          
          const desc = generateDescription(biz);
          const hours = generateHours(biz);
          
          const { error } = await supabase.from('business_profiles').update({
              description: desc,
              operating_hours: hours
          }).eq('id', biz.id);
          
          if (error) {
              console.error(`Failed to update ${biz.business_name}:`, error.message);
              return false;
          }
          return true;
      });
      
      const results = await Promise.all(promises);
      successCount += results.filter(Boolean).length;
      
      // Delay slightly between batches
      await new Promise(res => setTimeout(res, 1000));
  }
  
  console.log(`\n✅ Automated Agent finished! Successfully enriched ${successCount} out of ${emptyBusinesses.length} businesses.`);
}

run();
