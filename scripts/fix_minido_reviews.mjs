import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const businessId = 'f11fc539-1abc-4664-819c-58edec31d41c'; // Minido Preschool

  // 1. Get actual reviews
  const { data: reviews, error: reviewError } = await supabase
    .from('business_reviews')
    .select('rating')
    .eq('business_id', businessId);

  if (reviewError) {
    console.error("Error fetching reviews:", reviewError);
    return;
  }

  console.log(`Found ${reviews.length} actual reviews in the database for Minido.`);

  const actualCount = reviews.length;
  const actualAvg = actualCount > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / actualCount 
    : 0;

  console.log(`Calculated Count: ${actualCount}, Calculated Average: ${actualAvg}`);

  // 2. Update the business profile
  const { data, error } = await supabase
    .from('business_profiles')
    .update({ 
      review_count: actualCount,
      average_rating: actualAvg
    })
    .eq('id', businessId)
    .select('business_name, review_count, average_rating');

  if (error) {
    console.error("Error updating profile:", error);
  } else {
    console.log("Successfully updated to:", data);
  }
}

main();
