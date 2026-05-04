import { MARINDUQUE_BARANGAYS } from '@/data/marinduque-barangays';

/**
 * Attempts to extract the correct barangay from business text fields (name, location, contact info).
 * It scopes the search to the provided municipality to avoid cross-town collisions.
 * 
 * @param businessName The name of the business
 * @param locationStr The location string (e.g. "Boac", "Boac, Marinduque")
 * @param contactInfo Any contact info object or string that might contain an address
 * @returns The matched barangay string, or null if none found
 */
export function determineBarangay(businessName: string, locationStr: string | null, contactInfo: unknown): string | null {
  const locRaw = (locationStr || '').toLowerCase();
  
  // Determine municipality context
  let muni: string | null = null;
  if (locRaw.includes('boac')) muni = 'Boac';
  else if (locRaw.includes('gasan')) muni = 'Gasan';
  else if (locRaw.includes('mogpog')) muni = 'Mogpog';
  else if (locRaw.includes('sta. cruz') || locRaw.includes('santa cruz')) muni = 'Sta. Cruz';
  else if (locRaw.includes('torrijos')) muni = 'Torrijos';
  else if (locRaw.includes('buenavista')) muni = 'Buenavista';

  if (!muni) return null;

  const muniBarangays = MARINDUQUE_BARANGAYS[muni];
  if (!muniBarangays) return null;

  // Compile searchable string
  let contactStr = '';
  if (typeof contactInfo === 'string') {
    contactStr = contactInfo;
  } else if (contactInfo) {
    contactStr = JSON.stringify(contactInfo);
  }

  const searchString = `${businessName} ${locationStr || ''} ${contactStr}`.toLowerCase();
  const normalizeBrgy = (brgy: string) => brgy.replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase();

  for (const rawBrgy of muniBarangays) {
    const cleanBrgy = normalizeBrgy(rawBrgy);
    // Boundary match
    const regex = new RegExp(`\\b${cleanBrgy}\\b`);
    if (regex.test(searchString)) {
      return rawBrgy;
    }
  }

  return null;
}
