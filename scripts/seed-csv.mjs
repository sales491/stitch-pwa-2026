import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE URL or KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Parse CSV manually since we don't have csv-parse installed
function parseCSV(text) {
  const lines = text.split('\n');
  const result = [];
  // Skip header and formatting row
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Very basic regex to split by commas respecting quotes
    const regex = /(?:\"([^\"]*)\"|([^,]*))(?:,|$)/g;
    const parts = [];
    let match;
    while ((match = regex.exec(line)) && match[0] !== "") {
      parts.push(match[1] !== undefined ? match[1] : match[2]);
    }
    
    if (parts.length >= 3) {
      result.push({
        name: (parts[0] || '').trim(),
        phone: (parts[1] || '').trim(),
        address: (parts[2] || '').trim(),
        website: (parts[3] || '').trim(),
        mapLink: (parts[4] || '').trim(),
      });
    }
  }
  return result;
}

const validTowns = ['Boac', 'Mogpog', 'Gasan', 'Sta. Cruz', 'Torrijos', 'Buenavista'];

function getTown(address, name) {
    const combined = (address + " " + name).toLowerCase();
    if (combined.includes('boac')) return 'Boac';
    if (combined.includes('mogpog')) return 'Mogpog';
    if (combined.includes('gasan')) return 'Gasan';
    if (combined.includes('sta. cruz') || combined.includes('santa cruz')) return 'Sta. Cruz';
    if (combined.includes('torrijos')) return 'Torrijos';
    if (combined.includes('buenavista')) return 'Buenavista';
    return 'Boac'; // fallback safe default
}

function getCategory(name, address) {
    const n = (name + " " + address).toLowerCase();

    if (n.includes('bank') || n.includes('pawnshop') || n.includes('finance') || n.includes('remittance') || n.includes('moneygram') || n.includes('cebuana')) return 'Finance / Banking';
    if (n.includes('school') || n.includes('college') || n.includes('university') || n.includes('academy') || n.includes('institute')) return 'Education / School';
    if (n.includes('hardware') || n.includes('construction') || n.includes('builder') || n.includes('supply') || n.includes('lumber')) return 'Construction / Hardware';
    if (n.includes('cafe') || n.includes('restaurant') || n.includes('grill') || n.includes('food') || n.includes('eatery') || n.includes('bakery') || n.includes('coffee') || n.includes('pares') || n.includes('pancitan')) return 'Restaurant / Food';
    if (n.includes('hotel') || n.includes('resort') || n.includes('beach') || n.includes('inn') || n.includes('lodge') || n.includes('stay') || n.includes('transient') || n.includes('glamping')) return 'Accommodation';
    if (n.includes('clinic') || n.includes('pharmacy') || n.includes('drug') || n.includes('hospital') || n.includes('medical') || n.includes('dental') || n.includes('health')) return 'Healthcare / Medical';
    if (n.includes('auto') || n.includes('motor') || n.includes('repair') || n.includes('carwash') || n.includes('vulcanizing') || n.includes('emission') || n.includes('parts')) return 'Services / Repair';
    if (n.includes('store') || n.includes('grocery') || n.includes('market') || n.includes('merchandise') || n.includes('shop') || n.includes('mart') || n.includes('trading')) return 'Retail / Shop';
    if (n.includes('salon') || n.includes('beauty') || n.includes('derma')) return 'Beauty / Personal Care';
    if (n.includes('gas') || n.includes('fuel') || n.includes('petron') || n.includes('shell')) return 'Gas / Fuel Station';

    return 'Other';
}

function deriveBusinessType(category, name) {
    const dict = {
        'Finance / Banking': 'Bank / Financial',
        'Education / School': 'School',
        'Construction / Hardware': 'Hardware',
        'Restaurant / Food': 'Restaurant',
        'Accommodation': 'Hotel / Resort',
        'Healthcare / Medical': 'Medical / Pharmacy',
        'Services / Repair': 'Auto Service / Repair',
        'Retail / Shop': 'Retail Store',
        'Beauty / Personal Care': 'Beauty / Spa',
        'Gas / Fuel Station': 'Gas Station'
    };
    if (name.toLowerCase().includes("sari-sari")) return "Sari-Sari Store";
    return dict[category] || 'Local Business';
}

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(__dirname, '..', 'businesses.csv');
  const rawCSV = fs.readFileSync(filePath, 'utf-8');
  
  const records = parseCSV(rawCSV);
  
  // Deduplicate keeping branches
  const uniqueBusinesses = new Map();

  for (const r of records) {
      if (!r.name || r.name.startsWith("Hospital") || r.name.startsWith("Clinic") || r.name.startsWith("Pharmacy")) {
          // there are weird metadata rows in the CSV like "Hospital","Asuncion A. Perez..."
          if (r.phone && r.phone.length > 5 && !r.phone.includes("N/A")) {
             r.name = r.phone; // sometimes the actual name is shifted to the phone col in messy csv
          } else {
             continue; // Skip complete garbage lines
          }
      }

      let cleanName = r.name.trim();
      let town = getTown(r.address, cleanName);
      
      const key = `${cleanName.toLowerCase()}_${town}`;
      
      if (!uniqueBusinesses.has(key)) {
          let phoneRaw = r.phone !== 'N/A' && r.phone !== 'Check Map Link' && r.phone !== 'Not available' ? r.phone : '';
          
          let websiteLink = '';
          if (r.website && r.website.includes('http')) {
              const match = r.website.match(/\((https?:\/\/[^\)]+)\)/);
              websiteLink = match ? match[1] : r.website;
          }

          let addressValue = r.address !== 'N/A' && r.address !== 'Not available' ? r.address : town;

          const category = getCategory(cleanName, addressValue);
          const businessType = deriveBusinessType(category, cleanName);

          const dbEntry = {
              business_name: cleanName,
              business_type: businessType,
              location: town,
              contact_info: {
                  phone: phoneRaw,
                  address: addressValue,
                  email: "",
                  website: websiteLink
              },
              categories: [category],
              is_verified: false,
              owner_id: "7da9eb71-7757-4335-97c3-34eb40e4f34a" // system admin ID
          };

          uniqueBusinesses.set(key, dbEntry);
      }
  }

  const finalRecords = Array.from(uniqueBusinesses.values());
  console.log(`Parsed ${records.length} raw rows -> Deduped to ${finalRecords.length} unique businesses/branches.`);

  // Filter out any entries that somehow ended up blank
  const toUpload = finalRecords.filter(f => f.business_name.length > 2);

  // Chunk array to avoid Supabase row limits
  const chunkSize = 50;
  for (let i = 0; i < toUpload.length; i += chunkSize) {
      const chunk = toUpload.slice(i, i + chunkSize);
      
      const { data, error } = await supabase.from('business_profiles').insert(chunk);
      if (error) {
          console.error(`Error inserting chunk ${i}:`, error.message);
      } else {
          console.log(`Inserted chunk ${Math.floor(i/chunkSize) + 1} (${chunk.length} rows)`);
      }
  }
  
  console.log('Finished Seeding Database!');
}

main().catch(console.error);
