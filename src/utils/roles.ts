/**
 * ROLE MANAGEMENT SYSTEM (BRIDGE)
 * 
 * PRIMARY: Roles are now managed in the Supabase 'profiles' table.
 * FALLBACK: Hardcoded emails below are used as emergency backups.
 */

const ADMIN_EMAILS = [
    'mspeninv1@gmail.com',
];

const MODERATOR_EMAILS = [
    'mod@marinduqueconnect.com',
];

/**
 * Check if an email is in the hardcoded emergency list.
 * Use useAdmin hook for Client Components instead.
 */
export function isAdmin(email: string | undefined | null): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Check if an email is in the hardcoded emergency list.
 */
export function isModerator(email: string | undefined | null): boolean {
    if (!email) return false;
    return isAdmin(email) || MODERATOR_EMAILS.includes(email.toLowerCase());
}
