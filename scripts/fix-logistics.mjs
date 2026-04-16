import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fix() {
    // 1. Restore Boac LBC
    await supabase.from('business_profiles').update({
        business_name: "LBC Express - Boac",
        location: "Boac",
        description: "The primary LBC branch in the capital, providing cargo, courier, and remittance services for the Boac municipality and neighboring barangays.",
        contact_info: { phone: "+63 42 332 1254", address: "Gov. D. Reyes St., San Miguel, Boac" }
    }).eq('id', '8cc9e2f5-da44-41f2-a5cd-e8f7c6348c67');

    // 2. Restore Boac J&T
    await supabase.from('business_profiles').update({
        business_name: "J&T Express Boac-1",
        location: "Boac",
        description: "Reliable courier service in Boac, specializing in e-commerce fulfillment and provincial cargo logistics.",
        contact_info: { address: "Brgy. San Miguel, Boac, Marinduque" }
    }).eq('id', '6071ffb2-b328-47f7-92c7-37e94150f1af');

    // 3. Add Santa Cruz Branches (if not already present as separate ids)
    const branches = [
        {
            business_name: "LBC Express - Santa Cruz",
            description: "The leading express courier and remittance service in Santa Cruz. Offering reliable domestic and international shipping, money transfer services, and bill payments with a conveniently located branch in Brgy. Pag-Asa.",
            operating_hours: "Mon-Sat: 8:00 AM - 6:00 PM",
            contact_info: { phone: "+63 42 321-1254", address: "11 Mabini Street, Pag-Asa, Santa Cruz" },
            location: "Santa Cruz",
            business_type: "Logistics & Remittance",
            is_verified: true,
            owner_id: "7da9eb71-7757-4335-97c3-34eb40e4f34a",
            verification_status: "verified"
        },
        {
            business_name: "J&T Express - Santa Cruz",
            description: "Efficient and fast courier services serving the Santa Cruz area. Ideal for e-commerce deliveries and personal shipments, featuring competitive rates and island-wide door-to-door logistics.",
            location: "Santa Cruz",
            business_type: "Logistics",
            is_verified: true,
            owner_id: "7da9eb71-7757-4335-97c3-34eb40e4f34a",
            verification_status: "verified"
        }
    ];

    for (const b of branches) {
        // Check if already exists (to avoid duplicates if re-run)
        const { data: existing } = await supabase.from('business_profiles')
            .select('id')
            .eq('business_name', b.business_name)
            .maybeSingle();
        
        if (!existing) {
            await supabase.from('business_profiles').insert([b]);
            console.log(`Added branch: ${b.business_name}`);
        }
    }
    console.log("Data correction complete.");
}

fix();
