import { createClient } from '@/utils/supabase/server';
import BusinessDirectoryClient from '@/components/BusinessDirectoryClient';

export default async function BusinessDirectory() {
    const supabase = await createClient();

    // Fetch verified businesses first, then order alphabetically
    const { data: businesses, error } = await supabase
        .from('business_profiles')
        .select('id, business_name, business_type, location, is_verified, average_rating, review_count, gallery_image')
        .order('is_verified', { ascending: false })
        .order('business_name', { ascending: true });

    if (error) {
        const detail = (error as any).details || error.message || JSON.stringify(error, Object.getOwnPropertyNames(error));
        console.error('Directory error details:', detail);
        return <div className="p-8 text-center font-black text-moriones-red">Failed to load local directory. Please refresh.</div>;
    }

    return <BusinessDirectoryClient initialBusinesses={businesses || []} />;
}
