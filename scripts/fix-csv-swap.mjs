import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
    const { data: businesses, error } = await supabase.from('business_profiles').select('id, business_name, contact_info');
    if (error) {
        console.error("Error fetching profiles:", error);
        return;
    }

    let updates = 0;
    
    for (const b of businesses) {
        if (!b.contact_info) continue;
        
        let phone = String(b.contact_info.phone || '').trim();
        let address = String(b.contact_info.address || '').trim();
        let requiresUpdate = false;

        // Condition 1: Address has a phone number, Phone has an address
        if ((address.match(/^(?:\+63|09)\d{9}$/) || address.match(/^\(042\)/) || address.match(/^\s*\d{7,11}\s*$/)) && (phone.includes('Marinduque') || phone.includes('Boac') || phone.length > 20)) {
            // Swap them!
            let temp = phone;
            phone = address;
            address = temp;
            requiresUpdate = true;
        }
        
        // Condition 2: Phone is clearly an address
        else if (phone.toLowerCase().includes('marinduque') || phone.toLowerCase().includes('boac') || phone.includes('Philippines') || phone.includes('Brgy')) {
            let temp = address;
            address = phone;
            phone = temp; // phone becomes empty, N/A, or the old Address value.
            
            // If the old address was actually just a category description like "Auto Parts" or map link, 
            // we blank out the phone so weird text doesn't show up.
            if ((phone && !phone.match(/\d/)) || phone === 'N/A' || phone === address) {
                phone = '';
            }
            requiresUpdate = true;
        }

        if (requiresUpdate) {
            console.log(`Swapping mapping for: ${b.business_name}`);
            console.log(`  New Phone: ${phone}`);
            console.log(`  New Address: ${address}`);
            
            const newContactInfo = {
                ...b.contact_info,
                phone: phone,
                address: address
            };

            const { error: updErr } = await supabase.from('business_profiles').update({ contact_info: newContactInfo }).eq('id', b.id);
            if (updErr) {
                console.error("Failed to update:", b.business_name, updErr);
            } else {
                updates++;
            }
        }
    }
    
    console.log(`Successfully fixed ${updates} businesses with flipped mappings!`);
}

main().catch(console.error);
