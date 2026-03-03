/**
 * ROLE MANAGEMENT SYSTEM
 * 
 * 1. SUPER ADMINS (Hardcoded below): Have absolute access.
 * 2. DYNAMIC ROLES (Supabase 'profiles' table): Admins/Moderators set via Admin Dashboard.
 */

// Define super admin emails here
const ADMIN_EMAILS = [
    'mspeninv1@gmail.com',
];

// Fallback moderator list (Legacy)
const MODERATOR_EMAILS = [
    'mod@marinduqueconnect.com',
];

export function isAdmin(email: string | undefined | null): boolean {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function isModerator(email: string | undefined | null): boolean {
    if (!email) return false;
    return isAdmin(email) || MODERATOR_EMAILS.includes(email.toLowerCase());
}
