import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
 

// Actually, let's just re-declare the constant here to avoid TS loader issues in raw Node.js
const BARANGAYS = {
  'Boac': [
    'Agot', 'Agumaymayan', 'Amoingon', 'Apitong', 'Balagasan', 'Balaring', 
    'Balimbing', 'Balogo', 'Bamban', 'Bangbangalon', 'Bantad', 'Bantay', 
    'Bayuti', 'Binunga', 'Boi', 'Boton', 'Buliasnin', 'Bunganay', 'Caganhao', 
    'Canat', 'Catubugan', 'Cawit', 'Daig', 'Daypay', 'Duyay', 'Hinapulan', 
    'Ihatub', 'Isok I (Pob.)', 'Isok II (Pob.)', 'Laylay', 'Lupac', 'Mahinhin', 
    'Mainit', 'Malbog', 'Maligaya', 'Malusak (Pob.)', 'Mansiwat', 'Mataas na Bayan (Pob.)', 
    'Maybo', 'Mercado (Pob.)', 'Murallon (Pob.)', 'Ogbac', 'Pawa', 'Pili', 'Poctoy', 
    'Poras', 'Puting Buhangin', 'Puyog', 'Sabong', 'San Miguel (Pob.)', 'Santol', 
    'Sawi', 'Tabi', 'Tabigue', 'Tagwak', 'Tambunan', 'Tampus (Pob.)', 'Tanza', 
    'Tugos', 'Tumagabok', 'Tumapon'
  ],
  'Gasan': [
    'Antipolo', 'Bachao Ibaba', 'Bachao Ilaya', 'Bacong-Bacong', 'Bahi', 
    'Bangbang', 'Banot', 'Banuyo', 'Barangay I (Pob.)', 'Barangay II (Pob.)', 
    'Barangay III (Pob.)', 'Bognuyan', 'Cabugao', 'Dawis', 'Dili', 'Libtangin', 
    'Mahunig', 'Mangiliol', 'Masiga', 'Matandang Gasan', 'Pangi', 'Pinggan', 
    'Tabionan', 'Tapuyan', 'Tiguion'
  ],
  'Mogpog': [
    'Anapog-Sibucao', 'Argao', 'Balanacan', 'Banto', 'Bintakay', 'Bocboc', 
    'Butansapa', 'Candahon', 'Capayang', 'Danao', 'Dulong Bayan', 'Gitnang Bayan', 
    'Guisian', 'Hinadharan', 'Hinanggayon', 'Ino', 'Janagdong', 'Lamesa', 'Laon', 
    'Magapua', 'Malayak', 'Malusak', 'Mampaitan', 'Mangyan-Mababad', 'Market Site', 
    'Mataas na Bayan', 'Mendez', 'Nangka I', 'Nangka II', 'Paye', 'Pili', 
    'Puting Buhangin', 'Sayao', 'Silangan', 'Sumangga', 'Tarug', 'Villa Mendez'
  ],
  'Sta. Cruz': [
    'Alobo', 'Angas', 'Aturan', 'Bagong Silang (Pob.)', 'Baguidbirin', 'Baliis', 
    'Balogo', 'Banahaw (Pob.)', 'Bangcuangan', 'Banogbog', 'Biga', 'Botilao', 
    'Buyabod', 'Dating Bayan', 'Devilla', 'Dolores', 'Haguimit', 'Hupi', 'Ipil', 
    'Jolo', 'Kaganhao', 'Kalangkang', 'Kamandungan', 'Kasily', 'Kilo-kilo', 
    'Kiñaman', 'Labo', 'Lamesa', 'Landy', 'Lapu-lapu (Pob.)', 'Libjo', 'Lipa', 
    'Lusok', 'Maharlika (Pob.)', 'Makulapnit', 'Maniwaya', 'Manlibunan', 'Masaguisi', 
    'Masalukot', 'Matalaba', 'Mongpong', 'Morales', 'Napo', 'Pag-asa (Pob.)', 
    'Pantayin', 'Polo', 'Pulong-Parang', 'Punong', 'San Antonio', 'San Isidro', 
    'Tagum', 'Tamayo', 'Tambangan', 'Tawiran', 'Taytay'
  ],
  'Torrijos': [
    'Bangwayin', 'Bayakbakin', 'Bolo', 'Bonliw', 'Buangan', 'Cabuyo', 'Cagpo', 
    'Dampulan', 'Kay Duke', 'Mabuhay', 'Makawayan', 'Malibago', 'Malinao', 
    'Maranlig', 'Marlangga', 'Matuyatuya', 'Nangka', 'Pakaskasan', 'Payanas', 
    'Poblacion', 'Poctoy', 'Sibuyao', 'Suha', 'Talawan', 'Tigwi'
  ],
  'Buenavista': [
    'Bagacay', 'Bagtingon', 'Barangay I (Pob.)', 'Barangay II (Pob.)', 'Barangay III (Pob.)', 
    'Barangay IV (Pob.)', 'Bicas-bicas', 'Caigangan', 'Daykitin', 'Libas', 
    'Malbog', 'Sihi', 'Timbo (Sanggulong)', 'Tungib-Lipata', 'Yook'
  ]
};

dotenv.config({ path: 'c:/projects/marinduque-market/next-app/.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const MUNICIPALITIES = ['Boac', 'Gasan', 'Mogpog', 'Sta. Cruz', 'Torrijos', 'Buenavista'];

// Normalize barangay names for regex matching (strip (Pob.) etc)
const normalizeBrgy = (brgy) => brgy.replace(/\s*\(.*?\)\s*/g, '').trim();

(async () => {
  const { data, error } = await supabase.from('business_profiles').select('id, business_name, location, contact_info');
  if (error) {
    console.error(error);
    return;
  }
  
  let withBarangay = 0;
  let withoutBarangay = 0;
  let alreadyHasBarangay = 0;
  let matches = [];

  for (const b of data) {
    // Determine municipality
    const locStr = (b.location || '').toLowerCase();
    let muni = null;
    if (locStr.includes('boac')) muni = 'Boac';
    else if (locStr.includes('gasan')) muni = 'Gasan';
    else if (locStr.includes('mogpog')) muni = 'Mogpog';
    else if (locStr.includes('sta. cruz') || locStr.includes('santa cruz')) muni = 'Sta. Cruz';
    else if (locStr.includes('torrijos')) muni = 'Torrijos';
    else if (locStr.includes('buenavista')) muni = 'Buenavista';

    // Does it already have a barangay explicitly in contact_info?
    // Based on the DB schema, contact_info could contain an address. If it's already structured, we might skip.
    // For now we try to detect in the string.
    
    let found = false;
    
    if (muni) {
      const muniBarangays = BARANGAYS[muni];
      const searchString = (b.business_name + ' ' + (b.location || '') + ' ' + (JSON.stringify(b.contact_info) || '')).toLowerCase();
      
      for (const rawBrgy of muniBarangays) {
        const cleanBrgy = normalizeBrgy(rawBrgy).toLowerCase();
        // Use word boundaries for matching
        const regex = new RegExp(`\\b${cleanBrgy}\\b`);
        
        if (regex.test(searchString)) {
          found = true;
          matches.push({ name: b.business_name, muni: muni, matched: rawBrgy });
          break; // matched
        }
      }
    }
    
    if (found) withBarangay++;
    else withoutBarangay++;
  }
  
  console.log(`Total Businesses: ${data.length}`);
  console.log(`With detectable Barangay (Scoped correctly): ${withBarangay}`);
  console.log(`Without detectable Barangay: ${withoutBarangay}`);
  console.log('\nSample matches (first 25):');
  matches.slice(0, 25).forEach(m => {
    console.log(`- [${m.muni}] ${m.name} -> ${m.matched}`);
  });
})();
