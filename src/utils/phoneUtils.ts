/**
 * Formats a phone number for the Philippines.
 * If the number starts with '0', it replaces it with '+63'.
 * If the number doesn't have a prefix, it adds '+63'.
 * Removes all non-numeric characters before prefixing.
 */
export function formatPhPhoneForLink(phone: string): string {
    if (!phone) return '';

    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // If it starts with 63, just add the +
    if (cleaned.startsWith('63')) {
        return `+${cleaned}`;
    }

    // If it starts with 0, remove the 0 and add +63
    if (cleaned.startsWith('0')) {
        return `+63${cleaned.substring(1)}`;
    }

    // If it's just the 10-digit number (9xxxxxxxxx), add +63
    if (cleaned.length === 10 && cleaned.startsWith('9')) {
        return `+63${cleaned}`;
    }

    // Fallback: if it's already formatted or weird, just return with +63 if it doesn't have it
    if (cleaned.length > 0 && !cleaned.startsWith('63')) {
        return `+63${cleaned}`;
    }

    return `+${cleaned}`;
}

/**
 * Formats a phone number for display (e.g., 0912 345 6789)
 */
export function formatPhoneForDisplay(phone: string): string {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');

    // Normalize to 09...
    if (cleaned.startsWith('63')) {
        cleaned = '0' + cleaned.substring(2);
    } else if (!cleaned.startsWith('0') && cleaned.length === 10) {
        cleaned = '0' + cleaned;
    }

    if (cleaned.length === 11) {
        return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
    }

    return phone; // Return original if it doesn't match expected pattern
}
