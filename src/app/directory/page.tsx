import { createClient } from '@/utils/supabase/server';
import BusinessDirectoryClient from '@/components/BusinessDirectoryClient';

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
        .select('id, business_name, business_type, location, is_verified, average_rating, review_count, gallery_image')
        .order('is_verified', { ascending: false })
        .order('business_name', { ascending: true });

    // Ensure general public only sees verified businesses
    if (!isAdmin) {
        query = query.eq('is_verified', true);
    }

    const { data: businesses, error } = await query;

    if (error) {
        const detail = (error as any).details || error.message || JSON.stringify(error, Object.getOwnPropertyNames(error));
        console.error('Directory error details:', detail);
        return <div className="p-8 text-center font-black text-moriones-red">Failed to load local directory. Please refresh.</div>;
    }

    return <BusinessDirectoryClient initialBusinesses={businesses || []} />;
}
