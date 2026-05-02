import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data: businesses, error } = await supabase.from('business_profiles').select('id, business_name');
    if (error) {
        console.error(error);
        return;
    }

    const toDelete = [];
    
    // Exact names to delete
    const deleteExactNames = [
        "Doughboys Cafe and Bakeshop", // Keeping Doughboys Cafe & Bakeshop
        "Adis Resort Hotel and Restaurant", // Keeping Adi's Resort Hotel and Restaurant
        "Cafe Benevolo Boac" // Keeping Cafe Benevolo Boac Plus
    ];

    for (const biz of businesses) {
        const name = biz.business_name || "";
        
        if (deleteExactNames.includes(name)) {
            console.log(`Marking for deletion: ${name}`);
            toDelete.push(biz.id);
        }
    }

    console.log(`Found ${toDelete.length} records to delete.`);
    
    for (const id of toDelete) {
        const { error: delError } = await supabase.from('business_profiles').delete().eq('id', id);
        if (delError) {
            console.error(`Error deleting ${id}:`, delError);
        } else {
            console.log(`Deleted record ${id}`);
        }
    }
    
    console.log("Secondary cleanup complete.");
}

run();
