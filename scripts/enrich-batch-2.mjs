import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const enrichments = [
  {
    name: "Marinduque State University",
    description: "Formerly known as Marinduque State College (MSC), this is the premier public state university in the province. Established in 1953, the main Boac campus offers a wide array of programs in Engineering, Education, Information Technology, and Health Sciences, serving as the academic heart of Marinduque.",
    social_media: { facebook: "Marinduque State University" },
    contact_info: { website: "www.marsu.edu.ph" },
    location: "Boac",
    business_type: "University"
  },
  {
    name: "The Boac Hotel",
    description: "Founded in 1967, The Boac Hotel is the oldest and most historic hotel in Marinduque. Located in a charming heritage building across from the Boac Cathedral, it features cozy native-inspired interiors, the famous Cafe Ma'Mita restaurant, and a pasalubong center for local arrowroot cookies.",
    operating_hours: "24/7 Front Desk",
    social_media: { facebook: "The Boac Hotel" },
    contact_info: { email: "theboachotel@yahoo.com", phone: "(042) 332-1121" },
    location: "Boac",
    business_type: "Hotel"
  },
  {
    name: "Balar Hotel and Spa",
    description: "A modern, highly-rated boutique hotel in Balaring, Boac. Known for its '10 YO Cafe', sleek design, and full-service spa, it offers a premium tropical retreat experience with standard, deluxe, and executive suite options.",
    operating_hours: "24/7 Front Desk",
    social_media: { facebook: "Balar Hotel and Spa" },
    contact_info: { email: "balarhotelandspa@gmail.com", phone: "0917-882-2527" },
    location: "Boac",
    business_type: "Hotel / Spa"
  },
  {
    name: "Marinduque Provincial Hospital",
    description: "The Dr. Damian Reyes Provincial Hospital is the primary government medical facility in Boac. A Level 1 hospital with 75 beds, it provides essential inpatient and outpatient services, maternal care, and PhilHealth-accredited medical packages to the Marinduque community.",
    operating_hours: "Emergency 24/7",
    contact_info: { phone: "(042) 332-0641" },
    location: "Boac",
    business_type: "Hospital"
  },
  {
    name: "Jollibee Boac",
    description: "Coming Soon! Jollibee Boac had its official groundbreaking in November 2025 at Kasilag Street. The community is eagerly awaiting the opening of this first main-town branch of the Philippines' most beloved fast-food chain.",
    social_media: { facebook: "Jollibee" },
    location: "Boac",
    business_type: "Fast Food"
  }
];

async function enrich() {
    let count = 0;
    for (const e of enrichments) {
        // Try to update first
        const { data: current, error: fetchError } = await supabase.from('business_profiles')
            .select('id, contact_info, social_media')
            .eq('business_name', e.name)
            .maybeSingle();
        
        if (current) {
            const updatedContact = { ...current.contact_info, ...e.contact_info };
            const updatedSocial = { ...current.social_media, ...e.social_media };

            const { error: updateError } = await supabase.from('business_profiles').update({
                description: e.description,
                operating_hours: e.operating_hours || null,
                contact_info: updatedContact,
                social_media: updatedSocial
            }).eq('id', current.id);

            if (!updateError) {
                console.log(`Enriched existing: ${e.name}`);
                count++;
            }
        } else {
            // Upsert / Insert new Elite business if missing
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
    console.log(`Successfully processed ${count} businesses in Batch 2.`);
}

enrich();
