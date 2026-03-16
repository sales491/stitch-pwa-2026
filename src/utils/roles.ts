/**
 * ROLE MANAGEMENT SYSTEM (BRIDGE)
 * 
 * PRIMARY: Roles are now managed in the Supabase 'profiles' table.
 * FALLBACK: Hardcoded emails below are used as emergency backups.
 * 
 * HIERARCHY: super_admin > admin > moderator > user
 * - super_admin: Can manage all users including admins. Hardcoded for security.
 * - admin: Can manage all content and regular users.
 * - moderator: Can manage content but not users.
 */

const SUPER_ADMIN_EMAILS = [
    'mspeninv1@gmail.com', // M Spencer — platform owner
];

const ADMIN_EMAILS: string[] = [
    // Add hardcoded admin emails here if needed
];

const MODERATOR_EMAILS = [
    'mod@marinduqueconnect.com',
];

/** Super admin check — has full control including over other admins */
export function isSuperAdmin(email: string | undefined | null): boolean {
    if (!email) return false;
    return SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Check if an email is in the hardcoded emergency list.
 * Use useAdmin hook for Client Components instead.
 */
export function isAdmin(email: string | undefined | null): boolean {
    if (!email) return false;
    // Super admins have full admin access
    return SUPER_ADMIN_EMAILS.includes(email.toLowerCase()) || ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Check if an email is in the hardcoded emergency list.
 */
export function isModerator(email: string | undefined | null): boolean {
    if (!email) return false;
    return isAdmin(email) || MODERATOR_EMAILS.includes(email.toLowerCase());
}
