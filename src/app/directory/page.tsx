import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import BusinessDirectoryClient from '@/components/BusinessDirectoryClient';

export const metadata: Metadata = {
    title: 'Marinduque Business Directory',
    description: 'Find verified local businesses across Marinduque — restaurants, shops, services, accommodations, and more. Support local enterprises in Boac, Gasan, Mogpog, Santa Cruz, Torrijos, and Buenavista.',
    keywords: ['Marinduque business directory', 'local businesses Marinduque', 'shops Marinduque', 'restaurants Marinduque', 'services Marinduque Philippines'],
    openGraph: {
        title: 'Marinduque Business Directory',
        description: 'Discover and support verified local businesses across all of Marinduque island.',
        url: 'https://marinduquemarket.com/directory',
    },
    alternates: { canonical: 'https://marinduquemarket.com/directory' },
};

export default async function BusinessDirectory() {
    const supabase = await createClient();

    // 1. Get current user session to check role
    const { data: { session } } = await supabase.auth.getSession();
    let isAdmin = false;

    if (session?.user?.id) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        isAdmin = profile?.role === 'admin';
    }

    // 2. Fetch businesses based on role
    let query = supabase
        .from('business_profiles')
        .select('id, business_name, business_type, location, is_verified, average_rating, review_count, gallery_image, categories')
        .order('is_verified', { ascending: false })
        .order('business_name', { ascending: true });

    // Ensure general public only sees verified businesses
    if (!isAdmin) {
        if (session?.user?.id) {
            // Logged in users see verified + their own pending listings
            query = query.or(`is_verified.eq.true,owner_id.eq.${session.user.id}`);
        } else {
            // General public only sees verified
            query = query.eq('is_verified', true);
        }
    }

    const { data: businesses, error } = await query;

    if (error) {
        const detail = (error as any).details || error.message || JSON.stringify(error, Object.getOwnPropertyNames(error));
        console.error('Directory error details:', detail);
        return <div className="p-8 text-center font-black text-moriones-red">Failed to load local directory. Please refresh.</div>;
    }

    return <BusinessDirectoryClient initialBusinesses={businesses || []} />;
}
