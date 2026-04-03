import type { Metadata } from 'next';
import UserProfileDashboard1 from '@/components/UserProfileDashboard1';

export const metadata: Metadata = {
    title: 'My Profile',
    description: 'View and manage your Marinduque Market Hub profile, activity, and settings.',
};

/**
 * User Profile Page
 * Pulls name, avatar, and role directly from Supabase profiles.
 */
export default function ProfilePage() {
    return <UserProfileDashboard1 />;
}
