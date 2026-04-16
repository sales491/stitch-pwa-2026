import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const enrichments = [
  {
    name: "The Penthouse by Marina",
    description: "An elegant seaside entertainment and social venue located within the Marina Marinduque Hotel & Resort in Balaring. The Penthouse offers a vibrant atmosphere with live acoustic jamming sessions, making it a premier spot for sunset cocktails, events, and after-work unwinding with stunning ocean views.",
    operating_hours: "Typically open for events and evening socials. Check Marina Marinduque Resort for exact daily hours.",
    social_media: { facebook: "ThePenthouse.Marina" },
    contact_info: { email: "ccapmarinahotelandresort@gmail.com", phone: "+63 970 127 7887" }
  },
  {
    name: "Kusina sa Plaza",
    description: "A beloved culinary landmark in the heart of Boac, Kusina sa Plaza is the go-to destination for authentic Marinduqueño tradition. Specializing in home-style cooking, they are famous for 'Ulang-ulang' (shrimp and coconut soup) and 'Minatamis ni Aling Sayong'. Located conveniently near the Boac Plaza and Museum.",
    operating_hours: "7:00 AM - 6:00 PM Daily",
    social_media: { facebook: "kusinasaplaza" },
    contact_info: { phone: "+63 42 332 1699" }
  },
  {
    name: "Casa De Don Emilio",
    description: "Located on the second floor of a beautifully preserved ancestral home, Casa De Don Emilio offers a fine-dining 'time-travel' experience back to the Spanish colonial era. With its grand chandeliers and antique furnishings, it is Boac's premier spot for intimate dinners and heritage cuisine, featuring signature Marinduque dishes and international favorites like beef stroganoff.",
    operating_hours: "8:00 AM - 9:00 PM Daily",
    social_media: { facebook: "Casa de Don Emilio" },
    contact_info: { phone: "+63 942 332 1699" }
  },
  {
    name: "10 y.o. Cafe",
    description: "A trendy and aesthetic 'nook' in Boac known for its cozy vibes and a delightful fusion of Filipino and Italian-inspired dishes. Whether you are craving their signature BBQ ribs, creamy pasta, or a fresh cafe latte, this spot is perfect for catch-ups and foodies looking for a relaxed, artistic atmosphere.",
    operating_hours: "9:00 AM - 9:00 PM (Hours may vary on weekends)",
    social_media: { facebook: "10 y.o. Cafe", instagram: "10yocafe" }
  },
  {
    name: "Eomma's K-Grill Samgyupsal House",
    description: "Bringing authentic Korean flavors to Boac, Eomma's K-Grill is a favorite for Samgyupsal enthusiasts. Known for its fast service and generous servings of bibimbap, bulgogi, and tteokbokki, it offers a fun and modern atmosphere for groups and K-food lovers in Marinduque.",
    operating_hours: "10:00 AM - 8:00 PM (Approximate)",
    social_media: { facebook: "Eommas K-Grill Samgyupsal House" }
  },
  {
      name: "Marinduque Midwest College",
      description: "Marinduque Midwest College (MMC) is a dedicated educational institution committed to developing God-loving, critical thinkers. It offers comprehensive programs from Junior and Senior High School (STEM, ABM, HUMSS, GAS) to Tertiary degrees in Education and Computer Science, fostering the next generation of Marinduqueño professionals.",
      social_media: { facebook: "marinduquemidwest" },
      contact_info: { email: "marinduque.midwestcollege@gmail.com", phone: "(042) 342-1014" }
  },
  {
      name: "Happyroo",
      description: "A local favorite eatery in Boac known for satisfying comfort food and a friendly neighborhood vibe. Happyroo is a popular choice for quick, delicious rice meals and casual dining among locals.",
      social_media: { facebook: "Happyroo Marinduque" }
  },
  {
      name: "Malindig Institute",
      description: "Founded in 1922, Malindig Institute is a historical cornerstone of education in Mogpog. With a century-long legacy of producing outstanding Marinduqueño leaders, the school remains dedicated to providing accessible, high-quality secondary education to the community.",
      social_media: { facebook: "Malindig Institute" }
  },
  {
      name: "Gamot Publiko Mogpog",
      description: "Your reliable neighborhood generic pharmacy, providing affordable, FDA-approved quality medicines. Gamot Publiko is committed to making healthcare accessible to every Filipino family in Mogpog with friendly service and essential medical supplies.",
      operating_hours: "8:00 AM - 6:00 PM (Approximate)",
      contact_info: { website: "www.gamotpubliko.com.ph" }
  },
  {
      name: "Dragonz Construction Supplies Trading",
      description: "A leading supplier for building and construction needs in Boac. Dragonz provides a wide range of hardware materials, construction supplies, and tools for both large-scale projects and home improvements in Marinduque.",
      social_media: { facebook: "Dragonz Construction Supplies" }
  }
];

async function enrich() {
    let count = 0;
    for (const e of enrichments) {
        // Fetch current and merge contact info
        const { data: current } = await supabase.from('business_profiles').select('contact_info, social_media').eq('business_name', e.name).single();
        
        if (!current) {
            console.log(`Business not found: ${e.name}`);
            continue;
        }

        const updatedContact = { ...current.contact_info, ...e.contact_info };
        const updatedSocial = { ...current.social_media, ...e.social_media };

        const { error } = await supabase.from('business_profiles').update({
            description: e.description,
            operating_hours: e.operating_hours || null,
            contact_info: updatedContact,
            social_media: updatedSocial
        }).eq('business_name', e.name);

        if (error) {
            console.error(`Error updating ${e.name}:`, error.message);
        } else {
            console.log(`Enriched: ${e.name}`);
            count++;
        }
    }
    console.log(`Successfully enriched ${count} businesses.`);
}

enrich();
