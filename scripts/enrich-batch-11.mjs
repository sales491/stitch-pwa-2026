import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const enrichments = [
  {
    name: "SMILE Dental Clinic",
    description: "A premier dental facility in Santa Cruz providing comprehensive oral care. Specializing in family dentistry, orthodontics, and restorative procedures with a focus on patient comfort and hygiene.",
    operating_hours: "Mon-Sat: 8:00 AM - 5:00 PM",
    contact_info: { phone: "+63 919 953 9352", email: "dra.maricris@gmail.com" },
    location: "Santa Cruz",
    business_type: "Dental Clinic"
  },
  {
    name: "Kabiscera Dental Clinic",
    description: "A modern dental clinic centrally located in Santa Cruz Poblacion. Offering professional dental services including cleaning, fillings, and braces in a well-equipped, accessible facility.",
    location: "Santa Cruz",
    business_type: "Dental Clinic"
  },
  {
    name: "RL Dental",
    description: "Trusted local dental services in Santa Cruz known for personalized care and general dentistry. Dedicated to maintaining healthy smiles for the local community with affordable and professional treatments.",
    contact_info: { phone: "+63 961 723 2386" },
    location: "Santa Cruz",
    business_type: "Dental Clinic"
  },
  {
    name: "LBC Express - Santa Cruz",
    description: "The leading express courier and remittance service in Santa Cruz. Offering reliable domestic and international shipping, money transfer services, and bill payments with a conveniently located branch in Brgy. Pag-Asa.",
    operating_hours: "Mon-Sat: 8:00 AM - 6:00 PM",
    contact_info: { phone: "+63 42 321-1254" },
    location: "Santa Cruz",
    business_type: "Logistics & Remittance"
  },
  {
    name: "J&T Express - Santa Cruz",
    description: "Efficient and fast courier services serving the Santa Cruz area. Ideal for e-commerce deliveries and personal shipments, featuring competitive rates and island-wide door-to-door logistics.",
    location: "Santa Cruz",
    business_type: "Logistics"
  },
  {
    name: "Flash Express - Santa Cruz",
    description: "Modern logistics technology provider in Santa Cruz. Providing fast parcel delivery and pickup services with a focus on supporting local entrepreneurs and general cargo needs across the province.",
    location: "Santa Cruz",
    business_type: "Logistics"
  }
];

async function enrich() {
    let count = 0;
    for (const e of enrichments) {
        // Match by name fragment to catch variations in CSV vs Reality
        const searchName = e.name.split(' (')[0].split(' - ')[0];
        const { data: current } = await supabase.from('business_profiles')
            .select('id, contact_info, social_media')
            .ilike('business_name', `%${searchName}%`)
            .maybeSingle();
        
        if (current) {
            const updatedContact = { ...current.contact_info, ...e.contact_info };
            const updatedSocial = { ...current.social_media, ...e.social_media };

            const { error: updateError } = await supabase.from('business_profiles').update({
                description: e.description,
                operating_hours: e.operating_hours || null,
                contact_info: updatedContact,
                social_media: updatedSocial,
                location: e.location,
                business_type: e.business_type,
                is_verified: true,
                verification_status: "verified"
            }).eq('id', current.id);

            if (!updateError) {
                console.log(`Enriched existing: ${e.name}`);
                count++;
            } else {
                console.error(`Error updating ${e.name}:`, updateError.message);
            }
        } else {
            const { error: insertError } = await supabase.from('business_profiles').insert([{
                business_name: e.name,
                description: e.description,
                operating_hours: e.operating_hours || null,
                contact_info: e.contact_info || {},
                social_media: e.social_media || {},
                location: e.location,
                business_type: e.business_type,
                is_verified: true,
                owner_id: "7da9eb71-7757-4335-97c3-34eb40e4f34a",
                verification_status: "verified"
            }]);

            if (!insertError) {
                console.log(`Added missing Elite: ${e.name}`);
                count++;
            } else {
                console.error(`Error adding ${e.name}:`, insertError.message);
            }
        }
    }
    console.log(`Successfully processed ${count} businesses in Batch 11.`);
}

enrich();
