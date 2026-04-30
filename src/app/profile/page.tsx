import type { Metadata } from 'next';
import { hreflangAlternates } from '@/utils/seo';
import UserProfileDashboard1 from '@/components/UserProfileDashboard1';

export const metadata: Metadata = {
    title: 'My Profile — Marinduque Market Hub',
    description: 'View and manage your Marinduque Market Hub profile, activity, listings, and account settings.',
    keywords: ['Marinduque profile', 'user account Marinduque', 'Marinduque Market Hub settings', 'my listings Marinduque', 'Marinduque account'],
    openGraph: {
        title: 'My Profile — Marinduque Market Hub',
        description: 'Manage your Marinduque Market Hub profile, activity, and settings.',
        url: 'https://marinduquemarket.com/profile',
    },
    alternates: hreflangAlternates('/profile'),
};

/**
 * User Profile Page
 * Pulls name, avatar, and role directly from Supabase profiles.
 */
export default function ProfilePage() {
    return <UserProfileDashboard1 />;
}
