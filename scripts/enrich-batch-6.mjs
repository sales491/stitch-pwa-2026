import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const enrichments = [
  {
    name: "Land Bank of the Philippines - Boac Branch",
    description: "The primary government financial institution in Marinduque. Providing essential banking, agricultural lending, and corporate services to Boac and the entire province. Operating Hours: Mon-Fri, 8:30 AM – 3:00 PM.",
    contact_info: { phone: "(042) 332-2005", email: "BoacBranch@landbank.com" },
    location: "Boac",
    business_type: "Bank"
  },
  {
    name: "Cebuana Lhuillier - Boac Malusak",
    description: "A major micro-financial services hub in the heart of Boac. Offering essential money remittance, pawning, microinsurance, and bills payment services to the local community with speed and reliability.",
    contact_info: { website: "cebuanalhuillier.com" },
    location: "Boac",
    business_type: "Financial Services"
  },
  {
    name: "M Lhuillier - Boac Mercader",
    description: "Conveniently located near the Boac Public Market, this branch is a key point for Kwarta Padala, currency exchange, and jewelry sales. A vital link for both domestic and international financial transactions.",
    contact_info: { phone: "(042) 311-1412" },
    location: "Boac",
    business_type: "Financial Services"
  },
  {
    name: "Porknok Grill",
    description: "Boac's destination for authentic Pinoy-style barbecue and grilled specialties. Known for its flavorful 'putok-batok' favorites and laid-back atmosphere, it's a popular choice for dinner and casual gatherings.",
    location: "Boac",
    business_type: "Restaurant"
  },
  {
    name: "Dyke Foodpark",
    description: "A scenic riverside food park in Boac offering a variety of local food stalls and a relaxed outdoor dining experience. It is the town's social hub for evening hangouts, live music, and diverse street food selections.",
    location: "Boac",
    business_type: "Food Park"
  },
  {
    name: "Marin Brew Cafe",
    description: "A trendy coffee shop located on Magsaysay Road, Tanza. Marin Brew is celebrated for its modern aesthetic, specialty coffee blends, and being a preferred quiet spot for studying and small group meetings.",
    social_media: { facebook: "Marin Brew Cafe" },
    location: "Boac",
    business_type: "Cafe"
  },
  {
    name: "Cafe Benevolo Boac Plus",
    description: "A contemporary cafe in Murallon offering a premium coffee experience and a curated selection of pastries. Provides a cozy, modern environment with free Wi-Fi, ideal for freelancers and digital nomads in Boac.",
    location: "Boac",
    business_type: "Cafe"
  },
  {
    name: "BDO Network Bank - Boac",
    description: "A key banking partner for MSMEs and local residents in Marinduque. Offering accessible savings, loans, and ATM services as part of the BDO Group's commitment to community-based banking.",
    location: "Boac",
    business_type: "Bank"
  },
  {
    name: "El Centro Convenience Store",
    description: "Located near the Boac Plaza, El Centro is the capital's go-to spot for 24/7 essentials, snacks, and basic groceries. A reliable stop for residents and travelers at any hour of the day or night.",
    location: "Boac",
    business_type: "Convenience Store"
  },
  {
    name: "Mercury Drug Store - Marinduque Boac",
    description: "Marinduque's most trusted pharmacy chain. Providing a wide selection of prescription and over-the-counter medicines, personal care products, and household essentials to the Boac community.",
    location: "Boac",
    business_type: "Pharmacy"
  }
];

async function enrich() {
    let count = 0;
    for (const e of enrichments) {
        // Try to match with slightly fuzzy branch names from CSV
        const { data: current } = await supabase.from('business_profiles')
            .select('id, contact_info, social_media')
            .ilike('business_name', `%${e.name.split(' - ')[0]}%`)
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
                business_type: e.business_type
            }).eq('id', current.id);

            if (!updateError) {
                console.log(`Enriched existing: ${e.name}`);
                count++;
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
    console.log(`Successfully processed ${count} businesses in Batch 6.`);
}

enrich();
