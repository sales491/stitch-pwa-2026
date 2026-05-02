import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

function distance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

async function run() {
    const { data: businesses, error } = await supabase.from('business_profiles').select('id, business_name, location');
    if (error) {
        console.error(error);
        return;
    }
    
    const dupes = [];
    for (let i = 0; i < businesses.length; i++) {
        for (let j = i + 1; j < businesses.length; j++) {
            const b1 = businesses[i];
            const b2 = businesses[j];
            
            // Only care if they are in the same town, or one is missing a town
            if (b1.location && b2.location && b1.location.toLowerCase() !== b2.location.toLowerCase()) {
                continue;
            }
            
            const n1 = (b1.business_name || "").toLowerCase().trim();
            const n2 = (b2.business_name || "").toLowerCase().trim();
            
            if (!n1 || !n2) continue;
            
            if (n1 === n2 || (n1.includes(n2) && n2.length > 5) || (n2.includes(n1) && n1.length > 5)) {
               dupes.push({ b1: b1.business_name, b2: b2.business_name, location: b1.location, id1: b1.id, id2: b2.id, reason: 'Exact or Substring' });
               continue;
            } 
            
            const dist = distance(n1, n2);
            const maxLen = Math.max(n1.length, n2.length);
            const similarity = 1 - dist / maxLen;
            if (similarity > 0.80) { // 80% similar
               dupes.push({ b1: b1.business_name, b2: b2.business_name, location: b1.location, id1: b1.id, id2: b2.id, reason: `High Similarity (${Math.round(similarity*100)}%)` });
            }
        }
    }
    
    console.log(JSON.stringify({
        total_checked: businesses.length,
        potential_duplicates: dupes
    }, null, 2));
}

run();
